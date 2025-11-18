/**
 * Utility functions for managing local course progress in localStorage
 * Used for non-authenticated users before they sign up/login
 */

const LOCAL_PROGRESS_KEY = 'linguami_course_progress'

/**
 * Get all local progress from localStorage
 * @returns {Array} Array of lesson progress objects
 */
export const getLocalProgress = () => {
	if (typeof window === 'undefined') return []

	try {
		const stored = localStorage.getItem(LOCAL_PROGRESS_KEY)
		return stored ? JSON.parse(stored) : []
	} catch (error) {
		console.error('Error reading local progress:', error)
		return []
	}
}

/**
 * Save local progress to localStorage
 * @param {Array} progress - Array of lesson progress objects
 */
const saveLocalProgress = (progress) => {
	if (typeof window === 'undefined') return

	try {
		localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progress))
	} catch (error) {
		console.error('Error saving local progress:', error)
	}
}

/**
 * Mark a lesson as completed locally
 * @param {number} lessonId - ID of the lesson
 * @returns {Object} Updated progress entry
 */
export const completeLocalLesson = (lessonId) => {
	const progress = getLocalProgress()
	const now = new Date().toISOString()

	const existingIndex = progress.findIndex((p) => p.lesson_id === lessonId)

	if (existingIndex >= 0) {
		// Update existing
		progress[existingIndex] = {
			...progress[existingIndex],
			is_completed: true,
			completed_at: now,
		}
	} else {
		// Add new
		progress.push({
			lesson_id: lessonId,
			is_completed: true,
			completed_at: now,
			time_spent_seconds: 0,
			last_visited_at: now,
		})
	}

	saveLocalProgress(progress)
	return progress.find((p) => p.lesson_id === lessonId)
}

/**
 * Update time spent on a lesson locally
 * @param {number} lessonId - ID of the lesson
 * @param {number} secondsSpent - Seconds spent on the lesson
 */
export const updateLocalLessonTime = (lessonId, secondsSpent) => {
	const progress = getLocalProgress()
	const now = new Date().toISOString()

	const existingIndex = progress.findIndex((p) => p.lesson_id === lessonId)

	if (existingIndex >= 0) {
		progress[existingIndex].time_spent_seconds = secondsSpent
		progress[existingIndex].last_visited_at = now
	} else {
		progress.push({
			lesson_id: lessonId,
			is_completed: false,
			completed_at: null,
			time_spent_seconds: secondsSpent,
			last_visited_at: now,
		})
	}

	saveLocalProgress(progress)
}

/**
 * Check if a lesson is completed locally
 * @param {number} lessonId - ID of the lesson
 * @returns {boolean}
 */
export const isLessonCompletedLocally = (lessonId) => {
	const progress = getLocalProgress()
	const lesson = progress.find((p) => p.lesson_id === lessonId)
	return lesson?.is_completed || false
}

/**
 * Get progress for a specific lesson
 * @param {number} lessonId - ID of the lesson
 * @returns {Object|null}
 */
export const getLocalLessonProgress = (lessonId) => {
	const progress = getLocalProgress()
	return progress.find((p) => p.lesson_id === lessonId) || null
}

/**
 * Clear all local progress (used after migration to database)
 */
export const clearLocalProgress = () => {
	if (typeof window === 'undefined') return

	try {
		localStorage.removeItem(LOCAL_PROGRESS_KEY)
	} catch (error) {
		console.error('Error clearing local progress:', error)
	}
}

/**
 * Get count of completed lessons locally
 * @returns {number}
 */
export const getLocalCompletedCount = () => {
	const progress = getLocalProgress()
	return progress.filter((p) => p.is_completed).length
}

/**
 * Export local progress for migration to database
 * @returns {Array} Array of lesson progress ready for DB insertion
 */
export const exportLocalProgressForMigration = () => {
	return getLocalProgress().map((p) => ({
		lesson_id: p.lesson_id,
		is_completed: p.is_completed,
		completed_at: p.completed_at,
		time_spent_seconds: p.time_spent_seconds || 0,
	}))
}

/**
 * Migrate local progress to database after user login/signup
 * @param {Function} migrationFn - Server Action function to call for migration
 * @returns {Promise<Object>} Result of migration
 */
export const migrateLocalProgressToDatabase = async (migrationFn) => {
	const localProgress = getLocalProgress()

	if (localProgress.length === 0) {
		return { success: true, migrated: 0 }
	}

	try {
		const result = await migrationFn(localProgress)

		if (!result.success) {
			throw new Error(result.error || 'Migration failed')
		}

		// Clear local progress after successful migration
		clearLocalProgress()

		return { success: true, migrated: result.migrated }
	} catch (error) {
		console.error('Error migrating local progress:', error)
		return { success: false, error: error.message }
	}
}
