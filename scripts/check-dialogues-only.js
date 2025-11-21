const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkDialogues() {
	console.log('🔍 Checking dialogues in production DB...\n')

	// Check Russian dialogues
	const { data: ruDialogues, error: ruError } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'ru')
		.eq('section', 'dialogues')
		.order('id')

	console.log(`Russian dialogues (section='dialogues'): ${ruDialogues?.length || 0}`)
	if (ruDialogues) {
		ruDialogues.forEach(d => console.log(`  - ${d.title} (ID: ${d.id})`))
	}

	// Check French dialogues
	const { data: frDialogues, error: frError } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'fr')
		.eq('section', 'dialogues')
		.order('id')

	console.log(`\nFrench dialogues (section='dialogues'): ${frDialogues?.length || 0}`)
	if (frDialogues) {
		frDialogues.forEach(d => console.log(`  - ${d.title} (ID: ${d.id})`))
	}

	// Check all sections
	console.log('\n📊 All sections in DB:')
	const { data: allMaterials } = await supabase
		.from('materials')
		.select('section, lang')

	const sections = {}
	allMaterials?.forEach(m => {
		const key = `${m.section}_${m.lang}`
		sections[key] = (sections[key] || 0) + 1
	})

	Object.keys(sections).sort().forEach(key => {
		console.log(`  ${key}: ${sections[key]}`)
	})
}

checkDialogues().catch(console.error)
