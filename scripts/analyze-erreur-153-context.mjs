// Analyser le contexte de "Erreur 153" dans les deux vidéos

const videos = [
	{ id: 'Js11a9BuAe8', name: 'Embedding désactivé' },
	{ id: '_mLAFrU9-VA', name: 'Devrait fonctionner' },
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

		// Find all occurrences of "Erreur 153"
		const erreur153Regex = /Erreur 153/gi
		const matches = [...html.matchAll(erreur153Regex)]

		console.log(`\n📊 Found ${matches.length} occurrence(s) of "Erreur 153"`)

		matches.forEach((match, index) => {
			const position = match.index
			const start = Math.max(0, position - 300)
			const end = Math.min(html.length, position + 300)
			const context = html.substring(start, end)

			console.log(`\n--- Occurrence ${index + 1} (position ${position}) ---`)
			console.log(context)
		})

		// Check for previewPlayabilityStatus
		console.log('\n\n📋 Checking previewPlayabilityStatus...')
		if (html.includes('"previewPlayabilityStatus"')) {
			const previewMatch = html.match(/"previewPlayabilityStatus":\{[^}]*"status":"([^"]+)"/)
			if (previewMatch) {
				console.log(`   Status: ${previewMatch[1]}`)

				if (previewMatch[1] === 'ERROR') {
					// Extract more context
					const fullMatch = html.match(/"previewPlayabilityStatus":\{[^}]*errorScreen[^}]*\}/)
					if (fullMatch) {
						console.log(`   Full context: ${fullMatch[0].substring(0, 500)}`)
					}
				}
			}
		} else {
			console.log('   ❌ Not found')
		}

	} catch (error) {
		console.error(`❌ Error: ${error.message}`)
	}
}
