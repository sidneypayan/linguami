const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
)

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

function ask(question) {
	return new Promise(resolve => {
		rl.question(question, resolve)
	})
}

async function getUserInfo(emailOrId) {
	console.log('\n🔍 Searching for user...\n')

	// Try to find user by email first
	let user
	if (emailOrId.includes('@')) {
		const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
		if (!authError) {
			user = authData.users.find(u => u.email === emailOrId)
		}
	} else {
		// Try to find by ID
		const { data: authData, error: authError } = await supabase.auth.admin.getUserById(emailOrId)
		if (!authError) {
			user = authData.user
		}
	}

	if (!user) {
		console.log('❌ User not found in authentication')
		return null
	}

	// Get profile info
	const { data: profile } = await supabase
		.from('users_profile')
		.select('*')
		.eq('id', user.id)
		.single()

	const { data: xpProfile } = await supabase
		.from('user_xp_profile')
		.select('*')
		.eq('user_id', user.id)
		.single()

	return { user, profile, xpProfile }
}

async function countUserData(userId) {
	console.log('\n📊 Analyzing user data...\n')

	const counts = {}

	// Count data in each table
	const tables = [
		'user_words',
		'user_words_cards',
		'user_materials',
		'user_exercise_progress',
		'xp_transactions',
		'user_achievements'
	]

	for (const table of tables) {
		const { count, error } = await supabase
			.from(table)
			.select('*', { count: 'exact', head: true })
			.eq('user_id', userId)

		counts[table] = error ? 0 : (count || 0)
	}

	return counts
}

async function deleteUser(userId, userEmail) {
	console.log('\n🗑️  Starting deletion process...\n')

	const deletionSteps = [
		{ table: 'user_achievements', column: 'user_id', name: 'Achievements' },
		{ table: 'xp_transactions', column: 'user_id', name: 'XP transactions' },
		{ table: 'user_exercise_progress', column: 'user_id', name: 'Exercise progress' },
		{ table: 'user_words_cards', column: 'user_id', name: 'Flashcards' },
		{ table: 'user_words', column: 'user_id', name: 'Dictionary words' },
		{ table: 'user_materials', column: 'user_id', name: 'Materials progress' },
		{ table: 'user_xp_profile', column: 'user_id', name: 'XP profile' },
		{ table: 'users_profile', column: 'id', name: 'User profile' }
	]

	// Delete from each table
	for (const step of deletionSteps) {
		const { error } = await supabase
			.from(step.table)
			.delete()
			.eq(step.column, userId)

		if (error) {
			console.log(`  ⚠️  ${step.name}: ${error.message}`)
		} else {
			console.log(`  ✅ ${step.name} deleted`)
		}
	}

	// Delete from Supabase Auth
	console.log('\n🔐 Deleting from authentication...')
	const { error: authError } = await supabase.auth.admin.deleteUser(userId)

	if (authError) {
		console.log(`  ❌ Auth deletion failed: ${authError.message}`)
		return false
	} else {
		console.log(`  ✅ User deleted from authentication`)
		return true
	}
}

async function main() {
	console.log('╔════════════════════════════════════════╗')
	console.log('║   DELETE USER - COMPLETE REMOVAL      ║')
	console.log('╚════════════════════════════════════════╝')

	const emailOrId = await ask('\n📧 Enter user email or ID: ')

	if (!emailOrId || emailOrId.trim() === '') {
		console.log('\n❌ No email or ID provided')
		rl.close()
		process.exit(1)
	}

	const userInfo = await getUserInfo(emailOrId.trim())

	if (!userInfo) {
		console.log('\n❌ User not found')
		rl.close()
		process.exit(1)
	}

	const { user, profile, xpProfile } = userInfo

	// Display user information
	console.log('\n📋 USER INFORMATION:')
	console.log('═══════════════════════════════════════')
	console.log(`ID:           ${user.id}`)
	console.log(`Email:        ${user.email}`)
	console.log(`Name:         ${profile?.name || 'N/A'}`)
	console.log(`Username:     ${profile?.username || 'N/A'}`)
	console.log(`Role:         ${profile?.role || 'user'}`)
	console.log(`Premium:      ${profile?.is_premium ? 'Yes' : 'No'}`)
	console.log(`Total XP:     ${xpProfile?.total_xp || 0}`)
	console.log(`Level:        ${xpProfile?.current_level || 0}`)
	console.log(`Created:      ${new Date(user.created_at).toLocaleDateString()}`)

	// Count and display data
	const counts = await countUserData(user.id)

	console.log('\n📊 DATA TO BE DELETED:')
	console.log('═══════════════════════════════════════')
	console.log(`Dictionary words:      ${counts.user_words}`)
	console.log(`Flashcards:            ${counts.user_words_cards}`)
	console.log(`Materials progress:    ${counts.user_materials}`)
	console.log(`Exercise progress:     ${counts.user_exercise_progress}`)
	console.log(`XP transactions:       ${counts.xp_transactions}`)
	console.log(`Achievements:          ${counts.user_achievements}`)

	// Ask for confirmation
	console.log('\n⚠️  WARNING: This action CANNOT be undone!')
	console.log('All user data, progress, and authentication will be permanently deleted.')

	const confirm1 = await ask('\nType "DELETE" to confirm: ')

	if (confirm1.trim() !== 'DELETE') {
		console.log('\n✋ Deletion cancelled')
		rl.close()
		process.exit(0)
	}

	const confirm2 = await ask(`\nType the user email "${user.email}" to proceed: `)

	if (confirm2.trim() !== user.email) {
		console.log('\n✋ Email does not match. Deletion cancelled')
		rl.close()
		process.exit(0)
	}

	// Proceed with deletion
	const success = await deleteUser(user.id, user.email)

	if (success) {
		console.log('\n✅ User and all associated data have been permanently deleted')
	} else {
		console.log('\n❌ Deletion completed with errors. Please check the logs above.')
	}

	rl.close()
	process.exit(0)
}

main().catch(err => {
	console.error('\n❌ Error:', err.message)
	rl.close()
	process.exit(1)
})
