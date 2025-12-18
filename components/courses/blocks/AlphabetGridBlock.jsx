'use client'

import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Volume2 } from 'lucide-react'
import { useState } from 'react'

/**
 * AlphabetGridBlock Component
 * Displays the French alphabet in a grid with illustrations and pronunciations
 *
 * @param {Object} block - Block data containing title and letters array
 */
const AlphabetGridBlock = ({ block }) => {
	const { isDark } = useThemeMode()
	const [playingLetter, setPlayingLetter] = useState(null)

	// Play pronunciation sound
	const playPronunciation = (letter, pronunciation) => {
		setPlayingLetter(letter)

		try {
			// Create simple pronunciation feedback
			const utterance = new SpeechSynthesisUtterance(letter)
			utterance.lang = 'fr-FR'
			utterance.rate = 0.7
			utterance.onend = () => setPlayingLetter(null)
			window.speechSynthesis.speak(utterance)
		} catch (error) {
			console.error('Speech synthesis error:', error)
			setPlayingLetter(null)
		}
	}

	if (!block.letters || block.letters.length === 0) {
		return null
	}

	return (
		<div className="my-8">
			{/* Title */}
			{block.title && (
				<h3 className={cn(
					'text-2xl font-bold mb-6 text-center',
					isDark ? 'text-white' : 'text-slate-900'
				)}>
					{block.title}
				</h3>
			)}

			{/* Alphabet Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
				{block.letters.map((item) => (
					<Card
						key={item.letter}
						className={cn(
							'p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer group',
							'hover:shadow-lg hover:-translate-y-1',
							isDark
								? 'bg-slate-800 border-slate-700 hover:bg-slate-750 hover:border-violet-500/50'
								: 'bg-white border-slate-200 hover:bg-violet-50 hover:border-violet-300',
							playingLetter === item.letter && 'ring-2 ring-violet-500'
						)}
						onClick={() => playPronunciation(item.letter, item.pronunciation)}
					>
						{/* Letter */}
						<div className={cn(
							'text-4xl font-extrabold mb-1',
							'bg-gradient-to-br from-violet-500 to-purple-600 bg-clip-text text-transparent'
						)}>
							{item.letter}
						</div>

						{/* Emoji */}
						<div className="text-4xl mb-1 group-hover:scale-110 transition-transform">
							{item.emoji}
						</div>

						{/* Word */}
						<div className={cn(
							'text-sm font-semibold text-center',
							isDark ? 'text-slate-300' : 'text-slate-700'
						)}>
							{item.word}
						</div>

						{/* Pronunciation */}
						<div className={cn(
							'text-xs font-mono flex items-center gap-1',
							isDark ? 'text-slate-500' : 'text-slate-400'
						)}>
							<Volume2 className={cn(
								'w-3 h-3',
								playingLetter === item.letter && 'text-violet-500 animate-pulse'
							)} />
							{item.pronunciation}
						</div>
					</Card>
				))}
			</div>

			{/* Legend */}
			<div className={cn(
				'mt-4 text-center text-sm',
				isDark ? 'text-slate-400' : 'text-slate-500'
			)}>
				💡 Cliquez sur une lettre pour entendre sa prononciation
			</div>
		</div>
	)
}

export default AlphabetGridBlock
