/**
 * Detailed analysis of Russian and French materials
 * ⚠️ WORKS ON PRODUCTION DATABASE ⚠️
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('⚠️  WORKING ON PRODUCTION DATABASE')
console.log(`   URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`)

async function analyzeDialogues() {
	// Fetch Russian materials
	const { data: ruMaterials } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'ru')
		.order('id')

	// Fetch French materials
	const { data: frMaterials } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'fr')
		.order('id')

	console.log('📋 RUSSIAN MATERIALS:')
	console.log('═'.repeat(80))
	ruMaterials.forEach((mat, i) => {
		console.log(`${i + 1}. [ID: ${mat.id}] ${mat.title}`)
		console.log(`   Slug: ${mat.slug || 'NULL'}`)
		console.log(`   Section: ${mat.section || 'NULL'}`)
		console.log(`   Level: ${mat.level || 'NULL'}`)
		console.log('')
	})

	console.log('\n📋 FRENCH MATERIALS:')
	console.log('═'.repeat(80))
	frMaterials.forEach((mat, i) => {
		console.log(`${i + 1}. [ID: ${mat.id}] ${mat.title}`)
		console.log(`   Slug: ${mat.slug || 'NULL'}`)
		console.log(`   Section: ${mat.section || 'NULL'}`)
		console.log(`   Level: ${mat.level || 'NULL'}`)
		console.log('')
	})

	// Create maps by title for comparison
	const frTitlesSet = new Set(frMaterials.map(m => m.title.toLowerCase().trim()))
	const ruNotInFr = ruMaterials.filter(ruMat =>
		!frTitlesSet.has(ruMat.title.toLowerCase().trim())
	)

	if (ruNotInFr.length > 0) {
		console.log('\n🔍 RUSSIAN MATERIALS NOT FOUND IN FRENCH (by title):')
		console.log('═'.repeat(80))
		ruNotInFr.forEach(mat => {
			console.log(`- ${mat.title} (ID: ${mat.id}, slug: ${mat.slug})`)
		})
	} else {
		console.log('\n✅ All Russian material titles have French equivalents')
	}

	// Save detailed report
	const fs = require('fs')
	const report = {
		russian: ruMaterials,
		french: frMaterials,
		russiNotInFrench: ruNotInFr
	}
	fs.writeFileSync(
		'D:/linguami/scripts/dialogues-analysis.json',
		JSON.stringify(report, null, 2)
	)
	console.log('\n✓ Detailed report saved to: scripts/dialogues-analysis.json')
}

analyzeDialogues().catch(console.error)
