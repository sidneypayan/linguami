'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { logger } from '@/utils/logger'
import { calculateNextReview } from '@/utils/spacedRepetition'
import { addXPAction } from '@/actions/gamification/xp-actions'
import { validateWordPair } from '@/utils/validation'
import axios from 'axios'

// ==========================================
// Translation API
// ==========================================

/**
 * Translate a word using Yandex Dictionary API
 * Server Action replacement for /api/translations/translate
 * @param {Object} params - Parameters
 * @param {string} params.word - Word to translate
 * @param {string} params.sentence - Sentence context
 * @param {string} params.userLearningLanguage - Source language
 * @param {string} params.locale - Target language
 * @param {boolean} params.isAuthenticated - User authentication status
 * @returns {Promise<Object>} Translation result
 */
export async function translateWordAction({ word, sentence, userLearningLanguage, locale, isAuthenticated = false }) {
	const cookieStore = await cookies()
	
	try {
		// Check translation limit for guests (stored in HttpOnly cookie)
		const translationCountCookie = cookieStore.get('translation_count')
		const translationCount = translationCountCookie ? parseInt(translationCountCookie.value, 10) : 0

		// Guest limit: 20 translations
		const GUEST_TRANSLATION_LIMIT = 20

		if (!isAuthenticated && translationCount >= GUEST_TRANSLATION_LIMIT) {
			return {
				success: false,
				error: 'Limite de traductions atteinte. Créez un compte pour continuer.',
				limitReached: true,
			}
		}

		// ✅ FIX RACE CONDITION: Increment BEFORE API call
		if (!isAuthenticated) {
			const newCount = translationCount + 1
			cookieStore.set('translation_count', String(newCount), {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24, // 24 hours
			})
		}

		// Build Yandex Dictionary API request
		const langPair = `${userLearningLanguage}-${locale}`
		const apiUrl = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup'

		const response = await axios.get(apiUrl, {
			params: {
				key: process.env.YANDEX_DICT_API_KEY,
				lang: langPair,
				text: word,
			},
		})

		return {
			success: true,
			word,
			data: response.data,
			sentence,
		}
	} catch (error) {
		logger.error('[translateWordAction] Error:', error)
		
		// ✅ ROLLBACK: Decrement counter if API call failed
		if (!isAuthenticated) {
			try {
				const translationCountCookie = cookieStore.get('translation_count')
				const count = translationCountCookie ? parseInt(translationCountCookie.value, 10) : 0
				if (count > 0) {
					cookieStore.set('translation_count', String(count - 1), {
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						sameSite: 'lax',
						maxAge: 60 * 60 * 24,
					})
				}
			} catch (rollbackError) {
				logger.error('[translateWordAction] Rollback error:', rollbackError)
			}
		}
		
		return {
			success: false,
			error: error.message || 'Erreur lors de la traduction',
			limitReached: false,
		}
	}
}

// ==========================================
// CREATE Operations
// ==========================================

/**
 * Add a word to user dictionary
 * Server Action replacement for addWordToDictionary thunk
 * @param {Object} params - Word data
 * @returns {Promise<Object>} Created word
 */
export async function addWordAction({
	originalWord,
	translatedWord,
	userId,
	materialId,
	word_sentence,
	userLearningLanguage,
	locale,
}) {
	const supabase = createServerClient(await cookies())

	// ✅ Auth verification
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return {
			success: false,
			error: 'unauthorized',
		}
	}

	// ✅ Ensure user can only add words for themselves
	if (userId && userId !== user.id) {
		return {
			success: false,
			error: 'forbidden',
		}
	}

	// ✅ Input validation
	const validation = validateWordPair({
		learningLangWord: originalWord,
		browserLangWord: translatedWord,
		contextSentence: word_sentence,
	})

	if (!validation.isValid) {
		return {
			success: false,
			error: 'validation_error',
			errors: validation.errors,
		}
	}

	// Extract sanitized values
	const sanitizedOriginal = validation.sanitized.learningLangWord
	const sanitizedTranslated = validation.sanitized.browserLangWord
	const sanitizedSentence = validation.sanitized.contextSentence || ''

	// Build word data structure
	const wordData = {
		word_ru: null,
		word_fr: null,
		word_en: null,
	}

	// Map original word to learning language column (use sanitized values)
	if (userLearningLanguage === 'ru') {
		wordData.word_ru = sanitizedOriginal
	} else if (userLearningLanguage === 'fr') {
		wordData.word_fr = sanitizedOriginal
	} else if (userLearningLanguage === 'en') {
		wordData.word_en = sanitizedOriginal
	}

	// Map translated word to locale column (use sanitized values)
	if (locale === 'ru') {
		wordData.word_ru = sanitizedTranslated
	} else if (locale === 'fr') {
		wordData.word_fr = sanitizedTranslated
	} else if (locale === 'en') {
		wordData.word_en = sanitizedTranslated
	}

	const insertData = {
		...wordData,
		user_id: userId,
		material_id: materialId,
		word_sentence: sanitizedSentence,
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

	try {
		const { data, error } = await supabase
			.from('user_words')
			.insert([insertData])
			.select('*')

		if (error) {
			logger.error('[addWordAction] Supabase error:', error)

			// Check for duplicate error
			const isDuplicate =
				error?.code === '23505' ||
				(typeof error?.message === 'string' &&
					error.message.toLowerCase().includes('duplicate key value'))

			if (isDuplicate) {
				return {
					success: false,
					error: 'duplicate_translation',
					message: 'Cette traduction est déjà enregistrée.',
				}
			}

			return {
				success: false,
				error: 'database_error',
				message: 'Une erreur inattendue est survenue.',
			}
		}

		// Add XP for word added
		if (data && data.length > 0) {
			try {
				await addXPAction({
					actionType: 'word_added',
					sourceId: data[0].id?.toString() || '',
					description: 'Added word to dictionary',
				})
			} catch (xpError) {
				logger.error('[addWordAction] Error adding XP:', xpError)
				// Don't fail the whole operation if XP fails
			}
		}

		return {
			success: true,
			data: data || [],
			message: 'Traduction ajoutée avec succès.',
		}
	} catch (error) {
		logger.error('[addWordAction] Unexpected error:', error)
		return {
			success: false,
			error: 'unexpected_error',
			message: 'Une erreur inattendue est survenue.',
		}
	}
}

// ==========================================
// UPDATE Operations (SRS)
// ==========================================

/**
 * Update word review using SRS algorithm
 * Server Action replacement for updateWordReview thunk
 * @param {Object} params
 * @param {number} params.wordId - Word ID
 * @param {string} params.buttonType - Review button type (again, hard, good, easy)
 * @param {Object} params.currentCard - Current card state
 * @returns {Promise<Object>} Updated word
 */
export async function updateWordReviewAction({ wordId, buttonType, currentCard }) {
	const supabase = createServerClient(await cookies())

	try {
		// Calculate next review using SRS algorithm
		const updatedCard = calculateNextReview(currentCard, buttonType)

		// Extract only the fields we need to update
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

		if (error) {
			logger.error('[updateWordReviewAction] Error:', error)
			throw error
		}

		return {
			success: true,
			data: data[0],
		}
	} catch (error) {
		logger.error('[updateWordReviewAction] Unexpected error:', error)
		return {
			success: false,
			error: error.message || 'Error updating word review',
		}
	}
}

/**
 * Initialize SRS fields for existing words
 * Server Action replacement for initializeWordSRS thunk
 * @param {number} wordId - Word ID
 * @returns {Promise<Object>} Updated word
 */
export async function initializeWordSRSAction(wordId) {
	const supabase = createServerClient(await cookies())

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
			updated_at: new Date().toISOString(),
		}

		const { data, error } = await supabase
			.from('user_words')
			.update(fieldsToUpdate)
			.eq('id', wordId)
			.select('*')

		if (error) {
			logger.error('[initializeWordSRSAction] Error:', error)
			throw error
		}

		return {
			success: true,
			data: data[0],
		}
	} catch (error) {
		logger.error('[initializeWordSRSAction] Unexpected error:', error)
		return {
			success: false,
			error: error.message || 'Error initializing SRS',
		}
	}
}

/**
 * Suspend a card (exclude from reviews)
 * Server Action replacement for suspendCard thunk
 * @param {number} wordId - Word ID
 * @returns {Promise<Object>} Updated word
 */
export async function suspendCardAction(wordId) {
	const supabase = createServerClient(await cookies())

	try {
		const { data, error } = await supabase
			.from('user_words')
			.update({
				is_suspended: true,
				updated_at: new Date().toISOString(),
			})
			.eq('id', wordId)
			.select('*')

		if (error) {
			logger.error('[suspendCardAction] Error:', error)
			throw error
		}

		return {
			success: true,
			data: data[0],
		}
	} catch (error) {
		logger.error('[suspendCardAction] Unexpected error:', error)
		return {
			success: false,
			error: error.message || 'Error suspending card',
		}
	}
}

// ==========================================
// DELETE Operations
// ==========================================

/**
 * Delete a single word
 * Server Action replacement for deleteUserWord thunk
 * @param {number} wordId - Word ID
 * @returns {Promise<Object>} Result
 */
export async function deleteWordAction(wordId) {
	const supabase = createServerClient(await cookies())

	try {
		const { data, error } = await supabase
			.from('user_words')
			.delete()
			.eq('id', wordId)
			.select('id')

		if (error) {
			logger.error('[deleteWordAction] Error:', error)
			throw error
		}

		const deletedId = Array.isArray(data) ? data[0]?.id : data?.id
		if (!deletedId) {
			return {
				success: false,
				error: "Impossible de supprimer ce mot (vérifiez RLS/permissions ou l'existence).",
			}
		}

		return {
			success: true,
			deletedId,
		}
	} catch (error) {
		logger.error('[deleteWordAction] Unexpected error:', error)
		return {
			success: false,
			error: error.message || 'Error deleting word',
		}
	}
}

/**
 * Delete multiple words (batch operation)
 * Server Action replacement for deleteUserWords thunk
 * @param {number[]} wordIds - Array of word IDs
 * @returns {Promise<Object>} Result
 */
export async function deleteWordsAction(wordIds) {
	const supabase = createServerClient(await cookies())

	try {
		const { data, error } = await supabase
			.from('user_words')
			.delete()
			.in('id', wordIds)
			.select('id')

		if (error) {
			logger.error('[deleteWordsAction] Error:', error)
			throw error
		}

		const deletedIds = Array.isArray(data) ? data.map(r => r.id) : []
		if (deletedIds.length === 0) {
			return {
				success: false,
				error: 'Aucune ligne supprimée (vérifiez RLS/permissions ou les identifiants).',
			}
		}

		return {
			success: true,
			deletedIds,
		}
	} catch (error) {
		logger.error('[deleteWordsAction] Unexpected error:', error)
		return {
			success: false,
			error: error.message || 'Error deleting words',
		}
	}
}

// ==========================================
// READ Operations
// ==========================================

/**
 * Get all user words for a specific language
 * Server Action replacement for getUserWords thunk
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.userLearningLanguage - Language being learned (ru, fr, en)
 * @returns {Promise<Object>} Result with user words
 */
export async function getUserWordsAction({ userId, userLearningLanguage }) {
	const supabase = createServerClient(await cookies())

	try {
		// ✅ Auth verification
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser()

		if (authError || !user) {
			return {
				success: false,
				error: 'unauthorized',
			}
		}

		// ✅ Ensure user can only access their own words
		if (userId && userId !== user.id) {
			return {
				success: false,
				error: 'forbidden',
			}
		}

		const { data, error } = await supabase
			.from('user_words')
			.select('*')
			.eq('user_id', user.id)
			.eq('word_lang', userLearningLanguage)
			.order('created_at', { ascending: false })

		if (error) {
			logger.error('[getUserWordsAction] Error:', error)
			throw error
		}

		return {
			success: true,
			data: data || [],
		}
	} catch (error) {
		logger.error('[getUserWordsAction] Unexpected error:', error)
		return {
			success: false,
			error: error.message || 'Error fetching user words',
		}
	}
}

/**
 * Get all words for a specific material
 * Server Action replacement for getMaterialWords thunk
 * @param {Object} params
 * @param {string} params.materialId - Material ID
 * @param {string} params.userId - User ID
 * @returns {Promise<Object>} Result with material words
 */
export async function getMaterialWordsAction({ materialId, userId }) {
	const supabase = createServerClient(await cookies())

	try {
		// ✅ Auth verification
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser()

		if (authError || !user) {
			return {
				success: false,
				error: 'unauthorized',
			}
		}

		// ✅ Ensure user can only access their own words
		if (userId && userId !== user.id) {
			return {
				success: false,
				error: 'forbidden',
			}
		}

		const { data, error } = await supabase
			.from('user_words')
			.select('*')
			.eq('user_id', user.id)
			.eq('material_id', materialId)
			.order('created_at', { ascending: false })

		if (error) {
			logger.error('[getMaterialWordsAction] Error:', error)
			throw error
		}

		return {
			success: true,
			data: data || [],
		}
	} catch (error) {
		logger.error('[getMaterialWordsAction] Unexpected error:', error)
		return {
			success: false,
			error: error.message || 'Error fetching material words',
		}
	}
}
