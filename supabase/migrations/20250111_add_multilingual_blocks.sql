-- Migration: Add multilingual blocks to course_lessons
-- Date: 2025-01-11

-- 1. Add new columns for multilingual blocks
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS blocks_fr JSONB,
ADD COLUMN IF NOT EXISTS blocks_ru JSONB,
ADD COLUMN IF NOT EXISTS blocks_en JSONB;

-- 2. Migrate existing blocks to blocks_fr (they're in French)
UPDATE course_lessons
SET blocks_fr = blocks
WHERE blocks IS NOT NULL AND blocks_fr IS NULL;

-- 3. Optional: Keep the old 'blocks' column for backward compatibility
-- Or drop it if you want a clean migration
-- ALTER TABLE course_lessons DROP COLUMN blocks;

-- 4. Add comments
COMMENT ON COLUMN course_lessons.blocks_fr IS 'Lesson content blocks in French (JSONB)';
COMMENT ON COLUMN course_lessons.blocks_ru IS 'Lesson content blocks in Russian (JSONB)';
COMMENT ON COLUMN course_lessons.blocks_en IS 'Lesson content blocks in English (JSONB)';
