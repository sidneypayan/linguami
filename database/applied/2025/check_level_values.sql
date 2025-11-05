-- =====================================================
-- Diagnostic: Vérifier toutes les valeurs de niveau existantes
-- =====================================================

-- 1. Voir toutes les valeurs distinctes dans materials
SELECT
    'materials' as table_name,
    level,
    COUNT(*) as count
FROM public.materials
GROUP BY level
ORDER BY count DESC;

-- 2. Voir toutes les valeurs distinctes dans books
SELECT
    'books' as table_name,
    level,
    COUNT(*) as count
FROM public.books
GROUP BY level
ORDER BY count DESC;

-- 3. Trouver les valeurs qui ne sont ni en français ni en anglais
SELECT
    'materials_unexpected' as table_name,
    level,
    COUNT(*) as count
FROM public.materials
WHERE level NOT IN ('débutant', 'intermédiaire', 'avancé', 'beginner', 'intermediate', 'advanced')
   OR level IS NULL
GROUP BY level
ORDER BY count DESC;

SELECT
    'books_unexpected' as table_name,
    level,
    COUNT(*) as count
FROM public.books
WHERE level NOT IN ('débutant', 'intermédiaire', 'avancé', 'beginner', 'intermediate', 'advanced')
   OR level IS NULL
GROUP BY level
ORDER BY count DESC;
