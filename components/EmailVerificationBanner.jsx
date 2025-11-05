import { useState, useEffect } from 'react'
import { Box, Typography, Button, IconButton, Alert, Collapse } from '@mui/material'
import { CloseRounded, MarkEmailReadRounded, SendRounded } from '@mui/icons-material'
import { useUserContext } from '../context/user'
import { resendVerificationEmail } from '../lib/emailVerification'
import { getEmailLanguage } from '../lib/emailService'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { toast } from 'react-toastify'

const EmailVerificationBanner = () => {
	const { t } = useTranslation('common')
	const router = useRouter()
	const { user, userProfile, isEmailVerified } = useUserContext()
	const [isVisible, setIsVisible] = useState(false)
	const [isSending, setIsSending] = useState(false)
	const [isDismissed, setIsDismissed] = useState(false)

	// Vérifier si le banner a été fermé récemment
	useEffect(() => {
		try {
			const dismissed = localStorage.getItem('emailVerificationBannerDismissed')
			if (dismissed) {
				const dismissedTime = parseInt(dismissed)
				const now = Date.now()
				// Réafficher le banner après 24h
				if (now - dismissedTime < 24 * 60 * 60 * 1000) {
					setIsDismissed(true)
					return
				}
			}
		} catch {}

		// Afficher le banner si l'utilisateur est connecté et son email n'est pas vérifié
		setIsVisible(user && !isEmailVerified && !isDismissed)
	}, [user, isEmailVerified, isDismissed])

	const handleClose = () => {
		setIsVisible(false)
		setIsDismissed(true)
		try {
			localStorage.setItem('emailVerificationBannerDismissed', Date.now().toString())
		} catch {}
	}

	const handleResendEmail = async () => {
		setIsSending(true)
		try {
			const language = getEmailLanguage(router.locale || 'fr')
			const result = await resendVerificationEmail(user, language)

			if (result.success) {
				toast.success(t('verificationEmailResent') || 'Email de vérification renvoyé !')
			} else {
				toast.error(result.error || t('errorSendingEmail') || 'Erreur lors de l\'envoi')
			}
		} catch (error) {
			console.error('Error resending verification email:', error)
			toast.error(t('errorSendingEmail') || 'Erreur lors de l\'envoi')
		} finally {
			setIsSending(false)
		}
	}

	if (!isVisible) return null

	return (
		<Collapse in={isVisible}>
			<Box
				sx={{
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
					position: 'sticky',
					top: 0,
					zIndex: 1100,
					boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
				}}>
				<Box
					sx={{
						maxWidth: 1200,
						mx: 'auto',
						px: { xs: 2, sm: 3 },
						py: 1.5,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 2,
					}}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
						<MarkEmailReadRounded
							sx={{
								fontSize: { xs: 28, sm: 32 },
								color: 'white',
								display: { xs: 'none', sm: 'block' },
							}}
						/>
						<Box sx={{ flex: 1 }}>
							<Typography
								sx={{
									color: 'white',
									fontWeight: 600,
									fontSize: { xs: '0.875rem', sm: '1rem' },
									mb: 0.25,
								}}>
								{t('verifyYourEmail') || 'Vérifiez votre adresse email'}
							</Typography>
							<Typography
								sx={{
									color: 'rgba(255, 255, 255, 0.9)',
									fontSize: { xs: '0.75rem', sm: '0.875rem' },
								}}>
								{t('verifyEmailMessage') || 'Un email de confirmation vous a été envoyé. Vérifiez votre boîte de réception.'}
							</Typography>
						</Box>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Button
							onClick={handleResendEmail}
							disabled={isSending}
							startIcon={<SendRounded />}
							sx={{
								display: { xs: 'none', sm: 'flex' },
								background: 'rgba(255, 255, 255, 0.2)',
								color: 'white',
								fontWeight: 600,
								px: 2.5,
								py: 0.75,
								borderRadius: 1.5,
								textTransform: 'none',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								'&:hover': {
									background: 'rgba(255, 255, 255, 0.3)',
									border: '1px solid rgba(255, 255, 255, 0.5)',
								},
								'&:disabled': {
									background: 'rgba(255, 255, 255, 0.1)',
									color: 'rgba(255, 255, 255, 0.6)',
								},
							}}>
							{isSending ? t('sending') || 'Envoi...' : t('resendEmail') || 'Renvoyer l\'email'}
						</Button>

						{/* Version mobile du bouton */}
						<IconButton
							onClick={handleResendEmail}
							disabled={isSending}
							sx={{
								display: { xs: 'flex', sm: 'none' },
								background: 'rgba(255, 255, 255, 0.2)',
								color: 'white',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								'&:hover': {
									background: 'rgba(255, 255, 255, 0.3)',
								},
								'&:disabled': {
									background: 'rgba(255, 255, 255, 0.1)',
									color: 'rgba(255, 255, 255, 0.6)',
								},
							}}>
							<SendRounded />
						</IconButton>

						<IconButton
							onClick={handleClose}
							sx={{
								color: 'white',
								'&:hover': {
									background: 'rgba(255, 255, 255, 0.2)',
								},
							}}>
							<CloseRounded />
						</IconButton>
					</Box>
				</Box>
			</Box>
		</Collapse>
	)
}

export default EmailVerificationBanner
