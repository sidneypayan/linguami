'use server'

import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { logger } from '@/utils/logger'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schemas
const LessonIdSchema = z.number().int().positive('Lesson ID must be a positive integer')
const LanguageSchema = z.enum(['fr', 'ru', 'en', 'it'])

/**
 * Mark a lesson as studied (or create entry if doesn't exist)
 * @param {number} lessonId - The lesson ID to mark as studied
 * @returns {Object} { success: boolean, error: string | null }
 */
export async function markLessonAsStudied(lessonId) {
	// Validate lessonId
	const validLessonId = LessonIdSchema.parse(lessonId)
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
		// First, check if a record already exists
		const { data: existingRecord, error: selectError } = await supabase
			.from('user_lessons')
			.select('is_studied')
			.match({ user_id: user.id, lesson_id: validLessonId })
			.single()

		if (selectError && selectError.code !== 'PGRST116') {
			// PGRST116 = no rows returned, which is expected for new lessons
			logger.error('Error checking existing lesson status:', selectError)
			return {
				success: false,
				error: selectError.message,
			}
		}

		if (existingRecord) {
			// Record exists - update if not already studied
			if (!existingRecord.is_studied) {
				const { error: updateError } = await supabase
					.from('user_lessons')
					.update({ is_studied: true })
					.match({ user_id: user.id, lesson_id: validLessonId })

				if (updateError) {
					logger.error('Error updating lesson status:', updateError)
					return {
						success: false,
						error: updateError.message,
					}
				}
			}
			// If already studied, do nothing
		} else {
			// Record doesn't exist - insert new record
			const { error: insertError } = await supabase
				.from('user_lessons')
				.insert({
					user_id: user.id,
					lesson_id: validLessonId,
					is_studied: true,
				})

			if (insertError) {
				logger.error('Error inserting lesson status:', insertError)
				return {
					success: false,
					error: insertError.message,
				}
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
	// Validate lessonId
	const validLessonId = LessonIdSchema.parse(lessonId)

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
			.match({ user_id: user.id, lesson_id: validLessonId })

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

/**
 * Check if there are any lessons available for a specific language
 * @param {string} lang - Language code ('fr', 'ru', 'en')
 * @returns {Promise<boolean>} True if lessons exist for this language
 */
export async function hasLessonsForLanguage(lang) {
	// Validate language
	const validLang = LanguageSchema.parse(lang)

	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	try {
		const { count, error } = await supabase
			.from('lessons')
			.select('id', { count: 'exact', head: true })
			.eq('lang', validLang)

		if (error) {
			logger.error('Error checking lessons availability:', error)
			return false
		}

		return count > 0
	} catch (error) {
		logger.error('Unexpected error in hasLessonsForLanguage:', error)
		return false
	}
}
