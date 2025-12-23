'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import {
	Heart,
	Mail,
	Facebook,
	Twitter,
	Youtube,
	ExternalLink
} from 'lucide-react'

const Footer = ({ className }) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()

	const socialLinks = [
		{ href: 'https://www.facebook.com/linguami/', icon: Facebook, label: 'Facebook' },
		{ href: 'https://twitter.com/linguami/', icon: Twitter, label: 'Twitter' },
		{ href: 'https://www.youtube.com/channel/UCVtNeYVhksLsMqYmCCAFFIg/', icon: Youtube, label: 'YouTube' },
	]

	return (
		<footer className={cn(
			'relative mt-auto overflow-hidden',
			'pt-10 md:pt-14 pb-[calc(72px+2rem)] md:pb-14',
			'bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900',
			className
		)}>
			{/* Background effects */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
			</div>

			{/* Top decorative border */}
			<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />

			<div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
				<div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-12">

					{/* Logo & Description */}
					<div className="text-center md:text-left flex-1">
						<div className="flex items-center justify-center md:justify-start gap-2 mb-3">
							<h2 className={cn(
								'text-3xl md:text-4xl font-black pb-1',
								'bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400',
								'bg-clip-text text-transparent',
								'drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]'
							)}>
								Linguami
							</h2>
						</div>
						<p className="hidden md:block text-white/80 max-w-xs leading-relaxed">
							{t('footerDescription')}
						</p>
					</div>

					{/* Links */}
					<div className="text-center md:text-left">
						<h3 className="text-lg font-bold text-white/95 mb-3 md:mb-4">
							{t('usefulLinks')}
						</h3>
						<div className="flex flex-col gap-2 md:gap-3">
							{/* Support Link */}
							<a
								href="https://paypal.me/linguami"
								target="_blank"
								rel="noopener noreferrer"
								className={cn(
									'group flex items-center gap-2 justify-center md:justify-start',
									'text-white/80 transition-all duration-300',
									'hover:text-cyan-400 hover:translate-x-1'
								)}
							>
								<Heart className="w-4 h-4 transition-transform group-hover:scale-125 group-hover:rotate-12" />
								<span className="font-medium">{t('support')}</span>
								<ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
							</a>

							{/* Contact Link */}
							<a
								href="mailto:contact@linguami.com?Subject=Contact%20from%20linguami"
								className={cn(
									'group flex items-center gap-2 justify-center md:justify-start',
									'text-white/80 transition-all duration-300',
									'hover:text-violet-400 hover:translate-x-1'
								)}
							>
								<Mail className="w-4 h-4 transition-transform group-hover:scale-125 group-hover:rotate-12" />
								<span className="font-medium">{t('contact')}</span>
							</a>
						</div>
					</div>

					{/* Social Links */}
					<div className="text-center">
						<h3 className="text-lg font-bold text-white/95 mb-3 md:mb-4">
							{t('followUs')}
						</h3>
						<div className="flex gap-2 md:gap-3 justify-center">
							{socialLinks.map((social) => {
								const Icon = social.icon
								return (
									<a
										key={social.label}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										title={social.label}
										className={cn(
											'group relative w-10 h-10 md:w-11 md:h-11 rounded-xl',
											'flex items-center justify-center',
											'bg-gradient-to-br from-violet-500/30 to-cyan-500/20',
											'border border-violet-500/40',
											'backdrop-blur-sm',
											'shadow-lg shadow-violet-500/20',
											'transition-all duration-300',
											'hover:-translate-y-1 hover:scale-110',
											'hover:shadow-xl hover:shadow-violet-500/40',
											'hover:border-violet-400/60',
											'overflow-hidden'
										)}
									>
										{/* Shine effect */}
										<div className={cn(
											'absolute inset-0 -translate-x-full',
											'bg-gradient-to-r from-transparent via-white/20 to-transparent',
											'group-hover:translate-x-full transition-transform duration-700'
										)} />
										<Icon className={cn(
											'w-5 h-5 md:w-6 md:h-6 text-white relative z-10',
											'transition-transform duration-500',
											'group-hover:rotate-[360deg]'
										)} />
									</a>
								)
							})}
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className={cn(
					'mt-8 md:mt-12 pt-6',
					'border-t border-violet-500/20',
					'text-center'
				)}>
					<p className="text-white/70 font-medium">
						Copyright &copy; {new Date().getFullYear()} {t('allrights')}
					</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
