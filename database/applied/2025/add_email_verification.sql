-- =====================================================
-- Système de vérification d'email simple (Option 2)
-- L'utilisateur peut se connecter mais certaines actions sont limitées
-- =====================================================

-- 1. Ajouter la colonne email_verified dans users_profile
ALTER TABLE public.users_profile
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;

-- 2. Créer une table simple pour stocker les tokens de vérification
CREATE TABLE IF NOT EXISTS public.email_verification_tokens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token text NOT NULL UNIQUE,
    email text NOT NULL,
    expires_at timestamptz NOT NULL DEFAULT (now() + interval '48 hours'), -- 48h au lieu de 24h
    verified_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour recherche rapide par token
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token
    ON public.email_verification_tokens(token);

-- Index pour recherche par user_id
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id
    ON public.email_verification_tokens(user_id);

-- RLS (Row Level Security)
ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Policy : Les utilisateurs peuvent voir leurs propres tokens
CREATE POLICY "Users can view own verification tokens"
    ON public.email_verification_tokens
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy : Service role peut tout faire
CREATE POLICY "Service role can manage all tokens"
    ON public.email_verification_tokens
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Fonction pour nettoyer les anciens tokens
CREATE OR REPLACE FUNCTION public.cleanup_old_verification_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Supprimer les tokens expirés depuis plus de 7 jours
    DELETE FROM public.email_verification_tokens
    WHERE expires_at < (now() - interval '7 days');
END;
$$;

-- Fonction appelée quand un utilisateur vérifie son email
CREATE OR REPLACE FUNCTION public.verify_user_email(verification_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    token_record record;
    result jsonb;
BEGIN
    -- Chercher le token
    SELECT * INTO token_record
    FROM public.email_verification_tokens
    WHERE token = verification_token
    AND verified_at IS NULL
    AND expires_at > now();

    -- Token non trouvé ou expiré
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Token invalide ou expiré'
        );
    END IF;

    -- Marquer le token comme vérifié
    UPDATE public.email_verification_tokens
    SET verified_at = now()
    WHERE token = verification_token;

    -- Marquer l'email comme vérifié dans le profil
    UPDATE public.users_profile
    SET email_verified = true
    WHERE id = token_record.user_id;

    -- Retourner le succès
    RETURN jsonb_build_object(
        'success', true,
        'user_id', token_record.user_id,
        'email', token_record.email
    );
END;
$$;

COMMENT ON TABLE public.email_verification_tokens IS
'Stocke les tokens de vérification d''email. Les utilisateurs peuvent se connecter sans vérification,
mais certaines fonctionnalités sont limitées jusqu''à vérification.';

COMMENT ON FUNCTION public.verify_user_email(text) IS
'Vérifie l''email d''un utilisateur à partir d''un token. Retourne un JSON avec success=true/false.';

COMMENT ON FUNCTION public.cleanup_old_verification_tokens() IS
'Nettoie les tokens de vérification expirés depuis plus de 7 jours. À exécuter via cron.';
