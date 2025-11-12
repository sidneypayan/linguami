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
		// VK ID API requires client_id as query parameter
		const clientId = process.env.NEXT_PUBLIC_VK_APP_ID
		const userInfoUrl = `https://id.vk.com/oauth2/user_info?client_id=${clientId}`

		console.log('🔧 [VK Validate] Fetching from:', userInfoUrl)

		const verifyResponse = await fetch(userInfoUrl, {
			headers: {
				'Authorization': `Bearer ${token}`,
			}
		})

		if (!verifyResponse.ok) {
			console.error('VK ID token verification failed')
			return res.status(401).json({ error: 'Invalid token' })
		}

		const vkUserData = await verifyResponse.json()

		console.log('✅ [VK Validate] VK user data received:')
		console.log('Raw response:', JSON.stringify(vkUserData, null, 2))

		// Extract user data from response (VK API returns data in 'user' object)
		const vkUser = vkUserData.user || vkUserData

		console.log('Extracted user_id:', vkUser.user_id)
		console.log('Expected user_id:', userId.toString())

		// Validate that the user ID matches
		if (vkUser.user_id !== userId.toString()) {
			console.error('User ID mismatch')
			console.error('Expected:', userId.toString())
			console.error('Received:', vkUser.user_id)
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
		const fullName = `${firstName || ''} ${lastName || ''}`.trim() || providerId

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
		let tempPassword = null

		if (existingUser) {
			// User exists - generate new temporary password and update
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
				console.error('Error updating user metadata:', updateError)
			}

			supabaseUser = updatedUser?.user || existingUser

			// Update user profile with latest info from VK
			const { error: profileUpdateError } = await supabase
				.from('users_profile')
				.upsert({
					id: supabaseUser.id,
					name: fullName,
					avatar_url: avatar,
					email: email || supabaseUser.email,
				})
				.eq('id', supabaseUser.id)

			if (profileUpdateError) {
				console.error('Error updating user profile:', profileUpdateError)
			}
		} else {
			// Create new user
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
				console.error('Error creating user:', createError)
				return res.status(500).json({ error: 'Failed to create user' })
			}

			supabaseUser = newUserData.user

			// Create user profile in users_profile table
			const { error: profileError } = await supabase
				.from('users_profile')
				.upsert({
					id: supabaseUser.id,
					name: fullName,
					email: email || null,
					avatar_url: avatar,
					learning_language: 'fr', // Default learning language for Russian users
				})
				.eq('id', supabaseUser.id)

			if (profileError) {
				console.error('Error creating user profile:', profileError)
			}
		}

		// Step 2: Sign in with password to get a real session with tokens
		console.log('🔑 Creating session for user:', supabaseUser.email)
		const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
			email: supabaseUser.email,
			password: tempPassword,
		})

		if (signInError || !signInData?.session) {
			console.error('❌ Error signing in user:', signInError)
			return res.status(500).json({ error: 'Failed to create session' })
		}

		console.log('✅ Session created successfully')
		console.log('Access token present:', !!signInData.session.access_token)
		console.log('Refresh token present:', !!signInData.session.refresh_token)

		const accessToken = signInData.session.access_token
		const refreshToken = signInData.session.refresh_token

		// Return tokens to client
		return res.status(200).json({
			success: true,
			access_token: accessToken,
			refresh_token: refreshToken,
			userId: supabaseUser.id,
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
