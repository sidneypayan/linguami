'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Trophy, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

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

export const triggerCelebration = (options = {}) => {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent(CELEBRATION_EVENT, { detail: options }))
	}
}

const CelebrationOverlay = () => {
	const t = useTranslations('materials')
	const [mounted, setMounted] = useState(false)
	const [, forceUpdate] = useState(0)
	const containerRef = useRef(null)

	useEffect(() => {
		setMounted(true)
		return () => setMounted(false)
	}, [])

	const playSound = useCallback(() => {
		try {
			const audioContext = new (window.AudioContext || window.webkitAudioContext)()
			const now = audioContext.currentTime
			const notes = [523.25, 659.25, 783.99, 1046.50]
			const delays = [0, 0.08, 0.16, 0.24]

			notes.forEach((freq, i) => {
				const osc = audioContext.createOscillator()
				const gain = audioContext.createGain()
				osc.connect(gain)
				gain.connect(audioContext.destination)
				osc.frequency.setValueAtTime(freq, now + delays[i])
				osc.type = 'sine'
				gain.gain.setValueAtTime(0, now + delays[i])
				gain.gain.linearRampToValueAtTime(0.25, now + delays[i] + 0.02)
				gain.gain.exponentialRampToValueAtTime(0.01, now + delays[i] + 0.4)
				osc.start(now + delays[i])
				osc.stop(now + delays[i] + 0.5)
			})
		} catch (err) {}
	}, [])

	const handleCelebration = useCallback((event) => {
		const { type = 'material', xpGained = 25, goldGained = 5 } = event.detail || {}
		if (globalCelebrationState.timerId) clearTimeout(globalCelebrationState.timerId)
		if (globalCelebrationState.animationTimerId) clearTimeout(globalCelebrationState.animationTimerId)

		globalCelebrationState.data = { type, xpGained, goldGained }
		globalCelebrationState.isShowing = true
		globalCelebrationState.isAnimating = false
		forceUpdate(n => n + 1)

		globalCelebrationState.animationTimerId = setTimeout(() => {
			globalCelebrationState.isAnimating = true
			forceUpdate(n => n + 1)
		}, 50)

		playSound()

		globalCelebrationState.timerId = setTimeout(() => {
			globalCelebrationState.isAnimating = false
			forceUpdate(n => n + 1)
			setTimeout(() => {
				globalCelebrationState.isShowing = false
				forceUpdate(n => n + 1)
			}, 400)
		}, 8000)
	}, [playSound])

	useEffect(() => {
		window.addEventListener(CELEBRATION_EVENT, handleCelebration)
		if (globalCelebrationState.isShowing) forceUpdate(n => n + 1)
		const pollInterval = setInterval(() => forceUpdate(n => n + 1), 100)
		return () => {
			window.removeEventListener(CELEBRATION_EVENT, handleCelebration)
			clearInterval(pollInterval)
		}
	}, [handleCelebration])

	const getMessage = () => {
		switch (globalCelebrationState.data.type) {
			case 'book': return t('celebration_book')
			case 'page': return t('celebration_page')
			default: return t('celebration_material')
		}
	}

	const handleClose = useCallback(() => {
		if (globalCelebrationState.timerId) clearTimeout(globalCelebrationState.timerId)
		if (globalCelebrationState.animationTimerId) clearTimeout(globalCelebrationState.animationTimerId)
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
		<>
			<style dangerouslySetInnerHTML={{ __html: `
				@keyframes celebrationPulse { 0% { transform: scale(0.8); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
				@keyframes celebrationSparkle { 0% { opacity: 0; transform: scale(0) rotate(0deg); } 50% { opacity: 1; } 100% { opacity: 0; transform: scale(1.2) rotate(180deg) translateY(-15px); } }
			` }} />
			<div
				ref={containerRef}
				onClick={handleClose}
				className={cn(
					'fixed bottom-24 sm:bottom-10 left-1/2 z-[9999] cursor-pointer',
					'w-[calc(100%-32px)] sm:w-auto max-w-[420px]',
					'transition-all duration-400',
					isAnimating ? 'opacity-100 -translate-x-1/2 translate-y-0' : 'opacity-0 -translate-x-1/2 translate-y-[100px]'
				)}
				style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
			>
				<div className={cn(
					'bg-gradient-to-br from-emerald-500/95 to-emerald-600/95',
					'rounded-xl p-4 sm:p-5',
					'shadow-[0_10px_40px_rgba(16,185,129,0.4),0_0_0_1px_rgba(255,255,255,0.1)]',
					'backdrop-blur-sm flex items-center gap-4 relative overflow-visible'
				)}>
					<div
						className={cn('w-13 h-13 rounded-full flex-shrink-0', 'bg-gradient-to-br from-amber-400 to-amber-500', 'flex items-center justify-center', 'shadow-[0_4px_12px_rgba(251,191,36,0.4)]')}
						style={{ animation: isAnimating ? 'celebrationPulse 1s ease-out' : 'none' }}
					>
						<Trophy className="w-7 h-7 text-white" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-white font-bold text-base sm:text-lg leading-tight mb-1">{t('celebration_title')}</p>
						<p className="text-white/85 text-sm sm:text-base leading-tight">{getMessage()}</p>
					</div>
					<div className="flex flex-col gap-1.5 flex-shrink-0">
						<div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1">
							<Star className="w-4 h-4 text-amber-400 fill-amber-400" />
							<span className="text-white font-bold text-sm">+{xpGained} XP</span>
						</div>
						<div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1">
							<span className="text-sm">🪙</span>
							<span className="text-white font-bold text-sm">+{goldGained}</span>
						</div>
					</div>
					{[0, 1, 2].map((i) => (
						<Star
							key={i}
							className="absolute w-4 h-4 text-amber-400 fill-amber-400 opacity-0"
							style={{
								top: i === 0 ? -8 : i === 1 ? -5 : 5,
								right: i === 0 ? 30 : i === 1 ? 60 : 45,
								animationName: isAnimating ? 'celebrationSparkle' : 'none',
								animationDuration: '0.8s',
								animationTimingFunction: 'ease-out',
								animationFillMode: 'forwards',
								animationDelay: (0.2 + i * 0.15) + 's',
							}}
						/>
					))}
				</div>
			</div>
		</>
	)

	return createPortal(content, document.body)
}

export default CelebrationOverlay
