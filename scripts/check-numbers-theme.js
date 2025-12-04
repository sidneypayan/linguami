/**
 * Check if "numbers" theme exists
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
	console.log('🔍 Looking for numbers theme in Russian...')

	const { data: themes, error } = await supabase
		.from('training_themes')
		.select('*')
		.eq('lang', 'ru')

	if (error) {
		console.error('❌ Error:', error)
		process.exit(1)
	}

	console.log(`\n📚 Found ${themes.length} Russian themes:`)
	themes.forEach((theme) => {
		console.log(`   - ${theme.key} (ID: ${theme.id}): ${theme.label_fr}`)
	})

	const numbersTheme = themes.find((t) => t.key === 'numbers' || t.key === 'nombres')
	if (numbersTheme) {
		console.log(`\n✅ Numbers theme found: ${numbersTheme.label_fr} (ID: ${numbersTheme.id})`)
	} else {
		console.log(`\n⚠️  No numbers theme found. Need to create one.`)
	}
}

main()
