/**
 * Add "Enchanté(e)" to dialogue vocabulary in FR lesson
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

async function main() {
	console.log('📝 Adding "Enchanté(e)" to dialogue vocabulary...\n')

	// Fetch the French lesson
	const { data: lesson, error: fetchError } = await supabase
		.from('course_lessons')
		.select('id, slug, blocks_fr')
		.eq('slug', 'bonjour-saluer-prendre-conge')
		.single()

	if (fetchError) {
		console.error('❌ Error fetching lesson:', fetchError)
		return
	}

	// Find the dialogue block (should be the first block)
	const dialogueBlockIndex = lesson.blocks_fr.findIndex(block => block.type === 'dialogue')

	if (dialogueBlockIndex === -1) {
		console.log('⚠️  No dialogue block found')
		return
	}

	console.log('Current dialogue vocabulary:')
	lesson.blocks_fr[dialogueBlockIndex].vocabulary?.forEach(v => {
		console.log(`  - ${v.word}`)
	})

	// Check if "Enchanté" already exists
	const hasEnchante = lesson.blocks_fr[dialogueBlockIndex].vocabulary?.some(
		v => v.word === 'Enchanté' || v.word === 'Enchantée' || v.word === 'Enchanté(e)'
	)

	if (hasEnchante) {
		console.log('\n✓ "Enchanté(e)" already exists in dialogue vocabulary')
		return
	}

	// Add "Enchanté(e)" to vocabulary
	const newVocab = {
		word: "Enchanté(e)",
		category: "expressions",
		translation: "Réponse polie lors d'une présentation"
	}

	const updatedBlocks = [...lesson.blocks_fr]
	updatedBlocks[dialogueBlockIndex] = {
		...updatedBlocks[dialogueBlockIndex],
		vocabulary: [
			...updatedBlocks[dialogueBlockIndex].vocabulary,
			newVocab
		]
	}

	// Update the lesson
	const { error: updateError } = await supabase
		.from('course_lessons')
		.update({ blocks_fr: updatedBlocks })
		.eq('id', lesson.id)

	if (updateError) {
		console.error('❌ Error updating lesson:', updateError)
		return
	}

	console.log('\n✅ Added "Enchanté(e)" to dialogue vocabulary!')
	console.log('\nNew dialogue vocabulary:')
	updatedBlocks[dialogueBlockIndex].vocabulary.forEach(v => {
		console.log(`  - ${v.word}`)
	})
}

main()
