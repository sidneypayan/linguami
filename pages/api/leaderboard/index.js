import { createServerClient } from '@supabase/ssr'

/**
 * API endpoint pour récupérer le classement des utilisateurs
 * GET /api/leaderboard
 */
export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name) {
					return req.cookies[name]
				},
				set(name, value, options) {
					res.setHeader('Set-Cookie', `${name}=${value}`)
				},
				remove(name, options) {
					res.setHeader('Set-Cookie', `${name}=; Max-Age=0`)
				},
			},
		}
	)

	// Vérifier l'authentification
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (!user || authError) {
		return res.status(401).json({ error: 'Unauthorized' })
	}

	try {
		// 0. Récupérer les limites de la semaine actuelle
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

		// 1. Récupérer le top 100 par XP
		const { data: topXp, error: xpError } = await supabase
			.from('user_xp_profile')
			.select(`
				user_id,
				total_xp,
				current_level,
				users_profile:user_id (
					name,
					email,
					avatar_id
				)
			`)
			.order('total_xp', { ascending: false })
			.limit(100)

		if (xpError) throw xpError

		// 2. Récupérer le top 100 par Streak
		const { data: topStreak, error: streakError } = await supabase
			.from('user_xp_profile')
			.select(`
				user_id,
				daily_streak,
				longest_streak,
				current_level,
				users_profile:user_id (
					name,
					email,
					avatar_id
				)
			`)
			.order('daily_streak', { ascending: false })
			.limit(100)

		if (streakError) throw streakError

		// 3. Récupérer le top 100 par Gold
		const { data: topGold, error: goldError } = await supabase
			.from('user_xp_profile')
			.select(`
				user_id,
				total_gold,
				current_level,
				users_profile:user_id (
					name,
					email,
					avatar_id
				)
			`)
			.order('total_gold', { ascending: false })
			.limit(100)

		if (goldError) throw goldError

		// 3.5. Récupérer le top 100 par XP hebdomadaire
		let topWeekly = null
		if (weekStart) {
			const { data, error: weeklyError } = await supabase
				.from('weekly_xp_tracking')
				.select('user_id, weekly_xp, week_start, week_end')
				.eq('week_start', weekStart)
				.order('weekly_xp', { ascending: false })
				.limit(100)

			if (weeklyError) {
				console.warn('Weekly leaderboard fetch failed:', weeklyError)
			} else if (data && data.length > 0) {
				// Récupérer les profils utilisateur séparément
				const userIds = data.map((entry) => entry.user_id)
				const { data: profiles } = await supabase
					.from('users_profile')
					.select('id, name, email, avatar_id')
					.in('id', userIds)

				// Joindre les données
				topWeekly = data.map((entry) => {
					const profile = profiles?.find((p) => p.id === entry.user_id)
					return {
						...entry,
						users_profile: profile || null,
					}
				})
			} else {
				topWeekly = data
			}
		}

		// 3.6. Récupérer le top 100 par XP mensuel
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
			console.log('🔍 Fetching monthly leaderboard with month_start:', monthStart)

			const { data, error: monthlyError } = await supabase
				.from('monthly_xp_tracking')
				.select('user_id, monthly_xp, month_start, month_end')
				.eq('month_start', monthStart)
				.order('monthly_xp', { ascending: false })
				.limit(100)

			console.log('📊 Monthly data fetched:', data)

			if (monthlyError) {
				console.warn('Monthly leaderboard fetch failed:', monthlyError)
			} else if (data && data.length > 0) {
				// Récupérer les profils utilisateur séparément
				const userIds = data.map((entry) => entry.user_id)
				const { data: profiles } = await supabase
					.from('users_profile')
					.select('id, name, email, avatar_id')
					.in('id', userIds)

				// Joindre les données
				topMonthly = data.map((entry) => {
					const profile = profiles?.find((p) => p.id === entry.user_id)
					return {
						...entry,
						users_profile: profile || null,
					}
				})
			} else {
				topMonthly = data
			}
		}

		// 4. Trouver le rang de l'utilisateur actuel dans chaque classement
		const { data: userProfile } = await supabase
			.from('user_xp_profile')
			.select('total_xp, daily_streak, total_gold, current_level')
			.eq('user_id', user.id)
			.single()

		let userRankXp = null
		let userRankStreak = null
		let userRankGold = null
		let userRankWeekly = null
		let userRankMonthly = null

		if (userProfile) {
			// Rang XP
			const { count: xpRank } = await supabase
				.from('user_xp_profile')
				.select('*', { count: 'exact', head: true })
				.gt('total_xp', userProfile.total_xp)
			userRankXp = (xpRank || 0) + 1

			// Rang Streak
			const { count: streakRank } = await supabase
				.from('user_xp_profile')
				.select('*', { count: 'exact', head: true })
				.gt('daily_streak', userProfile.daily_streak)
			userRankStreak = (streakRank || 0) + 1

			// Rang Gold
			const { count: goldRank } = await supabase
				.from('user_xp_profile')
				.select('*', { count: 'exact', head: true })
				.gt('total_gold', userProfile.total_gold || 0)
			userRankGold = (goldRank || 0) + 1

			// Rang hebdomadaire
			if (weekStart) {
				const { data: userWeekly } = await supabase
					.from('weekly_xp_tracking')
					.select('weekly_xp')
					.eq('user_id', user.id)
					.eq('week_start', weekStart)
					.single()

				if (userWeekly) {
					const { count: weeklyRank } = await supabase
						.from('weekly_xp_tracking')
						.select('*', { count: 'exact', head: true })
						.eq('week_start', weekStart)
						.gt('weekly_xp', userWeekly.weekly_xp || 0)
					userRankWeekly = (weeklyRank || 0) + 1
				}
			}

			// Rang mensuel
			if (monthStart) {
				const { data: userMonthly } = await supabase
					.from('monthly_xp_tracking')
					.select('monthly_xp')
					.eq('user_id', user.id)
					.eq('month_start', monthStart)
					.single()

				if (userMonthly) {
					const { count: monthlyRank } = await supabase
						.from('monthly_xp_tracking')
						.select('*', { count: 'exact', head: true })
						.eq('month_start', monthStart)
						.gt('monthly_xp', userMonthly.monthly_xp || 0)
					userRankMonthly = (monthlyRank || 0) + 1
				}
			}
		}

		// Formater les données
		const formatLeaderboard = (data, valueKey) => {
			if (!data) return []
			return data.map((entry, index) => ({
				rank: index + 1,
				userId: entry.user_id,
				username: entry.users_profile?.name || entry.users_profile?.email || 'Anonymous',
				avatar_id: entry.users_profile?.avatar_id || 'avatar1',
				avatarId: entry.users_profile?.avatar_id || 'avatar1',
				value: entry[valueKey],
				level: entry.current_level || null,
				isCurrentUser: entry.user_id === user.id,
			}))
		}

		return res.status(200).json({
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
		})
	} catch (error) {
		console.error('Error fetching leaderboard:', error)
		return res.status(500).json({ error: 'Failed to fetch leaderboard' })
	}
}
