// Test an embedding disabled video to see English error messages

// This video has embedding disabled: https://www.youtube.com/watch?v=OPf0YbXqDm0
const videoId = 'OPf0YbXqDm0'
const embedUrl = `https://www.youtube.com/embed/${videoId}`

console.log(`🔍 Testing video with embedding disabled: ${embedUrl}\n`)

try {
	const response = await fetch(embedUrl, {
		method: 'GET',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		},
	})

	console.log(`Status: ${response.status}\n`)

	const html = await response.text()

	// Search for error patterns
	const errorPatterns = [
		'previewPlayabilityStatus',
		'Error 153',
		'Erreur 153',
		'PLAYABILITY_ERROR',
		'playback on other websites has been disabled',
		'errorScreen',
	]

	console.log('Found patterns:\n')
	for (const pattern of errorPatterns) {
		if (html.includes(pattern)) {
			console.log(`✅ "${pattern}"`)

			// Show context
			const index = html.indexOf(pattern)
			const start = Math.max(0, index - 100)
			const end = Math.min(html.length, index + 300)
			const context = html.substring(start, end)
			console.log(`   ${context.replace(/\n/g, ' ')}\n`)
		} else {
			console.log(`❌ "${pattern}" not found\n`)
		}
	}

} catch (error) {
	console.error(`❌ Error: ${error.message}`)
}
