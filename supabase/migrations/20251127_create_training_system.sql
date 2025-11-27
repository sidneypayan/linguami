-- Migration: Create Training System Tables
-- Date: 2024-11-27
-- Description: Creates tables for vocabulary training exercises with XP/Gold rewards

-- ============================================
-- 1. Training Themes Table
-- ============================================
CREATE TABLE IF NOT EXISTS training_themes (
    id SERIAL PRIMARY KEY,
    lang VARCHAR(2) NOT NULL,                    -- 'ru', 'fr'
    level VARCHAR(20) NOT NULL,                  -- 'beginner', 'intermediate', 'advanced'
    key VARCHAR(50) NOT NULL,                    -- 'greetings', 'numbers', etc.
    icon VARCHAR(10),                            -- emoji icon
    label_fr TEXT,
    label_en TEXT,
    label_ru TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(lang, level, key)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_training_themes_lang_level ON training_themes(lang, level);

-- ============================================
-- 2. Training Questions Table
-- ============================================
CREATE TABLE IF NOT EXISTS training_questions (
    id SERIAL PRIMARY KEY,
    theme_id INTEGER NOT NULL REFERENCES training_themes(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,                   -- 'mcq', 'dropdown'

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

-- ============================================
-- 3. Training Progress Table (tracks user answers)
-- ============================================
CREATE TABLE IF NOT EXISTS training_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES training_questions(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    xp_awarded INTEGER DEFAULT 0,
    gold_awarded INTEGER DEFAULT 0,
    answered_at TIMESTAMPTZ DEFAULT NOW(),

    -- We track ALL attempts, not just first one
    -- XP is only awarded on first correct answer
    UNIQUE(user_id, question_id, answered_at)
);

-- Indexes for progress queries
CREATE INDEX IF NOT EXISTS idx_training_progress_user ON training_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_training_progress_question ON training_progress(question_id);
CREATE INDEX IF NOT EXISTS idx_training_progress_user_correct ON training_progress(user_id, is_correct);

-- ============================================
-- 4. Add XP Reward Config for Training
-- ============================================
-- XP per correct answer (applied at end of session)
-- Example: 10 correct answers = 10 * 2 = 20 XP, 2 Gold
INSERT INTO xp_rewards_config (action_type, xp_amount, gold_amount, description, is_active)
VALUES
    ('training_session', 2, 0, 'XP per correct answer in training session (gold = total XP / 10)', true)
ON CONFLICT (action_type) DO UPDATE SET
    xp_amount = EXCLUDED.xp_amount,
    gold_amount = EXCLUDED.gold_amount,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

-- ============================================
-- 5. RLS Policies
-- ============================================

-- Enable RLS
ALTER TABLE training_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;

-- Themes: Everyone can read, only service role can write
CREATE POLICY "Anyone can read training themes"
    ON training_themes FOR SELECT
    USING (true);

-- Questions: Everyone can read active questions, only service role can write
CREATE POLICY "Anyone can read active training questions"
    ON training_questions FOR SELECT
    USING (is_active = true);

-- Progress: Users can only see and create their own progress
CREATE POLICY "Users can read own training progress"
    ON training_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training progress"
    ON training_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 6. Helper function to check if user already got XP for a question
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
-- 7. Updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_training_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER training_themes_updated_at
    BEFORE UPDATE ON training_themes
    FOR EACH ROW EXECUTE FUNCTION update_training_updated_at();

CREATE TRIGGER training_questions_updated_at
    BEFORE UPDATE ON training_questions
    FOR EACH ROW EXECUTE FUNCTION update_training_updated_at();

-- ============================================
-- 8. Stats view for admin
-- ============================================
CREATE OR REPLACE VIEW training_stats AS
SELECT
    t.id as theme_id,
    t.lang,
    t.level,
    t.key,
    t.label_fr,
    t.label_en,
    t.icon,
    COUNT(q.id) as question_count,
    COUNT(CASE WHEN q.type = 'mcq' THEN 1 END) as mcq_count,
    COUNT(CASE WHEN q.type = 'dropdown' THEN 1 END) as dropdown_count
FROM training_themes t
LEFT JOIN training_questions q ON q.theme_id = t.id AND q.is_active = true
WHERE t.is_active = true
GROUP BY t.id, t.lang, t.level, t.key, t.label_fr, t.label_en, t.icon
ORDER BY t.lang, t.level, t.display_order;

COMMENT ON TABLE training_themes IS 'Vocabulary training themes organized by language and level';
COMMENT ON TABLE training_questions IS 'Training questions with MCQ or dropdown format';
COMMENT ON TABLE training_progress IS 'Tracks user answers and XP awards for training';
