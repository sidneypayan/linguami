'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { Link } from '@/i18n/navigation'
import { CheckCircle2, Crown, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'

export default function PremiumSuccessClient({ sessionId }) {
	const t = useTranslations('premium')
	const { isDark } = useThemeMode()
	const [showContent, setShowContent] = useState(false)

	useEffect(() => {
		// Trigger confetti animation
		const duration = 3000
		const end = Date.now() + duration

		const colors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981']

		const frame = () => {
			confetti({
				particleCount: 3,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
				colors: colors,
			})
			confetti({
				particleCount: 3,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
				colors: colors,
			})

			if (Date.now() < end) {
				requestAnimationFrame(frame)
			}
		}

		frame()

		// Show content with delay for animation
		setTimeout(() => setShowContent(true), 300)
	}, [])

	return (
		<div
			className={cn(
				'min-h-screen flex items-center justify-center px-5 py-20',
				'bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900'
			)}>
			{/* Background effects */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div
					className="absolute top-[30%] left-[20%] w-[400px] h-[400px] rounded-full opacity-30 blur-[80px] animate-pulse-slow"
					style={{
						background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
					}}
				/>
				<div
					className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full opacity-30 blur-[60px] animate-pulse-slow"
					style={{
						background: 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, transparent 70%)',
						animationDelay: '1s',
					}}
				/>
			</div>

			<div
				className={cn(
					'relative z-10 max-w-lg w-full text-center',
					'transform transition-all duration-700',
					showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
				)}>
				{/* Success icon */}
				<div className="relative mx-auto w-24 h-24 mb-8">
					<div
						className={cn(
							'absolute inset-0 rounded-full',
							'bg-gradient-to-br from-emerald-500 to-cyan-500',
							'animate-ping opacity-20'
						)}
					/>
					<div
						className={cn(
							'relative w-full h-full rounded-full flex items-center justify-center',
							'bg-gradient-to-br from-emerald-500 to-cyan-500',
							'shadow-[0_0_40px_rgba(16,185,129,0.5)]'
						)}>
						<CheckCircle2 className="w-12 h-12 text-white" />
					</div>
				</div>

				{/* Title */}
				<h1 className="text-3xl md:text-4xl font-extrabold mb-4">
					<span className="bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
						{t('success_title')}
					</span>
				</h1>

				{/* Subtitle */}
				<p className="text-white/70 text-lg mb-8">{t('success_subtitle')}</p>

				{/* Premium badge */}
				<div
					className={cn(
						'inline-flex items-center gap-2 px-6 py-3 rounded-full mb-10',
						'bg-gradient-to-r from-amber-500/20 to-orange-500/20',
						'border border-amber-500/30'
					)}>
					<Crown className="w-5 h-5 text-amber-400" />
					<span className="text-amber-200 font-semibold">{t('success_now_premium')}</span>
					<Sparkles className="w-5 h-5 text-amber-400" />
				</div>

				{/* Features unlocked */}
				<div
					className={cn(
						'p-6 rounded-2xl mb-8',
						'bg-white/5 backdrop-blur-sm border border-white/10'
					)}>
					<p className="text-white/80 text-sm mb-4">{t('success_features_unlocked')}</p>
					<ul className="space-y-3 text-left">
						{[
							t('feature_unlimited_translations'),
							t('feature_unlimited_dictionary'),
							t('feature_exclusive_training'),
						].map((feature, index) => (
							<li key={index} className="flex items-center gap-3 text-white/90">
								<CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
								<span className="text-sm">{feature}</span>
							</li>
						))}
					</ul>
				</div>

				{/* CTA Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						asChild
						size="lg"
						className={cn(
							'bg-gradient-to-r from-violet-500 to-indigo-600',
							'hover:from-violet-600 hover:to-indigo-700',
							'shadow-[0_8px_24px_rgba(139,92,246,0.4)]',
							'text-white font-bold'
						)}>
						<Link href="/method">
							{t('success_cta_method')}
							<ArrowRight className="w-5 h-5 ml-2" />
						</Link>
					</Button>
					<Button
						asChild
						variant="outline"
						size="lg"
						className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
						<Link href="/materials">{t('success_cta_materials')}</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
