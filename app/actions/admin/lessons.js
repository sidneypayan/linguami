'use server'

import { createClient } from '@supabase/supabase-js'

// Use PROD DB credentials for lessons (same as courses)
function createLessonsClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseKey = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

	return createClient(supabaseUrl, supabaseKey, {
		auth: { persistSession: false }
	})
}

/**
 * Get all standalone lessons with exercise counts
 */
export async function getAllStandaloneLessons() {
	const supabase = createLessonsClient()

	// Get all lessons
	const { data: lessons, error } = await supabase
		.from('lessons')
		.select('*')
		.order('id', { ascending: true })

	if (error) {
		console.error('Error fetching standalone lessons:', error)
		throw new Error('Failed to fetch standalone lessons')
	}

	// Get exercise counts for each lesson
	const { data: exerciseCounts, error: countError } = await supabase
		.from('exercises')
		.select('parent_id')
		.eq('parent_type', 'lesson')

	if (countError) {
		console.error('Error fetching exercise counts:', countError)
		// Continue without exercise counts
		return lessons
	}

	// Count exercises per lesson
	const counts = exerciseCounts.reduce((acc, ex) => {
		acc[ex.parent_id] = (acc[ex.parent_id] || 0) + 1
		return acc
	}, {})

	// Add exercise_count to each lesson
	return lessons.map(lesson => ({
		...lesson,
		exercise_count: counts[lesson.id] || 0
	}))
}

/**
 * Get a single standalone lesson by ID
 */
export async function getStandaloneLessonById(id) {
	const supabase = createLessonsClient()

	const { data, error } = await supabase
		.from('lessons')
		.select('*')
		.eq('id', id)
		.single()

	if (error) {
		console.error('Error fetching standalone lesson:', error)
		throw new Error('Failed to fetch standalone lesson')
	}

	return data
}

/**
 * Update a standalone lesson
 */
export async function updateStandaloneLesson(id, updates) {
	const supabase = createLessonsClient()

	const { data, error } = await supabase
		.from('lessons')
		.update(updates)
		.eq('id', id)
		.select()
		.single()

	if (error) {
		console.error('Error updating standalone lesson:', error)
		throw new Error('Failed to update standalone lesson')
	}

	return data
}

/**
 * Get exercises for a standalone lesson
 */
export async function getLessonExercises(lessonId) {
	const supabase = createLessonsClient()

	const { data, error } = await supabase
		.from('exercises')
		.select('*')
		.eq('parent_type', 'lesson')
		.eq('parent_id', lessonId)
		.order('created_at', { ascending: true })

	if (error) {
		console.error('Error fetching lesson exercises:', error)
		throw new Error('Failed to fetch lesson exercises')
	}

	return data || []
}

/**
 * Delete an exercise
 */
export async function deleteExercise(exerciseId) {
	const supabase = createLessonsClient()

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
