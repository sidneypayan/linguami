// /pages/api/auth/vkid/exchange-code.js
// Exchange VK ID authorization code for access token

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const { code, deviceId, redirectUri } = req.body

		if (!code || !deviceId) {
			return res.status(400).json({ error: 'Missing code or deviceId' })
		}

		const appId = process.env.NEXT_PUBLIC_VK_APP_ID
		const clientSecret = process.env.VK_CLIENT_SECRET

		if (!appId || !clientSecret) {
			console.error('Missing VK_APP_ID or VK_CLIENT_SECRET')
			return res.status(500).json({ error: 'Server configuration error' })
		}

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
				client_id: appId,
				device_id: deviceId,
				redirect_uri: redirectUri || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
			}),
		})

		if (!tokenResponse.ok) {
			const errorText = await tokenResponse.text()
			console.error('VK ID token exchange failed:', tokenResponse.status, errorText)
			return res.status(401).json({ error: 'Failed to exchange code for token' })
		}

		const tokenData = await tokenResponse.json()

		if (!tokenData.access_token) {
			console.error('No access token in response:', tokenData)
			return res.status(401).json({ error: 'No access token received' })
		}

		// Get user info using the access token
		const userInfoResponse = await fetch('https://id.vk.com/oauth2/user_info', {
			headers: {
				'Authorization': `Bearer ${tokenData.access_token}`,
			},
		})

		if (!userInfoResponse.ok) {
			console.error('Failed to get user info')
			return res.status(401).json({ error: 'Failed to get user info' })
		}

		const userData = await userInfoResponse.json()

		// Return the token and user data
		return res.status(200).json({
			success: true,
			access_token: tokenData.access_token,
			user: userData.user,
		})

	} catch (error) {
		console.error('Error in VK ID code exchange:', error)
		return res.status(500).json({ error: 'Internal server error' })
	}
}
