import { createServerClient } from '@/lib/supabase-server'

export default async function handler(req, res) {
	if (req.method !== 'DELETE') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	const supabase = createServerClient(req, res)

	// Get authenticated user
	const { data: { user }, error: authError } = await supabase.auth.getUser()

	if (!user || authError) {
		return res.status(401).json({ error: 'Unauthorized' })
	}

	try {
		// Delete user data from related tables
		// Note: Make sure you have CASCADE DELETE set up in your database
		// or manually delete from all related tables

		// Delete course progress (Method system)
		await supabase
			.from('user_course_progress')
			.delete()
			.eq('user_id', user.id)

		// Delete course access (Method system)
		await supabase
			.from('user_course_access')
			.delete()
			.eq('user_id', user.id)

		// Delete user profile
		await supabase
			.from('users_profile')
			.delete()
			.eq('id', user.id)

		// Delete XP profile
		await supabase
			.from('user_xp_profile')
			.delete()
			.eq('user_id', user.id)

		// Delete user materials
		await supabase
			.from('user_materials')
			.delete()
			.eq('user_id', user.id)

		// Delete user words
		await supabase
			.from('user_words')
			.delete()
			.eq('user_id', user.id)

		// Delete user cards
		await supabase
			.from('user_words_cards')
			.delete()
			.eq('user_id', user.id)

		// Delete exercise progress
		await supabase
			.from('user_exercise_progress')
			.delete()
			.eq('user_id', user.id)

		// Delete XP transactions
		await supabase
			.from('xp_transactions')
			.delete()
			.eq('user_id', user.id)

		// Delete goals
		await supabase
			.from('user_goals')
			.delete()
			.eq('user_id', user.id)

		// Delete achievements
		await supabase
			.from('user_achievements')
			.delete()
			.eq('user_id', user.id)

		// Finally, delete the auth user
		const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

		if (deleteError) {
			throw deleteError
		}

		// Sign out
		await supabase.auth.signOut()

		return res.status(200).json({ success: true, message: 'Account deleted successfully' })
	} catch (error) {
		console.error('Error deleting account:', error)
		return res.status(500).json({ error: 'Failed to delete account' })
	}
}
