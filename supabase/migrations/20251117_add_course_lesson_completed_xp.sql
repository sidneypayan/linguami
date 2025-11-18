-- Migration: Add XP reward for course lesson completion
-- Date: 2025-01-17
-- Description: Adds course_lesson_completed action to xp_rewards_config

-- Add course lesson completion reward
INSERT INTO xp_rewards_config (action_type, xp_amount, gold_amount, description, is_active)
VALUES (
    'course_lesson_completed',
    50,
    5,
    'Completed a course lesson in the Method section',
    true
)
ON CONFLICT (action_type) DO UPDATE
SET
    xp_amount = EXCLUDED.xp_amount,
    gold_amount = EXCLUDED.gold_amount,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Verify the insert
SELECT action_type, xp_amount, gold_amount, description, is_active
FROM xp_rewards_config
WHERE action_type = 'course_lesson_completed';
