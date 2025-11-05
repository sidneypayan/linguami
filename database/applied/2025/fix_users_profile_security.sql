-- =====================================================
-- FIX DE SÉCURITÉ: Protection des colonnes sensibles
-- =====================================================
-- Problème: Les colonnes email et email_verified sont accessibles publiquement
-- Solution: Créer une vue publique + RLS restrictifs

-- =====================================================
-- ÉTAPE 1: Créer une vue publique sécurisée
-- =====================================================

-- Vue publique pour le leaderboard et affichages publics
-- Ne contient QUE les colonnes non-sensibles
CREATE OR REPLACE VIEW public.public_users_profile AS
SELECT
    id,
    name,
    avatar_id,
    spoken_language,
    learning_language,
    language_level,
    created_at
FROM public.users_profile;

-- Activer RLS sur la vue
ALTER VIEW public.public_users_profile SET (security_barrier = true);

-- Permission de lecture publique sur la vue
GRANT SELECT ON public.public_users_profile TO anon, authenticated;

COMMENT ON VIEW public.public_users_profile IS
'Vue publique de users_profile exposant uniquement les colonnes non-sensibles (pour leaderboard, etc.)';

-- =====================================================
-- ÉTAPE 2: Restreindre l'accès à la table principale
-- =====================================================

-- Supprimer les anciennes policies trop permissives
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users_profile;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users_profile;
DROP POLICY IF EXISTS "Anonymous users can view public profiles" ON public.users_profile;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.users_profile;

-- NOUVELLE POLICY: Les utilisateurs anonymes N'ONT PLUS accès à users_profile
-- (Ils utiliseront la vue public_users_profile à la place)

-- NOUVELLE POLICY: Les utilisateurs authentifiés peuvent voir tous les profils
-- MAIS dans le code, on utilisera la vue publique pour les leaderboards
CREATE POLICY "Authenticated users can view all profiles"
    ON public.users_profile
    FOR SELECT
    TO authenticated
    USING (true);

-- Les utilisateurs peuvent créer leur propre profil
CREATE POLICY "Users can insert their own profile"
    ON public.users_profile
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Les utilisateurs peuvent modifier uniquement leur propre profil
CREATE POLICY "Users can update own profile"
    ON public.users_profile
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Les utilisateurs peuvent supprimer leur propre profil
CREATE POLICY "Users can delete own profile"
    ON public.users_profile
    FOR DELETE
    TO authenticated
    USING (auth.uid() = id);

-- Le service role a accès complet
CREATE POLICY "Service role has full access"
    ON public.users_profile
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- ÉTAPE 3: Vue pour les données XP (leaderboard)
-- =====================================================

-- Vue pour le leaderboard avec les données XP
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT
    p.id,
    p.name,
    p.avatar_id,
    p.spoken_language,
    p.learning_language,
    p.language_level,
    xp.total_xp,
    xp.current_level,
    xp.daily_streak,
    xp.total_gold,
    xp.last_activity_date
FROM public.public_users_profile p
LEFT JOIN public.user_xp_profile xp ON xp.user_id = p.id
WHERE xp.total_xp > 0  -- Uniquement les utilisateurs avec de l'XP
ORDER BY xp.total_xp DESC;

-- Permission de lecture publique sur la vue leaderboard
GRANT SELECT ON public.leaderboard_view TO anon, authenticated;

COMMENT ON VIEW public.leaderboard_view IS
'Vue publique pour le leaderboard avec XP, sans données sensibles';

-- =====================================================
-- ÉTAPE 4: Commentaires et documentation
-- =====================================================

COMMENT ON POLICY "Authenticated users can view all profiles" ON public.users_profile IS
'Les utilisateurs authentifiés peuvent voir tous les profils (pour leurs propres besoins)';

COMMENT ON POLICY "Users can insert their own profile" ON public.users_profile IS
'Les utilisateurs peuvent créer leur propre profil lors de l''inscription';

COMMENT ON POLICY "Users can update own profile" ON public.users_profile IS
'Les utilisateurs peuvent modifier uniquement leur propre profil';

COMMENT ON POLICY "Users can delete own profile" ON public.users_profile IS
'Les utilisateurs peuvent supprimer leur propre profil';

COMMENT ON POLICY "Service role has full access" ON public.users_profile IS
'Le service role a accès complet pour les opérations backend';

-- =====================================================
-- VÉRIFICATION POST-MIGRATION
-- =====================================================

-- Pour vérifier que ça fonctionne:
-- 1. En tant qu'utilisateur anonyme (anon):
--    SELECT * FROM public_users_profile;  -- ✅ Devrait marcher
--    SELECT * FROM users_profile;         -- ❌ Devrait échouer
--
-- 2. En tant qu'utilisateur authentifié:
--    SELECT * FROM public_users_profile;  -- ✅ Devrait marcher
--    SELECT * FROM users_profile;         -- ✅ Devrait marcher (mais à éviter dans le code)

-- =====================================================
-- NOTES IMPORTANTES
-- =====================================================

-- ⚠️ APRÈS CETTE MIGRATION:
-- 1. Mettre à jour le code frontend pour utiliser "public_users_profile"
--    au lieu de "users_profile" dans les leaderboards
-- 2. Utiliser "leaderboard_view" pour les classements
-- 3. Garder "users_profile" uniquement pour les pages de profil personnel

-- ✅ COLONNES PROTÉGÉES:
-- - email (ne sera plus accessible publiquement)
-- - email_verified (ne sera plus accessible publiquement)
-- - Toute autre colonne sensible ajoutée à l'avenir

-- ✅ COLONNES PUBLIQUES (via les vues):
-- - id, name, avatar_id
-- - spoken_language, learning_language, language_level
-- - total_xp, current_level, daily_streak, total_gold
-- - created_at, last_activity_at
