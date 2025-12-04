/**
 * Script to add sentences column to training_questions table
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
	console.error('Missing Supabase credentials in .env.production')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
	console.log('🔧 Adding sentences column to training_questions...')

	// Check if column already exists
	const { data: columns, error: checkError } = await supabase
		.from('training_questions')
		.select('*')
		.limit(1)

	if (checkError) {
		console.error('❌ Error checking table:', checkError)
		process.exit(1)
	}

	if (columns && columns.length > 0 && columns[0].sentences !== undefined) {
		console.log('✅ Column "sentences" already exists!')
		return
	}

	console.log('⚠️  Column does not exist. Please run this SQL manually in Supabase SQL Editor:')
	console.log('\n' + '='.repeat(60))
	console.log(`
ALTER TABLE training_questions
ADD COLUMN IF NOT EXISTS sentences JSONB;

COMMENT ON COLUMN training_questions.sentences IS 'For multi_fill type: array of sentences with blanks. Each: {text: "sentence with ___", correct: index}';

COMMENT ON TABLE training_questions IS 'Training questions with MCQ, dropdown, or multi_fill format';
`)
	console.log('='.repeat(60) + '\n')

	console.log('📖 Instructions:')
	console.log('1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new')
	console.log('2. Copy and paste the SQL above')
	console.log('3. Click "Run"')
	console.log('4. Come back and run this script again to create the exercises')
}

main()
