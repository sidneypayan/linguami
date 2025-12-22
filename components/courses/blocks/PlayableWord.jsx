'use client'

import { useState, useRef } from 'react'
import { Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeMode } from '@/context/ThemeContext'

/**
 * PlayableWord Component
 * Renders a word with an audio icon that can be clicked to play pronunciation
 *
 * @param {string} word - The word to display
 * @param {string} audioUrl - URL of the audio file
 */
const PlayableWord = ({ word, audioUrl }) => {
	const { isDark } = useThemeMode()
	const [isPlaying, setIsPlaying] = useState(false)
	const audioRef = useRef(null)

	const playAudio = (e) => {
		e.stopPropagation()

		if (!audioUrl) {
			console.warn(`No audio URL for word: ${word}`)
			return
		}

		setIsPlaying(true)

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
				setIsPlaying(false)
			}

			audio.onerror = (error) => {
				console.error('Audio playback error:', error)
				setIsPlaying(false)
			}

			audio.play().catch(error => {
				console.error('Failed to play audio:', error)
				setIsPlaying(false)
			})
		} catch (error) {
			console.error('Audio error:', error)
			setIsPlaying(false)
		}
	}

	// If no audio URL, just render the word without icon
	if (!audioUrl) {
		return <span>{word}</span>
	}

	return (
		<span className="inline-flex items-center gap-1 group">
			<span className={cn(
				"transition-colors",
				isDark ? "text-slate-300" : "text-slate-700"
			)}>
				{word}
			</span>
			<button
				onClick={playAudio}
				className={cn(
					"inline-flex items-center justify-center w-4 h-4 rounded transition-all",
					"hover:bg-slate-100 dark:hover:bg-slate-700",
					isPlaying && "animate-pulse"
				)}
				title={`Play pronunciation of "${word}"`}
			>
				<Volume2 className={cn(
					"w-3 h-3 transition-colors",
					isPlaying
						? "text-violet-500"
						: isDark
							? "text-slate-500 group-hover:text-violet-400"
							: "text-slate-400 group-hover:text-violet-500"
				)} />
			</button>
		</span>
	)
}

export default PlayableWord
