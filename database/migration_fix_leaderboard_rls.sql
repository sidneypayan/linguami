-- ==========================================
-- FIX LEADERBOARD - Row Level Security
-- ==========================================
-- Problème : Les utilisateurs ne peuvent voir que leur propre profil XP
-- Solution : Permettre à tous les utilisateurs authentifiés de voir les profils XP des autres
--            pour permettre l'affichage du leaderboard

-- ==========================================
-- 1. FIX user_xp_profile policies
-- ==========================================

-- Ajouter une policy pour permettre aux utilisateurs authentifiés de voir tous les profils XP
-- (nécessaire pour le leaderboard public)
DROP POLICY IF EXISTS "Authenticated users can view all xp profiles for leaderboard" ON public.user_xp_profile;
CREATE POLICY "Authenticated users can view all xp profiles for leaderboard"
  ON public.user_xp_profile FOR SELECT
  USING (auth.role() = 'authenticated');

-- Note : Cette policy permet la lecture publique des profils XP par tous les utilisateurs authentifiés.
-- Cela est nécessaire pour le leaderboard et ne pose pas de problème de sécurité car :
-- 1. Seules les informations publiques (XP, niveau, streak) sont exposées
-- 2. Les données sensibles (email, etc.) ne sont pas dans cette table
-- 3. La modification reste restreinte à l'utilisateur propriétaire du profil

-- ==========================================
-- 2. FIX users_profile policies (pour les avatars et noms dans le leaderboard)
-- ==========================================

-- Ajouter une policy pour permettre aux utilisateurs authentifiés de voir les profils des autres
-- (nécessaire pour afficher les noms et avatars dans le leaderboard)
DROP POLICY IF EXISTS "Authenticated users can view all profiles for leaderboard" ON public.users_profile;
CREATE POLICY "Authenticated users can view all profiles for leaderboard"
  ON public.users_profile FOR SELECT
  USING (auth.role() = 'authenticated');

-- Note : Cette policy permet aux utilisateurs authentifiés de voir les profils publics (nom, avatar).
-- Les informations sensibles ne doivent pas être exposées dans cette table.
-- La modification reste restreinte à l'utilisateur propriétaire du profil.

-- ==========================================
-- VÉRIFICATION
-- ==========================================

-- Pour vérifier les policies actuelles, exécutez :
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('user_xp_profile', 'users_profile')
-- ORDER BY tablename, policyname;
