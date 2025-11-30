-- Migration: Add Italian language support
-- Date: 2025-11-30

-- 1. Add blocks_it column to course_lessons for Italian lesson content
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS blocks_it JSONB;

COMMENT ON COLUMN course_lessons.blocks_it IS 'Lesson content blocks in Italian (JSONB)';

-- 2. Add objectives_it column to course_lessons for Italian objectives
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS objectives_it TEXT[];

COMMENT ON COLUMN course_lessons.objectives_it IS 'Lesson objectives in Italian';

-- Note: The learning_language column in users_profile is TEXT without CHECK constraint,
-- so it can already accept 'it' without modification.
