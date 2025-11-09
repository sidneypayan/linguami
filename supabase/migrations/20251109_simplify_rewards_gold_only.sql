-- Migration: Simplifier le système de récompenses
-- Date: 2025-11-09
-- Description:
--   - Supprimer les bonus XP pour level_up
--   - Objectifs : uniquement de l'or (0 XP)

-- 1. Désactiver level_up (mettre à 0 XP et 0 Gold)
UPDATE public.xp_rewards_config
SET xp_amount = 0, gold_amount = 0, description = 'Bonus désactivé - Montée de niveau sans récompense'
WHERE action_type = 'level_up';

-- 2. Objectifs : 0 XP, uniquement de l'or
UPDATE public.xp_rewards_config
SET xp_amount = 0, description = 'Objectif quotidien atteint - Récompense : 1 Gold'
WHERE action_type = 'daily_goal_achieved';

UPDATE public.xp_rewards_config
SET xp_amount = 0, description = 'Objectif hebdomadaire atteint - Récompense : 3 Gold'
WHERE action_type = 'weekly_goal_achieved';

UPDATE public.xp_rewards_config
SET xp_amount = 0, description = 'Objectif mensuel atteint - Récompense : 10 Gold'
WHERE action_type = 'monthly_goal_achieved';

-- Vérification
SELECT action_type, xp_amount, gold_amount, description
FROM public.xp_rewards_config
WHERE action_type IN ('level_up', 'daily_goal_achieved', 'weekly_goal_achieved', 'monthly_goal_achieved')
ORDER BY action_type;
