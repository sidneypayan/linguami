/**
 * Utilities for mapping words between languages
 * Eliminates code duplication between Translation and words-client
 */

/**
 * Build word data object with correct language mappings
 * @param {string} originalWord - Word in learning language
 * @param {string} translatedWord - Word in interface language
 * @param {string} learningLang - Language being learned (ru, fr, en)
 * @param {string} locale - Interface language (ru, fr, en)
 * @returns {Object} Word data object with language columns
 */
export function buildWordData(originalWord, translatedWord, learningLang, locale) {
	const wordData = {
		word_ru: null,
		word_fr: null,
		word_en: null,
	}

	// Source language (learning) determines where originalWord goes
	if (learningLang === 'ru') {
		wordData.word_ru = originalWord
	} else if (learningLang === 'fr') {
		wordData.word_fr = originalWord
	} else if (learningLang === 'en') {
		wordData.word_en = originalWord
	}

	// Target language (interface) determines where translatedWord goes
	if (locale === 'ru') {
		wordData.word_ru = translatedWord
	} else if (locale === 'fr') {
		wordData.word_fr = translatedWord
	} else if (locale === 'en') {
		wordData.word_en = translatedWord
	}

	return wordData
}

/**
 * Get the original word from translation object
 * Prefers infinitive form over conjugated form
 * @param {Object} translation - Translation object
 * @returns {string} Original word
 */
export function getOriginalWord(translation) {
	return translation?.inf || translation?.word || ''
}

/**
 * Sanitize user input to prevent XSS and injection
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
	if (!input || typeof input !== 'string') return ''

	return input
		.replace(/[<>]/g, '') // Prevent HTML tags
		.replace(/[{}]/g, '') // Prevent curly braces
		.replace(/javascript:/gi, '') // Prevent javascript:
		.replace(/on\w+=/gi, '') // Prevent event handlers
		.trim()
}

/**
 * Validate translation input
 * @param {string} value - Translation value to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {Object} Validation result with isValid and error message
 */
export function validateTranslation(value, maxLength = 100) {
	// Check length
	if (value.length > maxLength) {
		return {
			isValid: false,
			error: `Maximum ${maxLength} caractères`,
		}
	}

	// Check if only spaces
	if (value.trim().length === 0 && value.length > 0) {
		return {
			isValid: false,
			error: 'La traduction ne peut pas être vide',
		}
	}

	// Check suspicious repeated characters
	if (/(.)\1{10,}/.test(value)) {
		return {
			isValid: false,
			error: 'Caractères répétés détectés',
		}
	}

	return {
		isValid: true,
		error: null,
	}
}

/**
 * Get word display (source + translation) based on languages
 * @param {Object} word - Word object
 * @param {string} learningLang - Language being learned
 * @param {string} locale - Interface language
 * @returns {Object} { sourceWord, translation }
 */
export function getWordDisplay(word, learningLang, locale) {
	const sourceWord = word[`word_${learningLang}`]
	const translation = word[`word_${locale}`]
	return { sourceWord, translation }
}

/**
 * Filter words by language pair
 * Only returns words that have both source word AND translation
 * @param {Array} words - Array of words
 * @param {string} learningLang - Learning language
 * @param {string} locale - Interface language
 * @returns {Array} Filtered words
 */
export function filterWordsByLanguage(words, learningLang, locale) {
	if (!words || learningLang === locale) return []

	return words.filter(word => {
		const sourceWord = word[`word_${learningLang}`]
		const translation = word[`word_${locale}`]
		return sourceWord && translation
	})
}

// Regex constants for word wrapping
export const PUNCTUATION_REGEX = /[\s….,;:?!–—«»"()\n\t]/
export const APOSTROPHE_REGEX = /['''`]/
