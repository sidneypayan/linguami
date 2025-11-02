/**
 * Gestion du dictionnaire pour les utilisateurs invités (non connectés)
 * Stockage dans localStorage avec limite de 20 mots
 */

const GUEST_WORDS_KEY = 'guest_dictionary_words'
const MAX_GUEST_WORDS = 20

/**
 * Récupère tous les mots du dictionnaire invité
 * @returns {Array} Liste des mots
 */
export function getGuestWords() {
	if (typeof window === 'undefined') return []

	try {
		const stored = localStorage.getItem(GUEST_WORDS_KEY)
		return stored ? JSON.parse(stored) : []
	} catch (error) {
		console.error('Error reading guest words:', error)
		return []
	}
}

/**
 * Ajoute un mot au dictionnaire invité
 * @param {Object} wordData - Données du mot à ajouter
 * @returns {Object} { success: boolean, word?: Object, error?: string, wordsCount?: number }
 */
export function addGuestWord(wordData) {
	if (typeof window === 'undefined') {
		return { success: false, error: 'Not in browser environment' }
	}

	try {
		const currentWords = getGuestWords()

		// Vérifier la limite
		if (currentWords.length >= MAX_GUEST_WORDS) {
			return {
				success: false,
				error: 'limit_reached',
				wordsCount: currentWords.length,
				maxWords: MAX_GUEST_WORDS
			}
		}

		// Vérifier si la PAIRE (mot source + traduction) existe déjà
		const duplicateExists = currentWords.some(w => {
			// Vérifier toutes les combinaisons de paires possibles
			// Par exemple: word_ru + word_fr, word_fr + word_ru, etc.
			const pairs = [
				// Paire russe-français
				wordData.word_ru && wordData.word_fr &&
					w.word_ru === wordData.word_ru && w.word_fr === wordData.word_fr,
				// Paire russe-anglais
				wordData.word_ru && wordData.word_en &&
					w.word_ru === wordData.word_ru && w.word_en === wordData.word_en,
				// Paire français-russe
				wordData.word_fr && wordData.word_ru &&
					w.word_fr === wordData.word_fr && w.word_ru === wordData.word_ru,
				// Paire français-anglais
				wordData.word_fr && wordData.word_en &&
					w.word_fr === wordData.word_fr && w.word_en === wordData.word_en,
				// Paire anglais-russe
				wordData.word_en && wordData.word_ru &&
					w.word_en === wordData.word_en && w.word_ru === wordData.word_ru,
				// Paire anglais-français
				wordData.word_en && wordData.word_fr &&
					w.word_en === wordData.word_en && w.word_fr === wordData.word_fr,
			]

			// Retourner true si au moins une paire correspond
			return pairs.some(pair => pair === true)
		})

		if (duplicateExists) {
			return {
				success: false,
				error: 'duplicate',
				wordsCount: currentWords.length
			}
		}

		// Créer le mot avec un ID unique
		const newWord = {
			id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			...wordData,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			// Champs SRS pour les flashcards
			card_state: 'new',
			ease_factor: 2.5,
			interval: 0,
			learning_step: null,
			next_review_date: null,
			last_review_date: null,
			reviews_count: 0,
			lapses: 0,
			is_suspended: false,
		}

		// Ajouter le mot
		const updatedWords = [...currentWords, newWord]
		localStorage.setItem(GUEST_WORDS_KEY, JSON.stringify(updatedWords))

		return {
			success: true,
			word: newWord,
			wordsCount: updatedWords.length,
			remainingWords: MAX_GUEST_WORDS - updatedWords.length
		}
	} catch (error) {
		console.error('Error adding guest word:', error)
		return { success: false, error: 'storage_error' }
	}
}

/**
 * Supprime un mot du dictionnaire invité
 * @param {string} wordId - ID du mot à supprimer
 * @returns {boolean} true si supprimé avec succès
 */
export function deleteGuestWord(wordId) {
	if (typeof window === 'undefined') return false

	try {
		const currentWords = getGuestWords()
		const filteredWords = currentWords.filter(w => w.id !== wordId)

		if (filteredWords.length === currentWords.length) {
			return false // Mot non trouvé
		}

		localStorage.setItem(GUEST_WORDS_KEY, JSON.stringify(filteredWords))
		return true
	} catch (error) {
		console.error('Error deleting guest word:', error)
		return false
	}
}

/**
 * Met à jour un mot (utilisé pour les flashcards SRS)
 * @param {string} wordId - ID du mot
 * @param {Object} updates - Champs à mettre à jour
 * @returns {Object|null} Le mot mis à jour ou null
 */
export function updateGuestWord(wordId, updates) {
	if (typeof window === 'undefined') return null

	try {
		const currentWords = getGuestWords()
		const wordIndex = currentWords.findIndex(w => w.id === wordId)

		if (wordIndex === -1) return null

		const updatedWord = {
			...currentWords[wordIndex],
			...updates,
			updated_at: new Date().toISOString()
		}

		currentWords[wordIndex] = updatedWord
		localStorage.setItem(GUEST_WORDS_KEY, JSON.stringify(currentWords))

		return updatedWord
	} catch (error) {
		console.error('Error updating guest word:', error)
		return null
	}
}

/**
 * Compte le nombre de mots dans le dictionnaire invité
 * @returns {number}
 */
export function getGuestWordsCount() {
	return getGuestWords().length
}

/**
 * Vérifie si la limite est atteinte
 * @returns {boolean}
 */
export function isGuestLimitReached() {
	return getGuestWordsCount() >= MAX_GUEST_WORDS
}

/**
 * Récupère le nombre de mots restants
 * @returns {number}
 */
export function getRemainingGuestWords() {
	return Math.max(0, MAX_GUEST_WORDS - getGuestWordsCount())
}

/**
 * Filtre les mots par langue d'apprentissage
 * @param {string} learningLanguage - Code de langue (ru, fr, en)
 * @returns {Array}
 */
export function getGuestWordsByLanguage(learningLanguage) {
	const allWords = getGuestWords()
	return allWords.filter(word => word.word_lang === learningLanguage)
}

/**
 * Efface tous les mots du dictionnaire invité
 * (Utilisé quand l'utilisateur se connecte et veut migrer ses mots)
 * @returns {boolean}
 */
export function clearGuestWords() {
	if (typeof window === 'undefined') return false

	try {
		localStorage.removeItem(GUEST_WORDS_KEY)
		return true
	} catch (error) {
		console.error('Error clearing guest words:', error)
		return false
	}
}

/**
 * Exporte les mots pour migration vers un compte utilisateur
 * @returns {Array}
 */
export function exportGuestWords() {
	return getGuestWords().map(word => {
		// Retirer l'ID invité et les métadonnées locales
		const { id, ...wordData } = word
		return wordData
	})
}

export const GUEST_DICTIONARY_CONFIG = {
	MAX_WORDS: MAX_GUEST_WORDS,
	STORAGE_KEY: GUEST_WORDS_KEY
}
