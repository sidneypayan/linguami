import { supabase } from './supabase'
import { logger } from '@/utils/logger'

/**
 * Génère un token de vérification sécurisé
 */
function generateVerificationToken() {
	const array = new Uint8Array(32)
	crypto.getRandomValues(array)
	return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Envoie un email de vérification à un utilisateur
 * @param {string} userId - L'ID de l'utilisateur
 * @param {string} email - L'email de l'utilisateur
 * @param {string} language - La langue de l'email ('fr', 'en', 'ru')
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendVerificationEmail(userId, email, language = 'fr') {
	try {
		// 1. Générer un token sécurisé
		const token = generateVerificationToken()

		// 2. Stocker le token dans la base de données
		const { error: tokenError } = await supabase
			.from('email_verification_tokens')
			.insert({
				user_id: userId,
				token: token,
				email: email,
			})

		if (tokenError) {
			logger.error('Error creating verification token:', tokenError)
			return { success: false, error: tokenError.message }
		}

		// 3. Construire l'URL de vérification
		const appUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin
		const verificationUrl = `${appUrl}/auth/verify-email?token=${token}`

		// 4. Envoyer l'email via notre Edge Function
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
		const functionUrl = `${supabaseUrl}/functions/v1/send-confirmation-email`

		const response = await fetch(functionUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
			},
			body: JSON.stringify({
				email,
				confirmationUrl: verificationUrl,
				language,
			}),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error || 'Failed to send verification email')
		}

		return { success: true }
	} catch (error) {
		logger.error('Error sending verification email:', error)
		return { success: false, error: error.message }
	}
}

/**
 * Vérifie un email avec un token
 * @param {string} token - Le token de vérification
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function verifyEmail(token) {
	try {
		// Appeler la fonction PostgreSQL pour vérifier l'email
		const { data, error } = await supabase.rpc('verify_user_email', {
			verification_token: token,
		})

		if (error) {
			logger.error('Error verifying email:', error)
			return { success: false, error: error.message }
		}

		if (!data || !data.success) {
			return { success: false, error: data?.error || 'Verification failed' }
		}

		return { success: true, email: data.email }
	} catch (error) {
		logger.error('Error verifying email:', error)
		return { success: false, error: error.message }
	}
}

/**
 * Vérifie si l'utilisateur actuel a vérifié son email
 * @param {object} userProfile - Le profil de l'utilisateur
 * @param {object} user - L'utilisateur Supabase auth (optionnel)
 * @returns {boolean}
 */
export function isEmailVerified(userProfile, user = null) {
	// 1. Si email_verified est explicitement true dans le profil
	if (userProfile?.email_verified === true) {
		return true
	}

	// 2. Si l'utilisateur s'est connecté via OAuth (Google, VK, Facebook)
	// Ces providers vérifient déjà l'email, donc pas besoin du bandeau
	if (user?.app_metadata?.provider && user.app_metadata.provider !== 'email') {
		return true
	}

	// 3. Si l'email est confirmé dans Supabase Auth
	if (user?.email_confirmed_at) {
		return true
	}

	return false
}

/**
 * Renvoie un email de vérification à l'utilisateur actuel
 * @param {object} user - L'utilisateur Supabase auth
 * @param {string} language - La langue de l'email
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function resendVerificationEmail(user, language = 'fr') {
	if (!user?.id || !user?.email) {
		return { success: false, error: 'User not found' }
	}

	// Supprimer les anciens tokens non vérifiés pour cet utilisateur
	await supabase
		.from('email_verification_tokens')
		.delete()
		.eq('user_id', user.id)
		.is('verified_at', null)

	// Envoyer un nouveau token
	return sendVerificationEmail(user.id, user.email, language)
}
