'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { logger } from '@/utils/logger'
import { z } from 'zod'

// Validation schema for exercise submission
const SubmitExerciseSchema = z.object({
	exerciseId: z.number().int().positive('Exercise ID must be a positive integer'),
	score: z.number().int().min(0).max(100, 'Score must be between 0 and 100'),
	completed: z.boolean()
})

/**
 * Submit an exercise attempt
 * @param {number} exerciseId - ID of the exercise
 * @param {number} score - Score achieved (0-100)
 * @param {boolean} completed - Whether the exercise was completed
 * @returns {Promise<Object>} { success, score, xpAwarded, goldAwarded, isFirstCompletion }
 */
export async function submitExerciseAction(exerciseId, score, completed) {
	try {
		const supabase = createServerClient(await cookies())

		// Get authenticated user
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser()

		if (!user || authError) {
			throw new Error('Unauthorized')
		}

		// Validate inputs with Zod
		const validationResult = SubmitExerciseSchema.safeParse({
			exerciseId,
			score,
			completed
		})

		if (!validationResult.success) {
			logger.error('Validation error in submitExerciseAction:', validationResult.error.errors)
			throw new Error('Invalid exercise submission data: ' + validationResult.error.errors[0].message)
		}

		const { exerciseId: validExerciseId, score: validScore, completed: validCompleted } = validationResult.data

		// Get exercise details
		const { data: exercise, error: exerciseError } = await supabase
			.from('exercises')
			.select('*')
			.eq('id', validExerciseId)
			.single()

		if (exerciseError || !exercise) {
			throw new Error('Exercise not found')
		}

		// Check if user has already completed this exercise
		const { data: existingProgress } = await supabase
			.from('user_exercise_progress')
			.select('*')
			.eq('user_id', user.id)
			.eq('exercise_id', validExerciseId)
			.single()

		const now = new Date().toISOString()

		// Update or insert progress
		if (existingProgress) {
			// Update existing progress
			const { error: updateError } = await supabase
				.from('user_exercise_progress')
				.update({
					score: Math.max(existingProgress.score || 0, validScore), // Keep best score
					attempts: existingProgress.attempts + 1,
					completed: validCompleted || existingProgress.completed,
					last_attempt_at: now,
					completed_at:
						validCompleted && !existingProgress.completed
							? now
							: existingProgress.completed_at,
				})
				.eq('id', existingProgress.id)

			if (updateError) {
				logger.error('Error updating progress:', updateError)
				throw new Error('Failed to update progress')
			}
		} else {
			// Insert new progress
			const { error: insertError } = await supabase
				.from('user_exercise_progress')
				.insert({
					user_id: user.id,
					exercise_id: validExerciseId,
					score: validScore,
					attempts: 1,
					completed: validCompleted,
					last_attempt_at: now,
					completed_at: validCompleted ? now : null,
				})

			if (insertError) {
				logger.error('Error inserting progress:', insertError)
				throw new Error('Failed to save progress')
			}
		}

		// Award XP if this is the first time achieving 100% score
		let xpAwarded = 0
		let goldAwarded = 0
		const isPerfectScore = validScore === 100
		const hadPerfectScoreBefore = existingProgress && existingProgress.score === 100

		// Give XP if: perfect score AND never had perfect score before
		if (isPerfectScore && !hadPerfectScoreBefore) {
			// Award full XP only for perfect score on first 100% achievement
			const baseXp = exercise.xp_reward || 10
			xpAwarded = baseXp
			goldAwarded = Math.floor(xpAwarded / 10) // 10:1 ratio

			// Add XP and gold directly to database
			try {
				// Get current XP profile
				const { data: xpProfile, error: xpProfileError } = await supabase
					.from('user_xp_profile')
					.select('*')
					.eq('user_id', user.id)
					.single()

				if (xpProfileError) throw xpProfileError

				// Calculate new totals
				const newTotalXp = (xpProfile.total_xp || 0) + xpAwarded
				const newTotalGold = (xpProfile.total_gold || 0) + goldAwarded

				// Calculate new level using RPC function
				const { data: levelData } = await supabase.rpc('calculate_level_from_xp', {
					total_xp: newTotalXp,
				})

				const newLevel = levelData[0].level
				const xpInLevel = levelData[0].xp_in_level

				// Update XP profile with all calculated values
				const { error: updateError } = await supabase
					.from('user_xp_profile')
					.update({
						total_xp: newTotalXp,
						total_gold: newTotalGold,
						current_level: newLevel,
						xp_in_current_level: xpInLevel,
					})
					.eq('user_id', user.id)

				if (updateError) throw updateError

				// Insert XP transaction
				const { error: txError } = await supabase.from('xp_transactions').insert({
					user_id: user.id,
					xp_amount: xpAwarded,
					gold_earned: goldAwarded,
					source_type: 'exercise_completed',
					source_id: validExerciseId.toString(),
					description: `Completed exercise: ${exercise.title || 'Untitled'}`,
				})

				if (txError) throw txError

				logger.log(
					`✅ XP awarded: ${xpAwarded} XP, ${goldAwarded} Gold to user ${user.id}`
				)
			} catch (xpError) {
				logger.error('❌ Error awarding XP:', xpError)
				// Continue anyway, don't block the exercise completion
			}
		}

		logger.log(
			`📤 Server Action Response: success=${true}, xpAwarded=${xpAwarded}, goldAwarded=${goldAwarded}, isFirstCompletion=${isPerfectScore && !hadPerfectScoreBefore}`
		)

		return {
			success: true,
			score: validScore,
			xpAwarded,
			goldAwarded,
			isFirstCompletion: isPerfectScore && !hadPerfectScoreBefore,
		}
	} catch (error) {
		logger.error('Error submitting exercise:', error)
		throw error
	}
}
