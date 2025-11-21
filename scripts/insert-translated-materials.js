/**
 * Step 2: Insert translated French materials into production DB
 * ⚠️ WORKS ON PRODUCTION DATABASE ⚠️
 *
 * This script:
 * 1. Reads the ru-to-fr-translations.json file
 * 2. Validates that all translations are complete
 * 3. Inserts the new French materials into the database
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('⚠️  WORKING ON PRODUCTION DATABASE')
console.log(`   URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`)

function generateSlug(title) {
	return title
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Remove accents
		.replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
		.replace(/^-+|-+$/g, '') // Remove leading/trailing -
}

async function insertTranslatedMaterials() {
	const translationsPath = 'D:/linguami/scripts/ru-to-fr-translations.json'

	// Check if file exists
	if (!fs.existsSync(translationsPath)) {
		console.error('❌ Translation file not found:', translationsPath)
		console.log('   Run prepare-ru-to-fr-translations.js first!')
		return
	}

	// Read translations
	const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'))
	console.log(`📖 Loaded ${translations.length} translations from file\n`)

	// Validate translations
	console.log('🔍 Validating translations...')
	const incomplete = translations.filter(
		t => !t.title_fr || !t.title_fr.trim() || !t.content_fr || !t.content_fr.trim()
	)

	if (incomplete.length > 0) {
		console.error(`❌ ${incomplete.length} materials are missing translations:`)
		incomplete.forEach(item => {
			console.log(`   - ${item.original_title_ru}`)
			if (!item.title_fr || !item.title_fr.trim()) console.log('     Missing: title_fr')
			if (!item.content_fr || !item.content_fr.trim()) console.log('     Missing: content_fr')
		})
		console.log('\n❌ Please complete all translations before inserting.')
		return
	}

	console.log('✅ All translations are complete!\n')

	// Prepare materials for insertion
	const materialsToInsert = translations.map(t => ({
		title: t.title_fr,
		slug: generateSlug(t.title_fr),
		section: t.section,
		lang: 'fr',
		level: t.level,
		content: t.content_fr,
		image_url: t.image_url,
		video_url: t.video_url,
		author: t.author_fr
	}))

	console.log('📋 Materials to insert:')
	console.log('═'.repeat(80))
	materialsToInsert.forEach((mat, i) => {
		console.log(`${i + 1}. [${mat.section}] ${mat.title}`)
		console.log(`   Slug: ${mat.slug}`)
		console.log(`   Level: ${mat.level}`)
		console.log('')
	})

	// Ask for confirmation
	console.log('⚠️  WARNING: About to insert 14 new materials into PRODUCTION database!')
	console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n')

	await new Promise(resolve => setTimeout(resolve, 5000))

	console.log('🚀 Inserting materials into database...\n')

	// Insert materials one by one with error handling
	let successCount = 0
	let errorCount = 0

	for (const material of materialsToInsert) {
		const { data, error } = await supabase
			.from('materials')
			.insert([material])
			.select()

		if (error) {
			console.error(`❌ Error inserting "${material.title}":`, error.message)
			errorCount++
		} else {
			console.log(`✅ Inserted: ${material.title} (ID: ${data[0].id})`)
			successCount++
		}
	}

	console.log('\n═'.repeat(80))
	console.log(`✅ Insertion complete!`)
	console.log(`   Success: ${successCount}`)
	console.log(`   Errors: ${errorCount}`)

	if (successCount > 0) {
		console.log('\n🎉 French materials successfully added to production database!')
	}
}

insertTranslatedMaterials().catch(console.error)
