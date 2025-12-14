-- Migration: Restore content columns to course_lessons table
-- Reason: Moving back from JSON files to database for better admin editing workflow
-- Date: 2025-12-14

-- ============================================
-- 1. Add back blocks columns (JSONB for structured content)
-- ============================================
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS blocks_fr JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS blocks_en JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS blocks_ru JSONB DEFAULT '[]';

-- ============================================
-- 2. Add back objectives columns (TEXT ARRAY for learning objectives)
-- ============================================
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS objectives_fr TEXT[],
ADD COLUMN IF NOT EXISTS objectives_en TEXT[],
ADD COLUMN IF NOT EXISTS objectives_ru TEXT[];

-- ============================================
-- 3. Add status column for draft/published workflow
-- ============================================
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));

-- Set existing lessons to published
UPDATE course_lessons
SET status = 'published'
WHERE status IS NULL;

-- ============================================
-- 4. Update RLS policies to filter by status
-- ============================================

-- Drop old policy
DROP POLICY IF EXISTS "lessons_public_read" ON course_lessons;

-- Create new policy: only published lessons visible to public
CREATE POLICY "lessons_public_read"
ON course_lessons
FOR SELECT
USING (is_published = true AND status = 'published');

-- Admin policy: admins can see all lessons (including drafts)
CREATE POLICY "lessons_admin_all"
ON course_lessons
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
CREATE INDEX IF NOT EXISTS idx_course_lessons_status ON course_lessons(status);

-- ============================================
-- 6. Comments for documentation
-- ============================================
COMMENT ON COLUMN course_lessons.blocks_fr IS 'Lesson content blocks in French (dialogue, grammar, culture, etc.)';
COMMENT ON COLUMN course_lessons.blocks_en IS 'Lesson content blocks in English';
COMMENT ON COLUMN course_lessons.blocks_ru IS 'Lesson content blocks in Russian';
COMMENT ON COLUMN course_lessons.objectives_fr IS 'Learning objectives in French';
COMMENT ON COLUMN course_lessons.objectives_en IS 'Learning objectives in English';
COMMENT ON COLUMN course_lessons.objectives_ru IS 'Learning objectives in Russian';
COMMENT ON COLUMN course_lessons.status IS 'Lesson status: draft (not visible), published (visible to users), archived (hidden)';

-- Update table comment
COMMENT ON TABLE course_lessons IS 'Lesson metadata and content. Content stored in blocks_* JSONB columns. Status workflow for admin editing.';
