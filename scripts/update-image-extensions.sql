-- Script pour mettre à jour toutes les extensions d'images .png en .webp
-- dans la base de données Supabase
--
-- Instructions :
-- 1. Ouvrez le SQL Editor dans votre tableau de bord Supabase
-- 2. Copiez-collez ce script
-- 3. Exécutez-le
--
-- Ce script va mettre à jour les champs image dans les tables :
-- - materials
-- - books
-- - blog (si applicable)

-- Mettre à jour les images dans la table materials
UPDATE materials
SET image = REPLACE(image, '.png', '.webp')
WHERE image LIKE '%.png';

-- Mettre à jour les images dans la table books (si le champ existe)
UPDATE books
SET image = REPLACE(image, '.png', '.webp')
WHERE image LIKE '%.png';

-- Mettre à jour les images dans la table blog (si elle existe et a un champ img)
-- Décommentez la ligne suivante si votre table blog a un champ img
-- UPDATE blog
-- SET img = REPLACE(img, '.png', '.webp')
-- WHERE img LIKE '%.png';

-- Vérifier les résultats
SELECT 'materials' as table_name, image FROM materials LIMIT 10;
SELECT 'books' as table_name, image FROM books LIMIT 10;
