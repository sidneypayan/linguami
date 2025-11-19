'use client'

/**
 * Client-side functions for flashcard SRS (Spaced Repetition System) operations
 * Used with React Query for caching and state management
 * All functions throw errors for React Query error handling
 */

import { supabase } from '@/lib/supabase'
import { logger } from '@/utils/logger'
import { calculateNextReview } from '@/utils/spacedRepetition'

// ==========================================
// UPDATE Operations (SRS Reviews)
// ==========================================

/**
 * Update a card after review (main SRS function)
 * @param {Object} params - Parameters
 * @param {number} params.wordId - Word ID to update
 * @param {string} params.buttonType - Button pressed (again, hard, good, easy)
 * @param {Object} params.currentCard - Current card state
 * @returns {Promise<Object>} Updated card
 */
export async function updateCardReview({ wordId, buttonType, currentCard }) {
	try {
		// Calculate next review using SRS algorithm
		const updatedCard = calculateNextReview(currentCard, buttonType)

		// Extract only the SRS fields we need to update
		const fieldsToUpdate = {
			card_state: updatedCard.card_state,
			ease_factor: updatedCard.ease_factor,
			interval: updatedCard.interval,
			learning_step: updatedCard.learning_step,
			next_review_date: updatedCard.next_review_date,
			last_review_date: updatedCard.last_review_date,
			reviews_count: updatedCard.reviews_count,
			lapses: updatedCard.lapses,
			updated_at: new Date().toISOString(),
		}

		const { data, error } = await supabase
			.from('user_words')
			.update(fieldsToUpdate)
			.eq('id', wordId)
			.select('*')
			.single()

		if (error) {
			logger.error('[updateCardReview] Supabase error:', error)
			throw error
		}

		if (!data) {
			const notFoundError = new Error('Card not found or permission denied')
			logger.error('[updateCardReview] No data returned for ID:', wordId)
			throw notFoundError
		}

		logger.log('[updateCardReview] Successfully updated card:', wordId, {
			card_state: data.card_state,
			interval: data.interval,
			next_review_date: data.next_review_date
		})

		return data
	} catch (error) {
		logger.error('[updateCardReview] Error:', error)
		throw error
	}
}

/**
 * Suspend a card (exclude from reviews)
 * @param {number} wordId - Word ID to suspend
 * @returns {Promise<Object>} Updated card
 */
export async function suspendCard(wordId) {
	try {
		const { data, error } = await supabase
			.from('user_words')
			.update({
				is_suspended: true,
				updated_at: new Date().toISOString()
			})
			.eq('id', wordId)
			.select('*')
			.single()

		if (error) {
			logger.error('[suspendCard] Supabase error:', error)
			throw error
		}

		if (!data) {
			const notFoundError = new Error('Card not found or permission denied')
			logger.error('[suspendCard] No data returned for ID:', wordId)
			throw notFoundError
		}

		logger.log('[suspendCard] Successfully suspended card:', wordId)

		return data
	} catch (error) {
		logger.error('[suspendCard] Error:', error)
		throw error
	}
}

/**
 * Unsuspend a card (re-enable for reviews)
 * @param {number} wordId - Word ID to unsuspend
 * @returns {Promise<Object>} Updated card
 */
export async function unsuspendCard(wordId) {
	try {
		const { data, error } = await supabase
			.from('user_words')
			.update({
				is_suspended: false,
				updated_at: new Date().toISOString()
			})
			.eq('id', wordId)
			.select('*')
			.single()

		if (error) {
			logger.error('[unsuspendCard] Supabase error:', error)
			throw error
		}

		if (!data) {
			const notFoundError = new Error('Card not found or permission denied')
			logger.error('[unsuspendCard] No data returned for ID:', wordId)
			throw notFoundError
		}

		logger.log('[unsuspendCard] Successfully unsuspended card:', wordId)

		return data
	} catch (error) {
		logger.error('[unsuspendCard] Error:', error)
		throw error
	}
}

/**
 * Initialize SRS fields for a card that doesn't have them yet
 * @param {number} wordId - Word ID to initialize
 * @returns {Promise<Object>} Updated card
 */
export async function initializeCard(wordId) {
	try {
		const fieldsToUpdate = {
			card_state: 'new',
			ease_factor: 2.5,
			interval: 0,
			learning_step: null,
			next_review_date: null,
			last_review_date: null,
			reviews_count: 0,
			lapses: 0,
			is_suspended: false,
			updated_at: new Date().toISOString(),
		}

		const { data, error } = await supabase
			.from('user_words')
			.update(fieldsToUpdate)
			.eq('id', wordId)
			.select('*')
			.single()

		if (error) {
			logger.error('[initializeCard] Supabase error:', error)
			throw error
		}

		if (!data) {
			const notFoundError = new Error('Card not found or permission denied')
			logger.error('[initializeCard] No data returned for ID:', wordId)
			throw notFoundError
		}

		logger.log('[initializeCard] Successfully initialized card:', wordId)

		return data
	} catch (error) {
		logger.error('[initializeCard] Error:', error)
		throw error
	}
}

// ==========================================
// READ Operations (Statistics)
// ==========================================

/**
 * Get review statistics for a user
 * @param {Object} params - Parameters
 * @param {string} params.userId - User ID
 * @param {string} params.userLearningLanguage - Learning language
 * @returns {Promise<Object>} Review statistics
 */
export async function getReviewStats({ userId, userLearningLanguage }) {
	try {
		const { data, error } = await supabase
			.from('user_words')
			.select('card_state, next_review_date, is_suspended')
			.eq('user_id', userId)
			.eq('word_lang', userLearningLanguage)

		if (error) {
			logger.error('[getReviewStats] Supabase error:', error)
			throw error
		}

		const now = new Date()
		const stats = {
			total: data?.length || 0,
			new: 0,
			learning: 0,
			review: 0,
			relearning: 0,
			suspended: 0,
			due: 0,
		}

		data?.forEach(card => {
			// Count suspended cards
			if (card.is_suspended) {
				stats.suspended++
				return
			}

			// Count by state
			switch (card.card_state) {
				case 'new':
					stats.new++
					stats.due++ // New cards are always due
					break
				case 'learning':
					stats.learning++
					stats.due++ // Learning cards are always due
					break
				case 'review':
					stats.review++
					// Check if review is due
					if (card.next_review_date && new Date(card.next_review_date) <= now) {
						stats.due++
					}
					break
				case 'relearning':
					stats.relearning++
					stats.due++ // Relearning cards are always due
					break
				default:
					stats.new++
					stats.due++
			}
		})

		logger.log('[getReviewStats] Stats for user:', userId, stats)

		return stats
	} catch (error) {
		logger.error('[getReviewStats] Error:', error)
		throw error
	}
}

/**
 * Get due cards count for a specific material
 * @param {Object} params - Parameters
 * @param {string} params.userId - User ID
 * @param {string|number} params.materialId - Material ID
 * @returns {Promise<number>} Number of due cards
 */
export async function getMaterialDueCount({ userId, materialId }) {
	try {
		const { data, error } = await supabase
			.from('user_words')
			.select('card_state, next_review_date, is_suspended')
			.eq('user_id', userId)
			.eq('material_id', materialId)

		if (error) {
			logger.error('[getMaterialDueCount] Supabase error:', error)
			throw error
		}

		const now = new Date()
		let dueCount = 0

		data?.forEach(card => {
			// Skip suspended cards
			if (card.is_suspended) return

			// New, learning, and relearning cards are always due
			if (!card.card_state || card.card_state === 'new' ||
					card.card_state === 'learning' || card.card_state === 'relearning') {
				dueCount++
				return
			}

			// For review cards, check if due date has passed
			if (card.card_state === 'review' &&
					card.next_review_date &&
					new Date(card.next_review_date) <= now) {
				dueCount++
			}
		})

		logger.log('[getMaterialDueCount] Due count for material:', materialId, dueCount)

		return dueCount
	} catch (error) {
		logger.error('[getMaterialDueCount] Error:', error)
		throw error
	}
}
