import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkProfile() {
	console.log('🔍 Checking user profiles...\n')

	// Get all profiles with learning_language === spoken_language
	const { data: conflicts, error } = await supabase
		.from('users_profile')
		.select('id, email, learning_language, spoken_language')
		.not('learning_language', 'is', null)
		.not('spoken_language', 'is', null)

	if (error) {
		console.error('Error:', error)
		return
	}

	const conflictUsers = conflicts.filter(u => u.learning_language === u.spoken_language)

	console.log('Total users with language settings: ' + conflicts.length)
	console.log('Users with conflicts: ' + conflictUsers.length + '\n')

	if (conflictUsers.length > 0) {
		console.log('❌ USERS WITH CONFLICTS:\n')
		conflictUsers.forEach(user => {
			console.log('User: ' + user.email)
			console.log('  Learning: ' + user.learning_language)
			console.log('  Spoken: ' + user.spoken_language)
			console.log('')
		})
	} else {
		console.log('✅ No conflicts found!')
	}
}

checkProfile()
