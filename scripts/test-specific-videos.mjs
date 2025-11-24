// Test the actual YouTube video availability

function extractYouTubeId(url) {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#\s]+)/,
		/youtube\.com\/watch\?.*v=([^&\n?#\s]+)/,
	]

	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match && match[1]) return match[1]
	}

	return null
}

async function checkYouTubeVideo(url, materialId) {
	console.log(`\n${'='.repeat(80)}`)
	console.log(`🔍 Material ${materialId}: ${url}`)
	console.log(`   (trimmed: "${url.trim()}")`)
	
	const videoId = extractYouTubeId(url.trim())
	console.log(`📌 Video ID: ${videoId}`)
	
	if (!videoId) {
		console.log('❌ Could not extract video ID')
		return 'broken'
	}
	
	// Method 1: oEmbed API
	console.log('\n--- Method 1: oEmbed API ---')
	try {
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 5000)
		
		const oembedResponse = await fetch(
			`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
			{ method: 'GET', signal: controller.signal }
		)
		
		clearTimeout(timeoutId)
		
		console.log(`Status: ${oembedResponse.status} ${oembedResponse.statusText}`)
		
		if (!oembedResponse.ok) {
			console.log('❌ oEmbed API says: BROKEN')
			return 'broken'
		}
		
		const data = await oembedResponse.json()
		console.log(`✅ oEmbed OK - Title: "${data.title}"`)
	} catch (error) {
		console.log(`❌ oEmbed error: ${error.message}`)
		return 'broken'
	}
	
	// Method 2: Embed page check
	console.log('\n--- Method 2: Embed Page ---')
	try {
		const embedController = new AbortController()
		const embedTimeoutId = setTimeout(() => embedController.abort(), 10000)
		
		const embedResponse = await fetch(
			`https://www.youtube.com/embed/${videoId}`,
			{
				method: 'GET',
				signal: embedController.signal,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
				},
			}
		)
		
		clearTimeout(embedTimeoutId)
		
		console.log(`Status: ${embedResponse.status}`)
		
		if (!embedResponse.ok) {
			console.log('❌ Embed page not OK')
			return 'broken'
		}
		
		const html = await embedResponse.text()
		
		// Check for various error indicators
		const checks = [
			{ pattern: 'playback on other websites has been disabled', name: 'Embedding disabled' },
			{ pattern: 'Video unavailable', name: 'Video unavailable' },
			{ pattern: 'This video is unavailable', name: 'Video unavailable 2' },
			{ pattern: 'This video isn\'t available', name: 'Not available' },
			{ pattern: 'This video has been removed', name: 'Removed' },
			{ pattern: 'Private video', name: 'Private' },
			{ pattern: 'has been blocked', name: 'Blocked' },
			{ pattern: '"status":"ERROR"', name: 'Status ERROR' },
			{ pattern: '"status":"UNPLAYABLE"', name: 'Status UNPLAYABLE' },
			{ pattern: '"status":"LOGIN_REQUIRED"', name: 'Login required' },
		]
		
		let foundError = false
		for (const check of checks) {
			if (html.includes(check.pattern)) {
				console.log(`🚫 Found: ${check.name}`)
				foundError = true
			}
		}
		
		if (foundError) {
			return 'broken'
		}
		
		// Try to extract playabilityStatus
		const playabilityMatch = html.match(/"playabilityStatus":\s*\{[^}]*"status":"([^"]+)"/)
		if (playabilityMatch) {
			console.log(`📊 Playability status: ${playabilityMatch[1]}`)
			if (['ERROR', 'UNPLAYABLE', 'LOGIN_REQUIRED', 'CONTENT_CHECK_REQUIRED'].includes(playabilityMatch[1])) {
				console.log('❌ Bad playability status')
				return 'broken'
			}
		}
		
		console.log('✅ Embed page looks OK')
		return 'working'
		
	} catch (error) {
		console.log(`❌ Embed error: ${error.message}`)
		return 'broken'
	}
}

// Test both videos
const videos = [
	{ id: 232, url: 'https://www.youtube.com/embed/Js11a9BuAe8 ' },
	{ id: 352, url: 'https://www.youtube.com/watch?v=_mLAFrU9-VA' }
]

for (const video of videos) {
	const result = await checkYouTubeVideo(video.url, video.id)
	console.log(`\n🎯 FINAL RESULT: ${result.toUpperCase()}`)
}
