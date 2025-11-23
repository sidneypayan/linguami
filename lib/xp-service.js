/**
 * XP Service - Business logic for XP/Gold/Streaks/Achievements
 * Extracted from API route for use with Server Actions
 */

import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { logger } from '@/utils/logger'

/**
 * Add XP to a user's profile
 * @param {Object} params
 * @param {string} params.actionType - Type of action (e.g., 'flashcard_good', 'material_completed', 'word_added')
 * @param {string} [params.sourceId] - Optional source ID (material ID, word ID, etc.)
 * @param {string} [params.description] - Optional description
 * @param {number} [params.customXp] - Optional custom XP amount (overrides config)
 * @returns {Promise<Object>} XP transaction result with achievements
 */
export async function addXP({ actionType, sourceId = null, description = null, customXp = null }) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Verify authentication
	const { data: { user }, error: authError } = await supabase.auth.getUser()

	if (!user || authError) {
		throw new Error('Unauthorized')
	}

	if (!actionType) {
		throw new Error('actionType is required')
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
			// 1. Fetch XP and Gold configuration for this action
			const { data: config, error: configError } = await supabase
				.from('xp_rewards_config')
				.select('xp_amount, gold_amount, is_active')
				.eq('action_type', actionType)
				.single()

			if (configError || !config) {
				throw new Error('Action type not found')
			}

			if (!config.is_active) {
				throw new Error('This action type is not active')
			}

			xpAmount = config.xp_amount
			goldAmount = config.gold_amount || 0
		}

		// 2. Get or create user XP profile
		let { data: profile, error: profileError } = await supabase
			.from('user_xp_profile')
			.select('*')
			.eq('user_id', user.id)
			.single()

		if (profileError && profileError.code !== 'PGRST116') {
			// PGRST116 = no rows returned
			throw profileError
		}

		// Create profile if it doesn't exist
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

		// 3. Calculate new total XP and Gold
		const newTotalXp = profile.total_xp + xpAmount
		const newTotalGold = (profile.total_gold || 0) + goldAmount

		// 4. Calculate new XP level
		const { data: levelData } = await supabase.rpc('calculate_level_from_xp', {
			total_xp: newTotalXp,
		})

		const newLevel = levelData[0].level
		const xpInLevel = levelData[0].xp_in_level
		const leveledUp = newLevel > profile.current_level

		// 5. Handle streak
		const today = new Date().toISOString().split('T')[0]
		const lastActivityDate = profile.last_activity_date
		let newStreak = profile.daily_streak
		let newLongestStreak = profile.longest_streak
		let streakChanged = false // Track if streak was updated today

		if (lastActivityDate !== today) {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)
			const yesterdayStr = yesterday.toISOString().split('T')[0]

			if (lastActivityDate === yesterdayStr) {
				// Continue streak
				newStreak += 1
			} else {
				// Reset streak
				newStreak = 1
			}

			// Update longest streak
			if (newStreak > newLongestStreak) {
				newLongestStreak = newStreak
			}

			streakChanged = true // Mark that streak was updated
		}

		// 6. Update XP and Gold profile
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

		// 6.5. Update weekly tracking
		const { data: weeklyData, error: weeklyError } = await supabase.rpc('update_weekly_xp', {
			p_user_id: user.id,
			p_xp_amount: xpAmount,
		})

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

		// 6.6. Update monthly tracking
		const { data: monthlyData, error: monthlyError } = await supabase.rpc('update_monthly_xp', {
			p_user_id: user.id,
			p_xp_amount: xpAmount,
		})

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

		// 7. Create XP and Gold transaction
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

		// 8. Update current goals progress
		const { error: goalsError } = await supabase.rpc('update_user_goals_progress', {
			p_user_id: user.id,
			p_xp_amount: xpAmount,
		})

		// Ignore goals errors if function doesn't exist yet

		// 9. Check for achievements (only streak milestones)
		const achievements = []

		// Achievement for streak milestones only (and only when streak changed today)
		if (streakChanged && [3, 7, 30, 100].includes(newStreak)) {
			achievements.push({
				type: `streak_${newStreak}_days`,
				streak: newStreak,
			})
		}

		// Note: level_up, daily/weekly/monthly goal achievements removed
		// These are no longer automatically awarded

		return {
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
		}
	} catch (error) {
		logger.error('Error adding XP:', error)
		throw error
	}
}
