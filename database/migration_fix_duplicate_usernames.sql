-- Migration pour corriger les doublons de pseudos avant de créer l'index unique
-- Date: 2025-10-31
-- Description: Renomme les pseudos en double en ajoutant un suffixe unique

-- Étape 1: Identifier et renommer les doublons
-- On garde le premier utilisateur avec chaque pseudo, et on renomme les suivants
WITH duplicates AS (
    SELECT
        id,
        name,
        ROW_NUMBER() OVER (PARTITION BY name ORDER BY id) as row_num
    FROM public.users_profile
    WHERE name IS NOT NULL
)
UPDATE public.users_profile
SET name = duplicates.name || '_' || duplicates.id
FROM duplicates
WHERE public.users_profile.id = duplicates.id
  AND duplicates.row_num > 1;

-- Étape 2: Afficher les pseudos qui ont été modifiés (optionnel, pour information)
-- SELECT id, name FROM public.users_profile WHERE name LIKE '%\_%' AND name ~ '_[a-f0-9-]+$';

-- Étape 3: Maintenant on peut créer l'index unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_username ON public.users_profile(name);

-- Ajouter un commentaire pour documenter l'index
COMMENT ON INDEX public.idx_unique_username IS 'Garantit l''unicité du pseudo utilisateur';
