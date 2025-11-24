// Test final avec la détection améliorée appliquée

// Import the actual function from admin.js would require refactoring,
// so we'll replicate the logic here to test

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

async function checkVideoLink(url) {
	if (!url) return 'broken'

	try {
		if (url.includes('youtube.com') || url.includes('youtu.be')) {
			const videoId = extractYouTubeId(url)
			if (!videoId) return 'broken'

			// Méthode 1: oEmbed (rapide)
			try {
				const controller = new AbortController()
				const timeoutId = setTimeout(() => controller.abort(), 5000)

				const oembedResponse = await fetch(
					`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
					{ method: 'GET', signal: controller.signal }
				)

				clearTimeout(timeoutId)

				if (!oembedResponse.ok) {
					return 'broken'
				}
			} catch (error) {
				return 'broken'
			}

			// Méthode 2: Embed page avec détection AMÉLIORÉE
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

			if (!embedResponse.ok) return 'broken'

			const html = await embedResponse.text()

			// AMÉLIORATION: Détecter les vidéos avec embedding désactivé
			// previewPlayabilityStatus est présent UNIQUEMENT quand il y a une erreur d'embedding
			if (html.includes('previewPlayabilityStatus') && html.includes('"status":"ERROR"')) {
				return 'broken'
			}

			// Indicateurs de vidéo indisponible (sans errorScreen qui cause des faux positifs)
			if (
				html.includes('Video unavailable') ||
				html.includes('This video is unavailable') ||
				html.includes('This video isn\'t available') ||
				html.includes('This video has been removed') ||
				html.includes('Private video') ||
				html.includes('has been blocked') ||
				html.includes('This video contains content') ||
				html.includes('who has blocked it') ||
				html.includes('copyright grounds') ||
				html.includes('blocked it in your country') ||
				html.includes('"status":"ERROR"') ||
				html.includes('"status":"UNPLAYABLE"') ||
				html.includes('"status":"LOGIN_REQUIRED"') ||
				html.includes('"reason":"Video unavailable"') ||
				html.includes('CONTENT_NOT_AVAILABLE') ||
				html.includes('playback on other websites has been disabled') ||
				html.includes('"isEmbeddingAllowed":false') ||
				(html.includes('"isUnlisted":true') && html.includes('"isPrivate":true'))
			) {
				return 'broken'
			}

			return 'working'
		}

		return 'working'

	} catch (error) {
		return 'broken'
	}
}

// Test avec 3 vidéos
const videos = [
	{ id: 1, url: 'https://www.youtube.com/embed/Js11a9BuAe8', expected: 'broken', desc: 'Embedding désactivé (Erreur 153)' },
	{ id: 2, url: 'https://www.youtube.com/watch?v=_mLAFrU9-VA', expected: 'broken', desc: 'Embedding désactivé' },
	{ id: 3, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', expected: 'working', desc: 'Embedding activé (Rick Astley)' },
]

console.log('🧪 Testing improved video detection...\n')
console.log('='.repeat(80))

let passed = 0
let failed = 0

for (const video of videos) {
	const result = await checkVideoLink(video.url)
	const isCorrect = result === video.expected

	console.log(`\n📹 Test ${video.id}: ${video.desc}`)
	console.log(`   URL: ${video.url}`)
	console.log(`   Expected: ${video.expected}`)
	console.log(`   Got: ${result}`)
	console.log(`   ${isCorrect ? '✅ PASS' : '❌ FAIL'}`)

	if (isCorrect) {
		passed++
	} else {
		failed++
	}
}

console.log('\n' + '='.repeat(80))
console.log(`\n📊 Results: ${passed}/${videos.length} tests passed`)

if (failed === 0) {
	console.log('\n🎉 All tests passed! The improved detection works correctly.')
} else {
	console.log(`\n⚠️  ${failed} test(s) failed. Please review the logic.`)
}
