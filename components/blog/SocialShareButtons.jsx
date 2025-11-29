'use client'

import { useThemeMode } from '@/context/ThemeContext'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Facebook, Twitter, Linkedin, Link2, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import * as gtm from '@/lib/gtm'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// WhatsApp icon component (Lucide doesn't have WhatsApp)
const WhatsAppIcon = ({ className }) => (
	<svg
		viewBox="0 0 24 24"
		fill="currentColor"
		className={className}
	>
		<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
	</svg>
)

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
		{ name: 'whatsapp', icon: WhatsAppIcon, color: '#25D366', label: 'WhatsApp' },
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
						<Button
							key={button.name}
							variant="outline"
							size="icon"
							onClick={() => handleShare(button.name)}
							title={button.label}
							className={cn(
								'w-12 h-12 rounded-xl',
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
							/>
						</Button>
					)
				})}
			</div>
		</div>
	)
}
