import { createClient } from '@supabase/supabase-js'

/**
 * Get user statistics (materials, words reviewed, etc.)
 * @param {string} userId - The user's ID
 * @returns {Object} Statistics data
 */
export async function getStatistics(userId) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY
	)

	try {
		// 1. Materials started (is_being_studied = true)
		const { count: startedCount, error: startedError } = await supabase
			.from('user_materials')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', userId)
			.eq('is_being_studied', true)

		if (startedError) throw startedError

		// 2. Materials finished (is_studied = true)
		const { count: finishedCount, error: finishedError } = await supabase
			.from('user_materials')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', userId)
			.eq('is_studied', true)

		if (finishedError) throw finishedError

		// 3. Define time periods
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1)

		const weekStart = new Date()
		weekStart.setDate(weekStart.getDate() - weekStart.getDay())
		weekStart.setHours(0, 0, 0, 0)

		const monthStart = new Date()
		monthStart.setDate(1)
		monthStart.setHours(0, 0, 0, 0)

		// 3a. Words reviewed today
		const { count: wordsReviewedToday, error: wordsError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', userId)
			.gte('last_review_date', today.toISOString())
			.lt('last_review_date', tomorrow.toISOString())

		if (wordsError) throw wordsError

		// 3b. Words reviewed this week
		const { count: wordsReviewedThisWeek, error: wordsReviewedWeekError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', userId)
			.gte('last_review_date', weekStart.toISOString())

		if (wordsReviewedWeekError) throw wordsReviewedWeekError

		// 3c. Words reviewed this month
		const { count: wordsReviewedThisMonth, error: wordsReviewedMonthError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', userId)
			.gte('last_review_date', monthStart.toISOString())

		if (wordsReviewedMonthError) throw wordsReviewedMonthError

		// 3d. Total words reviewed (at least once)
		const { count: totalWordsReviewed, error: totalReviewedError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', userId)
			.not('last_review_date', 'is', null)

		if (totalReviewedError) throw totalReviewedError

		// 4. Total words in dictionary
		const { count: totalWords, error: totalWordsError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', userId)

		if (totalWordsError) throw totalWordsError

		// 5. Words added today
		const { count: wordsAddedToday, error: wordsAddedTodayError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', userId)
			.gte('created_at', today.toISOString())
			.lt('created_at', tomorrow.toISOString())

		if (wordsAddedTodayError) throw wordsAddedTodayError

		// 8. Words added this week
		const { count: wordsAddedThisWeek, error: wordsAddedWeekError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', userId)
			.gte('created_at', weekStart.toISOString())

		if (wordsAddedWeekError) throw wordsAddedWeekError

		// 9. Words added this month
		const { count: wordsAddedThisMonth, error: wordsAddedMonthError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', userId)
			.gte('created_at', monthStart.toISOString())

		if (wordsAddedMonthError) throw wordsAddedMonthError

		return {
			materialsStarted: startedCount || 0,
			materialsFinished: finishedCount || 0,
			wordsReviewedToday: wordsReviewedToday || 0,
			wordsReviewedThisWeek: wordsReviewedThisWeek || 0,
			wordsReviewedThisMonth: wordsReviewedThisMonth || 0,
			totalWordsReviewed: totalWordsReviewed || 0,
			totalWords: totalWords || 0,
			wordsAddedToday: wordsAddedToday || 0,
			wordsAddedThisWeek: wordsAddedThisWeek || 0,
			wordsAddedThisMonth: wordsAddedThisMonth || 0,
		}
	} catch (error) {
		console.error('Error fetching statistics:', error)
		throw error
	}
}

/**
 * Helper function to get or create a goal for a specific period
 */
async function getOrCreateGoal(supabase, userId, goalType, periodStart, periodEnd, defaultTargetXp) {
	// Check for existing goal for this exact period
	const { data: existingGoal } = await supabase
		.from('user_goals')
		.select('*')
		.eq('user_id', userId)
		.eq('goal_type', goalType)
		.eq('period_start', periodStart)
		.eq('period_end', periodEnd)
		.single()

	if (existingGoal) {
		// Goal exists → use the frozen target_xp
		return existingGoal
	}

	// Create new goal with current target_xp (which will be frozen)
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
 * Award Gold bonus when a goal is achieved
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

		// 1. Get Gold reward config for this action
		const { data: rewardConfig } = await supabase
			.from('xp_rewards_config')
			.select('gold_amount')
			.eq('action_type', actionType)
			.single()

		if (!rewardConfig || !rewardConfig.gold_amount) {
			console.error(`Reward config not found for ${actionType}`)
			return
		}

		// 2. Get current XP profile
		const { data: xpProfile } = await supabase
			.from('user_xp_profile')
			.select('total_gold')
			.eq('user_id', userId)
			.single()

		if (!xpProfile) return

		// 3. Calculate new total gold
		const newTotalGold = (xpProfile.total_gold || 0) + rewardConfig.gold_amount

		// 4. Update only Gold
		await supabase
			.from('user_xp_profile')
			.update({
				total_gold: newTotalGold,
			})
			.eq('user_id', userId)

		// 5. Create transaction (0 XP, only Gold)
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

		// 6. Mark as rewarded in user_goals (for weekly/monthly)
		if (goalId) {
			await supabase
				.from('user_goals')
				.update({ reward_given: true })
				.eq('id', goalId)
		}

		console.log(`🎉 ${goalType} bonus awarded: +${rewardConfig.gold_amount} Gold`)
	} catch (error) {
		console.error(`Error awarding ${goalType} goal bonus:`, error)
	}
}

/**
 * Get user goals (daily, weekly, monthly)
 * @param {string} userId - The user's ID
 * @returns {Object} Goals data
 */
export async function getGoals(userId) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY
	)

	try {
		// 1. Get current daily_xp_goal
		const { data: profile, error: profileError } = await supabase
			.from('users_profile')
			.select('daily_xp_goal')
			.eq('id', userId)
			.single()

		if (profileError) throw profileError

		const dailyGoalTarget = profile?.daily_xp_goal || 100

		// 2. DAILY GOAL (always calculated dynamically)
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const todayStr = today.toISOString().split('T')[0]

		const { data: todayTransactions } = await supabase
			.from('xp_transactions')
			.select('xp_amount, source_type')
			.eq('user_id', userId)
			.gte('created_at', today.toISOString())

		const dailyCurrentXp = todayTransactions?.reduce(
			(sum, t) => sum + t.xp_amount,
			0
		) || 0

		// Check if daily goal achieved and not yet rewarded
		const dailyCompleted = dailyCurrentXp >= dailyGoalTarget
		const dailyRewardGiven = todayTransactions?.some(t => t.source_type === 'daily_goal_achieved')

		if (dailyGoalTarget > 0 && dailyCompleted && !dailyRewardGiven) {
			await awardGoalBonus(supabase, userId, 'daily', null)
		}

		// 3. WEEKLY GOAL (frozen at the start of the week)
		const weekStart = new Date()
		const dayOfWeek = weekStart.getDay()
		const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
		weekStart.setDate(weekStart.getDate() - diff)
		weekStart.setHours(0, 0, 0, 0)
		const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)

		const weeklyGoal = await getOrCreateGoal(
			supabase,
			userId,
			'weekly',
			weekStart.toISOString().split('T')[0],
			weekEnd.toISOString().split('T')[0],
			dailyGoalTarget * 7
		)

		// Calculate current weekly XP
		const { data: weeklyTracking } = await supabase
			.from('weekly_xp_tracking')
			.select('weekly_xp')
			.eq('user_id', userId)
			.eq('week_start', weekStart.toISOString().split('T')[0])
			.single()

		let weeklyCurrentXp = weeklyTracking?.weekly_xp || 0

		if (!weeklyTracking) {
			const { data: weekTransactions } = await supabase
				.from('xp_transactions')
				.select('xp_amount')
				.eq('user_id', userId)
				.gte('created_at', weekStart.toISOString())

			weeklyCurrentXp = weekTransactions?.reduce((sum, t) => sum + t.xp_amount, 0) || 0
		}

		// Update current_xp in user_goals
		const weeklyCompleted = weeklyCurrentXp >= weeklyGoal.target_xp
		if (weeklyGoal) {
			await supabase
				.from('user_goals')
				.update({
					current_xp: weeklyCurrentXp,
					is_completed: weeklyCompleted
				})
				.eq('id', weeklyGoal.id)

			// Award bonus if goal achieved and not yet rewarded
			if (weeklyCompleted && !weeklyGoal.reward_given) {
				await awardGoalBonus(supabase, userId, 'weekly', weeklyGoal.id)
			}
		}

		// 4. MONTHLY GOAL (frozen at the start of the month)
		const monthStart = new Date()
		monthStart.setDate(1)
		monthStart.setHours(0, 0, 0, 0)
		const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
		const daysInMonth = monthEnd.getDate()

		const monthlyGoal = await getOrCreateGoal(
			supabase,
			userId,
			'monthly',
			monthStart.toISOString().split('T')[0],
			monthEnd.toISOString().split('T')[0],
			dailyGoalTarget * daysInMonth
		)

		// Calculate current monthly XP
		const { data: monthlyTracking } = await supabase
			.from('monthly_xp_tracking')
			.select('monthly_xp')
			.eq('user_id', userId)
			.eq('month_start', monthStart.toISOString().split('T')[0])
			.single()

		let monthlyCurrentXp = monthlyTracking?.monthly_xp || 0

		if (!monthlyTracking) {
			const { data: monthTransactions } = await supabase
				.from('xp_transactions')
				.select('xp_amount')
				.eq('user_id', userId)
				.gte('created_at', monthStart.toISOString())

			monthlyCurrentXp = monthTransactions?.reduce((sum, t) => sum + t.xp_amount, 0) || 0
		}

		// Update current_xp in user_goals
		const monthlyCompleted = monthlyCurrentXp >= monthlyGoal.target_xp
		if (monthlyGoal) {
			await supabase
				.from('user_goals')
				.update({
					current_xp: monthlyCurrentXp,
					is_completed: monthlyCompleted
				})
				.eq('id', monthlyGoal.id)

			// Award bonus if goal achieved and not yet rewarded
			if (monthlyCompleted && !monthlyGoal.reward_given) {
				await awardGoalBonus(supabase, userId, 'monthly', monthlyGoal.id)
			}
		}

		// 5. Build response
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

		return goals
	} catch (error) {
		console.error('Error fetching goals:', error)
		throw error
	}
}
