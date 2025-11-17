import React, { useMemo, useCallback } from 'react'
import styles from '@/styles/materials/Material.module.css'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from '@/context/translation'
import { useUserContext } from '@/context/user'
import { useWordWrapping } from '@/hooks/words/useWordWrapping'
import { translateWord } from '@/lib/words-client'

const Words = ({ content, locale = 'fr' }) => {
	const { userLearningLanguage, isUserLoggedIn } = useUserContext()
	const { openTranslation, cleanTranslation, setLoading, setError } = useTranslation()

	// Content comes directly from DB (trusted source)
	const clean = useMemo(() => {
		if (!content) return ''
		return content
	}, [content])

	// Helper function to extract the sentence containing the clicked word
	const extractSentence = useCallback((fullText, word) => {
		if (!fullText || !word) return fullText

		// Find the word position in the full text
		const wordIndex = fullText.toLowerCase().indexOf(word.toLowerCase())
		if (wordIndex === -1) return fullText

		// Find sentence start (go backwards from word position)
		let sentenceStart = 0
		const textBeforeWord = fullText.substring(0, wordIndex)
		const lastDelimiterMatch = textBeforeWord.match(/[.!?\n](?=[^.!?\n]*$)/)
		if (lastDelimiterMatch) {
			sentenceStart = textBeforeWord.lastIndexOf(lastDelimiterMatch[0]) + 1
		}

		// Find sentence end (go forward from word position)
		let sentenceEnd = fullText.length
		const textAfterWord = fullText.substring(wordIndex)
		const nextDelimiterMatch = textAfterWord.match(/[.!?\n]/)
		if (nextDelimiterMatch) {
			sentenceEnd = wordIndex + textAfterWord.indexOf(nextDelimiterMatch[0]) + 1
		}

		// Extract and clean the sentence
		return fullText.substring(sentenceStart, sentenceEnd).trim()
	}, [])

	// React Query: Translation mutation
	const translationMutation = useMutation({
		mutationFn: translateWord,
		onMutate: () => {
			setLoading(true)
			cleanTranslation()
		},
		onSuccess: (response) => {
			// Extract translations from Yandex API format
			// Yandex returns: { def: [{ text: "word", tr: [{ text: "translation" }] }] }
			// We need to flatten all translations from all definitions
			const definitions = response.data?.def || []
			const allTranslations = definitions.flatMap(def =>
				(def.tr || []).map(tr => tr.text)
			)

			// Map API response format to expected format
			const translationData = {
				word: response.word,
				definitions: allTranslations.length > 0 ? allTranslations : null,
				sentence: response.sentence
			}
			openTranslation(translationData, response.sentence, {
				x: window.event?.clientX || 0,
				y: window.event?.clientY || 0
			})
			setLoading(false)
		},
		onError: (error) => {
			setError(error.message)
		}
	})

	// Handle word click
	const handleClick = useCallback(
		e => {
			const word = e.target.textContent
			const fullText = e.target.parentElement.textContent

			// Extract only the sentence containing the clicked word
			const sentence = extractSentence(fullText, word)

			// Dispatch custom event to pause video
			if (typeof window !== 'undefined') {
				window.dispatchEvent(new Event('word-clicked'))
			}

			translationMutation.mutate({
				word,
				sentence,
				userLearningLanguage,
				locale,
				isAuthenticated: isUserLoggedIn,
			})
		},
		[translationMutation, userLearningLanguage, locale, isUserLoggedIn, extractSentence]
	)

	// Use word wrapping hook
	const wrapWords = useWordWrapping(handleClick, styles)

	// Wrap sentences with clickable words
	const wrapSentences = useMemo(() => {
		if (!clean) return clean

		// Split on newlines to process line by line
		const lines = clean.split(/\r?\n/)

		return lines.map((line, index) => (
			<React.Fragment key={index}>
				{line && <span className={styles.sentence}>{wrapWords(line)}</span>}
				{index < lines.length - 1 && <br />}
			</React.Fragment>
		))
	}, [clean, wrapWords])

	return wrapSentences
}

// Memoize component to avoid unnecessary re-renders
export default React.memo(Words)
