-- Migration: Restore content columns to standalone lessons table
-- Reason: Moving back from JSON files to database for better admin editing workflow
-- Date: 2025-12-14

-- ============================================
-- 1. Add blocks columns per language (like course_lessons)
-- ============================================
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS blocks_fr JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS blocks_en JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS blocks_ru JSONB DEFAULT '[]';

-- ============================================
-- 2. Add status column for draft/published workflow
-- ============================================
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));

-- Set existing lessons to published
UPDATE lessons
SET status = 'published'
WHERE status IS NULL;

-- ============================================
-- 3. Add other missing metadata columns
-- ============================================
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20),
ADD COLUMN IF NOT EXISTS estimated_read_time INTEGER,
ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- ============================================
-- 4. Update RLS policies to filter by status
-- ============================================

-- Drop old policies if they exist
DROP POLICY IF EXISTS "lessons_public_read" ON lessons;
DROP POLICY IF EXISTS "lessons_admin_all" ON lessons;

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Public can only see published lessons
CREATE POLICY "lessons_public_read"
ON lessons
FOR SELECT
USING (status = 'published');

-- Admins can see and modify all lessons
CREATE POLICY "lessons_admin_all"
ON lessons
FOR ALL
USING (
	EXISTS (
		SELECT 1 FROM users_profile
		WHERE users_profile.id = auth.uid()
		AND users_profile.role = 'admin'
	)
);

-- ============================================
-- 5. Add indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_lessons_status ON lessons(status);
CREATE INDEX IF NOT EXISTS idx_lessons_target_language ON lessons(target_language);
CREATE INDEX IF NOT EXISTS idx_lessons_level ON lessons(level);

-- ============================================
-- 6. Comments for documentation
-- ============================================
COMMENT ON COLUMN lessons.blocks_fr IS 'Lesson content blocks in French';
COMMENT ON COLUMN lessons.blocks_en IS 'Lesson content blocks in English';
COMMENT ON COLUMN lessons.blocks_ru IS 'Lesson content blocks in Russian';
COMMENT ON COLUMN lessons.status IS 'Lesson status: draft (not visible), published (visible to users), archived (hidden)';
COMMENT ON COLUMN lessons.difficulty IS 'Difficulty level: beginner, intermediate, advanced';
COMMENT ON COLUMN lessons.estimated_read_time IS 'Estimated reading time in minutes';
COMMENT ON COLUMN lessons.keywords IS 'Keywords for search and categorization';

-- Update table comment
COMMENT ON TABLE lessons IS 'Standalone lessons (not part of courses). Content stored in blocks_* JSONB columns. Status workflow for admin editing.';

-- ============================================
-- 7. Remove old single blocks column (deprecated)
-- ============================================
ALTER TABLE lessons
DROP COLUMN IF EXISTS blocks;
