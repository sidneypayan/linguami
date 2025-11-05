-- Ajouter la colonne theme_preference à la table users_profile
-- Cette colonne stocke la préférence de thème de l'utilisateur (light/dark)

ALTER TABLE public.users_profile
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark'));

-- Créer un index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_users_profile_theme_preference ON public.users_profile(theme_preference);

-- Commenter la colonne pour la documentation
COMMENT ON COLUMN public.users_profile.theme_preference IS 'Préférence de thème de l''utilisateur: light ou dark';
