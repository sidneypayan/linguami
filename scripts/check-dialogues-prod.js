/**
 * Check dialogues in PRODUCTION database
 * Uses .env.production credentials
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

// Verify production credentials are loaded
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
	console.error('❌ Production credentials not found!')
	console.error('   Please fill in .env.production with your production credentials:')
	console.error('   - NEXT_PUBLIC_SUPABASE_URL')
	console.error('   - SUPABASE_SERVICE_ROLE_KEY')
	process.exit(1)
}

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('⚠️  CONNECTED TO PRODUCTION DATABASE')
console.log(`   URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`)

async function checkDialogues() {
	console.log('🔍 Checking dialogues in PRODUCTION DB...\n')

	// Check Russian dialogues
	const { data: ruDialogues, error: ruError } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'ru')
		.eq('section', 'dialogues')
		.order('id')

	if (ruError) {
		console.error('❌ Error fetching Russian dialogues:', ruError)
		return
	}

	console.log(`📊 Russian dialogues (section='dialogues'): ${ruDialogues?.length || 0}`)
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

	if (frError) {
		console.error('❌ Error fetching French dialogues:', frError)
		return
	}

	console.log(`\n📊 French dialogues (section='dialogues'): ${frDialogues?.length || 0}`)
	if (frDialogues) {
		frDialogues.forEach(d => console.log(`  - ${d.title} (ID: ${d.id})`))
	}

	console.log('\n📈 Summary:')
	console.log(`   Russian dialogues: ${ruDialogues?.length || 0}`)
	console.log(`   French dialogues: ${frDialogues?.length || 0}`)
	console.log(`   Missing in French: ${(ruDialogues?.length || 0) - (frDialogues?.length || 0)}`)

	// Check all Russian materials vs French materials
	console.log('\n🔍 Checking ALL materials (all sections)...')

	const { data: allRu } = await supabase
		.from('materials')
		.select('section, lang')
		.eq('lang', 'ru')

	const { data: allFr } = await supabase
		.from('materials')
		.select('section, lang')
		.eq('lang', 'fr')

	console.log(`\n📊 Total materials:`)
	console.log(`   Russian: ${allRu?.length || 0}`)
	console.log(`   French: ${allFr?.length || 0}`)

	// Group by section
	const ruBySection = {}
	const frBySection = {}

	allRu?.forEach(m => {
		ruBySection[m.section] = (ruBySection[m.section] || 0) + 1
	})

	allFr?.forEach(m => {
		frBySection[m.section] = (frBySection[m.section] || 0) + 1
	})

	console.log('\n📋 Materials by section:')
	const allSections = new Set([...Object.keys(ruBySection), ...Object.keys(frBySection)])

	allSections.forEach(section => {
		const ru = ruBySection[section] || 0
		const fr = frBySection[section] || 0
		const diff = ru - fr
		console.log(`   ${section.padEnd(20)} RU: ${ru.toString().padStart(2)}  FR: ${fr.toString().padStart(2)}  ${diff > 0 ? `(${diff} missing in FR)` : ''}`)
	})
}

checkDialogues().catch(console.error)
