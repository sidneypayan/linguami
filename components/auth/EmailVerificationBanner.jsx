'use client'

import { useState } from 'react'
import { Mail, X, Loader2 } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useUserContext } from '@/context/user'
import { resendVerificationEmail } from '@/lib/emailVerification'
import { useRouter } from 'next/navigation'
import { getEmailLanguage } from '@/lib/emailService'
import toast from '@/utils/toast'
import { logger } from '@/utils/logger'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Banniere d'avertissement pour les utilisateurs dont l'email n'est pas verifie
 * Affiche un message et un bouton pour renvoyer l'email de verification
 */
const EmailVerificationBanner = () => {
	const t = useTranslations('common')
	const router = useRouter()
	const { user, isEmailVerified, isUserLoggedIn, isBootstrapping } = useUserContext()
	const [isResending, setIsResending] = useState(false)
	const [isDismissed, setIsDismissed] = useState(false)

	// Ne rien afficher si :
	// - Chargement en cours (evite le flash pendant l'hydratation)
	// - L'utilisateur n'est pas connecte
	// - L'email est deja verifie
	// - La banniere a ete fermee
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
				toast.success(t('verificationEmailResent') || 'Email de verification renvoye !')
			} else {
				toast.error(t('errorResendingEmail') || "Erreur lors de l'envoi de l'email")
			}
		} catch (error) {
			logger.error('Error resending verification email:', error)
			toast.error(t('errorResendingEmail') || "Erreur lors de l'envoi de l'email")
		} finally {
			setIsResending(false)
		}
	}

	return (
		<div className="sticky top-0 z-[1100] w-full">
			<div
				className={cn(
					'flex items-center justify-between gap-4 px-4 py-3',
					'bg-amber-500 text-amber-950'
				)}
			>
				<div className="flex items-center gap-3 flex-1">
					<Mail className="w-5 h-5 flex-shrink-0" />
					<p className="text-sm">
						<strong>{t('emailNotVerified') || 'Email non verifie'}</strong> -{' '}
						{t('emailNotVerifiedMessage') || 'Verifiez votre boite mail pour activer toutes les fonctionnalites.'}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleResendEmail}
						disabled={isResending}
						className="text-amber-950 hover:bg-white/20 font-semibold"
					>
						{isResending ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								{t('sending') || 'Envoi...'}
							</>
						) : (
							t('resendEmail') || "Renvoyer l'email"
						)}
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsDismissed(true)}
						className="text-amber-950 hover:bg-white/20 w-8 h-8"
					>
						<X className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}

export default EmailVerificationBanner
