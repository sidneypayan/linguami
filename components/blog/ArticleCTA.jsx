'use client'

import { Box, Typography, Button, useTheme } from '@mui/material'
import { RocketLaunchRounded, AutoStoriesRounded, HeadphonesRounded } from '@mui/icons-material'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import * as gtm from '@/lib/gtm'
import { useRouter, usePathname, useParams } from 'next/navigation'

/**
 * Call-to-Actions contextuels à placer dans les articles
 *
 * Types disponibles :
 * - 'start-learning' : Pour encourager à commencer l'apprentissage
 * - 'materials' : Pour découvrir les matériaux
 * - 'premium' : Pour passer premium
 */
export default function ArticleCTA({ type = 'start-learning', className = '' }) {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const t = useTranslations('common')
	const router = useRouter()
	const pathname = usePathname()
	const params = useParams()

	const ctaConfig = {
		'start-learning': {
			icon: <RocketLaunchRounded sx={{ fontSize: '3rem' }} />,
			title: "Prêt à commencer votre apprentissage ?",
			subtitle: "Rejoignez Linguami et accédez à des centaines de ressources pour apprendre le russe ou le français efficacement.",
			buttonText: "Commencer gratuitement",
			href: "/signup",
			color: '#8b5cf6'
		},
		'materials': {
			icon: <AutoStoriesRounded sx={{ fontSize: '3rem' }} />,
			title: "Découvrez nos matériaux d'apprentissage",
			subtitle: "Livres, vidéos, podcasts, musique... Apprenez avec du contenu authentique et captivant.",
			buttonText: "Explorer les matériaux",
			href: "/materials",
			color: '#06b6d4'
		},
		'premium': {
			icon: <HeadphonesRounded sx={{ fontSize: '3rem' }} />,
			title: "Accélérez votre progression",
			subtitle: "Débloquez toutes les fonctionnalités premium : leçons illimitées, exercices avancés, suivi personnalisé.",
			buttonText: "Découvrir Premium",
			href: "/premium",
			color: '#f5576c'
		}
	}

	const config = ctaConfig[type]

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
		<Box
			className={className}
			sx={{
				my: 5,
				p: { xs: 3, md: 4 },
				borderRadius: 3,
				background: isDark
					? 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(49, 46, 129, 0.8) 100%)'
					: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
				border: `2px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
				backdropFilter: 'blur(10px)',
				position: 'relative',
				overflow: 'hidden',
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					right: 0,
					width: '200px',
					height: '200px',
					background: `radial-gradient(circle, ${config.color}20 0%, transparent 70%)`,
					pointerEvents: 'none',
				},
			}}>
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
				<Box
					sx={{
						mb: 2,
						color: config.color,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 80,
						height: 80,
						borderRadius: '50%',
						background: `${config.color}15`,
						border: `2px solid ${config.color}30`,
					}}>
					{config.icon}
				</Box>

				<Typography
					variant="h5"
					sx={{
						fontWeight: 800,
						mb: 1.5,
						fontSize: { xs: '1.5rem', md: '1.75rem' },
						color: isDark ? '#f1f5f9' : '#2d3748',
					}}>
					{config.title}
				</Typography>

				<Typography
					variant="body1"
					sx={{
						mb: 3,
						maxWidth: '600px',
						color: isDark ? '#cbd5e1' : '#4a5568',
						lineHeight: 1.7,
					}}>
					{config.subtitle}
				</Typography>

				<Link href={config.href} style={{ textDecoration: 'none' }}>
					<Button
						onClick={handleClick}
						variant="contained"
						size="large"
						sx={{
							px: 4,
							py: 1.5,
							fontSize: '1.05rem',
							fontWeight: 700,
							borderRadius: 2,
							background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)`,
							boxShadow: `0 8px 20px ${config.color}40`,
							textTransform: 'none',
							transition: 'all 0.3s ease',
							'&:hover': {
								background: `linear-gradient(135deg, ${config.color}dd 0%, ${config.color} 100%)`,
								transform: 'translateY(-2px)',
								boxShadow: `0 12px 28px ${config.color}60`,
							},
						}}>
						{config.buttonText}
					</Button>
				</Link>
			</Box>
		</Box>
	)
}
