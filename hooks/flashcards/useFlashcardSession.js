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
		queryFn: async () => {
			const result = await getMaterialWordsAction({ materialId: normalizedMaterialId, userId })
			return result.success ? result.data : []
		},
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
	const [isSessionComplete, setIsSessionComplete] = useState(false)

	// Load guest words if not logged in
	useEffect(() => {
		if (!isUserLoggedIn && userLearningLanguage) {
			const words = loadGuestWordsHelper(userLearningLanguage, params?.material, pathname)
			console.log('[useFlashcardSession] Loading guest words:', {
				userLearningLanguage,
				wordsCount: words.length,
				words
			})
			setGuestWords(words)
		}
	}, [isUserLoggedIn, userLearningLanguage, params?.material, pathname])

	// Listen to guest word events
	useEffect(() => {
		if (!isUserLoggedIn && typeof window !== 'undefined') {
			const loadGuestWords = () => {
				const words = loadGuestWordsHelper(userLearningLanguage, params?.material, pathname)
				setGuestWords(words)
				// Reset session when guest words change to re-initialize with new words
				setSessionInitialized(false)
			}

			window.addEventListener('guestDictionaryUpdated', loadGuestWords)

			return () => {
				window.removeEventListener('guestDictionaryUpdated', loadGuestWords)
			}
		}
	}, [isUserLoggedIn, userLearningLanguage, params?.material, pathname])

	// Get appropriate word array based on page and user status
	const baseWordsArray = isUserLoggedIn ? userWords : guestWords

	// Filter words by language pair
	const filteredWords = useMemo(() => {
		if (!baseWordsArray || !userLearningLanguage || !locale) {
			console.log('[useFlashcardSession] Filtering failed - missing data:', {
				hasBaseWords: !!baseWordsArray,
				baseWordsCount: baseWordsArray?.length,
				userLearningLanguage,
				locale
			})
			return []
		}

		// Don't show words if learning language = interface language
		if (userLearningLanguage === locale) {
			console.log('[useFlashcardSession] Filtering failed - same language:', {
				userLearningLanguage,
				locale
			})
			return []
		}

		const filtered = baseWordsArray.filter(word => {
			const sourceWord = word[`word_${userLearningLanguage}`]
			const translation = word[`word_${locale}`]
			return sourceWord && translation
		})

		console.log('[useFlashcardSession] Filtered words:', {
			userLearningLanguage,
			locale,
			baseWordsCount: baseWordsArray.length,
			filteredCount: filtered.length,
			filtered
		})

		return filtered
	}, [baseWordsArray, userLearningLanguage, locale])

	// Initialize session cards
	useEffect(() => {
		// Don't reinitialize if session is already active
		if (sessionInitialized && sessionCards.length > 0) {
			return // Don't reinitialize during active session
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
		const initializedCards = filteredWords.map(initializeCardDefaults)

		// Filter for due cards - no limit at initialization (SRS determines what's due)
		const dueCards = getDueCards(initializedCards)

		console.log('[useFlashcardSession] Session initialization:', {
			filteredWordsCount: filteredWords.length,
			initializedCardsCount: initializedCards.length,
			dueCardsCount: dueCards.length
		})

		setSessionInitialized(true)

		if (dueCards.length > 0) {
			setSessionCards(dueCards)
			logger.log('[useFlashcardSession] Session initialized with', dueCards.length, 'cards')
		}
	}, [filteredWords, sessionInitialized, userLearningLanguage, locale, isUserLoggedIn, isLoadingWords])


	// Apply limit changes immediately during active session
	useEffect(() => {
		if (!sessionInitialized || sessionCards.length === 0 || !filteredWords) {
			return // No active session to adjust
		}

		// Get all due cards from filtered words
		const initializedCards = filteredWords.map(initializeCardDefaults)
		const allDueCards = getDueCards(initializedCards)

		// Get IDs of cards currently in session
		const currentCardIds = new Set(sessionCards.map(c => c.id))

		if (sessionCards.length > cardsLimit) {
			// Reduce: keep only the first cardsLimit cards
			setSessionCards(prev => prev.slice(0, cardsLimit))
			logger.log('[useFlashcardSession] Reduced session to', cardsLimit, 'cards')
		} else if (sessionCards.length < cardsLimit) {
			// Increase: add more due cards that aren't already in the session
			const additionalCards = allDueCards
				.filter(c => !currentCardIds.has(c.id))
				.slice(0, cardsLimit - sessionCards.length)

			if (additionalCards.length > 0) {
				setSessionCards(prev => [...prev, ...additionalCards])
				logger.log('[useFlashcardSession] Added', additionalCards.length, 'cards to session')
			}
		}
	}, [cardsLimit]) // Only react to cardsLimit changes

	// Reset session
	const resetSession = useCallback(() => {
		setSessionInitialized(false)
		setSessionCards([])
		setReviewedCount(0)
		setIsSessionComplete(false)
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

	// Remove current card from session and mark complete if it was the last one
	const removeCurrentCard = useCallback(() => {
		setSessionCards(prev => {
			const newCards = prev.slice(1)
			// Mark session complete if this was the last card
			if (newCards.length === 0) {
				setIsSessionComplete(true)
			}
			return newCards
		})
	}, [])

	// Add card back to session (for learning/relearning)
	const addCardToSession = useCallback((card) => {
		setSessionCards(prev => [...prev, card])
	}, [])

	// Requeue current card (remove from front, add to back) - atomic operation
	const requeueCurrentCard = useCallback((card) => {
		setSessionCards(prev => [...prev.slice(1), card])
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
		isSessionComplete,
		sessionInitialized,
		filteredWords,

		// Actions
		resetSession,
		startRandomPractice,
		removeCurrentCard,
		addCardToSession,
		requeueCurrentCard,
		incrementReviewedCount,
		setGuestWords
	}
}
