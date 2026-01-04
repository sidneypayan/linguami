'use client'

import PlayableWord from './PlayableWord'

/**
 * PlayableText Component
 * Parses text and makes French words (with accents or specified words) playable
 *
 * @param {string} text - Text containing French words
 * @param {Object} audioUrls - Object mapping words to audio URLs
 * @param {Array} targetWords - Optional array of specific words to make playable
 * @param {boolean} allowSingleLetters - Allow audio on single Cyrillic letters (default: false)
 */
const PlayableText = ({ text, audioUrls = {}, targetWords = [], allowSingleLetters = false }) => {
	if (!text) return null

	// If no audio URLs provided, just return plain text
	if (Object.keys(audioUrls).length === 0) {
		return <span>{text}</span>
	}

	// Check if text contains " = " pattern (cyrillic_word = transliteration)
	// Only handle simple cases with a single " = " (not multiple)
	const equalsCount = (text.match(/ = /g) || []).length
	if (equalsCount === 1 && text.includes(' = ')) {
		const parts = text.split(' = ')
		const cyrillicWord = parts[0].trim()
		const transliteration = parts[1]?.trim()

		// Check if the first part contains Cyrillic characters
		if (/[А-Яа-яЁё]/.test(cyrillicWord)) {
			// Try to find audio for the Cyrillic word
			const audioUrl = audioUrls[cyrillicWord]
				|| audioUrls[cyrillicWord.toLowerCase()]
				|| audioUrls[text]  // Try full text as fallback

			return (
				<span>
					<PlayableWord
						word={cyrillicWord}
						audioUrl={audioUrl}
					/>
					{transliteration && <span> = {transliteration}</span>}
				</span>
			)
		}
	}

	// Create a regex pattern for target words (escape special regex characters)
	const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

	// Get all words that have audio URLs (case insensitive)
	// Filter based on content type (Cyrillic for Russian, any for French/other languages)
	const wordsWithAudio = Object.keys(audioUrls).filter(word => {
		// Check if word contains Cyrillic characters (Russian lesson)
		const hasCyrillic = /[А-Яа-яЁё]/.test(word)

		if (hasCyrillic) {
			// For Russian words, apply Cyrillic letter count filter
			const cyrillicLetters = (word.match(/[А-Яа-яЁё]/g) || []).length

			// If allowSingleLetters is true, accept any word with Cyrillic characters
			if (allowSingleLetters) {
				return cyrillicLetters >= 1
			}

			// Otherwise, require at least 3 Cyrillic letters (exclude single letters like "В", "Р", "Н")
			return cyrillicLetters >= 3
		} else {
			// For non-Cyrillic words (French, etc.), accept all words
			// This allows French words like "café", "ça", "garçon" to have audio
			return true
		}
	})

	if (wordsWithAudio.length === 0) {
		return <span>{text}</span>
	}

	// Create regex pattern to match any of the words with audio
	const pattern = wordsWithAudio
		.sort((a, b) => b.length - a.length) // Sort by length descending to match longer words first
		.map(escapeRegex)
		.join('|')

	// Match words not preceded or followed by letters (Unicode-aware)
	// This works better than \b for accented characters
	const regex = new RegExp(`(?<![\\p{L}\\p{M}])(${pattern})(?![\\p{L}\\p{M}])`, 'giu')

	// Split text by matches and create components
	const parts = []
	let lastIndex = 0
	let match

	while ((match = regex.exec(text)) !== null) {
		// Add text before match
		if (match.index > lastIndex) {
			parts.push(
				<span key={`text-${lastIndex}`}>
					{text.substring(lastIndex, match.index)}
				</span>
			)
		}

		// Add playable word
		const word = match[0]
		const audioUrl = audioUrls[word] || audioUrls[word.toLowerCase()] || audioUrls[word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()]

		parts.push(
			<PlayableWord
				key={`word-${match.index}`}
				word={word}
				audioUrl={audioUrl}
			/>
		)

		lastIndex = match.index + word.length
	}

	// Add remaining text
	if (lastIndex < text.length) {
		parts.push(
			<span key={`text-${lastIndex}`}>
				{text.substring(lastIndex)}
			</span>
		)
	}

	return <span>{parts}</span>
}

export default PlayableText
