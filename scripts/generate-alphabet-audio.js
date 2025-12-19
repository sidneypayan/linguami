require('dotenv').config({ path: '.env.local' })

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
	console.error('❌ Missing Supabase service role key')
	process.exit(1)
}

// Voix féminine française Marie - claire et naturelle, parfaite pour l'alphabet
const FRENCH_FEMALE_VOICE = 'sANWqF1bCMzR6eyZbCGw'

// Alphabet français
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// Helper function to call the generate-audio API
async function generateAudio(text, voiceId, fileName, language) {
	console.log(`🎙️  Generating: ${fileName}`)

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
				slower: false, // Vitesse normale pour les lettres
			}),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(`Failed to generate audio: ${error.error}`)
		}

		const data = await response.json()
		console.log(`   ✅ Generated: ${data.url}`)
		return data.url
	} catch (error) {
		console.error(`   ❌ Error generating ${fileName}:`, error.message)
		throw error
	}
}

async function generateAlphabetAudio() {
	console.log('🔤 Starting French alphabet audio generation...')
	console.log(`📝 Generating ${ALPHABET.length} letters\n`)

	const results = {
		success: [],
		failed: []
	}

	for (const letter of ALPHABET) {
		// Le fileName doit être simple sans slashes (validation Zod stricte)
		// L'API ajoutera automatiquement: audios/courses/fr/{fileName}.mp3
		const fileName = `alphabet-letter-${letter.toLowerCase()}`

		try {
			// On prononce juste la lettre
			const url = await generateAudio(letter, FRENCH_FEMALE_VOICE, fileName, 'fr')
			results.success.push({ letter, url })

			// Petit délai pour éviter de surcharger l'API
			await new Promise(resolve => setTimeout(resolve, 500))
		} catch (error) {
			console.error(`❌ Failed to generate audio for letter ${letter}`)
			results.failed.push({ letter, error: error.message })
		}
	}

	// Résumé
	console.log('\n' + '='.repeat(60))
	console.log('📊 GENERATION SUMMARY')
	console.log('='.repeat(60))
	console.log(`✅ Success: ${results.success.length}/${ALPHABET.length} letters`)
	console.log(`❌ Failed: ${results.failed.length}/${ALPHABET.length} letters`)

	if (results.failed.length > 0) {
		console.log('\n❌ Failed letters:')
		results.failed.forEach(({ letter, error }) => {
			console.log(`   - ${letter}: ${error}`)
		})
	}

	if (results.success.length > 0) {
		console.log('\n✅ All audio files are in: linguami/audios/fr/lessons/alphabet/')
		console.log('\n📝 Example URLs:')
		results.success.slice(0, 3).forEach(({ letter, url }) => {
			console.log(`   ${letter}: ${url}`)
		})
	}

	console.log('\n🎉 Alphabet audio generation complete!')
}

// Run the script
generateAlphabetAudio().catch(error => {
	console.error('💥 Fatal error:', error)
	process.exit(1)
})
