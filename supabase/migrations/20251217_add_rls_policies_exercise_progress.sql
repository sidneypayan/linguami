-- Migration: Add RLS policies for user_exercise_progress table
-- Allows users to read and write their own exercise progress

-- Enable RLS on the table if not already enabled
ALTER TABLE user_exercise_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own exercise progress" ON user_exercise_progress;
DROP POLICY IF EXISTS "Users can insert own exercise progress" ON user_exercise_progress;
DROP POLICY IF EXISTS "Users can update own exercise progress" ON user_exercise_progress;

-- Policy 1: Allow users to SELECT their own progress
CREATE POLICY "Users can view own exercise progress"
ON user_exercise_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Allow users to INSERT their own progress
CREATE POLICY "Users can insert own exercise progress"
ON user_exercise_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Allow users to UPDATE their own progress
CREATE POLICY "Users can update own exercise progress"
ON user_exercise_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON POLICY "Users can view own exercise progress" ON user_exercise_progress IS
'Allows authenticated users to view their own exercise progress';

COMMENT ON POLICY "Users can insert own exercise progress" ON user_exercise_progress IS
'Allows authenticated users to insert their own exercise progress';

COMMENT ON POLICY "Users can update own exercise progress" ON user_exercise_progress IS
'Allows authenticated users to update their own exercise progress';
