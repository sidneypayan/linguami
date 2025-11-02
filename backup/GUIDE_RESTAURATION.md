# Guide de Restauration de la Base de Données Linguami

Ce guide vous explique comment restaurer votre base de données Supabase en cas de problème. Il couvre différents scénarios de restauration.

## Table des matières

1. [Prérequis](#prérequis)
2. [Scénarios de restauration](#scénarios-de-restauration)
3. [Restauration complète depuis SQL](#restauration-complète-depuis-sql)
4. [Restauration d'urgence via Supabase](#restauration-durgence-via-supabase)
5. [Vérification après restauration](#vérification-après-restauration)
6. [Dépannage](#dépannage)

---

## Prérequis

Avant de commencer une restauration, assurez-vous d'avoir :

### Outils nécessaires

- **PostgreSQL Client** (pour pg_restore)
  - Windows : https://www.postgresql.org/download/windows/
  - Mac : `brew install postgresql`
  - Linux : `sudo apt-get install postgresql-client`

- **Node.js** (pour les scripts de restauration JSON)
  - https://nodejs.org/

- **Accès à votre projet Supabase**
  - URL du projet
  - Service Role Key
  - Mot de passe de la base de données

### Fichiers de configuration

Assurez-vous que votre fichier `.env.local` contient :

```bash
# Connexion Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# Connexion PostgreSQL directe (pour pg_restore)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

Pour obtenir votre `DATABASE_URL` :
1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Settings > Database > Connection string > URI
4. Copiez l'URL et remplacez `[YOUR-PASSWORD]` par votre mot de passe

---

## Scénarios de restauration

### Scénario 1 : Perte de données récente
**Situation** : Vous avez supprimé des données par erreur il y a quelques heures/jours.

**Solution** : Utilisez les sauvegardes automatiques Supabase (jusqu'à 7 jours de rétention)

→ Voir [Restauration d'urgence via Supabase](#restauration-durgence-via-supabase)

---

### Scénario 2 : Corruption de la base de données
**Situation** : Votre base de données est corrompue ou a des données incohérentes.

**Solution** : Restauration complète depuis votre dernière sauvegarde SQL

→ Voir [Restauration complète depuis SQL](#restauration-complète-depuis-sql)

---

### Scénario 3 : Migration vers un nouveau projet
**Situation** : Vous voulez migrer vers un nouveau projet Supabase ou dupliquer l'environnement.

**Solution** : Restauration complète depuis SQL

→ Voir [Restauration complète depuis SQL](#restauration-complète-depuis-sql)

---

## Restauration complète depuis SQL

Cette méthode restaure l'intégralité de votre base de données à partir d'une sauvegarde SQL.

### ⚠️ ATTENTION
**Cette opération va ÉCRASER toutes les données actuelles de votre base de données !**

### Étapes de restauration

#### 1. Préparation

```bash
# Décompresser la sauvegarde si nécessaire
gunzip backup/sql/linguami_backup_YYYYMMDD_HHMMSS.sql.gz

# Ou avec 7zip sur Windows
7z x backup/sql/linguami_backup_YYYYMMDD_HHMMSS.sql.gz
```

#### 2. Vérifier le fichier de sauvegarde

```bash
# Afficher les premières lignes
head -n 50 backup/sql/linguami_backup_YYYYMMDD_HHMMSS.sql

# Vérifier la taille
ls -lh backup/sql/linguami_backup_YYYYMMDD_HHMMSS.sql
```

#### 3. Option A : Restauration avec psql (Recommandé)

```bash
# Définir votre DATABASE_URL
export DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Restaurer la base de données
psql "$DATABASE_URL" < backup/sql/linguami_backup_YYYYMMDD_HHMMSS.sql
```

Sur Windows (CMD) :
```cmd
set DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
psql %DATABASE_URL% < backup\sql\linguami_backup_YYYYMMDD_HHMMSS.sql
```

#### 4. Option B : Restauration via l'interface Supabase

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Cliquez sur "SQL Editor"
4. Cliquez sur "New Query"
5. Copiez-collez le contenu de votre fichier SQL
6. Exécutez la requête

**Note** : Cette méthode peut échouer si le fichier est trop volumineux.

#### 5. Vérification

```bash
# Vérifier que les tables ont été restaurées
psql "$DATABASE_URL" -c "\dt"

# Compter les enregistrements dans une table clé
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM user_xp_profile;"
```

---

## Restauration d'urgence via Supabase

Si vous n'avez pas de sauvegarde locale, utilisez les sauvegardes automatiques de Supabase.

### Étapes

1. **Accéder aux sauvegardes**
   - Allez sur https://app.supabase.com
   - Sélectionnez votre projet
   - Settings > Database > Backups

2. **Restaurer une sauvegarde**
   - Sélectionnez la sauvegarde à restaurer
   - Cliquez sur "Restore"
   - **ATTENTION** : Cela créera un NOUVEAU projet avec les données restaurées

3. **Migrer vers le nouveau projet**
   - Mettez à jour votre `.env.local` avec les nouvelles URL et clés
   - Testez votre application
   - Mettez à jour vos domaines personnalisés si nécessaire

### Limitations

- Disponible seulement pour les 7 derniers jours (plan gratuit)
- Crée un nouveau projet au lieu de restaurer sur place
- Nécessite de mettre à jour toutes vos configurations

---

## Vérification après restauration

Après toute restauration, effectuez ces vérifications :

### 1. Vérifier les tables

```sql
-- Lister toutes les tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Compter les enregistrements par table
SELECT
  schemaname,
  tablename,
  (SELECT COUNT(*) FROM pg_catalog.pg_tables WHERE schemaname=t.schemaname AND tablename=t.tablename) as row_count
FROM pg_tables t
WHERE schemaname = 'public'
ORDER BY tablename;
```

### 2. Vérifier les données clés

```sql
-- Nombre d'utilisateurs
SELECT COUNT(*) FROM users_profile;

-- Nombre de profils XP
SELECT COUNT(*) FROM user_xp_profile;

-- Dernières transactions
SELECT * FROM xp_transactions
ORDER BY created_at DESC
LIMIT 10;

-- Vérifier les leaderboards
SELECT COUNT(*) FROM weekly_xp_tracking;
SELECT COUNT(*) FROM monthly_xp_tracking;
```

### 3. Vérifier les politiques RLS

```sql
-- Lister toutes les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 4. Vérifier les fonctions

```sql
-- Lister les fonctions
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Tester une fonction
SELECT get_xp_for_level(10);
```

### 5. Test fonctionnel

- Connectez-vous à votre application
- Vérifiez que les utilisateurs peuvent se connecter
- Testez la fonctionnalité de gain d'XP
- Vérifiez les leaderboards
- Testez la progression des matériaux

---

## Dépannage

### Problème : "permission denied"

**Solution** : Utilisez le Service Role Key au lieu de l'Anon Key

```javascript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Pas NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

---

### Problème : "relation does not exist"

**Cause** : La table n'existe pas ou le schéma n'est pas le bon.

**Solution** :
1. Vérifiez que vous restaurez dans le bon projet
2. Créez d'abord le schéma avec les migrations :
   ```bash
   psql "$DATABASE_URL" < database/migration_xp_system.sql
   ```

---

### Problème : "duplicate key value violates unique constraint"

**Cause** : Tentative d'insertion de données qui existent déjà.

**Solution** : Utilisez `upsert` au lieu de `insert`

```javascript
const { error } = await supabase
  .from(tableName)
  .upsert(data, { onConflict: 'id' }); // Remplace si existe
```

---

### Problème : Restauration très lente

**Causes** : Trop de données, connexion lente, RLS activé.

**Solutions** :
1. Désactivez temporairement RLS (SI SÉCURITAIRE) :
   ```sql
   ALTER TABLE user_xp_profile DISABLE ROW LEVEL SECURITY;
   -- Restaurez vos données
   ALTER TABLE user_xp_profile ENABLE ROW LEVEL SECURITY;
   ```

2. Utilisez des transactions plus grosses :
   ```javascript
   const BATCH_SIZE = 1000; // au lieu de 100
   ```

3. Utilisez pg_restore au lieu de scripts Node.js pour les gros volumes

---

### Problème : "could not connect to server"

**Causes** : URL incorrecte, firewall, projet Supabase en pause.

**Solutions** :
1. Vérifiez votre `DATABASE_URL`
2. Vérifiez que votre projet Supabase est actif
3. Vérifiez votre connexion Internet
4. Réactivez votre projet s'il est en pause :
   - Dashboard Supabase > Settings > General > Resume project

---

## Bonnes pratiques

### 1. Testez vos restaurations

Ne découvrez pas que votre backup ne fonctionne pas quand vous en avez besoin !

```bash
# Testez une restauration dans un projet de test tous les mois
```

### 2. Gardez plusieurs versions

- Conservez au moins 7 sauvegardes quotidiennes
- Conservez des sauvegardes mensuelles pendant 6 mois
- Sauvegardez sur plusieurs supports (local + cloud)

### 3. Automatisez

Configurez le script `backup-auto.sh` pour s'exécuter automatiquement :

**Linux/Mac (Cron)** :
```bash
# Éditer le crontab
crontab -e

# Ajouter une ligne pour exécuter tous les jours à 2h du matin
0 2 * * * /chemin/vers/linguami/backup/backup-auto.sh
```

**Windows (Planificateur de tâches)** :
1. Ouvrez le Planificateur de tâches (`taskschd.msc`)
2. Créez une tâche de base
3. Nom : "Linguami Backup"
4. Déclencheur : Quotidien à 2h du matin
5. Action : Démarrer `D:\linguami\backup\backup-auto.bat`

### 4. Surveillez l'espace disque

Les sauvegardes peuvent prendre beaucoup d'espace. Configurez le nettoyage automatique dans `backup-auto.sh`.

### 5. Documentez vos procédures

Gardez ce guide à jour avec vos procédures spécifiques et vos contacts d'urgence.

---

## Contacts d'urgence

En cas de problème majeur :

1. **Support Supabase** : https://supabase.com/support
2. **Documentation Supabase** : https://supabase.com/docs
3. **Discord Supabase** : https://discord.supabase.com
4. **GitHub Issues** : https://github.com/supabase/supabase/issues

---

## Checklist de restauration

Avant de commencer :
- [ ] J'ai identifié la sauvegarde à restaurer
- [ ] J'ai vérifié que la sauvegarde est valide
- [ ] J'ai un backup de la base actuelle (au cas où)
- [ ] J'ai prévenu les utilisateurs de la maintenance
- [ ] J'ai les accès nécessaires (DATABASE_URL, Service Role Key)

Pendant la restauration :
- [ ] J'ai désactivé l'application pendant la restauration
- [ ] Je surveille les logs d'erreur
- [ ] Je note les problèmes rencontrés

Après la restauration :
- [ ] J'ai vérifié toutes les tables
- [ ] J'ai testé les fonctionnalités critiques
- [ ] J'ai vérifié les compteurs (utilisateurs, XP, etc.)
- [ ] J'ai réactivé l'application
- [ ] J'ai informé les utilisateurs

---

**Date de dernière mise à jour** : 2025-01-15

**Version du guide** : 1.0

**Auteur** : Système de backup Linguami
