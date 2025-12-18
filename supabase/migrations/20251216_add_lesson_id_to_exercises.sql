-- Migration: Add lesson_id column to exercises table
-- This allows exercises to be linked to either materials OR standalone lessons

-- Add lesson_id column (nullable, as some exercises are linked to materials)
ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS lesson_id INTEGER;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON exercises(lesson_id);

-- Add check constraint to ensure exercise is linked to either material_id OR lesson_id (not both, not neither)
ALTER TABLE exercises
ADD CONSTRAINT exercises_link_check
CHECK (
  (material_id IS NOT NULL AND lesson_id IS NULL) OR
  (material_id IS NULL AND lesson_id IS NOT NULL)
);

-- Add comment
COMMENT ON COLUMN exercises.lesson_id IS 'References lessons.id for standalone lesson exercises (mutually exclusive with material_id)';
