/**
 * Test script to verify Turnstile configuration
 * Run with: node scripts/test-turnstile.js
 */

require('dotenv').config({ path: '.env.local' })

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY
const NEXT_PUBLIC_TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

console.log('🔍 Checking Turnstile configuration...\n')

// Check if keys are defined
if (!TURNSTILE_SECRET_KEY) {
	console.error('❌ TURNSTILE_SECRET_KEY is not defined in .env.local')
} else {
	console.log('✅ TURNSTILE_SECRET_KEY is defined')
	console.log(`   Key starts with: ${TURNSTILE_SECRET_KEY.substring(0, 10)}...`)
}

if (!NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
	console.error('❌ NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined in .env.local')
} else {
	console.log('✅ NEXT_PUBLIC_TURNSTILE_SITE_KEY is defined')
	console.log(`   Key starts with: ${NEXT_PUBLIC_TURNSTILE_SITE_KEY.substring(0, 10)}...`)
}

// Test with a dummy token to see the error
if (TURNSTILE_SECRET_KEY) {
	console.log('\n🧪 Testing Turnstile verification with dummy token...')

	fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			secret: TURNSTILE_SECRET_KEY,
			response: 'dummy-token-for-testing',
		}),
	})
		.then(res => res.json())
		.then(data => {
			console.log('\n📊 Cloudflare response:')
			console.log(JSON.stringify(data, null, 2))

			if (data['error-codes']) {
				console.log('\n⚠️  Error codes explanation:')
				data['error-codes'].forEach(code => {
					switch(code) {
						case 'missing-input-secret':
							console.log('  - missing-input-secret: The secret parameter is missing')
							break
						case 'invalid-input-secret':
							console.log('  - invalid-input-secret: The secret parameter is invalid or malformed')
							break
						case 'missing-input-response':
							console.log('  - missing-input-response: The response parameter (token) is missing')
							break
						case 'invalid-input-response':
							console.log('  - invalid-input-response: The response parameter (token) is invalid or malformed')
							break
						case 'bad-request':
							console.log('  - bad-request: The request is invalid or malformed')
							break
						case 'timeout-or-duplicate':
							console.log('  - timeout-or-duplicate: The response parameter has already been validated or has expired')
							break
						default:
							console.log(`  - ${code}: Unknown error code`)
					}
				})
			}

			console.log('\n💡 Recommendations:')
			console.log('1. Check your Cloudflare Turnstile dashboard: https://dash.cloudflare.com/?to=/:account/turnstile')
			console.log('2. Make sure "localhost" is in the list of allowed domains')
			console.log('3. Verify that the secret key matches the site key')
			console.log('4. For development, you can use test keys:')
			console.log('   - Site key: 1x00000000000000000000AA')
			console.log('   - Secret key: 1x0000000000000000000000000000000AA')
		})
		.catch(error => {
			console.error('\n❌ Error testing Turnstile:', error.message)
		})
}
