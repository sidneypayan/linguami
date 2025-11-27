'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { addXP } from '@/lib/xp-service'

// ============================================
// READ ACTIONS (Public)
// ============================================

/**
 * Get all themes for a language, grouped by level
 */
export async function getTrainingThemesAction(lang = 'ru') {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const { data, error } = await supabase
		.from('training_themes')
		.select('*')
		.eq('lang', lang)
		.eq('is_active', true)
		.order('level')
		.order('display_order')

	if (error) {
		console.error('Error fetching training themes:', error)
		return { success: false, error: error.message }
	}

	// Group by level
	const grouped = {
		beginner: [],
		intermediate: [],
		advanced: [],
	}

	data.forEach((theme) => {
		if (grouped[theme.level]) {
			grouped[theme.level].push(theme)
		}
	})

	return { success: true, data: grouped }
}

/**
 * Get questions for a specific theme
 */
export async function getTrainingQuestionsAction(themeId) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const { data, error } = await supabase
		.from('training_questions')
		.select('*')
		.eq('theme_id', themeId)
		.eq('is_active', true)
		.order('id')

	if (error) {
		console.error('Error fetching training questions:', error)
		return { success: false, error: error.message }
	}

	return { success: true, data }
}

/**
 * Get questions for a theme by key (used in training page)
 */
export async function getTrainingQuestionsByThemeKeyAction(lang, level, themeKey) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// First get the theme
	const { data: theme, error: themeError } = await supabase
		.from('training_themes')
		.select('id')
		.eq('lang', lang)
		.eq('level', level)
		.eq('key', themeKey)
		.single()

	if (themeError || !theme) {
		return { success: false, error: 'Theme not found' }
	}

	// Then get questions
	const { data: questions, error } = await supabase
		.from('training_questions')
		.select('*')
		.eq('theme_id', theme.id)
		.eq('is_active', true)
		.order('id')

	if (error) {
		console.error('Error fetching questions:', error)
		return { success: false, error: error.message }
	}

	return { success: true, data: questions, themeId: theme.id }
}

/**
 * Get training stats (for admin)
 */
export async function getTrainingStatsAction(lang = 'ru') {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const { data, error } = await supabase
		.from('training_stats')
		.select('*')
		.eq('lang', lang)

	if (error) {
		console.error('Error fetching training stats:', error)
		return { success: false, error: error.message }
	}

	return { success: true, data }
}

/**
 * Get user's training progress for a theme
 */
export async function getUserTrainingProgressAction(themeId) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return { success: true, data: [] } // Return empty for non-logged users
	}

	// Get all questions for this theme
	const { data: questions } = await supabase
		.from('training_questions')
		.select('id')
		.eq('theme_id', themeId)

	if (!questions || questions.length === 0) {
		return { success: true, data: [] }
	}

	const questionIds = questions.map((q) => q.id)

	// Get user's progress for these questions
	const { data: progress, error } = await supabase
		.from('training_progress')
		.select('question_id, is_correct, xp_awarded')
		.eq('id', user.id)
		.in('question_id', questionIds)

	if (error) {
		console.error('Error fetching progress:', error)
		return { success: false, error: error.message }
	}

	// Return map of question_id -> best result
	const progressMap = {}
	progress.forEach((p) => {
		if (!progressMap[p.question_id] || (p.is_correct && !progressMap[p.question_id].is_correct)) {
			progressMap[p.question_id] = p
		}
	})

	return { success: true, data: progressMap }
}

// ============================================
// ANSWER & XP ACTIONS
// ============================================

/**
 * Complete a training session and award XP based on correct answers
 * XP = correctAnswers * 2
 * Gold = totalXP / 10 (rounded down)
 */
export async function completeTrainingSessionAction(correctAnswers, totalQuestions) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		// Guest users can still play, but no XP tracking
		return { success: true, xpAwarded: 0, goldAwarded: 0, isGuest: true }
	}

	if (correctAnswers <= 0) {
		return { success: true, xpAwarded: 0, goldAwarded: 0, noCorrectAnswers: true }
	}

	// Calculate XP and Gold
	const xpPerCorrect = 2
	const totalXp = correctAnswers * xpPerCorrect
	const totalGold = Math.floor(totalXp / 10)

	// Award XP using the XP service with custom amount
	const xpResult = await addXP({
		actionType: 'training_session',
		sourceId: `training-session-${Date.now()}`,
		description: `Training session: ${correctAnswers}/${totalQuestions} correct`,
		customXp: totalXp,
	})

	return {
		success: true,
		xpAwarded: xpResult.success ? totalXp : 0,
		goldAwarded: xpResult.success ? totalGold : 0,
		correctAnswers,
		totalQuestions,
	}
}

// ============================================
// ADMIN ACTIONS (Require admin role)
// ============================================

/**
 * Create a new training theme
 */
export async function createTrainingThemeAction(themeData) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Verify admin
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) return { success: false, error: 'Not authenticated' }

	const { data: profile } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	if (profile?.role !== 'admin') {
		return { success: false, error: 'Not authorized' }
	}

	const { data, error } = await supabase
		.from('training_themes')
		.insert(themeData)
		.select()
		.single()

	if (error) {
		console.error('Error creating theme:', error)
		return { success: false, error: error.message }
	}

	return { success: true, data }
}

/**
 * Create training questions in bulk
 */
export async function createTrainingQuestionsAction(questions) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Verify admin
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) return { success: false, error: 'Not authenticated' }

	const { data: profile } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	if (profile?.role !== 'admin') {
		return { success: false, error: 'Not authorized' }
	}

	const { data, error } = await supabase.from('training_questions').insert(questions).select()

	if (error) {
		console.error('Error creating questions:', error)
		return { success: false, error: error.message }
	}

	return { success: true, data, count: data.length }
}

/**
 * Update a training question
 */
export async function updateTrainingQuestionAction(questionId, updates) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Verify admin
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) return { success: false, error: 'Not authenticated' }

	const { data: profile } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	if (profile?.role !== 'admin') {
		return { success: false, error: 'Not authorized' }
	}

	const { data, error } = await supabase
		.from('training_questions')
		.update(updates)
		.eq('id', questionId)
		.select()
		.single()

	if (error) {
		console.error('Error updating question:', error)
		return { success: false, error: error.message }
	}

	return { success: true, data }
}

/**
 * Delete a training question (soft delete)
 */
export async function deleteTrainingQuestionAction(questionId) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Verify admin
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) return { success: false, error: 'Not authenticated' }

	const { data: profile } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	if (profile?.role !== 'admin') {
		return { success: false, error: 'Not authorized' }
	}

	// Soft delete
	const { error } = await supabase
		.from('training_questions')
		.update({ is_active: false })
		.eq('id', questionId)

	if (error) {
		console.error('Error deleting question:', error)
		return { success: false, error: error.message }
	}

	return { success: true }
}

/**
 * Get all questions for admin (including inactive)
 */
export async function getAdminTrainingQuestionsAction(themeId) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Verify admin
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) return { success: false, error: 'Not authenticated' }

	const { data: profile } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	if (profile?.role !== 'admin') {
		return { success: false, error: 'Not authorized' }
	}

	const { data, error } = await supabase
		.from('training_questions')
		.select('*')
		.eq('theme_id', themeId)
		.order('created_at', { ascending: false })

	if (error) {
		console.error('Error fetching questions:', error)
		return { success: false, error: error.message }
	}

	return { success: true, data }
}
