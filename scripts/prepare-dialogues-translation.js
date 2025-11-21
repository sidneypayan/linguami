/**
 * Prepare missing Russian dialogues for French translation
 * ⚠️ WORKS ON PRODUCTION DATABASE ⚠️
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('⚠️  CONNECTED TO PRODUCTION DATABASE')
console.log(`   URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`)

// Manual mapping of known equivalent dialogues (RU title -> FR title)
const knownEquivalents = {
	'В аэропорту': 'A l\'aéroport',
	'Знакомство': 'Faire connaissance',
	'В такси': 'Dans le taxi',
	'В отеле': 'A l\'hôtel',
	'Как добраться?': 'Comment aller ?'
}

async function prepareDialoguesTranslation() {
	console.log('🔍 Fetching dialogues from PROD...\n')

	// Fetch all Russian dialogues
	const { data: ruDialogues, error: ruError } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'ru')
		.eq('section', 'dialogues')
		.order('id')

	if (ruError) {
		console.error('❌ Error:', ruError)
		return
	}

	// Fetch all French dialogues
	const { data: frDialogues, error: frError } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'fr')
		.eq('section', 'dialogues')
		.order('id')

	if (frError) {
		console.error('❌ Error:', frError)
		return
	}

	console.log(`✓ Found ${ruDialogues.length} Russian dialogues`)
	console.log(`✓ Found ${frDialogues.length} French dialogues\n`)

	// Identify missing dialogues
	const missingDialogues = []

	ruDialogues.forEach(ruDialog => {
		const ruTitle = ruDialog.title

		// Check if this dialogue has a known French equivalent
		const hasEquivalent = Object.keys(knownEquivalents).includes(ruTitle)

		if (!hasEquivalent) {
			// This dialogue is missing in French
			missingDialogues.push(ruDialog)
		}
	})

	console.log(`📊 Analysis:`)
	console.log(`   Total Russian dialogues: ${ruDialogues.length}`)
	console.log(`   Total French dialogues: ${frDialogues.length}`)
	console.log(`   Missing in French: ${missingDialogues.length}\n`)

	if (missingDialogues.length === 0) {
		console.log('✅ All Russian dialogues have French equivalents!')
		return
	}

	// Prepare translation template
	const translationData = missingDialogues.map(dialog => ({
		// Original Russian data
		original_id: dialog.id,
		original_title_ru: dialog.title,
		original_content_ru: dialog.content,
		original_level: dialog.level,
		original_image_url: dialog.image_url,
		original_video_url: dialog.video_url,
		original_author: dialog.author,

		// Fields to fill in (translation)
		title_fr: '', // TRANSLATE THIS
		content_fr: '', // TRANSLATE THIS

		// Fields that stay the same
		section: 'dialogues',
		level: dialog.level,
		lang: 'fr',
		image_url: dialog.image_url,
		video_url: dialog.video_url,
		author: dialog.author || null,
		slug: null // Will be auto-generated from title_fr
	}))

	// Save to JSON
	const outputPath = 'D:/linguami/scripts/dialogues-to-translate.json'
	fs.writeFileSync(outputPath, JSON.stringify(translationData, null, 2), 'utf8')

	console.log('✅ Translation template created!')
	console.log(`   File: ${outputPath}`)
	console.log(`   Dialogues to translate: ${translationData.length}\n`)

	console.log('📝 Missing dialogues to translate:')
	console.log('═'.repeat(80))
	translationData.forEach((item, i) => {
		console.log(`${(i + 1).toString().padStart(2)}. ${item.original_title_ru}`)
		console.log(`    Level: ${item.original_level || 'not specified'}`)
		console.log(`    Content: ${item.original_content_ru?.substring(0, 100)}...`)
		console.log(`    (${item.original_content_ru?.length || 0} chars)`)
		console.log('')
	})

	console.log('\n📝 Next steps:')
	console.log('   1. Open dialogues-to-translate.json')
	console.log('   2. Fill in "title_fr" and "content_fr" for each dialogue')
	console.log('   3. Run insert-dialogues-translated.js to add them to production DB')
}

prepareDialoguesTranslation().catch(console.error)
