import 'server-only'
import { createServerClient, supabaseServer } from '@/lib/supabase-server'
import { createMethodServerClient } from '@/lib/supabase-method-server'
import { cookies } from 'next/headers'
import { logger } from '@/utils/logger'
import { getStaticLevelBySlug } from '@/lib/method-levels'

/**
 * Get all course levels (Débutant, Intermédiaire, Avancé)
 * @deprecated Use getStaticMethodLevels() from '@/lib/method-levels' instead
 */
export async function getMethodLevels() {
	// This function is deprecated - levels are now static
	// Import { getStaticMethodLevels } from '@/lib/method-levels'
	const { getStaticMethodLevels } = await import('@/lib/method-levels')
	return getStaticMethodLevels()
}

/**
 * Get courses and lessons for a specific level
 * @param {number} levelId - Level ID
 */
export async function getLevelCourses(levelId) {
	const cookieStore = await cookies()
	const supabase = createMethodServerClient(cookieStore)

	const { data, error } = await supabase
		.from('courses')
		.select(
			`
			*,
			course_lessons (
				id,
				slug,
				title_fr,
				title_ru,
				title_en,
				order_index,
				estimated_minutes,
				objectives,
				objectives_fr,
				objectives_ru,
				objectives_en,
				blocks,
				blocks_fr,
				blocks_ru,
				blocks_en,
				is_published,
				is_free
			)
		`
		)
		.eq('level_id', levelId)
		.eq('is_published', true)
		.order('order_index', { ascending: true })

	if (error) {
		logger.error('Error fetching courses:', error)
		console.log('[getLevelCourses] ERROR:', error)
		return []
	}

	console.log('[getLevelCourses] levelId:', levelId)
	console.log('[getLevelCourses] raw courses:', data?.length, data?.map(c => ({ id: c.id, target: c.target_language, lessons: c.course_lessons?.length })))

	// Sort lessons within each course and filter only published ones
	const coursesWithSortedLessons = (data || []).map((course) => ({
		...course,
		course_lessons: (course.course_lessons || [])
			.filter((lesson) => lesson.is_published)
			.sort((a, b) => a.order_index - b.order_index),
	}))

	console.log('[getLevelCourses] filtered courses:', coursesWithSortedLessons?.map(c => ({ id: c.id, target: c.target_language, lessons: c.course_lessons?.length })))

	return coursesWithSortedLessons
}

/**
 * Get a specific lesson by level slug, lesson slug, and learning language
 * @param {string} levelSlug - Level slug (e.g., 'debutant')
 * @param {string} lessonSlug - Lesson slug
 * @param {string} learningLang - Learning language ('fr' or 'ru')
 */
export async function getLessonData(levelSlug, lessonSlug, learningLang) {
	const cookieStore = await cookies()
	const supabase = createMethodServerClient(cookieStore)

	// Get level from static data
	const level = getStaticLevelBySlug(levelSlug)

	if (!level) {
		logger.error('Level not found:', levelSlug)
		return null
	}

	// Then, find the course for this level and language
	const { data: course, error: courseError } = await supabase
		.from('courses')
		.select(
			`
			id,
			slug,
			title_fr,
			title_ru,
			title_en,
			level_id,
			lang,
			target_language,
			estimated_hours,
			course_lessons (
				id,
				slug,
				title_fr,
				title_ru,
				title_en,
				order_index,
				estimated_minutes,
				objectives,
				objectives_fr,
				objectives_ru,
				objectives_en,
				blocks,
				blocks_fr,
				blocks_ru,
				blocks_en,
				is_published,
				is_free
			)
		`
		)
		.eq('level_id', level.id)
		.eq('target_language', learningLang)
		.eq('is_published', true)
		.single()

	if (courseError || !course) {
		logger.error('Error fetching course:', courseError)
		return null
	}

	// Find the specific lesson
	const lesson = (course.course_lessons || []).find((l) => l.slug === lessonSlug)

	if (!lesson) {
		logger.error('Lesson not found')
		return null
	}

	// Sort lessons for navigation
	const sortedLessons = (course.course_lessons || []).sort((a, b) => a.order_index - b.order_index)

	return {
		level,
		course: {
			...course,
			course_lessons: sortedLessons,
		},
		lesson,
	}
}

/**
 * Check if user has access to a specific level
 * @param {number} levelId - Level ID
 * @param {string} lang - Language ('fr' or 'ru')
 */
export async function checkUserLevelAccess(levelId, lang) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Check if user is authenticated
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { hasAccess: false, isPremium: false }
	}

	// Check if level is free (from static data)
	const { getStaticLevelById } = await import('@/lib/method-levels')
	const level = getStaticLevelById(levelId)

	if (level?.is_free) {
		return { hasAccess: true, isPremium: false }
	}

	// Check user's access to this level
	const { data: access } = await supabase
		.from('user_course_access')
		.select('*')
		.eq('user_id', user.id)
		.eq('level_id', levelId)
		.eq('lang', lang)
		.single()

	// Check if user is premium
	const { data: profile } = await supabase
		.from('users_profile')
		.select('is_premium')
		.eq('id', user.id)
		.single()

	return {
		hasAccess: !!access || profile?.is_premium || false,
		isPremium: profile?.is_premium || false,
	}
}

/**
 * Get user's progress for a specific course
 * @param {number} courseId - Course ID
 */
export async function getUserCourseProgress(courseId) {
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
		.from('user_course_progress')
		.select(
			`
			*,
			course_lessons!inner (
				id,
				course_id
			)
		`
		)
		.eq('user_id', user.id)
		.eq('course_lessons.course_id', courseId)

	if (error) {
		logger.error('Error fetching progress:', error)
		return []
	}

	return data || []
}

/**
 * Get all user access for a specific language
 * @param {string} lang - Language ('fr' or 'ru')
 */
export async function getUserAccess(lang) {
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
		.from('user_course_access')
		.select('*')
		.eq('user_id', user.id)
		.eq('lang', lang)

	if (error) {
		logger.error('Error fetching user access:', error)
		return []
	}

	// Map level data from static levels
	const { getStaticLevelById } = await import('@/lib/method-levels')
	const mappedData = (data || []).map((access) => {
		const level = getStaticLevelById(access.level_id)
		return {
			...access,
			course_levels: level
				? {
						id: level.id,
						slug: level.slug,
						name_fr: level.name_fr,
						name_ru: level.name_ru,
						name_en: level.name_en,
				  }
				: null,
		}
	})

	return mappedData
}
