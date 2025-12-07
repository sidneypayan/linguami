/**
 * Script to inspect lesson structure and find IPA patterns
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
	const { data: lesson, error } = await supabase
		.from('course_lessons')
		.select('*')
		.eq('slug', 'bonjour-saluer-prendre-conge')
		.single()

	if (error) {
		console.error('Error:', error)
		return
	}

	console.log('\n=== LESSON STRUCTURE ===\n')
	console.log('Title FR:', lesson.title_fr)
	console.log('\n=== BLOCKS_FR ===\n')
	console.log(JSON.stringify(lesson.blocks_fr, null, 2))
}

main()
