-- Migration: Ajouter la colonne reward_given à user_goals
-- Date: 2025-11-09
-- Description: Permet de tracker si le bonus XP/Gold a été attribué pour un objectif atteint

-- Ajouter la colonne reward_given (par défaut false)
ALTER TABLE public.user_goals
ADD COLUMN IF NOT EXISTS reward_given BOOLEAN DEFAULT false;

-- Commentaire sur la colonne
COMMENT ON COLUMN public.user_goals.reward_given IS
'Indique si le bonus XP/Gold a été attribué pour cet objectif (évite les doublons)';

-- Mettre à jour les objectifs existants déjà complétés
-- On suppose qu'ils ont déjà été récompensés s'ils sont complétés
UPDATE public.user_goals
SET reward_given = true
WHERE is_completed = true;
