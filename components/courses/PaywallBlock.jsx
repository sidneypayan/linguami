import { Box, Paper, Typography, Button, useTheme } from '@mui/material'
import { Lock, Star, CheckCircle } from '@mui/icons-material'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

/**
 * PaywallBlock - Encourage users to sign up or purchase the method
 */
const PaywallBlock = ({ isLoggedIn }) => {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const t = useTranslations('common')

	return (
		<Paper
			elevation={0}
			sx={{
				p: { xs: 3, sm: 5 },
				my: 4,
				borderRadius: 3,
				border: '3px solid',
				borderColor: '#f59e0b',
				background: isDark
					? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(30, 41, 59, 0.95) 100%)'
					: 'linear-gradient(135deg, rgba(254, 243, 199, 0.6) 0%, rgba(255, 255, 255, 0.95) 100%)',
				textAlign: 'center',
			}}>
			{/* Icon */}
			<Box
				sx={{
					display: 'inline-flex',
					p: 2,
					borderRadius: '50%',
					background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
					mb: 3,
				}}>
				<Lock sx={{ fontSize: 40, color: 'white' }} />
			</Box>

			{/* Title */}
			<Typography
				variant="h4"
				sx={{
					fontWeight: 800,
					mb: 2,
					background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					backgroundClip: 'text',
				}}>
				{isLoggedIn
					? t('paywall_title_logged_in', 'Débloquez toutes les leçons')
					: t('paywall_title_guest', 'Vous aimez notre méthode ?')}
			</Typography>

			{/* Subtitle */}
			<Typography
				variant="h6"
				sx={{
					mb: 4,
					color: isDark ? '#cbd5e1' : '#475569',
					fontWeight: 500,
				}}>
				{isLoggedIn
					? t(
							'paywall_subtitle_logged_in',
							'Achetez la méthode complète pour continuer votre apprentissage'
					  )
					: t(
							'paywall_subtitle_guest',
							'Créez un compte gratuit et débloquez toutes les leçons !'
					  )}
			</Typography>

			{/* Benefits */}
			<Box sx={{ mb: 4, textAlign: 'left', maxWidth: 500, mx: 'auto' }}>
				{[
					{
						icon: <CheckCircle sx={{ color: '#10b981' }} />,
						text: t('paywall_benefit_1', 'Accès à toutes les leçons A1 → C2'),
					},
					{
						icon: <CheckCircle sx={{ color: '#10b981' }} />,
						text: t('paywall_benefit_2', 'Exercices interactifs avec corrections'),
					},
					{
						icon: <CheckCircle sx={{ color: '#10b981' }} />,
						text: t('paywall_benefit_3', 'Audio professionnel pour chaque dialogue'),
					},
					{
						icon: <CheckCircle sx={{ color: '#10b981' }} />,
						text: t('paywall_benefit_4', 'Suivi de progression personnalisé'),
					},
				].map((benefit, index) => (
					<Box
						key={index}
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 2,
							mb: 2,
							p: 1.5,
							borderRadius: 2,
							background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
						}}>
						{benefit.icon}
						<Typography sx={{ fontWeight: 500 }}>{benefit.text}</Typography>
					</Box>
				))}
			</Box>

			{/* CTA Buttons */}
			<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
				{!isLoggedIn && (
					<Link href="/signup" passHref legacyBehavior>
						<Button
							variant="contained"
							size="large"
							startIcon={<Star />}
							sx={{
								px: 4,
								py: 1.5,
								fontSize: '1.1rem',
								fontWeight: 700,
								background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
								'&:hover': {
									background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
								},
							}}>
							{t('paywall_cta_register', 'Créer un compte gratuit')}
						</Button>
					</Link>
				)}

				{isLoggedIn && (
					<Link href="/pricing" passHref legacyBehavior>
						<Button
							variant="contained"
							size="large"
							startIcon={<Star />}
							sx={{
								px: 4,
								py: 1.5,
								fontSize: '1.1rem',
								fontWeight: 700,
								background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
								'&:hover': {
									background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
								},
							}}>
							{t('paywall_cta_purchase', 'Acheter la méthode')}
						</Button>
					</Link>
				)}

				{!isLoggedIn && (
					<Link href="/login" passHref legacyBehavior>
						<Button
							variant="outlined"
							size="large"
							sx={{
								px: 4,
								py: 1.5,
								fontSize: '1.1rem',
								fontWeight: 600,
								borderColor: '#f59e0b',
								color: '#f59e0b',
								'&:hover': {
									borderColor: '#d97706',
									background: 'rgba(245, 158, 11, 0.1)',
								},
							}}>
							{t('paywall_cta_login', 'Se connecter')}
						</Button>
					</Link>
				)}
			</Box>

			{/* Small print */}
			<Typography
				variant="body2"
				sx={{
					mt: 3,
					color: isDark ? '#94a3b8' : '#64748b',
					fontStyle: 'italic',
				}}>
				{isLoggedIn
					? t('paywall_note_logged_in', 'Paiement sécurisé • Garantie satisfait ou remboursé')
					: t(
							'paywall_note_guest',
							'Inscription gratuite • Sans engagement • Annulation possible à tout moment'
					  )}
			</Typography>
		</Paper>
	)
}

export default PaywallBlock
