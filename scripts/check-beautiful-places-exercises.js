const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkExercises() {
	console.log('Checking exercises for Russian beautiful-places materials...\n')

	// Get all Russian beautiful-places materials
	const { data: materials, error: materialsError } = await supabase
		.from('materials')
		.select('id, title, section, lang')
		.eq('section', 'beautiful-places')
		.eq('lang', 'ru')
		.order('id', { ascending: true })

	if (materialsError) {
		console.error('Error fetching materials:', materialsError)
		return
	}

	console.log(`Found ${materials.length} Russian beautiful-places materials\n`)

	// Check exercises for each material
	for (const material of materials) {
		const { data: exercises, error: exercisesError } = await supabase
			.from('exercises')
			.select('id, title, type, xp_reward')
			.eq('material_id', material.id)

		if (exercisesError) {
			console.error(`Error fetching exercises for material ${material.id}:`, exercisesError)
			continue
		}

		console.log(`Material #${material.id}: "${material.title}"`)
		if (exercises && exercises.length > 0) {
			console.log(`  ✅ ${exercises.length} exercise(s):`)
			exercises.forEach(ex => {
				console.log(`     - ${ex.type}: "${ex.title}" (${ex.xp_reward} XP)`)
			})
		} else {
			console.log(`  ❌ No exercises found`)
		}
		console.log('')
	}

	// Summary
	const { data: allExercises } = await supabase
		.from('exercises')
		.select('id, material_id')
		.in('material_id', materials.map(m => m.id))

	const materialsWithExercises = materials.filter(m =>
		allExercises.some(ex => ex.material_id === m.id)
	)

	console.log('\n=== SUMMARY ===')
	console.log(`Total materials: ${materials.length}`)
	console.log(`Materials with exercises: ${materialsWithExercises.length}`)
	console.log(`Materials without exercises: ${materials.length - materialsWithExercises.length}`)
	console.log(`Total exercises: ${allExercises.length}`)
}

checkExercises()
	.then(() => {
		console.log('\nCheck completed!')
		process.exit(0)
	})
	.catch(err => {
		console.error('Error:', err)
		process.exit(1)
	})
