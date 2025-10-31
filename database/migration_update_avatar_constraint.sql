-- Migration pour rendre la contrainte des avatars flexible
-- Date: 2025-10-31
-- Description: Supprimer la contrainte restrictive pour permettre l'ajout d'avatars futurs

-- Supprimer l'ancienne contrainte qui limite les avatars
ALTER TABLE public.users_profile
DROP CONSTRAINT IF EXISTS check_avatar_id;

-- Ne pas créer de nouvelle contrainte pour rester flexible
-- Cela permet d'ajouter autant d'avatars que nécessaire sans modifier la base de données

-- Mettre à jour le commentaire
COMMENT ON COLUMN public.users_profile.avatar_id IS 'ID de l''avatar choisi parmi les avatars prédéfinis (exemple: avatar1, avatar2, etc.)';
