'use client'

import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Volume2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'

/**
 * AlphabetGridBlock Component
 * Displays the French alphabet in a grid with illustrations
 *
 * @param {Object} block - Block data containing title and letters array
 */
const AlphabetGridBlock = ({ block }) => {
	const { isDark } = useThemeMode()
	const t = useTranslations('lessons')
	const [playingLetter, setPlayingLetter] = useState(null)
	const audioRef = useRef(null)

	// Play pronunciation sound from ElevenLabs audio
	const playPronunciation = (letter, audioUrl) => {
		if (!audioUrl) {
			console.warn(`No audio URL for letter ${letter}`)
			return
		}

		setPlayingLetter(letter)

		try {
			// Stop any currently playing audio
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current.currentTime = 0
			}

			// Create new audio element
			const audio = new Audio(audioUrl)
			audioRef.current = audio

			audio.onended = () => {
				setPlayingLetter(null)
			}

			audio.onerror = (error) => {
				console.error('Audio playback error:', error)
				setPlayingLetter(null)
			}

			audio.play().catch(error => {
				console.error('Failed to play audio:', error)
				setPlayingLetter(null)
			})
		} catch (error) {
			console.error('Audio error:', error)
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
							'p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer group relative',
							'hover:shadow-lg hover:-translate-y-1',
							isDark
								? 'bg-slate-800 border-slate-700 hover:bg-slate-750 hover:border-violet-500/50'
								: 'bg-white border-slate-200 hover:bg-violet-50 hover:border-violet-300',
							playingLetter === item.letter && 'ring-2 ring-violet-500'
						)}
						onClick={() => playPronunciation(item.letter, item.audioUrl)}
					>
						{/* Volume icon in top right corner */}
						<Volume2 className={cn(
							'absolute top-2 right-2 w-4 h-4 transition-opacity',
							isDark ? 'text-slate-400' : 'text-slate-500',
							playingLetter === item.letter
								? 'opacity-100 text-violet-500 animate-pulse'
								: 'opacity-40 group-hover:opacity-100'
						)} />

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
					</Card>
				))}
			</div>

			{/* Localized Legend */}
			<div className={cn(
				'mt-4 text-center text-sm flex items-center justify-center gap-2',
				isDark ? 'text-slate-400' : 'text-slate-500'
			)}>
				<Volume2 className="w-4 h-4" />
				{t('alphabet_click_to_hear')}
			</div>
		</div>
	)
}

export default AlphabetGridBlock
