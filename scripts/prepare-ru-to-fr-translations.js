/**
 * Step 1: Prepare Russian materials for French translation
 * ⚠️ WORKS ON PRODUCTION DATABASE ⚠️
 *
 * This script:
 * 1. Fetches all Russian materials from production DB
 * 2. Creates a JSON file with the structure for French translations
 * 3. You manually translate the content
 * 4. Then run the insert script to add them to DB
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

async function prepareTranslations() {
	console.log('🔍 Fetching Russian materials from PROD...')

	const { data: ruMaterials, error } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'ru')
		.order('id')

	if (error) {
		console.error('❌ Error fetching Russian materials:', error)
		return
	}

	console.log(`✓ Found ${ruMaterials.length} Russian materials\n`)

	// Prepare translation structure
	const translationData = ruMaterials.map(mat => ({
		// Original Russian data
		original_id: mat.id,
		original_title_ru: mat.title,
		original_content_ru: mat.content,
		original_section: mat.section,
		original_level: mat.level,
		original_image_url: mat.image_url,
		original_video_url: mat.video_url,
		original_author: mat.author,

		// Fields to translate (fill these in manually)
		title_fr: '', // TRANSLATE THIS
		content_fr: '', // TRANSLATE THIS
		author_fr: mat.author, // Keep same or translate if needed

		// Fields that stay the same
		section: mat.section,
		level: mat.level,
		lang: 'fr', // New language
		image_url: mat.image_url, // Same image
		video_url: mat.video_url, // Same video if applicable
		slug: null // Will be generated from title_fr later
	}))

	// Save to JSON file
	const outputPath = 'D:/linguami/scripts/ru-to-fr-translations.json'
	fs.writeFileSync(outputPath, JSON.stringify(translationData, null, 2), 'utf8')

	console.log('✅ Translation template created!')
	console.log(`   File: ${outputPath}`)
	console.log(`   Materials to translate: ${translationData.length}`)
	console.log('\n📝 Next steps:')
	console.log('   1. Open ru-to-fr-translations.json')
	console.log('   2. Fill in the "title_fr" and "content_fr" fields')
	console.log('   3. Run the insert script to add them to the database')

	// Also create a summary
	console.log('\n📋 Materials to translate:')
	console.log('═'.repeat(80))
	translationData.forEach((item, i) => {
		console.log(`${i + 1}. [${item.section}] ${item.original_title_ru}`)
		console.log(`   Level: ${item.level}`)
		console.log(`   Content length: ${item.original_content_ru?.length || 0} chars`)
		console.log('')
	})
}

prepareTranslations().catch(console.error)
