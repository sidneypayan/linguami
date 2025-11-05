# 🔄 Migration des valeurs de niveau vers l'anglais

**Date :** 05/11/2025
**Objectif :** Normaliser les valeurs de niveau dans la base de données et le code (de français vers anglais)

---

## 📊 Résumé des changements

### Anciennes valeurs (français) ❌
- `'débutant'`
- `'intermédiaire'`
- `'avancé'`

### Nouvelles valeurs (anglais) ✅
- `'beginner'`
- `'intermediate'`
- `'advanced'`

---

## 🎯 Pourquoi cette migration ?

### Avantages de l'anglais :
- ✅ **Standard international** - Meilleure pratique dans l'industrie
- ✅ **Pas de problèmes d'encodage** - Évite les soucis avec les accents
- ✅ **Cohérence** - Même format que `language_level` dans `users_profile`
- ✅ **Maintenabilité** - Code plus clair et uniforme
- ✅ **Évite les bugs** - Moins de conversions/mappings nécessaires

### Les traductions UI restent intactes 🌍
- **FR :** Débutant, Intermédiaire, Avancé
- **EN :** Beginner, Intermediate, Advanced
- **RU :** Начальный/Начинающий, Средний, Продвинутый

---

## 📂 Fichiers modifiés

### 1. Base de données (SQL)
✅ **`database/applied/2025/migration_normalize_level_values_to_english.sql`**
- Met à jour toutes les valeurs dans `materials` et `books`
- Met à jour les contraintes CHECK
- Vérifie les résultats

### 2. Code JavaScript/JSX (10 fichiers)

#### Fichiers Core
1. ✅ **`utils/constants.js`** - Array des niveaux
2. ✅ **`features/materials/materialsSlice.js`** - Tri par niveau
3. ✅ **`features/content/contentSlice.js`** - Commentaire

#### Composants UI
4. ✅ **`components/MaterialsFilterBar.jsx`** - Filtres de niveau
5. ✅ **`components/layouts/LevelBar.jsx`** - Barre de filtres
6. ✅ **`components/MaterialsTable.jsx`** - Affichage tableau
7. ✅ **`components/SectionCard.jsx`** - Cartes de section
8. ✅ **`components/admin/EditMaterialModal.jsx`** - Formulaire admin

#### Pages
9. ✅ **`pages/materials/[section]/index.js`** - Filtre par défaut

### 3. Traductions (NON MODIFIÉES)
- ✅ `locales/fr/*.json` - Restent en français
- ✅ `locales/en/*.json` - Restent en anglais
- ✅ `locales/ru/*.json` - Restent en russe

---

## 🚀 Étapes d'application

### Étape 1 : Appliquer la migration SQL ⚠️

**IMPORTANT :** Cette étape doit être faite en PREMIER !

```bash
# Option A : Via l'interface Supabase SQL Editor
# 1. Ouvre https://app.supabase.com/project/YOUR_PROJECT/sql/new
# 2. Copie-colle le contenu de database/applied/2025/migration_normalize_level_values_to_english.sql
# 3. Exécute la requête

# Option B : Via psql (si tu as accès direct)
psql -h YOUR_HOST -U postgres -d postgres -f database/applied/2025/migration_normalize_level_values_to_english.sql
```

**Vérification après migration :**
```sql
-- Vérifier que toutes les valeurs ont été mises à jour
SELECT level, COUNT(*) FROM materials GROUP BY level;
SELECT level, COUNT(*) FROM books GROUP BY level;

-- Tu devrais voir uniquement : beginner, intermediate, advanced
```

### Étape 2 : Déployer le nouveau code 🚀

```bash
# 1. Commit les changements
git add .
git commit -m "Normalize level values to English (beginner/intermediate/advanced)"

# 2. Push vers ton repository
git push origin main

# 3. Déployer sur Vercel (si pas en auto-deploy)
# Vercel va automatiquement déployer si configuré
```

### Étape 3 : Vérifier que tout fonctionne ✅

**Tests à effectuer :**

1. **Page des matériaux** (`/materials/videos`)
   - ✅ Les filtres de niveau s'affichent correctement
   - ✅ Les cartes montrent le bon niveau
   - ✅ Le filtre par défaut (niveau utilisateur) fonctionne

2. **Panel admin** (`/admin`)
   - ✅ Le dropdown de niveau fonctionne
   - ✅ Modification d'un matériau enregistre correctement

3. **Multilingue**
   - ✅ Interface FR : Affiche "Débutant", "Intermédiaire", "Avancé"
   - ✅ Interface EN : Affiche "Beginner", "Intermediate", "Advanced"
   - ✅ Interface RU : Affiche "Начальный", "Средний", "Продвинутый"

---

## 🔍 Détails techniques

### Changements dans le code

#### Avant ❌
```javascript
const levels = [
    { label: 'Débutant', key: 'débutant', ... },
    { label: 'Intermédiaire', key: 'intermédiaire', ... },
    { label: 'Avancé', key: 'avancé', ... },
]

const levelOrder = { 'débutant': 1, 'intermédiaire': 2, 'avancé': 3 }

if (level === 'débutant') return '#10b981'
```

#### Après ✅
```javascript
const levels = [
    { label: t('beginner'), key: 'beginner', ... },
    { label: t('intermediate'), key: 'intermediate', ... },
    { label: t('advanced'), key: 'advanced', ... },
]

const levelOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }

if (level === 'beginner') return '#10b981'
```

### Changements dans la DB

#### Contraintes CHECK mises à jour
```sql
-- Avant
CHECK (level IN ('débutant', 'intermédiaire', 'avancé'))

-- Après
CHECK (level IN ('beginner', 'intermediate', 'advanced'))
```

#### Données mises à jour
```sql
UPDATE materials SET level = CASE
    WHEN level = 'débutant' THEN 'beginner'
    WHEN level = 'intermédiaire' THEN 'intermediate'
    WHEN level = 'avancé' THEN 'advanced'
    ELSE level
END;
```

---

## ⚠️ Rollback en cas de problème

Si tu rencontres des problèmes, tu peux revenir en arrière :

### Rollback SQL
```sql
-- Revenir aux valeurs françaises
UPDATE public.materials
SET level = CASE
    WHEN level = 'beginner' THEN 'débutant'
    WHEN level = 'intermediate' THEN 'intermédiaire'
    WHEN level = 'advanced' THEN 'avancé'
    ELSE level
END;

UPDATE public.books
SET level = CASE
    WHEN level = 'beginner' THEN 'débutant'
    WHEN level = 'intermediate' THEN 'intermédiaire'
    WHEN level = 'advanced' THEN 'avancé'
    ELSE level
END;

-- Restaurer les anciennes contraintes
ALTER TABLE public.materials DROP CONSTRAINT IF EXISTS materials_level_check;
ALTER TABLE public.materials ADD CONSTRAINT materials_level_check
CHECK (level IN ('débutant', 'intermédiaire', 'avancé'));

ALTER TABLE public.books DROP CONSTRAINT IF EXISTS books_level_check;
ALTER TABLE public.books ADD CONSTRAINT books_level_check
CHECK (level IN ('débutant', 'intermédiaire', 'avancé'));
```

### Rollback code
```bash
git revert HEAD
git push origin main
```

---

## ✅ Checklist de déploiement

- [ ] **Backup de la base de données effectué**
- [ ] **Migration SQL exécutée avec succès**
- [ ] **Vérification : Toutes les valeurs sont en anglais**
- [ ] **Code déployé sur production**
- [ ] **Test : Filtres de niveau fonctionnent**
- [ ] **Test : Panel admin fonctionne**
- [ ] **Test : Affichage multilingue correct (FR/EN/RU)**
- [ ] **Test : Filtre par défaut (niveau utilisateur) fonctionne**

---

## 📝 Notes importantes

1. **L'ordre d'application est CRUCIAL :** Migration SQL → Déploiement code
2. **Les traductions UI ne sont PAS affectées** - Seules les valeurs internes changent
3. **Compatibilité rétroactive** - Aucun impact pour les utilisateurs
4. **Performance** - Aucun impact sur les performances
5. **Futur** - Plus facile d'ajouter de nouveaux niveaux si besoin

---

*Migration créée le 05/11/2025*
