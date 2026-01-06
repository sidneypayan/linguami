'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useThemeMode } from '@/context/ThemeContext'
import { Rocket, BookOpen, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import * as gtm from '@/lib/gtm'

/**
 * Call-to-Actions contextuels a placer dans les articles
 *
 * Types disponibles :
 * - 'start-learning' : Pour encourager a commencer l'apprentissage
 * - 'materials' : Pour decouvrir les materiaux
 * - 'premium' : Pour passer premium
 */
export default function ArticleCTA({ type = 'start-learning', className = '' }) {
	const { isDark } = useThemeMode()
	const t = useTranslations('blog')
	const params = useParams()

	const ctaConfig = {
		'start-learning': {
			icon: Rocket,
			title: t('cta_start_title'),
			subtitle: t('cta_start_subtitle'),
			buttonText: t('cta_start_button'),
			href: "/signup",
			color: 'violet'
		},
		'materials': {
			icon: BookOpen,
			title: t('cta_materials_title'),
			subtitle: t('cta_materials_subtitle'),
			buttonText: t('cta_materials_button'),
			href: "/materials",
			color: 'cyan'
		},
		'premium': {
			icon: Headphones,
			title: t('cta_premium_title'),
			subtitle: t('cta_premium_subtitle'),
			buttonText: t('cta_premium_button'),
			href: "/premium",
			color: 'rose'
		}
	}

	const config = ctaConfig[type]
	const Icon = config.icon

	const colorClasses = {
		violet: {
			iconBg: 'bg-violet-500/15 border-violet-500/30',
			iconColor: 'text-violet-500',
			buttonBg: 'bg-gradient-to-r from-violet-500 to-violet-600',
			buttonShadow: 'shadow-violet-500/40 hover:shadow-violet-500/60',
			glow: 'from-violet-500/20'
		},
		cyan: {
			iconBg: 'bg-cyan-500/15 border-cyan-500/30',
			iconColor: 'text-cyan-500',
			buttonBg: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
			buttonShadow: 'shadow-cyan-500/40 hover:shadow-cyan-500/60',
			glow: 'from-cyan-500/20'
		},
		rose: {
			iconBg: 'bg-rose-500/15 border-rose-500/30',
			iconColor: 'text-rose-500',
			buttonBg: 'bg-gradient-to-r from-rose-500 to-rose-600',
			buttonShadow: 'shadow-rose-500/40 hover:shadow-rose-500/60',
			glow: 'from-rose-500/20'
		}
	}

	const colors = colorClasses[config.color]

	const handleClick = () => {
		gtm.event({
			event: 'blog_cta_click',
			category: 'Blog',
			action: 'CTA Click',
			label: type,
			language: params.locale
		})
	}

	return (
		<div
			className={cn(
				'my-10 p-6 md:p-8 rounded-3xl relative overflow-hidden',
				'border-2 backdrop-blur-lg',
				isDark
					? 'bg-gradient-to-br from-indigo-950/80 to-violet-950/80 border-violet-500/30'
					: 'bg-gradient-to-br from-violet-500/8 to-cyan-500/8 border-violet-500/20',
				className
			)}
		>
			{/* Decorative glow */}
			<div className={cn(
				'absolute top-0 right-0 w-48 h-48 pointer-events-none',
				`bg-radial-gradient ${colors.glow} to-transparent opacity-50`
			)} />

			<div className="flex flex-col items-center text-center relative z-10">
				{/* Icon */}
				<div className={cn(
					'mb-4 w-20 h-20 rounded-full',
					'flex items-center justify-center',
					'border-2',
					colors.iconBg
				)}>
					<Icon className={cn('w-10 h-10', colors.iconColor)} />
				</div>

				{/* Title */}
				<h3 className={cn(
					'font-extrabold mb-3',
					'text-2xl md:text-3xl',
					isDark ? 'text-slate-100' : 'text-slate-800'
				)}>
					{config.title}
				</h3>

				{/* Subtitle */}
				<p className={cn(
					'mb-6 max-w-xl leading-relaxed',
					isDark ? 'text-slate-300' : 'text-slate-600'
				)}>
					{config.subtitle}
				</p>

				{/* CTA Button */}
				<Link href={config.href} target="_blank">
					<Button
						onClick={handleClick}
						size="lg"
						className={cn(
							'px-8 py-6 text-lg font-bold rounded-xl',
							'text-white',
							colors.buttonBg,
							'shadow-lg',
							colors.buttonShadow,
							'transition-all duration-300',
							'hover:-translate-y-1 hover:shadow-xl'
						)}
					>
						{config.buttonText}
					</Button>
				</Link>
			</div>
		</div>
	)
}
