// Test avec l'API YouTube Data v3 pour vérifier l'embedding
// NOTE: Nécessite YOUTUBE_API_KEY dans .env.local

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const API_KEY = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

if (!API_KEY) {
	console.log('⚠️  Pas de clé API YouTube trouvée dans .env.local')
	console.log('Ajoutez: YOUTUBE_API_KEY=votre_cle')
	console.log('\nComment obtenir une clé:')
	console.log('1. Allez sur https://console.cloud.google.com/')
	console.log('2. Créez un projet')
	console.log('3. Activez YouTube Data API v3')
	console.log('4. Créez des identifiants (clé API)')
	process.exit(1)
}

async function checkEmbeddingAllowed(videoId) {
	const url = `https://www.googleapis.com/youtube/v3/videos?part=status&id=${videoId}&key=${API_KEY}`

	try {
		const response = await fetch(url)
		const data = await response.json()

		if (data.items && data.items.length > 0) {
			const embeddable = data.items[0].status.embeddable
			return embeddable ? 'working' : 'broken'
		}

		return 'not_found'
	} catch (error) {
		console.error('Erreur API:', error.message)
		return 'error'
	}
}

// Test
const videos = [
	{ id: '_rlY4E_J0ro', expected: 'working', desc: 'Confirmée fonctionnelle' },
	{ id: 'Js11a9BuAe8', expected: 'broken', desc: 'Error 153' },
]

console.log('🧪 Test avec YouTube Data API v3\n')
console.log('='.repeat(80))

for (const video of videos) {
	const result = await checkEmbeddingAllowed(video.id)
	const isCorrect = result === video.expected

	console.log(`\n📹 ${video.id} (${video.desc})`)
	console.log(`   Expected: ${video.expected}`)
	console.log(`   Got: ${result}`)
	console.log(`   ${isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`)
}

console.log('\n' + '='.repeat(80))
console.log('\n💡 Avec l\'API YouTube Data v3, on peut détecter de manière fiable')
console.log('   si une vidéo a l\'embedding activé ou désactivé.')
