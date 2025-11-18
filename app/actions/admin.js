'use server'

import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { logger } from '@/utils/logger'
import { z } from 'zod'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

/**
 * Server Actions for Admin operations
 * Optimized with validation, security, and proper error handling
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const R2_CONFIG = {
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	region: 'auto',
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	},
}

const s3Client = new S3Client(R2_CONFIG)

// ============================================================================
// VALIDATION SCHEMAS (avec Zod pour robustesse)
// ============================================================================

const MaterialSchema = z.object({
	lang: z.enum(['fr', 'ru', 'en']),
	section: z.string().min(1),
	level: z.enum(['beginner', 'intermediate', 'advanced']),
	title: z.string().min(1).max(200),
	content: z.string().optional(),
	content_accented: z.string().optional(),
	image_filename: z.string().optional(),
	audio_filename: z.string().optional(),
	video_url: z.string().url().optional().or(z.literal('')),
	book_id: z.number().int().positive().optional().nullable(),
	chapter_number: z.number().int().positive().optional().nullable(),
})

const FileUploadSchema = z.object({
	fileName: z.string().min(1),
	fileType: z.enum(['image', 'audio']),
	base64Data: z.string(), // Base64 encoded file data
})

// ============================================================================
// HELPER: Vérifier si l'utilisateur est admin
// ============================================================================

async function requireAdmin() {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const { data: { user }, error: userError } = await supabase.auth.getUser()

	if (userError || !user) {
		throw new Error('Unauthorized: No user session')
	}

	// Récupérer le profil pour vérifier le rôle
	const { data: profile, error: profileError } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	if (profileError || profile?.role !== 'admin') {
		throw new Error('Unauthorized: Admin access required')
	}

	return { user, supabase }
}

// ============================================================================
// HELPER: Upload vers R2 (côté serveur)
// ============================================================================

async function uploadToR2Server(path, buffer, contentType) {
	try {
		const command = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME,
			Key: path,
			Body: buffer,
			ContentType: contentType,
		})

		await s3Client.send(command)

		return {
			success: true,
			path,
			url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${path}`,
		}
	} catch (error) {
		logger.error('R2 upload error:', error)
		throw new Error(`Failed to upload to R2: ${error.message}`)
	}
}

// ============================================================================
// HELPER: Optimiser image côté serveur (avec Sharp)
// ============================================================================

async function optimizeImageServer(buffer, originalFileName) {
	try {
		// Générer noms de fichiers uniques
		const timestamp = Date.now()
		const baseName = originalFileName.replace(/\.[^.]+$/, '')
		const mainFileName = `${baseName}-${timestamp}.webp`
		const thumbFileName = `${baseName}-${timestamp}-thumb.webp`

		// Optimiser image principale (max 1200px width)
		const mainBuffer = await sharp(buffer)
			.resize(1200, null, {
				withoutEnlargement: true,
				fit: 'inside',
			})
			.webp({ quality: 85 })
			.toBuffer()

		// Créer thumbnail (300px width)
		const thumbBuffer = await sharp(buffer)
			.resize(300, null, {
				withoutEnlargement: true,
				fit: 'inside',
			})
			.webp({ quality: 80 })
			.toBuffer()

		return {
			main: { fileName: mainFileName, buffer: mainBuffer },
			thumbnail: { fileName: thumbFileName, buffer: thumbBuffer },
		}
	} catch (error) {
		logger.error('Image optimization error:', error)
		throw new Error(`Failed to optimize image: ${error.message}`)
	}
}

// ============================================================================
// ACTION: Créer un nouveau material
// ============================================================================

export async function createMaterial(materialData, filesData = []) {
	try {
		// 1. Vérifier que l'utilisateur est admin
		const { supabase } = await requireAdmin()

		// 2. Valider les données du material
		const validatedData = MaterialSchema.parse(materialData)

		// 3. Valider les fichiers (si présents)
		const validatedFiles = filesData.map(file => FileUploadSchema.parse(file))

		// 4. Traiter les fichiers AVANT l'insert (pour avoir les noms finaux)
		const uploadedFiles = {
			image: null,
			audio: null,
		}

		for (const fileData of validatedFiles) {
			const { fileName, fileType, base64Data } = fileData
			const buffer = Buffer.from(base64Data, 'base64')

			if (fileType === 'image') {
				// Optimiser l'image côté serveur
				const optimized = await optimizeImageServer(buffer, fileName)

				// Upload vers R2
				await uploadToR2Server(
					`images/materials/${optimized.main.fileName}`,
					optimized.main.buffer,
					'image/webp'
				)

				await uploadToR2Server(
					`images/materials/thumbnails/${optimized.thumbnail.fileName}`,
					optimized.thumbnail.buffer,
					'image/webp'
				)

				uploadedFiles.image = optimized.main.fileName

			} else if (fileType === 'audio') {
				const lang = validatedData.lang || 'fr'
				const audioPath = `audios/${lang}/${fileName}`

				await uploadToR2Server(audioPath, buffer, 'audio/mpeg')
				uploadedFiles.audio = fileName
			}
		}

		// 5. Préparer les données finales avec les noms de fichiers uploadés
		const finalData = {
			...validatedData,
			...(uploadedFiles.image && { image_filename: uploadedFiles.image }),
			...(uploadedFiles.audio && { audio_filename: uploadedFiles.audio }),
		}

		// 6. Insérer dans Supabase
		const { data: material, error } = await supabase
			.from('materials')
			.insert(finalData)
			.select()
			.single()

		if (error) {
			logger.error('Supabase insert error:', error)
			throw new Error(`Database error: ${error.message}`)
		}

		// 7. Revalider les caches
		revalidatePath('/materials')
		revalidatePath(`/materials/${validatedData.section}`)
		revalidatePath('/admin')

		logger.info('Material created successfully:', material.id)

		return {
			success: true,
			material,
		}

	} catch (error) {
		logger.error('Create material error:', error)

		// Retourner une erreur structurée
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: 'Validation error',
				details: error.errors,
			}
		}

		return {
			success: false,
			error: error.message || 'Failed to create material',
		}
	}
}

// ============================================================================
// ACTION: Mettre à jour un material existant
// ============================================================================

export async function updateMaterial(materialId, materialData, filesData = []) {
	try {
		// 1. Vérifier que l'utilisateur est admin
		const { supabase } = await requireAdmin()

		// 2. Vérifier que le material existe
		const { data: existingMaterial, error: fetchError } = await supabase
			.from('materials')
			.select('*')
			.eq('id', materialId)
			.single()

		if (fetchError || !existingMaterial) {
			throw new Error('Material not found')
		}

		// 3. Valider les nouvelles données
		const validatedData = MaterialSchema.partial().parse(materialData)

		// 4. Traiter les nouveaux fichiers (si présents)
		const uploadedFiles = {}

		for (const fileData of filesData) {
			const { fileName, fileType, base64Data } = FileUploadSchema.parse(fileData)
			const buffer = Buffer.from(base64Data, 'base64')

			if (fileType === 'image') {
				const optimized = await optimizeImageServer(buffer, fileName)

				await uploadToR2Server(
					`images/materials/${optimized.main.fileName}`,
					optimized.main.buffer,
					'image/webp'
				)

				await uploadToR2Server(
					`images/materials/thumbnails/${optimized.thumbnail.fileName}`,
					optimized.thumbnail.buffer,
					'image/webp'
				)

				uploadedFiles.image_filename = optimized.main.fileName

			} else if (fileType === 'audio') {
				const lang = validatedData.lang || existingMaterial.lang || 'fr'
				const audioPath = `audios/${lang}/${fileName}`

				await uploadToR2Server(audioPath, buffer, 'audio/mpeg')
				uploadedFiles.audio_filename = fileName
			}
		}

		// 5. Fusionner les données
		const finalData = {
			...validatedData,
			...uploadedFiles,
		}

		// 6. Mettre à jour dans Supabase
		const { data: material, error } = await supabase
			.from('materials')
			.update(finalData)
			.eq('id', materialId)
			.select()
			.single()

		if (error) {
			logger.error('Supabase update error:', error)
			throw new Error(`Database error: ${error.message}`)
		}

		// 7. Revalider les caches
		revalidatePath('/materials')
		revalidatePath(`/materials/${material.section}`)
		revalidatePath(`/materials/${material.section}/${material.id}`)
		revalidatePath('/admin')

		logger.info('Material updated successfully:', material.id)

		return {
			success: true,
			material,
		}

	} catch (error) {
		logger.error('Update material error:', error)

		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: 'Validation error',
				details: error.errors,
			}
		}

		return {
			success: false,
			error: error.message || 'Failed to update material',
		}
	}
}

// ============================================================================
// ACTION: Supprimer un material
// ============================================================================

export async function deleteMaterial(materialId) {
	try {
		// 1. Vérifier que l'utilisateur est admin
		const { supabase } = await requireAdmin()

		// 2. Récupérer le material pour revalidation
		const { data: material } = await supabase
			.from('materials')
			.select('section')
			.eq('id', materialId)
			.single()

		// 3. Supprimer (RLS policies géreront la sécurité)
		const { error } = await supabase
			.from('materials')
			.delete()
			.eq('id', materialId)

		if (error) {
			logger.error('Delete material error:', error)
			throw new Error(`Database error: ${error.message}`)
		}

		// 4. Revalider les caches
		if (material?.section) {
			revalidatePath(`/materials/${material.section}`)
		}
		revalidatePath('/materials')
		revalidatePath('/admin')

		logger.info('Material deleted successfully:', materialId)

		return { success: true }

	} catch (error) {
		logger.error('Delete material error:', error)
		return {
			success: false,
			error: error.message || 'Failed to delete material',
		}
	}
}

// ============================================================================
// ACTION: Récupérer un material pour édition (admin uniquement)
// ============================================================================

export async function getMaterialForEdit(materialId) {
	try {
		const { supabase } = await requireAdmin()

		const { data: material, error } = await supabase
			.from('materials')
			.select('*')
			.eq('id', materialId)
			.single()

		if (error) {
			throw new Error(`Material not found: ${error.message}`)
		}

		return {
			success: true,
			material,
		}

	} catch (error) {
		logger.error('Get material for edit error:', error)
		return {
			success: false,
			error: error.message || 'Failed to fetch material',
		}
	}
}
