# Audit de Migration - Next.js 15 + React Query

**Date:** 17 novembre 2025
**Objectif:** Migrer Redux vers React Query + Server Components

---

## ✅ État actuel de la migration

### Migrations complètes
1. **Materials** (commit f068b2e, 5ecada1, f79eeaf)
   - ✅ Pages migrées vers Server Components
   - ✅ Client components utilisent React Query
   - ✅ Redux slice supprimé
   - ✅ `materialsSelectors.js` supprimé

2. **Method/Lessons** (commit 23fa830)
   - ✅ Pages migrées vers Server Components
   - ⚠️ Composants clients utilisent encore Redux

3. **Admin** (commit b80b5b5)
   - ✅ Toutes les pages migrées

4. **Blog & Leaderboard** (commit 08da8e3)
   - ✅ Migrés vers Server Components

5. **Homepage** (commit aca35bd)
   - ✅ Migrée vers Server Components

---

## 🚧 Redux slices restants à migrer

### Store actuel (`features/store.js`)
```javascript
{
  content: contentSlice,      // ❓ À identifier l'utilisation
  words: wordsSlice,          // 🔴 Dictionnaire + Traductions + SRS
  cards: cardsSlice,          // 🔴 Flashcards SRS
  lessons: lessonsSlice,      // 🔴 Lessons
  courses: coursesSlice,      // 🔴 Method courses
}
```

---

## 📊 Analyse détaillée des slices

### 1. **wordsSlice** (553 lignes)

**Fonctionnalités:**
- Traduction de mots (`translateWord`)
- Dictionnaire utilisateur (`getAllUserWords`, `addWordToDictionary`, `deleteUserWord`, `deleteUserWords`)
- Mots liés aux matériaux (`getUserMaterialWords`)
- Système SRS pour flashcards (`updateWordReview`, `initializeWordSRS`, `suspendCard`)
- État UI (`toggleTranslationContainer`, `cleanTranslation`)

**Composants dépendants:**
- `components/dictionary/DictionaryClient.jsx`
- `components/dictionary/AddWordModal.jsx`
- `components/material/Translation.jsx`
- `components/material/Words.jsx`
- `components/material/WordsContainer.jsx`
- `components/games/Flashcards.jsx`

**Problèmes identifiés:**
- ⚠️ **Responsabilités mixtes:** Le slice gère à la fois le dictionnaire ET les flashcards SRS
- ⚠️ **Couplage fort:** Translation.jsx dépend fortement de l'état Redux
- ⚠️ **État UI dans Redux:** `isTranslationOpen` devrait être un state local

**Recommandations:**
1. Séparer en deux modules:
   - `lib/dictionary-client.js` (dictionnaire, traduction, mots)
   - `lib/flashcards-client.js` (SRS uniquement)
2. Migrer `isTranslationOpen` vers un state local ou Context
3. Utiliser React Query mutations pour les opérations CRUD

---

### 2. **cardsSlice**

**Fonctionnalités:**
- Gestion des cartes SRS (flashcards)
- Révision espacée (spaced repetition)

**Composants dépendants:**
- `components/games/Flashcards.jsx`

**Recommandations:**
- Fusionner avec la partie SRS de wordsSlice dans `lib/flashcards-client.js`

---

### 3. **lessonsSlice**

**Fonctionnalités:**
- Gestion des leçons

**Composants dépendants:**
- `components/lessons/Lesson.jsx`
- `components/lessons/LessonsMenu.jsx`
- `components/lessons/LessonsPageClient.jsx`

**Recommandations:**
- Créer `lib/lessons-client.js`
- Migrer vers React Query

---

### 4. **coursesSlice**

**Fonctionnalités:**
- Gestion des cours de la méthode

**Composants dépendants:**
- `components/method/LessonPageClient.jsx`

**Recommandations:**
- Créer `lib/courses-client.js`
- Migrer vers React Query

---

### 5. **contentSlice**

**Utilisation:** ❓ À déterminer

**Action requise:**
- Identifier les composants qui l'utilisent
- Supprimer si obsolète

---

## 🎯 Plan de migration priorisé

### Phase 1: Dictionnaire & Traductions (Priorité HAUTE)
**Raison:** Utilisé partout dans les materials

1. Créer `lib/dictionary-client.js`
   - `getUserWords(userId, learningLang, locale)`
   - `addWordToDictionary({ originalWord, translatedWord, ... })`
   - `deleteWord(wordId)`
   - `deleteWords(wordIds[])`
   - `translateWord({ word, sentence, learningLang, locale })`

2. Migrer `DictionaryClient.jsx` vers React Query
   - `useQuery(['userWords', userId, learningLang])` pour charger
   - `useMutation` pour add/delete

3. Migrer `AddWordModal.jsx` vers React Query

4. Migrer `Translation.jsx`
   - Remplacer Redux par React Query
   - Déplacer `isTranslationOpen` vers Context ou state local

5. Migrer `Words.jsx` et `WordsContainer.jsx`

---

### Phase 2: Flashcards SRS (Priorité MOYENNE)

1. Créer `lib/flashcards-client.js`
   - `getFlashcards(userId, learningLang)`
   - `updateCardReview({ cardId, quality, ... })`
   - `initializeCardSRS(wordId)`
   - `suspendCard(cardId)`

2. Migrer `Flashcards.jsx` vers React Query

---

### Phase 3: Lessons & Method (Priorité MOYENNE)

1. Créer `lib/lessons-client.js`
2. Créer `lib/courses-client.js`
3. Migrer tous les composants lessons/method

---

### Phase 4: Nettoyage final (Priorité BASSE)

1. Identifier et supprimer `contentSlice` si inutilisé
2. Supprimer `features/` directory
3. Supprimer Redux de `package.json`
4. Supprimer Provider Redux de Layout

---

## ⚠️ Points d'attention

### Sécurité
- ✅ `Translation.jsx` a déjà de bonnes validations (sanitizeInput, validateTranslation)
- ✅ Limite de traductions gérée côté serveur (cookie HttpOnly)
- ⚠️ Vérifier les limites dictionnaire invités (GUEST_DICTIONARY_CONFIG)

### Performance
- ⚠️ `filteredUserWords` dans DictionaryClient recalcule à chaque render → Optimiser avec useMemo
- ⚠️ Pagination côté client → Considérer pagination serveur si >1000 mots

### UX
- ✅ Support invités avec localStorage (`utils/guestDictionary.js`)
- ✅ Migration invité → utilisateur connecté gérée
- ⚠️ État de chargement à gérer correctement avec React Query

---

## 📋 Checklist de migration

### Pour chaque slice:
- [ ] Créer lib client correspondant
- [ ] Migrer vers React Query (useQuery/useMutation)
- [ ] Tester fonctionnalités
- [ ] Supprimer références Redux
- [ ] Supprimer slice file
- [ ] Mettre à jour store.js

### Tests à effectuer:
- [ ] Dictionnaire: ajout/suppression mots (connecté + invité)
- [ ] Traduction: limite invités, migration au login
- [ ] Flashcards: révision SRS, algorithme espacé
- [ ] Lessons: navigation, progression
- [ ] Method: déblocage cours, progression

---

## 🔍 Prochaines étapes

1. **Maintenant:** Commencer Phase 1 - Dictionnaire
2. **Ensuite:** Phase 2 - Flashcards
3. **Puis:** Phase 3 - Lessons & Method
4. **Enfin:** Phase 4 - Nettoyage

---

**Notes:**
- Tester chaque migration avant de passer à la suivante
- Garder les anciens fichiers jusqu'à validation complète
- Documenter les changements d'API
