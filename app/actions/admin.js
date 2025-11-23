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

// ============================================================================
// ACTION: Récupérer tous les utilisateurs (admin uniquement)
// ============================================================================

export async function getUsers() {
	try {
		// 1. Vérifier que l'utilisateur est admin
		await requireAdmin()

		// 2. Créer un client Supabase avec service role pour accéder à tous les utilisateurs
		const { createClient } = await import('@supabase/supabase-js')

		if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
			throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')
		}

		const supabaseAdmin = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.SUPABASE_SERVICE_ROLE_KEY,
			{
				auth: {
					autoRefreshToken: false,
					persistSession: false,
				},
			}
		)

		// 3. Récupérer les profils utilisateurs
		const { data: usersProfile, error: usersError } = await supabaseAdmin
			.from('users_profile')
			.select(`
				id,
				name,
				email,
				role,
				is_premium,
				spoken_language,
				language_level,
				avatar_id,
				created_at
			`)
			.order('created_at', { ascending: false })

		if (usersError) {
			logger.error('Error fetching users:', usersError)
			throw new Error('Failed to fetch users')
		}

		// 4. Récupérer les profils XP
		const { data: xpProfiles, error: xpError } = await supabaseAdmin
			.from('user_xp_profile')
			.select('user_id, total_xp, current_level')

		const xpMap = {}
		if (!xpError && xpProfiles) {
			xpProfiles.forEach(xp => {
				xpMap[xp.user_id] = {
					total_xp: xp.total_xp,
					current_level: xp.current_level,
				}
			})
		}

		// 5. Combiner les données
		const users = usersProfile.map(user => ({
			...user,
			total_xp: xpMap[user.id]?.total_xp || 0,
			current_level: xpMap[user.id]?.current_level || 1,
		}))

		return {
			success: true,
			users,
		}

	} catch (error) {
		logger.error('Get users error:', error)
		return {
			success: false,
			error: error.message || 'Failed to fetch users',
		}
	}
}

// ============================================================================
// ACTION: Vérifier les liens vidéo cassés (admin uniquement)
// ============================================================================

export async function checkBrokenVideos() {
	try {
		// 1. Vérifier que l'utilisateur est admin
		const { supabase } = await requireAdmin()

		// 2. Récupérer tous les matériels avec vidéo
		const { data: materials, error } = await supabase
			.from('materials')
			.select('id, title, section, lang, video_url')
			.not('video_url', 'is', null)
			.order('id', { ascending: false })

		if (error) {
			logger.error('Error fetching materials:', error)
			throw new Error('Failed to fetch materials')
		}

		// 3. Filtrer pour ne garder que les matériels avec une vraie URL vidéo
		const materialsWithVideo = materials.filter(m => {
			if (!m.video_url) return false
			const trimmed = m.video_url.trim()
			return trimmed.length > 0 && (trimmed.startsWith('http://') || trimmed.startsWith('https://'))
		})

		// 4. Vérifier chaque lien vidéo avec limite de concurrence
		const BATCH_SIZE = 5
		const checkedVideos = []

		for (let i = 0; i < materialsWithVideo.length; i += BATCH_SIZE) {
			const batch = materialsWithVideo.slice(i, i + BATCH_SIZE)
			const batchResults = await Promise.allSettled(
				batch.map(async (material) => {
					try {
						const status = await checkVideoLink(material.video_url)
						return {
							...material,
							status,
						}
					} catch (error) {
						logger.error(`Error checking video ${material.id}:`, error)
						return {
							...material,
							status: 'error',
						}
					}
				})
			)

			batchResults.forEach(result => {
				if (result.status === 'fulfilled') {
					checkedVideos.push(result.value)
				}
			})
		}

		// 5. Filtrer pour ne garder que les liens cassés
		const brokenVideos = checkedVideos.filter(v => v.status === 'broken')

		return {
			success: true,
			brokenVideos,
			totalVideos: materialsWithVideo.length,
			checked: checkedVideos.length,
		}

	} catch (error) {
		logger.error('Check broken videos error:', error)
		return {
			success: false,
			error: error.message || 'Failed to check videos',
		}
	}
}

// ============================================================================
// HELPER: Vérifier un lien vidéo
// ============================================================================

async function checkVideoLink(url) {
	if (!url) return 'broken'

	try {
		// YouTube
		if (url.includes('youtube.com') || url.includes('youtu.be')) {
			const videoId = extractYouTubeId(url)
			if (!videoId) return 'broken'

			// Méthode 1: Vérifier avec l'API oEmbed (rapide)
			try {
				const controller = new AbortController()
				const timeoutId = setTimeout(() => controller.abort(), 5000)

				const oembedResponse = await fetch(
					`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
					{ method: 'GET', signal: controller.signal }
				)

				clearTimeout(timeoutId)

				if (!oembedResponse.ok) {
					return 'broken'
				}
			} catch (error) {
				return 'broken'
			}

			// Méthode 2: Vérifier la page embed
			const embedController = new AbortController()
			const embedTimeoutId = setTimeout(() => embedController.abort(), 10000)

			const embedResponse = await fetch(
				`https://www.youtube.com/embed/${videoId}`,
				{
					method: 'GET',
					signal: embedController.signal,
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
					},
				}
			)

			clearTimeout(embedTimeoutId)

			if (!embedResponse.ok) return 'broken'

			const html = await embedResponse.text()

			// Chercher les données JSON embarquées
			const playabilityMatch = html.match(/"playabilityStatus":\s*\{[^}]+\}/)
			if (playabilityMatch) {
				try {
					const jsonStr = playabilityMatch[0].replace('"playabilityStatus":', '')
					const playabilityStatus = JSON.parse(jsonStr)

					if (
						playabilityStatus.status === 'ERROR' ||
						playabilityStatus.status === 'UNPLAYABLE' ||
						playabilityStatus.status === 'LOGIN_REQUIRED' ||
						playabilityStatus.status === 'CONTENT_CHECK_REQUIRED'
					) {
						return 'broken'
					}
				} catch (e) {
					logger.error('Error parsing playabilityStatus:', e.message)
				}
			}

			// Indicateurs de vidéo indisponible
			if (
				html.includes('Video unavailable') ||
				html.includes('This video is unavailable') ||
				html.includes('This video isn\'t available') ||
				html.includes('This video has been removed') ||
				html.includes('Private video') ||
				html.includes('has been blocked') ||
				html.includes('This video contains content') ||
				html.includes('who has blocked it') ||
				html.includes('copyright grounds') ||
				html.includes('blocked it in your country') ||
				html.includes('"status":"ERROR"') ||
				html.includes('"status":"UNPLAYABLE"') ||
				html.includes('"status":"LOGIN_REQUIRED"') ||
				html.includes('"reason":"Video unavailable"') ||
				html.includes('CONTENT_NOT_AVAILABLE') ||
				html.includes('playback on other websites has been disabled') ||
				html.includes('errorScreen') || // Détecte l'erreur 153 (embedding désactivé)
				html.includes('"isEmbeddingAllowed":false') || // Embedding explicitement désactivé
				(html.includes('"isUnlisted":true') && html.includes('"isPrivate":true'))
			) {
				return 'broken'
			}

			return 'working'
		}

		// Odysee
		if (url.includes('odysee.com')) {
			const controller = new AbortController()
			const timeoutId = setTimeout(() => controller.abort(), 10000)

			const response = await fetch(url, {
				method: 'GET',
				signal: controller.signal,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
				},
			})

			clearTimeout(timeoutId)

			if (!response.ok) return 'broken'

			const html = await response.text()

			// Vérifier différents indicateurs de vidéo cassée/indisponible
			if (
				html.includes('not found') ||
				html.includes('404') ||
				html.includes('Content not found') ||
				html.includes('This content is unavailable') ||
				html.includes('does not exist') ||
				html.includes('has been removed') ||
				html.includes('No stream available') ||
				html.includes('404_NOT_FOUND') ||
				html.includes('CONTENT_NOT_FOUND') ||
				html.includes('"error"') && html.includes('"NOT_FOUND"')
			) {
				return 'broken'
			}

			return 'working'
		}

		// Rutube
		if (url.includes('rutube.ru')) {
			const controller = new AbortController()
			const timeoutId = setTimeout(() => controller.abort(), 10000)

			const response = await fetch(url, {
				method: 'GET',
				signal: controller.signal,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
				},
			})

			clearTimeout(timeoutId)

			if (!response.ok) return 'broken'

			const html = await response.text()
			if (html.includes('Видео не найдено') || html.includes('404')) {
				return 'broken'
			}

			return 'working'
		}

		// Autres liens
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 10000)

		const response = await fetch(url, {
			method: 'HEAD',
			signal: controller.signal,
		})

		clearTimeout(timeoutId)
		return response.ok ? 'working' : 'broken'
	} catch (error) {
		logger.error(`Error checking ${url}:`, error.message)
		return 'broken'
	}
}

function extractYouTubeId(url) {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/youtube\.com\/watch\?.*v=([^&\n?#]+)/,
	]

	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match && match[1]) return match[1]
	}

	return null
}

// ============================================================================
// ACTION: Mettre à jour l'URL vidéo d'un material (admin uniquement)
// ============================================================================

export async function updateMaterialVideo(materialId, videoUrl) {
	try {
		// 1. Vérifier que l'utilisateur est admin
		const { supabase } = await requireAdmin()

		// 2. Valider les paramètres
		if (!materialId || videoUrl === undefined) {
			throw new Error('Material ID and video URL are required')
		}

		// 3. Mettre à jour le lien vidéo
		const { data: material, error } = await supabase
			.from('materials')
			.update({ video_url: videoUrl })
			.eq('id', materialId)
			.select()
			.single()

		if (error) {
			logger.error('Error updating video:', error)
			throw new Error(`Database error: ${error.message}`)
		}

		// 4. Revalider les caches
		revalidatePath('/materials')
		revalidatePath(`/materials/${material.section}`)
		revalidatePath(`/materials/${material.section}/${material.id}`)
		revalidatePath('/admin')

		logger.info('Material video updated successfully:', materialId)

		return {
			success: true,
			material,
		}

	} catch (error) {
		logger.error('Update material video error:', error)
		return {
			success: false,
			error: error.message || 'Failed to update video',
		}
	}
}
