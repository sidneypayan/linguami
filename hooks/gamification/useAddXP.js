/**
 * Hook to add XP to user's profile
 * Uses React Query mutation with XP service
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addXPAction } from '@/actions/gamification/xp-actions'

/**
 * Hook to add XP
 * @returns {Object} React Query mutation object
 * @example
 * const addXP = useAddXP()
 *
 * addXP.mutate({
 *   actionType: 'flashcard_good',
 *   sourceId: 'card-123',
 *   description: 'Answered flashcard correctly'
 * }, {
 *   onSuccess: (data) => {
 *     if (data.leveledUp) {
 *       logger.log('Level up!', data.currentLevel)
 *     }
 *     if (data.achievements.length > 0) {
 *       logger.log('Achievements unlocked!', data.achievements)
 *     }
 *   }
 * })
 */
export function useAddXP() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ actionType, sourceId, description, customXp }) => {
			const result = await addXPAction({
				actionType,
				sourceId,
				description,
				customXp,
			})

			if (!result.success) {
				throw new Error(result.error)
			}

			return result.data
		},
		onSuccess: () => {
			// Invalidate XP profile query to refetch updated data
			queryClient.invalidateQueries({ queryKey: ['xpProfile'] })
			// Also invalidate user context if it caches XP data
			queryClient.invalidateQueries({ queryKey: ['userProfile'] })
		},
	})
}
