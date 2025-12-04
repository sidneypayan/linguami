/**
 * Delete all questions from the aspects theme (beginner)
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
	console.log('🔍 Finding aspects theme...')

	const { data: theme, error: themeError } = await supabase
		.from('training_themes')
		.select('*')
		.eq('key', 'aspects')
		.eq('lang', 'ru')
		.eq('level', 'beginner')
		.single()

	if (themeError || !theme) {
		console.error('❌ Theme not found:', themeError?.message)
		process.exit(1)
	}

	console.log(`✅ Found theme: ${theme.label_fr} (ID: ${theme.id})`)

	// Count questions
	const { count } = await supabase
		.from('training_questions')
		.select('*', { count: 'exact', head: true })
		.eq('theme_id', theme.id)

	console.log(`\n📊 Questions to delete: ${count}`)

	// Delete all questions
	console.log('\n🗑️  Deleting questions...')

	const { error: deleteError } = await supabase
		.from('training_questions')
		.delete()
		.eq('theme_id', theme.id)

	if (deleteError) {
		console.error('❌ Error deleting questions:', deleteError)
		process.exit(1)
	}

	console.log(`✅ Successfully deleted ${count} questions!`)

	// Delete the theme
	console.log('\n🗑️  Deleting theme...')

	const { error: deleteThemeError } = await supabase
		.from('training_themes')
		.delete()
		.eq('id', theme.id)

	if (deleteThemeError) {
		console.error('❌ Error deleting theme:', deleteThemeError)
		process.exit(1)
	}

	console.log('✅ Theme deleted!')
	console.log('\n✨ Done! All aspects questions have been removed.')
}

main()
