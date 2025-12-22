require('dotenv').config({ path: '.env.local' })

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
	console.error('❌ Missing Supabase service role key')
	process.exit(1)
}

// Voix féminine française Marie - claire et naturelle, parfaite pour l'alphabet
const FRENCH_FEMALE_VOICE = 'sANWqF1bCMzR6eyZbCGw'

// Alphabet français avec mots illustrés (même données que add-alphabet-table-to-lesson-1.js)
const alphabetData = [
	{ letter: 'A', word: 'Avion', emoji: '✈️' },
	{ letter: 'B', word: 'Ballon', emoji: '⚽' },
	{ letter: 'C', word: 'Chat', emoji: '🐱' },
	{ letter: 'D', word: 'Dauphin', emoji: '🐬' },
	{ letter: 'E', word: 'Éléphant', emoji: '🐘' },
	{ letter: 'F', word: 'Fleur', emoji: '🌸' },
	{ letter: 'G', word: 'Girafe', emoji: '🦒' },
	{ letter: 'H', word: 'Hélicoptère', emoji: '🚁' },
	{ letter: 'I', word: 'Île', emoji: '🏝️' },
	{ letter: 'J', word: 'Jardin', emoji: '🏡' },
	{ letter: 'K', word: 'Kangourou', emoji: '🦘' },
	{ letter: 'L', word: 'Lion', emoji: '🦁' },
	{ letter: 'M', word: 'Maison', emoji: '🏠' },
	{ letter: 'N', word: 'Nuage', emoji: '☁️' },
	{ letter: 'O', word: 'Oiseau', emoji: '🐦' },
	{ letter: 'P', word: 'Pomme', emoji: '🍎' },
	{ letter: 'Q', word: 'Queue', emoji: '🦎' },
	{ letter: 'R', word: 'Rose', emoji: '🌹' },
	{ letter: 'S', word: 'Soleil', emoji: '☀️' },
	{ letter: 'T', word: 'Train', emoji: '🚂' },
	{ letter: 'U', word: 'Usine', emoji: '🏭' },
	{ letter: 'V', word: 'Voiture', emoji: '🚗' },
	{ letter: 'W', word: 'Wagon', emoji: '🚃' },
	{ letter: 'X', word: 'Xylophone', emoji: '🎵' },
	{ letter: 'Y', word: 'Yaourt', emoji: '🥛' },
	{ letter: 'Z', word: 'Zèbre', emoji: '🦓' }
]

// Helper function to call the generate-audio API
async function generateAudio(text, voiceId, fileName, language) {
	console.log(`🎙️  Generating: ${fileName}`)
	console.log(`   Text: "${text}"`)

	try {
		const response = await fetch('http://localhost:3000/api/courses/generate-audio', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Admin-Key': supabaseServiceKey,
			},
			body: JSON.stringify({
				text,
				voiceId,
				fileName,
				language,
				slower: false, // Vitesse normale
			}),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(`Failed to generate audio: ${error.error}`)
		}

		const data = await response.json()
		console.log(`   ✅ Generated: ${data.url}\n`)
		return data.url
	} catch (error) {
		console.error(`   ❌ Error generating ${fileName}:`, error.message)
		throw error
	}
}

async function generateAlphabetAudio() {
	console.log('🔤 Starting French alphabet audio generation with words...')
	console.log(`📝 Format: "Lettre, comme Mot"`)
	console.log(`📝 Generating ${alphabetData.length} audio files\n`)

	const results = {
		success: [],
		failed: []
	}

	for (const item of alphabetData) {
		const { letter, word } = item

		// Format: "A, comme Avion"
		const text = `${letter}, comme ${word}`

		// Le fileName doit être simple sans slashes (validation Zod stricte)
		// L'API ajoutera automatiquement: audios/courses/fr/{fileName}.mp3
		const fileName = `alphabet-${letter.toLowerCase()}-word`

		try {
			const url = await generateAudio(text, FRENCH_FEMALE_VOICE, fileName, 'fr')
			results.success.push({ letter, word, text, url })

			// Petit délai pour éviter de surcharger l'API
			await new Promise(resolve => setTimeout(resolve, 500))
		} catch (error) {
			console.error(`❌ Failed to generate audio for letter ${letter}`)
			results.failed.push({ letter, word, error: error.message })
		}
	}

	// Résumé
	console.log('\n' + '='.repeat(60))
	console.log('📊 GENERATION SUMMARY')
	console.log('='.repeat(60))
	console.log(`✅ Success: ${results.success.length}/${alphabetData.length} files`)
	console.log(`❌ Failed: ${results.failed.length}/${alphabetData.length} files`)

	if (results.failed.length > 0) {
		console.log('\n❌ Failed letters:')
		results.failed.forEach(({ letter, word, error }) => {
			console.log(`   - ${letter} (${word}): ${error}`)
		})
	}

	if (results.success.length > 0) {
		console.log('\n✅ All audio files are in: linguami/audios/fr/lessons/alphabet/')
		console.log('\n📝 Example URLs:')
		results.success.slice(0, 3).forEach(({ letter, text, url }) => {
			console.log(`   ${letter}: "${text}"`)
			console.log(`      ${url}\n`)
		})
	}

	console.log('\n🎉 Alphabet audio generation complete!')
	console.log('\n💡 Next step: Update the lesson blocks to use these new audio URLs')
	console.log('   The audioUrl field should be added to each letter in the alphabetGrid block')
}

// Run the script
generateAlphabetAudio().catch(error => {
	console.error('💥 Fatal error:', error)
	process.exit(1)
})
