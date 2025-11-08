-- Remove unused settings columns from users_profile table
-- Migration to clean up font_size and show_accents_by_default columns

-- Remove font_size column
ALTER TABLE users_profile
DROP COLUMN IF EXISTS font_size;

-- Remove show_accents_by_default column
ALTER TABLE users_profile
DROP COLUMN IF EXISTS show_accents_by_default;

-- Add comment to document the migration
COMMENT ON TABLE users_profile IS 'User profile data - Cleaned up unused columns on 2025-11-11';
