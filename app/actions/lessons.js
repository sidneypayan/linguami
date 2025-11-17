'use server'

import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { logger } from '@/utils/logger'
import { revalidatePath } from 'next/cache'

/**
 * Mark a lesson as studied (or create entry if doesn't exist)
 * @param {number} lessonId - The lesson ID to mark as studied
 * @returns {Object} { success: boolean, error: string | null }
 */
export async function markLessonAsStudied(lessonId) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Get authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return {
			success: false,
			error: 'Not authenticated',
		}
	}

	try {
		// Use UPSERT for atomic operation (1 query instead of 2-3)
		// PostgreSQL will automatically insert or update based on unique constraint
		const { error } = await supabase.from('user_lessons').upsert(
			{
				user_id: user.id,
				lesson_id: lessonId,
				is_studied: true,
			},
			{
				onConflict: 'user_id,lesson_id', // Specify the unique constraint
			}
		)

		if (error) {
			logger.error('Error upserting lesson status:', error)
			return {
				success: false,
				error: error.message,
			}
		}

		// Revalidate the lessons page to update the UI
		revalidatePath('/lessons')

		return {
			success: true,
			error: null,
		}
	} catch (error) {
		logger.error('Unexpected error in markLessonAsStudied:', error)
		return {
			success: false,
			error: error.message,
		}
	}
}

/**
 * Get user's status for a specific lesson
 * @param {number} lessonId - The lesson ID
 * @returns {Object} { is_studied: boolean } | { error: string }
 */
export async function getLessonStatus(lessonId) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Get authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		// Return default status for non-authenticated users
		return { is_studied: false }
	}

	try {
		const { data, error } = await supabase
			.from('user_lessons')
			.select('is_studied')
			.match({ user_id: user.id, lesson_id: lessonId })

		if (error) {
			logger.error('Error fetching lesson status:', error)
			return { error: error.message }
		}

		if (data && data[0]) {
			return data[0]
		}

		return { is_studied: false }
	} catch (error) {
		logger.error('Unexpected error in getLessonStatus:', error)
		return { error: error.message }
	}
}

/**
 * Get all lesson statuses for the authenticated user
 * @returns {Array} Array of { lesson_id, is_studied } objects
 */
export async function getAllLessonStatuses() {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Get authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return []
	}

	try {
		const { data, error } = await supabase
			.from('user_lessons')
			.select('lesson_id, is_studied')
			.eq('user_id', user.id)

		if (error) {
			logger.error('Error fetching all lesson statuses:', error)
			return []
		}

		return data || []
	} catch (error) {
		logger.error('Unexpected error in getAllLessonStatuses:', error)
		return []
	}
}
