/**
 * Translation Context - Manages translation popup state
 * Replaces Redux state for translation UI
 */

'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const TranslationContext = createContext(null)

export function TranslationProvider({ children }) {
	const [isTranslationOpen, setIsTranslationOpen] = useState(false)
	const [translationData, setTranslationData] = useState({})
	const [wordSentence, setWordSentence] = useState([])
	const [coordinates, setCoordinates] = useState({ x: 0, y: 0 })
	const [translationLoading, setTranslationLoading] = useState(false)
	const [translationError, setTranslationError] = useState(null)

	const openTranslation = useCallback((data, sentence, coords) => {
		setTranslationData(data)
		setWordSentence(sentence || [])
		setCoordinates(coords)
		setTranslationError(null)
		setIsTranslationOpen(true)
	}, [])

	const closeTranslation = useCallback(() => {
		setIsTranslationOpen(false)
		setTranslationData({})
		setWordSentence([])

		// Dispatch event to resume video if needed
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new Event('translation-closed'))
		}
	}, [])

	const cleanTranslation = useCallback(() => {
		setTranslationData({})
		setTranslationError(null)
		setWordSentence([])
		setTranslationLoading(false)
	}, [])

	const setLoading = useCallback((loading) => {
		setTranslationLoading(loading)
	}, [])

	const setError = useCallback((error) => {
		setTranslationError(error)
		setTranslationLoading(false)
	}, [])

	const value = {
		isTranslationOpen,
		translationData,
		wordSentence,
		coordinates,
		translationLoading,
		translationError,
		openTranslation,
		closeTranslation,
		cleanTranslation,
		setLoading,
		setError,
		setTranslationData,
		setWordSentence,
	}

	return (
		<TranslationContext.Provider value={value}>
			{children}
		</TranslationContext.Provider>
	)
}

export function useTranslation() {
	const context = useContext(TranslationContext)
	if (!context) {
		throw new Error('useTranslation must be used within TranslationProvider')
	}
	return context
}
