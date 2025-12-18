-- Identifier les exercices orphelins
SELECT id, title, type, level, material_id, lesson_id, created_at
FROM exercises
WHERE material_id IS NULL AND lesson_id IS NULL
ORDER BY created_at DESC;
