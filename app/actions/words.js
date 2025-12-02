'use server'

import { cookies } from 'next/headers'
import { createServerClient, supabaseServer } from '@/lib/supabase-server'
import { logger } from '@/utils/logger'
import { calculateNextReview } from '@/utils/spacedRepetition'
import { addXPAction } from '@/actions/gamification/xp-actions'
import { validateWordPair } from '@/utils/validation'

// ==========================================
// Translation API
// ==========================================

/**
 * Translate a word using cache or Yandex Dictionary API
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

	// Normalize the word for cache lookup (lowercase, trimmed)
	const normalizedWord = word.toLowerCase().trim()

	try {
		// ============================================
		// STEP 1: Check cache first (using service role to bypass RLS)
		// ============================================
		const { data: cachedTranslation, error: cacheError } = await supabaseServer
			.from('translations_cache')
			.select('*')
			.eq('searched_form', normalizedWord)
			.eq('source_lang', userLearningLanguage)
			.eq('target_lang', locale)
			.single()

		if (cachedTranslation && !cacheError) {
			// Cache HIT - increment usage count (fire and forget)
			supabaseServer
				.from('translations_cache')
				.update({
					usage_count: cachedTranslation.usage_count + 1,
					updated_at: new Date().toISOString()
				})
				.eq('id', cachedTranslation.id)
				.then(() => {})
				.catch(() => {})

			logger.info(`[translateWordAction] Cache HIT for "${word}" (${userLearningLanguage}-${locale})`)

			return {
				success: true,
				word,
				data: cachedTranslation.full_response,
				sentence,
				fromCache: true,
			}
		}

		// ============================================
		// STEP 2: Cache MISS - Check guest limits
		// ============================================
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

		// ============================================
		// STEP 3: Call Yandex API
		// ============================================
		const yandexSupportedPairs = [
			'ru-en', 'en-ru', 'ru-fr', 'fr-ru', 'ru-de', 'de-ru',
			'en-fr', 'fr-en', 'en-de', 'de-en', 'en-es', 'es-en',
			'en-it', 'it-en', 'en-pt', 'pt-en', 'en-pl', 'pl-en',
			'en-tr', 'tr-en', 'en-uk', 'uk-en', 'ru-uk', 'uk-ru'
		]

		let langPair = `${userLearningLanguage}-${locale}`
		let needsPivot = false

		// Check if direct pair is supported
		if (!yandexSupportedPairs.includes(langPair)) {
			// For Italian: use two-step translation via English
			if (yandexSupportedPairs.includes(`${userLearningLanguage}-en`)) {
				needsPivot = true
				langPair = `${userLearningLanguage}-en`
			}
		}

		const apiUrl = new URL('https://dictionary.yandex.net/api/v1/dicservice.json/lookup')
		apiUrl.searchParams.append('key', process.env.YANDEX_DICT_API_KEY)
		apiUrl.searchParams.append('lang', langPair)
		apiUrl.searchParams.append('text', word)
		apiUrl.searchParams.append('flags', '004') // Enable morphological search

		const response = await fetch(apiUrl.toString())

		if (!response.ok) {
			throw new Error(`Yandex API error: ${response.status} ${response.statusText}`)
		}

		let data = await response.json()

		// If we used a pivot (e.g., it-en), now translate English results to target language
		if (needsPivot && data.def?.length > 0 && locale !== 'en') {
			const secondPair = `en-${locale}`
			if (yandexSupportedPairs.includes(secondPair)) {
				const englishWord = data.def[0]?.tr?.[0]?.text
				if (englishWord) {
					const pivotUrl = new URL('https://dictionary.yandex.net/api/v1/dicservice.json/lookup')
					pivotUrl.searchParams.append('key', process.env.YANDEX_DICT_API_KEY)
					pivotUrl.searchParams.append('lang', secondPair)
					pivotUrl.searchParams.append('text', englishWord)
					pivotUrl.searchParams.append('flags', '004')

					const pivotResponse = await fetch(pivotUrl.toString())
					if (pivotResponse.ok) {
						const pivotData = await pivotResponse.json()
						if (pivotData.def?.length > 0) {
							data.def[0].tr = pivotData.def[0]?.tr || data.def[0].tr
							data.pivotUsed = true
							data.pivotWord = englishWord
						}
					}
				}
			}
		}

		// Log API response for debugging
		if (data.def?.length === 0) {
			logger.warn(`[translateWordAction] No translations found for "${word}" (${langPair})`)
		}

		// ============================================
		// STEP 4: Save to cache (if we got results)
		// ============================================
		if (data.def?.length > 0) {
			const lemma = data.def[0]?.text || normalizedWord
			const partOfSpeech = data.def[0]?.pos || null
			const translations = data.def[0]?.tr?.map(t => t.text) || []

			// Insert into cache (fire and forget - don't block the response)
			supabaseServer
				.from('translations_cache')
				.insert({
					searched_form: normalizedWord,
					lemma: lemma.toLowerCase(),
					source_lang: userLearningLanguage,
					target_lang: locale,
					part_of_speech: partOfSpeech,
					translations: translations,
					full_response: data,
					source: 'yandex',
					usage_count: 1,
				})
				.then(({ error }) => {
					if (error && !error.message?.includes('duplicate')) {
						logger.error('[translateWordAction] Cache insert error:', error)
					} else if (!error) {
						logger.info(`[translateWordAction] Cached "${normalizedWord}" (${userLearningLanguage}-${locale})`)
					}
				})
				.catch((err) => {
					logger.error('[translateWordAction] Cache insert exception:', err)
				})
		}

		return {
			success: true,
			word,
			data,
			sentence,
			fromCache: false,
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

/**
 * Get translation popularity statistics
 * Returns how many times each translation has been chosen by users
 * @param {Object} params - Parameters
 * @param {string} params.originalWord - Original word to get stats for
 * @param {string} params.sourceLang - Source language (ru, fr, en)
 * @param {string} params.targetLang - Target language (ru, fr, en)
 * @returns {Promise<Object>} Translation stats { "rouge": 127, "red": 45, ... }
 */
export async function getTranslationStatsAction({ originalWord, sourceLang, targetLang }) {
	const supabase = createServerClient(await cookies())

	try {
		// Query user_words to count how many times each translation was chosen
		const sourceColumn = `word_${sourceLang}`
		const targetColumn = `word_${targetLang}`

		const { data, error } = await supabase
			.from('user_words')
			.select(targetColumn)
			.eq(sourceColumn, originalWord)
			.eq('word_lang', sourceLang)
			.not(targetColumn, 'is', null)

		if (error) {
			logger.error('[getTranslationStatsAction] Error:', error)
			return { success: true, stats: {} } // Return empty stats instead of failing
		}

		// Count occurrences of each translation
		const stats = {}
		data.forEach(row => {
			const translation = row[targetColumn]
			if (translation) {
				stats[translation] = (stats[translation] || 0) + 1
			}
		})

		return {
			success: true,
			stats, // { "rouge": 127, "rougi": 5, "couperosé": 2 }
		}
	} catch (error) {
		logger.error('[getTranslationStatsAction] Error:', error)
		return {
			success: true,
			stats: {}, // Return empty stats on error to not break the UI
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
// BULK Operations (Lesson Import)
// ==========================================

/**
 * Import multiple words from a lesson to user's flashcards
 * @param {Object} params
 * @param {Array} params.words - Array of { word, translation } objects
 * @param {string} params.userLearningLanguage - Language being learned (ru, fr, it)
 * @param {string} params.locale - User's interface language (ru, fr, en)
 * @param {string} params.lessonId - Lesson ID for reference
 * @returns {Promise<Object>} Result with imported count
 */
export async function importLessonWordsAction({ words, userLearningLanguage, locale, lessonId }) {
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

	try {
		let importedCount = 0
		let skippedCount = 0
		const errors = []

		for (const wordPair of words) {
			// Build word data structure
			const wordData = {
				word_ru: null,
				word_fr: null,
				word_en: null,
			}

			// Map original word to learning language column
			const learningLangColumn = `word_${userLearningLanguage}`
			wordData[learningLangColumn] = wordPair.word

			// Map translated word to locale column
			const localeColumn = `word_${locale}`
			wordData[localeColumn] = wordPair.translation

			const insertData = {
				...wordData,
				user_id: user.id,
				material_id: null, // No material for lesson imports
				word_sentence: wordPair.example || '',
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

			const { error } = await supabase
				.from('user_words')
				.insert([insertData])

			if (error) {
				// Check for duplicate
				const isDuplicate =
					error?.code === '23505' ||
					(typeof error?.message === 'string' &&
						error.message.toLowerCase().includes('duplicate key value'))

				if (isDuplicate) {
					skippedCount++
				} else {
					errors.push({ word: wordPair.word, error: error.message })
				}
			} else {
				importedCount++
			}
		}

		// Add XP for bulk import
		if (importedCount > 0) {
			try {
				await addXPAction({
					actionType: 'lesson_words_imported',
					sourceId: lessonId?.toString() || '',
					description: `Imported ${importedCount} words from lesson`,
				})
			} catch (xpError) {
				logger.error('[importLessonWordsAction] Error adding XP:', xpError)
			}
		}

		return {
			success: true,
			importedCount,
			skippedCount,
			errors: errors.length > 0 ? errors : null,
		}
	} catch (error) {
		logger.error('[importLessonWordsAction] Unexpected error:', error)
		return {
			success: false,
			error: error.message || 'Error importing words',
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
