/**
 * Hook to manage flashcard session state
 * Handles card initialization, filtering, and session queue
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useUserContext } from '@/context/user'
import { useParams, usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { getDueCards, CARD_STATES } from '@/utils/spacedRepetition'
import { getGuestWordsByLanguage } from '@/utils/guestDictionary'
import { logger } from '@/utils/logger'

export function useFlashcardSession({ cardsLimit, locale }) {
	const { user, isUserLoggedIn, userLearningLanguage } = useUserContext()
	const params = useParams()
	const pathname = usePathname()

	// Redux state (temporary until full migration)
	const { user_material_words, user_words, user_words_loading } = useSelector(store => store.words)

	// Local state
	const [guestWords, setGuestWords] = useState([])
	const [sessionCards, setSessionCards] = useState([])
	const [sessionInitialized, setSessionInitialized] = useState(false)
	const [reviewedCount, setReviewedCount] = useState(0)
	const [sessionStartTime] = useState(Date.now())

	// Load guest words if not logged in
	useEffect(() => {
		if (!isUserLoggedIn && userLearningLanguage) {
			const allWords = getGuestWordsByLanguage(userLearningLanguage)
			const materialId = params?.material

			if (materialId && pathname !== '/dictionary') {
				const materialWords = allWords.filter(word =>
					String(word.material_id) === String(materialId)
				)
				setGuestWords(materialWords)
			} else {
				setGuestWords(allWords)
			}
		}
	}, [isUserLoggedIn, userLearningLanguage, params?.material, pathname])

	// Listen to guest word events
	useEffect(() => {
		if (!isUserLoggedIn && typeof window !== 'undefined') {
			const loadGuestWords = () => {
				if (userLearningLanguage) {
					const allWords = getGuestWordsByLanguage(userLearningLanguage)
					const materialId = params?.material

					if (materialId && pathname !== '/dictionary') {
						const materialWords = allWords.filter(word =>
							String(word.material_id) === String(materialId)
						)
						setGuestWords(materialWords)
					} else {
						setGuestWords(allWords)
					}
				}
			}

			window.addEventListener('guestWordAdded', loadGuestWords)
			window.addEventListener('guestWordDeleted', loadGuestWords)

			return () => {
				window.removeEventListener('guestWordAdded', loadGuestWords)
				window.removeEventListener('guestWordDeleted', loadGuestWords)
			}
		}
	}, [isUserLoggedIn, userLearningLanguage, params?.material, pathname])

	// Get appropriate word array based on page and user status
	const isDictionaryPage = pathname?.endsWith('/dictionary')
	const baseWordsArray = isUserLoggedIn
		? (isDictionaryPage ? user_words : user_material_words)
		: guestWords

	// Filter words by language pair
	const filteredWords = useMemo(() => {
		if (!baseWordsArray || !userLearningLanguage || !locale) {
			return []
		}

		// Don't show words if learning language = interface language
		if (userLearningLanguage === locale) {
			return []
		}

		return baseWordsArray.filter(word => {
			const sourceWord = word[`word_${userLearningLanguage}`]
			const translation = word[`word_${locale}`]
			return sourceWord && translation
		})
	}, [baseWordsArray, userLearningLanguage, locale])

	// Initialize session cards
	useEffect(() => {
		if (sessionInitialized) {
			return // Don't reinitialize during session
		}

		if (!filteredWords) {
			return // Still loading
		}

		if (!userLearningLanguage || !locale) {
			return // Missing language context
		}

		if (filteredWords.length === 0) {
			const isStillLoading = isUserLoggedIn ? user_words_loading : false
			if (!isStillLoading) {
				setSessionInitialized(true)
			}
			return
		}

		// Initialize cards with SRS fields if needed
		const initializedCards = filteredWords.map(card => {
			if (!card.card_state) {
				return {
					...card,
					card_state: CARD_STATES.NEW,
					ease_factor: 2.5,
					interval: 0,
					learning_step: null,
					next_review_date: null,
					last_review_date: null,
					reviews_count: 0,
					lapses: 0,
					is_suspended: false
				}
			}
			return { ...card }
		})

		// Filter for due cards and apply limit
		const dueCards = getDueCards(initializedCards)
		const limitedCards = dueCards.slice(0, cardsLimit)

		setSessionInitialized(true)

		if (limitedCards.length > 0) {
			setSessionCards(limitedCards)
			logger.log('[useFlashcardSession] Session initialized with', limitedCards.length, 'cards')
		}
	}, [filteredWords, sessionInitialized, cardsLimit, userLearningLanguage, locale, isUserLoggedIn, user_words_loading])

	// Reset session
	const resetSession = useCallback(() => {
		setSessionInitialized(false)
		setSessionCards([])
		setReviewedCount(0)
	}, [])

	// Start random practice session
	const startRandomPractice = useCallback((practiceCount) => {
		if (filteredWords && filteredWords.length > 0) {
			const initializedCards = filteredWords.map(card => {
				if (!card.card_state) {
					return {
						...card,
						card_state: CARD_STATES.NEW,
						ease_factor: 2.5,
						interval: 0,
						learning_step: null,
						next_review_date: null,
						last_review_date: null,
						reviews_count: 0,
						lapses: 0,
						is_suspended: false
					}
				}
				return { ...card }
			})

			const activeCards = initializedCards.filter(card => !card.is_suspended)
			const shuffled = [...activeCards].sort(() => Math.random() - 0.5)
			const selectedCards = shuffled.slice(0, Math.min(practiceCount, shuffled.length))

			setSessionCards(selectedCards)
			logger.log('[useFlashcardSession] Random practice started with', selectedCards.length, 'cards')
		}
	}, [filteredWords])

	// Remove current card from session
	const removeCurrentCard = useCallback(() => {
		setSessionCards(prev => prev.slice(1))
	}, [])

	// Add card back to session (for learning/relearning)
	const addCardToSession = useCallback((card) => {
		setSessionCards(prev => [...prev, card])
	}, [])

	// Increment reviewed count
	const incrementReviewedCount = useCallback(() => {
		setReviewedCount(prev => prev + 1)
	}, [])

	// Calculate session duration in minutes
	const sessionDuration = useMemo(() => {
		return Math.floor((Date.now() - sessionStartTime) / 60000)
	}, [sessionStartTime])

	return {
		// State
		sessionCards,
		currentCard: sessionCards[0] || null,
		reviewedCount,
		sessionDuration,
		isSessionComplete: sessionCards.length === 0 && reviewedCount > 0,
		sessionInitialized,
		filteredWords,

		// Actions
		resetSession,
		startRandomPractice,
		removeCurrentCard,
		addCardToSession,
		incrementReviewedCount,
		setGuestWords
	}
}
