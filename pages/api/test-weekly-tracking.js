import { createServerClient } from '@supabase/ssr'

/**
 * API endpoint pour tester le tracking hebdomadaire/mensuel
 * GET /api/test-weekly-tracking
 */
export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name) {
					return req.cookies[name]
				},
				set(name, value, options) {
					res.setHeader('Set-Cookie', `${name}=${value}`)
				},
				remove(name, options) {
					res.setHeader('Set-Cookie', `${name}=; Max-Age=0`)
				},
			},
		}
	)

	// Vérifier l'authentification
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (!user || authError) {
		return res.status(401).json({ error: 'Unauthorized' })
	}

	try {
		const results = {
			userId: user.id,
			tests: [],
		}

		// Test 1: Vérifier si les fonctions existent
		results.tests.push({ name: 'Check get_week_bounds function', status: 'running' })
		try {
			const { data: weekBounds, error: weekError } = await supabase.rpc('get_week_bounds')
			if (weekError) {
				results.tests[results.tests.length - 1].status = 'error'
				results.tests[results.tests.length - 1].error = weekError.message
			} else {
				results.tests[results.tests.length - 1].status = 'success'
				results.tests[results.tests.length - 1].data = weekBounds
			}
		} catch (e) {
			results.tests[results.tests.length - 1].status = 'error'
			results.tests[results.tests.length - 1].error = e.message
		}

		// Test 2: Vérifier si la fonction get_month_bounds existe
		results.tests.push({ name: 'Check get_month_bounds function', status: 'running' })
		try {
			const { data: monthBounds, error: monthError } = await supabase.rpc('get_month_bounds')
			if (monthError) {
				results.tests[results.tests.length - 1].status = 'error'
				results.tests[results.tests.length - 1].error = monthError.message
			} else {
				results.tests[results.tests.length - 1].status = 'success'
				results.tests[results.tests.length - 1].data = monthBounds
			}
		} catch (e) {
			results.tests[results.tests.length - 1].status = 'error'
			results.tests[results.tests.length - 1].error = e.message
		}

		// Test 3: Vérifier les tables
		results.tests.push({ name: 'Check weekly_xp_tracking table', status: 'running' })
		try {
			const { data, error, count } = await supabase
				.from('weekly_xp_tracking')
				.select('*', { count: 'exact', head: true })

			if (error) {
				results.tests[results.tests.length - 1].status = 'error'
				results.tests[results.tests.length - 1].error = error.message
			} else {
				results.tests[results.tests.length - 1].status = 'success'
				results.tests[results.tests.length - 1].count = count
			}
		} catch (e) {
			results.tests[results.tests.length - 1].status = 'error'
			results.tests[results.tests.length - 1].error = e.message
		}

		results.tests.push({ name: 'Check monthly_xp_tracking table', status: 'running' })
		try {
			const { data, error, count } = await supabase
				.from('monthly_xp_tracking')
				.select('*', { count: 'exact', head: true })

			if (error) {
				results.tests[results.tests.length - 1].status = 'error'
				results.tests[results.tests.length - 1].error = error.message
			} else {
				results.tests[results.tests.length - 1].status = 'success'
				results.tests[results.tests.length - 1].count = count
			}
		} catch (e) {
			results.tests[results.tests.length - 1].status = 'error'
			results.tests[results.tests.length - 1].error = e.message
		}

		// Test 4: Essayer d'appeler update_weekly_xp
		results.tests.push({ name: 'Test update_weekly_xp function', status: 'running' })
		try {
			const { data, error } = await supabase.rpc('update_weekly_xp', {
				p_user_id: user.id,
				p_xp_amount: 10,
			})

			if (error) {
				results.tests[results.tests.length - 1].status = 'error'
				results.tests[results.tests.length - 1].error = error.message
			} else {
				results.tests[results.tests.length - 1].status = 'success'
				results.tests[results.tests.length - 1].data = data
			}
		} catch (e) {
			results.tests[results.tests.length - 1].status = 'error'
			results.tests[results.tests.length - 1].error = e.message
		}

		// Test 5: Vérifier les données insérées
		results.tests.push({ name: 'Check user weekly data', status: 'running' })
		try {
			const { data, error } = await supabase
				.from('weekly_xp_tracking')
				.select('*')
				.eq('user_id', user.id)

			if (error) {
				results.tests[results.tests.length - 1].status = 'error'
				results.tests[results.tests.length - 1].error = error.message
			} else {
				results.tests[results.tests.length - 1].status = 'success'
				results.tests[results.tests.length - 1].data = data
			}
		} catch (e) {
			results.tests[results.tests.length - 1].status = 'error'
			results.tests[results.tests.length - 1].error = e.message
		}

		return res.status(200).json(results)
	} catch (error) {
		console.error('Error testing weekly tracking:', error)
		return res.status(500).json({ error: 'Test failed', details: error.message })
	}
}
