require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('❌ Missing Supabase credentials')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Voix masculine française
const FRENCH_MALE_VOICE = '5jCmrHdxbpU36l1wb3Ke'

// Helper function to call the generate-audio API
async function generateAudio(text, voiceId, fileName, language, slower = true) {
	console.log(`      🎙️  Generating: ${fileName}`)

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

async function generateTableAudio() {
	console.log('🎙️  Generating table audio for grammar blocks...\n')

	try {
		// Get the lesson
		const { data: lessons, error } = await supabase
			.from('course_lessons')
			.select('id, slug, blocks_ru')
			.eq('slug', 'se-presenter-fr')

		if (error) throw error
		if (!lessons || lessons.length === 0) {
			console.log('❌ No lessons found')
			return
		}

		for (const lesson of lessons) {
			if (!lesson.blocks_ru) continue

			console.log(`📝 Processing lesson: ${lesson.slug}`)

			const blocks = lesson.blocks_ru
			const grammarBlocks = blocks.filter((b) => b.type === 'grammar')

			console.log(`✅ Found ${grammarBlocks.length} grammar blocks\n`)

			// Process only the first 2 grammar blocks (S'APPELER and AVOIR)
			for (let blockIndex = 0; blockIndex < Math.min(2, grammarBlocks.length); blockIndex++) {
				const grammarBlock = grammarBlocks[blockIndex]

				if (!grammarBlock.table) {
					console.log(`  ⚠️  Block ${blockIndex} has no table, skipping`)
					continue
				}

				console.log(`\n  📖 Block ${blockIndex}: ${grammarBlock.title}`)
				console.log(`     Table: ${grammarBlock.table.title}`)

				const table = grammarBlock.table
				const rows = table.rows || []

				// Initialize rowsAudio array if it doesn't exist
				if (!table.rowsAudio) {
					table.rowsAudio = []
				}

				console.log(`     Processing ${rows.length} rows...\n`)

				for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
					const row = rows[rowIndex]

					// Initialize this row's audio array if it doesn't exist
					if (!table.rowsAudio[rowIndex]) {
						table.rowsAudio[rowIndex] = []
					}

					console.log(`     Row ${rowIndex}: ${row[0]} | ${row[1]}`)

					// Column 0: Pronoun (Je, Tu, etc.)
					const pronoun = row[0]
					const pronounFileName = `table-${blockIndex}-row-${rowIndex}-col-0.mp3`

					if (!table.rowsAudio[rowIndex][0]) {
						try {
							const audioUrl = await generateAudio(
								pronoun,
								FRENCH_MALE_VOICE,
								pronounFileName,
								'fr',
								true
							)
							table.rowsAudio[rowIndex][0] = audioUrl
							console.log(`       ✅ Pronoun audio: ${audioUrl}`)
							await new Promise((resolve) => setTimeout(resolve, 500))
						} catch (error) {
							console.error(`       ❌ Error: ${error.message}`)
						}
					} else {
						console.log(`       ✓ Pronoun audio exists`)
					}

					// Column 1: Conjugation (je m'appelle, j'ai, etc.)
					const conjugation = row[1]
					const conjugationFileName = `table-${blockIndex}-row-${rowIndex}-col-1.mp3`

					if (!table.rowsAudio[rowIndex][1]) {
						try {
							const audioUrl = await generateAudio(
								conjugation,
								FRENCH_MALE_VOICE,
								conjugationFileName,
								'fr',
								true
							)
							table.rowsAudio[rowIndex][1] = audioUrl
							console.log(`       ✅ Conjugation audio: ${audioUrl}`)
							await new Promise((resolve) => setTimeout(resolve, 500))
						} catch (error) {
							console.error(`       ❌ Error: ${error.message}`)
						}
					} else {
						console.log(`       ✓ Conjugation audio exists`)
					}

					console.log()
				}
			}

			// Update the lesson with new audio URLs
			console.log(`\n  💾 Updating lesson with table audio...`)

			const { error: updateError } = await supabase
				.from('course_lessons')
				.update({ blocks_ru: blocks })
				.eq('id', lesson.id)

			if (updateError) {
				console.error(`  ❌ Error updating lesson:`, updateError)
			} else {
				console.log(`  ✅ Lesson updated successfully`)
			}
		}

		console.log('\n✅ All done! Grammar table audio generated with slower male voice.')
	} catch (error) {
		console.error('❌ Error:', error)
	}
}

generateTableAudio()
