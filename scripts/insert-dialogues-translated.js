/**
 * Insert translated French dialogues into production database
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

function generateSlug(title) {
	return title
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Remove accents
		.replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
		.replace(/^-+|-+$/g, '') // Remove leading/trailing -
}

async function insertTranslatedDialogues() {
	const translationsPath = 'D:/linguami/scripts/dialogues-to-translate.json'

	// Check if file exists
	if (!fs.existsSync(translationsPath)) {
		console.error('❌ Translation file not found:', translationsPath)
		console.log('   Run prepare-dialogues-translation.js first!')
		return
	}

	// Read translations
	const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'))
	console.log(`📖 Loaded ${translations.length} dialogues from file\n`)

	// Validate translations
	console.log('🔍 Validating translations...')
	const incomplete = translations.filter(
		t => !t.title_fr || !t.title_fr.trim() || !t.content_fr || !t.content_fr.trim()
	)

	if (incomplete.length > 0) {
		console.error(`\n❌ ${incomplete.length} dialogues are missing translations:`)
		incomplete.forEach((item, i) => {
			console.log(`   ${i + 1}. ${item.original_title_ru}`)
			if (!item.title_fr || !item.title_fr.trim()) console.log('      Missing: title_fr')
			if (!item.content_fr || !item.content_fr.trim()) console.log('      Missing: content_fr')
		})
		console.log('\n❌ Please complete all translations before inserting.')
		return
	}

	console.log('✅ All translations are complete!\n')

	// Prepare dialogues for insertion
	const dialoguesToInsert = translations.map(t => ({
		title: t.title_fr,
		slug: generateSlug(t.title_fr),
		section: 'dialogues',
		lang: 'fr',
		level: t.level,
		content: t.content_fr,
		image_url: t.image_url,
		video_url: t.video_url,
		author: t.author
	}))

	console.log('📋 Dialogues to insert into PRODUCTION:')
	console.log('═'.repeat(80))
	dialoguesToInsert.forEach((dialog, i) => {
		console.log(`${(i + 1).toString().padStart(2)}. ${dialog.title}`)
		console.log(`    Slug: ${dialog.slug}`)
		console.log(`    Level: ${dialog.level || 'not specified'}`)
		console.log(`    Content: ${dialog.content.substring(0, 60)}...`)
		console.log('')
	})

	// Confirmation
	console.log('\n⚠️  WARNING: About to insert ' + dialoguesToInsert.length + ' new dialogues into PRODUCTION!')
	console.log('   This will add French dialogues to your live database.')
	console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n')

	await new Promise(resolve => setTimeout(resolve, 5000))

	console.log('🚀 Inserting dialogues into production database...\n')

	// Insert dialogues one by one
	let successCount = 0
	let errorCount = 0
	const errors = []

	for (const dialog of dialoguesToInsert) {
		const { data, error } = await supabase
			.from('materials')
			.insert([dialog])
			.select()

		if (error) {
			console.error(`❌ Error inserting "${dialog.title}":`, error.message)
			errors.push({ title: dialog.title, error: error.message })
			errorCount++
		} else {
			console.log(`✅ Inserted: ${dialog.title} (ID: ${data[0].id})`)
			successCount++
		}
	}

	console.log('\n' + '═'.repeat(80))
	console.log(`📊 Insertion Results:`)
	console.log(`   ✅ Success: ${successCount}`)
	console.log(`   ❌ Errors: ${errorCount}`)

	if (errors.length > 0) {
		console.log('\n❌ Failed insertions:')
		errors.forEach(err => {
			console.log(`   - ${err.title}: ${err.error}`)
		})
	}

	if (successCount > 0) {
		console.log('\n🎉 French dialogues successfully added to production database!')
		console.log(`   You now have ${successCount} more French dialogues!`)
	}
}

insertTranslatedDialogues().catch(console.error)
