-- Migration: Add XP configuration for word/card reviews
-- Purpose: Enable XP rewards when users review flashcards
-- Date: 2025-11-19

INSERT INTO public.xp_rewards_config (action_type, xp_amount, gold_amount, description)
VALUES (
  'word_review',
  5,
  1,
  'Réviser un mot (flashcard SRS)'
)
ON CONFLICT (action_type) DO UPDATE
SET
  xp_amount = EXCLUDED.xp_amount,
  gold_amount = EXCLUDED.gold_amount,
  description = EXCLUDED.description;
