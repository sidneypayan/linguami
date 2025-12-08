/**
 * Add "Enchanté(e)" to dialogue vocabulary in all blocks (fr, ru, en)
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env.production') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
	console.log('📝 Adding "Enchanté(e)" to dialogue vocabulary in all blocks...\n')

	// Fetch the lesson
	const { data: lesson, error: fetchError } = await supabase
		.from('course_lessons')
		.select('id, slug, blocks_fr, blocks_ru, blocks_en')
		.eq('slug', 'bonjour-saluer-prendre-conge')
		.single()

	if (fetchError) {
		console.error('❌ Error fetching lesson:', fetchError)
		return
	}

	const updates = {}

	// Update blocks_fr
	const dialogueIndex_fr = lesson.blocks_fr?.findIndex(block => block.type === 'dialogue')
	if (dialogueIndex_fr !== -1) {
		const hasEnchante = lesson.blocks_fr[dialogueIndex_fr].vocabulary?.some(
			v => v.word.includes('Enchanté')
		)
		if (!hasEnchante) {
			const updatedBlocks_fr = [...lesson.blocks_fr]
			updatedBlocks_fr[dialogueIndex_fr] = {
				...updatedBlocks_fr[dialogueIndex_fr],
				vocabulary: [
					...updatedBlocks_fr[dialogueIndex_fr].vocabulary,
					{
						word: "Enchanté(e)",
						category: "expressions",
						translation: "Ravi(e) de faire votre connaissance"
					}
				]
			}
			updates.blocks_fr = updatedBlocks_fr
			console.log('✅ Added "Enchanté(e)" to blocks_fr')
		} else {
			console.log('⚠️  "Enchanté(e)" already exists in blocks_fr')
		}
	}

	// Update blocks_ru
	const dialogueIndex_ru = lesson.blocks_ru?.findIndex(block => block.type === 'dialogue')
	if (dialogueIndex_ru !== -1) {
		const hasEnchante = lesson.blocks_ru[dialogueIndex_ru].vocabulary?.some(
			v => v.word.includes('Enchanté')
		)
		if (!hasEnchante) {
			const updatedBlocks_ru = [...lesson.blocks_ru]
			updatedBlocks_ru[dialogueIndex_ru] = {
				...updatedBlocks_ru[dialogueIndex_ru],
				vocabulary: [
					...updatedBlocks_ru[dialogueIndex_ru].vocabulary,
					{
						word: "Enchanté(e)",
						category: "expressions",
						translation: "Очень приятно"
					}
				]
			}
			updates.blocks_ru = updatedBlocks_ru
			console.log('✅ Added "Enchanté(e)" to blocks_ru')
		} else {
			console.log('⚠️  "Enchanté(e)" already exists in blocks_ru')
		}
	}

	// Update blocks_en
	const dialogueIndex_en = lesson.blocks_en?.findIndex(block => block.type === 'dialogue')
	if (dialogueIndex_en !== -1) {
		const hasEnchante = lesson.blocks_en[dialogueIndex_en].vocabulary?.some(
			v => v.word.includes('Enchanté')
		)
		if (!hasEnchante) {
			const updatedBlocks_en = [...lesson.blocks_en]
			updatedBlocks_en[dialogueIndex_en] = {
				...updatedBlocks_en[dialogueIndex_en],
				vocabulary: [
					...updatedBlocks_en[dialogueIndex_en].vocabulary,
					{
						word: "Enchanté(e)",
						category: "expressions",
						translation: "Nice to meet you / Pleased to meet you"
					}
				]
			}
			updates.blocks_en = updatedBlocks_en
			console.log('✅ Added "Enchanté(e)" to blocks_en')
		} else {
			console.log('⚠️  "Enchanté(e)" already exists in blocks_en')
		}
	}

	// Update the lesson if there are changes
	if (Object.keys(updates).length > 0) {
		const { error: updateError } = await supabase
			.from('course_lessons')
			.update(updates)
			.eq('id', lesson.id)

		if (updateError) {
			console.error('❌ Error updating lesson:', updateError)
			return
		}

		console.log('\n✅ Successfully updated dialogue vocabulary!')
	} else {
		console.log('\n⚠️  No updates needed - "Enchanté(e)" already exists in all blocks')
	}
}

main()
