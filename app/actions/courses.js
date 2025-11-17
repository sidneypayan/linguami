'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'

/**
 * Get all course levels (Beginner, Intermediate, Advanced)
 * @returns {Promise<Array>} Array of course levels
 */
export async function getCourseLevels() {
	try {
		const supabase = createServerClient(await cookies())
		const { data, error } = await supabase
			.from('course_levels')
			.select('*')
			.order('order_index', { ascending: true })

		if (error) throw error
		return { data, error: null }
	} catch (error) {
		logger.error('Error fetching course levels:', error)
		return { data: null, error: error.message }
	}
}

/**
 * Get all courses for a specific level
 * @param {number} levelId - ID of the level
 * @returns {Promise<Object>} Courses with their lessons
 */
export async function getCoursesByLevel(levelId) {
	try {
		const supabase = createServerClient(await cookies())
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
					is_published,
					is_free
				)
			`
			)
			.eq('level_id', levelId)
			.eq('is_published', true)
			.order('order_index', { ascending: true })

		if (error) throw error

		// Sort lessons for each course
		const coursesWithSortedLessons = data.map((course) => ({
			...course,
			course_lessons: course.course_lessons
				? course.course_lessons.sort((a, b) => a.order_index - b.order_index)
				: [],
		}))

		return { data: coursesWithSortedLessons, error: null }
	} catch (error) {
		logger.error('Error fetching courses by level:', error)
		return { data: null, error: error.message }
	}
}

/**
 * Get a specific course by slug with all its lessons
 * Optimized: Single query with joins instead of 2 separate queries
 * @param {Object} params
 * @param {string} params.levelSlug - Level slug
 * @param {string} params.courseSlug - Course slug
 * @param {string} params.lang - Language (fr, ru, en)
 * @returns {Promise<Object>} Course with lessons and level info
 */
export async function getCourseBySlug({ levelSlug, courseSlug, lang }) {
	try {
		const supabase = createServerClient(await cookies())

		// Optimized: Single query with joins
		const { data, error } = await supabase
			.from('courses')
			.select(
				`
				*,
				course_levels!inner (
					id,
					slug,
					name_fr,
					name_ru,
					name_en
				),
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
					is_published,
					is_free
				)
			`
			)
			.eq('course_levels.slug', levelSlug)
			.eq('slug', courseSlug)
			.eq('lang', lang)
			.eq('is_published', true)
			.single()

		if (error) throw error

		// Sort lessons
		if (data?.course_lessons) {
			data.course_lessons.sort((a, b) => a.order_index - b.order_index)
		}

		return { data, error: null }
	} catch (error) {
		logger.error('Error fetching course by slug:', error)
		return { data: null, error: error.message }
	}
}

/**
 * Get a specific lesson by slug with full course and level info
 * Optimized: Single query with nested joins
 * @param {Object} params
 * @param {string} params.courseSlug - Course slug
 * @param {string} params.lessonSlug - Lesson slug
 * @param {string} params.lang - Language (fr, ru, en)
 * @returns {Promise<Object>} Lesson with course and level info
 */
export async function getLessonBySlug({ courseSlug, lessonSlug, lang }) {
	try {
		const supabase = createServerClient(await cookies())

		// Optimized: Single query with nested joins
		const { data, error } = await supabase
			.from('course_lessons')
			.select(
				`
				*,
				courses!inner (
					id,
					slug,
					title_fr,
					title_ru,
					title_en,
					level_id,
					lang,
					course_levels (
						id,
						slug,
						name_fr,
						name_ru,
						name_en,
						is_free
					)
				)
			`
			)
			.eq('courses.slug', courseSlug)
			.eq('courses.lang', lang)
			.eq('slug', lessonSlug)
			.eq('is_published', true)
			.single()

		if (error) throw error
		return { data, error: null }
	} catch (error) {
		logger.error('Error fetching lesson by slug:', error)
		return { data: null, error: error.message }
	}
}

/**
 * Get user access to course levels
 * @param {string} lang - Language (fr, ru, en)
 * @returns {Promise<Object>} User access data
 */
export async function getUserCourseAccess(lang) {
	try {
		const supabase = createServerClient(await cookies())

		// Check if user is authenticated
		const {
			data: { user },
		} = await supabase.auth.getUser()
		if (!user) return { data: [], error: null }

		const { data, error } = await supabase
			.from('user_course_access')
			.select(
				`
				*,
				course_levels (
					id,
					slug,
					name_fr,
					name_ru,
					name_en
				)
			`
			)
			.eq('user_id', user.id)
			.eq('lang', lang)

		if (error) throw error
		return { data: data || [], error: null }
	} catch (error) {
		logger.error('Error fetching user course access:', error)
		return { data: [], error: error.message }
	}
}

/**
 * Get user progress for a specific course
 * @param {number} courseId - Course ID
 * @returns {Promise<Object>} User progress data
 */
export async function getUserProgressForCourse(courseId) {
	try {
		const supabase = createServerClient(await cookies())

		const {
			data: { user },
		} = await supabase.auth.getUser()
		if (!user) return { data: [], error: null }

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

		if (error) throw error
		return { data: data || [], error: null }
	} catch (error) {
		logger.error('Error fetching user progress:', error)
		return { data: [], error: error.message }
	}
}

/**
 * Get user progress for a specific lesson
 * @param {number} lessonId - Lesson ID
 * @returns {Promise<Object>} User progress for the lesson
 */
export async function getLessonProgress(lessonId) {
	try {
		const supabase = createServerClient(await cookies())

		const {
			data: { user },
		} = await supabase.auth.getUser()
		if (!user) return { data: null, error: null }

		const { data, error } = await supabase
			.from('user_course_progress')
			.select('*')
			.eq('user_id', user.id)
			.eq('lesson_id', lessonId)
			.maybeSingle()

		if (error) throw error
		return { data, error: null }
	} catch (error) {
		logger.error('Error fetching lesson progress:', error)
		return { data: null, error: error.message }
	}
}

/**
 * Mark a lesson as completed
 * Uses PostgreSQL RPC function for atomic operation
 * @param {number} lessonId - Lesson ID
 * @returns {Promise<Object>} Success/error response
 */
export async function completeLesson(lessonId) {
	try {
		const supabase = createServerClient(await cookies())

		const {
			data: { user },
		} = await supabase.auth.getUser()
		if (!user) {
			return { success: false, error: 'User not authenticated' }
		}

		// Use PostgreSQL RPC function for atomic operation
		const { error } = await supabase.rpc('complete_course_lesson', {
			p_user_id: user.id,
			p_lesson_id: lessonId,
		})

		if (error) throw error

		return { success: true, error: null }
	} catch (error) {
		logger.error('Error completing lesson:', error)
		return { success: false, error: error.message }
	}
}

/**
 * Update time spent on a lesson
 * @param {Object} params
 * @param {number} params.lessonId - Lesson ID
 * @param {number} params.secondsSpent - Seconds spent on lesson
 * @returns {Promise<Object>} Success/error response
 */
export async function updateLessonTimeSpent({ lessonId, secondsSpent }) {
	try {
		const supabase = createServerClient(await cookies())

		const {
			data: { user },
		} = await supabase.auth.getUser()
		if (!user) {
			return { success: false, error: 'User not authenticated' }
		}

		const { error } = await supabase.from('user_course_progress').upsert(
			{
				user_id: user.id,
				lesson_id: lessonId,
				time_spent_seconds: secondsSpent,
				last_visited_at: new Date().toISOString(),
			},
			{
				onConflict: 'user_id,lesson_id',
			}
		)

		if (error) throw error

		return { success: true, error: null }
	} catch (error) {
		logger.error('Error updating lesson time:', error)
		return { success: false, error: error.message }
	}
}
