import { useState, useEffect } from 'react'
import { Box, Typography, Button, IconButton, useTheme } from '@mui/material'
import { CloseRounded, RocketLaunchRounded } from '@mui/icons-material'
import Link from 'next/link'
import { useUserContext } from '@/context/user'
import * as gtm from '@/lib/gtm'
import { useRouter } from 'next/router'

/**
 * Widget sticky qui apparaît après un certain scroll
 * Disparaît si l'utilisateur est connecté
 */
export default function StickySignupWidget() {
	const [visible, setVisible] = useState(false)
	const [dismissed, setDismissed] = useState(false)
	const { isUserLoggedIn } = useUserContext()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const router = useRouter()

	useEffect(() => {
		// Vérifier si le widget a déjà été fermé dans cette session
		const isDismissed = sessionStorage.getItem('signup_widget_dismissed')
		if (isDismissed) {
			setDismissed(true)
			return
		}

		const handleScroll = () => {
			// Afficher après 30% de scroll
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
			language: router.locale
		})
	}

	const handleClick = () => {
		gtm.event({
			event: 'blog_sticky_widget_click',
			category: 'Blog',
			action: 'Sticky Widget Click',
			language: router.locale
		})
	}

	// Ne pas afficher si l'utilisateur est connecté ou a fermé le widget
	if (isUserLoggedIn || dismissed || !visible) return null

	return (
		<Box
			sx={{
				position: 'fixed',
				bottom: { xs: 16, md: 24 },
				right: { xs: 16, md: 24 },
				maxWidth: { xs: 'calc(100% - 32px)', sm: '380px' },
				p: 3,
				borderRadius: 3,
				background: isDark
					? 'linear-gradient(135deg, rgba(30, 27, 75, 0.98) 0%, rgba(49, 46, 129, 0.98) 100%)'
					: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.98) 100%)',
				border: `2px solid ${isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.2)'}`,
				backdropFilter: 'blur(20px)',
				boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
				zIndex: 1000,
				animation: 'slideInUp 0.5s ease-out',
				'@keyframes slideInUp': {
					from: {
						transform: 'translateY(100px)',
						opacity: 0,
					},
					to: {
						transform: 'translateY(0)',
						opacity: 1,
					},
				},
			}}>
			{/* Close button */}
			<IconButton
				onClick={handleDismiss}
				sx={{
					position: 'absolute',
					top: 8,
					right: 8,
					color: isDark ? '#94a3b8' : '#64748b',
					'&:hover': {
						background: 'rgba(139, 92, 246, 0.1)',
						color: '#8b5cf6',
					},
				}}>
				<CloseRounded fontSize="small" />
			</IconButton>

			{/* Icon */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: 56,
					height: 56,
					borderRadius: '50%',
					background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
					mb: 2,
					boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)',
				}}>
				<RocketLaunchRounded sx={{ color: 'white', fontSize: '1.75rem' }} />
			</Box>

			{/* Content */}
			<Typography
				variant="h6"
				sx={{
					fontWeight: 800,
					mb: 1,
					fontSize: '1.25rem',
					color: isDark ? '#f1f5f9' : '#2d3748',
				}}>
				Commencez votre apprentissage !
			</Typography>

			<Typography
				variant="body2"
				sx={{
					mb: 2.5,
					color: isDark ? '#cbd5e1' : '#64748b',
					lineHeight: 1.6,
				}}>
				Rejoignez des milliers d&apos;apprenants et accédez gratuitement à nos ressources.
			</Typography>

			<Link href="/register" style={{ textDecoration: 'none' }}>
				<Button
					onClick={handleClick}
					fullWidth
					variant="contained"
					size="large"
					sx={{
						py: 1.5,
						fontSize: '1rem',
						fontWeight: 700,
						borderRadius: 2,
						background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
						textTransform: 'none',
						boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
						transition: 'all 0.3s ease',
						'&:hover': {
							transform: 'translateY(-2px)',
							boxShadow: '0 12px 28px rgba(139, 92, 246, 0.4)',
						},
					}}>
					Inscription gratuite
				</Button>
			</Link>

			<Typography
				variant="caption"
				sx={{
					display: 'block',
					mt: 1.5,
					textAlign: 'center',
					color: isDark ? '#94a3b8' : '#94a3b8',
				}}>
				Aucune carte bancaire requise
			</Typography>
		</Box>
	)
}
