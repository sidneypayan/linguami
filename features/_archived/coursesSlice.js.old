import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createBrowserClient } from '@/lib/supabase'
import {
	getLocalProgress,
	completeLocalLesson,
	isLessonCompletedLocally,
	getLocalLessonProgress,
} from '@/utils/localCourseProgress'

const initialState = {
	// Niveaux (débutant, intermédiaire, avancé)
	levels: [],
	levels_loading: false,
	levels_error: null,

	// Cours d'un niveau spécifique
	courses: [],
	courses_loading: false,
	courses_error: null,

	// Cours actuel (avec ses leçons)
	currentCourse: null,
	currentCourse_loading: false,
	currentCourse_error: null,

	// Leçon actuelle
	currentLesson: null,
	currentLesson_loading: false,
	currentLesson_error: null,

	// Accès utilisateur (quels niveaux achetés)
	userAccess: [],
	userAccess_loading: false,
	userAccess_error: null,

	// Progression utilisateur
	userProgress: [],
	userProgress_loading: false,
	userProgress_error: null,

	// Stats globales
	stats: {
		totalLessonsCompleted: 0,
		totalTimeSpent: 0,
		currentStreak: 0,
	},
}

// ============================================
// ASYNC THUNKS
// ============================================

/**
 * Récupérer tous les niveaux (débutant, intermédiaire, avancé)
 */
export const getLevels = createAsyncThunk('courses/getLevels', async (_, { rejectWithValue }) => {
	try {
		const supabase = createBrowserClient()
		const { data, error } = await supabase
			.from('course_levels')
			.select('*')
			.order('order_index', { ascending: true })

		if (error) throw error
		return data
	} catch (error) {
		return rejectWithValue(error.message)
	}
})

/**
 * Récupérer tous les cours d'un niveau
 * @param {Object} params
 * @param {number} params.levelId - ID du niveau
 */
export const getCoursesByLevel = createAsyncThunk(
	'courses/getCoursesByLevel',
	async ({ levelId }, { rejectWithValue }) => {
		try {
			const supabase = createBrowserClient()
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

			if (error) throw error

			// Trier les leçons de chaque cours
			const coursesWithSortedLessons = data.map((course) => ({
				...course,
				course_lessons: course.course_lessons.sort((a, b) => a.order_index - b.order_index),
			}))

			return coursesWithSortedLessons
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

/**
 * Récupérer une leçon spécifique avec son contenu complet
 * @param {number} lessonId - ID de la leçon
 */
export const getLesson = createAsyncThunk(
	'courses/getLesson',
	async (lessonId, { rejectWithValue }) => {
		try {
			const supabase = createBrowserClient()
			const { data, error } = await supabase
				.from('course_lessons')
				.select(
					`
					*,
					courses (
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
							name_en
						)
					)
				`
				)
				.eq('id', lessonId)
				.eq('is_published', true)
				.single()

			if (error) throw error
			return data
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

/**
 * Récupérer une leçon par slug (courseSlug + lessonSlug + lang)
 * @param {Object} params
 * @param {string} params.courseSlug - Slug du cours
 * @param {string} params.lessonSlug - Slug de la leçon
 * @param {string} params.lang - Langue ('fr' ou 'ru')
 */
export const getLessonBySlug = createAsyncThunk(
	'courses/getLessonBySlug',
	async ({ courseSlug, lessonSlug, lang }, { rejectWithValue }) => {
		try {
			const supabase = createBrowserClient()

			// D'abord, trouver le cours
			const { data: course, error: courseError } = await supabase
				.from('courses')
				.select('id')
				.eq('slug', courseSlug)
				.eq('lang', lang)
				.eq('is_published', true)
				.single()

			if (courseError) throw courseError
			if (!course) throw new Error('Cours non trouvé')

			// Ensuite, trouver la leçon
			const { data, error } = await supabase
				.from('course_lessons')
				.select(
					`
					*,
					courses (
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
							name_en
						)
					)
				`
				)
				.eq('course_id', course.id)
				.eq('slug', lessonSlug)
				.eq('is_published', true)
				.single()

			if (error) throw error
			return data
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

/**
 * Récupérer un cours spécifique par slug avec ses leçons
 * @param {Object} params
 * @param {string} params.levelSlug - Slug du niveau
 * @param {string} params.courseSlug - Slug du cours
 * @param {string} params.lang - Langue ('fr' ou 'ru')
 */
export const getCourseBySlug = createAsyncThunk(
	'courses/getCourseBySlug',
	async ({ levelSlug, courseSlug, lang }, { rejectWithValue }) => {
		try {
			const supabase = createBrowserClient()

			// D'abord, trouver le niveau
			const { data: level, error: levelError } = await supabase
				.from('course_levels')
				.select('id')
				.eq('slug', levelSlug)
				.single()

			if (levelError) throw levelError
			if (!level) throw new Error('Niveau non trouvé')

			// Ensuite, trouver le cours avec ses leçons
			const { data, error } = await supabase
				.from('courses')
				.select(
					`
					*,
					course_levels (
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
						is_published
					)
				`
				)
				.eq('level_id', level.id)
				.eq('slug', courseSlug)
				.eq('lang', lang)
				.eq('is_published', true)
				.single()

			if (error) throw error

			// Trier les leçons
			if (data.course_lessons) {
				data.course_lessons.sort((a, b) => a.order_index - b.order_index)
			}

			return data
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

/**
 * Vérifier l'accès utilisateur à tous les niveaux
 * @param {string} lang - Langue ('fr' ou 'ru')
 */
export const getUserAccess = createAsyncThunk(
	'courses/getUserAccess',
	async (lang, { rejectWithValue }) => {
		try {
			const supabase = createBrowserClient()

			// Vérifier si l'utilisateur est connecté
			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (!user) return []

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
			return data || []
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

/**
 * Récupérer la progression de l'utilisateur pour un cours spécifique
 * @param {number} courseId - ID du cours
 */
export const getUserProgressForCourse = createAsyncThunk(
	'courses/getUserProgressForCourse',
	async (courseId, { rejectWithValue }) => {
		try {
			const supabase = createBrowserClient()

			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (!user) return []

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
			return data || []
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

/**
 * Marquer une leçon comme complétée
 * @param {number} lessonId - ID de la leçon
 */
export const completeCourseLesson = createAsyncThunk(
	'courses/completeCourseLesson',
	async (lessonId, { rejectWithValue }) => {
		try {
			const supabase = createBrowserClient()

			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (!user) throw new Error('User not authenticated')

			// Utiliser la fonction PostgreSQL
			const { error } = await supabase.rpc('complete_course_lesson', {
				p_user_id: user.id,
				p_lesson_id: lessonId,
			})

			if (error) throw error

			// Retourner le lessonId pour update local
			return lessonId
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

/**
 * Mettre à jour le temps passé sur une leçon
 * @param {Object} params
 * @param {number} params.lessonId
 * @param {number} params.secondsSpent
 */
export const updateLessonTimeSpent = createAsyncThunk(
	'courses/updateLessonTimeSpent',
	async ({ lessonId, secondsSpent }, { rejectWithValue }) => {
		try {
			const supabase = createBrowserClient()

			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (!user) throw new Error('User not authenticated')

			const { error } = await supabase
				.from('user_course_progress')
				.upsert(
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

			return { lessonId, secondsSpent }
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

// ============================================
// SLICE
// ============================================

const coursesSlice = createSlice({
	name: 'courses',
	initialState,
	reducers: {
		// Reset current lesson
		resetCurrentLesson: (state) => {
			state.currentLesson = null
			state.currentLesson_error = null
		},

		// Reset current course
		resetCurrentCourse: (state) => {
			state.currentCourse = null
			state.currentCourse_error = null
		},

		// Reset courses
		resetCourses: (state) => {
			state.courses = []
			state.courses_error = null
		},

		// Update local progress (optimistic update)
		updateLocalProgress: (state, action) => {
			const { lessonId, isCompleted } = action.payload
			const existing = state.userProgress.find((p) => p.lesson_id === lessonId)

			if (existing) {
				existing.is_completed = isCompleted
				existing.completed_at = isCompleted ? new Date().toISOString() : null
			} else {
				state.userProgress.push({
					lesson_id: lessonId,
					is_completed: isCompleted,
					completed_at: isCompleted ? new Date().toISOString() : null,
				})
			}
		},

		// Load local progress from localStorage (for non-authenticated users)
		loadLocalProgress: (state) => {
			const localProgress = getLocalProgress()
			state.userProgress = localProgress
		},

		// Complete lesson locally (for non-authenticated users)
		completeLocalLessonAction: (state, action) => {
			const lessonId = action.payload
			const updatedProgress = completeLocalLesson(lessonId)

			// Update Redux state
			const existing = state.userProgress.find((p) => p.lesson_id === lessonId)

			if (existing) {
				existing.is_completed = true
				existing.completed_at = new Date().toISOString()
			} else {
				state.userProgress.push({
					lesson_id: lessonId,
					is_completed: true,
					completed_at: new Date().toISOString(),
					time_spent_seconds: 0,
				})
			}

			// Update stats
			state.stats.totalLessonsCompleted += 1
		},
	},
	extraReducers: (builder) => {
		// Get Levels
		builder
			.addCase(getLevels.pending, (state) => {
				state.levels_loading = true
				state.levels_error = null
			})
			.addCase(getLevels.fulfilled, (state, action) => {
				state.levels_loading = false
				state.levels = action.payload
			})
			.addCase(getLevels.rejected, (state, action) => {
				state.levels_loading = false
				state.levels_error = action.payload
			})

		// Get Courses by Level
		builder
			.addCase(getCoursesByLevel.pending, (state) => {
				state.courses_loading = true
				state.courses_error = null
			})
			.addCase(getCoursesByLevel.fulfilled, (state, action) => {
				state.courses_loading = false
				state.courses = action.payload
			})
			.addCase(getCoursesByLevel.rejected, (state, action) => {
				state.courses_loading = false
				state.courses_error = action.payload
			})

		// Get Lesson
		builder
			.addCase(getLesson.pending, (state) => {
				state.currentLesson_loading = true
				state.currentLesson_error = null
			})
			.addCase(getLesson.fulfilled, (state, action) => {
				state.currentLesson_loading = false
				state.currentLesson = action.payload
			})
			.addCase(getLesson.rejected, (state, action) => {
				state.currentLesson_loading = false
				state.currentLesson_error = action.payload
			})

		// Get Lesson By Slug
		builder
			.addCase(getLessonBySlug.pending, (state) => {
				state.currentLesson_loading = true
				state.currentLesson_error = null
			})
			.addCase(getLessonBySlug.fulfilled, (state, action) => {
				state.currentLesson_loading = false
				state.currentLesson = action.payload
			})
			.addCase(getLessonBySlug.rejected, (state, action) => {
				state.currentLesson_loading = false
				state.currentLesson_error = action.payload
			})

		// Get Course By Slug
		builder
			.addCase(getCourseBySlug.pending, (state) => {
				state.currentCourse_loading = true
				state.currentCourse_error = null
			})
			.addCase(getCourseBySlug.fulfilled, (state, action) => {
				state.currentCourse_loading = false
				state.currentCourse = action.payload
			})
			.addCase(getCourseBySlug.rejected, (state, action) => {
				state.currentCourse_loading = false
				state.currentCourse_error = action.payload
			})

		// Get User Access
		builder
			.addCase(getUserAccess.pending, (state) => {
				state.userAccess_loading = true
				state.userAccess_error = null
			})
			.addCase(getUserAccess.fulfilled, (state, action) => {
				state.userAccess_loading = false
				state.userAccess = action.payload
			})
			.addCase(getUserAccess.rejected, (state, action) => {
				state.userAccess_loading = false
				state.userAccess_error = action.payload
			})

		// Get User Progress
		builder
			.addCase(getUserProgressForCourse.pending, (state) => {
				state.userProgress_loading = true
				state.userProgress_error = null
			})
			.addCase(getUserProgressForCourse.fulfilled, (state, action) => {
				state.userProgress_loading = false
				state.userProgress = action.payload
			})
			.addCase(getUserProgressForCourse.rejected, (state, action) => {
				state.userProgress_loading = false
				state.userProgress_error = action.payload
			})

		// Complete Lesson
		builder.addCase(completeCourseLesson.fulfilled, (state, action) => {
			const lessonId = action.payload
			const existing = state.userProgress.find((p) => p.lesson_id === lessonId)

			if (existing) {
				existing.is_completed = true
				existing.completed_at = new Date().toISOString()
			} else {
				state.userProgress.push({
					lesson_id: lessonId,
					is_completed: true,
					completed_at: new Date().toISOString(),
				})
			}

			// Update stats
			state.stats.totalLessonsCompleted += 1
		})

		// Update Time Spent
		builder.addCase(updateLessonTimeSpent.fulfilled, (state, action) => {
			const { lessonId, secondsSpent } = action.payload
			const existing = state.userProgress.find((p) => p.lesson_id === lessonId)

			if (existing) {
				existing.time_spent_seconds = secondsSpent
			}

			state.stats.totalTimeSpent += secondsSpent
		})
	},
})

export const {
	resetCurrentLesson,
	resetCurrentCourse,
	resetCourses,
	updateLocalProgress,
	loadLocalProgress,
	completeLocalLessonAction,
} = coursesSlice.actions

export default coursesSlice.reducer
