/**
 * Script to delete old prefix questions (IDs 16, 22, 24)
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

// IDs of the old questions to delete
const oldQuestionIds = [16, 22, 24]

async function main() {
	console.log(`🗑️  Deleting ${oldQuestionIds.length} old prefix questions...`)
	console.log(`   IDs: ${oldQuestionIds.join(', ')}\n`)

	for (const id of oldQuestionIds) {
		console.log(`Deleting question ID ${id}...`)

		const { error } = await supabase
			.from('training_questions')
			.delete()
			.eq('id', id)

		if (error) {
			console.error(`❌ Error deleting question ${id}:`, error.message)
		} else {
			console.log(`✅ Deleted question ${id}`)
		}
	}

	console.log(`\n✨ Done! Remaining questions should be the 10 new ones (IDs 27-36).`)
}

main()
