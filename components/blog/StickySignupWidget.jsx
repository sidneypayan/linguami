'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import * as gtm from '@/lib/gtm'
import { cn } from '@/lib/utils'
import { X, Rocket, Sparkles } from 'lucide-react'

/**
 * Widget sticky qui apparait apres un certain scroll
 * Disparait si l'utilisateur est connecte
 */
export default function StickySignupWidget() {
	const t = useTranslations('blog')
	const [visible, setVisible] = useState(false)
	const [dismissed, setDismissed] = useState(false)
	const { isUserLoggedIn } = useUserContext()
	const { isDark } = useThemeMode()
	const params = useParams()

	useEffect(() => {
		// Verifier si le widget a deja ete ferme dans cette session
		const isDismissed = sessionStorage.getItem('signup_widget_dismissed')
		if (isDismissed) {
			setDismissed(true)
			return
		}

		const handleScroll = () => {
			// Afficher apres 30% de scroll
			const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
			setVisible(scrollPercent > 30)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const handleDismiss = () => {
		setDismissed(true)
		sessionStorage.setItem('signup_widget_dismissed', 'true')
		gtm.event({
			event: 'blog_sticky_widget_dismissed',
			category: 'Blog',
			action: 'Sticky Widget Dismissed',
			language: params.locale
		})
	}

	const handleClick = () => {
		gtm.event({
			event: 'blog_sticky_widget_click',
			category: 'Blog',
			action: 'Sticky Widget Click',
			language: params.locale
		})
	}

	// Ne pas afficher si l'utilisateur est connecte ou a ferme le widget
	if (isUserLoggedIn || dismissed || !visible) return null

	return (
		<div className={cn(
			'fixed bottom-20 md:bottom-6 right-4 md:right-6',
			'max-w-[calc(100%-2rem)] sm:max-w-[380px]',
			'p-6 rounded-2xl',
			'border-2 backdrop-blur-xl',
			isDark
				? 'bg-slate-900/95 border-violet-500/30'
				: 'bg-white/95 border-violet-600/20',
			'shadow-2xl',
			isDark ? 'shadow-violet-500/20' : 'shadow-violet-400/30',
			'z-50',
			'animate-in slide-in-from-bottom-10 duration-500'
		)}>
			{/* Close button */}
			<button
				onClick={handleDismiss}
				className={cn(
					'absolute top-3 right-3',
					'w-8 h-8 rounded-lg',
					'flex items-center justify-center',
					'transition-all duration-200',
					isDark
						? 'text-slate-400 hover:text-violet-400 hover:bg-violet-500/10'
						: 'text-slate-500 hover:text-violet-500 hover:bg-violet-500/10'
				)}
			>
				<X className="w-5 h-5" />
			</button>

			{/* Icon with glow effect */}
			<div className="relative mb-4">
				<div className={cn(
					'w-14 h-14 rounded-2xl',
					'bg-gradient-to-br from-violet-500 to-cyan-500',
					'flex items-center justify-center',
					'shadow-lg shadow-violet-500/40'
				)}>
					<Rocket className="w-7 h-7 text-white" />
				</div>
				{/* Sparkle decoration */}
				<Sparkles className={cn(
					'absolute -top-1 -right-1 w-5 h-5',
					isDark ? 'text-amber-400' : 'text-amber-500'
				)} />
			</div>

			{/* Content */}
			<h3 className={cn(
				'text-xl font-black mb-2',
				isDark ? 'text-slate-100' : 'text-slate-800'
			)}>
				{t('signup_widget_title') || 'Commencez votre apprentissage !'}
			</h3>

			<p className={cn(
				'text-sm leading-relaxed mb-5',
				isDark ? 'text-slate-400' : 'text-slate-600'
			)}>
				{t('signup_widget_message')}
			</p>

			{/* CTA Button */}
			<Link href="/signup" onClick={handleClick} className="block">
				<button className={cn(
					'w-full py-3.5 px-6 rounded-xl',
					'font-bold text-base text-white',
					'bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600',
					'shadow-lg shadow-violet-500/30',
					'transition-all duration-300',
					'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/40',
					'active:translate-y-0'
				)}>
					{t('signup_widget_button') || 'Inscription gratuite'}
				</button>
			</Link>
		</div>
	)
}
