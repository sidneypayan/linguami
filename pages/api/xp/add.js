import { createServerClient } from '@supabase/ssr'
import { logger } from '@/utils/logger'

/**
 * API endpoint pour ajouter de l'XP à un utilisateur
 * POST /api/xp/add
 * Body: { actionType: string, sourceId?: string, description?: string }
 */
export default async function handler(req, res) {
	if (req.method !== 'POST') {
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

	const { actionType, sourceId, description, customXp } = req.body

	if (!actionType) {
		return res.status(400).json({ error: 'actionType is required' })
	}

	try {
		let xpAmount = 0
		let goldAmount = 0

		// If customXp is provided, use it and calculate gold automatically
		if (customXp !== undefined && customXp !== null) {
			xpAmount = customXp
			// Calculate gold using 10:1 ratio (10 XP = 1 Gold)
			goldAmount = Math.floor(customXp / 10)
		} else {
			// 1. Récupérer la configuration XP et Gold pour cette action
			const { data: config, error: configError } = await supabase
				.from('xp_rewards_config')
				.select('xp_amount, gold_amount, is_active')
				.eq('action_type', actionType)
				.single()

			if (configError || !config) {
				return res.status(404).json({ error: 'Action type not found' })
			}

			if (!config.is_active) {
				return res.status(400).json({ error: 'This action type is not active' })
			}

			xpAmount = config.xp_amount
			goldAmount = config.gold_amount || 0
		}

		// 2. Récupérer ou créer le profil XP de l'utilisateur
		let { data: profile, error: profileError } = await supabase
			.from('user_xp_profile')
			.select('*')
			.eq('user_id', user.id)
			.single()

		if (profileError && profileError.code !== 'PGRST116') {
			// PGRST116 = no rows returned
			throw profileError
		}

		// Créer le profil s'il n'existe pas
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

		// 3. Calculer le nouveau total XP et Gold
		const newTotalXp = profile.total_xp + xpAmount
		const newTotalGold = (profile.total_gold || 0) + goldAmount

		// 4. Calculer le nouveau niveau XP
		const { data: levelData } = await supabase.rpc('calculate_level_from_xp', {
			total_xp: newTotalXp,
		})

		const newLevel = levelData[0].level
		const xpInLevel = levelData[0].xp_in_level
		const leveledUp = newLevel > profile.current_level

		// 5. Gérer le streak
		const today = new Date().toISOString().split('T')[0]
		const lastActivityDate = profile.last_activity_date
		let newStreak = profile.daily_streak
		let newLongestStreak = profile.longest_streak

		if (lastActivityDate !== today) {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)
			const yesterdayStr = yesterday.toISOString().split('T')[0]

			if (lastActivityDate === yesterdayStr) {
				// Continuer le streak
				newStreak += 1
			} else {
				// Réinitialiser le streak
				newStreak = 1
			}

			// Mettre à jour le longest streak
			if (newStreak > newLongestStreak) {
				newLongestStreak = newStreak
			}
		}

		// 6. Mettre à jour le profil XP et Gold
		const { error: updateError } = await supabase
			.from('user_xp_profile')
			.update({
				total_xp: newTotalXp,
				current_level: newLevel,
				xp_in_current_level: xpInLevel,
				total_gold: newTotalGold,
				daily_streak: newStreak,
				longest_streak: newLongestStreak,
				last_activity_date: today,
			})
			.eq('user_id', user.id)

		if (updateError) throw updateError

		// 6.5. Mettre à jour le tracking hebdomadaire
		const { data: weeklyData, error: weeklyError } = await supabase.rpc('update_weekly_xp', {
			p_user_id: user.id,
			p_xp_amount: xpAmount,
		})
		// Ignorer l'erreur si la fonction n'existe pas encore
		if (weeklyError) {
			logger.error('❌ Weekly tracking update failed:', {
				error: weeklyError,
				message: weeklyError.message,
				details: weeklyError.details,
				hint: weeklyError.hint,
				code: weeklyError.code,
			})
		} else {
			logger.log('✅ Weekly tracking updated successfully:', weeklyData)
		}

		// 6.6. Mettre à jour le tracking mensuel
		const { data: monthlyData, error: monthlyError } = await supabase.rpc('update_monthly_xp', {
			p_user_id: user.id,
			p_xp_amount: xpAmount,
		})
		// Ignorer l'erreur si la fonction n'existe pas encore
		if (monthlyError) {
			logger.error('❌ Monthly tracking update failed:', {
				error: monthlyError,
				message: monthlyError.message,
				details: monthlyError.details,
				hint: monthlyError.hint,
				code: monthlyError.code,
			})
		} else {
			logger.log('✅ Monthly tracking updated successfully:', monthlyData)
		}

		// 7. Créer une transaction XP et Gold
		const { error: transactionError } = await supabase
			.from('xp_transactions')
			.insert({
				user_id: user.id,
				xp_amount: xpAmount,
				gold_earned: goldAmount,
				source_type: actionType,
				source_id: sourceId || null,
				description: description || null,
			})

		if (transactionError) throw transactionError

		// 8. Mettre à jour les objectifs en cours
		const { error: goalsError } = await supabase.rpc('update_user_goals_progress', {
			p_user_id: user.id,
			p_xp_amount: xpAmount,
		})

		// Ignorer les erreurs de goals si la fonction n'existe pas encore
		// (sera créée dans la prochaine migration)

		// 9. Vérifier les achievements
		const achievements = []

		// Achievement pour level up
		if (leveledUp) {
			achievements.push({
				type: 'level_up',
				level: newLevel,
			})
		}

		// Achievement pour streak
		if ([3, 7, 30, 100].includes(newStreak)) {
			achievements.push({
				type: `streak_${newStreak}_days`,
				streak: newStreak,
			})
		}

		// 10. Vérifier les objectifs atteints (quotidien, hebdomadaire, mensuel)
		try {
			// Récupérer l'objectif quotidien de l'utilisateur
			const { data: userGoalProfile } = await supabase
				.from('users_profile')
				.select('daily_xp_goal')
				.eq('id', user.id)
				.single()

			const dailyGoalTarget = userGoalProfile?.daily_xp_goal || 100

			// Vérifier l'XP d'aujourd'hui
			const today = new Date().toISOString().split('T')[0]
			const { data: todayXp } = await supabase.rpc('get_daily_xp', {
				p_user_id: user.id,
				p_date: today,
			})

			const dailyXpEarned = todayXp && todayXp.length > 0 ? todayXp[0].daily_xp : 0

			// Vérifier si l'objectif quotidien vient d'être atteint
			const previousDailyXp = dailyXpEarned - xpAmount
			const justCompletedDaily = previousDailyXp < dailyGoalTarget && dailyXpEarned >= dailyGoalTarget

			if (justCompletedDaily && dailyGoalTarget > 0) {
				achievements.push({
					type: 'daily_goal_achieved',
					goldEarned: 1,
				})
			}

			// Vérifier les objectifs hebdomadaire et mensuel
			const { data: weekBounds } = await supabase.rpc('get_week_bounds')
			const { data: monthBounds } = await supabase.rpc('get_month_bounds')

			if (weekBounds && weekBounds.length > 0) {
				const weekStart = weekBounds[0].week_start
				const { data: weeklyGoal } = await supabase
					.from('user_goals')
					.select('*')
					.eq('user_id', user.id)
					.eq('goal_type', 'weekly')
					.eq('period_start', weekStart)
					.single()

				if (weeklyGoal) {
					const { data: weeklyXp } = await supabase
						.from('weekly_xp_tracking')
						.select('weekly_xp')
						.eq('user_id', user.id)
						.eq('week_start', weekStart)
						.single()

					const currentWeeklyXp = weeklyXp?.weekly_xp || 0
					const previousWeeklyXp = currentWeeklyXp - xpAmount
					const justCompletedWeekly = previousWeeklyXp < weeklyGoal.target_value && currentWeeklyXp >= weeklyGoal.target_value

					if (justCompletedWeekly && weeklyGoal.target_value > 0) {
						achievements.push({
							type: 'weekly_goal_achieved',
							goldEarned: 3,
						})
					}
				}
			}

			if (monthBounds && monthBounds.length > 0) {
				const monthStart = monthBounds[0].month_start
				const { data: monthlyGoal } = await supabase
					.from('user_goals')
					.select('*')
					.eq('user_id', user.id)
					.eq('goal_type', 'monthly')
					.eq('period_start', monthStart)
					.single()

				if (monthlyGoal) {
					const { data: monthlyXp } = await supabase
						.from('monthly_xp_tracking')
						.select('monthly_xp')
						.eq('user_id', user.id)
						.eq('month_start', monthStart)
						.single()

					const currentMonthlyXp = monthlyXp?.monthly_xp || 0
					const previousMonthlyXp = currentMonthlyXp - xpAmount
					const justCompletedMonthly = previousMonthlyXp < monthlyGoal.target_value && currentMonthlyXp >= monthlyGoal.target_value

					if (justCompletedMonthly && monthlyGoal.target_value > 0) {
						achievements.push({
							type: 'monthly_goal_achieved',
							goldEarned: 10,
						})
					}
				}
			}
		} catch (goalsError) {
			logger.error('Error checking goals for achievements:', goalsError)
			// Don't fail the whole request if goals check fails
		}

		return res.status(200).json({
			success: true,
			xpGained: xpAmount,
			goldGained: goldAmount,
			totalXp: newTotalXp,
			totalGold: newTotalGold,
			currentLevel: newLevel,
			xpInCurrentLevel: xpInLevel,
			leveledUp,
			streak: newStreak,
			longestStreak: newLongestStreak,
			achievements,
		})
	} catch (error) {
		logger.error('Error adding XP:', error)
		return res.status(500).json({ error: 'Failed to add XP' })
	}
}
