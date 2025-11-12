// /pages/api/verify-turnstile.js
// Verify Cloudflare Turnstile token server-side

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const { token } = req.body

		if (!token) {
			return res.status(400).json({
				success: false,
				error: 'Missing Turnstile token'
			})
		}

		const secretKey = process.env.TURNSTILE_SECRET_KEY

		if (!secretKey) {
			console.error('❌ TURNSTILE_SECRET_KEY is not defined in environment variables')
			return res.status(500).json({
				success: false,
				error: 'Turnstile is not configured properly'
			})
		}

		// Verify token with Cloudflare Turnstile API
		console.log('🔐 Verifying Turnstile token...')

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

		console.log('Turnstile verification response:', verifyData)

		if (!verifyData.success) {
			console.error('❌ Turnstile verification failed:', verifyData['error-codes'])
			return res.status(400).json({
				success: false,
				error: 'Turnstile verification failed',
				errorCodes: verifyData['error-codes'],
			})
		}

		console.log('✅ Turnstile verification successful')

		return res.status(200).json({
			success: true,
			message: 'Verification successful',
		})

	} catch (error) {
		console.error('❌ Error verifying Turnstile token:', error)
		return res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
