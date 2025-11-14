-- Migration: Refactor materials table schema
-- Date: 2025-11-14
-- Purpose: Improve column naming clarity and optimize data types

-- ============================================
-- PART 1: Rename columns for better clarity
-- ============================================

-- Rename body columns to content (clearer naming)
ALTER TABLE materials
RENAME COLUMN body TO content;

ALTER TABLE materials
RENAME COLUMN body_accents TO content_accented;

-- Rename media columns to be more explicit about what they contain
ALTER TABLE materials
RENAME COLUMN image TO image_filename;

ALTER TABLE materials
RENAME COLUMN audio TO audio_filename;

ALTER TABLE materials
RENAME COLUMN video TO video_url;

-- ============================================
-- PART 2: Fix data types
-- ============================================

-- CRITICAL FIX: chapter_number should be INTEGER, not text
-- First, convert empty strings and invalid values to NULL
UPDATE materials
SET chapter_number = NULL
WHERE chapter_number = ''
   OR chapter_number !~ '^\d+$';

-- Then change the column type
ALTER TABLE materials
ALTER COLUMN chapter_number TYPE INTEGER
USING NULLIF(chapter_number, '')::INTEGER;

-- Optimize text columns with appropriate VARCHAR lengths
ALTER TABLE materials
ALTER COLUMN lang TYPE VARCHAR(5);

ALTER TABLE materials
ALTER COLUMN section TYPE VARCHAR(50);

ALTER TABLE materials
ALTER COLUMN level TYPE VARCHAR(20);

-- ============================================
-- PART 3: Add indexes for performance
-- ============================================

-- Index for filtering by language and section (most common query)
CREATE INDEX IF NOT EXISTS idx_materials_lang_section
ON materials(lang, section);

-- Index for filtering by level
CREATE INDEX IF NOT EXISTS idx_materials_level
ON materials(level);

-- Index for book chapters queries
CREATE INDEX IF NOT EXISTS idx_materials_book_id_chapter
ON materials(book_id, chapter_number)
WHERE book_id IS NOT NULL;

-- Index for ordering by creation date (newest first)
CREATE INDEX IF NOT EXISTS idx_materials_created_at_desc
ON materials(created_at DESC);

-- ============================================
-- PART 4: Update column comments
-- ============================================

COMMENT ON COLUMN materials.content IS 'Main text content (without stress marks for Russian)';
COMMENT ON COLUMN materials.content_accented IS 'Russian text with stress marks (ударение)';
COMMENT ON COLUMN materials.image_filename IS 'Image filename only (not full URL) - stored in R2';
COMMENT ON COLUMN materials.audio_filename IS 'Audio filename only (not full URL) - stored in R2';
COMMENT ON COLUMN materials.video_url IS 'Full video URL (usually YouTube)';
COMMENT ON COLUMN materials.chapter_number IS 'Chapter number for book-chapters section';
COMMENT ON COLUMN materials.lang IS 'Content language: fr, ru, or en';
COMMENT ON COLUMN materials.section IS 'Material category/section';
COMMENT ON COLUMN materials.level IS 'Difficulty level: beginner, intermediate, or advanced';

-- ============================================
-- VERIFICATION QUERIES (commented out)
-- ============================================

-- To verify the migration was successful, run these queries:

-- Check column names
-- SELECT column_name, data_type, character_maximum_length
-- FROM information_schema.columns
-- WHERE table_name = 'materials'
-- ORDER BY ordinal_position;

-- Check indexes
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'materials';

-- Count materials by section
-- SELECT section, COUNT(*)
-- FROM materials
-- GROUP BY section
-- ORDER BY COUNT(*) DESC;
