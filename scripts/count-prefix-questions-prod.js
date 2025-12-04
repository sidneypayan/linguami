/**
 * Quick script to count prefix questions in production DB
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env.production (prod database)
dotenv.config({ path: path.resolve(__dirname, '../.env.production') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing Supabase credentials in .env.production')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
	console.log('🔍 Counting prefix questions in production DB...')

	// Find the theme
	const { data: theme, error: themeError } = await supabase
		.from('training_themes')
		.select('id, key, label_fr, level')
		.eq('key', 'prefixes')
		.eq('lang', 'ru')
		.single()

	if (themeError || !theme) {
		console.error('❌ Theme not found:', themeError?.message || 'No theme returned')
		process.exit(1)
	}

	console.log(`✅ Found theme: ${theme.label_fr} (ID: ${theme.id}, Level: ${theme.level})`)

	// Count questions
	const { count, error: countError } = await supabase
		.from('training_questions')
		.select('*', { count: 'exact', head: true })
		.eq('theme_id', theme.id)

	if (countError) {
		console.error('❌ Error counting questions:', countError)
		process.exit(1)
	}

	console.log(`\n📊 Total questions: ${count}`)

	// Get first and last questions for verification
	const { data: questions, error: questionsError } = await supabase
		.from('training_questions')
		.select('id, created_at, options')
		.eq('theme_id', theme.id)
		.order('created_at', { ascending: true })
		.limit(5)

	if (questionsError) {
		console.error('❌ Error fetching questions:', questionsError)
		process.exit(1)
	}

	console.log('\n🔢 First 5 questions:')
	questions.forEach((q, i) => {
		const root = q.options[0].match(/[а-я]+$/i)?.[0] || 'unknown'
		console.log(`   ${i + 1}. ID ${q.id} - Root: ${root} - Created: ${q.created_at}`)
	})

	// Get last questions
	const { data: lastQuestions, error: lastError } = await supabase
		.from('training_questions')
		.select('id, created_at, options')
		.eq('theme_id', theme.id)
		.order('created_at', { ascending: false })
		.limit(5)

	if (lastError) {
		console.error('❌ Error fetching last questions:', lastError)
		process.exit(1)
	}

	console.log('\n🔢 Last 5 questions:')
	lastQuestions.forEach((q, i) => {
		const root = q.options[0].match(/[а-я]+$/i)?.[0] || 'unknown'
		console.log(`   ${i + 1}. ID ${q.id} - Root: ${root} - Created: ${q.created_at}`)
	})
}

main()
