// /pages/api/auth/vkid/validate.js
// Validate VK ID token and create/login user in Supabase

import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const { token, firstName, lastName, avatar, email, userId, provider } = req.body

		if (!token || !userId) {
			return res.status(400).json({ error: 'Missing required fields' })
		}

		// Verify token with VK ID API
		const verifyResponse = await fetch('https://id.vk.com/oauth2/user_info', {
			headers: {
				'Authorization': `Bearer ${token}`,
			}
		})

		if (!verifyResponse.ok) {
			console.error('VK ID token verification failed')
			return res.status(401).json({ error: 'Invalid token' })
		}

		const vkUserData = await verifyResponse.json()

		// Validate that the user ID matches
		if (vkUserData.user.user_id !== userId.toString()) {
			console.error('User ID mismatch')
			return res.status(401).json({ error: 'User ID mismatch' })
		}

		// Step 1: Create or login user in Supabase
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.SUPABASE_SERVICE_ROLE_KEY
		)

		// Determine provider-specific fields
		const providerPrefix = provider || 'vk' // vk, ok, or mail
		const providerId = `${providerPrefix}_${userId}`
		const fullName = `${firstName || ''} ${lastName || ''}`.trim()
		const username = providerId

		// Check if user already exists with this provider ID
		const { data: existingUsers } = await supabase.auth.admin.listUsers()
		let existingUser = existingUsers?.users.find(u =>
			u.user_metadata?.[`${providerPrefix}_id`] === userId.toString() ||
			u.user_metadata?.vkid_provider_id === providerId
		)

		// If no user found by provider ID, check by email (if email is provided)
		if (!existingUser && email) {
			existingUser = existingUsers?.users.find(u => u.email === email)
		}

		let supabaseUser

		if (existingUser) {
			// User exists - update metadata
			const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
				existingUser.id,
				{
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
				console.error('Error updating user metadata:', updateError)
			}

			supabaseUser = updatedUser?.user || existingUser
		} else {
			// Create new user
			const randomPassword = Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16)

			const { data: newUserData, error: createError } = await supabase.auth.admin.createUser({
				email: email || `${providerId}@vkid-oauth.linguami.com`,
				password: randomPassword,
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
				console.error('Error creating user:', createError)
				return res.status(500).json({ error: 'Failed to create user' })
			}

			supabaseUser = newUserData.user

			// Create user profile in users_profile table
			const { error: profileError } = await supabase
				.from('users_profile')
				.upsert({
					id: supabaseUser.id,
					name: username,
					email: email || null,
					avatar_url: avatar,
					learning_language: 'fr', // Default learning language for Russian users
				})
				.eq('id', supabaseUser.id)

			if (profileError) {
				console.error('Error creating user profile:', profileError)
			}
		}

		// Step 2: Generate Supabase session token
		const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
			type: 'magiclink',
			email: supabaseUser.email,
			options: {
				redirectTo: process.env.NEXT_PUBLIC_API_URL || 'https://www.linguami.com'
			}
		})

		if (sessionError || !sessionData) {
			console.error('Error generating session:', sessionError)
			return res.status(500).json({ error: 'Failed to generate session' })
		}

		// Extract the tokens from the magic link
		const magicLinkUrl = new URL(sessionData.properties.action_link)
		const accessToken = magicLinkUrl.searchParams.get('access_token')
		const refreshToken = magicLinkUrl.searchParams.get('refresh_token')

		if (!accessToken || !refreshToken) {
			console.error('Failed to extract tokens from magic link')
			return res.status(500).json({ error: 'Failed to extract tokens' })
		}

		// Return tokens to client
		return res.status(200).json({
			success: true,
			access_token: accessToken,
			refresh_token: refreshToken,
			user: {
				id: supabaseUser.id,
				email: supabaseUser.email,
				name: fullName,
			}
		})

	} catch (error) {
		console.error('Error in VK ID validation:', error)
		return res.status(500).json({ error: 'Internal server error' })
	}
}
