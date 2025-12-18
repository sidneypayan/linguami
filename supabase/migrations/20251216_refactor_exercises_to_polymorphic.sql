-- Migration: Refactor exercises table to use polymorphic associations
-- Instead of material_id, lesson_id, etc., use parent_type + parent_id

-- Step 1: Add new polymorphic columns
ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS parent_type TEXT,
ADD COLUMN IF NOT EXISTS parent_id INTEGER;

-- Step 2: Migrate existing data
-- Copy material_id to parent_type='material' and parent_id
UPDATE exercises
SET
  parent_type = 'material',
  parent_id = material_id
WHERE material_id IS NOT NULL;

-- If you have lesson_id data (currently NULL), migrate it too
UPDATE exercises
SET
  parent_type = 'lesson',
  parent_id = lesson_id
WHERE lesson_id IS NOT NULL;

-- Step 3: Add NOT NULL constraints (after data migration)
ALTER TABLE exercises
ALTER COLUMN parent_type SET NOT NULL,
ALTER COLUMN parent_id SET NOT NULL;

-- Step 4: Add check constraint for valid parent types
ALTER TABLE exercises
ADD CONSTRAINT exercises_parent_type_check
CHECK (parent_type IN ('material', 'lesson', 'course_lesson'));

-- Step 5: Create composite index for fast queries
CREATE INDEX IF NOT EXISTS idx_exercises_parent ON exercises(parent_type, parent_id);

-- Step 6: Drop old columns (CAREFUL - this is irreversible!)
-- Uncomment when you're 100% sure the migration worked
-- ALTER TABLE exercises DROP COLUMN IF EXISTS material_id;
-- ALTER TABLE exercises DROP COLUMN IF EXISTS lesson_id;

-- Step 7: Add comments for documentation
COMMENT ON COLUMN exercises.parent_type IS 'Type of parent entity: material, lesson, or course_lesson';
COMMENT ON COLUMN exercises.parent_id IS 'ID of the parent entity';
COMMENT ON INDEX idx_exercises_parent IS 'Composite index for polymorphic parent lookups';
