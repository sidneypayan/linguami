-- =====================================================
-- Fix RLS policies pour email_verification_tokens
-- Permettre aux utilisateurs authentifiés de créer leurs propres tokens
-- =====================================================

-- Supprimer l'ancienne policy restrictive si elle existe
DROP POLICY IF EXISTS "Users can view own verification tokens" ON public.email_verification_tokens;
DROP POLICY IF EXISTS "Service role can manage all tokens" ON public.email_verification_tokens;

-- Nouvelle policy : Les utilisateurs authentifiés peuvent créer leurs propres tokens
CREATE POLICY "Users can create own verification tokens"
    ON public.email_verification_tokens
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Nouvelle policy : Les utilisateurs peuvent voir leurs propres tokens
CREATE POLICY "Users can view own verification tokens"
    ON public.email_verification_tokens
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Nouvelle policy : Les utilisateurs peuvent supprimer leurs anciens tokens
CREATE POLICY "Users can delete own verification tokens"
    ON public.email_verification_tokens
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy : Service role peut tout faire
CREATE POLICY "Service role can manage all tokens"
    ON public.email_verification_tokens
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy : Les fonctions peuvent tout faire (pour verify_user_email)
CREATE POLICY "Functions can manage tokens"
    ON public.email_verification_tokens
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

COMMENT ON POLICY "Users can create own verification tokens" ON public.email_verification_tokens IS
'Permet aux utilisateurs authentifiés de créer leurs propres tokens de vérification';

COMMENT ON POLICY "Users can delete own verification tokens" ON public.email_verification_tokens IS
'Permet aux utilisateurs de supprimer leurs anciens tokens (utile pour resendVerificationEmail)';
