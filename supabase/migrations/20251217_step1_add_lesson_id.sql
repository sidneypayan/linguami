-- Migration Step 1: Add lesson_id column to exercises table
-- This allows exercises to be linked to either materials OR standalone lessons

-- Add lesson_id column (nullable, as some exercises are linked to materials)
ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS lesson_id INTEGER;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON exercises(lesson_id);

-- Add comment
COMMENT ON COLUMN exercises.lesson_id IS 'References lessons.id for standalone lesson exercises (mutually exclusive with material_id)';
