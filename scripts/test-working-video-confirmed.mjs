// Test de la vidéo qui fonctionne confirmée par l'utilisateur

import fs from 'fs'

const workingVideoId = '_rlY4E_J0ro'
const brokenVideoId = 'Js11a9BuAe8'

console.log('🧪 Comparaison vidéo fonctionnelle vs cassée\n')
console.log('='.repeat(80))

const videos = [
	{ id: workingVideoId, name: 'WORKING (confirmé par utilisateur)' },
	{ id: brokenVideoId, name: 'BROKEN (Error 153)' }
]

for (const video of videos) {
	console.log(`\n📹 ${video.name} (${video.id})`)
	console.log('-'.repeat(80))

	try {
		const response = await fetch(`https://www.youtube.com/embed/${video.id}`, {
			method: 'GET',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
			},
		})

		const html = await response.text()

		// Check notre logique de détection actuelle
		const hasPreviewPlayability = html.includes('previewPlayabilityStatus')
		const hasStatusError = html.includes('"status":"ERROR"')
		const hasError153 = html.includes('Error 153') || html.includes('Erreur 153')
		const hasPlayabilityError = html.includes('PLAYABILITY_ERROR')

		console.log(`\nPatterns détectés:`)
		console.log(`  previewPlayabilityStatus: ${hasPreviewPlayability}`)
		console.log(`  "status":"ERROR": ${hasStatusError}`)
		console.log(`  Error/Erreur 153: ${hasError153}`)
		console.log(`  PLAYABILITY_ERROR: ${hasPlayabilityError}`)

		// Notre logique actuelle
		const wouldBeDetectedAsBroken = (hasPreviewPlayability && hasStatusError) || hasError153 || hasPlayabilityError

		console.log(`\n🎯 Résultat avec notre logique actuelle: ${wouldBeDetectedAsBroken ? '❌ BROKEN' : '✅ WORKING'}`)

		// Sauvegarder le HTML pour analyse
		const filename = `D:/linguami/temp-video-${video.id}.html`
		fs.writeFileSync(filename, html)
		console.log(`💾 HTML sauvegardé: ${filename}`)

	} catch (error) {
		console.error(`❌ Erreur: ${error.message}`)
	}
}

console.log('\n' + '='.repeat(80))
console.log('\n📊 Conclusion:')
console.log('Si les deux vidéos ont le même résultat, notre logique doit être ajustée.')
console.log('Si elles ont des résultats différents, notre logique est correcte.')
