import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
	if (req.method !== 'DELETE') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
			{
				cookies: {
					get(name) {
						return req.cookies[name]
					},
					set(name, value, options) {
						const maxAge = options?.maxAge ? '; Max-Age=' + options.maxAge : ''
						res.setHeader('Set-Cookie', name + '=' + value + '; Path=/; HttpOnly; SameSite=Lax' + maxAge)
					},
					remove(name, options) {
						res.setHeader('Set-Cookie', name + '=; Path=/; Max-Age=0')
					},
				},
			}
		)

		// Get authenticated user
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (!user || authError) {
			console.error('Auth error:', authError)
			return res.status(401).json({ error: 'Unauthorized' })
		}

		console.log('Deleting account for user:', user.id)

		// Verify environment variables
		if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
			console.error('Missing environment variables')
			return res.status(500).json({ error: 'Server configuration error' })
		}

		// Create admin client for user deletion
		const supabaseAdmin = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.SUPABASE_SERVICE_ROLE_KEY,
			{
				auth: {
					autoRefreshToken: false,
					persistSession: false
				}
			}
		)

		// Delete user data from related tables using admin client
		// Note: Using admin client bypasses RLS policies

		// Delete course progress (Method system)
		await supabaseAdmin
			.from('user_course_progress')
			.delete()
			.eq('user_id', user.id)

		// Delete course access (Method system)
		await supabaseAdmin
			.from('user_course_access')
			.delete()
			.eq('user_id', user.id)

		// Delete XP profile
		await supabaseAdmin
			.from('user_xp_profile')
			.delete()
			.eq('user_id', user.id)

		// Delete user materials
		await supabaseAdmin
			.from('user_materials')
			.delete()
			.eq('user_id', user.id)

		// Delete user words
		await supabaseAdmin
			.from('user_words')
			.delete()
			.eq('user_id', user.id)

		// Delete user cards
		await supabaseAdmin
			.from('user_words_cards')
			.delete()
			.eq('user_id', user.id)

		// Delete exercise progress
		await supabaseAdmin
			.from('user_exercise_progress')
			.delete()
			.eq('user_id', user.id)

		// Delete XP transactions
		await supabaseAdmin
			.from('xp_transactions')
			.delete()
			.eq('user_id', user.id)

		// Delete goals
		await supabaseAdmin
			.from('user_goals')
			.delete()
			.eq('user_id', user.id)

		// Delete achievements
		await supabaseAdmin
			.from('user_achievements')
			.delete()
			.eq('user_id', user.id)

		// Delete user profile (must be done before deleting auth user)
		await supabaseAdmin
			.from('users_profile')
			.delete()
			.eq('id', user.id)

		// Finally, delete the auth user using admin client
		const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

		if (deleteError) {
			console.error('Error deleting auth user:', deleteError)
			throw deleteError
		}

		console.log('Account deleted successfully for user:', user.id)

		// Don't sign out here - let the client handle session cleanup
		return res.status(200).json({ success: true, message: 'Account deleted successfully' })
	} catch (error) {
		console.error('Error deleting account:', error)
		return res.status(500).json({
			error: 'Failed to delete account',
			details: error.message
		})
	}
}
