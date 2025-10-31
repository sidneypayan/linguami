-- Migration pour ajouter les nouveaux champs au profil utilisateur
-- Date: 2025-10-31
-- Description: Ajout de spoken_language, language_level et avatar_id pour améliorer le profil utilisateur

-- Ajouter la colonne spoken_language (langue parlée par l'utilisateur)
ALTER TABLE public.users_profile
ADD COLUMN IF NOT EXISTS spoken_language TEXT;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN public.users_profile.spoken_language IS 'Langue maternelle/parlée par l''utilisateur (english, french, russian)';

-- Ajouter la colonne language_level (niveau de langue de l'utilisateur)
ALTER TABLE public.users_profile
ADD COLUMN IF NOT EXISTS language_level TEXT;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN public.users_profile.language_level IS 'Niveau de langue de l''utilisateur dans la langue apprise (beginner, intermediate, advanced)';

-- Ajouter la colonne avatar_id (ID de l'avatar choisi)
ALTER TABLE public.users_profile
ADD COLUMN IF NOT EXISTS avatar_id TEXT DEFAULT 'avatar1';

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN public.users_profile.avatar_id IS 'ID de l''avatar choisi parmi les avatars prédéfinis (avatar1 à avatar10)';

-- Optionnel : Ajouter des contraintes de validation
-- Pour s'assurer que seules les valeurs valides sont acceptées
ALTER TABLE public.users_profile
DROP CONSTRAINT IF EXISTS check_spoken_language,
DROP CONSTRAINT IF EXISTS check_language_level,
DROP CONSTRAINT IF EXISTS check_avatar_id;

ALTER TABLE public.users_profile
ADD CONSTRAINT check_spoken_language
CHECK (spoken_language IN ('english', 'french', 'russian')),
ADD CONSTRAINT check_language_level
CHECK (language_level IN ('beginner', 'intermediate', 'advanced')),
ADD CONSTRAINT check_avatar_id
CHECK (avatar_id IN ('avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6', 'avatar7', 'avatar8', 'avatar9', 'avatar10'));

-- Créer des index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_users_profile_spoken_language ON public.users_profile(spoken_language);
CREATE INDEX IF NOT EXISTS idx_users_profile_language_level ON public.users_profile(language_level);
CREATE INDEX IF NOT EXISTS idx_users_profile_avatar_id ON public.users_profile(avatar_id);
