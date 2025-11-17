/**
 * Client-side functions for user words/dictionary operations
 * Used with React Query for caching and state management
 * All functions throw errors for React Query error handling
 */

import { supabase } from '@/lib/supabase'
import { logger } from '@/utils/logger'

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
	const { data, error } = await supabase
		.from('user_words')
		.select('*')
		.eq('user_id', userId)
		.eq('material_id', materialId)
		.order('created_at', { ascending: false })

	if (error) {
		logger.error('[getMaterialWords] Error:', error)
		throw error
	}

	return data || []
}

/**
 * Get all user words for a specific language
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.userLearningLanguage - Language being learned (ru, fr, en)
 * @returns {Promise<Array>} User words
 */
export async function getUserWords({ userId, userLearningLanguage }) {
	const { data, error } = await supabase
		.from('user_words')
		.select('*')
		.eq('user_id', userId)
		.eq('word_lang', userLearningLanguage)
		.order('created_at', { ascending: false })

	if (error) {
		logger.error('[getUserWords] Error:', error)
		throw error
	}

	return data || []
}

// ==========================================
// CREATE Operations
// ==========================================

/**
 * Add a word to user dictionary
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
	// Build word data structure
	const wordData = {
		word_ru: null,
		word_fr: null,
		word_en: null,
	}

	// Map original word to learning language column
	if (userLearningLanguage === 'ru') {
		wordData.word_ru = originalWord
	} else if (userLearningLanguage === 'fr') {
		wordData.word_fr = originalWord
	} else if (userLearningLanguage === 'en') {
		wordData.word_en = originalWord
	}

	// Map translated word to locale column
	if (locale === 'ru') {
		wordData.word_ru = translatedWord
	} else if (locale === 'fr') {
		wordData.word_fr = translatedWord
	} else if (locale === 'en') {
		wordData.word_en = translatedWord
	}

	const insertData = {
		...wordData,
		user_id: userId,
		material_id: materialId,
		word_sentence: word_sentence || '',
		word_lang: userLearningLanguage,
		// Initialize SRS fields for new words
		card_state: 'new',
		ease_factor: 2.5,
		interval: 0,
		learning_step: null,
		next_review_date: null,
		last_review_date: null,
		reviews_count: 0,
		lapses: 0,
		is_suspended: false,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	}

	const { data, error } = await supabase
		.from('user_words')
		.insert([insertData])
		.select('*')
		.single()

	if (error) {
		logger.error('[addWord] Error:', error)
		// Check for duplicate error
		const isDuplicate =
			error?.code === '23505' ||
			(typeof error?.message === 'string' &&
				error.message.toLowerCase().includes('duplicate key value'))

		if (isDuplicate) {
			throw new Error('duplicate_translation')
		}
		throw error
	}

	return data
}

// ==========================================
// DELETE Operations
// ==========================================

/**
 * Delete a word from dictionary
 * @param {string|number} wordId - Word ID to delete
 * @returns {Promise<Object>} Deleted word
 */
export async function deleteWord(wordId) {
	// Normalize to number for database consistency
	const normalizedId = typeof wordId === 'string' ? parseInt(wordId, 10) : wordId

	const { data, error } = await supabase
		.from('user_words')
		.delete()
		.eq('id', normalizedId)
		.select()

	if (error) {
		logger.error('[deleteWord] Supabase error:', error)
		throw error
	}

	// Check if a row was deleted
	if (!data || data.length === 0) {
		const notFoundError = new Error('Word not found or permission denied')
		logger.error('[deleteWord] No rows deleted for ID:', normalizedId)
		throw notFoundError
	}

	return data[0]
}

/**
 * Delete multiple words from dictionary (batch operation)
 * @param {number[]} wordIds - Array of word IDs to delete
 * @returns {Promise<Array>} Array of deleted word IDs
 */
export async function deleteWords(wordIds) {
	const { data, error } = await supabase
		.from('user_words')
		.delete()
		.in('id', wordIds)
		.select('id')

	if (error) {
		logger.error('[deleteWords] Error:', error)
		throw error
	}

	const deletedIds = Array.isArray(data) ? data.map(r => r.id) : []
	if (deletedIds.length === 0) {
		throw new Error('No words deleted. Check permissions or IDs.')
	}

	return deletedIds
}

// ==========================================
// Translation API
// ==========================================

/**
 * Translate a word using Yandex Dictionary API
 * @param {Object} params - Parameters
 * @param {string} params.word - Word to translate
 * @param {string} params.sentence - Sentence context
 * @param {string} params.userLearningLanguage - Source language
 * @param {string} params.locale - Target language
 * @param {boolean} params.isAuthenticated - User authentication status
 * @returns {Promise<Object>} Translation result
 */
export async function translateWord({ word, sentence, userLearningLanguage, locale, isAuthenticated }) {
	const response = await fetch('/api/translations/translate', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			word,
			sentence,
			userLearningLanguage,
			locale,
			isAuthenticated,
		}),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Translation failed')
	}

	return response.json()
}
