-- Migration: Remove deprecated XP actions
-- Date: 2025-01-17
-- Description: Removes XP actions that are no longer used in the application

-- Remove deprecated XP reward configurations
DELETE FROM xp_rewards_config
WHERE action_type IN (
    'material_started',              -- No longer awarding XP for starting materials
    'session_20_cards',              -- Session milestones removed
    'session_50_cards',              -- Session milestones removed
    'flashcard_again',               -- No XP for "again" button
    'daily_goal_achieved',           -- Goal achievements removed
    'weekly_goal_achieved',          -- Goal achievements removed
    'monthly_goal_achieved',         -- Goal achievements removed
    'level_up',                      -- Level up achievements removed
    'exercise_completed',            -- Exercise XP removed
    'card_graduated',                -- Card graduation XP removed
    'first_material_per_section',    -- First material per section XP removed
    'all_sections_tried'             -- All sections tried XP removed
);

-- Note: XP transactions with these action types are kept for historical data
-- Only the configuration for future rewards is removed
