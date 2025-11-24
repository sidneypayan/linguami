// Test script with improved embedding detection

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
		// YouTube
		if (url.includes('youtube.com') || url.includes('youtu.be')) {
			const videoId = extractYouTubeId(url)
			if (!videoId) return 'broken'

			console.log(`\n🔍 Checking: ${url}`)
			console.log(`📌 Video ID: ${videoId}`)

			// Méthode 1: Vérifier avec l'API oEmbed (rapide)
			try {
				const controller = new AbortController()
				const timeoutId = setTimeout(() => controller.abort(), 5000)

				const oembedResponse = await fetch(
					`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
					{ method: 'GET', signal: controller.signal }
				)

				clearTimeout(timeoutId)

				if (!oembedResponse.ok) {
					console.log('❌ oEmbed API returned error')
					return 'broken'
				}

				const data = await oembedResponse.json()
				console.log(`✅ oEmbed OK - Title: "${data.title}"`)
			} catch (error) {
				console.log(`❌ oEmbed error: ${error.message}`)
				return 'broken'
			}

			// Méthode 2: Vérifier la page embed avec DÉTECTION AMÉLIORÉE
			console.log('\n--- Méthode 2: Embed Page (IMPROVED) ---')
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

			if (!embedResponse.ok) {
				console.log('❌ Embed page not OK')
				return 'broken'
			}

			const html = await embedResponse.text()

			// ============================================================================
			// AMÉLIORATION 1: Vérifier previewPlayabilityStatus (pour les erreurs d'embedding)
			// ============================================================================
			if (html.includes('"previewPlayabilityStatus"') && html.includes('"status":"ERROR"')) {
				console.log('🚫 previewPlayabilityStatus ERROR detected')
				return 'broken'
			}

			// Chercher les données JSON embarquées
			const playabilityMatch = html.match(/"playabilityStatus":\s*\{[^}]+\}/)
			if (playabilityMatch) {
				try {
					const jsonStr = playabilityMatch[0].replace('"playabilityStatus":', '')
					const playabilityStatus = JSON.parse(jsonStr)

					if (
						playabilityStatus.status === 'ERROR' ||
						playabilityStatus.status === 'UNPLAYABLE' ||
						playabilityStatus.status === 'LOGIN_REQUIRED' ||
						playabilityStatus.status === 'CONTENT_CHECK_REQUIRED'
					) {
						console.log(`🚫 playabilityStatus: ${playabilityStatus.status}`)
						return 'broken'
					}
				} catch (e) {
					console.error('Error parsing playabilityStatus:', e.message)
				}
			}

			// ============================================================================
			// AMÉLIORATION 2: Détecter les codes d'erreur spécifiques
			// ============================================================================
			const errorChecks = [
				{ pattern: 'Error 153', name: 'Error 153 (EN)' },
				{ pattern: 'Erreur 153', name: 'Erreur 153 (FR)' },
				{ pattern: 'PLAYABILITY_ERROR', name: 'Playability Error Code' },
			]

			for (const check of errorChecks) {
				if (html.includes(check.pattern)) {
					console.log(`🚫 ${check.name} detected`)
					return 'broken'
				}
			}

			// Indicateurs de vidéo indisponible (vérifications existantes)
			const unavailableChecks = [
				'Video unavailable',
				'This video is unavailable',
				'This video isn\'t available',
				'This video has been removed',
				'Private video',
				'has been blocked',
				'This video contains content',
				'who has blocked it',
				'copyright grounds',
				'blocked it in your country',
				'"status":"ERROR"',
				'"status":"UNPLAYABLE"',
				'"status":"LOGIN_REQUIRED"',
				'"reason":"Video unavailable"',
				'CONTENT_NOT_AVAILABLE',
				'playback on other websites has been disabled',
				'errorScreen',
				'"isEmbeddingAllowed":false',
			]

			for (const check of unavailableChecks) {
				if (html.includes(check)) {
					console.log(`🚫 Found: "${check}"`)
					return 'broken'
				}
			}

			if (html.includes('"isUnlisted":true') && html.includes('"isPrivate":true')) {
				console.log('🚫 Unlisted + Private video')
				return 'broken'
			}

			console.log('✅ Embed page looks OK')
			return 'working'
		}

		// Autres plateformes...
		return 'working'

	} catch (error) {
		console.error(`❌ Error: ${error.message}`)
		return 'broken'
	}
}

// Test des vidéos
const videos = [
	{ id: 232, url: 'https://www.youtube.com/embed/Js11a9BuAe8' }, // Embedding désactivé
	{ id: 352, url: 'https://www.youtube.com/watch?v=_mLAFrU9-VA' }, // Devrait fonctionner
]

for (const video of videos) {
	const result = await checkVideoLink(video.url)
	console.log(`\n🎯 FINAL RESULT for Material ${video.id}: ${result.toUpperCase()}`)
	console.log('='.repeat(80))
}
