import React, { useMemo, useCallback } from 'react'
import styles from '@/styles/materials/Material.module.css'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from '@/context/translation'
import { useUserContext } from '@/context/user'
import { useWordWrapping } from '@/hooks/words/useWordWrapping'
import { translateWordAction, getTranslationStatsAction } from '@/app/actions/words'

const Words = ({ content, locale = 'fr' }) => {
	const { userLearningLanguage, userProfile, isUserLoggedIn, isBootstrapping } = useUserContext()

	// Get spoken language: DB for logged-in users, localStorage or locale for guests
	const spokenLanguage = useMemo(() => {
		if (userProfile?.spoken_language) {
			return userProfile.spoken_language
		}
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('spoken_language')
			if (stored) return stored
		}
		return locale
	}, [userProfile?.spoken_language, locale])
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
				targetLang: spokenLanguage,
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
	}, [userLearningLanguage, spokenLanguage, openTranslation, setLoading])

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
				// Fallback: If word has French contraction (j', l', d', etc.), try without contraction
				const word = response.word
				if (/^[jldmtnsJLDMTNS]['']/.test(word)) {
					// Remove the pronoun/article (e.g., "j'enseigne" → "enseigne", "d'apprentissage" → "apprentissage")
					const wordWithoutPronoun = word.replace(/^[jldmtnsJLDMTNS]['']/, '').toLowerCase()

					try {
						// FIRST ATTEMPT: Try the word without contraction as-is
						// For nouns like "d'apprentissage" → "apprentissage", this should work

						let retryResult = await translateWordAction({
							word: wordWithoutPronoun,
							sentence: response.sentence,
							userLearningLanguage,
							locale: spokenLanguage,
							isAuthenticated: isUserLoggedIn,
						})

						// If first attempt succeeds, use it
						if (retryResult.data?.def?.length > 0) {
							retryResult.word = word
							const retryDef = retryResult.data.def[0]
							await processTranslationResult(retryDef, word, response.sentence, coords)
							return
						}

						// SECOND ATTEMPT: If it failed and looks like a verb, try infinitive form
						// For verbs like "j'enseigne" → "enseigne" → "enseigner"
						if (wordWithoutPronoun.endsWith('e') && !wordWithoutPronoun.endsWith('re')) {
							const infinitiveForm = wordWithoutPronoun + 'r'


							retryResult = await translateWordAction({
								word: infinitiveForm,
								sentence: response.sentence,
								userLearningLanguage,
								locale: spokenLanguage,
								isAuthenticated: isUserLoggedIn,
							})

							if (retryResult.data?.def?.length > 0) {
								retryResult.word = word
								const retryDef = retryResult.data.def[0]
								await processTranslationResult(retryDef, word, response.sentence, coords)
								return
							}
						}
					} catch (error) {
						console.warn('[Words] Fallback translation failed:', error)
					}
				}

				// If no fallback or fallback failed, show empty translation (no error)
				// This allows the user to add their own translation
				const emptyTranslation = {
					word: response.word,
					inf: null,
					displayInf: null,
					asp: null,
					form: null,
					definitions: [], // Empty array, not undefined
					sentence: response.sentence
				}
				openTranslation(emptyTranslation, response.sentence, coords)
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

			// Remove Russian stress marks (combining acute accent) for translation
			// Russian stress marks are added for learning but don't exist in real words
			const cleanWord = word.replace(/[\u0301\u0300\u0302\u0303\u0308]/g, '')

			// Extract only the sentence containing the clicked word
			const sentence = extractSentence(fullText, cleanWord)

			// Dispatch custom event to pause video
			if (typeof window !== 'undefined') {
				window.dispatchEvent(new Event('word-clicked'))
			}

			translationMutation.mutate({
				word: cleanWord,
				sentence,
				userLearningLanguage,
				locale: spokenLanguage,
				isAuthenticated: isUserLoggedIn,
				coordinates: clickCoordinates, // Pass coordinates to mutation
			})
		},
		[translationMutation, userLearningLanguage, spokenLanguage, isUserLoggedIn, extractSentence, isBootstrapping]
	)

	// Use word wrapping hook
	const wrapWords = useWordWrapping(handleClick, styles)

		// Helper function to parse character names markup [NAME]
	const parseCharacterNames = useCallback((text) => {
		if (!text) return text

		// Common French names for gender detection
		const maleNames = ['MARC', 'PIERRE', 'JEAN', 'LUC', 'PAUL', 'MICHEL', 'THOMAS', 'NICOLAS', 'JULIEN', 'ALEXANDRE', 'ANTOINE', 'MAXIME', 'SERVEUR', 'GARÇON', 'HOMME', 'MONSIEUR']
		const femaleNames = ['SOPHIE', 'MARIE', 'JULIE', 'CLAIRE', 'EMMA', 'CAMILLE', 'LÉA', 'LAURA', 'SARAH', 'MANON', 'CHARLOTTE', 'LUCIE', 'SERVEUSE', 'FEMME', 'MADAME', 'MADEMOISELLE']

		const detectGender = (name) => {
			const upperName = name.toUpperCase().trim()
			if (maleNames.includes(upperName)) return 'male'
			if (femaleNames.includes(upperName)) return 'female'
			return 'neutral'
		}

		// Regular expression to find [CHARACTER_NAME] patterns
		const characterRegex = /\[([A-ZÀ-ÿ\s]+)\]/g
		const parts = []
		let lastIndex = 0
		let match

		while ((match = characterRegex.exec(text)) !== null) {
			// Add text before the match
			if (match.index > lastIndex) {
				parts.push({
					type: 'text',
					content: text.substring(lastIndex, match.index)
				})
			}

			// Add the character name with detected gender
			parts.push({
				type: 'character',
				content: match[1], // The name without brackets
				gender: detectGender(match[1])
			})

			lastIndex = match.index + match[0].length
		}

		// Add remaining text after last match
		if (lastIndex < text.length) {
			parts.push({
				type: 'text',
				content: text.substring(lastIndex)
			})
		}

		// If no matches found, return original text wrapped
		if (parts.length === 0) {
			return text
		}

		return parts
	}, [])

	// Wrap sentences with clickable words
	const wrapSentences = useMemo(() => {
		if (!clean) return clean

		// Split on newlines to process line by line
		const lines = clean.split(/\r?\n/)

		return lines.map((line, lineIndex) => {
			if (!line) return <span key={lineIndex} style={{ display: 'block', marginBottom: '1.2rem' }} />

			// Parse character names in the line
			const parts = parseCharacterNames(line)

			// If no character names found, render normally
			if (typeof parts === 'string') {
				return (
					<span key={lineIndex} style={{ display: 'block', marginBottom: '0.5rem' }}>
						<span className={styles.sentence}>{wrapWords(line)}</span>
					</span>
				)
			}

			// Render line with styled character names
			return (
				<span key={lineIndex} style={{ display: 'block', marginBottom: '0.5rem' }}>
					<span className={styles.sentence}>
						{parts.map((part, partIndex) => {
							if (part.type === 'character') {
								// Format name: first letter uppercase, rest lowercase
								const formattedName = part.content.charAt(0).toUpperCase() + part.content.slice(1).toLowerCase()
								return (
									<span
										key={partIndex}
										style={{
											fontWeight: 600,
											marginRight: '16px'
										}}
									>
										{formattedName}
									</span>
								)
							} else {
								return wrapWords(part.content)
							}
						})}
					</span>
				</span>
			)
		})
	}, [clean, wrapWords, parseCharacterNames])

	return wrapSentences
}

// Memoize component to avoid unnecessary re-renders
export default React.memo(Words)
