const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function updateMaterial144() {
	// Get current content
	const { data: material, error: fetchError } = await supabase
		.from('materials')
		.select('id, title, content')
		.eq('id', 144)
		.single()

	if (fetchError) {
		console.error('Error fetching material:', fetchError)
		return
	}

	console.log('Current content:', material.content)
	console.log('\n---\n')

	// Add "доброй" and "J'enseigne" to the text
	// Current content may have already been updated
	let newContent = material.content

	// Add "доброй" if not present
	if (!newContent.includes('доброй')) {
		newContent = newContent.replace('История Красной', 'История доброй Красной')
	}

	// Add "J'enseigne" at the end
	if (!newContent.includes("J'enseigne")) {
		newContent = newContent.trim()
		if (!newContent.endsWith('.')) {
			newContent += '.'
		}
		newContent += " J'enseigne le russe."
	}

	console.log('New content:', newContent)

	// Update material
	const { error: updateError } = await supabase
		.from('materials')
		.update({ content: newContent })
		.eq('id', 144)

	if (updateError) {
		console.error('Error updating material:', updateError)
		return
	}

	console.log('\n✅ Material 144 updated successfully!')
}

updateMaterial144()
