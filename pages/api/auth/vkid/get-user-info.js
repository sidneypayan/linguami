// /pages/api/auth/vkid/get-user-info.js
// Get VK ID user info using access token (server-side to avoid CORS)

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const { accessToken } = req.body

		console.log('🔍 [VK User Info] Fetching user info from VK API...')

		if (!accessToken) {
			console.error('❌ Missing accessToken')
			return res.status(400).json({ error: 'Missing accessToken' })
		}

		// Get user info using the access token
		const userInfoResponse = await fetch('https://id.vk.com/oauth2/user_info', {
			headers: {
				'Authorization': `Bearer ${accessToken}`,
			},
		})

		console.log('📡 [VK User Info] Response status:', userInfoResponse.status)

		if (!userInfoResponse.ok) {
			const errorText = await userInfoResponse.text()
			console.error('❌ Failed to get user info:', userInfoResponse.status)
			console.error('Error response:', errorText)
			return res.status(401).json({ error: 'Failed to get user info', details: errorText })
		}

		const userData = await userInfoResponse.json()

		console.log('✅ [VK User Info] User info received')
		console.log('Raw response:', JSON.stringify(userData, null, 2))
		console.log('User ID:', userData.user_id)
		console.log('Name:', userData.first_name, userData.last_name)
		console.log('Email:', userData.email || '(none)')

		// Return the user data (VK API returns user data at root level)
		return res.status(200).json({
			success: true,
			user: userData,
		})

	} catch (error) {
		console.error('❌ Error fetching VK ID user info:', error)
		console.error('Error name:', error.name)
		console.error('Error message:', error.message)
		console.error('Error stack:', error.stack)
		return res.status(500).json({ error: 'Internal server error', details: error.message })
	}
}
