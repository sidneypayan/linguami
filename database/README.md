# Database Migrations - Linguami

Documentation et historique de toutes les migrations de base de données du projet Linguami.

## 📂 Structure du dossier

```
database/
├── README.md                          # Ce fichier
├── applied/                           # Migrations déjà appliquées (archive)
│   ├── 2022-2024/                    # Migrations initiales
│   │   ├── migration_xp_system.sql
│   │   ├── migration_gold_system.sql
│   │   ├── migration_weekly_leaderboard.sql
│   │   ├── migration_fix_leaderboard_rls.sql
│   │   ├── migration_fix_tracking_functions.sql
│   │   ├── migration_user_profile_enhancements.sql
│   │   ├── migration_add_date_of_birth_and_unique_username.sql
│   │   ├── migration_update_avatar_constraint.sql
│   │   └── migration_fix_duplicate_usernames.sql
│   └── 2025/                         # Migrations récentes
│       └── migration_add_created_at_to_users_profile.sql
├── scripts/                           # Scripts utilitaires
│   ├── run_migration.sh
│   └── backfill_weekly_monthly_tracking.sql
└── docs/                             # Documentation
    └── GUIDE_MIGRATION_CREATED_AT.md
```

---

## 📊 Historique des migrations

### Phase 1 : Système XP et Gamification (2022-2024)

#### 1.1 - Système XP de base
**Fichier :** `applied/2022-2024/migration_xp_system.sql` (16 KB)

**Ce qui a été créé :**
- Table `user_xp_profile` - Profils XP et niveaux des utilisateurs
- Table `xp_rewards_config` - Configuration des récompenses XP
- Table `xp_transactions` - Historique complet des transactions XP
- Table `user_h5p_progress` - Suivi de la progression sur activités H5P
- Table `user_goals` - Objectifs quotidiens/hebdomadaires/mensuels
- Table `user_achievements` - Système de badges et achievements

**Fonctions créées :**
- `get_xp_for_level(level)` - Calcule l'XP requis pour un niveau
- `calculate_level_from_xp(total_xp)` - Calcule le niveau depuis l'XP total
- `update_user_goals_progress()` - Met à jour la progression des objectifs

**Triggers :**
- Triggers automatiques pour `updated_at` sur toutes les tables

**RLS Policies :**
- Utilisateurs peuvent voir/modifier uniquement leurs propres données
- Accès en lecture pour les leaderboards

**Tables concernées :**
- `user_xp_profile`
- `xp_rewards_config`
- `xp_transactions`
- `user_h5p_progress`
- `user_goals`
- `user_achievements`

---

#### 1.2 - Système de Gold
**Fichier :** `applied/2022-2024/migration_gold_system.sql` (3 KB)

**Ce qui a été ajouté :**
- Colonne `total_gold` dans `user_xp_profile`
- Colonne `gold_amount` dans `xp_rewards_config`
- Colonne `gold_earned` dans `xp_transactions`

**Philosophie :**
- Gold 50-100x plus rare que l'XP
- Récompense les achievements significatifs
- Pas pour les actions répétitives

**Tables modifiées :**
- `user_xp_profile`
- `xp_rewards_config`
- `xp_transactions`

---

#### 1.3 - Leaderboard hebdomadaire
**Fichier :** `applied/2022-2024/migration_weekly_leaderboard.sql` (11 KB)

**Ce qui a été créé :**
- Table `weekly_xp_tracking` - Suivi XP hebdomadaire (lundi-dimanche)
- Table `monthly_xp_tracking` - Suivi XP mensuel

**Fonctions créées :**
- `update_weekly_xp()` - Met à jour automatiquement le tracking hebdo
- `update_monthly_xp()` - Met à jour automatiquement le tracking mensuel
- `get_week_bounds()` - Retourne les limites de la semaine actuelle
- `get_month_bounds()` - Retourne les limites du mois actuel

**Triggers :**
- Mise à jour automatique lors des transactions XP

**Index :**
- Index sur `week_start`, `month_start` pour performance
- Index sur `weekly_xp`, `monthly_xp` pour tri leaderboard

**Tables concernées :**
- `weekly_xp_tracking`
- `monthly_xp_tracking`

---

#### 1.4 - Correctif RLS Leaderboard
**Fichier :** `applied/2022-2024/migration_fix_leaderboard_rls.sql` (2.6 KB)

**Problème résolu :**
Les utilisateurs ne pouvaient pas voir les autres profils dans le leaderboard

**Solution :**
- Politique RLS mise à jour pour permettre la lecture publique des profils
- Maintien de la restriction d'écriture (uniquement son propre profil)

**Tables modifiées :**
- `user_xp_profile`

---

#### 1.5 - Correctif fonctions de tracking
**Fichier :** `applied/2022-2024/migration_fix_tracking_functions.sql` (2.4 KB)

**Problème résolu :**
Les fonctions `update_weekly_xp()` et `update_monthly_xp()` ne pouvaient pas écrire à cause des RLS

**Solution :**
- Ajout de `SECURITY DEFINER` aux fonctions
- Permet aux fonctions de bypasser les RLS lors de l'exécution

**Fonctions modifiées :**
- `update_weekly_xp()`
- `update_monthly_xp()`

---

### Phase 2 : Améliorations Profil Utilisateur (2024)

#### 2.1 - Améliorations profil
**Fichier :** `applied/2022-2024/migration_user_profile_enhancements.sql` (2.3 KB)

**Ce qui a été ajouté :**
- `spoken_language` - Langue maternelle (english/french/russian)
- `language_level` - Niveau d'apprentissage (beginner/intermediate/advanced)
- `avatar_id` - Choix d'avatar (avatar1-avatar10)

**Contraintes :**
- Validation des valeurs possibles pour chaque champ
- Valeurs par défaut définies

**Tables modifiées :**
- `users_profile`

---

#### 2.2 - Date de naissance et username unique
**Fichier :** `applied/2022-2024/migration_add_date_of_birth_and_unique_username.sql` (705 B)

**Ce qui a été ajouté :**
- `date_of_birth` - Date de naissance
- Contrainte `UNIQUE` sur `name` (username)

**Tables modifiées :**
- `users_profile`

---

#### 2.3 - Mise à jour contrainte avatar
**Fichier :** `applied/2022-2024/migration_update_avatar_constraint.sql` (651 B)

**Ce qui a été modifié :**
- Extension des avatars disponibles (avatar1 à avatar10)

**Tables modifiées :**
- `users_profile`

---

#### 2.4 - Correction doublons usernames
**Fichier :** `applied/2022-2024/migration_fix_duplicate_usernames.sql` (1.2 KB)

**Problème résolu :**
Plusieurs utilisateurs avaient le même username

**Solution :**
- Script de nettoyage pour rendre les usernames uniques
- Ajout de suffixes numériques si nécessaire

**Tables modifiées :**
- `users_profile`

---

### Phase 3 : Horodatage et Traçabilité (2025)

#### 3.1 - Ajout created_at et updated_at
**Fichier :** `applied/2025/migration_add_created_at_to_users_profile.sql` (6.7 KB)
**Date :** 2025-11-01

**Ce qui a été ajouté :**
- Colonne `created_at` dans `users_profile`
- Colonne `updated_at` dans `users_profile`
- Synchronisation avec `auth.users` pour les dates existantes

**Fonctions créées :**
- `update_users_profile_updated_at()` - Met à jour `updated_at` automatiquement
- `sync_user_profile_timestamps()` - Synchronise avec `auth.users` lors de l'insertion

**Triggers créés :**
- `users_profile_updated_at_trigger` - Trigger BEFORE UPDATE
- `sync_user_profile_timestamps_trigger` - Trigger BEFORE INSERT

**Index créés :**
- Index sur `created_at` pour tri chronologique
- Index sur `updated_at` pour requêtes temporelles

**Tables modifiées :**
- `users_profile`

**Documentation :**
- Guide complet : `docs/GUIDE_MIGRATION_CREATED_AT.md`

---

## 🔧 Scripts utilitaires

### run_migration.sh
**Localisation :** `scripts/run_migration.sh`

**Utilisation :**
```bash
chmod +x database/scripts/run_migration.sh
./database/scripts/run_migration.sh
```

**Fonctionnalités :**
- Exécute une migration SQL via psql
- Vérifie les prérequis (DATABASE_URL, psql)
- Demande confirmation avant exécution
- Affiche un résumé après exécution
- Propose l'exécution manuelle via Supabase si psql indisponible

---

### backfill_weekly_monthly_tracking.sql
**Localisation :** `scripts/backfill_weekly_monthly_tracking.sql`

**Utilisation :**
Exécuter via Supabase SQL Editor ou psql

**Fonctionnalités :**
- Calcule rétroactivement les données de `weekly_xp_tracking`
- Calcule rétroactivement les données de `monthly_xp_tracking`
- Basé sur l'historique de `xp_transactions`
- Utile pour populer les leaderboards historiques

**Quand l'utiliser :**
- Après l'installation du système de leaderboard
- Pour reconstruire les données historiques
- Après une corruption de données

---

## 📖 Documentation

### GUIDE_MIGRATION_CREATED_AT.md
**Localisation :** `docs/GUIDE_MIGRATION_CREATED_AT.md`

Guide détaillé pour la migration `created_at` incluant :
- Instructions pas à pas
- Méthode via Dashboard Supabase
- Méthode via psql
- Vérifications post-migration
- Tests des triggers
- Rollback si nécessaire
- Exemples de requêtes SQL

---

## 🚀 Comment appliquer une nouvelle migration

### Méthode 1 : Via Dashboard Supabase (Recommandé)

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet Linguami
3. Ouvrez **SQL Editor**
4. Créez une **New Query**
5. Copiez-collez le contenu du fichier de migration
6. Cliquez sur **Run** (ou Ctrl+Enter)

### Méthode 2 : Via psql (Ligne de commande)

```bash
# Avec le script utilitaire
./database/scripts/run_migration.sh

# Ou directement avec psql
psql "$DATABASE_URL" -f database/applied/2025/migration_xxx.sql
```

**Note :** Nécessite que `DATABASE_URL` soit défini dans `.env.local`

---

## 🔄 Backups et sauvegardes

Avant toute migration importante, **faites une sauvegarde** !

### Sauvegarde complète

```bash
cd backup
./backup-auto.sh
```

Cela créera :
- Sauvegarde SQL complète (structure + données)
- Export JSON des données
- Logs détaillés

### Restauration

Consultez `backup/GUIDE_RESTAURATION.md` pour les procédures de restauration.

---

## 📋 Checklist avant migration

Avant d'appliquer une migration :

- [ ] **Sauvegarde créée** (`backup/backup-auto.sh`)
- [ ] **Migration testée** sur un projet de dev/staging si possible
- [ ] **Documentation lue** (guides associés)
- [ ] **Dépendances vérifiées** (autres migrations requises ?)
- [ ] **Timing approprié** (pas pendant pic d'utilisation)

Pendant la migration :

- [ ] **Application désactivée** (si migration critique)
- [ ] **Logs surveillés** (erreurs ?)
- [ ] **Timeout configuré** (si grosse migration)

Après la migration :

- [ ] **Vérifications exécutées** (requêtes de test)
- [ ] **Triggers testés** (si applicable)
- [ ] **Application retestée**
- [ ] **Utilisateurs informés** (si changements visibles)
- [ ] **Migration archivée** (déplacée dans `applied/`)

---

## 🗂️ Structure de la base de données actuelle

### Tables principales

**Utilisateurs :**
- `users_profile` - Profils utilisateurs étendus

**Système XP :**
- `user_xp_profile` - Profils XP, niveaux, streaks
- `xp_rewards_config` - Configuration des récompenses
- `xp_transactions` - Historique complet des gains XP/Gold

**Progression :**
- `user_h5p_progress` - Progression activités H5P
- `user_goals` - Objectifs utilisateurs
- `user_achievements` - Badges et achievements

**Leaderboards :**
- `weekly_xp_tracking` - Classement hebdomadaire
- `monthly_xp_tracking` - Classement mensuel

**Contenu (non couvert par ces migrations) :**
- `materials` - Matériaux pédagogiques
- `sections` - Sections de cours
- `lessons` - Leçons
- `h5p` - Activités interactives H5P
- `posts` - Articles de blog

---

## 🔍 Dépannage

### Migration échoue

1. **Vérifier les logs**
   ```bash
   tail -f backup/logs/backup_*.log
   ```

2. **Vérifier DATABASE_URL**
   ```bash
   echo $DATABASE_URL
   ```

3. **Tester la connexion**
   ```bash
   psql "$DATABASE_URL" -c "SELECT version();"
   ```

### RLS bloque l'accès

Si vous ne pouvez pas accéder aux données après une migration :

1. Vérifiez les politiques RLS dans Supabase Dashboard
2. Assurez-vous d'utiliser le `SUPABASE_SERVICE_ROLE_KEY` pour les opérations admin
3. Vérifiez que les fonctions utilisent `SECURITY DEFINER` si besoin

### Triggers ne fonctionnent pas

1. Vérifiez que les triggers existent :
   ```sql
   SELECT * FROM information_schema.triggers
   WHERE event_object_table = 'nom_table';
   ```

2. Vérifiez les fonctions :
   ```sql
   SELECT routine_name FROM information_schema.routines
   WHERE routine_schema = 'public';
   ```

---

## 📚 Ressources

- **Backup complet :** `backup/README.md`
- **Restauration :** `backup/GUIDE_RESTAURATION.md`
- **Documentation Supabase :** https://supabase.com/docs
- **PostgreSQL Docs :** https://www.postgresql.org/docs/

---

## 📝 Conventions de nommage

Pour les futures migrations, suivez ces conventions :

**Format du nom de fichier :**
```
migration_[description]_[date].sql
```

**Exemples :**
- `migration_add_notifications_system_20250215.sql`
- `migration_fix_performance_indexes_20250301.sql`

**Structure du fichier :**
```sql
-- Migration: [Titre court]
-- Description: [Description détaillée]
-- Date: YYYY-MM-DD
-- Auteur: [Nom]

-- =====================================================
-- ÉTAPE 1 : [Description]
-- =====================================================

[SQL code]

-- =====================================================
-- VÉRIFICATION
-- =====================================================

[SQL de vérification avec RAISE NOTICE]
```

---

**Dernière mise à jour :** 2025-11-01
**Maintenu par :** Linguami Team
**Version :** 1.0
