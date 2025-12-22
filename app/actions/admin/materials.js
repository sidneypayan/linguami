'use server'

import { createClient } from '@supabase/supabase-js'

// Use LOCAL DB credentials for materials (not PROD)
function createMaterialsClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

	return createClient(supabaseUrl, supabaseKey, {
		auth: { persistSession: false }
	})
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
