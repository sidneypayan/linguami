'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const FlashcardsContext = createContext()

// Session mode types
export const SESSION_MODE = {
	CARDS: 'cards',      // Limit by number of cards
	TIME: 'time',        // Limit by duration in minutes
}

// Default session options
const DEFAULT_SESSION_OPTIONS = {
	mode: SESSION_MODE.CARDS,
	cardsLimit: 9999,    // No limit for SRS mode (use all due cards)
	timeLimit: 5,        // in minutes
	isCustomSession: false,  // true = custom session, false = SRS mode
}

export function FlashcardsProvider({ children }) {
	const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false)
	const [sessionOptions, setSessionOptions] = useState(DEFAULT_SESSION_OPTIONS)

	// Open flashcards with optional session options
	// If no options passed = SRS mode (use defaults)
	// If options passed = Custom session mode
	const openFlashcards = useCallback((options = null) => {
		if (options) {
			// Custom session with specific options
			setSessionOptions({ ...DEFAULT_SESSION_OPTIONS, ...options, isCustomSession: true })
		} else {
			// Default SRS session
			setSessionOptions(DEFAULT_SESSION_OPTIONS)
		}
		setIsFlashcardsOpen(true)
	}, [])

	const closeFlashcards = useCallback(() => {
		setIsFlashcardsOpen(false)
	}, [])

	const toggleFlashcards = useCallback((isOpen) => {
		if (typeof isOpen === 'boolean') {
			setIsFlashcardsOpen(isOpen)
		} else {
			setIsFlashcardsOpen(prev => !prev)
		}
	}, [])

	// Update session options without opening
	const updateSessionOptions = useCallback((options) => {
		setSessionOptions(prev => ({ ...prev, ...options }))
	}, [])

	// Reset to defaults
	const resetSessionOptions = useCallback(() => {
		setSessionOptions(DEFAULT_SESSION_OPTIONS)
	}, [])

	return (
		<FlashcardsContext.Provider
			value={{
				isFlashcardsOpen,
				sessionOptions,
				openFlashcards,
				closeFlashcards,
				toggleFlashcards,
				updateSessionOptions,
				resetSessionOptions,
			}}
		>
			{children}
		</FlashcardsContext.Provider>
	)
}

export function useFlashcards() {
	const context = useContext(FlashcardsContext)
	if (!context) {
		throw new Error('useFlashcards must be used within FlashcardsProvider')
	}
	return context
}
