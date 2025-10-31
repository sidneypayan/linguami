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

		// 4. Trouver le rang de l'utilisateur actuel dans chaque classement
		const { data: userProfile } = await supabase
			.from('user_xp_profile')
			.select('total_xp, daily_streak, total_gold, current_level')
			.eq('user_id', user.id)
			.single()

		let userRankXp = null
		let userRankStreak = null
		let userRankGold = null

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
		}

		// Formater les données
		const formatLeaderboard = (data, valueKey) => {
			return data.map((entry, index) => ({
				rank: index + 1,
				userId: entry.user_id,
				username: entry.users_profile?.name || entry.users_profile?.email || 'Anonymous',
				avatar_id: entry.users_profile?.avatar_id || 'avatar1',
				value: entry[valueKey],
				level: entry.current_level,
				isCurrentUser: entry.user_id === user.id,
			}))
		}

		return res.status(200).json({
			topXp: formatLeaderboard(topXp, 'total_xp'),
			topStreak: formatLeaderboard(topStreak, 'daily_streak'),
			topGold: formatLeaderboard(topGold, 'total_gold'),
			userRanks: {
				xp: userRankXp,
				streak: userRankStreak,
				gold: userRankGold,
			},
			userStats: userProfile || null,
		})
	} catch (error) {
		console.error('Error fetching leaderboard:', error)
		return res.status(500).json({ error: 'Failed to fetch leaderboard' })
	}
}
