# Refactorisation de la Structure des Fichiers - 2024-12-11

## 🎯 Objectif

Unifier la structure des dossiers pour **Method** et **Lessons** en ajoutant une organisation par langue cible (target language) et par niveau.

---

## 📁 Ancienne Structure

### Avant refactorisation

```
data/
├── method/
│   └── lessons/
│       └── beginner/
│           ├── bonjour-saluer-prendre-conge.json  (FR)
│           └── privet-saluer-prendre-conge.json   (RU)
└── lessons/
    └── fr/
        ├── alphabet-sons-et-accents.json
        ├── les-articles.json
        └── ...
```

**Problèmes :**
- Method : Pas de dossier de langue → confusion FR/RU mélangés
- Lessons : Pas de dossier de niveau → difficile de scaler (A1, A2, B1...)
- Incohérence entre les deux systèmes

---

## 📁 Nouvelle Structure

### Après refactorisation

```
data/
├── method/
│   ├── fr/
│   │   └── beginner/
│   │       └── bonjour-saluer-prendre-conge.json
│   └── ru/
│       └── beginner/
│           └── privet-saluer-prendre-conge.json
└── lessons/
    ├── fr/
    │   └── A1/
    │       ├── alphabet-sons-et-accents.json
    │       ├── les-articles.json
    │       ├── le-genre-et-le-nombre-des-noms.json
    │       ├── les-pronoms-sujets-et-etre.json
    │       ├── avoir-au-present.json
    │       ├── verbes-er-partie-1.json
    │       ├── verbes-er-partie-2.json
    │       └── aller-et-venir.json
    └── ru/
        └── A1/
            └── (à créer)
```

**Avantages :**
- ✅ Cohérence entre Method et Lessons
- ✅ Organisation claire par langue enseignée (target_language)
- ✅ Scalable : Ajouter A2, B1, B2 facilement
- ✅ Séparation claire FR vs RU

---

## 🔧 Modifications Techniques

### 1. Fichiers Modifiés

#### `lib/lessons-loader.js`

**Fonctions mises à jour** (6 au total) :

```javascript
// AVANT
export function getLessonFromJSON(levelSlug, lessonSlug)

// APRÈS
export function getLessonFromJSON(targetLanguage, levelSlug, lessonSlug)
```

**Liste complète :**
1. `getLessonFromJSON(targetLanguage, levelSlug, lessonSlug)`
2. `getAllLessonsForLevel(targetLanguage, levelSlug)`
3. `lessonExistsInJSON(targetLanguage, levelSlug, lessonSlug)`
4. `getStandaloneLessonFromJSON(targetLanguage, level, lessonSlug)`
5. `getAllStandaloneLessonsForLang(targetLanguage, level)`
6. `standaloneLessonExistsInJSON(targetLanguage, level, lessonSlug)`

**Changements de chemins :**
```javascript
// Method lessons
// AVANT: data/method/lessons/[level]/[slug].json
// APRÈS: data/method/[targetLanguage]/[level]/[slug].json
const filePath = path.join(METHOD_LESSONS_DIR, targetLanguage, levelSlug, `${lessonSlug}.json`)

// Standalone lessons
// AVANT: data/lessons/[lang]/[slug].json
// APRÈS: data/lessons/[targetLanguage]/[level]/[slug].json
const filePath = path.join(STANDALONE_LESSONS_DIR, targetLanguage, level, `${lessonSlug}.json`)
```

#### `lib/method.js`

**Fonction `getLessonData` :**
```javascript
export async function getLessonData(levelSlug, lessonSlug, learningLang) {
  // AVANT
  const jsonExists = lessonExistsInJSON(levelSlug, lessonSlug)

  // APRÈS
  const jsonExists = lessonExistsInJSON(learningLang, levelSlug, lessonSlug)
  //                                     ↑ Ajout du paramètre targetLanguage

  if (jsonExists) {
    const jsonLesson = getLessonFromJSON(learningLang, levelSlug, lessonSlug)
    //                                    ↑ Ajout du paramètre targetLanguage
  }
}
```

#### `lib/lessons.js`

**Fonction `getLessons` :**
```javascript
export async function getLessons(targetLanguage, spokenLanguage = 'en') {
  const lessons = lessonsMetadata.map(metadata => {
    // AVANT
    const jsonExists = standaloneLessonExistsInJSON(targetLanguage, metadata.slug)

    // APRÈS
    const jsonExists = standaloneLessonExistsInJSON(targetLanguage, metadata.level, metadata.slug)
    //                                                               ↑ Ajout du paramètre level

    if (jsonExists) {
      const jsonLesson = getStandaloneLessonFromJSON(targetLanguage, metadata.level, metadata.slug)
      //                                                              ↑ Ajout du paramètre level
    }
  })
}
```

#### `app/[locale]/lessons/page.js`

**Correction dans `generateMetadata` :**
```javascript
// AVANT (ligne 24)
const lessons = await getLessons(locale)

// APRÈS
const targetLanguage = 'fr' // Hardcoded for now (teaching French)
const lessons = await getLessons(targetLanguage, locale)
```

**Raison :** `locale` est la langue de l'interface, pas la langue enseignée. Correction de la cohérence conceptuelle.

---

## 📦 Migration des Fichiers

### Method Files

```bash
# Créer dossiers
mkdir -p data/method/fr/beginner
mkdir -p data/method/ru/beginner

# Déplacer fichiers
mv data/method/lessons/beginner/bonjour-saluer-prendre-conge.json data/method/fr/beginner/
mv data/method/lessons/beginner/privet-saluer-prendre-conge.json data/method/ru/beginner/
```

### Lessons Files

```bash
# Créer dossier
mkdir -p data/lessons/fr/A1

# Déplacer fichiers (8 leçons)
mv data/lessons/fr/alphabet-sons-et-accents.json data/lessons/fr/A1/
mv data/lessons/fr/les-articles.json data/lessons/fr/A1/
mv data/lessons/fr/le-genre-et-le-nombre-des-noms.json data/lessons/fr/A1/
mv data/lessons/fr/les-pronoms-sujets-et-etre.json data/lessons/fr/A1/
mv data/lessons/fr/avoir-au-present.json data/lessons/fr/A1/
mv data/lessons/fr/verbes-er-partie-1.json data/lessons/fr/A1/
mv data/lessons/fr/verbes-er-partie-2.json data/lessons/fr/A1/
mv data/lessons/fr/aller-et-venir.json data/lessons/fr/A1/
```

**Résultat :** 8 fichiers déplacés avec succès, 0 erreurs.

---

## ✅ Validation

### Tests effectués

1. **Server logs :** ✅
   ```
   [LessonLoader] ✅ Loaded standalone lesson from JSON: alphabet-sons-et-accents
   [LessonLoader] ✅ Loaded standalone lesson from JSON: les-articles
   [LessonLoader] ✅ Loaded standalone lesson from JSON: le-genre-et-le-nombre-des-noms
   ...
   ```

2. **Aucun import tiers :** ✅
   - Vérification : Seuls `lib/method.js` et `lib/lessons.js` importent `lessons-loader.js`
   - Aucun script ne nécessite de modification

3. **Pages fonctionnelles :** ✅
   - `/[locale]/method/[level]/[lessonSlug]` → Fonctionne
   - `/[locale]/lessons` → Fonctionne

4. **Avertissements attendus :** ⚠️
   ```
   [getLessons] ⚠️ No JSON file for lesson: faire-et-prendre
   [getLessons] ⚠️ No JSON file for lesson: saluer-et-se-presenter
   ...
   ```
   → Normal, leçons 9-15 pas encore créées

---

## ❌ Problème Connu (à résoudre)

### Erreur DB PROD

```
Error fetching lessons metadata: {
  code: '42703',
  message: 'column lessons.title_en does not exist'
}
```

**Cause :** Colonne `title_en` existe dans DB dev mais pas dans DB PROD.

**Solution :**
```sql
-- À exécuter dans DB PROD
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS title_en VARCHAR(255);
```

---

## 🎓 Concepts Clés

### Target Language vs Spoken Language

**Important :** Ne pas confondre !

| Concept | Description | Valeurs | Exemple |
|---------|-------------|---------|---------|
| **target_language** | Langue enseignée | `fr`, `ru` | Un Russe apprend le français → `fr` |
| **spoken_language** | Langue native de l'apprenant | `fr`, `ru`, `en` | Apprenant russe → `ru` |
| **interface_language** | Langue de l'UI | `fr`, `ru`, `en` | Interface en anglais → `en` |

**Utilisation dans le code :**
- `target_language` → Filtrage des leçons, choix du dossier
- `spoken_language` → Sélection de `blocks_fr` / `blocks_en` / `blocks_ru`
- `interface_language` → Traductions UI (boutons, menus)

---

## 📊 Impact

### Fichiers touchés (4)
1. ✅ `lib/lessons-loader.js` - 6 fonctions modifiées
2. ✅ `lib/method.js` - 1 fonction modifiée
3. ✅ `lib/lessons.js` - 1 fonction modifiée
4. ✅ `app/[locale]/lessons/page.js` - 1 correction

### Fichiers déplacés (10)
- 2 fichiers Method (FR + RU)
- 8 fichiers Lessons (FR A1)

### Backward compatibility
❌ **Breaking change** : Anciens chemins ne fonctionnent plus.
✅ Mais aucun déploiement en production → Pas d'impact utilisateurs.

---

## 🚀 Prochaines Étapes

1. ✅ Ajouter colonne `title_en` dans DB PROD
2. 📝 Créer leçons françaises 9-15 (voir `docs/lessons/PLAN_LESSONS_FR_A1.md`)
3. 📝 Créer leçons russes 1-15 (voir `docs/lessons/PLAN_LESSONS_RU_A1.md`)
4. 🎵 Générer audio pour toutes les leçons (Phase 2)

---

## 📚 Documentation Créée

Trois nouveaux fichiers de documentation :

1. **`docs/lessons/README.md`**
   - Vue d'ensemble du système de leçons
   - Structure des fichiers JSON
   - Workflow de création
   - Gestion du multilinguisme

2. **`docs/lessons/PLAN_LESSONS_FR_A1.md`**
   - Plan détaillé des 15 leçons françaises A1
   - 8 leçons complétées ✅
   - 7 leçons à créer 🔴
   - Consignes de création

3. **`docs/lessons/PLAN_LESSONS_RU_A1.md`**
   - Plan détaillé des 15 leçons russes A1
   - Adaptations pédagogiques pour le russe
   - Gestion des cas grammaticaux
   - 15 leçons à créer 🔴

---

## 👥 Auteurs

- **Claude Code** - Refactorisation technique
- **Sidney** - Validation et direction

**Date :** 2024-12-11
