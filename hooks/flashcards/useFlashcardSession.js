/**
 * Hook to manage flashcard session state
 * Handles card initialization, filtering, and session queue
 * ✅ MIGRATED to React Query - removed Redux dependency
 * ✅ OPTIMIZED - extracted helper functions, Fisher-Yates shuffle, useMemo
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUserContext } from '@/context/user'
import { useParams, usePathname } from 'next/navigation'
import { getUserWordsAction, getMaterialWordsAction } from '@/app/actions/words'
import { getDueCards, CARD_STATES } from '@/utils/spacedRepetition'
import { getGuestWordsByLanguage } from '@/utils/guestDictionary'
import { logger } from '@/utils/logger'

// ==========================================
// Helper Functions
// ==========================================

/**
 * Fisher-Yates shuffle algorithm
 * More efficient and unbiased than .sort(() => Math.random() - 0.5)
 */
const fisherYatesShuffle = (array) => {
	const shuffled = [...array]
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}
	return shuffled
}

/**
 * Initialize card with default SRS fields if needed
 */
const initializeCardDefaults = (card) => {
	if (card.card_state) return { ...card }
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

/**
 * Load and filter guest words by material ID
 */
const loadGuestWordsHelper = (userLearningLanguage, materialId, pathname) => {
	if (!userLearningLanguage) return []
	const allWords = getGuestWordsByLanguage(userLearningLanguage)
	if (materialId && pathname !== '/dictionary') {
		return allWords.filter(word => String(word.material_id) === String(materialId))
	}
	return allWords
}



export function useFlashcardSession({ cardsLimit, locale }) {
	const { user, isUserLoggedIn, userLearningLanguage } = useUserContext()
	const params = useParams()
	const pathname = usePathname()
	const userId = user?.id

	// Determine if we're on dictionary page or material page
	// Memoize page type to avoid recalculations
	const isDictionaryPage = useMemo(() => pathname?.endsWith("/dictionary"), [pathname])
	const materialId = params?.material

	// Query for all user words (dictionary page)
	const { data: allUserWords = [], isLoading: isLoadingAllWords } = useQuery({
		queryKey: ['userWords', userId, userLearningLanguage],
		queryFn: async () => {
			const result = await getUserWordsAction({ userId, userLearningLanguage })
			return result.success ? result.data : []
		},
		enabled: !!userId && !!userLearningLanguage && isDictionaryPage && isUserLoggedIn,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})

	// Query for material-specific words
	const normalizedMaterialId = materialId ? String(materialId) : null
	const { data: materialWords = [], isLoading: isLoadingMaterialWords } = useQuery({
		queryKey: ['materialWords', normalizedMaterialId, userId],
		queryFn: () => getMaterialWordsAction({ materialId: normalizedMaterialId, userId }),
		enabled: !!userId && !!normalizedMaterialId && !isDictionaryPage && isUserLoggedIn,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})

	// Select appropriate words and loading state based on page
	const userWords = isDictionaryPage ? allUserWords : materialWords
	const isLoadingWords = isDictionaryPage ? isLoadingAllWords : isLoadingMaterialWords

	// Local state
	const [guestWords, setGuestWords] = useState([])
	const [sessionCards, setSessionCards] = useState([])
	const [sessionInitialized, setSessionInitialized] = useState(false)
	const [reviewedCount, setReviewedCount] = useState(0)
	const [sessionStartTime] = useState(Date.now())

	// Load guest words if not logged in
	useEffect(() => {
		if (!isUserLoggedIn && userLearningLanguage) {
			const words = loadGuestWordsHelper(userLearningLanguage, params?.material, pathname)
			setGuestWords(words)
		}
	}, [isUserLoggedIn, userLearningLanguage, params?.material, pathname])

	// Listen to guest word events
	useEffect(() => {
		if (!isUserLoggedIn && typeof window !== 'undefined') {
			const loadGuestWords = () => {
				const words = loadGuestWordsHelper(userLearningLanguage, params?.material, pathname)
				setGuestWords(words)
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
	const baseWordsArray = isUserLoggedIn ? userWords : guestWords

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
			const isStillLoading = isUserLoggedIn ? isLoadingWords : false
			if (!isStillLoading) {
				setSessionInitialized(true)
			}
			return
		}

		// Initialize cards with SRS fields if needed
		// Initialize cards using helper function
		const initializedCards = filteredWords.map(initializeCardDefaults)

		// Filter for due cards and apply limit
		const dueCards = getDueCards(initializedCards)
		const limitedCards = dueCards.slice(0, cardsLimit)

		setSessionInitialized(true)

		if (limitedCards.length > 0) {
			setSessionCards(limitedCards)
			logger.log('[useFlashcardSession] Session initialized with', limitedCards.length, 'cards')
		}
	}, [filteredWords, sessionInitialized, cardsLimit, userLearningLanguage, locale, isUserLoggedIn, isLoadingWords])

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
			// Use Fisher-Yates shuffle
			const shuffled = fisherYatesShuffle(activeCards)
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
