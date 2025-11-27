'use client'

import { useState, useEffect, useRef } from 'react'
import { logger } from '@/utils/logger'
import { Minimize2, Maximize2, Monitor, Square } from 'lucide-react'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const VideoPlayer = ({ videoUrl }) => {
	const { isDark } = useThemeMode()
	const [viewMode, setViewMode] = useState('normal') // 'minimized', 'normal', 'theater'
	const [userSelectedMode, setUserSelectedMode] = useState(null) // Track if user manually selected a mode
	const [lastScrollY, setLastScrollY] = useState(0)
	const iframeRef = useRef(null)
	const playerRef = useRef(null)

	const handleViewModeChange = (newMode) => {
		if (newMode !== null) {
			setViewMode(newMode)
			setUserSelectedMode(newMode) // User made a manual selection
		}
	}

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY

			// Only auto-minimize if user hasn't manually selected a mode
			if (userSelectedMode === null) {
				// If scrolling down past 200px, minimize the video
				if (currentScrollY > 200 && viewMode === 'normal') {
					setViewMode('minimized')
				}
				// If scrolling back to top (less than 100px), return to normal
				else if (currentScrollY < 100 && viewMode === 'minimized') {
					setViewMode('normal')
				}
			}

			setLastScrollY(currentScrollY)
		}

		window.addEventListener('scroll', handleScroll, { passive: true })

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [viewMode, userSelectedMode])

	// Reset user selection when they choose normal mode while at top
	useEffect(() => {
		if (userSelectedMode === 'normal' && window.scrollY < 100) {
			setUserSelectedMode(null) // Allow auto-minimize again
		}
	}, [userSelectedMode, viewMode])

	// Load YouTube IFrame API and listen for word clicks to pause video
	useEffect(() => {
		// Load YouTube IFrame API
		if (!window.YT) {
			const tag = document.createElement('script')
			tag.src = 'https://www.youtube.com/iframe_api'
			const firstScriptTag = document.getElementsByTagName('script')[0]
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
		}

		// Initialize player when API is ready
		const initPlayer = () => {
			if (window.YT && window.YT.Player && iframeRef.current) {
				playerRef.current = new window.YT.Player(iframeRef.current, {
					events: {
						onReady: () => {
							// Player is ready
						}
					}
				})
			}
		}

		if (window.YT && window.YT.Player) {
			initPlayer()
		} else {
			window.onYouTubeIframeAPIReady = initPlayer
		}

		// Listen for word click events
		const handleWordClick = () => {
			if (playerRef.current && playerRef.current.pauseVideo) {
				try {
					playerRef.current.pauseVideo()
				} catch (error) {
					logger.error('Error pausing video:', error)
				}
			}
		}

		// Listen for translation closed events to resume video
		const handleTranslationClosed = () => {
			if (playerRef.current && playerRef.current.playVideo) {
				try {
					playerRef.current.playVideo()
				} catch (error) {
					logger.error('Error resuming video:', error)
				}
			}
		}

		window.addEventListener('word-clicked', handleWordClick)
		window.addEventListener('translation-closed', handleTranslationClosed)

		return () => {
			window.removeEventListener('word-clicked', handleWordClick)
			window.removeEventListener('translation-closed', handleTranslationClosed)
		}
	}, [videoUrl])

	const getVideoContainerClasses = () => {
		const base = 'transition-all duration-400 ease-out relative overflow-hidden'

		switch (viewMode) {
			case 'minimized':
				return cn(
					base,
					'z-[1000] sticky top-20 md:top-[5.5rem]',
					'w-[200px] sm:w-[280px] h-[112px] sm:h-[157px]',
					'rounded-xl ml-auto mr-4 sm:mr-8',
					'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
					'border-2 border-violet-500/30'
				)
			case 'theater':
				return cn(
					base,
					'z-100 relative',
					'w-full max-w-full sm:max-w-[90%] md:max-w-[1400px]',
					'h-[250px] sm:h-[400px] md:h-[600px]',
					'rounded-2xl mx-auto',
					'shadow-[0_12px_48px_rgba(139,92,246,0.2)]',
					'border-[3px] border-violet-500/20'
				)
			default: // normal
				return cn(
					base,
					'z-100 relative',
					'w-full sm:w-[500px] max-w-full sm:max-w-[500px]',
					'h-[220px] sm:h-[280px]',
					'rounded-xl mx-auto',
					'shadow-[0_8px_32px_rgba(139,92,246,0.15)]',
					'border-2 border-violet-500/20'
				)
		}
	}

	const modes = [
		{ value: 'minimized', icon: Minimize2, label: 'Minimiser' },
		{ value: 'normal', icon: Square, label: 'Normal' },
		{ value: 'theater', icon: Monitor, label: 'Mode theatre' },
	]

	return (
		<div
			className={cn(
				getVideoContainerClasses(),
				'group',
				isDark ? 'bg-slate-900' : 'bg-white'
			)}
		>
			{/* Gradient overlay for better contrast */}
			<div
				className={cn(
					'absolute top-0 left-0 right-0 h-20 z-[101] pointer-events-none',
					'bg-gradient-to-b from-black/40 to-transparent',
					'transition-opacity duration-300',
					viewMode === 'minimized' ? 'opacity-0' : 'opacity-100'
				)}
			/>

			{/* Video iframe */}
			<iframe
				ref={iframeRef}
				id="youtube-player"
				className="w-full h-full border-none block rounded-[inherit]"
				src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}enablejsapi=1`}
				allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen'
				allowFullScreen
			/>

			{/* Controls */}
			<div
				className={cn(
					'video-controls absolute z-[102]',
					'transition-opacity duration-300',
					viewMode === 'minimized'
						? 'bottom-1 right-1 opacity-100'
						: 'top-2 sm:top-3 right-2 sm:right-3 opacity-70 group-hover:opacity-100'
				)}
			>
				<div
					className={cn(
						'flex rounded-lg overflow-hidden',
						'bg-black/70 backdrop-blur-sm',
						'border border-white/10'
					)}
				>
					{modes.map((mode) => {
						const Icon = mode.icon
						const isActive = viewMode === mode.value
						return (
							<button
								key={mode.value}
								onClick={() => handleViewModeChange(mode.value)}
								title={mode.label}
								className={cn(
									'p-1.5 sm:px-2 sm:py-1.5',
									'text-white transition-all duration-200',
									isActive
										? 'bg-gradient-to-br from-violet-500 to-purple-600'
										: 'hover:bg-violet-500/30'
								)}
							>
								<Icon className="w-4 h-4 sm:w-5 sm:h-5" />
							</button>
						)
					})}
				</div>
			</div>

			{/* Badge indicator */}
			{viewMode !== 'minimized' && (
				<div
					className={cn(
						'absolute top-2 sm:top-3 left-2 sm:left-3 z-[102]',
						'bg-gradient-to-br from-violet-500 to-purple-600',
						'text-white px-3 py-1 rounded-lg',
						'text-[0.7rem] sm:text-[0.8rem] font-semibold',
						'shadow-[0_2px_8px_rgba(0,0,0,0.3)]',
						'uppercase tracking-wide opacity-90'
					)}
				>
					{viewMode === 'theater' ? 'Theatre' : 'Video'}
				</div>
			)}
		</div>
	)
}

export default VideoPlayer
