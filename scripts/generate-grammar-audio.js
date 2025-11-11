require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('❌ Missing Supabase credentials')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Voix masculine française (même que dans regenerate-male-audio-slower.js)
const FRENCH_MALE_VOICE = '5jCmrHdxbpU36l1wb3Ke'

// Helper function to call the generate-audio API
async function generateAudio(text, voiceId, fileName, language, slower = true) {
	console.log(`      🎙️  Generating: ${fileName} (slower: ${slower})`)

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
			slower,
		}),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(`Failed to generate audio: ${error.error}`)
	}

	const data = await response.json()
	return data.url
}

async function generateGrammarAudio() {
	try {
		console.log('🔍 Fetching lesson se-presenter-fr...')

		// Get the lesson
		const { data: lessons, error } = await supabase
			.from('course_lessons')
			.select('id, slug, blocks_fr, blocks_ru, blocks_en')
			.eq('slug', 'se-presenter-fr')

		if (error) throw error
		if (!lessons || lessons.length === 0) {
			console.log('❌ No lessons found')
			return
		}

		console.log(`✅ Found ${lessons.length} lesson(s)`)

		for (const lesson of lessons) {
			console.log(`\n📝 Processing lesson: ${lesson.slug}`)

			// Process each language
			for (const lang of ['fr', 'ru', 'en']) {
				const blocksKey = `blocks_${lang}`
				const blocks = lesson[blocksKey]

				if (!blocks) {
					console.log(`  ⚠️  No blocks for ${lang}`)
					continue
				}

				console.log(`\n  🌐 Processing ${lang} blocks...`)

				// Find all grammar blocks
				const grammarBlocks = blocks.filter((block) => block.type === 'grammar')

				console.log(`  📚 Found ${grammarBlocks.length} grammar blocks`)

				for (let blockIndex = 0; blockIndex < grammarBlocks.length; blockIndex++) {
					const grammarBlock = grammarBlocks[blockIndex]
					const examples = grammarBlock.examples || []

					console.log(
						`\n    📖 Grammar block ${blockIndex + 1}: ${grammarBlock.title || 'Untitled'}`
					)
					console.log(`    🔢 ${examples.length} examples found`)

					for (let exampleIndex = 0; exampleIndex < examples.length; exampleIndex++) {
						const example = examples[exampleIndex]
						const sentence = example.sentence

						if (!sentence) {
							console.log(`      ⚠️  Example ${exampleIndex} has no sentence, skipping`)
							continue
						}

						// Check if audio already exists
						if (example.audioUrl) {
							console.log(`      ✓ Example ${exampleIndex} already has audio, skipping`)
							continue
						}

						console.log(`      📝 Generating audio for: "${sentence}"`)

						try {
							const filename = `grammar-block-${blockIndex}-example-${exampleIndex}-${lang}.mp3`

							// Generate audio with slower speech using the API
							const audioUrl = await generateAudio(
								sentence,
								FRENCH_MALE_VOICE,
								filename,
								'fr',
								true // slower = true
							)

							example.audioUrl = audioUrl
							console.log(`      ✅ Audio generated: ${audioUrl}`)

							// Small delay to avoid rate limiting
							await new Promise((resolve) => setTimeout(resolve, 1000))
						} catch (audioError) {
							console.error(`      ❌ Error generating audio:`, audioError.message)
						}
					}
				}

				// Update the lesson with new audio URLs
				console.log(`\n  💾 Updating lesson with new audio URLs for ${lang}...`)

				const updateData = {}
				updateData[blocksKey] = blocks

				const { error: updateError } = await supabase
					.from('course_lessons')
					.update(updateData)
					.eq('id', lesson.id)

				if (updateError) {
					console.error(`  ❌ Error updating lesson:`, updateError)
				} else {
					console.log(`  ✅ Lesson updated successfully for ${lang}`)
				}
			}
		}

		console.log('\n✅ All done! Grammar examples now have audio with slower male voice.')
	} catch (error) {
		console.error('❌ Error:', error)
	}
}

generateGrammarAudio()
