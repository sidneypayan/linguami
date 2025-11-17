import { supabase } from './supabase'
import { logger } from '@/utils/logger'

/**
 * Service pour envoyer des emails multilingues via Edge Functions
 */

const FUNCTIONS_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
	'/rest/v1',
	'/functions/v1'
)

/**
 * Envoie un email de confirmation d'inscription
 * @param {string} email - L'adresse email du destinataire
 * @param {string} confirmationUrl - L'URL de confirmation générée par Supabase
 * @param {string} language - La langue de l'email ('fr', 'en', 'ru')
 */
export const sendConfirmationEmail = async (email, confirmationUrl, language = 'fr') => {
	try {
		const { data: { session } } = await supabase.auth.getSession()

		const response = await fetch(`${FUNCTIONS_URL}/send-confirmation-email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
			},
			body: JSON.stringify({
				email,
				confirmationUrl,
				language,
			}),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error || 'Failed to send confirmation email')
		}

		return await response.json()
	} catch (error) {
		logger.error('Error sending confirmation email:', error)
		throw error
	}
}

/**
 * Envoie un email de réinitialisation de mot de passe
 * @param {string} email - L'adresse email du destinataire
 * @param {string} resetUrl - L'URL de réinitialisation générée par Supabase
 * @param {string} language - La langue de l'email ('fr', 'en', 'ru')
 */
export const sendResetPasswordEmail = async (email, resetUrl, language = 'fr') => {
	try {
		const { data: { session } } = await supabase.auth.getSession()

		const response = await fetch(`${FUNCTIONS_URL}/send-reset-password-email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
			},
			body: JSON.stringify({
				email,
				resetUrl,
				language,
			}),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error || 'Failed to send reset password email')
		}

		return await response.json()
	} catch (error) {
		logger.error('Error sending reset password email:', error)
		throw error
	}
}

/**
 * Détermine la langue de l'email en fonction de la locale du router
 * @param {string} locale - La locale actuelle (Next.js router)
 * @returns {string} - Le code langue pour les emails ('fr', 'en', 'ru')
 */
export const getEmailLanguage = (locale) => {
	const languageMap = {
		'fr': 'fr',
		'en': 'en',
		'ru': 'ru',
	}
	return languageMap[locale] || 'fr'
}
