'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { coursesClient } from '@/lib/supabase-courses'
import { logger } from '@/utils/logger'
import { z } from 'zod'
import { getStaticMethodLevels, getStaticLevelBySlug, getStaticLevelById } from '@/lib/method-levels'
import { revalidatePath } from 'next/cache'

// ============================================
// COURSES ALWAYS USE PROD DB (even in local)
// ============================================
function createCoursesClient() {
	// Use PROD DB credentials for courses
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseKey = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

	return createClient(supabaseUrl, supabaseKey, {
		auth: { persistSession: false }
	})
}

// Validation schemas
const LevelIdSchema = z.number().int().positive('Level ID must be a positive integer')

const SlugSchema = z.string()
	.regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens')
	.min(1)
	.max(100)

const LanguageSchema = z.enum(['fr', 'ru', 'en', 'it'])

const CourseSlugParamsSchema = z.object({
	levelSlug: SlugSchema,
	courseSlug: SlugSchema,
	lang: LanguageSchema
})

const LessonSlugParamsSchema = z.object({
	courseSlug: SlugSchema,
	lessonSlug: SlugSchema,
	lang: LanguageSchema
})

const LessonIdSchema = z.number().int().positive('Lesson ID must be a positive integer')

const TimeSpentSchema = z.object({
	lessonId: LessonIdSchema,
	secondsSpent: z.number().int().min(0).max(86400, 'Time spent must be between 0 and 24 hours (86400 seconds)')
})

/**
 * Get all course levels (Beginner, Intermediate, Advanced)
 * Now returns static data instead of fetching from DB
 * @returns {Promise<Object>} Course levels data
 */
export async function getCourseLevels() {
	try {
		const data = getStaticMethodLevels()
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
		// Validate levelId
		const validLevelId = LevelIdSchema.parse(levelId)

		const supabase = createCoursesClient()
		const { data, error} = await supabase
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
			.eq('level_id', validLevelId)
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
		// Validate input parameters
		const validParams = CourseSlugParamsSchema.parse({ levelSlug, courseSlug, lang })

		const supabase = createCoursesClient()

		// Get level from static data
		const level = getStaticLevelBySlug(validParams.levelSlug)
		if (!level) {
			throw new Error(`Level not found: ${validParams.levelSlug}`)
		}

		// Query course without level join
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
			.eq('level_id', level.id)
			.eq('slug', validParams.courseSlug)
			.eq('lang', validParams.lang)
			.eq('is_published', true)
			.single()

		if (error) throw error

		// Map level data manually
		const courseWithLevel = {
			...data,
			course_levels: {
				id: level.id,
				slug: level.slug,
				name_fr: level.name_fr,
				name_ru: level.name_ru,
				name_en: level.name_en,
			},
		}

		// Sort lessons
		if (courseWithLevel.course_lessons) {
			courseWithLevel.course_lessons.sort((a, b) => a.order_index - b.order_index)
		}

		return { data: courseWithLevel, error: null }
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
		// Validate input parameters
		const validParams = LessonSlugParamsSchema.parse({ courseSlug, lessonSlug, lang })

		const supabase = createCoursesClient()

		// Query lesson with course (no level join)
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
					lang
				)
			`
			)
			.eq('courses.slug', validParams.courseSlug)
			.eq('courses.lang', validParams.lang)
			.eq('slug', validParams.lessonSlug)
			.eq('is_published', true)
			.single()

		if (error) throw error

		// Map level data from static levels
		if (data?.courses) {
			const level = getStaticLevelById(data.courses.level_id)
			data.courses.course_levels = level
				? {
						id: level.id,
						slug: level.slug,
						name_fr: level.name_fr,
						name_ru: level.name_ru,
						name_en: level.name_en,
						is_free: level.is_free,
				  }
				: null
		}

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
			.select('*')
			.eq('user_id', user.id)
			.eq('lang', lang)

		if (error) throw error

		// Map level data from static levels
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

		return { data: mappedData, error: null }
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
 * Uses direct upsert instead of RPC to avoid foreign key issues
 * (course_lessons data is in PROD DB while user_course_progress is in main DB)
 * @param {number} lessonId - Lesson ID
 * @returns {Promise<Object>} Success/error response
 */
export async function completeLesson(lessonId) {
	try {
		// Validate lessonId
		const validLessonId = LessonIdSchema.parse(lessonId)

		const supabase = createServerClient(await cookies())

		const {
			data: { user },
		} = await supabase.auth.getUser()
		if (!user) {
			return { success: false, error: 'User not authenticated' }
		}

		// Use direct upsert instead of RPC to avoid foreign key constraint issues
		// The lesson exists in PROD DB but user_course_progress is in main DB
		const { error } = await supabase
			.from('user_course_progress')
			.upsert(
				{
					user_id: user.id,
					lesson_id: validLessonId,
					is_completed: true,
					completed_at: new Date().toISOString(),
				},
				{
					onConflict: 'user_id,lesson_id',
				}
			)

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
		// Validate input parameters
		const validParams = TimeSpentSchema.parse({ lessonId, secondsSpent })

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
				lesson_id: validParams.lessonId,
				time_spent_seconds: validParams.secondsSpent,
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

/**
 * Migrate local progress from localStorage to database
 * Called after user login/signup
 * @param {Array} localProgress - Array of lesson progress objects
 * @returns {Promise<Object>} { success, migrated, error }
 */
export async function migrateLocalProgressAction(localProgress) {
	try {
		const supabase = createServerClient(await cookies())

		// Check authentication
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser()

		if (authError || !user) {
			throw new Error('Unauthorized')
		}

		if (!localProgress || !Array.isArray(localProgress)) {
			throw new Error('Invalid local progress data')
		}

		if (localProgress.length === 0) {
			return { success: true, migrated: 0, error: null }
		}

		// Prepare data for insertion
		const progressToInsert = localProgress.map((p) => ({
			user_id: user.id,
			lesson_id: p.lesson_id,
			is_completed: p.is_completed || false,
			completed_at: p.completed_at || null,
			time_spent_seconds: p.time_spent_seconds || 0,
		}))

		// Use upsert to avoid duplicates
		const { data, error } = await supabase
			.from('user_course_progress')
			.upsert(progressToInsert, {
				onConflict: 'user_id,lesson_id',
				ignoreDuplicates: false, // Update existing records
			})
			.select()

		if (error) {
			logger.error('Error migrating progress:', error)
			throw new Error('Failed to migrate progress')
		}

		logger.log(`✅ Migrated ${localProgress.length} lesson(s) progress for user ${user.id}`)

		return {
			success: true,
			migrated: localProgress.length,
			error: null,
		}
	} catch (error) {
		logger.error('Migration error:', error)
		return {
			success: false,
			migrated: 0,
			error: error.message,
		}
	}
}

// ============================================================================
// ADMIN FUNCTIONS - Course Management
// ============================================================================

/**
 * Helper: Require Admin Access
 */
async function requireAdmin() {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const { data: { user }, error: userError } = await supabase.auth.getUser()

	if (userError || !user) {
		throw new Error('Unauthorized: No user session')
	}

	// Check if user is admin
	const { data: profile, error: profileError } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	if (profileError || profile?.role !== 'admin') {
		throw new Error('Unauthorized: Admin access required')
	}

	return { user, supabase }
}

// Admin Validation Schemas
const CourseMetadataSchema = z.object({
	level_id: z.number().int().min(1).max(3),
	target_language: z.enum(['fr', 'ru']),
	slug: z.string().min(1),
	title_fr: z.string().min(1),
	title_ru: z.string().min(1),
	title_en: z.string().min(1),
	description_fr: z.string().optional(),
	description_ru: z.string().optional(),
	description_en: z.string().optional(),
	order_index: z.number().int().min(0),
	estimated_hours: z.number().int().positive().optional().nullable(),
	is_published: z.boolean(),
})

const LessonMetadataSchema = z.object({
	course_id: z.number().int().positive(),
	slug: z.string().min(1),
	title_fr: z.string().min(1),
	title_ru: z.string().min(1),
	title_en: z.string().min(1),
	order_index: z.number().int().min(0),
	estimated_minutes: z.number().int().positive().optional().nullable(),
	is_published: z.boolean(),
	is_free: z.boolean(),
})

const BlocksSchema = z.object({
	objectives_fr: z.array(z.string()),
	objectives_ru: z.array(z.string()),
	objectives_en: z.array(z.string()),
	blocks_fr: z.array(z.any()),
	blocks_ru: z.array(z.any()),
	blocks_en: z.array(z.any()),
})

/**
 * ADMIN: Get all courses with their lessons (no publication filter)
 */
export async function getAllCoursesWithLessons() {
	try {
		await requireAdmin()

		const { data, error } = await coursesClient
			.from('courses')
			.select(`
				*,
				course_lessons (
					id,
					slug,
					title_fr,
					title_ru,
					title_en,
					order_index,
					estimated_minutes,
					is_published,
					is_free
				)
			`)
			.order('level_id', { ascending: true })
			.order('order_index', { ascending: true })

		if (error) {
			logger.error('Error fetching courses:', error)
			return { success: false, error: error.message }
		}

		// Sort lessons within each course
		const coursesWithSortedLessons = data.map(course => ({
			...course,
			course_lessons: (course.course_lessons || [])
				.sort((a, b) => a.order_index - b.order_index)
		}))

		return { success: true, courses: coursesWithSortedLessons }
	} catch (error) {
		logger.error('Error in getAllCoursesWithLessons:', error)
		return { success: false, error: error.message }
	}
}

/**
 * ADMIN: Get a single course with its lessons
 */
export async function getCourseWithLessons(courseId) {
	try {
		await requireAdmin()

		const { data, error } = await coursesClient
			.from('courses')
			.select(`
				*,
				course_lessons (*)
			`)
			.eq('id', courseId)
			.single()

		if (error) {
			logger.error('Error fetching course:', error)
			return { success: false, error: error.message }
		}

		// Sort lessons by order_index
		if (data.course_lessons) {
			data.course_lessons.sort((a, b) => a.order_index - b.order_index)
		}

		return { success: true, course: data }
	} catch (error) {
		logger.error('Error in getCourseWithLessons:', error)
		return { success: false, error: error.message }
	}
}

/**
 * ADMIN: Get a lesson with its content from database
 */
export async function getLessonWithContent(lessonId, levelSlug, learningLang) {
	try {
		await requireAdmin()

		// Get lesson with all content from DB
		const { data: lesson, error } = await coursesClient
			.from('course_lessons')
			.select('*')
			.eq('id', lessonId)
			.single()

		if (error) {
			logger.error('Error fetching lesson:', error)
			return { success: false, error: error.message }
		}

		// Return lesson with content (already in DB columns)
		return {
			success: true,
			lesson: {
				...lesson,
				objectives_fr: lesson.objectives_fr || [],
				objectives_ru: lesson.objectives_ru || [],
				objectives_en: lesson.objectives_en || [],
				blocks_fr: lesson.blocks_fr || [],
				blocks_ru: lesson.blocks_ru || [],
				blocks_en: lesson.blocks_en || [],
			}
		}
	} catch (error) {
		logger.error('Error in getLessonWithContent:', error)
		return { success: false, error: error.message }
	}
}

/**
 * ADMIN: Update course metadata in database
 */
export async function updateCourse(courseId, courseData) {
	try {
		await requireAdmin()

		const validated = CourseMetadataSchema.parse(courseData)

		const { data, error } = await coursesClient
			.from('courses')
			.update(validated)
			.eq('id', courseId)
			.select()
			.single()

		if (error) {
			logger.error('Error updating course:', error)
			return { success: false, error: error.message }
		}

		revalidatePath('/method')
		revalidatePath('/admin/courses')

		return { success: true, course: data }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { success: false, error: 'Validation error', details: error.errors }
		}
		logger.error('Error in updateCourse:', error)
		return { success: false, error: error.message }
	}
}

/**
 * ADMIN: Update lesson metadata in database
 */
export async function updateLessonMetadata(lessonId, metadataData) {
	try {
		await requireAdmin()

		const validated = LessonMetadataSchema.parse(metadataData)

		const { data, error } = await coursesClient
			.from('course_lessons')
			.update(validated)
			.eq('id', lessonId)
			.select()
			.single()

		if (error) {
			logger.error('Error updating lesson metadata:', error)
			return { success: false, error: error.message }
		}

		revalidatePath('/method')
		revalidatePath('/admin/courses')

		return { success: true, lesson: data }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { success: false, error: 'Validation error', details: error.errors }
		}
		logger.error('Error in updateLessonMetadata:', error)
		return { success: false, error: error.message }
	}
}

/**
 * ADMIN: Update lesson content in database
 */
export async function updateLessonContent(lessonSlug, levelSlug, learningLang, contentData) {
	try {
		await requireAdmin()

		const validated = BlocksSchema.parse(contentData)

		// Update lesson content directly in DB
		const { data, error } = await coursesClient
			.from('course_lessons')
			.update({
				objectives_fr: validated.objectives_fr,
				objectives_ru: validated.objectives_ru,
				objectives_en: validated.objectives_en,
				blocks_fr: validated.blocks_fr,
				blocks_ru: validated.blocks_ru,
				blocks_en: validated.blocks_en,
			})
			.eq('slug', lessonSlug)
			.select()
			.single()

		if (error) {
			logger.error('Error updating lesson content:', error)
			return { success: false, error: error.message }
		}

		revalidatePath('/method')
		revalidatePath('/admin/courses')

		return { success: true, lesson: data }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { success: false, error: 'Validation error', details: error.errors }
		}
		logger.error('Error in updateLessonContent:', error)
		return { success: false, error: error.message }
	}
}

/**
 * ADMIN: Toggle course publication status
 */
export async function toggleCoursePublication(courseId, isPublished) {
	try {
		await requireAdmin()

		const { data, error } = await coursesClient
			.from('courses')
			.update({ is_published: isPublished })
			.eq('id', courseId)
			.select()
			.single()

		if (error) {
			logger.error('Error toggling course publication:', error)
			return { success: false, error: error.message }
		}

		revalidatePath('/method')
		revalidatePath('/admin/courses')

		return { success: true, course: data }
	} catch (error) {
		logger.error('Error in toggleCoursePublication:', error)
		return { success: false, error: error.message }
	}
}

/**
 * ADMIN: Toggle lesson publication status
 */
export async function toggleLessonPublication(lessonId, isPublished) {
	try {
		await requireAdmin()

		const { data, error } = await coursesClient
			.from('course_lessons')
			.update({ is_published: isPublished })
			.eq('id', lessonId)
			.select()
			.single()

		if (error) {
			logger.error('Error toggling lesson publication:', error)
			return { success: false, error: error.message }
		}

		revalidatePath('/method')
		revalidatePath('/admin/courses')

		return { success: true, lesson: data }
	} catch (error) {
		logger.error('Error in toggleLessonPublication:', error)
		return { success: false, error: error.message }
	}
}

/**
 * ADMIN: Reorder lessons in a course
 */
export async function reorderLessons(courseId, lessonOrderUpdates) {
	try {
		await requireAdmin()

		// lessonOrderUpdates: [{ id, order_index }, ...]
		const updates = await Promise.all(
			lessonOrderUpdates.map(({ id, order_index }) =>
				coursesClient
					.from('course_lessons')
					.update({ order_index })
					.eq('id', id)
					.eq('course_id', courseId)
			)
		)

		const hasError = updates.some(u => u.error)
		if (hasError) {
			logger.error('Error reordering lessons')
			return { success: false, error: 'Failed to reorder lessons' }
		}

		revalidatePath('/method')
		revalidatePath('/admin/courses')

		return { success: true }
	} catch (error) {
		logger.error('Error in reorderLessons:', error)
		return { success: false, error: error.message }
	}
}
