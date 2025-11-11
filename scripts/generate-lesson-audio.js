const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('❌ Missing Supabase credentials')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Configuration des voix depuis config/elevenlabs.js
const FRENCH_VOICES = {
	male: '5jCmrHdxbpU36l1wb3Ke',
	female: 'sANWqF1bCMzR6eyZbCGw', // Nouvelle voix féminine
}

// Helper function to call the generate-audio API
async function generateAudio(text, voiceId, fileName, language) {
	console.log(`  🎙️  Generating: ${fileName}`)

	const response = await fetch('http://localhost:3000/api/courses/generate-audio', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Admin-Key': supabaseServiceKey, // Admin key for script auth
		},
		body: JSON.stringify({
			text,
			voiceId,
			fileName,
			language,
		}),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(`Failed to generate audio: ${error.error}`)
	}

	const data = await response.json()
	return data.url
}

async function generateLessonAudio() {
	console.log('🎙️  Generating audio for French lesson...\n')

	try {
		console.log('✓ Using French voices:')
		console.log('  - Male:', FRENCH_VOICES.male)
		console.log('  - Female:', FRENCH_VOICES.female)
		console.log()

		// Get the lesson
		const { data: courses } = await supabase
			.from('courses')
			.select('id, lang')
			.eq('slug', 'premiers-pas-francais')

		if (!courses || courses.length === 0) {
			console.error('❌ No courses found')
			return
		}

		for (const course of courses) {
			console.log(`\n📝 Processing course for ${course.lang.toUpperCase()} speakers...\n`)

			const { data: lesson } = await supabase
				.from('course_lessons')
				.select('id, blocks_ru, blocks_en')
				.eq('slug', 'se-presenter-fr')
				.eq('course_id', course.id)
				.single()

			if (!lesson) {
				console.log('  ⚠️  Lesson not found, skipping')
				continue
			}

			const blocksKey = course.lang === 'ru' ? 'blocks_ru' : 'blocks_en'
			const blocks = lesson[blocksKey]
			const updatedBlocks = [...blocks]

			// Process each block
			for (let blockIndex = 0; blockIndex < updatedBlocks.length; blockIndex++) {
				const block = updatedBlocks[blockIndex]

				// Process dialogue blocks
				if (block.type === 'dialogue' && block.lines) {
					console.log(`\n🎭 Processing dialogue: ${block.title}`)

					const updatedLines = []

					for (let lineIndex = 0; lineIndex < block.lines.length; lineIndex++) {
						const line = block.lines[lineIndex]
						const speakerGender = line.speakerGender || 'female'
						const voiceId = FRENCH_VOICES[speakerGender]

						const fileName = `premiers-pas-fr-dialogue-${blockIndex}-line-${lineIndex}`

						try {
							const audioUrl = await generateAudio(
								line.text,
								voiceId,
								fileName,
								'fr'
							)

							updatedLines.push({
								...line,
								audioUrl,
							})

							console.log(`  ✅ ${line.speaker}: ${line.text.substring(0, 30)}...`)
						} catch (error) {
							console.error(`  ❌ Error generating audio for line ${lineIndex}:`, error.message)
							updatedLines.push(line)
						}

						// Add delay to avoid rate limiting
						await new Promise((resolve) => setTimeout(resolve, 500))
					}

					updatedBlocks[blockIndex] = {
						...block,
						lines: updatedLines,
					}
				}

				// Process conversation blocks
				if (block.type === 'conversation' && block.dialogue) {
					console.log(`\n💬 Processing conversation: ${block.title}`)

					const updatedDialogue = []

					for (let lineIndex = 0; lineIndex < block.dialogue.length; lineIndex++) {
						const line = block.dialogue[lineIndex]
						// Assume male voice for customs officer, female for tourist
						const voiceName =
							line.speaker === 'Таможенник' || line.speaker === 'Customs Officer'
								? 'male'
								: 'female'
						const voiceId = FRENCH_VOICES[voiceName]

						const fileName = `premiers-pas-fr-conv-${blockIndex}-line-${lineIndex}`

						try {
							const audioUrl = await generateAudio(line.text, voiceId, fileName, 'fr')

							updatedDialogue.push({
								...line,
								audioUrl,
							})

							console.log(`  ✅ ${line.speaker}: ${line.text.substring(0, 30)}...`)
						} catch (error) {
							console.error(
								`  ❌ Error generating audio for line ${lineIndex}:`,
								error.message
							)
							updatedDialogue.push(line)
						}

						// Add delay to avoid rate limiting
						await new Promise((resolve) => setTimeout(resolve, 500))
					}

					updatedBlocks[blockIndex] = {
						...block,
						dialogue: updatedDialogue,
					}
				}
			}

			// Save updated blocks to database
			const { error: updateError } = await supabase
				.from('course_lessons')
				.update({ [blocksKey]: updatedBlocks })
				.eq('id', lesson.id)

			if (updateError) {
				console.error(`  ❌ Error updating lesson:`, updateError.message)
			} else {
				console.log(`\n✅ Updated lesson for ${course.lang} speakers`)
			}
		}

		console.log('\n✅ All audio generated successfully!')
	} catch (error) {
		console.error('❌ Error:', error.message)
	}
}

generateLessonAudio()
