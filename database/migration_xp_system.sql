-- ==========================================
-- LINGUAMI - XP & GAMIFICATION SYSTEM
-- Migration SQL - À exécuter dans Supabase
-- ==========================================

-- ==========================================
-- 1. TABLE: user_h5p_progress
-- Suivi de la progression des activités H5P
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_h5p_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  h5p_id UUID NOT NULL REFERENCES public.h5p(id) ON DELETE CASCADE,
  material_id INTEGER REFERENCES public.materials(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  max_score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, h5p_id)
);

-- Index pour user_h5p_progress
CREATE INDEX IF NOT EXISTS idx_user_h5p_progress_user_id ON public.user_h5p_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_h5p_progress_completed ON public.user_h5p_progress(completed);
CREATE INDEX IF NOT EXISTS idx_user_h5p_progress_completed_at ON public.user_h5p_progress(completed_at);
CREATE INDEX IF NOT EXISTS idx_user_h5p_progress_material_id ON public.user_h5p_progress(material_id);

-- RLS pour user_h5p_progress
ALTER TABLE public.user_h5p_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own h5p progress" ON public.user_h5p_progress;
CREATE POLICY "Users can view their own h5p progress"
  ON public.user_h5p_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own h5p progress" ON public.user_h5p_progress;
CREATE POLICY "Users can insert their own h5p progress"
  ON public.user_h5p_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own h5p progress" ON public.user_h5p_progress;
CREATE POLICY "Users can update their own h5p progress"
  ON public.user_h5p_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ==========================================
-- 2. TABLE: xp_rewards_config
-- Configuration des récompenses XP
-- ==========================================
CREATE TABLE IF NOT EXISTS public.xp_rewards_config (
  id SERIAL PRIMARY KEY,
  action_type VARCHAR(50) UNIQUE NOT NULL,
  xp_amount INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pas de RLS - table de configuration accessible à tous en lecture
ALTER TABLE public.xp_rewards_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view xp rewards config" ON public.xp_rewards_config;
CREATE POLICY "Anyone can view xp rewards config"
  ON public.xp_rewards_config FOR SELECT
  USING (true);

-- Insertion des valeurs par défaut
INSERT INTO public.xp_rewards_config (action_type, xp_amount, description) VALUES
  -- Flashcards / Révision
  ('flashcard_again', 2, 'XP pour avoir révisé une carte (Again)'),
  ('flashcard_hard', 5, 'XP pour une carte difficile (Hard)'),
  ('flashcard_good', 10, 'XP pour une bonne réponse (Good)'),
  ('flashcard_easy', 15, 'XP pour une réponse facile (Easy)'),
  ('card_graduated', 25, 'Bonus quand une carte passe en mode REVIEW'),
  ('perfect_session', 100, 'Bonus : toutes les cartes réussies en Good/Easy'),
  ('session_20_cards', 30, 'Bonus pour avoir complété 20 cartes'),
  ('session_50_cards', 80, 'Bonus pour avoir complété 50 cartes'),

  -- Matériaux
  ('material_started', 10, 'XP gagné pour avoir commencé un nouveau matériel'),
  ('material_completed', 50, 'XP gagné pour avoir terminé un matériel'),
  ('book_chapter_read', 25, 'Lire un chapitre de livre'),
  ('book_completed', 150, 'Terminer tous les chapitres d''un livre'),

  -- Activités H5P
  ('h5p_activity_completed', 20, 'XP gagné pour chaque activité H5P complétée'),

  -- Vocabulaire
  ('word_added', 3, 'Ajouter un nouveau mot au dictionnaire'),
  ('mastered_100_words', 200, 'Avoir 100 mots en mode REVIEW'),
  ('mastered_500_words', 500, 'Avoir 500 mots en mode REVIEW'),

  -- Engagement quotidien
  ('daily_login', 10, 'XP gagné pour la première connexion du jour'),
  ('daily_goal_achieved', 50, 'Atteindre l''objectif quotidien'),
  ('weekly_goal_achieved', 150, 'Atteindre l''objectif hebdomadaire'),
  ('monthly_goal_achieved', 500, 'Atteindre l''objectif mensuel'),

  -- Streaks
  ('streak_3_days', 30, 'Série de 3 jours consécutifs'),
  ('streak_7_days', 50, 'Série de 7 jours consécutifs'),
  ('streak_30_days', 200, 'Série de 30 jours consécutifs'),

  -- Progression
  ('level_up', 150, 'Passer au niveau supérieur'),
  ('first_material_per_section', 40, 'Premier matériau complété dans une section'),
  ('all_sections_tried', 200, 'Avoir essayé au moins un matériau de chaque section')
ON CONFLICT (action_type) DO NOTHING;

-- ==========================================
-- 3. TABLE: user_xp_profile
-- Profil XP de l'utilisateur
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_xp_profile (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  xp_in_current_level INTEGER DEFAULT 0,
  daily_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour user_xp_profile
CREATE INDEX IF NOT EXISTS idx_user_xp_profile_total_xp ON public.user_xp_profile(total_xp);
CREATE INDEX IF NOT EXISTS idx_user_xp_profile_level ON public.user_xp_profile(current_level);
CREATE INDEX IF NOT EXISTS idx_user_xp_profile_streak ON public.user_xp_profile(daily_streak);

-- RLS pour user_xp_profile
ALTER TABLE public.user_xp_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own xp profile" ON public.user_xp_profile;
CREATE POLICY "Users can view their own xp profile"
  ON public.user_xp_profile FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own xp profile" ON public.user_xp_profile;
CREATE POLICY "Users can insert their own xp profile"
  ON public.user_xp_profile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own xp profile" ON public.user_xp_profile;
CREATE POLICY "Users can update their own xp profile"
  ON public.user_xp_profile FOR UPDATE
  USING (auth.uid() = user_id);

-- ==========================================
-- 4. TABLE: xp_transactions
-- Historique des gains d'XP
-- ==========================================
CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  xp_amount INTEGER NOT NULL,
  source_type VARCHAR(50) NOT NULL,
  source_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour xp_transactions
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON public.xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created_at ON public.xp_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_source_type ON public.xp_transactions(source_type);

-- RLS pour xp_transactions
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own xp transactions" ON public.xp_transactions;
CREATE POLICY "Users can view their own xp transactions"
  ON public.xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own xp transactions" ON public.xp_transactions;
CREATE POLICY "Users can insert their own xp transactions"
  ON public.xp_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 5. TABLE: user_goals
-- Objectifs personnalisables
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type VARCHAR(20) NOT NULL,
  target_xp INTEGER NOT NULL,
  current_xp INTEGER DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (goal_type IN ('daily', 'weekly', 'monthly'))
);

-- Index pour user_goals
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_goal_type ON public.user_goals(goal_type);
CREATE INDEX IF NOT EXISTS idx_user_goals_period_end ON public.user_goals(period_end);
CREATE INDEX IF NOT EXISTS idx_user_goals_is_completed ON public.user_goals(is_completed);

-- RLS pour user_goals
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own goals" ON public.user_goals;
CREATE POLICY "Users can view their own goals"
  ON public.user_goals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own goals" ON public.user_goals;
CREATE POLICY "Users can insert their own goals"
  ON public.user_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own goals" ON public.user_goals;
CREATE POLICY "Users can update their own goals"
  ON public.user_goals FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own goals" ON public.user_goals;
CREATE POLICY "Users can delete their own goals"
  ON public.user_goals FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- 6. TABLE: user_achievements
-- Réalisations/Badges débloqués
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_type)
);

-- Index pour user_achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON public.user_achievements(unlocked_at);

-- RLS pour user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;
CREATE POLICY "Users can insert their own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- FONCTIONS UTILITAIRES
-- ==========================================

-- Fonction pour calculer l'XP nécessaire pour un niveau donné
-- Formule : 100 * level^1.5
CREATE OR REPLACE FUNCTION get_xp_for_level(level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR(100 * POWER(level, 1.5));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction pour calculer le niveau basé sur l'XP total
CREATE OR REPLACE FUNCTION calculate_level_from_xp(total_xp INTEGER)
RETURNS TABLE(level INTEGER, xp_in_level INTEGER, xp_for_next_level INTEGER) AS $$
DECLARE
  current_level INTEGER := 1;
  xp_required INTEGER;
  xp_accumulated INTEGER := 0;
BEGIN
  LOOP
    xp_required := get_xp_for_level(current_level);

    IF xp_accumulated + xp_required > total_xp THEN
      EXIT;
    END IF;

    xp_accumulated := xp_accumulated + xp_required;
    current_level := current_level + 1;
  END LOOP;

  RETURN QUERY SELECT
    current_level,
    total_xp - xp_accumulated,
    get_xp_for_level(current_level);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_xp_profile_updated_at ON public.user_xp_profile;
CREATE TRIGGER update_user_xp_profile_updated_at
  BEFORE UPDATE ON public.user_xp_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_goals_updated_at ON public.user_goals;
CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_h5p_progress_updated_at ON public.user_h5p_progress;
CREATE TRIGGER update_user_h5p_progress_updated_at
  BEFORE UPDATE ON public.user_h5p_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- FONCTION: update_user_goals_progress
-- Met à jour la progression des objectifs quand XP est gagné
-- ==========================================
CREATE OR REPLACE FUNCTION update_user_goals_progress(
  p_user_id UUID,
  p_xp_amount INTEGER
)
RETURNS void AS $$
DECLARE
  goal_record RECORD;
BEGIN
  -- Mettre à jour tous les objectifs actifs de l'utilisateur
  FOR goal_record IN
    SELECT id, current_xp, target_xp
    FROM public.user_goals
    WHERE user_id = p_user_id
      AND is_completed = FALSE
      AND period_end >= CURRENT_DATE
  LOOP
    -- Ajouter l'XP à l'objectif
    UPDATE public.user_goals
    SET
      current_xp = LEAST(goal_record.current_xp + p_xp_amount, goal_record.target_xp),
      is_completed = (goal_record.current_xp + p_xp_amount >= goal_record.target_xp),
      updated_at = NOW()
    WHERE id = goal_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- FIN DE LA MIGRATION
-- ==========================================

COMMENT ON TABLE public.user_h5p_progress IS 'Suivi de la progression des activités H5P par utilisateur';
COMMENT ON TABLE public.xp_rewards_config IS 'Configuration des récompenses XP pour différentes actions';
COMMENT ON TABLE public.user_xp_profile IS 'Profil XP et niveau de chaque utilisateur';
COMMENT ON TABLE public.xp_transactions IS 'Historique de tous les gains XP';
COMMENT ON TABLE public.user_goals IS 'Objectifs quotidiens/hebdomadaires/mensuels des utilisateurs';
COMMENT ON TABLE public.user_achievements IS 'Badges et réalisations débloqués par les utilisateurs';
