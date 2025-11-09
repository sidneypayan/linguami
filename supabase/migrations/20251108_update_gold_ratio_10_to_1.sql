-- ==========================================
-- Update Gold Ratio to 10:1
-- Change from previous ratios to consistent 10 XP = 1 Gold
-- ==========================================

-- Update all gold amounts based on XP amounts with 10:1 ratio
UPDATE xp_rewards_config
SET gold_amount = FLOOR(xp_amount / 10.0)
WHERE is_active = TRUE;

-- Verify the changes
-- Uncomment to see the updated values:
-- SELECT action_type, xp_amount, gold_amount,
--        CONCAT(xp_amount, ':', gold_amount) as ratio
-- FROM xp_rewards_config
-- ORDER BY xp_amount DESC;

-- Summary of new gold amounts:
-- flashcard_again: 0 XP → 0 Gold
-- flashcard_hard: 1 XP → 0 Gold
-- flashcard_good: 2 XP → 0 Gold
-- flashcard_easy: 3 XP → 0 Gold
-- card_graduated: 5 XP → 0 Gold
-- word_added: 1 XP → 0 Gold
-- daily_login: 2 XP → 0 Gold
-- material_started: 2 XP → 0 Gold
-- book_chapter_read: 5 XP → 0 Gold
-- streak_3_days: 10 XP → 1 Gold
-- daily_goal_achieved: 10 XP → 1 Gold
-- material_completed: 10 XP → 1 Gold
-- perfect_session: 20 XP → 2 Gold
-- streak_7_days: 25 XP → 2 Gold
-- book_completed: 30 XP → 3 Gold
-- level_up: 30 XP → 3 Gold
-- weekly_goal_achieved: 30 XP → 3 Gold
-- mastered_100_words: 40 XP → 4 Gold
-- first_material_per_section: 8 XP → 0 Gold
-- all_sections_tried: 40 XP → 4 Gold
-- mastered_500_words: 100 XP → 10 Gold
-- monthly_goal_achieved: 100 XP → 10 Gold
-- streak_30_days: 100 XP → 10 Gold
