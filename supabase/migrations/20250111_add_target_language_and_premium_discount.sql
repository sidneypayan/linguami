-- Migration: Ajouter target_language aux cours et réduction premium aux niveaux
-- Date: 2025-01-11

-- ============================================
-- 1. Ajouter la colonne target_language aux cours
-- ============================================
-- Cette colonne indique quelle langue on APPREND (pas l'interface)
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS target_language VARCHAR(2) NOT NULL DEFAULT 'ru';

COMMENT ON COLUMN courses.target_language IS 'Langue enseignée par ce cours (ru = russe, fr = français)';

-- ============================================
-- 2. Mettre à jour les cours existants
-- ============================================
-- Cours de russe
UPDATE courses
SET target_language = 'ru'
WHERE slug = 'premiers-pas';

-- Cours de français
UPDATE courses
SET target_language = 'fr'
WHERE slug = 'premiers-pas-francais';

-- ============================================
-- 3. Ajouter la réduction premium aux niveaux
-- ============================================
ALTER TABLE course_levels
ADD COLUMN IF NOT EXISTS premium_discount_percent INTEGER DEFAULT 20;

COMMENT ON COLUMN course_levels.premium_discount_percent IS 'Pourcentage de réduction pour les utilisateurs premium (0-100)';

-- ============================================
-- 4. Ajouter un prix séparé pour les premium (optionnel)
-- ============================================
ALTER TABLE course_levels
ADD COLUMN IF NOT EXISTS price_premium_eur DECIMAL(10,2);

COMMENT ON COLUMN course_levels.price_premium_eur IS 'Prix pour les utilisateurs premium (si NULL, utiliser price_eur - discount)';

-- ============================================
-- 5. Calculer et définir les prix premium
-- ============================================
-- Si price_eur est défini, calculer automatiquement price_premium_eur
UPDATE course_levels
SET price_premium_eur = ROUND(price_eur * (100 - premium_discount_percent) / 100.0, 2)
WHERE price_eur IS NOT NULL AND price_premium_eur IS NULL;

-- ============================================
-- 6. Créer un index pour optimiser les requêtes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_courses_target_language ON courses(target_language);
CREATE INDEX IF NOT EXISTS idx_courses_lang_target ON courses(lang, target_language);

-- ============================================
-- Message de confirmation
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✓ Migration terminée :';
  RAISE NOTICE '  - Colonne target_language ajoutée aux cours';
  RAISE NOTICE '  - Réduction premium ajoutée aux niveaux (20%% par défaut)';
  RAISE NOTICE '  - Prix premium calculés automatiquement';
END $$;
