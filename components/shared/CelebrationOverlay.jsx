'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Box, Typography } from '@mui/material'
import { StarRounded, EmojiEventsRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

// Global state outside of React to persist across re-renders/remounts
let globalCelebrationState = {
	isShowing: false,
	isAnimating: false,
	data: { type: 'material', xpGained: 25, goldGained: 5 },
	timerId: null,
	animationTimerId: null,
}

// Global event name for triggering celebration
const CELEBRATION_EVENT = 'linguami:celebration'

/**
 * Trigger a celebration from anywhere in the app
 * @param {Object} options - { type: 'material' | 'page' | 'book', xpGained: number, goldGained: number }
 */
export const triggerCelebration = (options = {}) => {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent(CELEBRATION_EVENT, { detail: options }))
	}
}

/**
 * Celebration toast notification
 * Shows when user completes a material or book
 * Discrete design - appears at bottom of screen
 * Uses global state to persist across React re-renders
 */
const CelebrationOverlay = () => {
	const t = useTranslations('materials')
	const [mounted, setMounted] = useState(false)
	const [, forceUpdate] = useState(0)
	const containerRef = useRef(null)

	// For portal
	useEffect(() => {
		setMounted(true)
		return () => setMounted(false)
	}, [])

	// Play celebration sound - fun ascending arpeggio
	const playSound = useCallback(() => {
		try {
			const audioContext = new (window.AudioContext || window.webkitAudioContext)()
			const now = audioContext.currentTime

			// Fun ascending arpeggio - C major chord notes going up
			const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
			const delays = [0, 0.08, 0.16, 0.24]

			notes.forEach((freq, i) => {
				const osc = audioContext.createOscillator()
				const gain = audioContext.createGain()

				osc.connect(gain)
				gain.connect(audioContext.destination)

				osc.frequency.setValueAtTime(freq, now + delays[i])
				osc.type = 'sine'

				// Quick attack, medium decay
				gain.gain.setValueAtTime(0, now + delays[i])
				gain.gain.linearRampToValueAtTime(0.25, now + delays[i] + 0.02)
				gain.gain.exponentialRampToValueAtTime(0.01, now + delays[i] + 0.4)

				osc.start(now + delays[i])
				osc.stop(now + delays[i] + 0.5)
			})

			// Add a sparkle/shimmer effect at the end
			setTimeout(() => {
				try {
					const shimmerContext = new (window.AudioContext || window.webkitAudioContext)()
					const shimmerNow = shimmerContext.currentTime

					for (let i = 0; i < 3; i++) {
						const osc = shimmerContext.createOscillator()
						const gain = shimmerContext.createGain()

						osc.connect(gain)
						gain.connect(shimmerContext.destination)

						osc.frequency.setValueAtTime(2000 + i * 300, shimmerNow + i * 0.05)
						osc.type = 'sine'

						gain.gain.setValueAtTime(0.1, shimmerNow + i * 0.05)
						gain.gain.exponentialRampToValueAtTime(0.01, shimmerNow + i * 0.05 + 0.15)

						osc.start(shimmerNow + i * 0.05)
						osc.stop(shimmerNow + i * 0.05 + 0.2)
					}
				} catch (e) {
					// Ignore shimmer errors
				}
			}, 350)

		} catch (err) {
			// Silently fail if audio doesn't work
			console.log('Audio not available')
		}
	}, [])

	// Handle celebration trigger
	const handleCelebration = useCallback((event) => {
		const { type = 'material', xpGained = 25, goldGained = 5 } = event.detail || {}

		// Clear any existing timers
		if (globalCelebrationState.timerId) {
			clearTimeout(globalCelebrationState.timerId)
		}
		if (globalCelebrationState.animationTimerId) {
			clearTimeout(globalCelebrationState.animationTimerId)
		}

		// Update global state
		globalCelebrationState.data = { type, xpGained, goldGained }
		globalCelebrationState.isShowing = true
		globalCelebrationState.isAnimating = false
		forceUpdate(n => n + 1)

		// Start animation after a tiny delay
		globalCelebrationState.animationTimerId = setTimeout(() => {
			globalCelebrationState.isAnimating = true
			forceUpdate(n => n + 1)
		}, 50)

		playSound()

		// Auto-close after 8 seconds
		globalCelebrationState.timerId = setTimeout(() => {
			globalCelebrationState.isAnimating = false
			forceUpdate(n => n + 1)

			setTimeout(() => {
				globalCelebrationState.isShowing = false
				forceUpdate(n => n + 1)
			}, 400)
		}, 8000)
	}, [playSound])

	// Listen for celebration events
	useEffect(() => {
		window.addEventListener(CELEBRATION_EVENT, handleCelebration)

		// If global state says we should be showing, sync it
		if (globalCelebrationState.isShowing) {
			forceUpdate(n => n + 1)
		}

		// Poll global state to sync with React (handles remounts)
		const pollInterval = setInterval(() => {
			forceUpdate(n => n + 1)
		}, 100)

		return () => {
			window.removeEventListener(CELEBRATION_EVENT, handleCelebration)
			clearInterval(pollInterval)
		}
	}, [handleCelebration])

	// Get message based on type
	const getMessage = () => {
		switch (globalCelebrationState.data.type) {
			case 'book':
				return t('celebration_book')
			case 'page':
				return t('celebration_page')
			default:
				return t('celebration_material')
		}
	}

	const handleClose = useCallback(() => {
		if (globalCelebrationState.timerId) {
			clearTimeout(globalCelebrationState.timerId)
		}
		if (globalCelebrationState.animationTimerId) {
			clearTimeout(globalCelebrationState.animationTimerId)
		}
		globalCelebrationState.isAnimating = false
		forceUpdate(n => n + 1)

		setTimeout(() => {
			globalCelebrationState.isShowing = false
			forceUpdate(n => n + 1)
		}, 400)
	}, [])

	if (!mounted || !globalCelebrationState.isShowing) return null

	const { isAnimating } = globalCelebrationState
	const { xpGained, goldGained } = globalCelebrationState.data

	const content = (
		<Box
			ref={containerRef}
			onClick={handleClose}
			sx={{
				position: 'fixed',
				bottom: { xs: 100, sm: 40 },
				left: '50%',
				transform: isAnimating
					? 'translateX(-50%) translateY(0)'
					: 'translateX(-50%) translateY(100px)',
				opacity: isAnimating ? 1 : 0,
				transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
				zIndex: 9999,
				cursor: 'pointer',
				width: { xs: 'calc(100% - 32px)', sm: 'auto' },
				maxWidth: 420,
			}}
		>
			<Box
				sx={{
					background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
					borderRadius: 3,
					p: { xs: 2, sm: 2.5 },
					boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
					backdropFilter: 'blur(10px)',
					display: 'flex',
					alignItems: 'center',
					gap: 2,
					position: 'relative',
					overflow: 'visible',
				}}
			>
				{/* Trophy icon */}
				<Box
					sx={{
						width: 52,
						height: 52,
						borderRadius: '50%',
						background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexShrink: 0,
						boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)',
						animation: isAnimating ? 'celebrationPulse 1s ease-out' : 'none',
						'@keyframes celebrationPulse': {
							'0%': { transform: 'scale(0.8)' },
							'50%': { transform: 'scale(1.1)' },
							'100%': { transform: 'scale(1)' },
						},
					}}
				>
					<EmojiEventsRounded sx={{ fontSize: '1.8rem', color: 'white' }} />
				</Box>

				{/* Content */}
				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Typography
						sx={{
							color: 'white',
							fontWeight: 700,
							fontSize: { xs: '1rem', sm: '1.1rem' },
							lineHeight: 1.3,
							mb: 0.5,
						}}
					>
						{t('celebration_title')}
					</Typography>
					<Typography
						sx={{
							color: 'rgba(255, 255, 255, 0.85)',
							fontSize: { xs: '0.85rem', sm: '0.9rem' },
							lineHeight: 1.3,
						}}
					>
						{getMessage()}
					</Typography>
				</Box>

				{/* Rewards */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 0.5,
						flexShrink: 0,
					}}
				>
					{/* XP */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 0.5,
							background: 'rgba(255, 255, 255, 0.2)',
							borderRadius: 2,
							px: 1.5,
							py: 0.5,
						}}
					>
						<StarRounded sx={{ color: '#fbbf24', fontSize: '1.1rem' }} />
						<Typography
							sx={{
								color: 'white',
								fontWeight: 700,
								fontSize: '0.9rem',
							}}
						>
							+{xpGained} XP
						</Typography>
					</Box>

					{/* Gold */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 0.5,
							background: 'rgba(255, 255, 255, 0.2)',
							borderRadius: 2,
							px: 1.5,
							py: 0.5,
						}}
					>
						<Box sx={{ fontSize: '0.9rem' }}>🪙</Box>
						<Typography
							sx={{
								color: 'white',
								fontWeight: 700,
								fontSize: '0.9rem',
							}}
						>
							+{goldGained}
						</Typography>
					</Box>
				</Box>

				{/* Decorative stars */}
				{[...Array(3)].map((_, i) => (
					<StarRounded
						key={i}
						sx={{
							position: 'absolute',
							color: '#fbbf24',
							fontSize: '1rem',
							opacity: 0,
							animation: isAnimating ? `celebrationSparkle 0.8s ease-out ${0.2 + i * 0.15}s forwards` : 'none',
							top: i === 0 ? -8 : i === 1 ? -5 : 5,
							right: i === 0 ? 30 : i === 1 ? 60 : 45,
							'@keyframes celebrationSparkle': {
								'0%': { opacity: 0, transform: 'scale(0) rotate(0deg)' },
								'50%': { opacity: 1 },
								'100%': { opacity: 0, transform: 'scale(1.2) rotate(180deg) translateY(-15px)' },
							},
						}}
					/>
				))}
			</Box>
		</Box>
	)

	// Use portal to render outside of parent component tree
	return createPortal(content, document.body)
}

export default CelebrationOverlay
