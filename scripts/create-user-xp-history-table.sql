-- Create user_xp_history table for tracking XP gains
-- This table records all XP and gold gains for auditing and statistics

CREATE TABLE IF NOT EXISTS public.user_xp_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- Type of action (e.g., 'exercise_mcq', 'word_review', 'daily_login')
  xp_earned INTEGER NOT NULL DEFAULT 0,
  gold_earned INTEGER NOT NULL DEFAULT 0,
  source_id TEXT, -- Optional: ID of the source (exercise_id, word_id, etc.)
  description TEXT, -- Optional description
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_user_xp_history_user_id ON public.user_xp_history(user_id);

-- Index for faster queries by action type
CREATE INDEX IF NOT EXISTS idx_user_xp_history_action_type ON public.user_xp_history(action_type);

-- Index for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_user_xp_history_created_at ON public.user_xp_history(created_at);

-- Enable Row Level Security
ALTER TABLE public.user_xp_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own XP history
CREATE POLICY "Users can view their own XP history"
  ON public.user_xp_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role can insert XP history (via server actions)
CREATE POLICY "Service role can insert XP history"
  ON public.user_xp_history
  FOR INSERT
  WITH CHECK (true);

COMMENT ON TABLE public.user_xp_history IS 'Tracks all XP and gold gains for users';
COMMENT ON COLUMN public.user_xp_history.action_type IS 'Type of action that earned XP (matches xp_rewards_config.action_type)';
COMMENT ON COLUMN public.user_xp_history.source_id IS 'Optional ID of the source (exercise ID, word ID, etc.)';
