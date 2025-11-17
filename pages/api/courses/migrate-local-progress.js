import { createServerClient } from '@/lib/supabase-server'
import { logger } from '@/utils/logger'

/**
 * API route to migrate local progress from localStorage to database
 * Called after user login/signup
 */
export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const supabase = createServerClient(req, res)

		// Check authentication
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser()

		if (authError || !user) {
			return res.status(401).json({ error: 'Unauthorized' })
		}

		const { localProgress } = req.body

		if (!localProgress || !Array.isArray(localProgress)) {
			return res.status(400).json({ error: 'Invalid local progress data' })
		}

		if (localProgress.length === 0) {
			return res.status(200).json({ message: 'No progress to migrate', migrated: 0 })
		}

		// Prepare data for insertion
		const progressToInsert = localProgress.map((p) => ({
			user_id: user.id,
			lesson_id: p.lesson_id,
			is_completed: p.is_completed || false,
			completed_at: p.completed_at || null,
			time_spent_seconds: p.time_spent_seconds || 0,
		}))

		// Use upsert to avoid duplicates
		const { data, error } = await supabase
			.from('user_course_progress')
			.upsert(progressToInsert, {
				onConflict: 'user_id,lesson_id',
				ignoreDuplicates: false, // Update existing records
			})
			.select()

		if (error) {
			logger.error('Error migrating progress:', error)
			return res.status(500).json({ error: 'Failed to migrate progress' })
		}

		logger.log(`✅ Migrated ${localProgress.length} lesson(s) progress for user ${user.id}`)

		return res.status(200).json({
			message: 'Progress migrated successfully',
			migrated: localProgress.length,
		})
	} catch (error) {
		logger.error('Migration error:', error)
		return res.status(500).json({ error: 'Internal server error' })
	}
}
