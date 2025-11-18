'use server'

import { logger } from '@/utils/logger'

/**
 * Server Actions for Authentication operations
 * Handles Turnstile verification and other auth-related operations
 */

// ============================================================================
// ACTION: Vérifier le token Cloudflare Turnstile
// ============================================================================

export async function verifyTurnstile(token) {
	try {
		// 1. Valider le paramètre
		if (!token) {
			return {
				success: false,
				error: 'Missing Turnstile token',
			}
		}

		// 2. Vérifier la configuration
		const secretKey = process.env.TURNSTILE_SECRET_KEY

		if (!secretKey) {
			logger.error('❌ TURNSTILE_SECRET_KEY is not defined in environment variables')
			return {
				success: false,
				error: 'Turnstile is not configured properly',
			}
		}

		// 3. Vérifier le token avec l'API Cloudflare Turnstile
		logger.log('🔐 Verifying Turnstile token...')

		const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				secret: secretKey,
				response: token,
			}),
		})

		const verifyData = await verifyResponse.json()

		logger.log('Turnstile verification response:', verifyData)

		// 4. Vérifier le résultat
		if (!verifyData.success) {
			logger.error('❌ Turnstile verification failed:', verifyData['error-codes'])
			return {
				success: false,
				error: 'Turnstile verification failed',
				errorCodes: verifyData['error-codes'],
			}
		}

		logger.log('✅ Turnstile verification successful')

		return {
			success: true,
			message: 'Verification successful',
		}

	} catch (error) {
		logger.error('❌ Error verifying Turnstile token:', error)
		return {
			success: false,
			error: 'Internal server error',
		}
	}
}
