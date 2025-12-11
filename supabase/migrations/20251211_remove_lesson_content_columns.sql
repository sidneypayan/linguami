-- Migration: Remove content columns from course_lessons table
-- Reason: Lesson content is now stored in JSON files (data/method/lessons/)
-- Keep only metadata in database for structure and navigation

-- Remove old content columns (blocks and objectives in all languages)
ALTER TABLE course_lessons
  DROP COLUMN IF EXISTS blocks,
  DROP COLUMN IF EXISTS blocks_fr,
  DROP COLUMN IF EXISTS blocks_en,
  DROP COLUMN IF EXISTS blocks_ru,
  DROP COLUMN IF EXISTS blocks_it,
  DROP COLUMN IF EXISTS objectives,
  DROP COLUMN IF EXISTS objectives_fr,
  DROP COLUMN IF EXISTS objectives_en,
  DROP COLUMN IF EXISTS objectives_ru,
  DROP COLUMN IF EXISTS objectives_it;

-- Columns remaining in course_lessons:
-- ✅ id (primary key)
-- ✅ slug (unique identifier)
-- ✅ title_fr, title_en, title_ru (titles for navigation)
-- ✅ order_index (lesson order in course)
-- ✅ estimated_minutes (lesson duration)
-- ✅ is_published (visibility)
-- ✅ is_free (access control)
-- ✅ course_id (foreign key)
-- ✅ created_at, updated_at (timestamps)

COMMENT ON TABLE course_lessons IS 'Lesson metadata and structure. Content (blocks, objectives) stored in JSON files at data/method/lessons/[level]/[slug].json';
