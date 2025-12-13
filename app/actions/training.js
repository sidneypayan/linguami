'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { addXP } from '@/lib/xp-service'
import { loadTrainingQuestions, transformQuestionsForFrontend, updateQuestionInFile, deleteQuestionInFile } from '@/lib/training-data'

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
 * Get questions for a specific theme by ID
 * Now loads from JSON files instead of database
 */
export async function getTrainingQuestionsAction(themeId) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// First get theme info to know which JSON file to load
	const { data: theme, error: themeError } = await supabase
		.from('training_themes')
		.select('lang, level, key')
		.eq('id', themeId)
		.single()

	if (themeError || !theme) {
		console.error('Error fetching theme:', themeError)
		return { success: false, error: 'Theme not found' }
	}

	// Load questions from JSON file
	const questions = loadTrainingQuestions(theme.lang, theme.level, theme.key)

	return { success: true, data: questions }
}

/**
 * Get questions for a theme by key (used in training page)
 * Now loads from JSON files instead of database
 */
export async function getTrainingQuestionsByThemeKeyAction(lang, level, themeKey) {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Get theme ID from database (needed for progress tracking)
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

	// Load questions from JSON file
	const questions = loadTrainingQuestions(lang, level, themeKey)

	if (!questions || questions.length === 0) {
		return { success: false, error: 'No questions found for this theme' }
	}

	// Transform questions to match frontend expected format
	const transformedQuestions = transformQuestionsForFrontend(questions, theme.id)

	return { success: true, data: transformedQuestions, themeId: theme.id }
}

/**
 * Get training stats (for admin)
 * Now counts questions from JSON files instead of DB
 */
export async function getTrainingStatsAction(lang = 'ru') {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Get themes from DB
	const { data: themes, error } = await supabase
		.from('training_stats')
		.select('*')
		.eq('lang', lang)

	if (error) {
		console.error('Error fetching training stats:', error)
		return { success: false, error: error.message }
	}

	// Count questions from JSON files for each theme
	const statsWithCounts = themes.map((theme) => {
		const questions = loadTrainingQuestions(theme.lang, theme.level, theme.key)
		return {
			...theme,
			question_count: questions.length,
		}
	})

	return { success: true, data: statsWithCounts }
}

/**
 * Get user's training progress for a theme
 * Now uses question IDs from JSON files
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

	// Get theme info to load questions from JSON
	const { data: theme, error: themeError } = await supabase
		.from('training_themes')
		.select('lang, level, key')
		.eq('id', themeId)
		.single()

	if (themeError || !theme) {
		return { success: true, data: [] }
	}

	// Load questions from JSON to get their IDs
	const questions = loadTrainingQuestions(theme.lang, theme.level, theme.key)

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
 * Update a training question in JSON file
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

	// Get question info to find its JSON file
	// We need to search through all themes to find which file contains this question ID
	const { data: themes, error: themesError } = await supabase
		.from('training_themes')
		.select('lang, level, key')

	if (themesError || !themes) {
		return { success: false, error: 'Failed to load themes' }
	}

	// Search for the question in all theme files
	let found = false
	let targetTheme = null

	for (const theme of themes) {
		const questions = loadTrainingQuestions(theme.lang, theme.level, theme.key)
		const questionExists = questions.some((q) => q.id === questionId)
		if (questionExists) {
			targetTheme = theme
			found = true
			break
		}
	}

	if (!found || !targetTheme) {
		return { success: false, error: 'Question not found in any theme' }
	}

	// Update the question in the JSON file
	const success = updateQuestionInFile(
		targetTheme.lang,
		targetTheme.level,
		targetTheme.key,
		questionId,
		updates
	)

	if (!success) {
		return { success: false, error: 'Failed to update question in file' }
	}

	return { success: true, data: { id: questionId, ...updates } }
}

/**
 * Delete a training question (soft delete by setting is_active to false in JSON file)
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

	// Get question info to find its JSON file
	const { data: themes, error: themesError } = await supabase
		.from('training_themes')
		.select('lang, level, key')

	if (themesError || !themes) {
		return { success: false, error: 'Failed to load themes' }
	}

	// Search for the question in all theme files
	let found = false
	let targetTheme = null

	for (const theme of themes) {
		const questions = loadTrainingQuestions(theme.lang, theme.level, theme.key)
		const questionExists = questions.some((q) => q.id === questionId)
		if (questionExists) {
			targetTheme = theme
			found = true
			break
		}
	}

	if (!found || !targetTheme) {
		return { success: false, error: 'Question not found in any theme' }
	}

	// Soft delete in the JSON file
	const success = deleteQuestionInFile(
		targetTheme.lang,
		targetTheme.level,
		targetTheme.key,
		questionId
	)

	if (!success) {
		return { success: false, error: 'Failed to delete question in file' }
	}

	return { success: true }
}

/**
 * Get all questions for admin
 * Now loads from JSON files instead of database
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

	// Get theme info to load questions from JSON
	const { data: theme, error: themeError } = await supabase
		.from('training_themes')
		.select('lang, level, key')
		.eq('id', themeId)
		.single()

	if (themeError || !theme) {
		return { success: false, error: 'Theme not found' }
	}

	// Load questions from JSON
	const questions = loadTrainingQuestions(theme.lang, theme.level, theme.key)

	return { success: true, data: questions }
}
