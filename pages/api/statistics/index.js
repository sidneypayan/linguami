import { createServerClient } from '@supabase/ssr'

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
		// 1. Matériels commencés (is_being_studied = true)
		const { count: startedCount, error: startedError } = await supabase
			.from('user_materials')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', user.id)
			.eq('is_being_studied', true)

		if (startedError) throw startedError

		// 2. Matériels terminés (is_studied = true)
		const { count: finishedCount, error: finishedError } = await supabase
			.from('user_materials')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', user.id)
			.eq('is_studied', true)

		if (finishedError) throw finishedError

		// 3. Définir les périodes de temps
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1)

		const weekStart = new Date()
		weekStart.setDate(weekStart.getDate() - weekStart.getDay())
		weekStart.setHours(0, 0, 0, 0)

		const monthStart = new Date()
		monthStart.setDate(1)
		monthStart.setHours(0, 0, 0, 0)

		// 3a. Mots révisés aujourd'hui
		const { count: wordsReviewedToday, error: wordsError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', user.id)
			.gte('last_review_date', today.toISOString())
			.lt('last_review_date', tomorrow.toISOString())

		if (wordsError) throw wordsError

		// 3b. Mots révisés cette semaine
		const { count: wordsReviewedThisWeek, error: wordsReviewedWeekError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', user.id)
			.gte('last_review_date', weekStart.toISOString())

		if (wordsReviewedWeekError) throw wordsReviewedWeekError

		// 3c. Mots révisés ce mois-ci
		const { count: wordsReviewedThisMonth, error: wordsReviewedMonthError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', user.id)
			.gte('last_review_date', monthStart.toISOString())

		if (wordsReviewedMonthError) throw wordsReviewedMonthError

		// 3d. Total de mots révisés (au moins une fois)
		const { count: totalWordsReviewed, error: totalReviewedError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', user.id)
			.not('last_review_date', 'is', null)

		if (totalReviewedError) throw totalReviewedError

		// 4. Total de mots dans le dictionnaire
		const { count: totalWords, error: totalWordsError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', user.id)

		if (totalWordsError) throw totalWordsError

		// 5. Mots ajoutés aujourd'hui
		const { count: wordsAddedToday, error: wordsAddedTodayError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', user.id)
			.gte('created_at', today.toISOString())
			.lt('created_at', tomorrow.toISOString())

		if (wordsAddedTodayError) throw wordsAddedTodayError

		// 8. Mots ajoutés cette semaine
		const { count: wordsAddedThisWeek, error: wordsAddedWeekError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', user.id)
			.gte('created_at', weekStart.toISOString())

		if (wordsAddedWeekError) throw wordsAddedWeekError

		// 9. Mots ajoutés ce mois-ci
		const { count: wordsAddedThisMonth, error: wordsAddedMonthError } = await supabase
			.from('user_words')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', user.id)
			.gte('created_at', monthStart.toISOString())

		if (wordsAddedMonthError) throw wordsAddedMonthError

		return res.status(200).json({
			materialsStarted: startedCount || 0,
			materialsFinished: finishedCount || 0,
			wordsReviewedToday: wordsReviewedToday || 0,
			wordsReviewedThisWeek: wordsReviewedThisWeek || 0,
			wordsReviewedThisMonth: wordsReviewedThisMonth || 0,
			totalWordsReviewed: totalWordsReviewed || 0,
			totalWords: totalWords || 0,
			wordsAddedToday: wordsAddedToday || 0,
			wordsAddedThisWeek: wordsAddedThisWeek || 0,
			wordsAddedThisMonth: wordsAddedThisMonth || 0,
		})
	} catch (error) {
		console.error('Error fetching statistics:', error)
		return res.status(500).json({ error: 'Failed to fetch statistics' })
	}
}
