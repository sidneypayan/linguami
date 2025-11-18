/**
 * Hook for wrapping text content with clickable words
 * Handles punctuation, apostrophes, and Unicode correctly
 */

import { useCallback } from 'react'
import { PUNCTUATION_REGEX, APOSTROPHE_REGEX } from '@/utils/wordMapping'

export function useWordWrapping(handleWordClick, styles) {
	// Check if character is punctuation
	const isPunctuation = useCallback((char) => {
		return PUNCTUATION_REGEX.test(char)
	}, [])

	// Check if character is apostrophe
	const isApostrophe = useCallback((char) => {
		return APOSTROPHE_REGEX.test(char)
	}, [])

	// Wrap words in clickable spans
	const wrapWords = useCallback(
		sentence => {
			if (!sentence) return sentence

			const result = []
			let currentWord = ''
			let key = 0

			for (let i = 0; i < sentence.length; i++) {
				const char = sentence[i]

				// If punctuation (spaces, commas, etc.)
				if (isPunctuation(char)) {
					// Finish current word if exists
					if (currentWord) {
						result.push(
							<span
								key={key++}
								className={styles.translate}
								onClick={handleWordClick}>
								{currentWord}
							</span>
						)
						currentWord = ''
					}
					// Add punctuation
					result.push(
						<span key={key++} className={styles.punctuation}>
							{char}
						</span>
					)
				}
				// If apostrophe (special treatment)
				else if (isApostrophe(char)) {
					// Finish current word if exists
					if (currentWord) {
						result.push(
							<span
								key={key++}
								className={`${styles.translate} ${styles.nospace}`}
								onClick={handleWordClick}>
								{currentWord}
							</span>
						)
						currentWord = ''
					}
					// Add apostrophe as punctuation
					result.push(
						<span key={key++} className={styles.punctuation}>
							{char}
						</span>
					)
				}
				// Normal character (letter, digit, accent, etc.)
				else {
					currentWord += char
				}
			}

			// Finish last word if exists
			if (currentWord) {
				result.push(
					<span
						key={key++}
						className={styles.translate}
						onClick={handleWordClick}>
						{currentWord}
					</span>
				)
			}

			return result
		},
		[handleWordClick, isPunctuation, isApostrophe, styles]
	)

	return wrapWords
}
