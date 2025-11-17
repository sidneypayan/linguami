import { logger } from '@/utils/logger'

// /pages/api/auth/vkid/exchange-code.js
// Exchange VK ID authorization code for access token

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const { code, deviceId, redirectUri } = req.body

		logger.log('🔄 [VK Exchange] Received request')
		logger.log('Code (first 10 chars):', code ? code.substring(0, 10) + '...' : 'undefined')
		logger.log('Device ID (first 10 chars):', deviceId ? deviceId.substring(0, 10) + '...' : 'undefined')
		logger.log('Redirect URI:', redirectUri)

		if (!code || !deviceId) {
			logger.error('❌ Missing code or deviceId')
			return res.status(400).json({ error: 'Missing code or deviceId' })
		}

		const appId = process.env.NEXT_PUBLIC_VK_APP_ID
		const clientSecret = process.env.VK_CLIENT_SECRET

		if (!appId || !clientSecret) {
			logger.error('❌ Missing VK_APP_ID or VK_CLIENT_SECRET')
			logger.error('VK_APP_ID:', appId ? 'defined' : 'undefined')
			logger.error('VK_CLIENT_SECRET:', clientSecret ? 'defined' : 'undefined')
			return res.status(500).json({ error: 'Server configuration error' })
		}

		const finalRedirectUri = redirectUri || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`

		logger.log('🔧 [VK Exchange] Exchange parameters:')
		logger.log('App ID:', appId)
		logger.log('Redirect URI:', finalRedirectUri)
		logger.log('Using device_id as code_verifier:', deviceId ? deviceId.substring(0, 10) + '...' : 'undefined')

		// Exchange code for access token using VK ID OAuth2 API
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
			logger.error('❌ VK ID token exchange failed:', tokenResponse.status)
			logger.error('Error response:', errorText)
			return res.status(401).json({ error: 'Failed to exchange code for token', details: errorText })
		}

		const tokenData = await tokenResponse.json()

		logger.log('✅ [VK Exchange] Received token data')
		logger.log('Has access_token:', !!tokenData.access_token)
		logger.log('Has refresh_token:', !!tokenData.refresh_token)

		if (!tokenData.access_token) {
			logger.error('❌ No access token in response:', tokenData)
			return res.status(401).json({ error: 'No access token received' })
		}

		// Get user info using the access token
		// VK ID API requires client_id as query parameter
		logger.log('🔍 [VK Exchange] Fetching user info...')
		const userInfoUrl = `https://id.vk.com/oauth2/user_info?client_id=${appId}`

		logger.log('🔧 [VK Exchange] Fetching from:', userInfoUrl)

		const userInfoResponse = await fetch(userInfoUrl, {
			headers: {
				'Authorization': `Bearer ${tokenData.access_token}`,
			},
		})

		logger.log('📡 [VK Exchange] User info response status:', userInfoResponse.status)

		if (!userInfoResponse.ok) {
			const errorText = await userInfoResponse.text()
			logger.error('❌ Failed to get user info:', userInfoResponse.status)
			logger.error('Error response:', errorText)
			return res.status(401).json({ error: 'Failed to get user info', details: errorText })
		}

		const userData = await userInfoResponse.json()

		logger.log('✅ [VK Exchange] User info received:')
		logger.log('Raw response:', JSON.stringify(userData, null, 2))
		logger.log('User ID:', userData.user_id)
		logger.log('Name:', userData.first_name, userData.last_name)
		logger.log('Email:', userData.email || '(none)')

		// Return the token and user data (VK API returns user data at root level)
		return res.status(200).json({
			success: true,
			access_token: tokenData.access_token,
			user: userData,
		})

	} catch (error) {
		logger.error('❌ Error in VK ID code exchange:', error)
		logger.error('Error name:', error.name)
		logger.error('Error message:', error.message)
		logger.error('Error stack:', error.stack)
		return res.status(500).json({ error: 'Internal server error', details: error.message })
	}
}
