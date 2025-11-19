'use client'

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
 * // Get all lesson statuses
 * const { data: allStatuses } = useAllLessonStatuses(isUserLoggedIn)
 *
 * // Mark lesson as studied
 * const { mutate: markAsStudied } = useMarkLessonAsStudied(isUserLoggedIn)
 * markAsStudied(lessonId)
 * ```
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	getLessonStatus,
	markLessonAsStudied,
	getAllLessonStatuses,
} from '@/app/actions/lessons'
import { logger } from '@/utils/logger'

// ============================================================================
// Query Keys Factory
// ============================================================================

export const lessonKeys = {	all: ['lessons'],	lessonStatus: (lessonId, isUserLoggedIn) => [...lessonKeys.all, 'status', lessonId, isUserLoggedIn ? 'logged-in' : 'guest'],	allStatuses: (isUserLoggedIn) => [...lessonKeys.all, 'statuses', isUserLoggedIn ? 'logged-in' : 'guest'],}

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
		logger.error('Error reading lesson status from localStorage:', error)
		return { is_studied: false }
	}
}

/**
 * Get all lesson statuses from localStorage (guest users)
 * @returns {Array} Array of { lesson_id, is_studied } objects
 */
function getAllLocalLessonStatuses() {
	if (typeof window === 'undefined') return []

	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		const statuses = stored ? JSON.parse(stored) : {}

		// Convert object to array format matching database response
		return Object.entries(statuses)
			.filter(([, isStudied]) => isStudied)
			.map(([lessonId, isStudied]) => ({
				lesson_id: parseInt(lessonId, 10),
				is_studied: isStudied,
			}))
	} catch (error) {
		logger.error('Error reading all lesson statuses from localStorage:', error)
		return []
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
		logger.error('Error saving lesson status to localStorage:', error)
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
		queryKey: lessonKeys.lessonStatus(lessonId, isUserLoggedIn),
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

/**
 * Get all lesson statuses for the user (supports both logged-in and guest users)
 *
 * @param {boolean} isUserLoggedIn - Whether the user is logged in
 * @returns {Object} Query result with array of lesson statuses
 *
 * @example
 * const { data: allStatuses = [], isLoading } = useAllLessonStatuses(true)
 * const studiedLessonIds = allStatuses
 *   .filter(status => status.is_studied)
 *   .map(status => status.lesson_id)
 */
export function useAllLessonStatuses(isUserLoggedIn) {
	return useQuery({
		queryKey: lessonKeys.allStatuses(isUserLoggedIn),
		queryFn: async () => {
			// Guest users: use localStorage
			if (!isUserLoggedIn) {
				return getAllLocalLessonStatuses()
			}

			// Logged-in users: fetch from server
			return await getAllLessonStatuses()
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
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
				queryKey: lessonKeys.lessonStatus(lessonId, isUserLoggedIn),
			})

			// Snapshot the previous value
			const previousStatus = queryClient.getQueryData(lessonKeys.lessonStatus(lessonId, isUserLoggedIn))

			// Optimistically update to the new value
			queryClient.setQueryData(lessonKeys.lessonStatus(lessonId, isUserLoggedIn), (old) => ({
				...old,
				is_studied: true,
			}))

			// Also update the all statuses cache
			await queryClient.cancelQueries({
				queryKey: lessonKeys.allStatuses(isUserLoggedIn),
			})

			const previousAllStatuses = queryClient.getQueryData(lessonKeys.allStatuses(isUserLoggedIn))

			queryClient.setQueryData(lessonKeys.allStatuses(isUserLoggedIn), (old = []) => {
				// Check if lesson already exists in the array
				const existingIndex = old.findIndex((status) => status.lesson_id === lessonId)

				if (existingIndex >= 0) {
					// Update existing entry
					const updated = [...old]
					updated[existingIndex] = { ...updated[existingIndex], is_studied: true }
					return updated
				} else {
					// Add new entry
					return [...old, { lesson_id: lessonId, is_studied: true }]
				}
			})

			// Return context with previous value
			return { previousStatus, previousAllStatuses, lessonId }
		},

		// On error, roll back to previous value
		onError: (error, lessonId, context) => {
			if (context?.previousStatus) {
				queryClient.setQueryData(
					lessonKeys.lessonStatus(lessonId, isUserLoggedIn),
					context.previousStatus
				)
			}
			if (context?.previousAllStatuses) {
				queryClient.setQueryData(
					lessonKeys.allStatuses(isUserLoggedIn),
					context.previousAllStatuses
				)
			}
		},

		// Always refetch after error or success to ensure cache is in sync
		onSettled: (data, error, lessonId) => {
			queryClient.invalidateQueries({
				queryKey: lessonKeys.lessonStatus(lessonId, isUserLoggedIn),
			})
			// Also invalidate all statuses
			queryClient.invalidateQueries({
				queryKey: lessonKeys.allStatuses(isUserLoggedIn),
			})
		},
	})
}

/**
 * Check if lessons are available for a language
 * 
 * @param {string} lang - Language code ('fr', 'ru', 'en')
 * @returns {Object} Query result with boolean hasLessons
 * 
 * @example
 * const { data: hasLessons = false, isLoading } = useHasLessonsForLanguage('ru')
 * if (hasLessons) {
 *   // Show lessons link in navbar
 * }
 */
export function useHasLessonsForLanguage(lang) {
	return useQuery({
		queryKey: [...lessonKeys.all, 'hasLessons', lang],
		queryFn: async () => {
			const { hasLessonsForLanguage } = await import('@/app/actions/lessons')
			return await hasLessonsForLanguage(lang)
		},
		enabled: !!lang,
		staleTime: 60 * 60 * 1000, // 1 hour (lessons availability doesn't change often)
		gcTime: 24 * 60 * 60 * 1000, // 24 hours
	})
}
