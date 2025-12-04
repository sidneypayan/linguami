/**
 * Script to list all questions for the prefixes theme
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env.local (dev database)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing Supabase credentials in .env.local')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
	console.log('🔍 Finding theme "prefixes" for Russian...')

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

	// Get all questions for this theme
	const { data: questions, error } = await supabase
		.from('training_questions')
		.select('*')
		.eq('theme_id', theme.id)
		.order('id', { ascending: true })

	if (error) {
		console.error('❌ Error fetching questions:', error)
		process.exit(1)
	}

	console.log(`\n📝 Found ${questions.length} questions:\n`)

	questions.forEach((q, i) => {
		const sentenceCount = q.sentences?.length || 0
		const questionText = q.question_fr || q.question_en || q.sentence || 'N/A'
		console.log(`${i + 1}. ID ${q.id} - Type: ${q.type} - Sentences: ${sentenceCount}`)
		console.log(`   Question: ${questionText.substring(0, 60)}${questionText.length > 60 ? '...' : ''}`)
		console.log(`   Created: ${q.created_at}`)
		console.log()
	})

	console.log(`\n💡 To delete old questions, note their IDs from above.`)
}

main()
