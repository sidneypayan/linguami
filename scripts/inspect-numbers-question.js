/**
 * Inspect the structure of a numbers question
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
	console.log('🔍 Fetching a numbers question...')

	const { data: question, error } = await supabase
		.from('training_questions')
		.select('*')
		.eq('id', 120)
		.single()

	if (error) {
		console.error('❌ Error:', error)
		process.exit(1)
	}

	console.log('\n📋 Question structure:')
	console.log(JSON.stringify(question, null, 2))
}

main()
