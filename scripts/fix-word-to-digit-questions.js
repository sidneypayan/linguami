/**
 * Fix "word to digit" questions by putting Cyrillic text in all language fields
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.production') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing Supabase credentials')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
	console.log('🔍 Finding numbers theme...')

	const { data: theme, error: themeError } = await supabase
		.from('training_themes')
		.select('*')
		.eq('key', 'numbers')
		.eq('lang', 'ru')
		.single()

	if (themeError || !theme) {
		console.error('❌ Theme not found:', themeError?.message)
		process.exit(1)
	}

	console.log(`✅ Found theme: ${theme.label_fr} (ID: ${theme.id})`)

	// Find the problematic questions (word to digit type)
	const { data: questions, error: questionsError } = await supabase
		.from('training_questions')
		.select('id, question_fr, question_en, question_ru')
		.eq('theme_id', theme.id)
		.eq('question_fr', 'Quel nombre est écrit ?')

	if (questionsError) {
		console.error('❌ Error fetching questions:', questionsError)
		process.exit(1)
	}

	console.log(`\n📊 Found ${questions.length} questions to fix:`)
	questions.forEach((q, i) => {
		console.log(`   ${i + 1}. ID ${q.id} - "${q.question_ru}"`)
	})

	if (questions.length === 0) {
		console.log('\n✅ No questions to fix!')
		return
	}

	console.log(`\n🔧 Fixing ${questions.length} questions...`)

	// Update each question to have the Cyrillic text in all language fields
	for (const question of questions) {
		const cyrillicText = question.question_ru

		const { error: updateError } = await supabase
			.from('training_questions')
			.update({
				question_fr: cyrillicText,
				question_en: cyrillicText,
				question_ru: cyrillicText,
			})
			.eq('id', question.id)

		if (updateError) {
			console.error(`❌ Error updating question ${question.id}:`, updateError)
		} else {
			console.log(`   ✅ Fixed question ${question.id}: "${cyrillicText}"`)
		}
	}

	console.log(`\n✅ Successfully fixed ${questions.length} questions!`)
	console.log('\n✨ Done! Now all interface languages will show the Russian number.')
}

main()
