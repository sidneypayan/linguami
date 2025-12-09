-- Migration: Remove foreign key constraint on user_course_progress.lesson_id
-- Reason: With dual database setup (course content in PROD, user data in main DB),
-- the FK constraint to course_lessons cannot be enforced as the table is empty in main DB

-- Drop the foreign key constraint if it exists
ALTER TABLE IF EXISTS user_course_progress
DROP CONSTRAINT IF EXISTS user_course_progress_lesson_id_fkey;

-- Add comment explaining why there's no FK
COMMENT ON COLUMN user_course_progress.lesson_id IS 'References course_lessons.id in PROD database - no FK constraint due to dual DB setup';
