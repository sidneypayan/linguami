const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkSpokenLanguage() {
	const { data: users, error } = await supabase
		.from('users_profile')
		.select('id, name, spoken_language, learning_language')
		.order('created_at', { ascending: false })
		.limit(10)

	if (error) {
		console.error('Error:', error)
		return
	}

	console.log('\n📊 Derniers utilisateurs (spoken_language):')
	console.log('='.repeat(80))
	users.forEach(user => {
		console.log('👤 ' + (user.name || 'No name') + ' (ID: ' + user.id.substring(0, 8) + '...)')
		console.log('   Spoken language: ' + (user.spoken_language || '❌ NOT SET'))
		console.log('   Learning language: ' + (user.learning_language || 'N/A'))
		console.log()
	})
}

checkSpokenLanguage()
