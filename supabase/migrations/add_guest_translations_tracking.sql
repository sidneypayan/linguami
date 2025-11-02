-- Table pour suivre les traductions des invités par IP
CREATE TABLE IF NOT EXISTS guest_translation_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT NOT NULL,
    translation_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche rapide par IP
CREATE INDEX IF NOT EXISTS idx_guest_translation_tracking_ip
ON guest_translation_tracking(ip_address);

-- Pas de RLS sur cette table car elle est gérée uniquement côté serveur
ALTER TABLE guest_translation_tracking DISABLE ROW LEVEL SECURITY;
