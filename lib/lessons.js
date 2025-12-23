import 'server-only'
import { createServerClient } from '@/lib/supabase-server'
import { coursesClient } from '@/lib/supabase-courses'
import { cookies } from 'next/headers'
import { logger } from '@/utils/logger'

/**
 * Get all lessons for a specific target language
 * @param {string} targetLanguage - Target language code ('fr' or 'ru') - what the user is learning
 * @param {string} spokenLanguage - Spoken language code ('fr', 'ru', 'en') - user's native language for explanations
 *
 * Note: Uses coursesClient (PROD DB) for both metadata and content
 */
export async function getLessons(targetLanguage, spokenLanguage = 'en') {
	// Don't show lessons if user is learning their native language
	if (targetLanguage === spokenLanguage) {
		logger.info(`Skipping lessons: target language (${targetLanguage}) matches spoken language (${spokenLanguage})`)
		return []
	}

	// Get lessons from PROD DB with all content
	const { data: lessons, error } = await coursesClient
		.from('lessons')
		.select('id, slug, title_fr, title_ru, title_en, level, order, target_language, blocks_fr, blocks_en, blocks_ru, difficulty, estimated_read_time, keywords, status')
		.eq('target_language', targetLanguage)
		.eq('status', 'published') // Only published lessons
		.order('order', { ascending: true })

	if (error) {
		logger.error('Error fetching lessons:', error)
		return []
	}

	// Map lessons to include the appropriate blocks based on spoken language
	const lessonsWithBlocks = lessons.map(lesson => {
		// Select the appropriate blocks based on spoken language
		const blocksKey = `blocks_${spokenLanguage}`
		const blocks = lesson[blocksKey] || lesson.blocks_en || []

		return {
			id: lesson.id,
			slug: lesson.slug,
			title_fr: lesson.title_fr,
			title_ru: lesson.title_ru,
			title_en: lesson.title_en,
			level: lesson.level,
			order: lesson.order,
			target_language: lesson.target_language,
			blocks,
			estimatedReadTime: lesson.estimated_read_time,
			difficulty: lesson.difficulty,
			keywords: lesson.keywords || [],
		}
	})

	return lessonsWithBlocks
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
