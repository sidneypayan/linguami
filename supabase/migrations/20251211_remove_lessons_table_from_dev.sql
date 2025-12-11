-- Migration: Remove lessons table from dev DB
-- Reason: Lessons metadata is now always fetched from PROD via coursesClient
-- Content is stored in JSON files at data/lessons/[lang]/[slug].json
-- User progress is stored in user_lessons table (kept in env-specific DB)

-- Drop lessons table (metadata now in PROD, content in JSON)
DROP TABLE IF EXISTS lessons CASCADE;

-- Note: user_lessons table is kept in environment-specific DB for user progress tracking
COMMENT ON TABLE user_lessons IS 'User progress for standalone lessons. Lesson metadata in PROD DB, content in JSON files.';
