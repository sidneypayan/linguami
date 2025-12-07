-- Migration: Remove course_levels table (data now hardcoded in app)
-- Author: Claude Code
-- Date: 2025-01-07
--
-- This migration removes the course_levels table as the data is now
-- hardcoded in lib/method-levels.js for better performance.
-- All foreign keys referencing course_levels will be removed first.

-- Step 1: Drop foreign keys from tables referencing course_levels
ALTER TABLE IF EXISTS courses
DROP CONSTRAINT IF EXISTS courses_level_id_fkey;

ALTER TABLE IF EXISTS user_course_access
DROP CONSTRAINT IF EXISTS user_course_access_level_id_fkey;

-- Step 2: Drop indexes on course_levels foreign keys
DROP INDEX IF EXISTS idx_courses_level_id;
DROP INDEX IF EXISTS idx_user_course_access_level_id;

-- Step 3: Drop the course_levels table
DROP TABLE IF EXISTS course_levels;

-- Note: The level_id columns in courses and user_course_access tables
-- are kept as they still store the level IDs (1, 2, 3) which map to
-- the static level data in lib/method-levels.js
