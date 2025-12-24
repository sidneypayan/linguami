/**
 * Script to compare two lessons from the database
 * Usage: node scripts/compare-lessons.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function compareLessons() {
	console.log('Fetching lessons and exercises from database...\n')

	// Check exercises for French lesson (lesson_id = 1)
	const { data: exercises, error: exError } = await supabase
		.from('exercises')
		.select('*')
		.eq('lesson_id', 1)

	if (exError) {
		console.error('Error fetching exercises:', exError)
	} else {
		console.log('=== EXERCISES FOR FRENCH LESSON (lesson_id=1) ===')
		exercises.forEach(ex => {
			console.log(`\n[${ex.id}] ${ex.title}`)
			console.log(`Type: ${ex.type}, Level: ${ex.level}, XP: ${ex.xp_reward}`)
			console.log('Data:', JSON.stringify(ex.data, null, 2))
		})
		console.log('')
	}

	// First, list all lessons to see what's available
	const { data: allLessons, error: listError } = await supabase
		.from('lessons')
		.select('*')
		.order('id')
		.limit(20)

	if (listError) {
		console.error('Error listing lessons:', listError)
		return
	}

	console.log('Available lessons in "lessons" table:')
	if (allLessons.length > 0) {
		console.log('Columns:', Object.keys(allLessons[0]).join(', '))
	}
	allLessons.forEach(l => {
		console.log(`  [${l.id}] ${l.slug} - ${l.title_fr || l.title_en || l.title}`)
	})
	console.log('\n')

	// Fetch French lesson to see exercise structure
	const { data: lessons, error } = await supabase
		.from('lessons')
		.select('*')
		.eq('slug', 'alphabet-sons-et-accents')

	if (error) {
		console.error('Error fetching lessons:', error)
		return
	}

	if (!lessons || lessons.length === 0) {
		console.log('No lessons found with these slugs')
		return
	}

	for (const lesson of lessons) {
		console.log('='.repeat(80))
		console.log(`LESSON: ${lesson.slug}`)
		console.log('='.repeat(80))
		console.log(`Title FR: ${lesson.title_fr}`)
		console.log(`Title EN: ${lesson.title_en}`)
		console.log(`Title RU: ${lesson.title_ru}`)
		console.log(`Course ID: ${lesson.course_id}`)
		console.log(`Order Index: ${lesson.order_index}`)
		console.log(`Is Published: ${lesson.is_published}`)
		console.log(`Is Free: ${lesson.is_free}`)
		console.log('')

		console.log('--- OBJECTIVES FR ---')
		console.log(JSON.stringify(lesson.objectives_fr, null, 2))
		console.log('')

		console.log('--- OBJECTIVES EN ---')
		console.log(JSON.stringify(lesson.objectives_en, null, 2))
		console.log('')

		console.log('--- ALL BLOCK TYPES (blocks_fr) ---')
		if (lesson.blocks_fr) {
			const types = lesson.blocks_fr.map((b, i) => `${i+1}. ${b.type}`)
			console.log(types.join('\n'))
			console.log(`\nTotal blocks: ${lesson.blocks_fr.length}`)
		} else {
			console.log('No blocks_fr')
		}

		console.log('\n--- EXERCISE BLOCKS ONLY (blocks_en) ---')
		if (lesson.blocks_en) {
			lesson.blocks_en.forEach((block, i) => {
				if (block.type && block.type.includes('exercise')) {
					console.log(`\n[Block ${i + 1}] Type: ${block.type}`)
					console.log(JSON.stringify(block, null, 2))
				}
			})
		} else {
			console.log('No blocks_en')
		}

		console.log('\n')
	}
}

compareLessons().catch(console.error)
