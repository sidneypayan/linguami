/**
 * Create beginner theme for verb aspects and move the 101 new questions there
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
	console.log('🔍 Finding existing themes...')

	// Check if beginner aspects theme exists
	const { data: existingTheme } = await supabase
		.from('training_themes')
		.select('*')
		.eq('key', 'aspects')
		.eq('lang', 'ru')
		.eq('level', 'beginner')
		.single()

	let aspectsTheme

	if (existingTheme) {
		console.log(`✅ Found existing beginner aspects theme (ID: ${existingTheme.id})`)
		aspectsTheme = existingTheme
	} else {
		console.log('📝 Creating new beginner theme for verb aspects...')

		const { data: newTheme, error: createError } = await supabase
			.from('training_themes')
			.insert({
				key: 'aspects',
				label_fr: 'Aspects verbaux',
				label_en: 'Verb Aspects',
				label_ru: 'Глагольные виды',
				lang: 'ru',
				level: 'beginner',
			})
			.select()
			.single()

		if (createError) {
			console.error('❌ Error creating theme:', createError)
			process.exit(1)
		}

		aspectsTheme = newTheme
		console.log(`✅ Created new theme (ID: ${aspectsTheme.id})`)
	}

	// Find the prefixes theme
	const { data: prefixesTheme, error: prefixError } = await supabase
		.from('training_themes')
		.select('*')
		.eq('key', 'prefixes')
		.eq('lang', 'ru')
		.single()

	if (prefixError || !prefixesTheme) {
		console.error('❌ Prefixes theme not found')
		process.exit(1)
	}

	console.log(`\n✅ Found prefixes theme (ID: ${prefixesTheme.id})`)

	// Get all questions from prefixes theme
	const { data: allQuestions, error: questionsError } = await supabase
		.from('training_questions')
		.select('id, created_at')
		.eq('theme_id', prefixesTheme.id)
		.order('created_at', { ascending: true })

	if (questionsError) {
		console.error('❌ Error fetching questions:', questionsError)
		process.exit(1)
	}

	console.log(`\n📊 Total questions in prefixes theme: ${allQuestions.length}`)

	// The last 101 questions are the new ones (37 + 64)
	const questionsToMove = allQuestions.slice(-101)
	console.log(`\n📝 Moving last 101 questions to beginner aspects theme...`)

	const questionIds = questionsToMove.map((q) => q.id)

	// Update the questions
	const { error: updateError } = await supabase
		.from('training_questions')
		.update({ theme_id: aspectsTheme.id })
		.in('id', questionIds)

	if (updateError) {
		console.error('❌ Error updating questions:', updateError)
		process.exit(1)
	}

	console.log(`✅ Successfully moved ${questionIds.length} questions!`)

	// Verify counts
	const { count: prefixCount } = await supabase
		.from('training_questions')
		.select('*', { count: 'exact', head: true })
		.eq('theme_id', prefixesTheme.id)

	const { count: aspectCount } = await supabase
		.from('training_questions')
		.select('*', { count: 'exact', head: true })
		.eq('theme_id', aspectsTheme.id)

	console.log('\n📊 Final counts:')
	console.log(`   Prefixes (intermediate): ${prefixCount} questions`)
	console.log(`   Aspects (beginner): ${aspectCount} questions`)
	console.log('\n✨ Done!')
}

main()
