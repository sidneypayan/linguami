// Trouver la vraie différence entre vidéo fonctionnelle et cassée

import fs from 'fs'

const workingHtml = fs.readFileSync('D:/linguami/temp-video-_rlY4E_J0ro.html', 'utf8')
const brokenHtml = fs.readFileSync('D:/linguami/temp-video-Js11a9BuAe8.html', 'utf8')

console.log('🔍 Recherche des différences significatives...\n')

// Patterns à vérifier
const patterns = [
	{ name: 'streamingData', desc: 'Présence de données de streaming' },
	{ name: 'videoDetails', desc: 'Détails de la vidéo' },
	{ name: '"playabilityStatus"', desc: 'Status de jouabilité (guillemets)' },
	{ name: 'playabilityStatus', desc: 'Status de jouabilité (sans guillemets)' },
	{ name: '"status":"OK"', desc: 'Status OK' },
	{ name: 'status\\":\\"OK', desc: 'Status OK (échappé)' },
	{ name: 'player-unavailable', desc: 'Lecteur non disponible' },
	{ name: 'errorScreen', desc: 'Écran d\'erreur' },
	{ name: 'var ytInitialPlayerResponse', desc: 'Réponse initiale du lecteur' },
	{ name: 'PLAYER_CONFIG', desc: 'Configuration du lecteur' },
	{ name: '"formats"', desc: 'Formats vidéo disponibles' },
	{ name: '"adaptiveFormats"', desc: 'Formats adaptatifs' },
]

console.log('Pattern                                  | Working | Broken | Différence')
console.log('-'.repeat(80))

let differences = []

for (const pattern of patterns) {
	const inWorking = workingHtml.includes(pattern.name)
	const inBroken = brokenHtml.includes(pattern.name)
	const isDifferent = inWorking !== inBroken

	const workingSymbol = inWorking ? '✓' : '✗'
	const brokenSymbol = inBroken ? '✓' : '✗'
	const diffSymbol = isDifferent ? '⚠️ OUI' : '   -'

	console.log(`${pattern.name.padEnd(40)} | ${workingSymbol.padEnd(7)} | ${brokenSymbol.padEnd(6)} | ${diffSymbol}`)

	if (isDifferent) {
		differences.push({
			pattern: pattern.name,
			desc: pattern.desc,
			inWorking,
			inBroken
		})
	}
}

console.log('\n' + '='.repeat(80))
console.log('\n📊 DIFFÉRENCES TROUVÉES:\n')

if (differences.length === 0) {
	console.log('❌ Aucune différence trouvée avec ces patterns.')
	console.log('\n💡 Il faut analyser plus en profondeur le HTML...')
} else {
	differences.forEach((diff, i) => {
		console.log(`${i + 1}. ${diff.desc} (${diff.pattern})`)
		console.log(`   Vidéo fonctionnelle: ${diff.inWorking ? 'PRÉSENT ✓' : 'ABSENT ✗'}`)
		console.log(`   Vidéo cassée: ${diff.inBroken ? 'PRÉSENT ✓' : 'ABSENT ✗'}`)
		console.log('')
	})

	console.log('💡 RECOMMANDATION:')
	const bestPattern = differences.find(d => d.inWorking && !d.inBroken)
	if (bestPattern) {
		console.log(`Utiliser la présence de "${bestPattern.pattern}" comme indicateur de vidéo fonctionnelle.`)
	} else {
		const reversePattern = differences.find(d => !d.inWorking && d.inBroken)
		if (reversePattern) {
			console.log(`Utiliser la présence de "${reversePattern.pattern}" comme indicateur de vidéo CASSÉE.`)
		}
	}
}
