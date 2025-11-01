-- ==========================================
-- WEEKLY & MONTHLY LEADERBOARD SYSTEM
-- Migration SQL - À exécuter dans Supabase
-- ==========================================

-- ==========================================
-- 1. TABLE: weekly_xp_tracking
-- Suivi de l'XP gagné chaque semaine
-- ==========================================
CREATE TABLE IF NOT EXISTS public.weekly_xp_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  weekly_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Index pour weekly_xp_tracking
CREATE INDEX IF NOT EXISTS idx_weekly_xp_tracking_user_id ON public.weekly_xp_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_xp_tracking_week_start ON public.weekly_xp_tracking(week_start);
CREATE INDEX IF NOT EXISTS idx_weekly_xp_tracking_weekly_xp ON public.weekly_xp_tracking(weekly_xp);

-- RLS pour weekly_xp_tracking
ALTER TABLE public.weekly_xp_tracking ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre aux utilisateurs authentifiés de voir tous les tracking hebdomadaires
-- (nécessaire pour le leaderboard hebdomadaire)
DROP POLICY IF EXISTS "Authenticated users can view all weekly tracking for leaderboard" ON public.weekly_xp_tracking;
CREATE POLICY "Authenticated users can view all weekly tracking for leaderboard"
  ON public.weekly_xp_tracking FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy pour permettre aux utilisateurs d'insérer leur propre tracking
DROP POLICY IF EXISTS "Users can insert their own weekly tracking" ON public.weekly_xp_tracking;
CREATE POLICY "Users can insert their own weekly tracking"
  ON public.weekly_xp_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy pour permettre aux utilisateurs de mettre à jour leur propre tracking
DROP POLICY IF EXISTS "Users can update their own weekly tracking" ON public.weekly_xp_tracking;
CREATE POLICY "Users can update their own weekly tracking"
  ON public.weekly_xp_tracking FOR UPDATE
  USING (auth.uid() = user_id);

-- ==========================================
-- 2. FONCTION: get_week_bounds
-- Retourne le début et la fin de la semaine actuelle (lundi-dimanche)
-- ==========================================
CREATE OR REPLACE FUNCTION get_week_bounds()
RETURNS TABLE(week_start DATE, week_end DATE) AS $$
DECLARE
  current_day_of_week INTEGER;
BEGIN
  -- PostgreSQL: 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
  -- On veut que la semaine commence le lundi
  current_day_of_week := EXTRACT(DOW FROM CURRENT_DATE);

  -- Calculer le lundi de la semaine actuelle
  week_start := CASE
    WHEN current_day_of_week = 0 THEN CURRENT_DATE - INTERVAL '6 days'  -- Dimanche
    ELSE CURRENT_DATE - INTERVAL '1 day' * (current_day_of_week - 1)    -- Autres jours
  END;

  -- Calculer le dimanche de la semaine actuelle
  week_end := week_start + INTERVAL '6 days';

  RETURN QUERY SELECT week_start::DATE, week_end::DATE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ==========================================
-- 3. FONCTION: update_weekly_xp
-- Met à jour le tracking hebdomadaire quand l'utilisateur gagne de l'XP
-- ==========================================
CREATE OR REPLACE FUNCTION update_weekly_xp(
  p_user_id UUID,
  p_xp_amount INTEGER
)
RETURNS void AS $$
DECLARE
  v_week_start DATE;
  v_week_end DATE;
BEGIN
  -- Récupérer les limites de la semaine actuelle
  SELECT * INTO v_week_start, v_week_end FROM get_week_bounds();

  -- Insérer ou mettre à jour le tracking hebdomadaire
  INSERT INTO public.weekly_xp_tracking (user_id, week_start, week_end, weekly_xp)
  VALUES (p_user_id, v_week_start, v_week_end, p_xp_amount)
  ON CONFLICT (user_id, week_start)
  DO UPDATE SET
    weekly_xp = public.weekly_xp_tracking.weekly_xp + p_xp_amount,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 4. TRIGGER pour mettre à jour updated_at
-- ==========================================
DROP TRIGGER IF EXISTS update_weekly_xp_tracking_updated_at ON public.weekly_xp_tracking;
CREATE TRIGGER update_weekly_xp_tracking_updated_at
  BEFORE UPDATE ON public.weekly_xp_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 5. MODIFIER LA FONCTION add_xp (si elle existe)
-- Pour qu'elle appelle aussi update_weekly_xp
-- ==========================================
-- Note: Cette partie doit être adaptée selon votre fonction add_xp existante
-- Exemple de modification à apporter dans votre fonction add_xp:
--
-- AFTER the line that updates user_xp_profile, add:
-- PERFORM update_weekly_xp(p_user_id, p_xp_amount);

-- ==========================================
-- COMMENTAIRES
-- ==========================================
COMMENT ON TABLE public.weekly_xp_tracking IS 'Suivi de l''XP gagné par semaine pour le leaderboard hebdomadaire';
COMMENT ON COLUMN public.weekly_xp_tracking.week_start IS 'Lundi de la semaine (début de semaine)';
COMMENT ON COLUMN public.weekly_xp_tracking.week_end IS 'Dimanche de la semaine (fin de semaine)';
COMMENT ON COLUMN public.weekly_xp_tracking.weekly_xp IS 'XP total gagné durant cette semaine';

-- ==========================================
-- 6. TABLE: monthly_xp_tracking
-- Suivi de l'XP gagné chaque mois
-- ==========================================
CREATE TABLE IF NOT EXISTS public.monthly_xp_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_start DATE NOT NULL,
  month_end DATE NOT NULL,
  monthly_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month_start)
);

-- Index pour monthly_xp_tracking
CREATE INDEX IF NOT EXISTS idx_monthly_xp_tracking_user_id ON public.monthly_xp_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_xp_tracking_month_start ON public.monthly_xp_tracking(month_start);
CREATE INDEX IF NOT EXISTS idx_monthly_xp_tracking_monthly_xp ON public.monthly_xp_tracking(monthly_xp);

-- RLS pour monthly_xp_tracking
ALTER TABLE public.monthly_xp_tracking ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre aux utilisateurs authentifiés de voir tous les tracking mensuels
DROP POLICY IF EXISTS "Authenticated users can view all monthly tracking for leaderboard" ON public.monthly_xp_tracking;
CREATE POLICY "Authenticated users can view all monthly tracking for leaderboard"
  ON public.monthly_xp_tracking FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy pour permettre aux utilisateurs d'insérer leur propre tracking
DROP POLICY IF EXISTS "Users can insert their own monthly tracking" ON public.monthly_xp_tracking;
CREATE POLICY "Users can insert their own monthly tracking"
  ON public.monthly_xp_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy pour permettre aux utilisateurs de mettre à jour leur propre tracking
DROP POLICY IF EXISTS "Users can update their own monthly tracking" ON public.monthly_xp_tracking;
CREATE POLICY "Users can update their own monthly tracking"
  ON public.monthly_xp_tracking FOR UPDATE
  USING (auth.uid() = user_id);

-- ==========================================
-- 7. FONCTION: get_month_bounds
-- Retourne le début et la fin du mois actuel
-- ==========================================
CREATE OR REPLACE FUNCTION get_month_bounds()
RETURNS TABLE(month_start DATE, month_end DATE) AS $$
BEGIN
  month_start := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  month_end := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE;

  RETURN QUERY SELECT month_start, month_end;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ==========================================
-- 8. FONCTION: update_monthly_xp
-- Met à jour le tracking mensuel quand l'utilisateur gagne de l'XP
-- ==========================================
CREATE OR REPLACE FUNCTION update_monthly_xp(
  p_user_id UUID,
  p_xp_amount INTEGER
)
RETURNS void AS $$
DECLARE
  v_month_start DATE;
  v_month_end DATE;
BEGIN
  -- Récupérer les limites du mois actuel
  SELECT * INTO v_month_start, v_month_end FROM get_month_bounds();

  -- Insérer ou mettre à jour le tracking mensuel
  INSERT INTO public.monthly_xp_tracking (user_id, month_start, month_end, monthly_xp)
  VALUES (p_user_id, v_month_start, v_month_end, p_xp_amount)
  ON CONFLICT (user_id, month_start)
  DO UPDATE SET
    monthly_xp = public.monthly_xp_tracking.monthly_xp + p_xp_amount,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 9. TRIGGER pour mettre à jour updated_at (monthly)
-- ==========================================
DROP TRIGGER IF EXISTS update_monthly_xp_tracking_updated_at ON public.monthly_xp_tracking;
CREATE TRIGGER update_monthly_xp_tracking_updated_at
  BEFORE UPDATE ON public.monthly_xp_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- COMMENTAIRES ADDITIONNELS
-- ==========================================
COMMENT ON TABLE public.monthly_xp_tracking IS 'Suivi de l''XP gagné par mois pour le leaderboard mensuel';
COMMENT ON COLUMN public.monthly_xp_tracking.month_start IS 'Premier jour du mois';
COMMENT ON COLUMN public.monthly_xp_tracking.month_end IS 'Dernier jour du mois';
COMMENT ON COLUMN public.monthly_xp_tracking.monthly_xp IS 'XP total gagné durant ce mois';

-- ==========================================
-- VÉRIFICATION
-- ==========================================
-- Pour vérifier que tout fonctionne :
-- 1. Vérifier les limites de la semaine actuelle :
--    SELECT * FROM get_week_bounds();
--
-- 2. Vérifier les limites du mois actuel :
--    SELECT * FROM get_month_bounds();
--
-- 3. Voir tous les trackings hebdomadaires :
--    SELECT * FROM weekly_xp_tracking ORDER BY week_start DESC, weekly_xp DESC;
--
-- 4. Voir tous les trackings mensuels :
--    SELECT * FROM monthly_xp_tracking ORDER BY month_start DESC, monthly_xp DESC;
