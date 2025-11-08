-- ==========================================
-- LINGUAMI - MERGE AUDIO_CLOZE INTO FILL_IN_BLANK
-- Migration SQL - Update exercise types
-- Date: 2025-11-08
-- ==========================================

-- Update all audio_cloze exercises to fill_in_blank type
-- The audio will now be provided by the material itself
UPDATE exercises
SET type = 'fill_in_blank'
WHERE type = 'audio_cloze';

-- No need to modify the data structure as both types use the same format
-- (questions array with blanks)

-- ==========================================
-- COMMENT
-- ==========================================
COMMENT ON TABLE exercises IS 'Audio cloze exercises merged into fill_in_blank type. Audio now comes from material.';
