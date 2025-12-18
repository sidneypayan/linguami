-- Migration: Add public read access to exercises table
-- Allows unauthenticated users to read exercises (needed for lesson pages using prod DB)

-- Enable RLS on exercises table if not already enabled
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public read access for exercises" ON exercises;

-- Create policy to allow public read access
CREATE POLICY "Public read access for exercises"
ON exercises
FOR SELECT
TO public
USING (true);

-- Note: This allows anyone to read exercises, which is safe because:
-- 1. Exercises are public content (not user-specific)
-- 2. Write/update/delete operations still require authentication
-- 3. User progress is stored in separate tables with proper RLS

COMMENT ON POLICY "Public read access for exercises" ON exercises IS
'Allows public read access to exercises. Required for lesson pages that use production DB without user authentication.';
