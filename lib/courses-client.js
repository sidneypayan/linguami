'use client'

/**
 * Client-side React Query hooks for course management
 * Supports both authenticated users (database) and guests (localStorage)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	getLessonProgress,
	completeLesson,
	updateLessonTimeSpent,
	getUserProgressForCourse,
	migrateLocalProgressAction,
} from '@/app/actions/courses'
import {
	getLocalProgress,
	completeLocalLesson,
	isLessonCompletedLocally,
	migrateLocalProgressToDatabase,
} from '@/utils/localCourseProgress'

// ============================================
// QUERY KEYS
// ============================================

export const courseKeys = {
	all: ['courses'],
	progress: () => [...courseKeys.all, 'progress'],
	lessonProgress: (lessonId) => [...courseKeys.progress(), 'lesson', lessonId],
	courseProgress: (courseId) => [...courseKeys.progress(), 'course', courseId],
}

// ============================================
// QUERIES
// ============================================

/**
 * Get progress for a specific lesson
 * Supports both authenticated (database) and guest (localStorage) users
 * @param {number} lessonId - Lesson ID
 * @param {boolean} isUserLoggedIn - Whether user is authenticated
 * @returns {Object} React Query result with lesson progress
 */
export function useLessonProgress(lessonId, isUserLoggedIn) {
	return useQuery({
		queryKey: courseKeys.lessonProgress(lessonId),
		queryFn: async () => {
			if (!lessonId) return null

			// Authenticated users: fetch from database
			if (isUserLoggedIn) {
				const { data, error } = await getLessonProgress(lessonId)
				if (error) throw new Error(error)
				return data
			}

			// Guest users: fetch from localStorage
			const localProgress = getLocalProgress()
			const progress = localProgress.find((p) => p.lesson_id === lessonId)
			return progress || null
		},
		enabled: !!lessonId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
	})
}

/**
 * Get progress for all lessons in a course
 * @param {number} courseId - Course ID
 * @param {boolean} isUserLoggedIn - Whether user is authenticated
 * @returns {Object} React Query result with course progress
 */
export function useCourseProgress(courseId, isUserLoggedIn) {
	return useQuery({
		queryKey: courseKeys.courseProgress(courseId),
		queryFn: async () => {
			if (!courseId) return []

			// Authenticated users: fetch from database
			if (isUserLoggedIn) {
				const { data, error } = await getUserProgressForCourse(courseId)
				if (error) throw new Error(error)
				return data || []
			}

			// Guest users: fetch from localStorage
			return getLocalProgress()
		},
		enabled: !!courseId,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Mark a lesson as completed
 * Handles both authenticated (database) and guest (localStorage) users
 * Includes optimistic updates for instant UI feedback
 * @param {boolean} isUserLoggedIn - Whether user is authenticated
 * @returns {Object} React Query mutation
 */
export function useCompleteLesson(isUserLoggedIn) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (lessonId) => {
			// Authenticated users: update database
			if (isUserLoggedIn) {
				const { success, error } = await completeLesson(lessonId)
				if (!success) throw new Error(error)
				return { lessonId }
			}

			// Guest users: update localStorage
			completeLocalLesson(lessonId)
			return { lessonId }
		},

		// Optimistic update: Update UI immediately before server responds
		onMutate: async (lessonId) => {
			// Cancel any outgoing refetches to avoid overwriting optimistic update
			await queryClient.cancelQueries({
				queryKey: courseKeys.lessonProgress(lessonId),
			})

			// Snapshot the previous value
			const previousProgress = queryClient.getQueryData(
				courseKeys.lessonProgress(lessonId)
			)

			// Optimistically update to the new value
			queryClient.setQueryData(courseKeys.lessonProgress(lessonId), (old) => ({
				...old,
				lesson_id: lessonId,
				is_completed: true,
				completed_at: new Date().toISOString(),
			}))

			// Return context with previous value for rollback
			return { previousProgress, lessonId }
		},

		// On error: rollback to previous state
		onError: (err, lessonId, context) => {
			queryClient.setQueryData(
				courseKeys.lessonProgress(context.lessonId),
				context.previousProgress
			)
		},

		// On success: invalidate related queries to refetch fresh data
		onSuccess: (data, lessonId) => {
			// Invalidate lesson progress
			queryClient.invalidateQueries({
				queryKey: courseKeys.lessonProgress(lessonId),
			})

			// Invalidate course progress (contains this lesson)
			queryClient.invalidateQueries({
				queryKey: courseKeys.progress(),
				exact: false,
			})
		},
	})
}

/**
 * Update time spent on a lesson
 * @param {boolean} isUserLoggedIn - Whether user is authenticated
 * @returns {Object} React Query mutation
 */
export function useUpdateLessonTime(isUserLoggedIn) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ lessonId, secondsSpent }) => {
			// Only works for authenticated users (no localStorage tracking for time)
			if (!isUserLoggedIn) {
				return { lessonId, secondsSpent }
			}

			const { success, error } = await updateLessonTimeSpent({
				lessonId,
				secondsSpent,
			})
			if (!success) throw new Error(error)
			return { lessonId, secondsSpent }
		},

		// Optimistic update
		onMutate: async ({ lessonId, secondsSpent }) => {
			await queryClient.cancelQueries({
				queryKey: courseKeys.lessonProgress(lessonId),
			})

			const previousProgress = queryClient.getQueryData(
				courseKeys.lessonProgress(lessonId)
			)

			queryClient.setQueryData(courseKeys.lessonProgress(lessonId), (old) => ({
				...old,
				time_spent_seconds: secondsSpent,
				last_visited_at: new Date().toISOString(),
			}))

			return { previousProgress, lessonId }
		},

		onError: (err, variables, context) => {
			queryClient.setQueryData(
				courseKeys.lessonProgress(context.lessonId),
				context.previousProgress
			)
		},

		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: courseKeys.lessonProgress(variables.lessonId),
			})
		},
	})
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if a lesson is completed (works for both authenticated and guest users)
 * @param {number} lessonId - Lesson ID
 * @param {boolean} isUserLoggedIn - Whether user is authenticated
 * @param {Object} progressData - Progress data from useLessonProgress
 * @returns {boolean} Whether the lesson is completed
 */
export function isLessonCompleted(lessonId, isUserLoggedIn, progressData) {
	if (!lessonId) return false

	if (isUserLoggedIn) {
		return progressData?.is_completed || false
	}

	// Guest users: check localStorage
	return isLessonCompletedLocally(lessonId)
}

/**
 * Prefetch lesson progress (useful for preloading next lesson)
 * @param {Object} queryClient - React Query client
 * @param {number} lessonId - Lesson ID
 * @param {boolean} isUserLoggedIn - Whether user is authenticated
 */
export async function prefetchLessonProgress(
	queryClient,
	lessonId,
	isUserLoggedIn
) {
	await queryClient.prefetchQuery({
		queryKey: courseKeys.lessonProgress(lessonId),
		queryFn: async () => {
			if (isUserLoggedIn) {
				const { data, error } = await getLessonProgress(lessonId)
				if (error) throw new Error(error)
				return data
			}

			const localProgress = getLocalProgress()
			return localProgress.find((p) => p.lesson_id === lessonId) || null
		},
		staleTime: 5 * 60 * 1000,
	})
}

/**
 * Migrate local course progress to database (wrapper for Server Action)
 * Call this after user login/signup to migrate localStorage progress
 * @returns {Promise<Object>} { success, migrated, error }
 */
export async function migrateLocalProgress() {
	return await migrateLocalProgressToDatabase(migrateLocalProgressAction)
}
