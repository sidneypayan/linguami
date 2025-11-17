import { logger } from '@/utils/logger'

// /pages/api/auth/vkid/get-user-info.js
// Get VK ID user info using access token (server-side to avoid CORS)

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const { accessToken } = req.body

		logger.log('🔍 [VK User Info] Fetching user info from VK API...')

		if (!accessToken) {
			logger.error('❌ Missing accessToken')
			return res.status(400).json({ error: 'Missing accessToken' })
		}

		// Get user info using the access token
		// VK ID API requires client_id as query parameter
		const clientId = process.env.NEXT_PUBLIC_VK_APP_ID
		const userInfoUrl = `https://id.vk.com/oauth2/user_info?client_id=${clientId}`

		logger.log('🔧 [VK User Info] Fetching from:', userInfoUrl)

		const userInfoResponse = await fetch(userInfoUrl, {
			headers: {
				'Authorization': `Bearer ${accessToken}`,
			},
		})

		logger.log('📡 [VK User Info] Response status:', userInfoResponse.status)

		if (!userInfoResponse.ok) {
			const errorText = await userInfoResponse.text()
			logger.error('❌ Failed to get user info:', userInfoResponse.status)
			logger.error('Error response:', errorText)
			return res.status(401).json({ error: 'Failed to get user info', details: errorText })
		}

		const userData = await userInfoResponse.json()

		logger.log('✅ [VK User Info] User info received')
		logger.log('Raw response:', JSON.stringify(userData, null, 2))

		// Extract user data from response
		// VK API returns data in 'user' object
		const userInfo = userData.user || userData

		logger.log('User ID:', userInfo.user_id)
		logger.log('Name:', userInfo.first_name, userInfo.last_name)
		logger.log('Email:', userInfo.email || '(none)')

		// Return the user data directly (without extra wrapping)
		return res.status(200).json({
			success: true,
			user: userInfo,
		})

	} catch (error) {
		logger.error('❌ Error fetching VK ID user info:', error)
		logger.error('Error name:', error.name)
		logger.error('Error message:', error.message)
		logger.error('Error stack:', error.stack)
		return res.status(500).json({ error: 'Internal server error', details: error.message })
	}
}
