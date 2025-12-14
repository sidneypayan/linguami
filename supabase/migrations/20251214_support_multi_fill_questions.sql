-- Support multi_fill question type
-- Add sentences column and make correct_answer nullable

ALTER TABLE training_questions
ADD COLUMN IF NOT EXISTS sentences JSONB;

ALTER TABLE training_questions
ALTER COLUMN correct_answer DROP NOT NULL;

-- Add comment explaining the multi_fill format
COMMENT ON COLUMN training_questions.sentences IS 'For multi_fill questions: array of {text: string, correct: number} objects';
COMMENT ON COLUMN training_questions.correct_answer IS 'For MCQ/fill-in: index of correct answer. For multi_fill: not used (see sentences column)';
