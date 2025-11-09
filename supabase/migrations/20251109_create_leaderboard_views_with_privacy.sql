-- Create or replace leaderboard views with show_in_leaderboard filter
-- This ensures users who disabled the "show in leaderboard" option are not visible

-- Drop existing views if they exist
DROP VIEW IF EXISTS public.leaderboard_view CASCADE;
DROP VIEW IF EXISTS public.public_users_profile CASCADE;

-- Create public_users_profile view
-- This view shows only users who opted in to appear in the leaderboard
CREATE OR REPLACE VIEW public.public_users_profile AS
SELECT
    up.id,
    up.name,
    up.avatar_id,
    up.learning_language
FROM users_profile up
WHERE up.show_in_leaderboard = true;

-- Create leaderboard_view for XP, Streak, and Gold rankings
-- This view combines users_profile and user_xp_profile, filtering by show_in_leaderboard
-- Only shows users with at least some progression (total_xp > 0)
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT
    up.id,
    up.name,
    up.avatar_id,
    up.learning_language,
    xp.total_xp,
    xp.current_level,
    xp.daily_streak,
    xp.total_gold
FROM users_profile up
INNER JOIN user_xp_profile xp ON xp.user_id = up.id
WHERE up.show_in_leaderboard = true
  AND xp.total_xp > 0;

-- Create weekly_leaderboard_view for weekly XP rankings with privacy filter
-- Only shows users with weekly_xp > 0 (active this week)
CREATE OR REPLACE VIEW public.weekly_leaderboard_view AS
SELECT
    wxt.user_id,
    wxt.weekly_xp,
    wxt.week_start,
    wxt.week_end,
    up.name,
    up.avatar_id
FROM weekly_xp_tracking wxt
INNER JOIN users_profile up ON up.id = wxt.user_id
WHERE up.show_in_leaderboard = true
  AND wxt.weekly_xp > 0;

-- Create monthly_leaderboard_view for monthly XP rankings with privacy filter
-- Only shows users with monthly_xp > 0 (active this month)
CREATE OR REPLACE VIEW public.monthly_leaderboard_view AS
SELECT
    mxt.user_id,
    mxt.monthly_xp,
    mxt.month_start,
    mxt.month_end,
    up.name,
    up.avatar_id
FROM monthly_xp_tracking mxt
INNER JOIN users_profile up ON up.id = mxt.user_id
WHERE up.show_in_leaderboard = true
  AND mxt.monthly_xp > 0;

-- Grant SELECT permissions to authenticated users
GRANT SELECT ON public.leaderboard_view TO authenticated;
GRANT SELECT ON public.public_users_profile TO authenticated;
GRANT SELECT ON public.weekly_leaderboard_view TO authenticated;
GRANT SELECT ON public.monthly_leaderboard_view TO authenticated;

-- Add comments to document the views
COMMENT ON VIEW public.leaderboard_view IS 'Public leaderboard data filtered by show_in_leaderboard setting';
COMMENT ON VIEW public.public_users_profile IS 'Public user profiles for users who opted in to leaderboard visibility';
COMMENT ON VIEW public.weekly_leaderboard_view IS 'Weekly XP rankings filtered by show_in_leaderboard setting';
COMMENT ON VIEW public.monthly_leaderboard_view IS 'Monthly XP rankings filtered by show_in_leaderboard setting';
