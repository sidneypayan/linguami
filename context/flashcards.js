'use client'

import { createContext, useContext, useState } from 'react'

const FlashcardsContext = createContext()

export function FlashcardsProvider({ children }) {
	const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false)

	const openFlashcards = () => setIsFlashcardsOpen(true)
	const closeFlashcards = () => setIsFlashcardsOpen(false)
	const toggleFlashcards = (isOpen) => {
		if (typeof isOpen === 'boolean') {
			setIsFlashcardsOpen(isOpen)
		} else {
			setIsFlashcardsOpen(prev => !prev)
		}
	}

	return (
		<FlashcardsContext.Provider
			value={{
				isFlashcardsOpen,
				openFlashcards,
				closeFlashcards,
				toggleFlashcards,
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
