-- Migration: Restore training_questions table with status field
-- Date: 2024-12-14
-- Description: Restore DB architecture for training questions with draft/published workflow

-- ============================================
-- 1. Drop the old training_stats view
-- ============================================
DROP VIEW IF EXISTS training_stats;

-- ============================================
-- 2. Recreate training_questions table with status field
-- ============================================
CREATE TABLE IF NOT EXISTS training_questions (
    id SERIAL PRIMARY KEY,
    theme_id INTEGER NOT NULL REFERENCES training_themes(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,                   -- 'mcq', 'dropdown'

    -- Status field for draft/published workflow
    status VARCHAR(20) NOT NULL DEFAULT 'published', -- 'draft', 'published', 'archived'

    -- For MCQ type
    question_fr TEXT,
    question_en TEXT,
    question_ru TEXT,

    -- For Dropdown type
    sentence TEXT,                               -- "Меня ___ Анна."
    blank TEXT,                                  -- "зовут"

    -- Common fields
    options JSONB NOT NULL,                      -- ['opt1', 'opt2'] or {fr: [...], en: [...]}
    correct_answer INTEGER NOT NULL,             -- Index of correct option (0-based)

    -- Explanations
    explanation_fr TEXT,
    explanation_en TEXT,
    explanation_ru TEXT,

    -- Metadata
    difficulty INTEGER DEFAULT 1,                -- 1-3 (easy, medium, hard)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_training_questions_theme ON training_questions(theme_id);
CREATE INDEX IF NOT EXISTS idx_training_questions_type ON training_questions(type);
CREATE INDEX IF NOT EXISTS idx_training_questions_status ON training_questions(status);

-- ============================================
-- 3. Restore FK constraint on training_progress
-- ============================================
ALTER TABLE training_progress
ADD CONSTRAINT training_progress_question_id_fkey
FOREIGN KEY (question_id) REFERENCES training_questions(id) ON DELETE CASCADE;

-- ============================================
-- 4. Recreate updated_at trigger
-- ============================================
CREATE TRIGGER training_questions_updated_at
    BEFORE UPDATE ON training_questions
    FOR EACH ROW EXECUTE FUNCTION update_training_updated_at();

-- ============================================
-- 5. RLS Policies
-- ============================================
ALTER TABLE training_questions ENABLE ROW LEVEL SECURITY;

-- Public users can only read published questions
CREATE POLICY "Anyone can read published training questions"
    ON training_questions FOR SELECT
    USING (is_active = true AND status = 'published');

-- Admin can read all questions (for admin panel)
CREATE POLICY "Admins can read all training questions"
    ON training_questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users_profile
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Only service role can insert/update/delete (via Server Actions with admin check)
-- No public policies for INSERT/UPDATE/DELETE

-- ============================================
-- 6. Recreate training_stats view with question counts
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
    t.is_active,
    COUNT(q.id) as question_count,
    COUNT(CASE WHEN q.type = 'mcq' THEN 1 END) as mcq_count,
    COUNT(CASE WHEN q.type = 'dropdown' THEN 1 END) as dropdown_count,
    COUNT(CASE WHEN q.status = 'published' THEN 1 END) as published_count,
    COUNT(CASE WHEN q.status = 'draft' THEN 1 END) as draft_count
FROM training_themes t
LEFT JOIN training_questions q ON q.theme_id = t.id AND q.is_active = true
WHERE t.is_active = true
GROUP BY t.id, t.lang, t.level, t.key, t.label_fr, t.label_en, t.label_ru, t.icon, t.display_order, t.is_active
ORDER BY t.lang, t.level, t.display_order;

COMMENT ON TABLE training_questions IS 'Training questions with MCQ or dropdown format and draft/published workflow';
COMMENT ON VIEW training_stats IS 'Training themes overview with question counts by status';
