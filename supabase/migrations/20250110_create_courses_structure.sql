-- Migration: Création de la structure pour la Méthode Linguami (inspirée Harrap's)
-- Date: 2025-01-10

-- ============================================
-- 1. Table: course_levels (Niveaux de la méthode)
-- ============================================
CREATE TABLE IF NOT EXISTS course_levels (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL, -- 'debutant', 'intermediaire', 'avance'
  name_fr TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_fr TEXT,
  description_ru TEXT,
  description_en TEXT,
  price_eur DECIMAL(10,2) DEFAULT 0.00, -- Prix en euros
  order_index INTEGER NOT NULL, -- Ordre d'affichage (1, 2, 3)
  is_free BOOLEAN DEFAULT false, -- Si le niveau est gratuit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertion des 3 niveaux
INSERT INTO course_levels (slug, name_fr, name_ru, name_en, description_fr, description_ru, description_en, price_eur, order_index, is_free)
VALUES
  ('debutant', 'Niveau Débutant', 'Начальный уровень', 'Beginner Level',
   'Apprenez les bases : se présenter, vie quotidienne, se déplacer. A1-A2 du CECRL.',
   'Изучите основы: представление, повседневная жизнь, передвижение. A1-A2 CEFR.',
   'Learn the basics: introducing yourself, daily life, getting around. A1-A2 CEFR.',
   29.99, 1, true),

  ('intermediaire', 'Niveau Intermédiaire', 'Средний уровень', 'Intermediate Level',
   'Perfectionnez votre maîtrise : conversations, grammaire avancée, culture. B1-B2 du CECRL.',
   'Совершенствуйте владение: разговоры, продвинутая грамматика, культура. B1-B2 CEFR.',
   'Perfect your mastery: conversations, advanced grammar, culture. B1-B2 CEFR.',
   49.99, 2, false),

  ('avance', 'Niveau Avancé', 'Продвинутый уровень', 'Advanced Level',
   'Maîtrisez la langue : nuances, littérature, style professionnel. C1-C2 du CECRL.',
   'Овладейте языком: нюансы, литература, профессиональный стиль. C1-C2 CEFR.',
   'Master the language: nuances, literature, professional style. C1-C2 CEFR.',
   69.99, 3, false);

-- ============================================
-- 2. Table: courses (Cours/Modules thématiques)
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  level_id INTEGER NOT NULL REFERENCES course_levels(id) ON DELETE CASCADE,
  slug TEXT NOT NULL, -- 'premiers-pas', 'vie-quotidienne'
  title_fr TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_fr TEXT,
  description_ru TEXT,
  description_en TEXT,
  lang TEXT NOT NULL, -- 'fr' ou 'ru' (langue enseignée)
  order_index INTEGER NOT NULL, -- Ordre dans le niveau
  estimated_hours INTEGER, -- Durée estimée en heures
  cover_image TEXT, -- URL image de couverture
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(level_id, slug, lang)
);

CREATE INDEX idx_courses_level ON courses(level_id);
CREATE INDEX idx_courses_lang ON courses(lang);
CREATE INDEX idx_courses_published ON courses(is_published);

-- ============================================
-- 3. Table: course_lessons (Leçons individuelles)
-- ============================================
CREATE TABLE IF NOT EXISTS course_lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  title_en TEXT NOT NULL,
  order_index INTEGER NOT NULL, -- Ordre dans le cours
  objectives TEXT[], -- Objectifs de communication (array)
  estimated_minutes INTEGER, -- Durée estimée en minutes
  blocks JSONB NOT NULL DEFAULT '[]', -- Contenu structuré de la leçon
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, slug)
);

CREATE INDEX idx_lessons_course ON course_lessons(course_id);
CREATE INDEX idx_lessons_published ON course_lessons(is_published);

-- ============================================
-- 4. Table: user_course_access (Achats par niveau)
-- ============================================
CREATE TABLE IF NOT EXISTS user_course_access (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level_id INTEGER NOT NULL REFERENCES course_levels(id) ON DELETE CASCADE,
  lang TEXT NOT NULL, -- 'fr' ou 'ru'
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL = accès permanent
  payment_id TEXT, -- ID de transaction Stripe/autre
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, level_id, lang)
);

CREATE INDEX idx_user_access_user ON user_course_access(user_id);
CREATE INDEX idx_user_access_level ON user_course_access(level_id);

-- ============================================
-- 5. Table: user_course_progress (Progression utilisateur)
-- ============================================
CREATE TABLE IF NOT EXISTS user_course_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  last_visited_at TIMESTAMPTZ DEFAULT NOW(),
  time_spent_seconds INTEGER DEFAULT 0, -- Temps passé en secondes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_progress_user ON user_course_progress(user_id);
CREATE INDEX idx_progress_lesson ON user_course_progress(lesson_id);
CREATE INDEX idx_progress_completed ON user_course_progress(is_completed);

-- ============================================
-- 6. RLS (Row Level Security) Policies
-- ============================================

-- course_levels: Lecture publique
ALTER TABLE course_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "course_levels_public_read" ON course_levels FOR SELECT USING (true);

-- courses: Lecture publique
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses_public_read" ON courses FOR SELECT USING (is_published = true);

-- course_lessons: Lecture publique (le paywall sera géré côté app)
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons_public_read" ON course_lessons FOR SELECT USING (is_published = true);

-- user_course_access: Utilisateur voit seulement ses propres achats
ALTER TABLE user_course_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "access_own_records" ON user_course_access FOR ALL USING (auth.uid() = user_id);

-- user_course_progress: Utilisateur voit seulement sa propre progression
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_own_records" ON user_course_progress FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 7. Fonctions helpers
-- ============================================

-- Fonction: Vérifier si un utilisateur a accès à un niveau
CREATE OR REPLACE FUNCTION user_has_level_access(p_user_id UUID, p_level_id INTEGER, p_lang TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Vérifier si le niveau est gratuit
  IF EXISTS (
    SELECT 1 FROM course_levels
    WHERE id = p_level_id AND is_free = true
  ) THEN
    RETURN true;
  END IF;

  -- Vérifier si l'utilisateur a acheté le niveau
  IF EXISTS (
    SELECT 1 FROM user_course_access
    WHERE user_id = p_user_id
      AND level_id = p_level_id
      AND lang = p_lang
      AND (expires_at IS NULL OR expires_at > NOW())
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Marquer une leçon comme complétée
CREATE OR REPLACE FUNCTION complete_course_lesson(p_user_id UUID, p_lesson_id INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO user_course_progress (user_id, lesson_id, is_completed, completed_at)
  VALUES (p_user_id, p_lesson_id, true, NOW())
  ON CONFLICT (user_id, lesson_id)
  DO UPDATE SET
    is_completed = true,
    completed_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. Trigger: Updated_at auto-update
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_course_levels_updated_at BEFORE UPDATE ON course_levels
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON course_lessons
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_course_progress_updated_at BEFORE UPDATE ON user_course_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. Commentaires pour documentation
-- ============================================

COMMENT ON TABLE course_levels IS 'Niveaux de la méthode (débutant, intermédiaire, avancé) avec prix';
COMMENT ON TABLE courses IS 'Cours/Modules thématiques dans chaque niveau';
COMMENT ON TABLE course_lessons IS 'Leçons individuelles avec contenu structuré (blocks)';
COMMENT ON TABLE user_course_access IS 'Achats et accès des utilisateurs par niveau';
COMMENT ON TABLE user_course_progress IS 'Progression des utilisateurs dans les leçons';

COMMENT ON COLUMN course_lessons.blocks IS 'Structure JSON des blocks: dialogue, grammar, culture, exercise, etc.';
COMMENT ON COLUMN course_levels.is_free IS 'Si true, accessible sans achat (ex: niveau débutant)';
