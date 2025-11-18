-- Migration: Remove section column from books table
-- Date: 2025-11-18
-- Reason: The 'section' column in books table is redundant. Books are already
--         identified by being in the books table. The 'section' field should
--         only exist in materials table to categorize content types
--         (dialogues, culture, book-chapters, etc.)

-- Remove the section column from books table
ALTER TABLE books DROP COLUMN IF EXISTS section;

-- Note: This will not affect materials.section which remains useful for categorizing
-- different types of content (dialogues, culture, podcasts, book-chapters, etc.)
