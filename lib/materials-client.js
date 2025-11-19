'use client'

/**
 * Client-side React Query hooks for materials management
 * Migrated from direct Supabase client to Server Actions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getFirstChapterOfBook,
  getBookChapters,
  getUserMaterialsStatus,
  addBeingStudiedMaterial,
  removeBeingStudiedMaterial,
  addMaterialToStudied,
} from '@/app/actions/materials'

// ============================================
// QUERY KEYS
// ============================================

export const materialKeys = {
  all: ['materials'],
  userStatus: () => [...materialKeys.all, 'userStatus'],
  bookChapters: (bookId) => [...materialKeys.all, 'bookChapters', bookId],
  firstChapter: (lang, bookId) => [...materialKeys.all, 'firstChapter', lang, bookId],
}

// ============================================
// QUERIES
// ============================================

/**
 * Get first chapter of a book
 * @param {string} lang - Learning language
 * @param {number} bookId - Book ID
 * @returns {Object} React Query result with first chapter
 */
export function useFirstChapterOfBook(lang, bookId) {
  return useQuery({
    queryKey: materialKeys.firstChapter(lang, bookId),
    queryFn: async () => {
      if (!lang || !bookId) return null
      return await getFirstChapterOfBook({ lang, bookId })
    },
    enabled: !!lang && !!bookId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

/**
 * Get all chapters of a book
 * @param {number} bookId - Book ID
 * @returns {Object} React Query result with chapters array
 */
export function useBookChapters(bookId) {
  return useQuery({
    queryKey: materialKeys.bookChapters(bookId),
    queryFn: async () => {
      if (!bookId) return []
      return await getBookChapters(bookId)
    },
    enabled: !!bookId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

/**
 * Get user materials status (being studied, completed)
 * Only for authenticated users
 * @param {boolean} isUserLoggedIn - Whether user is authenticated
 * @returns {Object} React Query result with user materials status
 */
export function useUserMaterialsStatus(isUserLoggedIn) {
  return useQuery({
    queryKey: materialKeys.userStatus(),
    queryFn: async () => {
      if (!isUserLoggedIn) return []
      return await getUserMaterialsStatus()
    },
    enabled: !!isUserLoggedIn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Add material to "being studied" status
 * Includes optimistic updates for instant UI feedback
 * @returns {Object} React Query mutation
 */
export function useAddBeingStudiedMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (materialId) => {
      const result = await addBeingStudiedMaterial(materialId)
      if (!result.success) throw new Error(result.error)
      return { materialId }
    },

    // Optimistic update
    onMutate: async (materialId) => {
      await queryClient.cancelQueries({ queryKey: materialKeys.userStatus() })

      const previousStatus = queryClient.getQueryData(materialKeys.userStatus())

      // Optimistically add material to being studied
      queryClient.setQueryData(materialKeys.userStatus(), (old = []) => [
        ...old,
        { material_id: materialId, is_being_studied: true, is_studied: false }
      ])

      return { previousStatus, materialId }
    },

    onError: (err, materialId, context) => {
      queryClient.setQueryData(materialKeys.userStatus(), context.previousStatus)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.userStatus() })
    },
  })
}

/**
 * Remove material from "being studied" status
 * @returns {Object} React Query mutation
 */
export function useRemoveBeingStudiedMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (materialId) => {
      const result = await removeBeingStudiedMaterial(materialId)
      if (!result.success) throw new Error(result.error)
      return { materialId }
    },

    // Optimistic update
    onMutate: async (materialId) => {
      await queryClient.cancelQueries({ queryKey: materialKeys.userStatus() })

      const previousStatus = queryClient.getQueryData(materialKeys.userStatus())

      // Optimistically remove material
      queryClient.setQueryData(materialKeys.userStatus(), (old = []) =>
        old.filter(item => item.material_id !== materialId)
      )

      return { previousStatus, materialId }
    },

    onError: (err, materialId, context) => {
      queryClient.setQueryData(materialKeys.userStatus(), context.previousStatus)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.userStatus() })
    },
  })
}

/**
 * Mark material as studied (completed)
 * Awards XP on first completion
 * @returns {Object} React Query mutation
 */
export function useAddMaterialToStudied() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (materialId) => {
      const result = await addMaterialToStudied(materialId)
      if (!result.success) throw new Error(result.error)
      return { materialId }
    },

    // Optimistic update
    onMutate: async (materialId) => {
      await queryClient.cancelQueries({ queryKey: materialKeys.userStatus() })

      const previousStatus = queryClient.getQueryData(materialKeys.userStatus())

      // Optimistically update material to studied
      queryClient.setQueryData(materialKeys.userStatus(), (old = []) => {
        const existing = old.find(item => item.material_id === materialId)
        if (existing) {
          return old.map(item =>
            item.material_id === materialId
              ? { ...item, is_being_studied: false, is_studied: true }
              : item
          )
        } else {
          return [...old, { material_id: materialId, is_being_studied: false, is_studied: true }]
        }
      })

      return { previousStatus, materialId }
    },

    onError: (err, materialId, context) => {
      queryClient.setQueryData(materialKeys.userStatus(), context.previousStatus)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.userStatus() })
    },
  })
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if material is being studied
 * @param {number} materialId - Material ID
 * @param {Array} userMaterialsStatus - User materials status from useUserMaterialsStatus
 * @returns {boolean} Whether material is being studied
 */
export function isMaterialBeingStudied(materialId, userMaterialsStatus) {
  if (!materialId || !userMaterialsStatus) return false
  return userMaterialsStatus.some(
    item => item.material_id === materialId && item.is_being_studied
  )
}

/**
 * Check if material is completed
 * @param {number} materialId - Material ID
 * @param {Array} userMaterialsStatus - User materials status from useUserMaterialsStatus
 * @returns {boolean} Whether material is completed
 */
export function isMaterialStudied(materialId, userMaterialsStatus) {
  if (!materialId || !userMaterialsStatus) return false
  return userMaterialsStatus.some(
    item => item.material_id === materialId && item.is_studied
  )
}
