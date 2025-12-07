/**
 * Direct test to update one lesson and verify
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

async function test() {
	// Fetch one lesson
	const { data: lesson } = await supabase
		.from('course_lessons')
		.select('id, slug, blocks_fr')
		.eq('slug', 'bonjour-saluer-prendre-conge')
		.single()

	console.log('BEFORE UPDATE:')
	console.log('Has pronunciation?', JSON.stringify(lesson.blocks_fr).includes('pronunciation'))

	// Create a simple test update - remove pronunciation from first vocabulary block
	const updatedBlocks = lesson.blocks_fr.map(block => {
		if (block.type === 'vocabulary' && block.words) {
			return {
				...block,
				words: block.words.map(({ pronunciation, ...word }) => word)
			}
		}
		return block
	})

	console.log('\nAFTER CLEANING (in memory):')
	console.log('Has pronunciation?', JSON.stringify(updatedBlocks).includes('pronunciation'))

	// Update
	const { data: updated, error } = await supabase
		.from('course_lessons')
		.update({ blocks_fr: updatedBlocks })
		.eq('id', lesson.id)
		.select()

	if (error) {
		console.error('ERROR:', error)
		return
	}

	console.log('\nAFTER UPDATE (from DB):')
	console.log('Has pronunciation?', JSON.stringify(updated[0].blocks_fr).includes('pronunciation'))

	// Fetch again to double-check
	const { data: refetch } = await supabase
		.from('course_lessons')
		.select('blocks_fr')
		.eq('id', lesson.id)
		.single()

	console.log('\nAFTER REFETCH (fresh from DB):')
	console.log('Has pronunciation?', JSON.stringify(refetch.blocks_fr).includes('pronunciation'))
}

test()
