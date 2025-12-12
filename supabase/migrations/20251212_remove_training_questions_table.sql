-- Migration: Remove training_questions table (questions now in JSON files)
-- Date: 2024-12-12
-- Description: Questions are now stored in data/training/{lang}/{level}/{theme}.json

-- ============================================
-- 1. Drop the training_stats view (depends on training_questions)
-- ============================================
DROP VIEW IF EXISTS training_stats;

-- ============================================
-- 2. Drop the FK constraint from training_progress to training_questions
-- ============================================
ALTER TABLE training_progress
DROP CONSTRAINT IF EXISTS training_progress_question_id_fkey;

-- ============================================
-- 3. Drop the helper function that references training_progress
-- ============================================
DROP FUNCTION IF EXISTS has_earned_training_xp(UUID, INTEGER);

-- ============================================
-- 4. Drop the trigger on training_questions
-- ============================================
DROP TRIGGER IF EXISTS training_questions_updated_at ON training_questions;

-- ============================================
-- 5. Drop the training_questions table
-- ============================================
DROP TABLE IF EXISTS training_questions;

-- ============================================
-- 6. Recreate a simpler training_stats view (without questions count)
-- ============================================
CREATE OR REPLACE VIEW training_stats AS
SELECT
    t.id as theme_id,
    t.lang,
    t.level,
    t.key,
    t.label_fr,
    t.label_en,
    t.label_ru,
    t.icon,
    t.display_order,
    t.is_active
FROM training_themes t
WHERE t.is_active = true
ORDER BY t.lang, t.level, t.display_order;

COMMENT ON VIEW training_stats IS 'Training themes overview (questions now in JSON files)';

-- ============================================
-- 7. Recreate the helper function without FK dependency
-- ============================================
CREATE OR REPLACE FUNCTION has_earned_training_xp(p_user_id UUID, p_question_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM training_progress
        WHERE user_id = p_user_id
        AND question_id = p_question_id
        AND is_correct = true
        AND xp_awarded > 0
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Note: training_progress.question_id now references JSON question IDs
-- The IDs were preserved during export to maintain compatibility
-- ============================================
