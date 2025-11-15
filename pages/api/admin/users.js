import { createServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	// Create Supabase client to check authentication
	const supabase = createServerClient(req, res)
	const { data: { user }, error: authError } = await supabase.auth.getUser()

	if (!user || authError) {
		return res.status(401).json({ error: 'Unauthorized' })
	}

	// Check if user is admin
	const { data: userProfile, error: userError } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	if (userError || userProfile?.role !== 'admin') {
		return res.status(403).json({ error: 'Forbidden - Admin access required' })
	}

	// Create admin client with service role key
	if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
		console.error('SUPABASE_SERVICE_ROLE_KEY is not defined')
		return res.status(500).json({ error: 'Server configuration error' })
	}

	const supabaseAdmin = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		}
	)

	try {
		// Fetch all users
		const { data: usersProfile, error: usersError } = await supabaseAdmin
			.from('users_profile')
			.select(`
				id,
				name,
				email,
				role,
				is_premium,
				spoken_language,
				language_level,
				avatar_id,
				created_at
			`)
			.order('created_at', { ascending: false })

		if (usersError) {
			console.error('Error fetching users:', usersError)
			return res.status(500).json({ error: 'Failed to fetch users' })
		}

		// Fetch XP profiles
		const { data: xpProfiles, error: xpError } = await supabaseAdmin
			.from('user_xp_profile')
			.select('user_id, total_xp, current_level')

		const xpMap = {}
		if (!xpError && xpProfiles) {
			xpProfiles.forEach(xp => {
				xpMap[xp.user_id] = {
					total_xp: xp.total_xp,
					current_level: xp.current_level,
				}
			})
		}

		// Combine data
		const users = usersProfile.map(user => ({
			...user,
			total_xp: xpMap[user.id]?.total_xp || 0,
			current_level: xpMap[user.id]?.current_level || 1,
		}))

		return res.status(200).json({ users })
	} catch (error) {
		console.error('Error in /api/admin/users:', error)
		return res.status(500).json({ error: 'Internal server error' })
	}
}
