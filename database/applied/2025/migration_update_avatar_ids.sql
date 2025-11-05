-- Migration: Mise à jour de la contrainte avatar_id pour inclure tous les avatars
-- Description: Étend la contrainte pour accepter avatar1 à avatar14
-- Date: 2025-11-05

-- =====================================================
-- ÉTAPE 1 : Supprimer l'ancienne contrainte
-- =====================================================

ALTER TABLE public.users_profile
DROP CONSTRAINT IF EXISTS check_avatar_id;

-- =====================================================
-- ÉTAPE 2 : Créer la nouvelle contrainte avec tous les avatars
-- =====================================================

ALTER TABLE public.users_profile
ADD CONSTRAINT check_avatar_id
CHECK (avatar_id IN (
	'avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5',
	'avatar6', 'avatar7', 'avatar8', 'avatar9', 'avatar10',
	'avatar11', 'avatar12', 'avatar13', 'avatar14'
));

-- =====================================================
-- VÉRIFICATION
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migration terminée avec succès !';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'La contrainte avatar_id accepte maintenant 14 avatars (avatar1 à avatar14)';
    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- NOTES
-- =====================================================

-- Cette migration :
-- 1. ✅ Supprime l'ancienne contrainte limitée à 10 avatars
-- 2. ✅ Crée une nouvelle contrainte acceptant 14 avatars

-- Pour vérifier la contrainte :
-- SELECT conname, pg_get_constraintdef(oid)
-- FROM pg_constraint
-- WHERE conrelid = 'public.users_profile'::regclass
-- AND conname = 'check_avatar_id';
