'use server'

import { createClient } from '@supabase/supabase-js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

// Use LOCAL DB credentials for materials (not PROD)
function createMaterialsClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

	return createClient(supabaseUrl, supabaseKey, {
		auth: { persistSession: false }
	})
}

// R2 Configuration
const R2_CONFIG = {
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	region: 'auto',
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	},
}

const s3Client = new S3Client(R2_CONFIG)

/**
 * Upload file to R2 storage
 */
async function uploadToR2(path, buffer, contentType) {
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
		console.error('R2 upload error:', error)
		throw new Error(`Failed to upload to R2: ${error.message}`)
	}
}

/**
 * Optimize image using Sharp
 */
async function optimizeImage(buffer, originalFileName) {
	try {
		const timestamp = Date.now()
		const baseName = originalFileName.replace(/\.[^.]+$/, '')
		const mainFileName = `${baseName}-${timestamp}.webp`
		const thumbFileName = `${baseName}-${timestamp}-thumb.webp`

		// Main image (max 1200px width)
		const mainBuffer = await sharp(buffer)
			.resize(1200, null, {
				withoutEnlargement: true,
				fit: 'inside',
			})
			.webp({ quality: 85 })
			.toBuffer()

		// Thumbnail (300px width)
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
		console.error('Image optimization error:', error)
		throw new Error(`Failed to optimize image: ${error.message}`)
	}
}

/**
 * Get all materials with exercise counts
 */
export async function getAllMaterials() {
	const supabase = createMaterialsClient()

	// Get all materials
	const { data: materials, error } = await supabase
		.from('materials')
		.select('*')
		.order('id', { ascending: false })

	if (error) {
		console.error('Error fetching materials:', error)
		throw new Error('Failed to fetch materials')
	}

	// Get exercise counts for each material
	const { data: exerciseCounts, error: countError } = await supabase
		.from('exercises')
		.select('material_id')
		.not('material_id', 'is', null)

	if (countError) {
		console.error('Error fetching exercise counts:', countError)
		// Continue without exercise counts
		return materials
	}

	// Count exercises per material
	const counts = exerciseCounts.reduce((acc, ex) => {
		acc[ex.material_id] = (acc[ex.material_id] || 0) + 1
		return acc
	}, {})

	// Add exercise_count to each material
	return materials.map(material => ({
		...material,
		exercise_count: counts[material.id] || 0
	}))
}

/**
 * Get a single material by ID
 */
export async function getMaterialById(id) {
	const supabase = createMaterialsClient()

	const { data, error } = await supabase
		.from('materials')
		.select('*')
		.eq('id', id)
		.single()

	if (error) {
		console.error('Error fetching material:', error)
		throw new Error('Failed to fetch material')
	}

	return data
}

/**
 * Update a material
 */
export async function updateMaterial(id, updates) {
	const supabase = createMaterialsClient()

	const { data, error } = await supabase
		.from('materials')
		.update(updates)
		.eq('id', id)
		.select()
		.single()

	if (error) {
		console.error('Error updating material:', error)
		throw new Error('Failed to update material')
	}

	return data
}

/**
 * Update a material with file uploads
 */
export async function updateMaterialWithFiles(id, updates, filesData = []) {
	try {
		const supabase = createMaterialsClient()

		// Process uploaded files
		const uploadedFiles = {
			image: null,
			audio: null,
		}

		for (const fileData of filesData) {
			const { fileName, fileType, base64Data } = fileData
			const buffer = Buffer.from(base64Data, 'base64')

			if (fileType === 'image') {
				// Optimize and upload image
				const optimized = await optimizeImage(buffer, fileName)

				await uploadToR2(
					`images/materials/${optimized.main.fileName}`,
					optimized.main.buffer,
					'image/webp'
				)

				await uploadToR2(
					`images/materials/thumbnails/${optimized.thumbnail.fileName}`,
					optimized.thumbnail.buffer,
					'image/webp'
				)

				uploadedFiles.image = optimized.main.fileName

			} else if (fileType === 'audio') {
				const lang = updates.lang || 'fr'
				const audioPath = `audios/${lang}/${fileName}`

				await uploadToR2(audioPath, buffer, 'audio/mpeg')
				uploadedFiles.audio = fileName
			}
		}

		// Merge uploaded files with updates
		const finalUpdates = {
			...updates,
			...(uploadedFiles.image && { image_filename: uploadedFiles.image }),
			...(uploadedFiles.audio && { audio_filename: uploadedFiles.audio }),
		}

		// Update in database
		const { data, error } = await supabase
			.from('materials')
			.update(finalUpdates)
			.eq('id', id)
			.select()
			.single()

		if (error) {
			console.error('Error updating material:', error)
			throw new Error('Failed to update material')
		}

		return data
	} catch (error) {
		console.error('Error updating material with files:', error)
		throw error
	}
}

/**
 * Get exercises for a material
 */
export async function getMaterialExercises(materialId) {
	const supabase = createMaterialsClient()

	const { data, error } = await supabase
		.from('exercises')
		.select('*')
		.eq('material_id', materialId)
		.order('created_at', { ascending: true })

	if (error) {
		console.error('Error fetching material exercises:', error)
		throw new Error('Failed to fetch material exercises')
	}

	return data || []
}

/**
 * Delete an exercise
 */
export async function deleteExercise(exerciseId) {
	const supabase = createMaterialsClient()

	const { error } = await supabase
		.from('exercises')
		.delete()
		.eq('id', exerciseId)

	if (error) {
		console.error('Error deleting exercise:', error)
		throw new Error('Failed to delete exercise')
	}

	return { success: true }
}
