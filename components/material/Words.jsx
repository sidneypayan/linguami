import React from 'react'
import styles from '@/styles/materials/Material.module.css'
import { useDispatch } from 'react-redux'
import {
	translateWord,
	toggleTranslationContainer,
	cleanTranslation,
} from '@/features/words/wordsSlice'
import { useMemo, useCallback } from 'react'
import { useUserContext } from '@/context/user'

const Words = ({ content, locale = 'fr' }) => {
	const { userLearningLanguage, isUserLoggedIn } = useUserContext()
	const dispatch = useDispatch()

	// Le contenu vient directement de la DB (source de confiance)
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

			dispatch(
				translateWord({
					word,
					sentence,
					userLearningLanguage,
					locale,
					isAuthenticated: isUserLoggedIn,
				})
			)
			dispatch(toggleTranslationContainer())
			dispatch(cleanTranslation())
		},
		[dispatch, userLearningLanguage, locale, isUserLoggedIn, extractSentence]
	)

	// Fonction pour vérifier si un caractère est de la ponctuation
	const isPunctuation = useCallback((char) => {
		// Ponctuation courante en français et russe
		const punctuationRegex = /[\s….,;:?!–—«»"()\n\t]/
		return punctuationRegex.test(char)
	}, [])

	// Fonction pour vérifier si un caractère est une apostrophe
	const isApostrophe = useCallback((char) => {
		const apostropheRegex = /['''`]/
		return apostropheRegex.test(char)
	}, [])

	const wrapWords = useCallback(
		sentence => {
			if (!sentence) return sentence

			// Segmenter le texte en graphèmes (caractères) pour gérer correctement Unicode
			// On ne peut pas utiliser Intl.Segmenter avec granularity: 'word' car il ne gère pas bien
			// la ponctuation collée aux mots. On va donc découper manuellement.

			const result = []
			let currentWord = ''
			let key = 0

			for (let i = 0; i < sentence.length; i++) {
				const char = sentence[i]

				// Si c'est de la ponctuation (espaces, virgules, etc.)
				if (isPunctuation(char)) {
					// Terminer le mot en cours s'il existe
					if (currentWord) {
						result.push(
							<span
								key={key++}
								className={styles.translate}
								onClick={handleClick}>
								{currentWord}
							</span>
						)
						currentWord = ''
					}
					// Ajouter la ponctuation
					result.push(
						<span key={key++} className={styles.punctuation}>
							{char}
						</span>
					)
				}
				// Si c'est une apostrophe (traitement spécial)
				else if (isApostrophe(char)) {
					// Terminer le mot en cours s'il existe
					if (currentWord) {
						result.push(
							<span
								key={key++}
								className={`${styles.translate} ${styles.nospace}`}
								onClick={handleClick}>
								{currentWord}
							</span>
						)
						currentWord = ''
					}
					// Ajouter l'apostrophe comme ponctuation
					result.push(
						<span key={key++} className={styles.punctuation}>
							{char}
						</span>
					)
				}
				// Sinon c'est un caractère normal (lettre, chiffre, accent, etc.)
				else {
					currentWord += char
				}
			}

			// Terminer le dernier mot s'il existe
			if (currentWord) {
				result.push(
					<span
						key={key++}
						className={styles.translate}
						onClick={handleClick}>
						{currentWord}
					</span>
				)
			}

			return result
		},
		[handleClick, isPunctuation, isApostrophe]
	)

	const wrapSentences = useMemo(() => {
		if (!clean) return clean

		// Splitter sur les sauts de ligne pour traiter ligne par ligne
		const lines = clean.split(/\r?\n/)

		return lines.map((line, index) => (
			<React.Fragment key={index}>
				{line && (
					<span className={styles.sentence}>
						{wrapWords(line)}
					</span>
				)}
				{index < lines.length - 1 && <br />}
			</React.Fragment>
		))
	}, [clean, wrapWords])

	return wrapSentences
}

// Mémoïser le composant pour éviter re-renders inutiles
export default React.memo(Words)
