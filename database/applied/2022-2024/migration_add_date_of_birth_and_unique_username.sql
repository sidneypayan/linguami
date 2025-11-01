-- Migration pour ajouter la date de naissance
-- Date: 2025-10-31
-- Description: Ajout de date_of_birth
-- Note: Pour l'index unique sur le pseudo, exécutez d'abord migration_fix_duplicate_usernames.sql

-- Ajouter la colonne date_of_birth (date de naissance de l'utilisateur)
ALTER TABLE public.users_profile
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN public.users_profile.date_of_birth IS 'Date de naissance de l''utilisateur';

-- Créer un index pour améliorer les performances des requêtes sur date_of_birth
CREATE INDEX IF NOT EXISTS idx_users_profile_date_of_birth ON public.users_profile(date_of_birth);
