-- ================================================================================
-- OPTION A : SUPPRIMER les exercices orphelins (si ce sont des tests/anciens exercices)
-- ================================================================================

-- Vérifiez d'abord qu'il n'y a pas de progression utilisateur liée à ces exercices
SELECT e.id, e.title, COUNT(uep.id) as user_progress_count
FROM exercises e
LEFT JOIN user_exercise_progress uep ON e.id = uep.exercise_id
WHERE e.material_id IS NULL AND e.lesson_id IS NULL
GROUP BY e.id, e.title;

-- Si user_progress_count = 0 pour tous, vous pouvez les supprimer :
DELETE FROM exercises
WHERE material_id IS NULL AND lesson_id IS NULL;


-- ================================================================================
-- OPTION B : ASSIGNER à une lesson_id spécifique (si ce sont des exercices de leçon)
-- ================================================================================

-- Remplacez <LESSON_ID> par l'ID de la leçon appropriée
UPDATE exercises
SET lesson_id = <LESSON_ID>
WHERE material_id IS NULL AND lesson_id IS NULL;


-- ================================================================================
-- OPTION C : ASSIGNER à un material_id spécifique (si ce sont des exercices de matériel)
-- ================================================================================

-- Remplacez <MATERIAL_ID> par l'ID du matériel approprié
UPDATE exercises
SET material_id = <MATERIAL_ID>
WHERE material_id IS NULL AND lesson_id IS NULL;


-- ================================================================================
-- APRÈS avoir choisi et exécuté UNE option ci-dessus, ajoutez la contrainte :
-- ================================================================================

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
