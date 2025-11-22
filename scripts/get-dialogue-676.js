const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getDialogue() {
	const { data, error } = await supabase
		.from('materials')
		.select('id, title, content')
		.eq('id', 676)
		.single()

	if (error) {
		console.error('Error:', error)
		return
	}

	console.log('\n📝 Dialogue #676:\n')
	console.log('Title:', data.title)
	console.log('\nContent:')
	console.log(data.content)
}

getDialogue()
