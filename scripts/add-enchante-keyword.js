/**
 * Add "Enchanté(e)" to summary keywords in FR and RU lessons
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL
const supabaseKey = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function addKeywordToLesson(slug, lang, newKeyPhrase) {
	const blocksField = `blocks_${lang}`

	// Fetch the lesson
	const { data: lesson, error: fetchError } = await supabase
		.from('course_lessons')
		.select(`id, slug, ${blocksField}`)
		.eq('slug', slug)
		.single()

	if (fetchError) {
		console.error(`❌ Error fetching lesson ${slug}:`, fetchError)
		return false
	}

	const blocks = lesson[blocksField]

	// Find the summary block
	const summaryBlockIndex = blocks.findIndex(block => block.type === 'summary')

	if (summaryBlockIndex === -1) {
		console.log(`⚠️  No summary block found in ${slug} (${lang})`)
		return false
	}

	// Check if keyword already exists
	const existingKeyPhrase = blocks[summaryBlockIndex].keyPhrases?.find(
		kp => kp.fr === newKeyPhrase.fr
	)

	if (existingKeyPhrase) {
		console.log(`✓ "${newKeyPhrase.fr}" already exists in ${slug} (${lang})`)
		return false
	}

	// Add the new key phrase
	const updatedBlocks = [...blocks]
	updatedBlocks[summaryBlockIndex] = {
		...updatedBlocks[summaryBlockIndex],
		keyPhrases: [
			...updatedBlocks[summaryBlockIndex].keyPhrases,
			newKeyPhrase
		]
	}

	// Update the lesson
	const { error: updateError } = await supabase
		.from('course_lessons')
		.update({ [blocksField]: updatedBlocks })
		.eq('id', lesson.id)

	if (updateError) {
		console.error(`❌ Error updating lesson ${slug}:`, updateError)
		return false
	}

	console.log(`✅ Added "${newKeyPhrase.fr}" to ${slug} (${lang})`)
	return true
}

async function main() {
	console.log('📝 Adding "Enchanté(e)" to lesson summaries...\n')

	const newKeyPhrase = {
		fr: "Enchanté(e) !",
		context: "Réponse à une présentation"
	}

	// Add to French lesson (bonjour-saluer-prendre-conge)
	await addKeywordToLesson('bonjour-saluer-prendre-conge', 'fr', newKeyPhrase)
	await addKeywordToLesson('bonjour-saluer-prendre-conge', 'en', newKeyPhrase)
	await addKeywordToLesson('bonjour-saluer-prendre-conge', 'ru', newKeyPhrase)

	// Add to Russian lesson (privet-saluer-prendre-conge) with Russian version
	const russianKeyPhrase = {
		fr: "Приятно познакомиться !",
		context: "Ответ на представление"
	}

	await addKeywordToLesson('privet-saluer-prendre-conge', 'fr', russianKeyPhrase)
	await addKeywordToLesson('privet-saluer-prendre-conge', 'en', russianKeyPhrase)
	await addKeywordToLesson('privet-saluer-prendre-conge', 'ru', russianKeyPhrase)

	console.log('\n🎉 Done!')
}

main()
