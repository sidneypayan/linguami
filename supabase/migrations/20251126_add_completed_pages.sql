-- Add completed_pages column to track which pages have been completed in paginated materials
ALTER TABLE user_materials ADD COLUMN IF NOT EXISTS completed_pages integer[] DEFAULT '{}';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_materials_completed_pages ON user_materials USING GIN (completed_pages);
