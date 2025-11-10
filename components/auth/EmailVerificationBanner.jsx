import { useState } from 'react'
import { Alert, Button, Box, CircularProgress } from '@mui/material'
import { MailOutline, Close } from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'
import { useUserContext } from '@/context/user'
import { resendVerificationEmail } from '@/lib/emailVerification'
import { useRouter } from 'next/router'
import { getEmailLanguage } from '@/lib/emailService'
import toast from '@/utils/toast'

/**
 * Bannière d'avertissement pour les utilisateurs dont l'email n'est pas vérifié
 * Affiche un message et un bouton pour renvoyer l'email de vérification
 */
const EmailVerificationBanner = () => {
	const { t } = useTranslation('common')
	const router = useRouter()
	const { user, isEmailVerified, isUserLoggedIn, isBootstrapping } = useUserContext()
	const [isResending, setIsResending] = useState(false)
	const [isDismissed, setIsDismissed] = useState(false)

	// Ne rien afficher si :
	// - Chargement en cours (évite le flash pendant l'hydratation)
	// - L'utilisateur n'est pas connecté
	// - L'email est déjà vérifié
	// - La bannière a été fermée
	if (isBootstrapping || !isUserLoggedIn || isEmailVerified || isDismissed) {
		return null
	}

	const handleResendEmail = async () => {
		if (!user) return

		setIsResending(true)
		try {
			const emailLanguage = getEmailLanguage(router?.locale || 'fr')
			const result = await resendVerificationEmail(user, emailLanguage)

			if (result.success) {
				toast.success(t('verificationEmailResent') || 'Email de vérification renvoyé !')
			} else {
				toast.error(t('errorResendingEmail') || 'Erreur lors de l\'envoi de l\'email')
			}
		} catch (error) {
			console.error('Error resending verification email:', error)
			toast.error(t('errorResendingEmail') || 'Erreur lors de l\'envoi de l\'email')
		} finally {
			setIsResending(false)
		}
	}

	return (
		<Box
			sx={{
				position: 'sticky',
				top: 0,
				zIndex: 1100,
				width: '100%',
			}}>
			<Alert
				severity='warning'
				icon={<MailOutline />}
				action={
					<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
						<Button
							color='inherit'
							size='small'
							onClick={handleResendEmail}
							disabled={isResending}
							sx={{
								fontWeight: 600,
								'&:hover': {
									background: 'rgba(255, 255, 255, 0.2)',
								},
							}}>
							{isResending ? (
								<>
									<CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />
									{t('sending') || 'Envoi...'}
								</>
							) : (
								t('resendEmail') || 'Renvoyer l\'email'
							)}
						</Button>
						<Button
							color='inherit'
							size='small'
							onClick={() => setIsDismissed(true)}
							sx={{
								minWidth: 'auto',
								p: 0.5,
							}}>
							<Close fontSize='small' />
						</Button>
					</Box>
				}
				sx={{
					borderRadius: 0,
					'& .MuiAlert-message': {
						flex: 1,
					},
				}}>
				<strong>{t('emailNotVerified') || 'Email non vérifié'}</strong> -{' '}
				{t('emailNotVerifiedMessage') || 'Vérifiez votre boîte mail pour activer toutes les fonctionnalités.'}
			</Alert>
		</Box>
	)
}

export default EmailVerificationBanner
