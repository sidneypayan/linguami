/**
 * Hook to manage flashcard settings (reversed mode, cards limit)
 * Persists settings to localStorage
 */

import { useState, useCallback } from 'react'

const STORAGE_KEYS = {
	REVERSED: 'flashcards_reversed',
	LIMIT: 'flashcards_limit'
}

const DEFAULT_LIMIT = 20

export function useFlashcardSettings() {
	// Reversed mode (e.g., FR → RU instead of RU → FR)
	const [isReversed, setIsReversed] = useState(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem(STORAGE_KEYS.REVERSED)
			return saved === 'true'
		}
		return false
	})

	// Cards limit per session
	const [cardsLimit, setCardsLimit] = useState(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem(STORAGE_KEYS.LIMIT)
			return saved ? parseInt(saved, 10) : DEFAULT_LIMIT
		}
		return DEFAULT_LIMIT
	})

	// Toggle reversed mode and save to localStorage
	const toggleReversed = useCallback(() => {
		setIsReversed(prev => {
			const newValue = !prev
			if (typeof window !== 'undefined') {
				localStorage.setItem(STORAGE_KEYS.REVERSED, newValue.toString())
			}
			return newValue
		})
	}, [])

	// Update cards limit and save to localStorage
	const updateCardsLimit = useCallback((newLimit) => {
		setCardsLimit(newLimit)
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEYS.LIMIT, newLimit.toString())
		}
	}, [])

	return {
		isReversed,
		cardsLimit,
		toggleReversed,
		updateCardsLimit
	}
}
