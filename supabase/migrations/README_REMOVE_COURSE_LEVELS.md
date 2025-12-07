# Migration: Supprimer la table `course_levels`

## Contexte

La table `course_levels` a été supprimée car ses données sont maintenant hardcodées dans `lib/method-levels.js` pour de meilleures performances. Cette table contenait seulement 3 lignes qui ne changent jamais :

- Beginner (Débutant)
- Intermediate (Intermédiaire)
- Advanced (Avancé)

## Fichiers modifiés

✅ Tous les usages de la table ont été remplacés par des fonctions statiques :

- `app/[locale]/method/page.js`
- `app/[locale]/method/[level]/page.js`
- `lib/method.js`
- `app/actions/courses.js`

## Application de la migration

### Option 1: Via Supabase CLI (recommandé)

```bash
# Développement
supabase db push

# Production
supabase link --project-ref <votre-project-ref>
supabase db push
```

### Option 2: SQL direct dans Supabase Dashboard

1. Allez sur https://supabase.com/dashboard/project/<votre-projet>/sql/new
2. Copiez le contenu de `20250107_remove_course_levels_table.sql`
3. Exécutez le script
4. Répétez pour la DB de production

### Option 3: psql (si vous avez les credentials)

```bash
# Dev
psql -h <host> -U postgres -d postgres -f supabase/migrations/20250107_remove_course_levels_table.sql

# Prod
psql -h <host> -U postgres -d postgres -f supabase/migrations/20250107_remove_course_levels_table.sql
```

## Vérification

Après la migration, vérifiez que :

1. ✅ La table `course_levels` n'existe plus
2. ✅ Les pages `/method` et `/method/beginner` fonctionnent
3. ✅ Aucune erreur dans la console

```sql
-- Vérifier que la table n'existe plus
SELECT * FROM information_schema.tables
WHERE table_name = 'course_levels';
-- Devrait retourner 0 ligne
```

## Rollback (si nécessaire)

Si vous devez revenir en arrière, vous devrez :

1. Recréer la table `course_levels` avec la migration d'origine
2. Réinsérer les 3 niveaux
3. Restaurer les foreign keys
4. Reverter les changements de code

**Note :** Ce n'est pas recommandé car le code a été optimisé pour ne plus utiliser cette table.

## Impact

- ✅ **Performance** : 1 requête DB en moins sur `/method`
- ✅ **Simplicité** : Données statiques au lieu de fetch DB
- ✅ **Maintenabilité** : Un seul endroit pour modifier les niveaux
