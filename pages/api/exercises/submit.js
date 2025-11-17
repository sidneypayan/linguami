import { createServerClient } from '@supabase/ssr'
import { logger } from '@/utils/logger'

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

	// Get authenticated user
	const { data: { user }, error: authError } = await supabase.auth.getUser()

	if (!user || authError) {
		return res.status(401).json({ error: 'Unauthorized' })
	}

	const { exerciseId, score, completed } = req.body

	if (!exerciseId || score === undefined) {
		return res.status(400).json({ error: 'Missing required fields' })
	}

	try {
		// Get exercise details
		const { data: exercise, error: exerciseError } = await supabase
			.from('exercises')
			.select('*')
			.eq('id', exerciseId)
			.single()

		if (exerciseError || !exercise) {
			return res.status(404).json({ error: 'Exercise not found' })
		}

		// Check if user has already completed this exercise
		const { data: existingProgress } = await supabase
			.from('user_exercise_progress')
			.select('*')
			.eq('user_id', user.id)
			.eq('exercise_id', exerciseId)
			.single()

		const now = new Date().toISOString()

		// Update or insert progress
		if (existingProgress) {
			// Update existing progress
			const { error: updateError } = await supabase
				.from('user_exercise_progress')
				.update({
					score: Math.max(existingProgress.score || 0, score), // Keep best score
					attempts: existingProgress.attempts + 1,
					completed: completed || existingProgress.completed,
					last_attempt_at: now,
					completed_at: (completed && !existingProgress.completed) ? now : existingProgress.completed_at,
				})
				.eq('id', existingProgress.id)

			if (updateError) {
				logger.error('Error updating progress:', updateError)
				return res.status(500).json({ error: 'Failed to update progress' })
			}
		} else {
			// Insert new progress
			const { error: insertError } = await supabase
				.from('user_exercise_progress')
				.insert({
					user_id: user.id,
					exercise_id: exerciseId,
					score,
					attempts: 1,
					completed,
					last_attempt_at: now,
					completed_at: completed ? now : null,
				})

			if (insertError) {
				logger.error('Error inserting progress:', insertError)
				return res.status(500).json({ error: 'Failed to save progress' })
			}
		}

		// Award XP if this is the first time achieving 100% score
		let xpAwarded = 0
		let goldAwarded = 0
		const isPerfectScore = score === 100
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
				const { error: txError } = await supabase
					.from('xp_transactions')
					.insert({
						user_id: user.id,
						xp_amount: xpAwarded,
						gold_earned: goldAwarded,
						source_type: 'exercise_completed',
						source_id: exerciseId.toString(),
						description: `Completed exercise: ${exercise.title || 'Untitled'}`
					})

				if (txError) throw txError

				logger.log(`✅ XP awarded: ${xpAwarded} XP, ${goldAwarded} Gold to user ${user.id}`)
			} catch (xpError) {
				logger.error('❌ Error awarding XP:', xpError)
				// Continue anyway, don't block the exercise completion
			}
		}

		logger.log(`📤 API Response: success=${true}, xpAwarded=${xpAwarded}, goldAwarded=${goldAwarded}, isFirstCompletion=${isPerfectScore && !hadPerfectScoreBefore}`)

		return res.status(200).json({
			success: true,
			score,
			xpAwarded,
			goldAwarded,
			isFirstCompletion: isPerfectScore && !hadPerfectScoreBefore,
		})

	} catch (error) {
		logger.error('Error submitting exercise:', error)
		return res.status(500).json({ error: 'Internal server error' })
	}
}
