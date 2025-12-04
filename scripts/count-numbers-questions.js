/**
 * Count numbers questions in production DB
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

	console.log(`✅ Found theme: ${theme.label_fr} (ID: ${theme.id}, Level: ${theme.level})`)

	// Count questions
	const { count, error: countError } = await supabase
		.from('training_questions')
		.select('*', { count: 'exact', head: true })
		.eq('theme_id', theme.id)

	if (countError) {
		console.error('❌ Error counting:', countError)
		process.exit(1)
	}

	console.log(`\n📊 Total questions: ${count}`)

	// Get all questions
	const { data: questions, error: questionsError } = await supabase
		.from('training_questions')
		.select('id, type, question_ru, created_at, is_active')
		.eq('theme_id', theme.id)
		.order('id', { ascending: true })

	if (questionsError) {
		console.error('❌ Error fetching questions:', questionsError)
		process.exit(1)
	}

	console.log('\n📝 All questions:')
	questions.forEach((q, i) => {
		const preview = q.question_ru.substring(0, 50)
		console.log(
			`   ${i + 1}. ID ${q.id} (${q.type}) - Active: ${q.is_active} - ${preview}...`,
		)
	})
}

main()
