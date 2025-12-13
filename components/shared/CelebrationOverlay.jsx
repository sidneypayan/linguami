'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Trophy, Star, Share2, Facebook, Twitter, Send, MessageCircle, Link2, Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import toast from '@/utils/toast'

// Global state outside of React to persist across re-renders/remounts
let globalCelebrationState = {
	isShowing: false,
	isAnimating: false,
	data: { type: 'material', xpGained: 25, goldGained: 5, materialTitle: '', materialUrl: '' },
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
		const { type = 'material', xpGained = 25, goldGained = 5, materialTitle = '', materialUrl = '' } = event.detail || {}
		if (globalCelebrationState.timerId) clearTimeout(globalCelebrationState.timerId)
		if (globalCelebrationState.animationTimerId) clearTimeout(globalCelebrationState.animationTimerId)

		globalCelebrationState.data = { type, xpGained, goldGained, materialTitle, materialUrl }
		globalCelebrationState.isShowing = true
		globalCelebrationState.isAnimating = false
		forceUpdate(n => n + 1)

		globalCelebrationState.animationTimerId = setTimeout(() => {
			globalCelebrationState.isAnimating = true
			forceUpdate(n => n + 1)
		}, 50)

		playSound()

		// Duration: 12s if share is available, 8s otherwise
		const duration = materialUrl ? 12000 : 8000

		globalCelebrationState.timerId = setTimeout(() => {
			globalCelebrationState.isAnimating = false
			forceUpdate(n => n + 1)
			setTimeout(() => {
				globalCelebrationState.isShowing = false
				forceUpdate(n => n + 1)
			}, 400)
		}, duration)
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
			case 'lesson': return t('celebration_lesson')
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

	const handleShare = useCallback(async (e) => {
		e.stopPropagation() // Prevent closing the celebration
		const { materialTitle, materialUrl } = globalCelebrationState.data

		if (!materialUrl) return

		const shareData = {
			title: `${materialTitle} - Linguami`,
			text: t('share_achievement_text'),
			url: materialUrl
		}

		// Try Web Share API (native mobile sharing)
		if (navigator.share) {
			try {
				await navigator.share(shareData)
			} catch (err) {
				// User cancelled, do nothing
			}
		} else {
			// Fallback: copy link to clipboard
			try {
				await navigator.clipboard.writeText(materialUrl)
				toast.success(t('share_link_copied'))
			} catch (err) {
				toast.error(t('share_error'))
			}
		}
	}, [t])

	if (!mounted || !globalCelebrationState.isShowing) return null

	const { isAnimating } = globalCelebrationState
	const { xpGained, goldGained } = globalCelebrationState.data

	const content = (
		<>
			<style dangerouslySetInnerHTML={{ __html: `
				@keyframes celebrationPulse { 0% { transform: scale(0.8); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
				@keyframes celebrationSparkle { 0% { opacity: 0; transform: scale(0) rotate(0deg); } 50% { opacity: 1; } 100% { opacity: 0; transform: scale(1.2) rotate(180deg) translateY(-15px); } }
				@keyframes shareButtonSlideIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
				@keyframes socialButtonsPop { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
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

				{/* Share section - only show if materialUrl is provided */}
				{globalCelebrationState.data.materialUrl && (
					<div
						className={cn(
							'mt-3 w-full',
							'bg-white/95 backdrop-blur-md',
							'rounded-xl p-3',
							'shadow-[0_8px_24px_rgba(0,0,0,0.15)]'
						)}
						style={{
							animation: isAnimating ? 'shareButtonSlideIn 0.5s ease-out 0.8s both' : 'none'
						}}
					>
						{/* Share title */}
						<div className="text-center mb-3">
							<span className="text-emerald-700 text-sm font-bold flex items-center justify-center gap-1.5">
								<Share2 className="w-4 h-4" />
								{t('share_achievement')}
							</span>
						</div>

						{/* Social network buttons */}
						<div
							className="flex items-center justify-center gap-2.5"
							style={{
								animation: isAnimating ? 'socialButtonsPop 0.4s ease-out 1.1s both' : 'none'
							}}
						>
							{/* WhatsApp */}
							<a
								href={`https://wa.me/?text=${encodeURIComponent(t('share_achievement_text') + ' ' + globalCelebrationState.data.materialUrl)}`}
								target="_blank"
								rel="noopener noreferrer"
								onClick={(e) => e.stopPropagation()}
								className={cn(
									'w-11 h-11 rounded-full',
									'flex items-center justify-center',
									'bg-[#25D366] hover:bg-[#20BD5A]',
									'text-white',
									'transition-all duration-200',
									'hover:scale-110',
									'active:scale-95',
									'shadow-[0_4px_12px_rgba(37,211,102,0.4)]'
								)}
								title="WhatsApp"
							>
								<MessageCircle className="w-5 h-5" />
							</a>

							{/* Facebook */}
							<a
								href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(globalCelebrationState.data.materialUrl)}`}
								target="_blank"
								rel="noopener noreferrer"
								onClick={(e) => e.stopPropagation()}
								className={cn(
									'w-11 h-11 rounded-full',
									'flex items-center justify-center',
									'bg-[#1877F2] hover:bg-[#166FE5]',
									'text-white',
									'transition-all duration-200',
									'hover:scale-110',
									'active:scale-95',
									'shadow-[0_4px_12px_rgba(24,119,242,0.4)]'
								)}
								title="Facebook"
							>
								<Facebook className="w-5 h-5" />
							</a>

							{/* Twitter/X */}
							<a
								href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(t('share_achievement_text'))}&url=${encodeURIComponent(globalCelebrationState.data.materialUrl)}`}
								target="_blank"
								rel="noopener noreferrer"
								onClick={(e) => e.stopPropagation()}
								className={cn(
									'w-11 h-11 rounded-full',
									'flex items-center justify-center',
									'bg-black hover:bg-gray-800',
									'text-white',
									'transition-all duration-200',
									'hover:scale-110',
									'active:scale-95',
									'shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
								)}
								title="X (Twitter)"
							>
								<Twitter className="w-5 h-5" />
							</a>

							{/* Telegram */}
							<a
								href={`https://t.me/share/url?url=${encodeURIComponent(globalCelebrationState.data.materialUrl)}&text=${encodeURIComponent(t('share_achievement_text'))}`}
								target="_blank"
								rel="noopener noreferrer"
								onClick={(e) => e.stopPropagation()}
								className={cn(
									'w-11 h-11 rounded-full',
									'flex items-center justify-center',
									'bg-[#0088cc] hover:bg-[#0077b5]',
									'text-white',
									'transition-all duration-200',
									'hover:scale-110',
									'active:scale-95',
									'shadow-[0_4px_12px_rgba(0,136,204,0.4)]'
								)}
								title="Telegram"
							>
								<Send className="w-5 h-5" />
							</a>

							{/* Copy Link */}
							<button
								onClick={handleShare}
								className={cn(
									'w-11 h-11 rounded-full',
									'flex items-center justify-center',
									'bg-gray-100 hover:bg-gray-200',
									'text-gray-700',
									'transition-all duration-200',
									'hover:scale-110',
									'active:scale-95',
									'shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
								)}
								title={t('share_link_copied')}
							>
								<Copy className="w-5 h-5" />
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	)

	return createPortal(content, document.body)
}

export default CelebrationOverlay
