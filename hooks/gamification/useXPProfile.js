/**
 * Hook to fetch user's XP profile
 * Uses React Query to manage XP profile data
 */

import { useQuery } from '@tanstack/react-query'
import { getXPProfileAction } from '@/actions/gamification/xp-actions'
import { useUserContext } from '@/context/user'

/**
 * Hook to get user's XP profile
 * @param {Object} options - React Query options
 * @returns {Object} React Query query object
 * @example
 * const { data: xpProfile, isLoading, error } = useXPProfile()
 *
 * if (isLoading) return <div>Loading...</div>
 * if (error) return <div>Error: {error.message}</div>
 *
 * const { profile, stats, recentTransactions, achievements } = xpProfile
 * console.log('Level:', profile.currentLevel)
 * console.log('XP Today:', stats.xpToday)
 */
export function useXPProfile(options = {}) {
	const { isUserLoggedIn } = useUserContext()

	return useQuery({
		queryKey: ['xpProfile'],
		queryFn: async () => {
			const result = await getXPProfileAction()

			if (!result.success) {
				throw new Error(result.error)
			}

			return result.data
		},
		enabled: isUserLoggedIn,
		staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
		...options,
	})
}
