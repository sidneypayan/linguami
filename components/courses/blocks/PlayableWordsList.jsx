'use client'

import PlayableWord from './PlayableWord'

/**
 * PlayableWordsList Component
 * Parses a comma-separated list of words and renders each with audio capability
 *
 * @param {string} text - Comma-separated words (e.g., "café, étudiant, école")
 * @param {Object} audioUrls - Object mapping words to audio URLs { "café": "url1", "étudiant": "url2" }
 */
const PlayableWordsList = ({ text, audioUrls = {} }) => {
	if (!text) return null

	// Split by comma and trim whitespace
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
