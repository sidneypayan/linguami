// Debug script to see the full HTML of an embed page

const videoId = 'Js11a9BuAe8'
const embedUrl = `https://www.youtube.com/embed/${videoId}`

console.log(`🔍 Fetching embed page: ${embedUrl}\n`)

try {
	const response = await fetch(embedUrl, {
		method: 'GET',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		},
	})

	console.log(`Status: ${response.status} ${response.statusText}\n`)

	if (!response.ok) {
		console.log('❌ Response not OK')
		process.exit(1)
	}

	const html = await response.text()
	console.log(`📄 HTML length: ${html.length} characters\n`)

	// Search for specific patterns
	const patterns = [
		'playback on other websites has been disabled',
		'Video unavailable',
		'This video is unavailable',
		'errorScreen',
		'player-unavailable',
		'"status":"ERROR"',
		'"status":"UNPLAYABLE"',
		'"isEmbeddingAllowed"',
		'playabilityStatus',
		'errorMessage',
		'CONTENT_NOT_AVAILABLE',
		'LOGIN_REQUIRED',
	]

	console.log('🔍 Searching for key patterns:\n')
	for (const pattern of patterns) {
		if (html.includes(pattern)) {
			console.log(`✅ Found: "${pattern}"`)

			// Show context around the pattern
			const index = html.indexOf(pattern)
			const start = Math.max(0, index - 200)
			const end = Math.min(html.length, index + 200)
			const context = html.substring(start, end)
			console.log(`   Context: ...${context}...\n`)
		}
	}

	// Try to extract playabilityStatus
	const playabilityMatch = html.match(/"playabilityStatus":\s*\{[^}]*"status":"([^"]+)"/)
	if (playabilityMatch) {
		console.log(`\n📊 Playability status: ${playabilityMatch[1]}`)
	} else {
		console.log('\n⚠️  No playabilityStatus found in expected format')

		// Search for any playabilityStatus mention
		const anyPlayability = html.match(/"playabilityStatus"[^{]*\{[^}]+\}/g)
		if (anyPlayability) {
			console.log('\nFound playabilityStatus sections:')
			anyPlayability.forEach((match, i) => {
				console.log(`\n${i + 1}. ${match}`)
			})
		}
	}

	// Search for any error or embedding related content
	console.log('\n\n🔍 Searching for "embed" or "error" related content:\n')
	const embedErrorRegex = /[^"]*embed[^"]*|[^"]*error[^"]*/gi
	const matches = html.match(embedErrorRegex)
	if (matches && matches.length > 0) {
		const uniqueMatches = [...new Set(matches.slice(0, 20))]
		uniqueMatches.forEach(match => {
			if (match.length > 10 && match.length < 200) {
				console.log(`- ${match}`)
			}
		})
	}

	// Save the full HTML to a file for inspection
	const fs = await import('fs')
	fs.writeFileSync('D:/linguami/temp-embed-html.txt', html, 'utf8')
	console.log('\n\n💾 Full HTML saved to: D:/linguami/temp-embed-html.txt')

} catch (error) {
	console.error(`❌ Error: ${error.message}`)
	process.exit(1)
}
