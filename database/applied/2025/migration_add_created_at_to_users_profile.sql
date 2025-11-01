-- Migration: Ajout de la colonne created_at à users_profile
-- Description: Ajoute une colonne created_at et la remplit avec les données de auth.users
-- Date: 2025-11-01

-- =====================================================
-- ÉTAPE 1 : Ajouter la colonne created_at
-- =====================================================

-- Ajouter la colonne created_at avec un type TIMESTAMP WITH TIME ZONE
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- ÉTAPE 2 : Remplir la colonne avec les données existantes
-- =====================================================

-- Copier les dates de création depuis auth.users
UPDATE users_profile
SET created_at = auth.users.created_at
FROM auth.users
WHERE users_profile.id = auth.users.id
  AND users_profile.created_at IS NULL;

-- =====================================================
-- ÉTAPE 3 : Définir une valeur par défaut
-- =====================================================

-- Pour les nouveaux enregistrements, utiliser la date actuelle par défaut
ALTER TABLE users_profile
ALTER COLUMN created_at SET DEFAULT NOW();

-- =====================================================
-- ÉTAPE 4 : Ajouter une colonne updated_at (bonus)
-- =====================================================

-- Ajouter aussi updated_at pour tracker les modifications
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Remplir updated_at avec les données de auth.users si disponibles
UPDATE users_profile
SET updated_at = auth.users.updated_at
FROM auth.users
WHERE users_profile.id = auth.users.id
  AND users_profile.updated_at IS NULL;

-- =====================================================
-- ÉTAPE 5 : Créer un trigger pour updated_at
-- =====================================================

-- Créer une fonction trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_users_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS users_profile_updated_at_trigger ON users_profile;

-- Créer le trigger qui met à jour updated_at lors de chaque modification
CREATE TRIGGER users_profile_updated_at_trigger
    BEFORE UPDATE ON users_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_users_profile_updated_at();

-- =====================================================
-- ÉTAPE 6 : Ajouter des index pour performance
-- =====================================================

-- Index sur created_at pour les requêtes de tri
CREATE INDEX IF NOT EXISTS idx_users_profile_created_at
ON users_profile(created_at DESC);

-- Index sur updated_at pour les requêtes de tri
CREATE INDEX IF NOT EXISTS idx_users_profile_updated_at
ON users_profile(updated_at DESC);

-- =====================================================
-- ÉTAPE 7 : Créer une fonction pour synchroniser automatiquement
--           les nouveaux utilisateurs avec auth.users
-- =====================================================

-- Fonction pour copier les données de auth.users vers users_profile
-- Cette fonction sera appelée automatiquement lors de la création d'un profil
CREATE OR REPLACE FUNCTION sync_user_profile_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    -- Si created_at n'est pas défini, le récupérer depuis auth.users
    IF NEW.created_at IS NULL THEN
        SELECT created_at INTO NEW.created_at
        FROM auth.users
        WHERE id = NEW.id;
    END IF;

    -- Si updated_at n'est pas défini, utiliser NOW()
    IF NEW.updated_at IS NULL THEN
        NEW.updated_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS sync_user_profile_timestamps_trigger ON users_profile;

-- Créer le trigger pour les nouveaux profils
CREATE TRIGGER sync_user_profile_timestamps_trigger
    BEFORE INSERT ON users_profile
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_profile_timestamps();

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Afficher un résumé des données
DO $$
DECLARE
    total_users INTEGER;
    users_with_created_at INTEGER;
    users_without_created_at INTEGER;
    user_record RECORD;
BEGIN
    -- Compter les utilisateurs
    SELECT COUNT(*) INTO total_users FROM users_profile;
    SELECT COUNT(*) INTO users_with_created_at FROM users_profile WHERE created_at IS NOT NULL;
    SELECT COUNT(*) INTO users_without_created_at FROM users_profile WHERE created_at IS NULL;

    -- Afficher les résultats
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migration terminée avec succès !';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total utilisateurs: %', total_users;
    RAISE NOTICE 'Avec created_at: %', users_with_created_at;
    RAISE NOTICE 'Sans created_at: %', users_without_created_at;
    RAISE NOTICE '========================================';

    -- Afficher les 3 premiers utilisateurs
    RAISE NOTICE 'Exemples (3 premiers utilisateurs):';
    FOR user_record IN (
        SELECT name, created_at, updated_at
        FROM users_profile
        ORDER BY created_at
        LIMIT 3
    ) LOOP
        RAISE NOTICE '- % | created: % | updated: %', user_record.name, user_record.created_at, user_record.updated_at;
    END LOOP;
    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- NOTES
-- =====================================================

-- Cette migration :
-- 1. ✅ Ajoute created_at à users_profile
-- 2. ✅ Remplit created_at avec les données de auth.users
-- 3. ✅ Ajoute updated_at pour tracker les modifications
-- 4. ✅ Crée des triggers pour maintenir updated_at à jour
-- 5. ✅ Synchronise automatiquement les timestamps pour les nouveaux utilisateurs
-- 6. ✅ Ajoute des index pour améliorer les performances

-- Pour vérifier manuellement :
-- SELECT id, name, created_at, updated_at FROM users_profile ORDER BY created_at LIMIT 10;

-- Pour vérifier la synchronisation avec auth.users :
-- SELECT
--   up.id,
--   up.name,
--   up.created_at as profile_created,
--   au.created_at as auth_created,
--   up.created_at = au.created_at as synchronized
-- FROM users_profile up
-- JOIN auth.users au ON up.id = au.id
-- LIMIT 10;
