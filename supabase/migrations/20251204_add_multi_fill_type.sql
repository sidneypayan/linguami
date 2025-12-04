-- Migration: Add multi_fill type support to training_questions
-- Date: 2025-12-04
-- Description: Adds support for multi_fill question type with multiple sentences

-- Add sentences column for multi_fill type
-- sentences is a JSONB array of objects: [{ text: "...", correct: 0 }, ...]
ALTER TABLE training_questions
ADD COLUMN IF NOT EXISTS sentences JSONB;

-- Update comment
COMMENT ON COLUMN training_questions.sentences IS 'For multi_fill type: array of sentences with blanks. Each: {text: "sentence with ___", correct: index}';

-- Update table comment
COMMENT ON TABLE training_questions IS 'Training questions with MCQ, dropdown, or multi_fill format';
