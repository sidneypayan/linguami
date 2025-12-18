'use server'

import { cookies } from 'next/headers'
import { createServerClient, createProductionServerClient } from '@/lib/supabase-server'
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
		const cookieStore = await cookies()

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

		// IMPORTANT: User authentication is ALWAYS in the local database
		const localSupabase = createServerClient(cookieStore)
		const {
			data: { user },
			error: authError,
		} = await localSupabase.auth.getUser()

		if (!user || authError) {
			throw new Error('Unauthorized')
		}

		// Try production DB first (for lessons), then local DB (for materials)
		let supabase = createProductionServerClient(cookieStore)
		let exercise = null
		let useProductionDb = true

		// Try to get exercise from production DB
		const { data: prodExercise, error: prodError } = await supabase
			.from('exercises')
			.select('*')
			.eq('id', validExerciseId)
			.single()

		if (prodExercise) {
			exercise = prodExercise

			// Since progress is stored locally, we need to ensure the exercise exists in local DB too
			// Check if exercise exists in local DB
			const { data: localCheck } = await localSupabase
				.from('exercises')
				.select('id')
				.eq('id', validExerciseId)
				.single()

			if (!localCheck) {
				// Exercise doesn't exist in local DB, create a copy
				logger.info(`Syncing exercise ${prodExercise.id} to local DB...`)

				// Get language from the lesson if exercise is linked to a lesson
				let lang = prodExercise.lang
				if (!lang && prodExercise.lesson_id) {
					const { data: lesson } = await supabase
						.from('lessons')
						.select('language')
						.eq('id', prodExercise.lesson_id)
						.single()

					lang = lesson?.language
				}

				// Fallback to 'fr' if we still don't have a language
				if (!lang) {
					lang = 'fr'
					logger.warn(`No language found for exercise ${prodExercise.id}, defaulting to 'fr'`)
				}

				const { error: syncError } = await localSupabase
					.from('exercises')
					.insert({
						id: prodExercise.id,
						title: prodExercise.title,
						type: prodExercise.type,
						level: prodExercise.level,
						lang: lang,
						data: prodExercise.data,
						xp_reward: prodExercise.xp_reward,
						material_id: prodExercise.material_id,
						lesson_id: prodExercise.lesson_id,
						created_at: prodExercise.created_at,
						updated_at: prodExercise.updated_at
					})

				if (syncError) {
					logger.error('Error syncing exercise to local DB:', syncError)
					throw new Error(`Failed to sync exercise to local DB: ${syncError.message || syncError.code || JSON.stringify(syncError)}`)
				} else {
					logger.info(`Successfully synced exercise ${prodExercise.id} to local DB`)
				}
			}
		} else {
			// Exercise not in production DB, try local DB
			supabase = localSupabase
			useProductionDb = false

			const { data: localExercise, error: localError } = await supabase
				.from('exercises')
				.select('*')
				.eq('id', validExerciseId)
				.single()

			if (localExercise) {
				exercise = localExercise
			} else {
				throw new Error('Exercise not found in any database')
			}
		}

		// IMPORTANT: User progress is ALWAYS stored in the local database
		// even if the exercise comes from the production database
		const progressSupabase = localSupabase

		// Check if user has already completed this exercise
		const { data: existingProgress } = await progressSupabase
			.from('user_exercise_progress')
			.select('*')
			.eq('user_id', user.id)
			.eq('exercise_id', validExerciseId)
			.single()

		const now = new Date().toISOString()

		// Update or insert progress
		if (existingProgress) {
			// Update existing progress
			const { error: updateError } = await progressSupabase
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
			const { error: insertError } = await progressSupabase
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
				throw new Error(`Failed to save progress: ${insertError.message || insertError.code || JSON.stringify(insertError)}`)
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

			// IMPORTANT: XP system is ALWAYS in the local database
			// Even if the exercise is in production DB, XP tables are in local DB
			const xpSupabase = localSupabase

			// Add XP and gold directly to database
			try {
				// Get current XP profile
				const { data: xpProfile, error: xpProfileError } = await xpSupabase
					.from('user_xp_profile')
					.select('*')
					.eq('user_id', user.id)
					.single()

				if (xpProfileError) throw xpProfileError

				// Calculate new totals
				const newTotalXp = (xpProfile.total_xp || 0) + xpAwarded
				const newTotalGold = (xpProfile.total_gold || 0) + goldAwarded

				// Calculate new level using RPC function
				const { data: levelData } = await xpSupabase.rpc('calculate_level_from_xp', {
					total_xp: newTotalXp,
				})

				const newLevel = levelData[0].level
				const xpInLevel = levelData[0].xp_in_level

				// Update XP profile with all calculated values
				const { error: updateError } = await xpSupabase
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
				const { error: txError } = await xpSupabase.from('xp_transactions').insert({
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
