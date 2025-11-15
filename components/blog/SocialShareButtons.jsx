'use client'

import { Box, IconButton, Typography, Tooltip, useTheme } from '@mui/material'
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaLink } from 'react-icons/fa'
import { toast } from 'sonner'
import * as gtm from '@/lib/gtm'
import { useRouter, usePathname, useParams } from 'next/navigation'

/**
 * Boutons de partage social avec tracking GTM
 *
 * @param {string} title - Titre de l'article
 * @param {string} url - URL complète de l'article
 */
export default function SocialShareButtons({ title, url }) {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const router = useRouter()
	const pathname = usePathname()
	const params = useParams()

	const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
	const shareTitle = title || 'Découvrez cet article sur Linguami'

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
				toast.success('Lien copié dans le presse-papier !')
				return
			default:
				return
		}

		if (shareLink) {
			window.open(shareLink, '_blank', 'noopener,noreferrer,width=600,height=400')
		}
	}

	const socialButtons = [
		{ name: 'facebook', icon: FaFacebook, color: '#1877F2', label: 'Partager sur Facebook' },
		{ name: 'twitter', icon: FaTwitter, color: '#1DA1F2', label: 'Partager sur Twitter' },
		{ name: 'linkedin', icon: FaLinkedin, color: '#0A66C2', label: 'Partager sur LinkedIn' },
		{ name: 'whatsapp', icon: FaWhatsapp, color: '#25D366', label: 'Partager sur WhatsApp' },
		{ name: 'copy', icon: FaLink, color: '#8b5cf6', label: 'Copier le lien' },
	]

	return (
		<Box
			sx={{
				py: 3,
				borderTop: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`,
				borderBottom: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`,
			}}>
			<Typography
				variant="subtitle2"
				sx={{
					mb: 2,
					fontWeight: 700,
					color: isDark ? '#cbd5e1' : '#4a5568',
				}}>
				Partager cet article
			</Typography>
			<Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
				{socialButtons.map((button) => {
					const Icon = button.icon
					return (
						<Tooltip key={button.name} title={button.label} arrow>
							<IconButton
								onClick={() => handleShare(button.name)}
								sx={{
									width: 48,
									height: 48,
									background: isDark
										? 'rgba(139, 92, 246, 0.1)'
										: 'rgba(139, 92, 246, 0.05)',
									border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`,
									transition: 'all 0.3s ease',
									'&:hover': {
										background: `${button.color}15`,
										borderColor: `${button.color}40`,
										transform: 'translateY(-2px)',
										boxShadow: `0 4px 12px ${button.color}30`,
									},
								}}>
								<Icon style={{ fontSize: '1.25rem', color: button.color }} />
							</IconButton>
						</Tooltip>
					)
				})}
			</Box>
		</Box>
	)
}
