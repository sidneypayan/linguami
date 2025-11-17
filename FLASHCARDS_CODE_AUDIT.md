# Audit Qualité - Système Flashcards SRS

**Date:** 2025-01-17
**Composants analysés:**
- `components/games/Flashcards.jsx` (837 lignes)
- `features/cards/cardsSlice.js` (20 lignes)
- `features/words/wordsSlice.js` (fonctions SRS)
- `utils/spacedRepetition.js` (485 lignes)
- `utils/guestDictionary.js`

## 📊 Résumé

| Métrique | Valeur | Status |
|----------|--------|---------|
| **Lignes Flashcards.jsx** | 837 | 🔴 Très long |
| **Complexité** | Très élevée | 🔴 |
| **Duplication** | Modérée (guest vs user) | 🟡 |
| **Redux vs React Query** | 100% Redux | 🔴 |
| **Composants extraits** | 0 | 🔴 |
| **Hooks personnalisés** | 0 | 🔴 |
| **Algorithme SRS** | Bien organisé | 🟢 |

## 🔴 Problèmes Majeurs

### 1. Composant Monolithique (837 lignes)
**Impact:** Maintenance difficile, tests impossibles, réutilisabilité nulle

Le composant `Flashcards.jsx` fait **trop de choses** :
- Gestion de session (initialization, cards queue)
- Filtrage des mots (learning language, suspended cards)
- Logique invités vs connectés
- Calculs SRS et mise à jour
- Gestion XP/achievements
- UI pour 5 états différents (loading, complete, no words, no cards due, review)
- Settings (limit, reversed mode)
- LocalStorage management

**Solution:** Décomposer en :
- Hooks: `useFlashcardSession`, `useFlashcardReview`, `useFlashcardSettings`
- Composants UI: `FlashcardReview`, `SessionComplete`, `NoCardsState`, `ReviewSettings`
- Utilitaires: déjà bien dans `spacedRepetition.js`

### 2. Redux au lieu de React Query
**Impact:** Pattern inconsistant, cache non géré, optimistic updates complexes

Actuellement, toutes les opérations SRS utilisent Redux:
- `updateWordReview` (wordsSlice.js:297-330)
- `suspendCard` (wordsSlice.js:369-389)
- `initializeWordSRS` (wordsSlice.js:335-364)

Ces fonctions devraient être dans `lib/flashcards-client.js` et utilisées avec React Query mutations.

**Avantages React Query:**
- Invalidation automatique du cache
- Optimistic updates
- Retry automatique
- Loading/error states gérés
- Pattern cohérent avec Words/Dictionary

### 3. useEffect complexe d'initialization (90 lignes)
**Impact:** Difficile à comprendre, bugs potentiels, race conditions

Le useEffect lignes 234-323 est **trop complexe**:
```javascript
// 10 conditions imbriquées
if (sessionInitialized) return
if (!wordsArray) return
if (!userLearningLanguage || !locale) return
if (wordsArray.length === 0) {
  if (!isStillLoading) {
    setSessionInitialized(true)
  }
  return
}
// ... 60 lignes de logique
```

**Solution:** Extraire dans un hook `useFlashcardSession` avec états plus clairs.

### 4. Duplication Guest vs User Logic
**Impact:** Maintenance double, bugs potentiels

Exemple dans `handleReview` (lignes 395-494):
```javascript
if (isUserLoggedIn) {
  const result = await dispatch(updateWordReview({...}))
  updatedCard = result.payload
} else {
  updatedCard = calculateNextReview(currentCard, buttonType)
  const savedCard = updateGuestWord(currentCard.id, updatedCard)
  setGuestWords(prev => prev.map(w => w.id === currentCard.id ? savedCard : w))
}
```

**Solution:** Hook unifié qui abstrait la différence entre guest/user.

### 5. Pas d'extraction de composants UI
**Impact:** Composant illisible, pas de réutilisation

5 états différents rendus dans le même composant:
1. Loading (lignes 574-591)
2. Complete (lignes 526-571)
3. No words (lignes 594-620)
4. No cards due (lignes 623-684)
5. Review card (lignes 686-833)

Chaque état devrait être un composant séparé.

### 6. Dépendances useEffect excessives
**Impact:** Re-renders inutiles

```javascript
}, [wordsArray, dispatch, sessionInitialized, cardsLimit,
    userLearningLanguage, locale, isUserLoggedIn, guestWords, user_words_loading])
```

10 dépendances = risque élevé de re-render.

## 🟡 Problèmes Modérés

### 7. Logique de filtrage répétée
Le filtrage des mots (lignes 125-151) combine plusieurs critères:
- Same language check
- Source + translation exist
- Logging

Cette logique pourrait être dans un utility.

### 8. State management local complexe
8 états locaux différents:
```javascript
const [showAnswer, setShowAnswer] = useState(false)
const [reviewedCount, setReviewedCount] = useState(0)
const [sessionCards, setSessionCards] = useState([])
const [sessionInitialized, setSessionInitialized] = useState(false)
const [isReversed, setIsReversed] = useState(...)
const [cardsLimit, setCardsLimit] = useState(...)
const [showSettings, setShowSettings] = useState(false)
const [showPracticeOptions, setShowPracticeOptions] = useState(false)
```

Certains peuvent être regroupés ou extraits.

### 9. Sentence masking logic
La fonction `getMaskedSentence` (lignes 335-369) est longue et pourrait être dans `utils/`.

### 10. Deep copying manuel
Ligne 474-484 : Deep copy manuel pour éviter les références Redux.
React Query éliminerait ce besoin.

## 🟢 Points Positifs

### ✅ Algorithme SRS bien organisé
`utils/spacedRepetition.js` est **excellent**:
- Bien documenté
- Fonctions pures
- Séparation claire des états (NEW, LEARNING, REVIEW, RELEARNING)
- Testable
- Basé sur Anki (algorithme éprouvé)

### ✅ Support complet invités
Gestion localStorage via `guestDictionary.js` est bien implémentée.

### ✅ XP integration
L'ajout d'XP après reviews est bien géré (lignes 433-458).

### ✅ Settings persistants
localStorage pour `reversed` et `cardsLimit` (bonne UX).

## 📋 Plan de Refactoring

### Phase 1: Créer lib/flashcards-client.js ⚙️
```javascript
// Nouvelles fonctions
export async function updateCardReview({ wordId, buttonType, currentCard })
export async function suspendCard(wordId)
export async function initializeCard(wordId)
export async function getReviewStats({ userId, userLearningLanguage })
```

### Phase 2: Créer hooks personnalisés 🎣
```javascript
// hooks/flashcards/useFlashcardSession.js
export function useFlashcardSession({ materialId, userId, userLearningLanguage })

// hooks/flashcards/useFlashcardReview.js
export function useFlashcardReview({ cardId, onReviewComplete })

// hooks/flashcards/useFlashcardSettings.js
export function useFlashcardSettings()
```

### Phase 3: Extraire composants UI 🎨
```javascript
// components/flashcards/FlashcardReview.jsx
// components/flashcards/SessionComplete.jsx
// components/flashcards/NoCardsState.jsx
// components/flashcards/ReviewSettings.jsx
```

### Phase 4: Migrer vers React Query 🔄
- Remplacer `dispatch(updateWordReview)` par `reviewMutation.mutate()`
- Remplacer `dispatch(suspendCard)` par `suspendMutation.mutate()`
- Utiliser `invalidateQueries` pour refresh

### Phase 5: Simplifier le composant principal 📉
Objectif: **Passer de 837 à ~200 lignes**

```javascript
function Flashcards() {
  const { session, isLoading } = useFlashcardSession()
  const { handleReview } = useFlashcardReview()
  const { settings } = useFlashcardSettings()

  if (isLoading) return <LoadingState />
  if (session.isComplete) return <SessionComplete stats={session.stats} />
  if (!session.currentCard) return <NoCardsState />

  return <FlashcardReview card={session.currentCard} onReview={handleReview} />
}
```

## 🎯 Gains Attendus

| Aspect | Avant | Après | Amélioration |
|--------|-------|-------|--------------|
| **Lignes Flashcards.jsx** | 837 | ~200 | -76% |
| **Hooks réutilisables** | 0 | 3 | ✅ |
| **Composants UI** | 1 | 5 | ✅ |
| **Pattern cohérent** | Redux | React Query | ✅ |
| **Testabilité** | Faible | Élevée | ✅ |
| **Maintenance** | Difficile | Simple | ✅ |

## 📝 Notes Techniques

### État actuel des dépendances Redux
- ✅ `user_words` - Lu via Redux (temporaire)
- ✅ `user_material_words` - Lu via Redux (temporaire)
- ❌ `updateWordReview` - Mutation Redux → migrer
- ❌ `suspendCard` - Mutation Redux → migrer
- ❌ `initializeWordSRS` - Mutation Redux → migrer

### Compatibilité Invités
Le système doit continuer à fonctionner pour les invités:
- localStorage via `guestDictionary.js`
- Pas de changement nécessaire
- Abstraction dans les hooks

### Algorithme SRS
**À CONSERVER:** `utils/spacedRepetition.js` est parfait.
Ne PAS le modifier, juste l'utiliser depuis le nouveau client.

## ⚠️ Risques

1. **Complexité de la migration** - Le système SRS est critique
2. **Race conditions** - Gestion de session délicate
3. **État partagé** - Words + Flashcards partagent les mêmes données
4. **Testing nécessaire** - Vérifier que l'algorithme SRS fonctionne toujours

## ✅ Validation

Pour valider la migration:
1. ✅ Les cartes dues sont bien calculées
2. ✅ Les intervalles SRS sont corrects (Again/Hard/Good/Easy)
3. ✅ Les états de carte changent correctement (NEW → LEARNING → REVIEW)
4. ✅ La suspension fonctionne
5. ✅ Les statistiques sont exactes
6. ✅ Les invités peuvent toujours réviser
7. ✅ XP est ajouté correctement
8. ✅ Settings persistent (reversed, limit)

---

**Priorité:** 🔴 **ÉLEVÉE**
**Complexité:** 🟡 **MOYENNE-ÉLEVÉE**
**Impact:** 🟢 **TRÈS POSITIF**
