'use client'

import { useEffect, useState } from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

/**
 * Barre de progression de lecture qui se remplit au scroll
 */
export default function ReadingProgress() {
	const [progress, setProgress] = useState(0)
	const { isDark } = useThemeMode()

	useEffect(() => {
		const updateProgress = () => {
			const scrollTop = window.scrollY
			const docHeight = document.documentElement.scrollHeight - window.innerHeight
			const scrollPercent = (scrollTop / docHeight) * 100
			setProgress(scrollPercent)
		}

		window.addEventListener('scroll', updateProgress, { passive: true })
		updateProgress() // Initial call

		return () => window.removeEventListener('scroll', updateProgress)
	}, [])

	return (
		<div className={cn(
			'fixed top-0 left-0 right-0 h-0.5 z-50',
			isDark ? 'bg-white/5' : 'bg-black/5'
		)}>
			<div
				className={cn(
					'h-full transition-all duration-150 ease-out',
					'bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500'
				)}
				style={{ width: `${progress}%` }}
			/>
		</div>
	)
}
