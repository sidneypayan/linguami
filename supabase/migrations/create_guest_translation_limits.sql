-- Table pour tracker les limites de traduction des invités par IP
CREATE TABLE IF NOT EXISTS public.guest_translation_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT NOT NULL UNIQUE,
    translation_count INTEGER NOT NULL DEFAULT 0,
    reset_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_guest_translation_limits_ip
    ON public.guest_translation_limits(ip_address);

CREATE INDEX IF NOT EXISTS idx_guest_translation_limits_reset
    ON public.guest_translation_limits(reset_at);

-- Politique RLS : permettre au service role de tout faire
ALTER TABLE public.guest_translation_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage translation limits"
    ON public.guest_translation_limits
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Nettoyage automatique des anciennes entrées (optionnel, peut être fait par un cron job)
-- Supprimer les entrées de plus de 30 jours pour éviter l'accumulation
CREATE OR REPLACE FUNCTION cleanup_old_translation_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM public.guest_translation_limits
    WHERE updated_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commentaires pour la documentation
COMMENT ON TABLE public.guest_translation_limits IS 'Stocke les compteurs de traductions pour les utilisateurs non authentifiés, basé sur leur IP';
COMMENT ON COLUMN public.guest_translation_limits.ip_address IS 'Adresse IP du client (hashée pour la confidentialité)';
COMMENT ON COLUMN public.guest_translation_limits.translation_count IS 'Nombre de traductions effectuées dans la période actuelle';
COMMENT ON COLUMN public.guest_translation_limits.reset_at IS 'Date et heure de réinitialisation du compteur (24h après la première traduction)';
