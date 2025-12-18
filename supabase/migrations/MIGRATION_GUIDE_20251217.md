# Guide de migration - 17 Décembre 2025

## Problème
La migration `20251216_add_lesson_id_to_exercises.sql` échoue car elle essaie d'ajouter une contrainte sur des données existantes qui ne la respectent pas.

## Solution
Exécuter les migrations en 2 étapes :

### Étape 1 : Ajouter la colonne `lesson_id`
Fichier : `20251217_step1_add_lesson_id.sql`

Cette migration ajoute simplement la colonne sans contrainte.

### Étape 2 : Corriger les données et ajouter la contrainte
Fichier : `20251217_step2_fix_exercises_constraints.sql`

Cette migration :
1. Identifie les exercices problématiques
2. Corrige automatiquement ceux qui ont les deux IDs (garde lesson_id, supprime material_id)
3. Signale les exercices orphelins (à corriger manuellement si nécessaire)
4. Ajoute la contrainte `exercises_link_check`

## Comment exécuter

### Option 1 : Via Supabase Dashboard
1. Allez dans **SQL Editor**
2. Copiez le contenu de `20251217_step1_add_lesson_id.sql` et exécutez-le
3. Attendez la confirmation
4. Copiez le contenu de `20251217_step2_fix_exercises_constraints.sql` et exécutez-le
5. Vérifiez les NOTICES pour voir combien d'exercices ont été corrigés

### Option 2 : Via Supabase CLI
```bash
# Si vous utilisez Supabase local
supabase migration up
```

## Après les migrations

Une fois ces migrations exécutées, vous pouvez également exécuter :
- `20251216_add_public_read_exercises.sql` - Pour permettre la lecture publique des exercices
- `20251216_refactor_exercises_to_polymorphic.sql` - Pour la refactorisation polymorphique (si applicable)

## Vérification

Pour vérifier que tout fonctionne :
```sql
-- Vérifier que la colonne existe
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'exercises' AND column_name = 'lesson_id';

-- Vérifier qu'il n'y a plus d'exercices problématiques
SELECT COUNT(*) as both_ids
FROM exercises
WHERE material_id IS NOT NULL AND lesson_id IS NOT NULL;

SELECT COUNT(*) as no_ids
FROM exercises
WHERE material_id IS NULL AND lesson_id IS NULL;
```

Les deux requêtes devraient retourner 0.
