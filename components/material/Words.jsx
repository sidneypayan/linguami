import React, { useMemo, useCallback } from 'react'
import styles from '@/styles/materials/Material.module.css'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from '@/context/translation'
import { useUserContext } from '@/context/user'
import { useWordWrapping } from '@/hooks/words/useWordWrapping'
import { translateWordAction, getTranslationStatsAction } from '@/app/actions/words'

const Words = ({ content, locale = 'fr' }) => {
	const { userLearningLanguage, isUserLoggedIn, isBootstrapping } = useUserContext()
	const { openTranslation, cleanTranslation, setLoading, setError } = useTranslation()

	// Content comes directly from DB (trusted source)
	const clean = useMemo(() => {
		if (!content) return ''
		return content
	}, [content])

	// Helper function to process translation result (shared between initial and fallback)
	const processTranslationResult = useCallback(async (wordInfos, displayWord, sentence, coordinates) => {
		// Get base form (infinitive, nominative, etc.)
		let inf = wordInfos.text || null
		let displayInf = inf // Default: same as base form


		// Extract aspect (for Russian verbs)
		let asp
		if (wordInfos.asp) {
			asp = wordInfos.asp === 'несов' ? 'imperfectif' : 'perfectif'
		}

		// Extract grammatical form
		let form
		if (wordInfos.pos) {
			form = wordInfos.pos === 'verb' ? 'infinitif' : 'nominatif'
		}

		// Extract translations (limit to 10 before sorting by popularity)
		const translations = (wordInfos.tr || []).map(tr => tr.text).slice(0, 10)

		// Get translation popularity stats (async, non-blocking)
		let translationStats = {}
		try {
			const statsResult = await getTranslationStatsAction({
				originalWord: wordInfos.text || displayWord, // Use base form for stats
				sourceLang: userLearningLanguage,
				targetLang: locale,
			})
			translationStats = statsResult.success ? statsResult.stats : {}
		} catch (error) {
			// If stats fail, continue without them
			console.warn('Failed to get translation stats:', error)
		}

		// Enrich translations with popularity counts and sort by popularity
		const enrichedTranslations = translations
			.map(translation => ({
				text: translation,
				count: translationStats[translation] || 0,
			}))
			.sort((a, b) => b.count - a.count) // Sort by popularity (descending)
			.slice(0, 5) // Keep top 5 after sorting

		// Map API response format to expected format
		const translationData = {
			word: displayWord,
			inf, // Base form for DB storage (e.g., "добрый" or "enseigner")
			displayInf, // Display form with all genders (e.g., "добрый · добрая · доброе")
			asp,
			form,
			definitions: enrichedTranslations, // Now contains objects with { text, count }
			sentence: sentence
		}

		// Use coordinates passed from handleClick
		openTranslation(translationData, sentence, coordinates || { x: 0, y: 0 })
		setLoading(false)
	}, [userLearningLanguage, locale, openTranslation, setLoading])

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
		mutationFn: translateWordAction,
		onMutate: () => {
			setLoading(true)
			// Don't clean translation here - causes unnecessary re-renders
		},
		onSuccess: async (response, variables) => {
			// Extract coordinates passed from handleClick
			const coords = variables.coordinates || { x: 0, y: 0 }

			// Check if action returned an error (e.g., translation limit reached)
			if (response.success === false || response.error) {
				openTranslation({ word: response.word || variables.word }, variables.sentence, coords)
				setError(response.error || 'Erreur lors de la traduction')
				setLoading(false)
				return
			}

			// Extract translations from Yandex API format
			// Yandex returns: { def: [{ text: "word", pos: "verb", tr: [{ text: "translation" }], asp: "несов" }] }
			const def = response.data?.def || []

			// Check if we have at least one definition
			if (def.length === 0 || !def[0]) {
				// Fallback: If word has French contraction (j', l', d', etc.), try to find infinitive
				const word = response.word
				if (/^[jldmtnsJLDMTNS]['']/.test(word)) {
					// Remove the pronoun (e.g., "j'enseigne" → "enseigne")
					let wordWithoutPronoun = word.replace(/^[jldmtnsJLDMTNS]['']/, '').toLowerCase()

					// For French verbs, try to convert to infinitive
					// For regular -er verbs: "enseigne" → "enseigner"
					// For -ir verbs: "finis" → "finir" (already ends in 'r')
					// For -re verbs: "rends" → "rendre" (need more complex logic)
					let wordToTry = wordWithoutPronoun

					// If it looks like a conjugated -er verb (ends in 'e'), try adding 'r'
					if (wordWithoutPronoun.endsWith('e') && !wordWithoutPronoun.endsWith('re')) {
						wordToTry = wordWithoutPronoun + 'r'
						console.log('[Words] Converting to infinitive:', wordWithoutPronoun, '→', wordToTry)
					}

					try {
						// Retry translation with infinitive form
						const retryResult = await translateWordAction({
							word: wordToTry,
							sentence: response.sentence,
							userLearningLanguage,
							locale,
							isAuthenticated: isUserLoggedIn,
						})

						// If retry succeeds, process the result recursively
						if (retryResult.data?.def?.length > 0) {
							// Update the word to original form for display
							retryResult.word = word
							// Process this result (reuse the logic below)
							const retryDef = retryResult.data.def[0]
							// Use original coordinates for retry
							await processTranslationResult(retryDef, word, response.sentence, coords)
							return
						}
					} catch (error) {
						console.warn('[Words] Fallback translation also failed:', error)
					}
				}

				// If no fallback or fallback failed, show error
				openTranslation({ word: response.word }, response.sentence, coords)
				setError('Aucune traduction trouvée')
				setLoading(false)
				return
			}

			// Get first definition (most relevant) and process it
			const wordInfos = def[0]
			await processTranslationResult(wordInfos, response.word, response.sentence, coords)
		},
		onError: (error, variables) => {
			// Extract coordinates passed from handleClick
			const coords = variables?.coordinates || { x: 0, y: 0 }

			// Open popup with error message so user can see what went wrong
			openTranslation(
				{ word: error.word || 'Unknown' },
				'',
				coords
			)
			setError(error.message)
			setLoading(false)
		}
	})

	// Handle word click
	const handleClick = useCallback(
		e => {
			// Prevent event from propagating to document (would trigger useClickOutside)
			e.stopPropagation()

			// Don't process clicks while bootstrapping or if learning language not set
			if (isBootstrapping || !userLearningLanguage) {
				return
			}

			// CRITICAL: Capture coordinates NOW (before async operations)
			// window.event is unreliable in async callbacks
			const clickCoordinates = {
				x: e.clientX,
				y: e.clientY
			}

			let word = e.target.textContent
			const fullText = e.target.parentElement.textContent

			// Handle French contractions (j'enseigne, l'université, etc.)
			// If the clicked word is preceded by an apostrophe, include the word before it
			const wordIndex = fullText.indexOf(word)
			if (wordIndex > 0) {
				const charBefore = fullText[wordIndex - 1]
				// Check for apostrophe (regular or typographic)
				if (charBefore === "'" || charBefore === "'") {
					// Find the start of the word before the apostrophe
					let i = wordIndex - 2
					while (i >= 0 && /[a-zA-Zà-ÿÀ-ÿ]/.test(fullText[i])) {
						i--
					}
					// Include the word before apostrophe
					const wordBefore = fullText.substring(i + 1, wordIndex - 1)
					if (wordBefore) {
						word = wordBefore + charBefore + word
					}
				}
			}

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
				coordinates: clickCoordinates, // Pass coordinates to mutation
			})
		},
		[translationMutation, userLearningLanguage, locale, isUserLoggedIn, extractSentence, isBootstrapping]
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
