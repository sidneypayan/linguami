'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { logger } from '@/utils/logger'
import { validateWordPair } from '@/utils/validation'

/**
 * Update a word pair (translation)
 * Server Action for updating word and translation
 * @param {Object} params
 * @param {number} params.wordId - Word ID
 * @param {string} params.originalWord - Original word (in learning language)
 * @param {string} params.translatedWord - Translated word (in locale language)
 * @param {string} params.word_sentence - Context sentence (optional)
 * @param {string} params.userLearningLanguage - Learning language code
 * @param {string} params.locale - Interface language code
 * @returns {Promise<Object>} Updated word
 */
export async function updateWordAction({
	wordId,
	originalWord,
	translatedWord,
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

	// Build update data structure
	const wordData = {}

	// Map original word to learning language column
	if (userLearningLanguage === 'ru') {
		wordData.word_ru = sanitizedOriginal
	} else if (userLearningLanguage === 'fr') {
		wordData.word_fr = sanitizedOriginal
	} else if (userLearningLanguage === 'en') {
		wordData.word_en = sanitizedOriginal
	}

	// Map translated word to locale column
	if (locale === 'ru') {
		wordData.word_ru = sanitizedTranslated
	} else if (locale === 'fr') {
		wordData.word_fr = sanitizedTranslated
	} else if (locale === 'en') {
		wordData.word_en = sanitizedTranslated
	}

	const updateData = {
		...wordData,
		word_sentence: sanitizedSentence,
		updated_at: new Date().toISOString(),
	}

	try {
		const { data, error } = await supabase
			.from('user_words')
			.update(updateData)
			.eq('id', wordId)
			.eq('user_id', user.id) // ✅ Ensure user can only update their own words
			.select('*')

		if (error) {
			logger.error('[updateWordAction] Supabase error:', error)
			return {
				success: false,
				error: 'database_error',
				message: 'Une erreur est survenue lors de la mise à jour.',
			}
		}

		if (!data || data.length === 0) {
			return {
				success: false,
				error: 'not_found',
				message: 'Mot non trouvé ou vous n\'avez pas les permissions.',
			}
		}

		return {
			success: true,
			data: data[0],
			message: 'Traduction mise à jour avec succès.',
		}
	} catch (error) {
		logger.error('[updateWordAction] Unexpected error:', error)
		return {
			success: false,
			error: 'unexpected_error',
			message: 'Une erreur inattendue est survenue.',
		}
	}
}
