'use server'

import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { logger } from '@/utils/logger'

/**
 * Server Actions for VK ID OAuth authentication
 * Handles code exchange, user info retrieval, and session creation
 */

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const exchangeCodeSchema = z.object({
	code: z.string().min(1, 'Authorization code is required'),
	deviceId: z.string().min(1, 'Device ID is required'),
	redirectUri: z.string().url().optional(),
})

const getUserInfoSchema = z.object({
	accessToken: z.string().min(1, 'Access token is required'),
})

const validateVkAuthSchema = z.object({
	token: z.string().min(1, 'Token is required'),
	userId: z.union([z.string(), z.number()]),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	avatar: z.string().url().optional(),
	email: z.string().email().optional(),
	provider: z.string().optional(), // vk, ok, or mail
})

// ============================================================================
// ACTION: Exchange VK OAuth code for access token
// ============================================================================

export async function exchangeVkCode(data) {
	try {
		// 1. Validate input
		const validation = exchangeCodeSchema.safeParse(data)

		if (!validation.success) {
			const errors = validation.error.flatten().fieldErrors
			return {
				success: false,
				error: errors.code?.[0] || errors.deviceId?.[0] || 'Invalid input',
			}
		}

		const { code, deviceId, redirectUri } = validation.data

		logger.log('🔄 [VK Exchange] Starting code exchange')
		logger.log('Code (first 10 chars):', code.substring(0, 10) + '...')
		logger.log('Device ID (first 10 chars):', deviceId.substring(0, 10) + '...')

		// 2. Verify environment variables
		const appId = process.env.NEXT_PUBLIC_VK_APP_ID
		const clientSecret = process.env.VK_CLIENT_SECRET

		if (!appId || !clientSecret) {
			logger.error('❌ Missing VK_APP_ID or VK_CLIENT_SECRET')
			return {
				success: false,
				error: 'Server configuration error',
			}
		}

		const finalRedirectUri = redirectUri || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`

		logger.log('🔧 [VK Exchange] Using redirect URI:', finalRedirectUri)

		// 3. Exchange code for access token
		const tokenResponse = await fetch('https://id.vk.com/oauth2/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code: code,
				code_verifier: deviceId,
				device_id: deviceId,
				client_id: appId,
				redirect_uri: finalRedirectUri,
			}),
		})

		logger.log('📡 [VK Exchange] VK API response status:', tokenResponse.status)

		if (!tokenResponse.ok) {
			const errorText = await tokenResponse.text()
			logger.error('❌ VK token exchange failed:', tokenResponse.status, errorText)
			return {
				success: false,
				error: 'Failed to exchange code for token',
				details: errorText,
			}
		}

		const tokenData = await tokenResponse.json()

		if (!tokenData.access_token) {
			logger.error('❌ No access token in response')
			return {
				success: false,
				error: 'No access token received',
			}
		}

		logger.log('✅ [VK Exchange] Token received')

		// 4. Get user info using the access token
		const userInfoUrl = `https://id.vk.com/oauth2/user_info?client_id=${appId}`
		const userInfoResponse = await fetch(userInfoUrl, {
			headers: {
				'Authorization': `Bearer ${tokenData.access_token}`,
			},
		})

		logger.log('📡 [VK Exchange] User info response status:', userInfoResponse.status)

		if (!userInfoResponse.ok) {
			const errorText = await userInfoResponse.text()
			logger.error('❌ Failed to get user info:', errorText)
			return {
				success: false,
				error: 'Failed to get user info',
				details: errorText,
			}
		}

		const userData = await userInfoResponse.json()

		logger.log('✅ [VK Exchange] User info received')
		logger.log('User ID:', userData.user_id)
		logger.log('Name:', userData.first_name, userData.last_name)

		return {
			success: true,
			access_token: tokenData.access_token,
			user: userData,
		}

	} catch (error) {
		logger.error('❌ Error in exchangeVkCode:', error)
		return {
			success: false,
			error: error.message || 'Internal server error',
		}
	}
}

// ============================================================================
// ACTION: Get VK user info with access token
// ============================================================================

export async function getVkUserInfo(data) {
	try {
		// 1. Validate input
		const validation = getUserInfoSchema.safeParse(data)

		if (!validation.success) {
			return {
				success: false,
				error: validation.error.flatten().fieldErrors.accessToken?.[0] || 'Invalid input',
			}
		}

		const { accessToken } = validation.data

		logger.log('🔍 [VK User Info] Fetching user info')

		// 2. Get user info from VK API
		const clientId = process.env.NEXT_PUBLIC_VK_APP_ID
		const userInfoUrl = `https://id.vk.com/oauth2/user_info?client_id=${clientId}`

		const userInfoResponse = await fetch(userInfoUrl, {
			headers: {
				'Authorization': `Bearer ${accessToken}`,
			},
		})

		logger.log('📡 [VK User Info] Response status:', userInfoResponse.status)

		if (!userInfoResponse.ok) {
			const errorText = await userInfoResponse.text()
			logger.error('❌ Failed to get user info:', errorText)
			return {
				success: false,
				error: 'Failed to get user info',
				details: errorText,
			}
		}

		const userData = await userInfoResponse.json()
		const userInfo = userData.user || userData

		logger.log('✅ [VK User Info] User info received')

		return {
			success: true,
			user: userInfo,
		}

	} catch (error) {
		logger.error('❌ Error in getVkUserInfo:', error)
		return {
			success: false,
			error: error.message || 'Internal server error',
		}
	}
}

// ============================================================================
// ACTION: Validate VK auth and create/login Supabase user
// ============================================================================

export async function validateVkAuth(data) {
	try {
		// 1. Validate input
		const validation = validateVkAuthSchema.safeParse(data)

		if (!validation.success) {
			const errors = validation.error.flatten().fieldErrors
			return {
				success: false,
				error: errors.token?.[0] || errors.userId?.[0] || 'Invalid input',
			}
		}

		const { token, userId, firstName, lastName, avatar, email, provider } = validation.data

		logger.log('🔑 [VK Validate] Starting validation')

		// 2. Verify token with VK API
		const clientId = process.env.NEXT_PUBLIC_VK_APP_ID
		const userInfoUrl = `https://id.vk.com/oauth2/user_info?client_id=${clientId}`

		const verifyResponse = await fetch(userInfoUrl, {
			headers: {
				'Authorization': `Bearer ${token}`,
			}
		})

		if (!verifyResponse.ok) {
			logger.error('❌ VK token verification failed')
			return {
				success: false,
				error: 'Invalid token',
			}
		}

		const vkUserData = await verifyResponse.json()
		const vkUser = vkUserData.user || vkUserData

		// Validate user ID matches
		if (vkUser.user_id !== userId.toString()) {
			logger.error('❌ User ID mismatch')
			return {
				success: false,
				error: 'User ID mismatch',
			}
		}

		logger.log('✅ [VK Validate] Token verified')

		// 3. Create Supabase admin client
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.SUPABASE_SERVICE_ROLE_KEY,
			{
				auth: {
					autoRefreshToken: false,
					persistSession: false
				}
			}
		)

		// 4. Find or create user (OPTIMIZED: direct query instead of listing all users)
		const providerPrefix = provider || 'vk'
		const providerId = `${providerPrefix}_${userId}`
		const fullName = `${firstName || ''} ${lastName || ''}`.trim() || providerId

		// Search user by email first (if provided)
		let existingUser = null
		if (email) {
			const { data: userByEmail } = await supabase.auth.admin.listUsers()
			existingUser = userByEmail?.users.find(u => u.email === email)
		}

		// If not found by email, search by provider metadata
		if (!existingUser) {
			const { data: allUsers } = await supabase.auth.admin.listUsers()
			existingUser = allUsers?.users.find(u =>
				u.user_metadata?.[`${providerPrefix}_id`] === userId.toString() ||
				u.user_metadata?.vkid_provider_id === providerId
			)
		}

		let supabaseUser
		let tempPassword = null

		if (existingUser) {
			// 5a. Update existing user
			tempPassword = Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16)

			const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
				existingUser.id,
				{
					password: tempPassword,
					user_metadata: {
						...existingUser.user_metadata,
						[`${providerPrefix}_id`]: userId.toString(),
						vkid_provider: provider,
						vkid_provider_id: providerId,
						avatar_url: avatar,
						full_name: fullName,
					}
				}
			)

			if (updateError) {
				logger.error('❌ Error updating user:', updateError)
			}

			supabaseUser = updatedUser?.user || existingUser

			// Update profile
			await supabase
				.from('users_profile')
				.upsert({
					id: supabaseUser.id,
					name: fullName,
					avatar_url: avatar,
					email: email || supabaseUser.email,
				})
				.eq('id', supabaseUser.id)

			logger.log('✅ [VK Validate] Existing user updated')

		} else {
			// 5b. Create new user
			tempPassword = Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16)

			const { data: newUserData, error: createError } = await supabase.auth.admin.createUser({
				email: email || `${providerId}@vkid-oauth.linguami.com`,
				password: tempPassword,
				email_confirm: true,
				user_metadata: {
					[`${providerPrefix}_id`]: userId.toString(),
					vkid_provider: provider,
					vkid_provider_id: providerId,
					full_name: fullName,
					avatar_url: avatar,
					provider: `vkid_${provider}`,
				}
			})

			if (createError) {
				logger.error('❌ Error creating user:', createError)
				return {
					success: false,
					error: 'Failed to create user',
				}
			}

			supabaseUser = newUserData.user

			// Create profile
			await supabase
				.from('users_profile')
				.upsert({
					id: supabaseUser.id,
					name: fullName,
					email: email || null,
					avatar_url: avatar,
					learning_language: 'fr', // Default for Russian users
				})
				.eq('id', supabaseUser.id)

			logger.log('✅ [VK Validate] New user created')
		}

		// 6. Create Supabase session
		const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
			email: supabaseUser.email,
			password: tempPassword,
		})

		if (signInError || !signInData?.session) {
			logger.error('❌ Error creating session:', signInError)
			return {
				success: false,
				error: 'Failed to create session',
			}
		}

		logger.log('✅ [VK Validate] Session created successfully')

		return {
			success: true,
			access_token: signInData.session.access_token,
			refresh_token: signInData.session.refresh_token,
			userId: supabaseUser.id,
			user: {
				id: supabaseUser.id,
				email: supabaseUser.email,
				name: fullName,
			}
		}

	} catch (error) {
		logger.error('❌ Error in validateVkAuth:', error)
		return {
			success: false,
			error: error.message || 'Internal server error',
		}
	}
}
