/**
 * Script to check existing Russian lessons in the database
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkRussianLessons() {
	console.log('🔍 Checking ALL Russian lessons in database...\n')

	// Get French lesson 1 to check structure
	const { data: lessons, error: lessonsError } = await supabase
		.from('lessons')
		.select('*')
		.eq('target_language', 'fr')
		.limit(1)

	if (lessonsError) {
		console.error('❌ Error fetching lessons:', lessonsError)
		return
	}

	console.log(`📖 Russian lessons found: ${lessons.length}\n`)

	if (lessons.length === 0) {
		console.log('No lessons found.')
	} else {
		lessons.forEach((lesson, index) => {
			const titleFr = lesson.title_fr || ''
			const titleRu = lesson.title_ru || ''
			const slug = lesson.slug || 'no-slug'
			console.log(`✅ Leçon ${lesson.order_index + 1}: ${titleFr}`)
			console.log(`   RU: ${titleRu}`)
			console.log(`   Slug: ${slug}`)
			console.log(`   Course ID: ${lesson.course_id}`)
			console.log('')
		})
	}

	console.log('\n✅ Done!')
}

checkRussianLessons()
