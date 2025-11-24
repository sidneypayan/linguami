// Test avec une vidéo qui fonctionne vraiment en embed
// Utilisons une vidéo populaire dont on est sûr que l'embed fonctionne

import fs from 'fs'

const workingVideoId = 'dQw4w9WgXcQ' // Rick Astley - Never Gonna Give You Up (embed activé)

console.log(`🔍 Testing video with embedding ENABLED: ${workingVideoId}\n`)

try {
	const response = await fetch(`https://www.youtube.com/embed/${workingVideoId}`, {
		method: 'GET',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		},
	})

	const html = await response.text()

	// Check for the patterns we're testing
	console.log('Pattern checks:\n')

	const hasPreviewPlayability = html.includes('"previewPlayabilityStatus"')
	console.log(`previewPlayabilityStatus: ${hasPreviewPlayability}`)

	const hasPreviewError = html.includes('"previewPlayabilityStatus"') && html.includes('"status":"ERROR"')
	console.log(`previewPlayabilityStatus with ERROR: ${hasPreviewError}`)

	const hasErrorScreen = html.includes('errorScreen')
	console.log(`errorScreen: ${hasErrorScreen}`)

	const hasErreur153 = html.includes('Erreur 153') || html.includes('Error 153')
	console.log(`Erreur/Error 153: ${hasErreur153}`)

	// Check for positive indicators
	const hasStreamingData = html.includes('streamingData')
	console.log(`\nstreamingData: ${hasStreamingData}`)

	const hasVideoDetails = html.includes('videoDetails')
	console.log(`videoDetails: ${hasVideoDetails}`)

	// Save for comparison
	fs.writeFileSync('D:/linguami/temp-video-working.html', html)
	console.log('\n💾 Saved to: temp-video-working.html')

	console.log('\n🎯 Conclusion:')
	if (hasPreviewError) {
		console.log('   ❌ Would be detected as BROKEN with current logic')
	} else {
		console.log('   ✅ Would be detected as WORKING')
	}

} catch (error) {
	console.error(`❌ Error: ${error.message}`)
}
