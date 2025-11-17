/**
 * React Query hooks for lessons management (client-side)
 *
 * This module provides React Query hooks for managing lessons and their progress.
 * It works alongside Server Components that fetch initial data.
 *
 * Key features:
 * - Query hooks for fetching lesson status
 * - Mutation hooks for marking lessons as studied
 * - Optimistic updates for instant UI feedback
 * - localStorage support for guest users
 *
 * Usage:
 * ```javascript
 * // Get lesson status
 * const { data: lessonStatus } = useLessonStatus(lessonId, isUserLoggedIn)
 *
 * // Mark lesson as studied
 * const { mutate: markAsStudied } = useMarkLessonAsStudied(isUserLoggedIn)
 * markAsStudied(lessonId)
 * ```
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLessonStatus, markLessonAsStudied } from '@/app/actions/lessons'

// ============================================================================
// Query Keys Factory
// ============================================================================

export const lessonKeys = {
	all: ['lessons'],
	lessonStatus: (lessonId) => [...lessonKeys.all, 'status', lessonId],
	allStatuses: () => [...lessonKeys.all, 'statuses'],
}

// ============================================================================
// LocalStorage Helpers (Guest Users)
// ============================================================================

const STORAGE_KEY = 'linguami_lesson_statuses'

/**
 * Get lesson status from localStorage (guest users)
 */
function getLocalLessonStatus(lessonId) {
	if (typeof window === 'undefined') return { is_studied: false }

	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		const statuses = stored ? JSON.parse(stored) : {}
		return { is_studied: statuses[lessonId] || false }
	} catch (error) {
		console.error('Error reading lesson status from localStorage:', error)
		return { is_studied: false }
	}
}

/**
 * Save lesson status to localStorage (guest users)
 */
function saveLocalLessonStatus(lessonId, isStudied) {
	if (typeof window === 'undefined') return

	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		const statuses = stored ? JSON.parse(stored) : {}
		statuses[lessonId] = isStudied
		localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))
	} catch (error) {
		console.error('Error saving lesson status to localStorage:', error)
	}
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Get lesson status (supports both logged-in and guest users)
 *
 * @param {number} lessonId - The lesson ID
 * @param {boolean} isUserLoggedIn - Whether the user is logged in
 * @returns {Object} Query result with lesson status data
 *
 * @example
 * const { data: lessonStatus, isLoading } = useLessonStatus(123, true)
 * if (lessonStatus?.is_studied) {
 *   // Show completion badge
 * }
 */
export function useLessonStatus(lessonId, isUserLoggedIn) {
	return useQuery({
		queryKey: lessonKeys.lessonStatus(lessonId),
		queryFn: async () => {
			// Guest users: use localStorage
			if (!isUserLoggedIn) {
				return getLocalLessonStatus(lessonId)
			}

			// Logged-in users: fetch from server
			return await getLessonStatus(lessonId)
		},
		enabled: !!lessonId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
	})
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Mark a lesson as studied
 *
 * Features:
 * - Optimistic updates for instant UI feedback
 * - Automatic cache invalidation
 * - localStorage support for guest users
 *
 * @param {boolean} isUserLoggedIn - Whether the user is logged in
 * @returns {Object} Mutation result
 *
 * @example
 * const { mutate: markAsStudied, isPending } = useMarkLessonAsStudied(true)
 *
 * markAsStudied(lessonId, {
 *   onSuccess: () => {
 *     toast.success('Lesson completed!')
 *   },
 *   onError: (error) => {
 *     toast.error('Failed to save progress')
 *   }
 * })
 */
export function useMarkLessonAsStudied(isUserLoggedIn) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (lessonId) => {
			// Guest users: save to localStorage
			if (!isUserLoggedIn) {
				saveLocalLessonStatus(lessonId, true)
				return { lessonId }
			}

			// Logged-in users: call Server Action
			const { success, error } = await markLessonAsStudied(lessonId)
			if (!success) {
				throw new Error(error || 'Failed to mark lesson as studied')
			}
			return { lessonId }
		},

		// Optimistic update - update UI immediately before server responds
		onMutate: async (lessonId) => {
			// Cancel any outgoing refetches to avoid overwriting optimistic update
			await queryClient.cancelQueries({
				queryKey: lessonKeys.lessonStatus(lessonId),
			})

			// Snapshot the previous value
			const previousStatus = queryClient.getQueryData(lessonKeys.lessonStatus(lessonId))

			// Optimistically update to the new value
			queryClient.setQueryData(lessonKeys.lessonStatus(lessonId), (old) => ({
				...old,
				is_studied: true,
			}))

			// Return context with previous value
			return { previousStatus, lessonId }
		},

		// On error, roll back to previous value
		onError: (error, lessonId, context) => {
			if (context?.previousStatus) {
				queryClient.setQueryData(
					lessonKeys.lessonStatus(lessonId),
					context.previousStatus
				)
			}
		},

		// Always refetch after error or success to ensure cache is in sync
		onSettled: (data, error, lessonId) => {
			queryClient.invalidateQueries({
				queryKey: lessonKeys.lessonStatus(lessonId),
			})
			// Also invalidate all statuses in case it's used elsewhere
			queryClient.invalidateQueries({
				queryKey: lessonKeys.allStatuses(),
			})
		},
	})
}
