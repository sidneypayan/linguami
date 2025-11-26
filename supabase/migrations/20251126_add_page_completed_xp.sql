-- Migration: Add page_completed, chapter_completed and book_completed actions to xp_rewards_config
-- Description: Adds XP rewards for completing pages, chapters and books

-- XP for completing a single page (10 XP, 1 Gold)
INSERT INTO xp_rewards_config (action_type, xp_amount, gold_amount, description, is_active)
VALUES ('page_completed', 10, 1, 'Completed a page in a book chapter', true)
ON CONFLICT (action_type) DO NOTHING;

-- Bonus XP for completing all pages of a chapter (50 XP, 5 Gold)
INSERT INTO xp_rewards_config (action_type, xp_amount, gold_amount, description, is_active)
VALUES ('chapter_completed', 50, 5, 'Completed all pages of a chapter (bonus)', true)
ON CONFLICT (action_type) DO NOTHING;

-- Big bonus XP for completing an entire book (200 XP, 20 Gold)
INSERT INTO xp_rewards_config (action_type, xp_amount, gold_amount, description, is_active)
VALUES ('book_completed', 200, 20, 'Completed an entire book (big bonus)', true)
ON CONFLICT (action_type) DO NOTHING;

-- Verify the inserts
SELECT action_type, xp_amount, gold_amount, description, is_active
FROM xp_rewards_config
WHERE action_type IN ('page_completed', 'chapter_completed', 'book_completed');
