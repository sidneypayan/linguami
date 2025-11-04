-- Créer la table pour tracker les traductions des invités
CREATE TABLE IF NOT EXISTS guest_translation_tracking (
    id BIGSERIAL PRIMARY KEY,
    ip_address TEXT NOT NULL UNIQUE,
    translation_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index sur ip_address pour des requêtes rapides
CREATE INDEX IF NOT EXISTS idx_guest_translation_tracking_ip
ON guest_translation_tracking(ip_address);

-- Commentaire sur la table
COMMENT ON TABLE guest_translation_tracking IS
'Tracks translation count for guest users by IP address to prevent abuse';
