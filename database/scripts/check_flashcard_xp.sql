-- ==========================================
-- DIAGNOSTIC: Vérifier le système XP des flashcards
-- ==========================================

-- 1. Vérifier la configuration XP pour les flashcards
SELECT
  action_type,
  xp_amount,
  is_active,
  description
FROM public.xp_rewards_config
WHERE action_type LIKE 'flashcard%'
ORDER BY action_type;

-- 2. Vérifier les transactions XP récentes pour les flashcards
SELECT
  created_at,
  xp_amount,
  source_type,
  description
FROM public.xp_transactions
WHERE source_type LIKE 'flashcard%'
  AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 20;

-- 3. Vérifier le profil XP de l'utilisateur connecté
SELECT
  total_xp,
  current_level,
  xp_in_current_level,
  daily_streak,
  last_activity_date
FROM public.user_xp_profile
WHERE user_id = auth.uid();

-- 4. Compter les transactions par type (derniers 7 jours)
SELECT
  source_type,
  COUNT(*) as nb_transactions,
  SUM(xp_amount) as total_xp
FROM public.xp_transactions
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY source_type
ORDER BY nb_transactions DESC;
