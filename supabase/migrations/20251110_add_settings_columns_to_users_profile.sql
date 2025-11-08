-- Add settings columns to users_profile table
-- Migration for enhanced settings page

-- Add columns for goals and motivation
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS daily_xp_goal INTEGER DEFAULT 100;

-- Add columns for notifications
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS email_reminders BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS streak_reminders BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS new_content_notifications BOOLEAN DEFAULT true;

-- Add columns for privacy and security
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS show_in_leaderboard BOOLEAN DEFAULT true;

-- Add columns for appearance
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS font_size VARCHAR(20) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS show_accents_by_default BOOLEAN DEFAULT false;

-- Add comment to document the columns
COMMENT ON COLUMN users_profile.daily_xp_goal IS 'Daily XP goal set by the user (50-500)';
COMMENT ON COLUMN users_profile.email_reminders IS 'User wants daily email reminders';
COMMENT ON COLUMN users_profile.streak_reminders IS 'User wants streak reminder notifications';
COMMENT ON COLUMN users_profile.new_content_notifications IS 'User wants new content notifications';
COMMENT ON COLUMN users_profile.show_in_leaderboard IS 'User profile is visible in public leaderboard';
COMMENT ON COLUMN users_profile.font_size IS 'Preferred font size: small, medium, or large';
COMMENT ON COLUMN users_profile.show_accents_by_default IS 'Show Russian text accents by default';
