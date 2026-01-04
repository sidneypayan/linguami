'use client'

import PlayableWord from './PlayableWord'

/**
 * PlayableWordsList Component
 * Parses a comma-separated list of words and renders each with audio capability
 *
 * @param {string} text - Comma-separated words (e.g., "café, étudiant, école") or "word - translation"
 * @param {Object} audioUrls - Object mapping words to audio URLs { "café": "url1", "étudiant": "url2" }
 */
const PlayableWordsList = ({ text, audioUrls = {} }) => {
	if (!text) return null

	// Check if text contains " - " pattern (word - translation)
	// If so, extract the foreign word and translation separately
	if (text.includes(' - ')) {
		const parts = text.split(' - ')
		const foreignWord = parts[0].trim()
		const translation = parts[1]?.trim()

		// Try to find audio for the foreign word in various formats
		const audioUrl = audioUrls[foreignWord]
			|| audioUrls[foreignWord.toLowerCase()]
			|| audioUrls[text]  // Try full text as fallback
			|| audioUrls[text.replace(' - ', '  - ')]  // Try with double space

		return (
			<span>
				<PlayableWord
					word={foreignWord}
					audioUrl={audioUrl}
				/>
				{translation && <span> - {translation}</span>}
			</span>
		)
	}

	// Split by comma and trim whitespace (original behavior)
	const words = text.split(',').map(w => w.trim()).filter(w => w)

	return (
		<span>
			{words.map((word, index) => (
				<span key={index}>
					<PlayableWord
						word={word}
						audioUrl={audioUrls[word] || audioUrls[word.toLowerCase()]}
					/>
					{index < words.length - 1 && ', '}
				</span>
			))}
		</span>
	)
}

export default PlayableWordsList
