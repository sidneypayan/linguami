-- ==========================================
-- LINGUAMI - REMOVE H5P SYSTEM
-- Migration SQL - Remove H5P tables and references
-- Date: 2025-11-08
-- ==========================================

-- Remove H5P activity from xp_rewards_config (if it exists)
DELETE FROM public.xp_rewards_config
WHERE action_type = 'h5p_activity_completed';

-- Drop tables (CASCADE will automatically remove triggers, constraints, and dependent objects)
DROP TABLE IF EXISTS public.user_h5p_progress CASCADE;
DROP TABLE IF EXISTS public.h5p CASCADE;

-- Note: The update_updated_at_column() function is still used by other tables, so we don't drop it
