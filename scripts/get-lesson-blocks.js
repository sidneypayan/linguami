import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getLessonBlocks() {
	const { data: lesson, error } = await supabase
		.from('lessons')
		.select('blocks_fr, blocks_en, blocks_ru')
		.eq('slug', 'alphabet-sons-et-accents')
		.single()

	if (error) {
		console.error('Error:', error)
		return
	}

	console.log('Lesson blocks (FR):')
	const blockTypes = new Set()

	if (lesson.blocks_fr) {
		lesson.blocks_fr.forEach((block, index) => {
			blockTypes.add(block.type)
			console.log(`${index + 1}. ${block.type}`)
		})
	}

	console.log('\nUnique block types used:')
	console.log(Array.from(blockTypes).sort().join(', '))
}

getLessonBlocks()
