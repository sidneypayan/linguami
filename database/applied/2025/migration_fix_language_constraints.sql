-- Migration: Correction des contraintes de langue
-- Description: Corrige les contraintes pour accepter les codes de langue courts (en, fr, ru)
-- Date: 2025-11-05

-- =====================================================
-- ÉTAPE 1 : Supprimer les anciennes contraintes
-- =====================================================

ALTER TABLE public.users_profile
DROP CONSTRAINT IF EXISTS check_spoken_language,
DROP CONSTRAINT IF EXISTS check_learning_language,
DROP CONSTRAINT IF EXISTS check_language_level;

-- =====================================================
-- ÉTAPE 2 : Migrer les données existantes
-- =====================================================

-- Convertir 'english' -> 'en', 'french' -> 'fr', 'russian' -> 'ru'
-- Pour spoken_language
UPDATE public.users_profile
SET spoken_language = CASE
    WHEN spoken_language = 'english' THEN 'en'
    WHEN spoken_language = 'french' THEN 'fr'
    WHEN spoken_language = 'russian' THEN 'ru'
    ELSE spoken_language
END
WHERE spoken_language IN ('english', 'french', 'russian');

-- Pour learning_language
UPDATE public.users_profile
SET learning_language = CASE
    WHEN learning_language = 'english' THEN 'en'
    WHEN learning_language = 'french' THEN 'fr'
    WHEN learning_language = 'russian' THEN 'ru'
    ELSE learning_language
END
WHERE learning_language IN ('english', 'french', 'russian');

-- =====================================================
-- ÉTAPE 3 : Créer les nouvelles contraintes avec les bons codes
-- =====================================================

-- Contrainte pour spoken_language (langue parlée)
-- Accepte les codes courts : 'en', 'fr', 'ru'
ALTER TABLE public.users_profile
ADD CONSTRAINT check_spoken_language
CHECK (spoken_language IN ('en', 'fr', 'ru'));

-- Contrainte pour language_level reste inchangée
ALTER TABLE public.users_profile
ADD CONSTRAINT check_language_level
CHECK (language_level IN ('beginner', 'intermediate', 'advanced'));

-- =====================================================
-- ÉTAPE 3 : Vérifier la contrainte learning_language si elle existe
-- =====================================================

-- Supprimer la contrainte learning_language si elle existe
ALTER TABLE public.users_profile
DROP CONSTRAINT IF EXISTS check_learning_language;

-- Ajouter une contrainte pour learning_language avec les codes courts
ALTER TABLE public.users_profile
ADD CONSTRAINT check_learning_language
CHECK (learning_language IN ('en', 'fr', 'ru'));

-- =====================================================
-- VÉRIFICATION
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migration terminée avec succès !';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Les contraintes de langue acceptent maintenant : en, fr, ru';
    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- NOTES
-- =====================================================

-- Cette migration :
-- 1. ✅ Supprime les anciennes contraintes incorrectes
-- 2. ✅ Crée de nouvelles contraintes acceptant 'en', 'fr', 'ru'
-- 3. ✅ Ajoute une contrainte pour learning_language si elle n'existait pas

-- Pour vérifier les contraintes :
-- SELECT conname, pg_get_constraintdef(oid)
-- FROM pg_constraint
-- WHERE conrelid = 'public.users_profile'::regclass
-- AND conname LIKE '%language%';
