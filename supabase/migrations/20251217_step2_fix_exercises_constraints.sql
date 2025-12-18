-- Migration Step 2: Fix exercises data and add constraint
-- IMPORTANT: Run AFTER 20251217_step1_add_lesson_id.sql
-- Some exercises may have both material_id and lesson_id, or neither

-- Step 1: Check for problematic rows
DO $$
BEGIN
    RAISE NOTICE 'Exercises with both material_id and lesson_id: %',
        (SELECT COUNT(*) FROM exercises WHERE material_id IS NOT NULL AND lesson_id IS NOT NULL);
    RAISE NOTICE 'Exercises with neither material_id nor lesson_id: %',
        (SELECT COUNT(*) FROM exercises WHERE material_id IS NULL AND lesson_id IS NULL);
END $$;

-- Step 2: Fix exercises with both IDs - keep lesson_id, remove material_id
UPDATE exercises
SET material_id = NULL
WHERE material_id IS NOT NULL AND lesson_id IS NOT NULL;

-- Step 3: For exercises with neither ID, we can't automatically fix them
-- They need to be manually assigned or deleted
-- Let's just log them for now
DO $$
DECLARE
    orphan_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO orphan_count
    FROM exercises
    WHERE material_id IS NULL AND lesson_id IS NULL;

    IF orphan_count > 0 THEN
        RAISE NOTICE 'Found % orphan exercises (no material_id or lesson_id). These need manual review.', orphan_count;
        -- Optionally, you could delete them:
        -- DELETE FROM exercises WHERE material_id IS NULL AND lesson_id IS NULL;
    END IF;
END $$;

-- Step 4: Now add the constraint (from the original migration)
ALTER TABLE exercises
DROP CONSTRAINT IF EXISTS exercises_link_check;

ALTER TABLE exercises
ADD CONSTRAINT exercises_link_check
CHECK (
  (material_id IS NOT NULL AND lesson_id IS NULL) OR
  (material_id IS NULL AND lesson_id IS NOT NULL)
);

COMMENT ON CONSTRAINT exercises_link_check ON exercises IS
'Ensures each exercise is linked to either a material OR a lesson, but not both and not neither';
