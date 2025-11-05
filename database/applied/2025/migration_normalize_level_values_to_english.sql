-- =====================================================
-- Migration: Normaliser les valeurs de niveau en anglais
-- Date: 2025-11-05
-- Description: Remplace 'débutant'/'intermédiaire'/'avancé' par 'beginner'/'intermediate'/'advanced'
-- =====================================================

-- ÉTAPE 1: Supprimer les contraintes CHECK existantes AVANT de mettre à jour les données
ALTER TABLE public.materials DROP CONSTRAINT IF EXISTS materials_level_check;
ALTER TABLE public.books DROP CONSTRAINT IF EXISTS books_level_check;

-- ÉTAPE 2: Mettre à jour toutes les valeurs dans la table materials
UPDATE public.materials
SET level = CASE
    WHEN level = 'débutant' THEN 'beginner'
    WHEN level = 'intermédiaire' THEN 'intermediate'
    WHEN level = 'avancé' THEN 'advanced'
    WHEN level IS NULL THEN 'beginner' -- Valeur par défaut pour les NULL
    WHEN level NOT IN ('beginner', 'intermediate', 'advanced') THEN 'beginner' -- Valeur par défaut pour les valeurs invalides
    ELSE level
END;

-- ÉTAPE 3: Mettre à jour toutes les valeurs dans la table books (si elles existent)
UPDATE public.books
SET level = CASE
    WHEN level = 'débutant' THEN 'beginner'
    WHEN level = 'intermédiaire' THEN 'intermediate'
    WHEN level = 'avancé' THEN 'advanced'
    WHEN level IS NULL THEN 'beginner' -- Valeur par défaut pour les NULL
    WHEN level NOT IN ('beginner', 'intermediate', 'advanced') THEN 'beginner' -- Valeur par défaut pour les valeurs invalides
    ELSE level
END;

-- ÉTAPE 4: Créer les nouvelles contraintes CHECK avec les valeurs en anglais
ALTER TABLE public.materials
ADD CONSTRAINT materials_level_check
CHECK (level IN ('beginner', 'intermediate', 'advanced'));

ALTER TABLE public.books
ADD CONSTRAINT books_level_check
CHECK (level IN ('beginner', 'intermediate', 'advanced'));

-- 5. Vérifier les résultats
SELECT
    'materials' as table_name,
    level,
    COUNT(*) as count
FROM public.materials
GROUP BY level
ORDER BY level;

SELECT
    'books' as table_name,
    level,
    COUNT(*) as count
FROM public.books
GROUP BY level
ORDER BY level;

-- 6. Ajouter un commentaire sur les colonnes
COMMENT ON COLUMN public.materials.level IS 'Niveau de difficulté du matériel (beginner, intermediate, advanced)';
COMMENT ON COLUMN public.books.level IS 'Niveau de difficulté du livre (beginner, intermediate, advanced)';

-- Fin de la migration
