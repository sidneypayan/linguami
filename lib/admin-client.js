'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	createMaterial,
	updateMaterial,
	deleteMaterial,
	getMaterialForEdit,
} from '@/app/actions/admin'
import {
	getAllCoursesWithLessons,
	getCourseWithLessons,
	getLessonWithContent,
	updateCourse,
	updateLessonMetadata,
	updateLessonContent,
	toggleCoursePublication,
	toggleLessonPublication,
	reorderLessons,
} from '@/app/actions/courses'
import toast from '@/utils/toast'
import { getToastMessage } from '@/utils/toastMessages'

/**
 * React Query hooks for admin operations
 * Uses Server Actions for secure, server-side operations
 */

// ============================================================================
// QUERY KEYS (pour la cohérence du cache)
// ============================================================================

export const adminKeys = {
	all: ['admin'],
	material: (id) => ['admin', 'material', id],
}

export const coursesKeys = {
	all: ['admin', 'courses'],
	detail: (id) => ['admin', 'courses', id],
	lesson: (id) => ['admin', 'lesson', id],
}

// ============================================================================
// HOOK: Récupérer un material pour édition
// ============================================================================

export function useMaterialForEdit(materialId) {
	return useQuery({
		queryKey: adminKeys.material(materialId),
		queryFn: async () => {
			const result = await getMaterialForEdit(materialId)

			if (!result.success) {
				throw new Error(result.error || 'Failed to fetch material')
			}

			return result.material
		},
		enabled: !!materialId, // Ne lance la requête que si on a un ID
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}

// ============================================================================
// HOOK: Créer un nouveau material
// ============================================================================

export function useCreateMaterial() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ materialData, files = [] }) => {
			// Convertir les fichiers en base64 pour les passer via Server Action
			const filesData = await Promise.all(
				files.map(async (fileObj) => {
					const { file, fileName, fileType } = fileObj

					// Lire le fichier en ArrayBuffer puis convertir en base64
					const arrayBuffer = await file.arrayBuffer()
					const buffer = Buffer.from(arrayBuffer)
					const base64Data = buffer.toString('base64')

					return {
						fileName,
						fileType,
						base64Data,
					}
				})
			)

			// Appeler la Server Action
			const result = await createMaterial(materialData, filesData)

			if (!result.success) {
				throw new Error(result.error || 'Failed to create material')
			}

			return result.material
		},
		onSuccess: (data) => {
			// Invalider tous les caches materials pour forcer le refresh
			queryClient.invalidateQueries({ queryKey: ['materials'] })
			queryClient.invalidateQueries({ queryKey: ['books'] })
			queryClient.invalidateQueries({ queryKey: ['userMaterials'] })

			toast.success(getToastMessage('contentPostSuccess'))
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to create material')
		},
	})
}

// ============================================================================
// HOOK: Mettre à jour un material
// ============================================================================

export function useUpdateMaterial() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ materialId, materialData, files = [] }) => {
			// Convertir les fichiers en base64
			const filesData = await Promise.all(
				files.map(async (fileObj) => {
					const { file, fileName, fileType } = fileObj

					const arrayBuffer = await file.arrayBuffer()
					const buffer = Buffer.from(arrayBuffer)
					const base64Data = buffer.toString('base64')

					return {
						fileName,
						fileType,
						base64Data,
					}
				})
			)

			// Appeler la Server Action
			const result = await updateMaterial(materialId, materialData, filesData)

			if (!result.success) {
				throw new Error(result.error || 'Failed to update material')
			}

			return result.material
		},
		onSuccess: (data, variables) => {
			// Invalider le cache spécifique et les caches globaux
			queryClient.invalidateQueries({ queryKey: adminKeys.material(variables.materialId) })
			queryClient.invalidateQueries({ queryKey: ['materials'] })
			queryClient.invalidateQueries({ queryKey: ['books'] })
			queryClient.invalidateQueries({ queryKey: ['userMaterials'] })

			toast.success(getToastMessage('contentEditSuccess'))
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to update material')
		},
	})
}

// ============================================================================
// HOOK: Supprimer un material
// ============================================================================

export function useDeleteMaterial() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (materialId) => {
			const result = await deleteMaterial(materialId)

			if (!result.success) {
				throw new Error(result.error || 'Failed to delete material')
			}

			return result
		},
		onSuccess: () => {
			// Invalider tous les caches materials
			queryClient.invalidateQueries({ queryKey: ['materials'] })
			queryClient.invalidateQueries({ queryKey: ['books'] })
			queryClient.invalidateQueries({ queryKey: ['userMaterials'] })

			toast.success('Material deleted successfully')
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to delete material')
		},
	})
}

// ============================================================================
// HELPER: Convertir fichier en base64 (utilitaire)
// ============================================================================

export async function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			// Retirer le préfixe "data:*/*;base64,"
			const base64 = reader.result.split(',')[1]
			resolve(base64)
		}
		reader.onerror = error => reject(error)
	})
}

// ============================================================================
// COURSES ADMIN HOOKS
// ============================================================================

/**
 * HOOK: Get all courses with lessons
 */
export function useAllCoursesWithLessons() {
	return useQuery({
		queryKey: coursesKeys.all,
		queryFn: async () => {
			const result = await getAllCoursesWithLessons()
			if (!result.success) throw new Error(result.error)
			return result.courses
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}

/**
 * HOOK: Get single course with lessons
 */
export function useCourseWithLessons(courseId) {
	return useQuery({
		queryKey: coursesKeys.detail(courseId),
		queryFn: async () => {
			const result = await getCourseWithLessons(courseId)
			if (!result.success) throw new Error(result.error)
			return result.course
		},
		enabled: !!courseId,
		staleTime: 1000 * 60 * 5,
	})
}

/**
 * HOOK: Update course metadata
 */
export function useUpdateCourse() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ courseId, courseData }) => {
			const result = await updateCourse(courseId, courseData)
			if (!result.success) throw new Error(result.error)
			return result.course
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: coursesKeys.all })
			queryClient.invalidateQueries({ queryKey: coursesKeys.detail(variables.courseId) })
			toast.success('Course updated successfully')
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to update course')
		},
	})
}

/**
 * HOOK: Update lesson metadata
 */
export function useUpdateLessonMetadata() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ lessonId, metadataData }) => {
			const result = await updateLessonMetadata(lessonId, metadataData)
			if (!result.success) throw new Error(result.error)
			return result.lesson
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: coursesKeys.all })
			toast.success('Lesson metadata updated successfully')
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to update lesson metadata')
		},
	})
}

/**
 * HOOK: Update lesson content (JSON)
 */
export function useUpdateLessonContent() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ lessonSlug, levelSlug, learningLang, contentData }) => {
			const result = await updateLessonContent(lessonSlug, levelSlug, learningLang, contentData)
			if (!result.success) throw new Error(result.error)
			return result
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: coursesKeys.all })
			toast.success('Lesson content updated successfully')
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to update lesson content')
		},
	})
}

/**
 * HOOK: Toggle course publication
 */
export function useToggleCoursePublication() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ courseId, isPublished }) => {
			const result = await toggleCoursePublication(courseId, isPublished)
			if (!result.success) throw new Error(result.error)
			return result.course
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: coursesKeys.all })
			toast.success('Publication status updated')
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to update publication status')
		},
	})
}

/**
 * HOOK: Toggle lesson publication
 */
export function useToggleLessonPublication() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ lessonId, isPublished }) => {
			const result = await toggleLessonPublication(lessonId, isPublished)
			if (!result.success) throw new Error(result.error)
			return result.lesson
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: coursesKeys.all })
			toast.success('Lesson publication status updated')
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to update lesson publication')
		},
	})
}

/**
 * HOOK: Reorder lessons
 */
export function useReorderLessons() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ courseId, lessonOrderUpdates }) => {
			const result = await reorderLessons(courseId, lessonOrderUpdates)
			if (!result.success) throw new Error(result.error)
			return result
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: coursesKeys.all })
			toast.success('Lessons reordered successfully')
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to reorder lessons')
		},
	})
}
