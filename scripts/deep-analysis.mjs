// Analyse approfondie pour trouver la vraie différence

const videos = [
	{ id: 'Js11a9BuAe8', name: 'Embedding désactivé (confirmé)' },
	{ id: '_mLAFrU9-VA', name: 'À vérifier' },
]

for (const video of videos) {
	console.log(`\n${'='.repeat(80)}`)
	console.log(`🔍 Video ID: ${video.id} (${video.name})`)
	console.log('='.repeat(80))

	try {
		const response = await fetch(`https://www.youtube.com/embed/${video.id}`, {
			method: 'GET',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
			},
		})

		const html = await response.text()

		// 1. Check for actual player initialization
		console.log('\n1️⃣ Player Initialization:')
		const hasPlayer = html.includes('var ytInitialPlayerResponse')
		const hasPlayerConfig = html.includes('ytplayer.config')
		console.log(`   ytInitialPlayerResponse: ${hasPlayer}`)
		console.log(`   ytplayer.config: ${hasPlayerConfig}`)

		// 2. Check playabilityStatus (not preview)
		console.log('\n2️⃣ playabilityStatus (actual, not preview):')
		const playabilityMatch = html.match(/var ytInitialPlayerResponse[^{]*=\s*({.*?});/s)
		if (playabilityMatch) {
			try {
				const playerResponse = JSON.parse(playabilityMatch[1])
				if (playerResponse.playabilityStatus) {
					console.log(`   Status: ${playerResponse.playabilityStatus.status}`)
					if (playerResponse.playabilityStatus.reason) {
						console.log(`   Reason: ${playerResponse.playabilityStatus.reason}`)
					}
					if (playerResponse.playabilityStatus.errorScreen) {
						console.log(`   ❌ Has errorScreen (video is broken)`)
					}
				}
			} catch (e) {
				console.log(`   ⚠️  Could not parse: ${e.message}`)
			}
		} else {
			console.log('   ❌ ytInitialPlayerResponse not found')
		}

		// 3. Check for video stream
		console.log('\n3️⃣ Video Stream:')
		const hasStreamingData = html.includes('"streamingData"')
		const hasFormats = html.includes('"formats"')
		console.log(`   streamingData: ${hasStreamingData}`)
		console.log(`   formats: ${hasFormats}`)

		// 4. Check errorScreen in main player (not preview)
		console.log('\n4️⃣ Error Detection:')
		// We need to distinguish between:
		// - previewPlayabilityStatus (always present, contains error definitions)
		// - playabilityStatus in ytInitialPlayerResponse (actual status)

		// Search for the actual player response errorScreen
		const playerErrorMatch = html.match(/ytInitialPlayerResponse[^{]*=\s*\{[^}]*playabilityStatus[^}]*errorScreen/)
		const hasPlayerError = playerErrorMatch !== null

		console.log(`   errorScreen in ytInitialPlayerResponse: ${hasPlayerError}`)
		console.log(`   previewPlayabilityStatus (always present): true`)

		// 5. Final determination
		console.log('\n🎯 Analysis:')
		if (hasPlayerError) {
			console.log('   ❌ Video is BROKEN (errorScreen in actual player)')
		} else if (hasStreamingData && hasFormats) {
			console.log('   ✅ Video is WORKING (has streaming data)')
		} else {
			console.log('   ⚠️  Unclear status')
		}

	} catch (error) {
		console.error(`❌ Error: ${error.message}`)
	}
}
