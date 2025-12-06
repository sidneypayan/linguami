/**
 * Delete problematic "word to digit" questions from numbers theme
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
		.select('id, question_fr, question_ru')
		.eq('theme_id', theme.id)
		.eq('question_fr', 'Quel nombre est écrit ?')

	if (questionsError) {
		console.error('❌ Error fetching questions:', questionsError)
		process.exit(1)
	}

	console.log(`\n📊 Found ${questions.length} problematic questions:`)
	questions.forEach((q, i) => {
		console.log(`   ${i + 1}. ID ${q.id} - "${q.question_ru}"`)
	})

	if (questions.length === 0) {
		console.log('\n✅ No questions to delete!')
		return
	}

	console.log(`\n🗑️  Deleting ${questions.length} questions...`)

	const questionIds = questions.map((q) => q.id)

	const { error: deleteError } = await supabase
		.from('training_questions')
		.delete()
		.in('id', questionIds)

	if (deleteError) {
		console.error('❌ Error deleting questions:', deleteError)
		process.exit(1)
	}

	console.log(`✅ Successfully deleted ${questions.length} questions!`)

	// Verify final count
	const { count } = await supabase
		.from('training_questions')
		.select('*', { count: 'exact', head: true })
		.eq('theme_id', theme.id)

	console.log(`\n📊 Remaining questions in numbers theme: ${count}`)
	console.log('\n✨ Done!')
}

main()
