-- ==========================================
-- BACKFILL: Calculer rétroactivement l'XP hebdo/mensuel
-- À partir des transactions XP existantes
-- ==========================================

-- 1. Backfill pour le tracking hebdomadaire
DO $$
DECLARE
  v_week_start DATE;
  v_week_end DATE;
BEGIN
  -- Récupérer les limites de la semaine actuelle
  SELECT week_start, week_end INTO v_week_start, v_week_end FROM get_week_bounds() LIMIT 1;

  -- Pour chaque utilisateur, calculer l'XP gagné cette semaine
  INSERT INTO public.weekly_xp_tracking (user_id, week_start, week_end, weekly_xp)
  SELECT
    user_id,
    v_week_start,
    v_week_end,
    COALESCE(SUM(xp_amount), 0) as weekly_xp
  FROM xp_transactions
  WHERE created_at >= v_week_start
    AND created_at < v_week_end + INTERVAL '1 day'
  GROUP BY user_id
  ON CONFLICT (user_id, week_start)
  DO UPDATE SET
    weekly_xp = EXCLUDED.weekly_xp,
    updated_at = NOW();

  RAISE NOTICE 'Weekly tracking backfilled for week % to %', v_week_start, v_week_end;
END $$;

-- 2. Backfill pour le tracking mensuel
DO $$
DECLARE
  v_month_start DATE;
  v_month_end DATE;
BEGIN
  -- Récupérer les limites du mois actuel
  SELECT month_start, month_end INTO v_month_start, v_month_end FROM get_month_bounds() LIMIT 1;

  -- Pour chaque utilisateur, calculer l'XP gagné ce mois
  INSERT INTO public.monthly_xp_tracking (user_id, month_start, month_end, monthly_xp)
  SELECT
    user_id,
    v_month_start,
    v_month_end,
    COALESCE(SUM(xp_amount), 0) as monthly_xp
  FROM xp_transactions
  WHERE created_at >= v_month_start
    AND created_at < v_month_end + INTERVAL '1 day'
  GROUP BY user_id
  ON CONFLICT (user_id, month_start)
  DO UPDATE SET
    monthly_xp = EXCLUDED.monthly_xp,
    updated_at = NOW();

  RAISE NOTICE 'Monthly tracking backfilled for month % to %', v_month_start, v_month_end;
END $$;

-- 3. Vérification
SELECT
  'Weekly' as period,
  COUNT(*) as user_count,
  SUM(weekly_xp) as total_xp
FROM weekly_xp_tracking
WHERE week_start = (SELECT week_start FROM get_week_bounds() LIMIT 1)

UNION ALL

SELECT
  'Monthly' as period,
  COUNT(*) as user_count,
  SUM(monthly_xp) as total_xp
FROM monthly_xp_tracking
WHERE month_start = (SELECT month_start FROM get_month_bounds() LIMIT 1);

-- 4. Voir le top 10 hebdomadaire
SELECT
  w.weekly_xp,
  u.email,
  w.week_start,
  w.week_end
FROM weekly_xp_tracking w
JOIN auth.users u ON u.id = w.user_id
WHERE w.week_start = (SELECT week_start FROM get_week_bounds() LIMIT 1)
ORDER BY w.weekly_xp DESC
LIMIT 10;
