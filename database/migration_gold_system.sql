-- Migration to add Gold system to user_xp_profile
-- This adds gold tracking alongside XP (gold is a currency, not for leveling)

-- Add gold column to user_xp_profile table
ALTER TABLE public.user_xp_profile
ADD COLUMN IF NOT EXISTS total_gold INTEGER DEFAULT 0;

-- Update existing rows to have default values
UPDATE public.user_xp_profile
SET total_gold = 0
WHERE total_gold IS NULL;

-- Add gold rewards to xp_rewards_config
-- Each XP-earning action also gives some gold (typically 1/10th of XP value as gold)
ALTER TABLE public.xp_rewards_config
ADD COLUMN IF NOT EXISTS gold_amount INTEGER DEFAULT 0;

-- Set gold amounts for existing actions (50-100x plus rare que l'XP)
-- Philosophie : L'or récompense les accomplissements significatifs, pas les actions répétitives

-- Flashcards (actions répétitives - peu ou pas d'or)
UPDATE public.xp_rewards_config SET gold_amount = 0 WHERE action_type = 'flashcard_again';
UPDATE public.xp_rewards_config SET gold_amount = 0 WHERE action_type = 'flashcard_hard';
UPDATE public.xp_rewards_config SET gold_amount = 0 WHERE action_type = 'flashcard_good';
UPDATE public.xp_rewards_config SET gold_amount = 0 WHERE action_type = 'flashcard_easy';
UPDATE public.xp_rewards_config SET gold_amount = 5 WHERE action_type = 'perfect_session';

-- Matériaux (accomplissements)
UPDATE public.xp_rewards_config SET gold_amount = 1 WHERE action_type = 'material_started';
UPDATE public.xp_rewards_config SET gold_amount = 5 WHERE action_type = 'material_completed';

-- Activités H5P
UPDATE public.xp_rewards_config SET gold_amount = 2 WHERE action_type = 'h5p_activity_completed';

-- Vocabulaire (action simple)
UPDATE public.xp_rewards_config SET gold_amount = 0 WHERE action_type = 'word_added';

-- Engagement quotidien
UPDATE public.xp_rewards_config SET gold_amount = 1 WHERE action_type = 'daily_login';
UPDATE public.xp_rewards_config SET gold_amount = 2 WHERE action_type = 'daily_goal_achieved';
UPDATE public.xp_rewards_config SET gold_amount = 5 WHERE action_type = 'weekly_goal_achieved';
UPDATE public.xp_rewards_config SET gold_amount = 15 WHERE action_type = 'monthly_goal_achieved';

-- Streaks (meilleurs ratios pour récompenser l'engagement régulier)
UPDATE public.xp_rewards_config SET gold_amount = 3 WHERE action_type = 'streak_3_days';
UPDATE public.xp_rewards_config SET gold_amount = 8 WHERE action_type = 'streak_7_days';
UPDATE public.xp_rewards_config SET gold_amount = 30 WHERE action_type = 'streak_30_days';

-- Update xp_transactions to track gold earned
ALTER TABLE public.xp_transactions
ADD COLUMN IF NOT EXISTS gold_earned INTEGER DEFAULT 0;

COMMENT ON COLUMN public.user_xp_profile.total_gold IS 'Total gold coins earned by the user (currency for future features)';
COMMENT ON COLUMN public.xp_rewards_config.gold_amount IS 'Amount of gold coins awarded for this action';
COMMENT ON COLUMN public.xp_transactions.gold_earned IS 'Gold coins earned in this transaction';
