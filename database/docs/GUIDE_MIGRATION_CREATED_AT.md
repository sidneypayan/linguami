# Guide: Ajout de created_at à users_profile

Ce guide vous explique comment ajouter la colonne `created_at` à votre table `users_profile` et la synchroniser avec les données de `auth.users`.

## 📋 Ce que fait cette migration

1. ✅ Ajoute la colonne `created_at` à `users_profile`
2. ✅ Remplit `created_at` avec les dates de `auth.users`
3. ✅ Ajoute la colonne `updated_at` (bonus)
4. ✅ Crée des triggers automatiques pour maintenir les dates à jour
5. ✅ Ajoute des index pour améliorer les performances
6. ✅ Synchronise automatiquement les futurs utilisateurs

## 🚀 Méthode recommandée : Via le Dashboard Supabase

Cette méthode est la plus simple et la plus fiable.

### Étapes

1. **Ouvrir le SQL Editor**
   - Allez sur https://app.supabase.com
   - Sélectionnez votre projet **Linguami**
   - Cliquez sur **SQL Editor** dans le menu de gauche

2. **Créer une nouvelle requête**
   - Cliquez sur **New Query** (ou le bouton `+`)

3. **Copier le script de migration**
   - Ouvrez le fichier : `database/migration_add_created_at_to_users_profile.sql`
   - Copiez **tout le contenu** (Ctrl+A puis Ctrl+C)

4. **Coller et exécuter**
   - Collez le script dans l'éditeur SQL (Ctrl+V)
   - Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

5. **Vérifier les résultats**
   - Vous devriez voir des messages de succès
   - Le résumé affichera le nombre d'utilisateurs mis à jour

### Résultat attendu

```
NOTICE:  ========================================
NOTICE:  Migration terminée avec succès !
NOTICE:  ========================================
NOTICE:  Total utilisateurs: 13
NOTICE:  Avec created_at: 13
NOTICE:  Sans created_at: 0
NOTICE:  ========================================
NOTICE:  Exemples (3 premiers utilisateurs):
NOTICE:  - Anna | created: 2025-10-27 10:46:47+00 | updated: ...
NOTICE:  - John | created: 2025-10-28 14:22:15+00 | updated: ...
NOTICE:  ...
```

## 🔧 Méthode alternative : Via psql (Ligne de commande)

Si vous préférez utiliser la ligne de commande et que votre `DATABASE_URL` fonctionne :

```bash
# Rendre le script exécutable
chmod +x database/run_migration.sh

# Exécuter la migration
./database/run_migration.sh
```

## ✅ Vérification post-migration

### Vérifier que created_at a été ajouté

Exécutez cette requête dans le SQL Editor :

```sql
SELECT
    name,
    email,
    created_at,
    updated_at
FROM users_profile
ORDER BY created_at
LIMIT 10;
```

### Vérifier la synchronisation avec auth.users

```sql
SELECT
    up.name,
    up.created_at as profile_created,
    au.created_at as auth_created,
    up.created_at = au.created_at as synchronized
FROM users_profile up
JOIN auth.users au ON up.id = au.id
LIMIT 10;
```

La colonne `synchronized` devrait afficher `true` pour tous les utilisateurs.

### Vérifier les triggers

```sql
-- Vérifier que les triggers existent
SELECT
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users_profile'
ORDER BY trigger_name;
```

Vous devriez voir :
- `sync_user_profile_timestamps_trigger` (BEFORE INSERT)
- `users_profile_updated_at_trigger` (BEFORE UPDATE)

## 🧪 Tester les triggers

### Test 1 : updated_at se met à jour automatiquement

```sql
-- Modifier un utilisateur
UPDATE users_profile
SET name = 'Test Update'
WHERE email = 'votre-email@example.com';

-- Vérifier que updated_at a changé
SELECT name, created_at, updated_at
FROM users_profile
WHERE email = 'votre-email@example.com';
```

Le `updated_at` devrait être plus récent que `created_at`.

### Test 2 : Nouveaux utilisateurs synchronisés automatiquement

Ce test se fera automatiquement lors de la création de nouveaux utilisateurs.
Le trigger copiera automatiquement le `created_at` de `auth.users`.

## 🔄 Rollback (Annulation)

Si vous voulez annuler cette migration :

```sql
-- Supprimer les triggers
DROP TRIGGER IF EXISTS sync_user_profile_timestamps_trigger ON users_profile;
DROP TRIGGER IF EXISTS users_profile_updated_at_trigger ON users_profile;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS sync_user_profile_timestamps();
DROP FUNCTION IF EXISTS update_users_profile_updated_at();

-- Supprimer les index
DROP INDEX IF EXISTS idx_users_profile_created_at;
DROP INDEX IF EXISTS idx_users_profile_updated_at;

-- Supprimer les colonnes
ALTER TABLE users_profile DROP COLUMN IF EXISTS created_at;
ALTER TABLE users_profile DROP COLUMN IF EXISTS updated_at;
```

## 📊 Impact sur vos backups

Après cette migration, vos exports JSON incluront automatiquement `created_at` et `updated_at`.

Pour mettre à jour le script de backup :

Éditez `backup/backup-json.js` et modifiez :

```javascript
const TABLES_TO_BACKUP = [
  // Tables utilisateurs
  { name: 'users_profile', orderBy: 'created_at' }, // Au lieu de 'id'
  // ... reste du code
];
```

Maintenant les exports seront triés par date de création !

## 🎯 Bénéfices

Après cette migration, vous pourrez :

1. **Trier les utilisateurs par date d'inscription**
   ```sql
   SELECT * FROM users_profile ORDER BY created_at DESC;
   ```

2. **Filtrer les nouveaux utilisateurs**
   ```sql
   SELECT * FROM users_profile
   WHERE created_at >= NOW() - INTERVAL '7 days';
   ```

3. **Voir qui a été modifié récemment**
   ```sql
   SELECT * FROM users_profile
   WHERE updated_at >= NOW() - INTERVAL '1 day';
   ```

4. **Statistiques d'inscription**
   ```sql
   SELECT
       DATE(created_at) as date,
       COUNT(*) as new_users
   FROM users_profile
   GROUP BY DATE(created_at)
   ORDER BY date DESC;
   ```

## 🆘 Problèmes courants

### Erreur : "permission denied for table auth.users"

**Solution** : Utilisez le Service Role Key dans votre configuration.

### Erreur : "column created_at already exists"

**Solution** : La colonne existe déjà, pas de problème. Le script utilise `IF NOT EXISTS`.

### Certains utilisateurs n'ont pas de created_at

**Solution** : Vérifiez qu'ils existent dans `auth.users` :

```sql
SELECT
    up.id,
    up.name,
    up.created_at,
    au.created_at as auth_created_at
FROM users_profile up
LEFT JOIN auth.users au ON up.id = au.id
WHERE up.created_at IS NULL;
```

## 📝 Notes importantes

- ⚠️ Cette migration modifie la structure de la base de données
- ✅ Elle est réversible (voir section Rollback)
- ✅ Elle n'affecte pas les données existantes (seulement ajoute des colonnes)
- ✅ Les triggers sont automatiques et ne nécessitent pas de maintenance

## 🎓 Ressources

- [Documentation Supabase - Database](https://supabase.com/docs/guides/database)
- [PostgreSQL - Triggers](https://www.postgresql.org/docs/current/trigger-definition.html)
- [PostgreSQL - Timestamp Types](https://www.postgresql.org/docs/current/datatype-datetime.html)

---

**Date de création** : 2025-11-01
**Version** : 1.0
**Auteur** : Linguami Team
