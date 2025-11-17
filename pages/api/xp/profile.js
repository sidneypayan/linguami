import { createServerClient } from '@supabase/ssr'
import { logger } from '@/utils/logger'

/**
 * API endpoint pour récupérer le profil XP de l'utilisateur
 * GET /api/xp/profile
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
		// 1. Récupérer le profil XP
		let { data: profile, error: profileError } = await supabase
			.from('user_xp_profile')
			.select('*')
			.eq('user_id', user.id)
			.single()

		if (profileError && profileError.code !== 'PGRST116') {
			throw profileError
		}

		// Créer un profil par défaut s'il n'existe pas
		if (!profile) {
			const { data: newProfile, error: createError } = await supabase
				.from('user_xp_profile')
				.insert({
					user_id: user.id,
					total_xp: 0,
					current_level: 1,
					xp_in_current_level: 0,
					daily_streak: 0,
					longest_streak: 0,
					last_activity_date: new Date().toISOString().split('T')[0],
				})
				.select()
				.single()

			if (createError) throw createError
			profile = newProfile
		}

		// 2. Calculer l'XP nécessaire pour le prochain niveau
		const { data: nextLevelXp } = await supabase.rpc('get_xp_for_level', {
			level: profile.current_level,
		})

		// 3. Calculer le pourcentage de progression
		const progressPercent = Math.floor(
			(profile.xp_in_current_level / nextLevelXp) * 100
		)

		// 4. Récupérer les transactions récentes (dernières 10)
		const { data: recentTransactions, error: transError } = await supabase
			.from('xp_transactions')
			.select('*')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false })
			.limit(10)

		if (transError) throw transError

		// 5. Récupérer les achievements
		const { data: achievements, error: achievementsError } = await supabase
			.from('user_achievements')
			.select('*')
			.eq('user_id', user.id)
			.order('unlocked_at', { ascending: false })

		if (achievementsError) throw achievementsError

		// 6. Calculer l'XP et Gold gagnés aujourd'hui
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const { data: todayTransactions } = await supabase
			.from('xp_transactions')
			.select('xp_amount, gold_earned')
			.eq('user_id', user.id)
			.gte('created_at', today.toISOString())

		const xpTodayTotal = todayTransactions?.reduce(
			(sum, t) => sum + t.xp_amount,
			0
		) || 0

		const goldTodayTotal = todayTransactions?.reduce(
			(sum, t) => sum + (t.gold_earned || 0),
			0
		) || 0

		// 7. Calculer l'XP et Gold de cette semaine
		const weekStart = new Date()
		weekStart.setDate(weekStart.getDate() - weekStart.getDay())
		weekStart.setHours(0, 0, 0, 0)
		const { data: weekTransactions } = await supabase
			.from('xp_transactions')
			.select('xp_amount, gold_earned')
			.eq('user_id', user.id)
			.gte('created_at', weekStart.toISOString())

		const xpWeekTotal = weekTransactions?.reduce(
			(sum, t) => sum + t.xp_amount,
			0
		) || 0

		const goldWeekTotal = weekTransactions?.reduce(
			(sum, t) => sum + (t.gold_earned || 0),
			0
		) || 0

		return res.status(200).json({
			profile: {
				userId: profile.user_id,
				totalXp: profile.total_xp,
				totalGold: profile.total_gold || 0,
				currentLevel: profile.current_level,
				xpInCurrentLevel: profile.xp_in_current_level,
				xpForNextLevel: nextLevelXp,
				progressPercent,
				dailyStreak: profile.daily_streak,
				longestStreak: profile.longest_streak,
				lastActivityDate: profile.last_activity_date,
			},
			stats: {
				xpToday: xpTodayTotal,
				xpThisWeek: xpWeekTotal,
				goldToday: goldTodayTotal,
				goldThisWeek: goldWeekTotal,
			},
			recentTransactions: recentTransactions || [],
			achievements: achievements || [],
		})
	} catch (error) {
		logger.error('Error fetching XP profile:', error)
		return res.status(500).json({ error: 'Failed to fetch XP profile' })
	}
}
