'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { addXP } from '@/lib/xp-service'
import { createClient } from '@supabase/supabase-js'

// ============================================
// TRAINING ALWAYS USES PROD DB (even in local)
// ============================================
function createTrainingClient() {
	// Use PROD DB credentials for training
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseKey = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

	return createClient(supabaseUrl, supabaseKey, {
		auth: { persistSession: false }
	})
}

// Helper to get authenticated user (still uses current environment)
async function getAuthenticatedUser() {
	const supabase = createTrainingClient()
	return await supabase.auth.getUser()
}

// ============================================
// READ ACTIONS (Public)
// ============================================

/**
 * Get all themes for a language, grouped by level
 */
export async function getTrainingThemesAction(lang = 'ru') {
	const supabase = createTrainingClient()

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
 * Returns only PUBLISHED questions for regular users
 */
export async function getTrainingQuestionsAction(themeId) {
	const supabase = createTrainingClient()

	const { data, error } = await supabase
		.from('training_questions')
		.select('*')
		.eq('theme_id', themeId)
		.eq('is_active', true)
		.eq('status', 'published') // Only published questions
		.order('id')

	if (error) {
		console.error('Error fetching training questions:', error)
		return { success: false, error: error.message }
	}

	return { success: true, data }
}

/**
 * Get questions for a theme by key (used in training page)
 * Returns only PUBLISHED questions for regular users
 */
export async function getTrainingQuestionsByThemeKeyAction(lang, level, themeKey) {
	const supabase = createTrainingClient()

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

	// Then get PUBLISHED questions only
	const { data: questions, error } = await supabase
		.from('training_questions')
		.select('*')
		.eq('theme_id', theme.id)
		.eq('is_active', true)
		.eq('status', 'published') // Only published questions
		.order('id')

	if (error) {
		console.error('Error fetching questions:', error)
		return { success: false, error: error.message }
	}

	// Transform questions to match frontend expected format
	const transformedQuestions = questions.map((q) => {
		const transformed = { ...q }

		// Convert question_fr, question_en, question_ru to question object
		if (q.question_fr || q.question_en || q.question_ru) {
			transformed.question = {
				fr: q.question_fr || '',
				en: q.question_en || '',
				ru: q.question_ru || '',
			}
		}

		// Convert explanation_fr, explanation_en, explanation_ru to explanation object
		if (q.explanation_fr || q.explanation_en || q.explanation_ru) {
			transformed.explanation = {
				fr: q.explanation_fr || '',
				en: q.explanation_en || '',
				ru: q.explanation_ru || '',
			}
		}

		// Normalize options to always be an array (not object)
		if (q.options && typeof q.options === 'object' && !Array.isArray(q.options)) {
			// If options is an object {fr: [...], en: [...], ru: [...]}, extract the array for the theme language
			transformed.options = q.options[lang] || q.options.fr || q.options.en || q.options.ru || []
		}

		// Convert correct_answer to correctAnswer (camelCase)
		if (q.correct_answer !== undefined) {
			transformed.correctAnswer = q.correct_answer
		}

		return transformed
	})

	return { success: true, data: transformedQuestions, themeId: theme.id }
}

/**
 * Get training stats (for admin)
 */
export async function getTrainingStatsAction(lang = 'ru') {
	const supabase = createTrainingClient()

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
	const supabase = createTrainingClient()

	const {
		data: { user },
	} = await getAuthenticatedUser()

	if (!user) {
		return { success: true, data: [] } // Return empty for non-logged users
	}

	// Get all PUBLISHED questions for this theme
	const { data: questions } = await supabase
		.from('training_questions')
		.select('id')
		.eq('theme_id', themeId)
		.eq('status', 'published')

	if (!questions || questions.length === 0) {
		return { success: true, data: [] }
	}

	const questionIds = questions.map((q) => q.id)

	// Get user's progress for these questions
	const { data: progress, error } = await supabase
		.from('training_progress')
		.select('question_id, is_correct, xp_awarded')
		.eq('user_id', user.id)
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
	const supabase = createTrainingClient()

	const {
		data: { user },
	} = await getAuthenticatedUser()

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
 * Verify admin role helper
 * Checks admin role in the CURRENT environment DB (not training prod DB)
 * because user authentication happens in current environment
 */
async function verifyAdmin() {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) return { authorized: false, error: 'Not authenticated' }

	// Check admin role in CURRENT environment DB (where user is authenticated)
	const { data: profile } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	if (profile?.role !== 'admin') {
		return { authorized: false, error: 'Not authorized' }
	}

	return { authorized: true }
}

/**
 * Create a new training theme
 */
export async function createTrainingThemeAction(themeData) {
	const supabase = createTrainingClient()

	const { authorized, error: authError } = await verifyAdmin()
	if (!authorized) return { success: false, error: authError }

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
 * Questions are created with 'draft' status by default
 */
export async function createTrainingQuestionsAction(questions) {
	const supabase = createTrainingClient()

	const { authorized, error: authError } = await verifyAdmin()
	if (!authorized) return { success: false, error: authError }

	// Add 'draft' status to all new questions
	const questionsWithStatus = questions.map(q => ({
		...q,
		status: q.status || 'draft' // Default to draft
	}))

	const { data, error } = await supabase
		.from('training_questions')
		.insert(questionsWithStatus)
		.select()

	if (error) {
		console.error('Error creating questions:', error)
		return { success: false, error: error.message }
	}

	return { success: true, data, count: data.length }
}

/**
 * Update a training question
 * Status is only changed if explicitly provided in updates
 */
export async function updateTrainingQuestionAction(questionId, updates) {
	const supabase = createTrainingClient()

	const { authorized, error: authError } = await verifyAdmin()
	if (!authorized) return { success: false, error: authError }

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
 * Publish a question (change status from draft to published)
 */
export async function publishTrainingQuestionAction(questionId) {
	const supabase = createTrainingClient()

	const { authorized, error: authError } = await verifyAdmin()
	if (!authorized) return { success: false, error: authError }

	const { data, error } = await supabase
		.from('training_questions')
		.update({ status: 'published' })
		.eq('id', questionId)
		.select()
		.single()

	if (error) {
		console.error('Error publishing question:', error)
		return { success: false, error: error.message }
	}

	return { success: true, data }
}

/**
 * Bulk publish questions
 */
export async function bulkPublishQuestionsAction(questionIds) {
	const supabase = createTrainingClient()

	const { authorized, error: authError } = await verifyAdmin()
	if (!authorized) return { success: false, error: authError }

	const { data, error } = await supabase
		.from('training_questions')
		.update({ status: 'published' })
		.in('id', questionIds)
		.select()

	if (error) {
		console.error('Error bulk publishing questions:', error)
		return { success: false, error: error.message }
	}

	return { success: true, data, count: data.length }
}

/**
 * Delete a training question (soft delete by setting is_active to false)
 */
export async function deleteTrainingQuestionAction(questionId) {
	const supabase = createTrainingClient()

	const { authorized, error: authError } = await verifyAdmin()
	if (!authorized) return { success: false, error: authError }

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
 * Get all questions for admin (including drafts)
 */
export async function getAdminTrainingQuestionsAction(themeId, includeStatus = null) {
	const supabase = createTrainingClient()

	const { authorized, error: authError } = await verifyAdmin()
	if (!authorized) return { success: false, error: authError }

	let query = supabase
		.from('training_questions')
		.select('*')
		.eq('theme_id', themeId)
		.order('id')

	// Filter by status if provided
	if (includeStatus) {
		query = query.eq('status', includeStatus)
	}

	const { data, error } = await query

	if (error) {
		console.error('Error fetching admin questions:', error)
		return { success: false, error: error.message }
	}

	return { success: true, data }
}
