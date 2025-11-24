// Trouver les vraies différences entre les deux vidéos

const videos = [
	{ id: 'Js11a9BuAe8', name: 'Embedding désactivé' },
	{ id: '_mLAFrU9-VA', name: 'Devrait fonctionner' },
]

const htmls = []

// Fetch both
for (const video of videos) {
	const response = await fetch(`https://www.youtube.com/embed/${video.id}`, {
		method: 'GET',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		},
	})
	const html = await response.text()
	htmls.push({ ...video, html })
}

console.log('📊 Comparing HTML content...\n')

// Compare patterns
const patterns = [
	'player-unavailable',
	'errorScreen',
	'"status":"ERROR"',
	'"status":"OK"',
	'streamingData',
	'playbackTracking',
	'videoDetails',
	'"isLiveContent"',
	'WEB_EMBEDDED_PLAYER',
	'"playabilityStatus"',
	'"previewPlayabilityStatus"',
	'var ytplayer',
	'www-embed-player',
	'"errorCode"',
	'CONTENT_NOT_AVAILABLE',
	'embedsErrorLinks',
]

console.log('Pattern comparison:\n')
for (const pattern of patterns) {
	const in1 = htmls[0].html.includes(pattern)
	const in2 = htmls[1].html.includes(pattern)

	if (in1 !== in2) {
		console.log(`⚠️  DIFFERENT: "${pattern}"`)
		console.log(`   Video 1: ${in1}`)
		console.log(`   Video 2: ${in2}\n`)
	}
}

// Count occurrences of key patterns
console.log('\n\nOccurrence counts:\n')
const countPatterns = [
	'"status":"ERROR"',
	'"status":"OK"',
	'errorScreen',
	'playabilityStatus',
]

for (const pattern of countPatterns) {
	const count1 = (htmls[0].html.match(new RegExp(pattern, 'g')) || []).length
	const count2 = (htmls[1].html.match(new RegExp(pattern, 'g')) || []).length

	console.log(`"${pattern}":`)
	console.log(`   Video 1: ${count1}`)
	console.log(`   Video 2: ${count2}`)
	if (count1 !== count2) {
		console.log(`   ⚠️  DIFFERENT!\n`)
	} else {
		console.log('')
	}
}

// Save HTMLs for manual inspection
import fs from 'fs'
fs.writeFileSync('D:/linguami/temp-video1-disabled.html', htmls[0].html)
fs.writeFileSync('D:/linguami/temp-video2-working.html', htmls[1].html)
console.log('\n💾 HTML files saved:')
console.log('   - temp-video1-disabled.html')
console.log('   - temp-video2-working.html')
