'use client'

/**
 * Client-side functions for user words/dictionary operations
 * Used with React Query for caching and state management
 * All functions throw errors for React Query error handling
 */

import { logger } from '@/utils/logger'
import {
	translateWordAction,
	getTranslationStatsAction,
	addWordAction,
	updateWordReviewAction,
	initializeWordSRSAction,
	suspendCardAction,
	getUserWordsAction,
	getMaterialWordsAction,
	deleteWordAction,
	deleteWordsAction,
} from '@/app/actions/words'

// ==========================================
// READ Operations
// ==========================================

/**
 * Get all words for a specific material
 * @param {Object} params - Parameters
 * @param {string} params.materialId - Material ID
 * @param {string} params.userId - User ID
 * @returns {Promise<Array>} Array of words
 */
export async function getMaterialWords({ materialId, userId }) {
	const result = await getMaterialWordsAction({ materialId, userId })

	if (!result.success) {
		logger.error('[getMaterialWords] Error:', result.error)
		throw new Error(result.error)
	}

	return result.data
}

/**
 * Get all user words for a specific language
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.userLearningLanguage - Language being learned (ru, fr, en)
 * @returns {Promise<Array>} User words
 */
export async function getUserWords({ userId, userLearningLanguage }) {
	const result = await getUserWordsAction({ userId, userLearningLanguage })

	if (!result.success) {
		logger.error('[getUserWords] Error:', result.error)
		throw new Error(result.error)
	}

	return result.data
}

// ==========================================
// CREATE Operations
// ==========================================

/**
 * Add a word to user dictionary (Server Action)
 * @param {Object} params - Parameters
 * @param {string} params.originalWord - Original word (in learning language)
 * @param {string} params.translatedWord - Translated word (in locale)
 * @param {string} params.userId - User ID
 * @param {string} params.materialId - Material ID
 * @param {string} params.word_sentence - Sentence context
 * @param {string} params.userLearningLanguage - Learning language
 * @param {string} params.locale - Interface language
 * @returns {Promise<Object>} Created word
 */
export async function addWord({
	originalWord,
	translatedWord,
	userId,
	materialId,
	word_sentence,
	userLearningLanguage,
	locale,
}) {
	const result = await addWordAction({
		originalWord,
		translatedWord,
		userId,
		materialId,
		word_sentence,
		userLearningLanguage,
		locale,
	})

	if (!result.success) {
		// Throw error with specific error code for React Query error handling
		throw new Error(result.error)
	}

	// Return first word from data array
	return result.data[0]
}

// ==========================================
// DELETE Operations
// ==========================================

/**
 * Delete a word from dictionary (Server Action)
 * @param {string|number} wordId - Word ID to delete
 * @returns {Promise<Object>} Deleted word
 */
export async function deleteWord(wordId) {
	// Normalize to number for database consistency
	const normalizedId = typeof wordId === 'string' ? parseInt(wordId, 10) : wordId

	const result = await deleteWordAction(normalizedId)

	if (!result.success) {
		logger.error('[deleteWord] Error:', result.error)
		throw new Error(result.error)
	}

	return { id: result.deletedId }
}

/**
 * Delete multiple words from dictionary (batch operation)
 * @param {number[]} wordIds - Array of word IDs to delete
 * @returns {Promise<Array>} Array of deleted word IDs
 */
export async function deleteWords(wordIds) {
	const result = await deleteWordsAction(wordIds)

	if (!result.success) {
		logger.error('[deleteWords] Error:', result.error)
		throw new Error(result.error)
	}

	return result.deletedIds
}

// ==========================================
// Translation API
// ==========================================

/**
 * Translate a word using Yandex Dictionary API (Server Action)
 * @param {Object} params - Parameters
 * @param {string} params.word - Word to translate
 * @param {string} params.sentence - Sentence context
 * @param {string} params.userLearningLanguage - Source language
 * @param {string} params.locale - Target language
 * @param {boolean} params.isAuthenticated - User authentication status
 * @returns {Promise<Object>} Translation result
 */
export async function translateWord({ word, sentence, userLearningLanguage, locale, isAuthenticated }) {
	const result = await translateWordAction({
		word,
		sentence,
		userLearningLanguage,
		locale,
		isAuthenticated,
	})

	if (!result.success) {
		const error = new Error(result.error)
		error.limitReached = result.limitReached
		throw error
	}

	return result
}

/**
 * Get translation popularity statistics (Server Action)
 * @param {Object} params - Parameters
 * @param {string} params.originalWord - Original word to get stats for
 * @param {string} params.sourceLang - Source language (ru, fr, en)
 * @param {string} params.targetLang - Target language (ru, fr, en)
 * @returns {Promise<Object>} Translation stats
 */
export async function getTranslationStats({ originalWord, sourceLang, targetLang }) {
	const result = await getTranslationStatsAction({
		originalWord,
		sourceLang,
		targetLang,
	})

	if (!result.success) {
		logger.error('[getTranslationStats] Error:', result.error)
		return {} // Return empty stats on error
	}

	return result.stats
}

// ==========================================
// UPDATE Operations (SRS)
// ==========================================

/**
 * Update word review using SRS algorithm (Server Action)
 * @param {Object} params
 * @param {number} params.wordId - Word ID
 * @param {string} params.buttonType - Review button type (again, hard, good, easy)
 * @param {Object} params.currentCard - Current card state
 * @returns {Promise<Object>} Updated word
 */
export async function updateWordReview({ wordId, buttonType, currentCard }) {
	const result = await updateWordReviewAction({ wordId, buttonType, currentCard })

	if (!result.success) {
		throw new Error(result.error)
	}

	return result.data
}

/**
 * Initialize SRS fields for existing words (Server Action)
 * @param {number} wordId - Word ID
 * @returns {Promise<Object>} Updated word
 */
export async function initializeWordSRS(wordId) {
	const result = await initializeWordSRSAction(wordId)

	if (!result.success) {
		throw new Error(result.error)
	}

	return result.data
}

/**
 * Suspend a card (exclude from reviews) (Server Action)
 * @param {number} wordId - Word ID
 * @returns {Promise<Object>} Updated word
 */
export async function suspendCard(wordId) {
	const result = await suspendCardAction(wordId)

	if (!result.success) {
		throw new Error(result.error)
	}

	return result.data
}
