'use client'

import { useThemeMode } from '@/context/ThemeContext'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Facebook, Twitter, Linkedin, Link2, Share2 } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { toast } from 'sonner'
import * as gtm from '@/lib/gtm'
import { cn } from '@/lib/utils'

/**
 * Boutons de partage social avec tracking GTM
 *
 * @param {string} title - Titre de l'article
 * @param {string} url - URL complete de l'article
 */
export default function SocialShareButtons({ title, url }) {
	const { isDark } = useThemeMode()
	const t = useTranslations('blog')
	const params = useParams()

	const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
	const shareTitle = title || 'Decouvrez cet article sur Linguami'

	const handleShare = (platform) => {
		// Tracking GTM
		gtm.event({
			event: 'blog_share',
			category: 'Blog',
			action: 'Share Article',
			label: platform,
			language: params.locale
		})

		let shareLink = ''

		switch (platform) {
			case 'facebook':
				shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
				break
			case 'twitter':
				shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
				break
			case 'linkedin':
				shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
				break
			case 'whatsapp':
				shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`
				break
			case 'copy':
				navigator.clipboard.writeText(shareUrl)
				toast.success(t('linkCopied') || 'Lien copie dans le presse-papier !')
				return
			default:
				return
		}

		if (shareLink) {
			window.open(shareLink, '_blank', 'noopener,noreferrer,width=600,height=400')
		}
	}

	const socialButtons = [
		{ name: 'facebook', icon: Facebook, color: '#1877F2', label: 'Facebook' },
		{ name: 'twitter', icon: Twitter, color: '#1DA1F2', label: 'Twitter' },
		{ name: 'linkedin', icon: Linkedin, color: '#0A66C2', label: 'LinkedIn' },
		{ name: 'whatsapp', icon: FaWhatsapp, color: '#25D366', label: 'WhatsApp' },
		{ name: 'copy', icon: Link2, color: '#8b5cf6', label: 'Copier le lien' },
	]

	return (
		<div className={cn(
			'py-6 mt-8',
			'border-y-2',
			isDark ? 'border-violet-500/20' : 'border-violet-600/10'
		)}>
			{/* Header */}
			<div className="flex items-center gap-2 mb-4">
				<Share2 className={cn(
					'w-5 h-5',
					isDark ? 'text-violet-400' : 'text-violet-500'
				)} />
				<h3 className={cn(
					'font-bold',
					isDark ? 'text-slate-300' : 'text-slate-700'
				)}>
					{t('shareArticle') || 'Partager cet article'}
				</h3>
			</div>

			{/* Buttons */}
			<div className="flex gap-3 flex-wrap">
				{socialButtons.map((button) => {
					const Icon = button.icon
					return (
						<button
							key={button.name}
							onClick={() => handleShare(button.name)}
							title={button.label}
							className={cn(
								'w-12 h-12 rounded-xl',
								'flex items-center justify-center',
								'border-2 transition-all duration-300',
								isDark
									? 'bg-slate-800/50 border-violet-500/20'
									: 'bg-white border-violet-600/10',
								'hover:-translate-y-1 hover:shadow-lg',
								'group'
							)}
							style={{
								'--btn-color': button.color
							}}
						>
							<Icon
								className={cn(
									'w-5 h-5 transition-colors',
									isDark ? 'text-slate-400' : 'text-slate-500',
									'group-hover:text-[var(--btn-color)]'
								)}
								style={button.name === 'whatsapp' ? { fontSize: '1.25rem' } : {}}
							/>
						</button>
					)
				})}
			</div>
		</div>
	)
}
