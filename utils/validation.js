/**
 * Validation et sanitization des entrées utilisateur
 */

/**
 * Nettoie une chaîne de caractères pour éviter les injections XSS
 * @param {string} input - La chaîne à nettoyer
 * @returns {string} - La chaîne nettoyée
 */
export const sanitizeText = input => {
	if (typeof input !== 'string') return ''

	return input
		.trim()
		// Remplacer les caractères HTML dangereux
		.replace(/[<>]/g, '')
		// Limiter les caractères spéciaux potentiellement dangereux
		.replace(/[{}[\]]/g, '')
		// Supprimer les scripts potentiels
		.replace(/javascript:/gi, '')
		.replace(/on\w+\s*=/gi, '')
}

/**
 * Valide et nettoie un mot avant insertion en base
 * @param {string} word - Le mot à valider
 * @param {number} maxLength - Longueur maximale (défaut: 200)
 * @returns {Object} - { isValid: boolean, sanitized: string, error: string }
 */
export const validateWord = (word, maxLength = 200) => {
	// Vérifier que c'est une chaîne
	if (typeof word !== 'string') {
		return {
			isValid: false,
			sanitized: '',
			error: 'Le mot doit être une chaîne de caractères',
		}
	}

	// Nettoyer
	const sanitized = sanitizeText(word)

	// Vérifier que le mot n'est pas vide après nettoyage
	if (!sanitized || sanitized.length === 0) {
		return {
			isValid: false,
			sanitized: '',
			error: 'Le mot ne peut pas être vide',
		}
	}

	// Vérifier la longueur minimale
	if (sanitized.length < 1) {
		return {
			isValid: false,
			sanitized: '',
			error: 'Le mot doit contenir au moins 1 caractère',
		}
	}

	// Vérifier la longueur maximale
	if (sanitized.length > maxLength) {
		return {
			isValid: false,
			sanitized: '',
			error: `Le mot ne peut pas dépasser ${maxLength} caractères`,
		}
	}

	// Vérifier qu'il contient au moins un caractère alphanumérique
	const hasAlphanumeric = /[\p{L}\p{N}]/u.test(sanitized)
	if (!hasAlphanumeric) {
		return {
			isValid: false,
			sanitized: '',
			error: 'Le mot doit contenir au moins une lettre ou un chiffre',
		}
	}

	return {
		isValid: true,
		sanitized,
		error: null,
	}
}

/**
 * Valide les données d'un mot complet (original + traduction)
 * @param {Object} wordData - { learningLangWord, browserLangWord }
 * @returns {Object} - { isValid: boolean, sanitized: Object, errors: Object }
 */
export const validateWordPair = ({ learningLangWord, browserLangWord }) => {
	const validatedLearning = validateWord(learningLangWord, 200)
	const validatedBrowser = validateWord(browserLangWord, 200)

	const isValid = validatedLearning.isValid && validatedBrowser.isValid

	return {
		isValid,
		sanitized: {
			learningLangWord: validatedLearning.sanitized,
			browserLangWord: validatedBrowser.sanitized,
		},
		errors: {
			learningLangWord: validatedLearning.error,
			browserLangWord: validatedBrowser.error,
		},
	}
}
