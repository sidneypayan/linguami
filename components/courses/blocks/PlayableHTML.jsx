'use client'

import PlayableWord from './PlayableWord'

/**
 * PlayableHTML Component
 * Parses HTML text and makes words with audio URLs playable
 * Similar to PlayableText but handles HTML content
 *
 * @param {string} html - HTML string containing text
 * @param {Object} audioUrls - Object mapping words to audio URLs
 * @param {boolean} allowSingleLetters - Allow audio on single Cyrillic letters (default: false)
 */
const PlayableHTML = ({ html, audioUrls = {}, allowSingleLetters = false }) => {
	if (!html) return null

	// If no audio URLs provided, just return plain HTML
	if (Object.keys(audioUrls).length === 0) {
		return <span dangerouslySetInnerHTML={{ __html: html }} />
	}

	// Filter words with audio based on Cyrillic letter count
	const wordsWithAudio = Object.keys(audioUrls).filter(word => {
		const hasCyrillic = /[А-Яа-яЁё]/.test(word)

		if (hasCyrillic) {
			const cyrillicLetters = (word.match(/[А-Яа-яЁё́]/g) || []).length

			if (allowSingleLetters) {
				return cyrillicLetters >= 1
			}

			// Require at least 3 Cyrillic letters
			return cyrillicLetters >= 3
		} else {
			return true
		}
	})

	if (wordsWithAudio.length === 0) {
		return <span dangerouslySetInnerHTML={{ __html: html }} />
	}

	// Parse HTML and replace words with PlayableWord components
	const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

	// Sort words by length descending to match longer words first
	const sortedWords = wordsWithAudio.sort((a, b) => b.length - a.length)

	// Process the HTML
	let processedHtml = html

	// For each word with audio, wrap it in a special marker that we'll replace later
	sortedWords.forEach((word, index) => {
		const escapedWord = escapeRegex(word)
		// Match the word not inside HTML tags
		// This regex matches the word only when it's not between < and >
		const regex = new RegExp(`(?<![\\p{L}\\p{M}<])(${escapedWord})(?![\\p{L}\\p{M}>])`, 'giu')

		// Replace with a placeholder
		processedHtml = processedHtml.replace(regex, (match) => {
			return `___AUDIO_${index}_START___${match}___AUDIO_${index}_END___`
		})
	})

	// Now parse the HTML and create React elements
	const parts = []
	let currentIndex = 0

	// Split by our audio markers
	const markerRegex = /___AUDIO_(\d+)_START___(.*?)___AUDIO_\1_END___/g
	let match

	while ((match = markerRegex.exec(processedHtml)) !== null) {
		const wordIndex = parseInt(match[1])
		const word = match[2]
		const audioWord = sortedWords[wordIndex]
		const audioUrl = audioUrls[audioWord]

		// Add text before the match
		if (match.index > currentIndex) {
			const textBefore = processedHtml.substring(currentIndex, match.index)
			if (textBefore) {
				parts.push(
					<span
						key={`text-${currentIndex}`}
						dangerouslySetInnerHTML={{ __html: textBefore }}
					/>
				)
			}
		}

		// Add the playable word
		parts.push(
			<PlayableWord
				key={`word-${match.index}`}
				word={word}
				audioUrl={audioUrl}
			/>
		)

		currentIndex = match.index + match[0].length
	}

	// Add remaining HTML
	if (currentIndex < processedHtml.length) {
		const remaining = processedHtml.substring(currentIndex)
		if (remaining) {
			parts.push(
				<span
					key={`text-${currentIndex}`}
					dangerouslySetInnerHTML={{ __html: remaining }}
				/>
			)
		}
	}

	return <span>{parts}</span>
}

export default PlayableHTML
