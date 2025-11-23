import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkSchema() {
	// Get first material to see structure
	const { data, error } = await supabase
		.from('materials')
		.select('*')
		.limit(1)
		.single()

	if (error) {
		console.error('Error:', error)
		return
	}

	console.log('Materials table columns:')
	console.log(Object.keys(data))
}

checkSchema()
