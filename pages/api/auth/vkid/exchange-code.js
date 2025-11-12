// /pages/api/auth/vkid/exchange-code.js
// Exchange VK ID authorization code for access token

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const { code, deviceId, redirectUri } = req.body

		console.log('🔄 [VK Exchange] Received request')
		console.log('Code (first 10 chars):', code ? code.substring(0, 10) + '...' : 'undefined')
		console.log('Device ID (first 10 chars):', deviceId ? deviceId.substring(0, 10) + '...' : 'undefined')
		console.log('Redirect URI:', redirectUri)

		if (!code || !deviceId) {
			console.error('❌ Missing code or deviceId')
			return res.status(400).json({ error: 'Missing code or deviceId' })
		}

		const appId = process.env.NEXT_PUBLIC_VK_APP_ID
		const clientSecret = process.env.VK_CLIENT_SECRET

		if (!appId || !clientSecret) {
			console.error('❌ Missing VK_APP_ID or VK_CLIENT_SECRET')
			console.error('VK_APP_ID:', appId ? 'defined' : 'undefined')
			console.error('VK_CLIENT_SECRET:', clientSecret ? 'defined' : 'undefined')
			return res.status(500).json({ error: 'Server configuration error' })
		}

		const finalRedirectUri = redirectUri || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`

		console.log('🔧 [VK Exchange] Exchange parameters:')
		console.log('App ID:', appId)
		console.log('Redirect URI:', finalRedirectUri)
		console.log('Using device_id as code_verifier:', deviceId ? deviceId.substring(0, 10) + '...' : 'undefined')

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

		console.log('📡 [VK Exchange] VK API response status:', tokenResponse.status)

		if (!tokenResponse.ok) {
			const errorText = await tokenResponse.text()
			console.error('❌ VK ID token exchange failed:', tokenResponse.status)
			console.error('Error response:', errorText)
			return res.status(401).json({ error: 'Failed to exchange code for token', details: errorText })
		}

		const tokenData = await tokenResponse.json()

		console.log('✅ [VK Exchange] Received token data')
		console.log('Has access_token:', !!tokenData.access_token)
		console.log('Has refresh_token:', !!tokenData.refresh_token)

		if (!tokenData.access_token) {
			console.error('❌ No access token in response:', tokenData)
			return res.status(401).json({ error: 'No access token received' })
		}

		// Get user info using the access token
		// VK ID API requires client_id as query parameter
		console.log('🔍 [VK Exchange] Fetching user info...')
		const userInfoUrl = `https://id.vk.com/oauth2/user_info?client_id=${appId}`

		console.log('🔧 [VK Exchange] Fetching from:', userInfoUrl)

		const userInfoResponse = await fetch(userInfoUrl, {
			headers: {
				'Authorization': `Bearer ${tokenData.access_token}`,
			},
		})

		console.log('📡 [VK Exchange] User info response status:', userInfoResponse.status)

		if (!userInfoResponse.ok) {
			const errorText = await userInfoResponse.text()
			console.error('❌ Failed to get user info:', userInfoResponse.status)
			console.error('Error response:', errorText)
			return res.status(401).json({ error: 'Failed to get user info', details: errorText })
		}

		const userData = await userInfoResponse.json()

		console.log('✅ [VK Exchange] User info received:')
		console.log('Raw response:', JSON.stringify(userData, null, 2))
		console.log('User ID:', userData.user_id)
		console.log('Name:', userData.first_name, userData.last_name)
		console.log('Email:', userData.email || '(none)')

		// Return the token and user data (VK API returns user data at root level)
		return res.status(200).json({
			success: true,
			access_token: tokenData.access_token,
			user: userData,
		})

	} catch (error) {
		console.error('❌ Error in VK ID code exchange:', error)
		console.error('Error name:', error.name)
		console.error('Error message:', error.message)
		console.error('Error stack:', error.stack)
		return res.status(500).json({ error: 'Internal server error', details: error.message })
	}
}
