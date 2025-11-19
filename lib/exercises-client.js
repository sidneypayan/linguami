'use client'

import { submitExerciseAction } from '@/app/actions/exercises'

/**
 * Submit an exercise attempt
 * @param {Object} params
 * @param {number} params.exerciseId - ID of the exercise
 * @param {number} params.score - Score achieved (0-100)
 * @param {boolean} params.completed - Whether the exercise was completed
 * @returns {Promise<Object>} { success, score, xpAwarded, goldAwarded, isFirstCompletion }
 */
export async function submitExercise({ exerciseId, score, completed }) {
	try {
		const result = await submitExerciseAction(exerciseId, score, completed)
		return result
	} catch (error) {
		throw error
	}
}
