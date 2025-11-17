'use server'

/**
 * Server Actions for XP/Gamification
 * Used with React Query hooks on the client side
 */

import { addXP } from '@/lib/xp-service'
import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { logger } from '@/utils/logger'

/**
 * Add XP to user's profile
 * @param {Object} params
 * @param {string} params.actionType - Type of action (e.g., 'flashcard_good', 'material_completed', 'word_added')
 * @param {string} [params.sourceId] - Optional source ID (material ID, word ID, etc.)
 * @param {string} [params.description] - Optional description
 * @param {number} [params.customXp] - Optional custom XP amount (overrides config)
 * @returns {Promise<Object>} XP transaction result with achievements
 */
export async function addXPAction({ actionType, sourceId, description, customXp }) {
	try {
		const result = await addXP({
			actionType,
			sourceId,
			description,
			customXp,
		})
		return { success: true, data: result }
	} catch (error) {
		logger.error('addXPAction error:', error)
		return {
			success: false,
			error: error.message || 'Failed to add XP',
		}
	}
}

/**
 * Get user's XP profile with stats, transactions, and achievements
 * @returns {Promise<Object>} XP profile data
 */
export async function getXPProfileAction() {
	try {
		const cookieStore = await cookies()
		const supabase = createServerClient(cookieStore)

		// Verify authentication
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser()

		if (!user || authError) {
			throw new Error('Unauthorized')
		}

		// 1. Get XP profile
		let { data: profile, error: profileError } = await supabase
			.from('user_xp_profile')
			.select('*')
			.eq('user_id', user.id)
			.single()

		if (profileError && profileError.code !== 'PGRST116') {
			throw profileError
		}

		// Create default profile if it doesn't exist
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

		// 2. Calculate XP needed for next level
		const { data: nextLevelXp } = await supabase.rpc('get_xp_for_level', {
			level: profile.current_level,
		})

		// 3. Calculate progress percentage
		const progressPercent = Math.floor((profile.xp_in_current_level / nextLevelXp) * 100)

		// 4. Get recent transactions (last 10)
		const { data: recentTransactions, error: transError } = await supabase
			.from('xp_transactions')
			.select('*')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false })
			.limit(10)

		if (transError) throw transError

		// 5. Get achievements
		const { data: achievements, error: achievementsError } = await supabase
			.from('user_achievements')
			.select('*')
			.eq('user_id', user.id)
			.order('unlocked_at', { ascending: false })

		if (achievementsError) throw achievementsError

		// 6. Calculate today's XP and Gold
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const { data: todayTransactions } = await supabase
			.from('xp_transactions')
			.select('xp_amount, gold_earned')
			.eq('user_id', user.id)
			.gte('created_at', today.toISOString())

		const xpTodayTotal = todayTransactions?.reduce((sum, t) => sum + t.xp_amount, 0) || 0

		const goldTodayTotal =
			todayTransactions?.reduce((sum, t) => sum + (t.gold_earned || 0), 0) || 0

		// 7. Calculate this week's XP and Gold
		const weekStart = new Date()
		weekStart.setDate(weekStart.getDate() - weekStart.getDay())
		weekStart.setHours(0, 0, 0, 0)
		const { data: weekTransactions } = await supabase
			.from('xp_transactions')
			.select('xp_amount, gold_earned')
			.eq('user_id', user.id)
			.gte('created_at', weekStart.toISOString())

		const xpWeekTotal = weekTransactions?.reduce((sum, t) => sum + t.xp_amount, 0) || 0

		const goldWeekTotal =
			weekTransactions?.reduce((sum, t) => sum + (t.gold_earned || 0), 0) || 0

		return {
			success: true,
			data: {
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
			},
		}
	} catch (error) {
		logger.error('getXPProfileAction error:', error)
		return {
			success: false,
			error: error.message || 'Failed to fetch XP profile',
		}
	}
}
