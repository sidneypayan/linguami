-- ==========================================
-- FIX: Ajouter SECURITY DEFINER aux fonctions de tracking
-- Les fonctions doivent bypasser RLS pour pouvoir insérer/mettre à jour
-- ==========================================

-- Recréer update_weekly_xp avec SECURITY DEFINER
CREATE OR REPLACE FUNCTION update_weekly_xp(
  p_user_id UUID,
  p_xp_amount INTEGER
)
RETURNS void
SECURITY DEFINER
SET search_path = public
AS $$
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

-- Recréer update_monthly_xp avec SECURITY DEFINER
CREATE OR REPLACE FUNCTION update_monthly_xp(
  p_user_id UUID,
  p_xp_amount INTEGER
)
RETURNS void
SECURITY DEFINER
SET search_path = public
AS $$
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
-- COMMENTAIRES
-- ==========================================
COMMENT ON FUNCTION update_weekly_xp IS 'Met à jour le tracking hebdomadaire (SECURITY DEFINER pour bypasser RLS)';
COMMENT ON FUNCTION update_monthly_xp IS 'Met à jour le tracking mensuel (SECURITY DEFINER pour bypasser RLS)';

-- ==========================================
-- VÉRIFICATION
-- ==========================================
-- Pour tester, exécutez dans Supabase SQL Editor:
-- SELECT update_monthly_xp(auth.uid(), 10);
-- SELECT * FROM monthly_xp_tracking WHERE user_id = auth.uid();
