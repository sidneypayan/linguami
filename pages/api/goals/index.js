import { createServerClient } from '@supabase/ssr'

/**
 * API endpoint pour gérer les objectifs XP de l'utilisateur
 *
 * GET /api/goals - Récupérer les objectifs actifs (quotidien, hebdomadaire, mensuel)
 *   - Objectif quotidien: basé sur users_profile.daily_xp_goal (50, 100, 200, 300, ou 0)
 *   - Objectif hebdomadaire: daily_xp_goal × 7
 *   - Objectif mensuel: daily_xp_goal × 30
 *   - Progression calculée en temps réel depuis xp_transactions
 *
 * POST /api/goals - Mettre à jour l'objectif quotidien
 *   Body: { goalType: 'daily', targetXp: number }
 *   - Met à jour users_profile.daily_xp_goal
 *   - Les objectifs hebdomadaire et mensuel se recalculent automatiquement
 */
export default async function handler(req, res) {
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

	if (req.method === 'GET') {
		return handleGet(req, res, supabase, user)
	} else if (req.method === 'POST') {
		return handlePost(req, res, supabase, user)
	} else {
		return res.status(405).json({ error: 'Method not allowed' })
	}
}

/**
 * GET - Récupérer les objectifs actifs de l'utilisateur
 * Les objectifs hebdo/mensuel sont FIGÉS au début de chaque période
 */
async function handleGet(req, res, supabase, user) {
	try {
		// 1. Récupérer le daily_xp_goal actuel
		const { data: profile, error: profileError } = await supabase
			.from('users_profile')
			.select('daily_xp_goal')
			.eq('id', user.id)
			.single()

		if (profileError) throw profileError

		const dailyGoalTarget = profile?.daily_xp_goal || 100

		// 2. OBJECTIF QUOTIDIEN (toujours calculé dynamiquement)
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const todayStr = today.toISOString().split('T')[0]

		const { data: todayTransactions } = await supabase
			.from('xp_transactions')
			.select('xp_amount, source_type')
			.eq('user_id', user.id)
			.gte('created_at', today.toISOString())

		const dailyCurrentXp = todayTransactions?.reduce(
			(sum, t) => sum + t.xp_amount,
			0
		) || 0

		// Vérifier si objectif quotidien atteint et pas encore récompensé
		const dailyCompleted = dailyCurrentXp >= dailyGoalTarget
		const dailyRewardGiven = todayTransactions?.some(t => t.source_type === 'daily_goal_achieved')

		if (dailyGoalTarget > 0 && dailyCompleted && !dailyRewardGiven) {
			await awardGoalBonus(supabase, user.id, 'daily', null)
		}

		// 3. OBJECTIF HEBDOMADAIRE (figé au début de la semaine)
		const weekStart = new Date()
		const dayOfWeek = weekStart.getDay()
		const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
		weekStart.setDate(weekStart.getDate() - diff)
		weekStart.setHours(0, 0, 0, 0)
		const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)

		const weeklyGoal = await getOrCreateGoal(
			supabase,
			user.id,
			'weekly',
			weekStart.toISOString().split('T')[0],
			weekEnd.toISOString().split('T')[0],
			dailyGoalTarget * 7
		)

		// Calculer XP hebdo actuel
		const { data: weeklyTracking } = await supabase
			.from('weekly_xp_tracking')
			.select('weekly_xp')
			.eq('user_id', user.id)
			.eq('week_start', weekStart.toISOString().split('T')[0])
			.single()

		let weeklyCurrentXp = weeklyTracking?.weekly_xp || 0

		if (!weeklyTracking) {
			const { data: weekTransactions } = await supabase
				.from('xp_transactions')
				.select('xp_amount')
				.eq('user_id', user.id)
				.gte('created_at', weekStart.toISOString())

			weeklyCurrentXp = weekTransactions?.reduce((sum, t) => sum + t.xp_amount, 0) || 0
		}

		// Mettre à jour current_xp dans user_goals
		const weeklyCompleted = weeklyCurrentXp >= weeklyGoal.target_xp
		if (weeklyGoal) {
			await supabase
				.from('user_goals')
				.update({
					current_xp: weeklyCurrentXp,
					is_completed: weeklyCompleted
				})
				.eq('id', weeklyGoal.id)

			// Attribuer le bonus si objectif atteint et pas encore récompensé
			if (weeklyCompleted && !weeklyGoal.reward_given) {
				await awardGoalBonus(supabase, user.id, 'weekly', weeklyGoal.id)
			}
		}

		// 4. OBJECTIF MENSUEL (figé au début du mois)
		const monthStart = new Date()
		monthStart.setDate(1)
		monthStart.setHours(0, 0, 0, 0)
		const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
		const daysInMonth = monthEnd.getDate()

		const monthlyGoal = await getOrCreateGoal(
			supabase,
			user.id,
			'monthly',
			monthStart.toISOString().split('T')[0],
			monthEnd.toISOString().split('T')[0],
			dailyGoalTarget * daysInMonth
		)

		// Calculer XP mensuel actuel
		const { data: monthlyTracking } = await supabase
			.from('monthly_xp_tracking')
			.select('monthly_xp')
			.eq('user_id', user.id)
			.eq('month_start', monthStart.toISOString().split('T')[0])
			.single()

		let monthlyCurrentXp = monthlyTracking?.monthly_xp || 0

		if (!monthlyTracking) {
			const { data: monthTransactions } = await supabase
				.from('xp_transactions')
				.select('xp_amount')
				.eq('user_id', user.id)
				.gte('created_at', monthStart.toISOString())

			monthlyCurrentXp = monthTransactions?.reduce((sum, t) => sum + t.xp_amount, 0) || 0
		}

		// Mettre à jour current_xp dans user_goals
		const monthlyCompleted = monthlyCurrentXp >= monthlyGoal.target_xp
		if (monthlyGoal) {
			await supabase
				.from('user_goals')
				.update({
					current_xp: monthlyCurrentXp,
					is_completed: monthlyCompleted
				})
				.eq('id', monthlyGoal.id)

			// Attribuer le bonus si objectif atteint et pas encore récompensé
			if (monthlyCompleted && !monthlyGoal.reward_given) {
				await awardGoalBonus(supabase, user.id, 'monthly', monthlyGoal.id)
			}
		}

		// 5. Construire la réponse
		const goals = {
			daily: dailyGoalTarget > 0 ? {
				target_xp: dailyGoalTarget,
				current_xp: dailyCurrentXp,
				is_completed: dailyCurrentXp >= dailyGoalTarget,
				period_start: todayStr,
				period_end: todayStr,
			} : null,
			weekly: weeklyGoal ? {
				target_xp: weeklyGoal.target_xp,
				current_xp: weeklyCurrentXp,
				is_completed: weeklyCurrentXp >= weeklyGoal.target_xp,
				period_start: weeklyGoal.period_start,
				period_end: weeklyGoal.period_end,
			} : null,
			monthly: monthlyGoal ? {
				target_xp: monthlyGoal.target_xp,
				current_xp: monthlyCurrentXp,
				is_completed: monthlyCurrentXp >= monthlyGoal.target_xp,
				period_start: monthlyGoal.period_start,
				period_end: monthlyGoal.period_end,
			} : null,
		}

		return res.status(200).json({ goals })
	} catch (error) {
		console.error('Error fetching goals:', error)
		return res.status(500).json({ error: 'Failed to fetch goals' })
	}
}

/**
 * Récupérer ou créer un objectif pour une période donnée
 * Si l'objectif existe déjà → retourner le target_xp figé
 * Sinon → créer un nouveau goal avec le target_xp actuel
 */
async function getOrCreateGoal(supabase, userId, goalType, periodStart, periodEnd, defaultTargetXp) {
	// Chercher un goal existant pour cette période exacte
	const { data: existingGoal } = await supabase
		.from('user_goals')
		.select('*')
		.eq('user_id', userId)
		.eq('goal_type', goalType)
		.eq('period_start', periodStart)
		.eq('period_end', periodEnd)
		.single()

	if (existingGoal) {
		// Goal existe → utiliser le target_xp figé
		return existingGoal
	}

	// Créer un nouveau goal avec le target_xp actuel (qui sera figé)
	const { data: newGoal, error } = await supabase
		.from('user_goals')
		.insert({
			user_id: userId,
			goal_type: goalType,
			target_xp: defaultTargetXp,
			current_xp: 0,
			period_start: periodStart,
			period_end: periodEnd,
			is_completed: false,
		})
		.select()
		.single()

	if (error) {
		console.error('Error creating goal:', error)
		return null
	}

	return newGoal
}

/**
 * Attribuer le bonus Gold quand un objectif est atteint
 * Note: Uniquement de l'or, pas d'XP
 */
async function awardGoalBonus(supabase, userId, goalType, goalId) {
	try {
		const actionTypeMap = {
			daily: 'daily_goal_achieved',
			weekly: 'weekly_goal_achieved',
			monthly: 'monthly_goal_achieved',
		}

		const actionType = actionTypeMap[goalType]
		if (!actionType) return

		// 1. Récupérer la config Gold pour cette action
		const { data: rewardConfig } = await supabase
			.from('xp_rewards_config')
			.select('gold_amount')
			.eq('action_type', actionType)
			.single()

		if (!rewardConfig || !rewardConfig.gold_amount) {
			console.error(`Reward config not found for ${actionType}`)
			return
		}

		// 2. Récupérer le profil XP actuel
		const { data: xpProfile } = await supabase
			.from('user_xp_profile')
			.select('total_gold')
			.eq('user_id', userId)
			.single()

		if (!xpProfile) return

		// 3. Calculer le nouveau total d'or
		const newTotalGold = (xpProfile.total_gold || 0) + rewardConfig.gold_amount

		// 4. Mettre à jour uniquement le Gold
		await supabase
			.from('user_xp_profile')
			.update({
				total_gold: newTotalGold,
			})
			.eq('user_id', userId)

		// 5. Créer la transaction (0 XP, uniquement Gold)
		const goalTypeLabels = {
			daily: 'quotidien',
			weekly: 'hebdomadaire',
			monthly: 'mensuel',
		}

		await supabase
			.from('xp_transactions')
			.insert({
				user_id: userId,
				xp_amount: 0,
				gold_earned: rewardConfig.gold_amount,
				source_type: actionType,
				source_id: goalId ? goalId.toString() : null,
				description: `Objectif ${goalTypeLabels[goalType]} atteint ! 🎯`,
			})

		// 6. Marquer comme récompensé dans user_goals (pour hebdo/mensuel)
		if (goalId) {
			await supabase
				.from('user_goals')
				.update({ reward_given: true })
				.eq('id', goalId)
		}

		console.log(`🎉 Bonus ${goalType} attribué: +${rewardConfig.gold_amount} Gold`)
	} catch (error) {
		console.error(`Error awarding ${goalType} goal bonus:`, error)
	}
}

/**
 * POST - Créer ou mettre à jour un objectif
 */
async function handlePost(req, res, supabase, user) {
	const { goalType, targetXp } = req.body

	if (!goalType || !targetXp) {
		return res.status(400).json({ error: 'goalType and targetXp are required' })
	}

	if (!['daily', 'weekly', 'monthly'].includes(goalType)) {
		return res.status(400).json({ error: 'Invalid goalType. Must be daily, weekly, or monthly' })
	}

	if (targetXp < 0) {
		return res.status(400).json({ error: 'targetXp must be positive' })
	}

	try {
		// Pour l'objectif quotidien, on met à jour users_profile.daily_xp_goal
		if (goalType === 'daily') {
			const { error: updateError } = await supabase
				.from('users_profile')
				.update({ daily_xp_goal: targetXp })
				.eq('id', user.id)

			if (updateError) throw updateError

			return res.status(200).json({
				success: true,
				message: 'Daily goal updated successfully',
			})
		}

		// Pour weekly et monthly, ces objectifs sont calculés automatiquement
		// basés sur daily_xp_goal (7x et 30x respectivement)
		// Mais on pourrait permettre des objectifs personnalisés dans le futur

		return res.status(200).json({
			success: true,
			message: `${goalType} goals are calculated automatically based on daily goal (${goalType === 'weekly' ? '7x' : '30x'})`,
		})
	} catch (error) {
		console.error('Error creating/updating goal:', error)
		return res.status(500).json({ error: 'Failed to create/update goal' })
	}
}

