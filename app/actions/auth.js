'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { logger } from '@/utils/logger'

/**
 * Server Actions for Authentication operations
 * Handles Turnstile verification, password changes, account deletion
 */

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

// Password policy: 12 characters minimum, no other constraints
const passwordSchema = z
	.string()
	.min(12, 'Password must be at least 12 characters')

const changePasswordSchema = z.object({
	currentPassword: z.string().min(1, 'Current password is required'),
	newPassword: passwordSchema,
})

// ============================================================================
// HELPER: Create Supabase client with cookies
// ============================================================================

async function createSupabaseClient() {
	const cookieStore = await cookies()
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name) {
					return cookieStore.get(name)?.value
				},
				set(name, value, options) {
					try {
						cookieStore.set(name, value, options)
					} catch (error) {
						// Cookie setting can fail in Server Actions - this is expected
					}
				},
				remove(name, options) {
					try {
						cookieStore.delete(name, options)
					} catch (error) {
						// Cookie deletion can fail in Server Actions - this is expected
					}
				},
			},
		}
	)
}

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

// ============================================================================
// ACTION: Changer le mot de passe
// ============================================================================

export async function changePassword(data) {
	try {
		// 1. Validate input with zod
		const validation = changePasswordSchema.safeParse(data)

		if (!validation.success) {
			const errors = validation.error.flatten().fieldErrors
			return {
				success: false,
				error: errors.newPassword?.[0] || errors.currentPassword?.[0] || 'Invalid input',
			}
		}

		const { currentPassword, newPassword } = validation.data

		// 2. Get authenticated user
		const supabase = await createSupabaseClient()
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (!user || authError) {
			logger.error('❌ User not authenticated:', authError)
			return {
				success: false,
				error: 'Unauthorized',
			}
		}

		logger.log(`🔐 Changing password for user: ${user.id}`)

		// 3. Verify current password by attempting to sign in
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: user.email,
			password: currentPassword,
		})

		if (signInError) {
			logger.error('❌ Current password incorrect:', signInError)
			return {
				success: false,
				error: 'Current password is incorrect',
			}
		}

		// 4. Update password
		const { error: updateError } = await supabase.auth.updateUser({
			password: newPassword,
		})

		if (updateError) {
			logger.error('❌ Error updating password:', updateError)
			throw updateError
		}

		logger.log('✅ Password changed successfully')

		return {
			success: true,
			message: 'Password changed successfully',
		}

	} catch (error) {
		logger.error('❌ Error in changePassword:', error)
		return {
			success: false,
			error: error.message || 'Failed to change password',
		}
	}
}

// ============================================================================
// ACTION: Supprimer le compte utilisateur
// ============================================================================

export async function deleteAccount() {
	try {
		// 1. Get authenticated user
		const supabase = await createSupabaseClient()
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (!user || authError) {
			logger.error('❌ User not authenticated:', authError)
			return {
				success: false,
				error: 'Unauthorized',
			}
		}

		logger.log(`🗑️ Deleting account for user: ${user.id}`)

		// 2. Verify environment variables
		if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
			logger.error('❌ Missing environment variables')
			return {
				success: false,
				error: 'Server configuration error',
			}
		}

		// 3. Create admin client for user deletion (bypasses RLS)
		const supabaseAdmin = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.SUPABASE_SERVICE_ROLE_KEY,
			{
				auth: {
					autoRefreshToken: false,
					persistSession: false
				}
			}
		)

		// 4. Delete user data in optimized order
		// Note: Some deletions can be parallelized, others must respect FK constraints

		// Step 1: Delete independent tables in parallel
		await Promise.all([
			supabaseAdmin.from('user_exercise_progress').delete().eq('user_id', user.id),
			supabaseAdmin.from('xp_transactions').delete().eq('user_id', user.id),
			supabaseAdmin.from('user_goals').delete().eq('user_id', user.id),
			supabaseAdmin.from('user_achievements').delete().eq('user_id', user.id),
		])

		// Step 2: Delete tables that may have FKs to others
		await Promise.all([
			supabaseAdmin.from('user_course_progress').delete().eq('user_id', user.id),
			supabaseAdmin.from('user_course_access').delete().eq('user_id', user.id),
			supabaseAdmin.from('user_materials').delete().eq('user_id', user.id),
			supabaseAdmin.from('user_words_cards').delete().eq('user_id', user.id),
		])

		// Step 3: Delete remaining tables
		await Promise.all([
			supabaseAdmin.from('user_xp_profile').delete().eq('user_id', user.id),
			supabaseAdmin.from('user_words').delete().eq('user_id', user.id),
		])

		// Step 4: Delete user profile (must be done before deleting auth user)
		await supabaseAdmin.from('users_profile').delete().eq('id', user.id)

		// 5. Finally, delete the auth user
		const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

		if (deleteError) {
			logger.error('❌ Error deleting auth user:', deleteError)
			throw deleteError
		}

		logger.log('✅ Account deleted successfully')

		return {
			success: true,
			message: 'Account deleted successfully',
		}

	} catch (error) {
		logger.error('❌ Error in deleteAccount:', error)
		return {
			success: false,
			error: error.message || 'Failed to delete account',
			details: error.message,
		}
	}
}
