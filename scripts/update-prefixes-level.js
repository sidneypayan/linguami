/**
 * Update prefixes theme level from beginner to intermediate
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
	console.log('🔍 Finding prefixes theme...')

	const { data: theme, error: themeError } = await supabase
		.from('training_themes')
		.select('*')
		.eq('key', 'prefixes')
		.eq('lang', 'ru')
		.single()

	if (themeError || !theme) {
		console.error('❌ Theme not found:', themeError?.message)
		process.exit(1)
	}

	console.log(`✅ Found theme: ${theme.label_fr} (ID: ${theme.id})`)
	console.log(`   Current level: ${theme.level}`)

	// Count questions
	const { count } = await supabase
		.from('training_questions')
		.select('*', { count: 'exact', head: true })
		.eq('theme_id', theme.id)

	console.log(`   Questions: ${count}`)

	// Update level
	console.log('\n📝 Updating level to intermediate...')

	const { error: updateError } = await supabase
		.from('training_themes')
		.update({ level: 'intermediate' })
		.eq('id', theme.id)

	if (updateError) {
		console.error('❌ Error updating theme:', updateError)
		process.exit(1)
	}

	console.log('✅ Theme level updated successfully!')
	console.log(`   ${theme.label_fr}: beginner → intermediate`)
	console.log(`   All ${count} questions are now at intermediate level`)
}

main()
