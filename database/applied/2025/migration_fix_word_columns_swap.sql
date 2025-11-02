-- Migration: Fix word columns for French learning materials
-- Date: 2025-01-XX
-- Description: Swap word_ru and word_fr for words where word_lang='fr'
-- The old system always put source word in word_ru regardless of actual language
-- Now we need to put French words in word_fr and Russian translations in word_ru

-- Swap word_ru and word_fr for French learning words
UPDATE user_words
SET
  word_ru = word_fr,
  word_fr = word_ru
WHERE word_lang = 'fr'
  AND word_ru IS NOT NULL
  AND word_fr IS NOT NULL;

-- Note: This ensures that when word_lang='fr':
-- - word_fr contains the French word being learned
-- - word_ru contains the Russian translation
