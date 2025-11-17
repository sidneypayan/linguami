import 'server-only'
import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { logger } from '@/utils/logger'

/**
 * Get all lessons for a specific language
 * @param {string} lang - Language code ('fr', 'ru', 'en')
 */
export async function getLessons(lang) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const { data, error } = await supabase
		.from('lessons')
		.select('*')
		.eq('lang', lang)
		.order('order', { ascending: true })

	if (error) {
		logger.error('Error fetching lessons:', error)
		return []
	}

	return data || []
}

/**
 * Get user's status for all lessons
 */
export async function getUserLessonsStatus() {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return []
	}

	const { data, error } = await supabase
		.from('user_lessons')
		.select('lesson_id, is_studied')
		.eq('user_id', user.id)

	if (error) {
		logger.error('Error fetching user lessons status:', error)
		return []
	}

	return data || []
}

/**
 * Get user's status for a specific lesson
 * @param {number} lessonId - Lesson ID
 */
export async function getUserLessonStatus(lessonId) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { is_studied: false }
	}

	const { data, error } = await supabase
		.from('user_lessons')
		.select('is_studied')
		.match({ user_id: user.id, lesson_id: lessonId })

	if (error) {
		logger.error('Error fetching user lesson status:', error)
		return { is_studied: false }
	}

	if (data && data[0]) {
		return data[0]
	}

	return { is_studied: false }
}
