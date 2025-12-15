/**
 * Script to add missing question titles for Dropdown questions
 * Sets default titles: "Complétez la phrase" (FR) and "Complete the sentence" (EN)
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') })

// Create Supabase client for PROD DB
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL
const supabaseKey = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('❌ Missing PROD credentials in .env.local:')
	console.error('   - NEXT_PUBLIC_SUPABASE_PROD_URL')
	console.error('   - SUPABASE_PROD_SERVICE_ROLE_KEY')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: { persistSession: false }
})

console.log('🔗 Connected to PROD DB:', supabaseUrl)

async function fixDropdownTitles() {
	console.log('\n📚 Fetching all Dropdown questions without titles...\n')

	// Get all dropdown questions with empty question_fr or question_en
	const { data: questions, error } = await supabase
		.from('training_questions')
		.select('id, type, question_fr, question_en, question_ru, sentence, theme_id')
		.eq('type', 'dropdown')
		.order('id')

	if (error) {
		console.error('❌ Error fetching questions:', error)
		process.exit(1)
	}

	// Filter questions with missing titles
	const questionsToFix = questions.filter(q =>
		!q.question_fr || q.question_fr.trim() === '' ||
		!q.question_en || q.question_en.trim() === ''
	)

	console.log(`Found ${questionsToFix.length} dropdown questions with missing titles (out of ${questions.length} total dropdown questions)\n`)

	if (questionsToFix.length === 0) {
		console.log('✅ All dropdown questions already have titles!')
		return
	}

	let updatedCount = 0

	for (const question of questionsToFix) {
		const needsFr = !question.question_fr || question.question_fr.trim() === ''
		const needsEn = !question.question_en || question.question_en.trim() === ''
		const needsRu = !question.question_ru || question.question_ru.trim() === ''

		console.log(`\n📝 Updating question #${question.id}`)
		console.log(`   Sentence: "${question.sentence}"`)
		console.log(`   Current - FR: "${question.question_fr || ''}" | EN: "${question.question_en || ''}" | RU: "${question.question_ru || ''}"`)

		const updates = {}

		if (needsFr) updates.question_fr = 'Complétez la phrase'
		if (needsEn) updates.question_en = 'Complete the sentence'
		if (needsRu) updates.question_ru = 'Дополните предложение'

		console.log(`   New     - FR: "${updates.question_fr || question.question_fr}" | EN: "${updates.question_en || question.question_en}" | RU: "${updates.question_ru || question.question_ru}"`)

		// Update the question
		const { error: updateError } = await supabase
			.from('training_questions')
			.update(updates)
			.eq('id', question.id)

		if (updateError) {
			console.error(`   ❌ Error updating: ${updateError.message}`)
		} else {
			console.log(`   ✅ Updated successfully`)
			updatedCount++
		}
	}

	console.log('\n' + '='.repeat(60))
	console.log(`\n📊 Summary:`)
	console.log(`   ✅ Updated: ${updatedCount}`)
	console.log(`   ✓  Already had titles: ${questions.length - questionsToFix.length}`)
	console.log(`   📚 Total dropdown questions: ${questions.length}`)
	console.log('\n' + '='.repeat(60))
}

// Run the script
fixDropdownTitles()
	.then(() => {
		console.log('\n✨ Script completed successfully!\n')
		process.exit(0)
	})
	.catch((error) => {
		console.error('\n❌ Script failed:', error)
		process.exit(1)
	})
