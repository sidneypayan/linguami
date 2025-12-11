/**
 * Supabase client for courses and lessons metadata
 * ALWAYS points to PRODUCTION database, even in dev environment
 *
 * Why: With Phase 2, lesson content is in JSON files (Git).
 * The DB only stores metadata (structure, order, etc.)
 * Having a single source of truth in PROD avoids sync issues.
 *
 * User data (progress, profiles) still uses environment-specific DB.
 */

import { createClient } from '@supabase/supabase-js'

// Use dedicated env vars for courses DB (always PROD)
// If not set, fallback to regular env vars (for backwards compatibility)
const COURSES_DB_URL = process.env.SUPABASE_COURSES_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const COURSES_DB_KEY = process.env.SUPABASE_COURSES_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!COURSES_DB_URL || !COURSES_DB_KEY) {
	throw new Error('Missing Supabase credentials for courses database')
}

/**
 * Server-side Supabase client for courses and lessons
 * Uses service role key to bypass RLS
 * ALWAYS connects to PRODUCTION database
 */
export const coursesClient = createClient(COURSES_DB_URL, COURSES_DB_KEY, {
	db: {
		schema: 'public',
	},
	auth: {
		persistSession: false,
	},
})

/**
 * Get courses client (for consistency with other clients)
 */
export function getCoursesClient() {
	return coursesClient
}
