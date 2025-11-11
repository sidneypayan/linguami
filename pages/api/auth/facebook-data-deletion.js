import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

/**
 * Facebook Data Deletion Callback Endpoint
 *
 * This endpoint is called by Facebook when a user deletes their connection
 * to your app or requests data deletion. It's required for GDPR compliance.
 *
 * Facebook sends a POST request with a 'signed_request' parameter.
 *
 * Configure this URL in Facebook App Settings:
 * https://developers.facebook.com/apps/<APP_ID>/settings/basic/
 *
 * URL to provide: https://www.linguami.com/api/auth/facebook-data-deletion
 */

// Helper function to decode Facebook signed request
function parseSignedRequest(signedRequest, appSecret) {
	if (!signedRequest || !appSecret) {
		throw new Error('Missing signed_request or app_secret')
	}

	const [encodedSig, payload] = signedRequest.split('.')

	// Decode signature
	const sig = base64UrlDecode(encodedSig)

	// Decode payload
	const data = JSON.parse(base64UrlDecode(payload))

	// Verify signature using HMAC SHA-256
	const expectedSig = crypto
		.createHmac('sha256', appSecret)
		.update(payload)
		.digest()

	if (!sig.equals(expectedSig)) {
		throw new Error('Invalid signature')
	}

	return data
}

// Base64 URL decode helper
function base64UrlDecode(str) {
	// Convert base64url to base64
	let base64 = str.replace(/-/g, '+').replace(/_/g, '/')

	// Pad with '=' to make length multiple of 4
	while (base64.length % 4) {
		base64 += '='
	}

	return Buffer.from(base64, 'base64').toString('utf-8')
}

// Delete all user data from database
async function deleteUserData(supabase, userId) {
	// Delete in order (respecting foreign key constraints)

	// 1. Delete course progress
	await supabase
		.from('user_course_progress')
		.delete()
		.eq('user_id', userId)

	// 2. Delete course access
	await supabase
		.from('user_course_access')
		.delete()
		.eq('user_id', userId)

	// 3. Delete user cards
	await supabase
		.from('user_words_cards')
		.delete()
		.eq('user_id', userId)

	// 4. Delete user words
	await supabase
		.from('user_words')
		.delete()
		.eq('user_id', userId)

	// 5. Delete exercise progress
	await supabase
		.from('user_exercise_progress')
		.delete()
		.eq('user_id', userId)

	// 6. Delete user materials
	await supabase
		.from('user_materials')
		.delete()
		.eq('user_id', userId)

	// 7. Delete XP transactions
	await supabase
		.from('xp_transactions')
		.delete()
		.eq('user_id', userId)

	// 8. Delete achievements
	await supabase
		.from('user_achievements')
		.delete()
		.eq('user_id', userId)

	// 9. Delete goals
	await supabase
		.from('user_goals')
		.delete()
		.eq('user_id', userId)

	// 10. Delete XP profile
	await supabase
		.from('user_xp_profile')
		.delete()
		.eq('user_id', userId)

	// 11. Delete user profile
	await supabase
		.from('users_profile')
		.delete()
		.eq('id', userId)

	// 12. Delete auth user (requires service role)
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

	await supabaseAdmin.auth.admin.deleteUser(userId)
}

export default async function handler(req, res) {
	// Only accept POST requests
	if (req.method !== 'POST') {
		return res.status(405).json({
			error: 'Method not allowed',
			message: 'This endpoint only accepts POST requests from Facebook'
		})
	}

	try {
		// Get signed_request from POST body or query params
		const signedRequest = req.body.signed_request || req.query.signed_request

		if (!signedRequest) {
			return res.status(400).json({
				error: 'Missing signed_request parameter',
				message: 'Facebook should send a signed_request parameter'
			})
		}

		// Get Facebook App Secret from environment
		const fbAppSecret = process.env.FACEBOOK_APP_SECRET

		if (!fbAppSecret) {
			console.error('FACEBOOK_APP_SECRET not configured in environment variables')
			return res.status(500).json({
				error: 'Configuration error',
				message: 'Facebook App Secret not configured'
			})
		}

		// Parse and verify the signed request
		let data
		try {
			data = parseSignedRequest(signedRequest, fbAppSecret)
		} catch (error) {
			console.error('Failed to parse signed_request:', error)
			return res.status(400).json({
				error: 'Invalid signed_request',
				message: error.message
			})
		}

		// Extract Facebook user ID
		const facebookUserId = data.user_id

		if (!facebookUserId) {
			return res.status(400).json({
				error: 'Missing user_id in signed_request'
			})
		}

		console.log(`Facebook data deletion request for user: ${facebookUserId}`)

		// Create Supabase client with service role (bypasses RLS)
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

		// Find user by Facebook ID
		// Facebook ID is stored in auth.users.raw_user_meta_data or as provider_id
		const { data: authUsers, error: findError } = await supabase.auth.admin.listUsers()

		if (findError) {
			throw findError
		}

		// Find user with matching Facebook provider ID
		const user = authUsers.users.find(u => {
			// Check if user has Facebook as provider
			const hasFacebookProvider = u.identities?.some(
				identity => identity.provider === 'facebook' && identity.id === facebookUserId
			)
			return hasFacebookProvider
		})

		if (!user) {
			// User not found - already deleted or never existed
			console.log(`User with Facebook ID ${facebookUserId} not found (already deleted or never existed)`)

			// Still return success to Facebook
			return res.status(200).json({
				url: `https://www.linguami.com/data-deletion-status?id=${facebookUserId}`,
				confirmation_code: `${facebookUserId}_${Date.now()}`
			})
		}

		console.log(`Found user ${user.id} with Facebook ID ${facebookUserId}, deleting data...`)

		// Delete all user data
		await deleteUserData(supabase, user.id)

		console.log(`Successfully deleted all data for user ${user.id}`)

		// Return confirmation to Facebook
		// Facebook expects either:
		// 1. A URL where users can check deletion status
		// 2. A confirmation_code
		return res.status(200).json({
			url: `https://www.linguami.com/data-deletion-status?id=${facebookUserId}`,
			confirmation_code: `${facebookUserId}_${Date.now()}`
		})

	} catch (error) {
		console.error('Error handling Facebook data deletion:', error)

		// Still return 200 to Facebook to avoid retries
		// But log the error for investigation
		return res.status(200).json({
			url: 'https://www.linguami.com/data-deletion-error',
			confirmation_code: `error_${Date.now()}`,
			error: error.message
		})
	}
}
