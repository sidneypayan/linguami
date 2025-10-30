import { createServerClient } from '@supabase/ssr'

/**
 * API endpoint pour gérer les objectifs utilisateur
 * GET /api/goals - Récupérer les objectifs actifs
 * POST /api/goals - Créer un nouvel objectif
 */
export default async function handler(req, res) {
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

	if (req.method === 'GET') {
		return handleGet(req, res, supabase, user)
	} else if (req.method === 'POST') {
		return handlePost(req, res, supabase, user)
	} else {
		return res.status(405).json({ error: 'Method not allowed' })
	}
}

/**
 * GET - Récupérer les objectifs actifs de l'utilisateur
 */
async function handleGet(req, res, supabase, user) {
	try {
		const today = new Date().toISOString().split('T')[0]

		// Récupérer les objectifs en cours (non expirés)
		const { data: goals, error: goalsError } = await supabase
			.from('user_goals')
			.select('*')
			.eq('user_id', user.id)
			.gte('period_end', today)
			.order('created_at', { ascending: false })

		if (goalsError) throw goalsError

		// Grouper par type
		const dailyGoal = goals?.find(g => g.goal_type === 'daily') || null
		const weeklyGoal = goals?.find(g => g.goal_type === 'weekly') || null
		const monthlyGoal = goals?.find(g => g.goal_type === 'monthly') || null

		// Créer des objectifs par défaut s'ils n'existent pas
		const defaultGoals = {
			daily: dailyGoal || await createDefaultGoal(supabase, user.id, 'daily', 100),
			weekly: weeklyGoal || await createDefaultGoal(supabase, user.id, 'weekly', 500),
			monthly: monthlyGoal || await createDefaultGoal(supabase, user.id, 'monthly', 2000),
		}

		return res.status(200).json({
			goals: defaultGoals,
		})
	} catch (error) {
		console.error('Error fetching goals:', error)
		return res.status(500).json({ error: 'Failed to fetch goals' })
	}
}

/**
 * POST - Créer ou mettre à jour un objectif
 */
async function handlePost(req, res, supabase, user) {
	const { goalType, targetXp } = req.body

	if (!goalType || !targetXp) {
		return res.status(400).json({ error: 'goalType and targetXp are required' })
	}

	if (!['daily', 'weekly', 'monthly'].includes(goalType)) {
		return res.status(400).json({ error: 'Invalid goalType' })
	}

	if (targetXp < 0) {
		return res.status(400).json({ error: 'targetXp must be positive' })
	}

	try {
		// Calculer les dates de début et fin selon le type
		const { periodStart, periodEnd } = calculatePeriod(goalType)

		// Vérifier si un objectif existe déjà pour cette période
		const { data: existingGoal } = await supabase
			.from('user_goals')
			.select('*')
			.eq('user_id', user.id)
			.eq('goal_type', goalType)
			.eq('period_start', periodStart)
			.eq('period_end', periodEnd)
			.single()

		if (existingGoal) {
			// Mettre à jour l'objectif existant
			const { data: updatedGoal, error: updateError } = await supabase
				.from('user_goals')
				.update({ target_xp: targetXp })
				.eq('id', existingGoal.id)
				.select()
				.single()

			if (updateError) throw updateError

			return res.status(200).json({
				goal: updatedGoal,
				message: 'Goal updated successfully',
			})
		} else {
			// Créer un nouvel objectif
			const { data: newGoal, error: createError } = await supabase
				.from('user_goals')
				.insert({
					user_id: user.id,
					goal_type: goalType,
					target_xp: targetXp,
					current_xp: 0,
					period_start: periodStart,
					period_end: periodEnd,
					is_completed: false,
				})
				.select()
				.single()

			if (createError) throw createError

			return res.status(201).json({
				goal: newGoal,
				message: 'Goal created successfully',
			})
		}
	} catch (error) {
		console.error('Error creating/updating goal:', error)
		return res.status(500).json({ error: 'Failed to create/update goal' })
	}
}

/**
 * Créer un objectif par défaut
 */
async function createDefaultGoal(supabase, userId, goalType, defaultTargetXp) {
	const { periodStart, periodEnd } = calculatePeriod(goalType)

	const { data: newGoal, error } = await supabase
		.from('user_goals')
		.insert({
			user_id: userId,
			goal_type: goalType,
			target_xp: defaultTargetXp,
			current_xp: 0,
			period_start: periodStart,
			period_end: periodEnd,
			is_completed: false,
		})
		.select()
		.single()

	if (error) {
		console.error('Error creating default goal:', error)
		return null
	}

	return newGoal
}

/**
 * Calculer les dates de début et fin selon le type d'objectif
 */
function calculatePeriod(goalType) {
	const now = new Date()
	let periodStart, periodEnd

	if (goalType === 'daily') {
		periodStart = new Date(now)
		periodStart.setHours(0, 0, 0, 0)
		periodEnd = new Date(periodStart)
		periodEnd.setDate(periodEnd.getDate() + 1)
	} else if (goalType === 'weekly') {
		// Début de semaine (lundi)
		periodStart = new Date(now)
		const day = periodStart.getDay()
		const diff = periodStart.getDate() - day + (day === 0 ? -6 : 1)
		periodStart.setDate(diff)
		periodStart.setHours(0, 0, 0, 0)

		// Fin de semaine (dimanche)
		periodEnd = new Date(periodStart)
		periodEnd.setDate(periodEnd.getDate() + 7)
	} else if (goalType === 'monthly') {
		// Début du mois
		periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
		periodStart.setHours(0, 0, 0, 0)

		// Fin du mois
		periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
	}

	return {
		periodStart: periodStart.toISOString().split('T')[0],
		periodEnd: periodEnd.toISOString().split('T')[0],
	}
}
