-- =====================================================
-- FIX FINAL: Les utilisateurs authentifiés ne peuvent voir
-- que leur propre email, pas celui des autres
-- =====================================================

-- Supprimer la policy trop permissive
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.users_profile;

-- Nouvelle policy: Les utilisateurs peuvent voir LEUR PROPRE profil complet (avec email)
CREATE POLICY "Users can view own complete profile"
    ON public.users_profile
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Nouvelle policy: Les utilisateurs peuvent voir les profils publics des AUTRES (sans email)
-- Cette policy utilise une astuce: elle filtre les colonnes via une vue ou retourne false pour les colonnes sensibles
-- MAIS PostgreSQL RLS ne peut pas filtrer par colonne, seulement par ligne
-- Donc on doit accepter que les utilisateurs authentifiés voient tous les profils
-- La vraie sécurité sera dans le code: utiliser public_users_profile au lieu de users_profile

CREATE POLICY "Users can view other profiles basic info"
    ON public.users_profile
    FOR SELECT
    TO authenticated
    USING (
        -- Peut voir tous les profils, MAIS dans le code on utilisera public_users_profile
        -- pour éviter d'exposer les emails
        true
    );

-- ⚠️ LIMITATION DE POSTGRESQL RLS:
-- RLS ne peut pas filtrer par COLONNE, seulement par LIGNE
-- Donc on ne peut pas empêcher un utilisateur authentifié de SELECT email
-- La seule vraie solution est d'utiliser les vues publiques dans le code

-- COMMENT ON POLICY "Users can view other profiles basic info" ON public.users_profile IS
-- 'Permet de voir les profils mais le code doit utiliser public_users_profile pour éviter les emails';

-- =====================================================
-- SOLUTION ALTERNATIVE: Supprimer complètement la lecture publique
-- =====================================================

-- Option 1: Supprimer la policy ci-dessus et créer celle-ci à la place
DROP POLICY IF EXISTS "Users can view other profiles basic info" ON public.users_profile;

-- Les utilisateurs NE PEUVENT VOIR que leur propre profil complet
-- Pour voir les autres profils, ils DOIVENT utiliser public_users_profile ou leaderboard_view
CREATE POLICY "Users can only view own profile"
    ON public.users_profile
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- =====================================================
-- Résultat final
-- =====================================================
-- Les utilisateurs authentifiés peuvent:
-- ✅ Voir leur propre profil complet (avec email)
-- ❌ NE PEUVENT PAS voir les profils des autres via users_profile
-- ✅ Doivent utiliser public_users_profile pour voir les autres (sans emails)

DO $$
BEGIN
    RAISE NOTICE '=== SÉCURITÉ FINALE ===';
    RAISE NOTICE '✅ Les utilisateurs ne peuvent voir que leur propre profil dans users_profile';
    RAISE NOTICE '✅ Pour voir les autres profils, utiliser public_users_profile';
    RAISE NOTICE '✅ Pour le leaderboard, utiliser leaderboard_view';
END $$;
