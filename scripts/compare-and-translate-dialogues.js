/**
 * Script to compare Russian and French dialogues and create missing French ones
 *
 * ⚠️ WORKS ON PRODUCTION DATABASE ⚠️
 *
 * Steps:
 * 1. Fetch all Russian materials (dialogues) from PROD DB
 * 2. Fetch all French materials (dialogues) from PROD DB
 * 3. Compare to find missing French dialogues
 * 4. Generate report of missing dialogues
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// ⚠️ Production database connection
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('⚠️  WORKING ON PRODUCTION DATABASE')
console.log(`   URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`)

async function compareDialogues() {
	console.log('🔍 Fetching Russian materials from PROD...')

	// Fetch all Russian materials
	const { data: ruMaterials, error: ruError } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'ru')
		.order('id')

	if (ruError) {
		console.error('❌ Error fetching Russian materials:', ruError)
		return
	}

	console.log(`✓ Found ${ruMaterials.length} Russian materials`)

	console.log('🔍 Fetching French materials from PROD...')

	// Fetch all French materials
	const { data: frMaterials, error: frError } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'fr')
		.order('id')

	if (frError) {
		console.error('❌ Error fetching French materials:', frError)
		return
	}

	console.log(`✓ Found ${frMaterials.length} French materials`)

	// Create a map of French materials by slug (removing language suffix if any)
	const frMaterialsMap = new Map()
	frMaterials.forEach(mat => {
		if (mat.slug) {
			// Extract base slug (remove -fr, -ru suffixes if present)
			const baseSlug = mat.slug.replace(/-(fr|ru|en)$/, '')
			frMaterialsMap.set(baseSlug, mat)
		}
	})

	// Find Russian materials that don't have a French equivalent
	const missingInFrench = []

	ruMaterials.forEach(ruMat => {
		if (ruMat.slug) {
			const baseSlug = ruMat.slug.replace(/-(fr|ru|en)$/, '')

			if (!frMaterialsMap.has(baseSlug)) {
				missingInFrench.push(ruMat)
			}
		}
	})

	console.log('\n📊 Comparison Results:')
	console.log(`   Russian materials: ${ruMaterials.length}`)
	console.log(`   French materials: ${frMaterials.length}`)
	console.log(`   Missing in French: ${missingInFrench.length}`)

	if (missingInFrench.length > 0) {
		console.log('\n📝 Missing French dialogues:')
		missingInFrench.forEach((mat, index) => {
			console.log(`   ${index + 1}. [${mat.section}] ${mat.title} (slug: ${mat.slug}, level: ${mat.level})`)
		})

		// Save to file for review
		const fs = require('fs')
		const reportPath = 'D:/linguami/scripts/missing-fr-dialogues.json'
		fs.writeFileSync(reportPath, JSON.stringify(missingInFrench, null, 2))
		console.log(`\n✓ Full report saved to: ${reportPath}`)

		return missingInFrench
	} else {
		console.log('\n✅ All Russian materials have French equivalents!')
		return []
	}
}

// Run comparison
compareDialogues()
	.then(() => {
		console.log('\n✓ Comparison complete')
	})
	.catch(err => {
		console.error('❌ Error:', err)
		process.exit(1)
	})
