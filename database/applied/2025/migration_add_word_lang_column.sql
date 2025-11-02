-- Migration: Add word_lang column to user_words table
-- Date: 2025-01-XX
-- Description: Add word_lang column to track the language being learned when word was added
-- This eliminates the need for JOIN with materials table and improves query performance

-- Step 1: Add the word_lang column (nullable first for migration)
ALTER TABLE user_words
ADD COLUMN IF NOT EXISTS word_lang VARCHAR(2);

-- Step 2: Populate word_lang from materials.lang for existing records
UPDATE user_words
SET word_lang = materials.lang
FROM materials
WHERE user_words.material_id = materials.id
  AND user_words.word_lang IS NULL;

-- Step 3: For words without material_id (manually added words), infer from which word column is filled
-- If word_ru is filled and word_fr is the translation, then word_lang = 'ru'
-- If word_fr is filled and word_ru is the translation, then word_lang = 'fr'
UPDATE user_words
SET word_lang = CASE
  WHEN word_ru IS NOT NULL AND word_fr IS NOT NULL THEN 'ru'
  WHEN word_fr IS NOT NULL AND word_ru IS NOT NULL THEN 'fr'
  WHEN word_en IS NOT NULL THEN 'en'
  ELSE 'ru' -- default to ru for any edge cases
END
WHERE word_lang IS NULL;

-- Step 4: Make the column NOT NULL now that all rows have values
ALTER TABLE user_words
ALTER COLUMN word_lang SET NOT NULL;

-- Step 5: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_words_user_lang
ON user_words(user_id, word_lang);

-- Step 6: Add comment to document the column
COMMENT ON COLUMN user_words.word_lang IS 'Language being learned when this word was added (ru, fr, en, etc.)';
