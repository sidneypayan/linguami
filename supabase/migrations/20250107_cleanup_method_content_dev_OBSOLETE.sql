-- Migration to clean up method content from DEV database
-- Keeps user data (user_course_progress, user_course_access)
-- Only deletes course/lesson content since it now comes from PROD DB

-- Delete all lessons first (child table)
DELETE FROM course_lessons;

-- Delete all courses (parent table)
DELETE FROM courses;

-- Optional: Reset sequences if you want IDs to start from 1 again
-- (Not necessary since we'll use PROD DB for content)
-- ALTER SEQUENCE course_lessons_id_seq RESTART WITH 1;
-- ALTER SEQUENCE courses_id_seq RESTART WITH 1;
