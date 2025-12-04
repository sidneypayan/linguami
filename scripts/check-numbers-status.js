/**
 * Check status of numbers questions
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
	console.log('🔍 Checking numbers theme questions...')

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

	console.log(`✅ Theme: ${theme.label_fr} (ID: ${theme.id})`)

	// Get all questions
	const { data: questions, error: questionsError } = await supabase
		.from('training_questions')
		.select('id, is_active, question_ru, created_at')
		.eq('theme_id', theme.id)
		.order('id', { ascending: true })

	if (questionsError) {
		console.error('❌ Error:', questionsError)
		process.exit(1)
	}

	console.log(`\n📊 Total questions: ${questions.length}`)

	const activeCount = questions.filter((q) => q.is_active).length
	const inactiveCount = questions.filter((q) => !q.is_active).length

	console.log(`   Active: ${activeCount}`)
	console.log(`   Inactive: ${inactiveCount}`)

	console.log('\n📝 Questions:')
	questions.forEach((q, i) => {
		const status = q.is_active ? '✅' : '❌'
		const preview = q.question_ru.substring(0, 40)
		console.log(`   ${i + 1}. ${status} ID ${q.id} - ${preview}...`)
	})

	if (inactiveCount > 0) {
		console.log('\n⚠️  Some questions are inactive!')
		console.log('   Activating all questions...')

		const { error: updateError } = await supabase
			.from('training_questions')
			.update({ is_active: true })
			.eq('theme_id', theme.id)
			.eq('is_active', false)

		if (updateError) {
			console.error('❌ Error:', updateError)
			process.exit(1)
		}

		console.log('✅ All questions activated!')
	} else {
		console.log('\n✅ All questions are already active!')
	}
}

main()
