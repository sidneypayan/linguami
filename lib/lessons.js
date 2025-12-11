import 'server-only'
import { createServerClient } from '@/lib/supabase-server'
import { coursesClient } from '@/lib/supabase-courses'
import { getStandaloneLessonFromJSON, standaloneLessonExistsInJSON } from '@/lib/lessons-loader'
import { cookies } from 'next/headers'
import { logger } from '@/utils/logger'

/**
 * Get all lessons for a specific target language
 * @param {string} targetLanguage - Target language code ('fr' or 'ru') - what the user is learning
 * @param {string} spokenLanguage - Spoken language code ('fr', 'ru', 'en') - user's native language for explanations
 *
 * Note: Uses coursesClient (PROD DB) for metadata, JSON files for content
 */
export async function getLessons(targetLanguage, spokenLanguage = 'en') {
	// Get lesson metadata from PROD DB
	const { data: lessonsMetadata, error } = await coursesClient
		.from('lessons')
		.select('id, slug, title_fr, title_ru, title_en, level, order, target_language')
		.eq('target_language', targetLanguage)
		.order('order', { ascending: true })

	if (error) {
		logger.error('Error fetching lessons metadata:', error)
		return []
	}

	// Load content from JSON files and merge with metadata
	const lessons = lessonsMetadata.map(metadata => {
		const jsonExists = standaloneLessonExistsInJSON(targetLanguage, metadata.level, metadata.slug)

		if (jsonExists) {
			const jsonLesson = getStandaloneLessonFromJSON(targetLanguage, metadata.level, metadata.slug)

			if (jsonLesson) {
				// Select the appropriate blocks based on spoken language
				const blocksKey = `blocks_${spokenLanguage}`
				const blocks = jsonLesson[blocksKey] || jsonLesson.blocks_en || []

				// Merge JSON content with DB metadata
				return {
					...metadata,
					blocks,
					estimatedReadTime: jsonLesson.estimatedReadTime,
					keywords: jsonLesson.keywords,
					relatedMethodLessons: jsonLesson.relatedMethodLessons,
				}
			}
		}

		// Fallback: Return metadata only (no content)
		console.log(`[getLessons] ⚠️ No JSON file for lesson: ${metadata.slug}`)
		return {
			...metadata,
			blocks: [], // Empty blocks if JSON not found
		}
	})

	return lessons
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
