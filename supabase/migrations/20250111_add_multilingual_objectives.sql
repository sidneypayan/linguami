-- Migration: Add multilingual objectives to course_lessons
-- Date: 2025-01-11

-- 1. Add new columns for multilingual objectives
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS objectives_fr TEXT[],
ADD COLUMN IF NOT EXISTS objectives_ru TEXT[],
ADD COLUMN IF NOT EXISTS objectives_en TEXT[];

-- 2. Migrate existing objectives to objectives_fr (they're in French)
UPDATE course_lessons
SET objectives_fr = objectives
WHERE objectives IS NOT NULL AND objectives_fr IS NULL;

-- 3. Optional: Keep the old 'objectives' column for backward compatibility
-- Or drop it if you want a clean migration
-- ALTER TABLE course_lessons DROP COLUMN objectives;

-- 4. Add comment
COMMENT ON COLUMN course_lessons.objectives_fr IS 'Learning objectives in French';
COMMENT ON COLUMN course_lessons.objectives_ru IS 'Learning objectives in Russian';
COMMENT ON COLUMN course_lessons.objectives_en IS 'Learning objectives in English';
