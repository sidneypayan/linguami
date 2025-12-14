# Migration des questions de training : JSON → Base de données

## 📋 Contexte

Les questions de training étaient stockées dans des **fichiers JSON** (`data/training/{lang}/{level}/{theme}.json`), ce qui posait problème :
- ❌ Les modifications via l'admin en production ne fonctionnaient pas (fichiers read-only sur Vercel)
- ❌ Nécessitait de commiter les fichiers JSON après chaque modification
- ❌ Votre femme ne pouvait pas corriger les questions directement en prod

**Nouvelle architecture :**
- ✅ Questions stockées dans Supabase (`training_questions` table)
- ✅ Système de statuts : `draft` / `published` / `archived`
- ✅ Modifications en prod fonctionnent immédiatement
- ✅ Validation avant publication (évite les mauvaises surprises pour les users)

## 🚀 Étapes de migration

### 1. Appliquer la migration Supabase

**En local :**
```bash
supabase db push
```

**En production :**
```bash
# Utiliser le fichier .env.production pour les credentials prod
supabase db push --db-url "postgresql://..."
```

OU directement dans le dashboard Supabase (SQL Editor) :
- Copier le contenu de `supabase/migrations/20251214_restore_training_questions_table.sql`
- Exécuter dans le SQL Editor

### 2. Migrer les données JSON vers la DB

**Important :** Lancez ce script UNIQUEMENT en local d'abord pour tester !

```bash
node scripts/migrate-json-to-db.js
```

Ce script va :
1. Lire tous les fichiers JSON dans `data/training/`
2. Trouver les `theme_id` correspondants dans la DB
3. Insérer toutes les questions avec `status='published'`
4. Préserver les IDs originaux (pour la compatibilité avec `training_progress`)

**Vérification :**
- Accéder à `/admin/training` en local
- Vérifier que toutes les questions sont présentes
- Tester une session de training pour vérifier que tout fonctionne

### 3. Migrer la production

**Option A : Via script (recommandé)**
```bash
# Utiliser les credentials de production
NEXT_PUBLIC_SUPABASE_URL=<prod_url> \
SUPABASE_SERVICE_ROLE_KEY=<prod_key> \
node scripts/migrate-json-to-db.js
```

**Option B : Export/Import SQL**
1. Exporter les questions de la DB locale :
   ```sql
   COPY training_questions TO '/tmp/training_questions.csv' WITH CSV HEADER;
   ```
2. Importer dans la DB prod via le dashboard Supabase

### 4. Nettoyer les fichiers JSON (optionnel)

Une fois la migration confirmée en prod, vous pouvez supprimer les fichiers JSON :
```bash
# Garder un backup d'abord !
cp -r data/training data/training_backup
rm -rf data/training
```

## 📝 Nouveau workflow

### Pour votre femme (corrections en prod)

1. Se connecter à `/admin/training` en prod
2. Cliquer sur un thème
3. Modifier une question existante
4. **La question passe automatiquement en "Brouillon"**
5. Vous validez et cliquez sur "Publier"

### Pour vous (nouvelles questions)

1. Générer des questions via Claude Code (ou scripts)
2. Les questions sont créées en `status='draft'` par défaut
3. Les vérifier dans l'admin (`/admin/training`)
4. Cliquer sur "Publier les brouillons" pour tout publier d'un coup

### Interface admin

**Filtres de statut :**
- **Toutes** : Voir toutes les questions
- **Publiées** : Questions visibles par les users
- **Brouillons** : Questions en attente de validation

**Actions sur les questions :**
- 👁️ **Prévisualiser** : Voir la question comme un user
- ✏️ **Modifier** : Éditer la question (→ passe en brouillon)
- ✅ **Publier** : Publier une question brouillon
- 🗑️ **Supprimer** : Soft delete (is_active=false)

**Bouton "Publier les brouillons"** :
- Publie toutes les questions en brouillon d'un coup
- Pratique après avoir généré plusieurs questions

## 🔒 Sécurité

- Seuls les admins peuvent :
  - Voir les questions brouillon
  - Modifier les questions
  - Publier/supprimer les questions

- Les users réguliers voient uniquement :
  - Les questions `status='published'`
  - Les questions `is_active=true`

## 🐛 Rollback (si problème)

Si la migration pose problème, vous pouvez revenir en arrière :

1. **Restaurer le code JSON** :
   ```bash
   git checkout app/actions/training.js
   git checkout components/admin/TrainingAdminClient.jsx
   ```

2. **Supprimer la table** (optionnel) :
   ```sql
   DROP TABLE IF EXISTS training_questions CASCADE;
   ```

3. **Redéployer** le code précédent

## ✅ Checklist de migration

- [ ] Appliquer la migration Supabase en local
- [ ] Migrer les données JSON → DB en local
- [ ] Tester le système de training en local
- [ ] Tester l'interface admin en local
- [ ] Vérifier qu'une modification passe en brouillon
- [ ] Vérifier que la publication fonctionne
- [ ] Appliquer la migration en prod
- [ ] Migrer les données en prod
- [ ] Tester en prod avec votre femme
- [ ] (Optionnel) Supprimer les fichiers JSON

## 📞 Support

En cas de problème, vérifier :
1. Les logs Supabase (dashboard → Database → Logs)
2. Les logs Vercel (si erreur en prod)
3. La console du navigateur (erreurs frontend)

Si les questions ne s'affichent pas :
- Vérifier que `status='published'`
- Vérifier que `is_active=true`
- Vérifier les RLS policies dans Supabase
