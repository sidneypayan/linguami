import { createClient } from '@supabase/supabase-js'

/**
 * Get leaderboard data for all categories
 * @param {string} userId - The current user's ID
 * @returns {Object} Leaderboard data with all rankings
 */
export async function getLeaderboardData(userId) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY
	)

	try {
		// 0. Get week bounds
		let weekStart = null
		let weekEnd = null

		try {
			const { data: weekBounds } = await supabase.rpc('get_week_bounds')
			if (weekBounds && weekBounds.length > 0) {
				weekStart = weekBounds[0].week_start
				weekEnd = weekBounds[0].week_end
			}
		} catch (weekError) {
			console.warn('Failed to get week bounds:', weekError)
		}

		// 1. Top 100 by XP
		const { data: topXp, error: xpError } = await supabase
			.from('leaderboard_view')
			.select('id, name, avatar_id, total_xp, current_level')
			.order('total_xp', { ascending: false })
			.limit(100)

		if (xpError) throw xpError

		// 2. Top 100 by Streak
		const { data: topStreak, error: streakError } = await supabase
			.from('leaderboard_view')
			.select('id, name, avatar_id, daily_streak, current_level')
			.order('daily_streak', { ascending: false })
			.limit(100)

		if (streakError) throw streakError

		// 3. Top 100 by Gold
		const { data: topGold, error: goldError } = await supabase
			.from('leaderboard_view')
			.select('id, name, avatar_id, total_gold, current_level')
			.order('total_gold', { ascending: false })
			.limit(100)

		if (goldError) throw goldError

		// 3.5. Top 100 by Weekly XP
		let topWeekly = null
		if (weekStart) {
			const { data, error: weeklyError } = await supabase
				.from('weekly_leaderboard_view')
				.select('user_id, weekly_xp, week_start, week_end, name, avatar_id')
				.eq('week_start', weekStart)
				.order('weekly_xp', { ascending: false })
				.limit(100)

			if (weeklyError) {
				console.warn('Weekly leaderboard fetch failed:', weeklyError)
			} else {
				topWeekly = data || []
			}
		}

		// 3.6. Get month bounds and top 100 by Monthly XP
		let monthStart = null
		let monthEnd = null

		try {
			const { data: monthBounds } = await supabase.rpc('get_month_bounds')
			if (monthBounds && monthBounds.length > 0) {
				monthStart = monthBounds[0].month_start
				monthEnd = monthBounds[0].month_end
			}
		} catch (monthError) {
			console.warn('Failed to get month bounds:', monthError)
		}

		let topMonthly = null

		if (monthStart) {
			const { data, error: monthlyError } = await supabase
				.from('monthly_leaderboard_view')
				.select('user_id, monthly_xp, month_start, month_end, name, avatar_id')
				.eq('month_start', monthStart)
				.order('monthly_xp', { ascending: false })
				.limit(100)

			if (monthlyError) {
				console.warn('Monthly leaderboard fetch failed:', monthlyError)
			} else {
				topMonthly = data || []
			}
		}

		// 4. Get current user's profile and ranks
		const { data: userProfile } = await supabase
			.from('user_xp_profile')
			.select('total_xp, daily_streak, total_gold, current_level')
			.eq('user_id', userId)
			.single()

		let userRankXp = null
		let userRankStreak = null
		let userRankGold = null
		let userRankWeekly = null
		let userRankMonthly = null

		if (userProfile) {
			// XP Rank
			const { count: xpRank } = await supabase
				.from('leaderboard_view')
				.select('*', { count: 'exact', head: true })
				.gt('total_xp', userProfile.total_xp)
			userRankXp = (xpRank || 0) + 1

			// Streak Rank
			const { count: streakRank } = await supabase
				.from('leaderboard_view')
				.select('*', { count: 'exact', head: true })
				.gt('daily_streak', userProfile.daily_streak)
			userRankStreak = (streakRank || 0) + 1

			// Gold Rank
			const { count: goldRank } = await supabase
				.from('leaderboard_view')
				.select('*', { count: 'exact', head: true })
				.gt('total_gold', userProfile.total_gold || 0)
			userRankGold = (goldRank || 0) + 1

			// Weekly Rank
			if (weekStart) {
				const { data: userWeekly } = await supabase
					.from('weekly_xp_tracking')
					.select('weekly_xp')
					.eq('user_id', userId)
					.eq('week_start', weekStart)
					.single()

				if (userWeekly) {
					const { count: weeklyRank } = await supabase
						.from('weekly_leaderboard_view')
						.select('*', { count: 'exact', head: true })
						.eq('week_start', weekStart)
						.gt('weekly_xp', userWeekly.weekly_xp || 0)
					userRankWeekly = (weeklyRank || 0) + 1
				}
			}

			// Monthly Rank
			if (monthStart) {
				const { data: userMonthly } = await supabase
					.from('monthly_xp_tracking')
					.select('monthly_xp')
					.eq('user_id', userId)
					.eq('month_start', monthStart)
					.single()

				if (userMonthly) {
					const { count: monthlyRank } = await supabase
						.from('monthly_leaderboard_view')
						.select('*', { count: 'exact', head: true })
						.eq('month_start', monthStart)
						.gt('monthly_xp', userMonthly.monthly_xp || 0)
					userRankMonthly = (monthlyRank || 0) + 1
				}
			}
		}

		// Format leaderboard data
		const formatLeaderboard = (data, valueKey) => {
			if (!data) return []
			return data.map((entry, index) => ({
				rank: index + 1,
				userId: entry.user_id || entry.id,
				username: entry.name || entry.users_profile?.name || 'Anonymous',
				avatar_id: entry.avatar_id || entry.users_profile?.avatar_id || 'avatar1',
				avatarId: entry.avatar_id || entry.users_profile?.avatar_id || 'avatar1',
				value: entry[valueKey],
				level: entry.current_level || null,
				isCurrentUser: (entry.user_id || entry.id) === userId,
			}))
		}

		return {
			topXp: formatLeaderboard(topXp, 'total_xp'),
			topStreak: formatLeaderboard(topStreak, 'daily_streak'),
			topGold: formatLeaderboard(topGold, 'total_gold'),
			topWeekly: topWeekly ? formatLeaderboard(topWeekly, 'weekly_xp') : [],
			topMonthly: topMonthly ? formatLeaderboard(topMonthly, 'monthly_xp') : [],
			userRanks: {
				xp: userRankXp,
				streak: userRankStreak,
				gold: userRankGold,
				weekly: userRankWeekly,
				monthly: userRankMonthly,
			},
			userStats: userProfile || null,
			weekBounds: weekStart && weekEnd ? { weekStart, weekEnd } : null,
			monthBounds: monthStart && monthEnd ? { monthStart, monthEnd } : null,
		}
	} catch (error) {
		console.error('Error fetching leaderboard:', error)
		throw error
	}
}
