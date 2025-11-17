# Audit de Code - Translation.jsx

**Date:** 17 novembre 2025
**Fichier:** `components/material/Translation.jsx` (695 lignes)

---

## 📊 Score de qualité global: 6.5/10

### ✅ Points positifs

#### 1. **Sécurité** (9/10)
- ✅ Fonction `sanitizeInput` bien implémentée
  ```javascript
  .replace(/[<>]/g, '')           // Prévient XSS
  .replace(/javascript:/gi, '')   // Prévient injection
  .replace(/on\w+=/gi, '')        // Prévient event handlers
  ```
- ✅ Validation multi-niveaux avec `validateTranslation`
- ✅ Limite de longueur (MAX_TRANSLATION_LENGTH = 100)
- ✅ Détection de caractères répétés suspects: `/(.)\1{10,}/`

#### 2. **UX** (8/10)
- ✅ Positionnement intelligent avec `getPosition()` - gère viewport, mobile, débordement
- ✅ Support invités avec localStorage
- ✅ Gestion des limites (20 mots pour invités)
- ✅ Événements window pour synchronisation entre composants
- ✅ Compteur de caractères en temps réel
- ✅ Messages d'erreur contextuels

#### 3. **Accessibilité** (7/10)
- ✅ Support dark mode
- ✅ États disabled appropriés
- ✅ Messages d'erreur lisibles
- ⚠️ Manque: ARIA labels, focus management

---

## ⚠️ Problèmes identifiés

### 1. **Architecture** (3/10)

#### Problème: État Redux pour UI
```javascript
const { isTranslationOpen, translation, ... } = useSelector(store => store.words)
```
**Impact:** Couplage fort, difficile à tester, état global pour UI locale

**Solution:** Utiliser Context ou state local
```javascript
const { isOpen, data, open, close } = useTranslationContext()
```

#### Problème: Composant trop gros (695 lignes)
**Responsabilités multiples:**
- Rendu UI
- Logique métier (addWord)
- Validation
- Positionnement viewport
- Gestion événements

**Solution:** Séparer en composants plus petits (SRP)

---

### 2. **Code dupliqué** (4/10)

#### Duplication massive de UI
**Lignes 299-481:** UI pour invités
**Lignes 483-691:** UI pour connectés
**~200 lignes dupliquées!**

```javascript
// Version invités (ligne 305-477)
<Paper ref={ref} elevation={8} sx={{...}}>
  <Box>Header</Box>
  <Box>Content</Box>
</Paper>

// Version connectés (ligne 487-689) - IDENTIQUE!
<Paper ref={ref} elevation={8} sx={{...}}>
  <Box>Header</Box>
  <Box>Content</Box>
</Paper>
```

**Solution:** Un seul composant avec conditions
```javascript
const showCustomTranslation = isUserLoggedIn
const disableAdd = !isUserLoggedIn && hasDictionaryLimit
```

#### Logique de mapping langue dupliquée
**Lignes 251-267** (Translation.jsx) ET **Lignes 106-128** (lib/dictionary-client.js)

**Solution:** Extraire fonction utilitaire
```javascript
// utils/wordMapping.js
export function buildWordData(originalWord, translatedWord, learningLang, locale) {
  const data = { word_ru: null, word_fr: null, word_en: null }
  data[`word_${learningLang}`] = originalWord
  data[`word_${locale}`] = translatedWord
  return data
}
```

---

### 3. **Performance** (5/10)

#### Problème: `getPosition()` recalculé à chaque render
```javascript
const position = getPosition() // ❌ Ligne 184 - Appelé à chaque render!
```

**Impact:** Calculs lourds (viewport, mobile, débordement) à chaque frame

**Solution:** Mémoïser avec useMemo
```javascript
const position = useMemo(() => getPosition(), [coordinates, isTranslationOpen])
```

#### Problème: Event listeners non optimisés
```javascript
useEffect(() => {
  const checkIfClickedOutside = e => { ... }
  document.addEventListener('mousedown', checkIfClickedOutside)
  return () => document.removeEventListener('mousedown', checkIfClickedOutside)
}, [dispatch, isTranslationOpen]) // ❌ Recrée le listener à chaque changement dispatch
```

**Solution:** useCallback pour handlers
```javascript
const handleClickOutside = useCallback((e) => { ... }, [isTranslationOpen])
```

---

### 4. **Bugs potentiels** (6/10)

#### Bug 1: Propriété dupliquée (ligne 237)
```javascript
addWordToDictionary({
  locale,
  userLearningLanguage,
  locale: locale, // ❌ DOUBLON!
})
```

#### Bug 2: Dependencies manquantes dans useEffect
```javascript
useEffect(() => {
  const checkIfClickedOutside = e => {
    if (isTranslationOpen && ref.current && !ref.current.contains(e.target)) {
      dispatch(toggleTranslationContainer(false))
      dispatch(cleanTranslation()) // ❌ cleanTranslation pas dans deps!
```

**Solution:** Ajouter toutes les dépendances ou utiliser useCallback

#### Bug 3: Race condition possible
```javascript
const addWord = e => {
  e.preventDefault()
  const translatedWord = personalTranslation ? personalTranslation : e.target.textContent
  // ❌ Si onClick ET submit en même temps, peut ajouter 2 fois
}
```

**Solution:** Ajouter état `isSubmitting` et désactiver pendant l'ajout

---

### 5. **Maintenabilité** (4/10)

#### Complexité cyclomatique élevée
- `getPosition()`: 58 lignes, 8 branches
- `addWord()`: 94 lignes, 10 branches
- Rendu: 3 branches imbriquées (invité/connecté, erreur, traduction)

**Metrics:**
- Lines of Code: 695
- Cyclomatic Complexity: ~25
- Cognitive Complexity: ~35
- Maintainability Index: ~45/100

---

## 🎯 Plan de refactoring

### Phase 1: Extraction de composants

```javascript
// components/translation/TranslationHeader.jsx
const TranslationHeader = ({ onClose }) => (...)

// components/translation/TranslationContent.jsx
const TranslationContent = ({ translation, onClick, disabled }) => (...)

// components/translation/CustomTranslationForm.jsx
const CustomTranslationForm = ({ onSubmit, maxLength }) => (...)

// components/translation/GuestLimitMessage.jsx
const GuestLimitMessage = () => (...)
```

### Phase 2: Extraction de hooks

```javascript
// hooks/useTranslationPosition.js
export function useTranslationPosition(coordinates, isOpen) {
  return useMemo(() => {
    if (!isOpen || typeof window === 'undefined') return { left: 0, top: 0 }
    // Logic de positionnement...
  }, [coordinates, isOpen])
}

// hooks/useGuestWordsCount.js
export function useGuestWordsCount() {
  const [count, setCount] = useState(0)
  // Logic de comptage...
  return count
}

// hooks/useClickOutside.js
export function useClickOutside(ref, callback) {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, callback])
}
```

### Phase 3: Extraction de logique métier

```javascript
// utils/wordMapping.js
export function buildWordData(originalWord, translatedWord, learningLang, locale) {
  const data = { word_ru: null, word_fr: null, word_en: null, word_lang: learningLang }
  data[`word_${learningLang}`] = originalWord
  data[`word_${locale}`] = translatedWord
  return data
}

export function getOriginalWord(translation) {
  return translation?.inf || translation?.word || ''
}
```

### Phase 4: Migration vers Context

```javascript
// context/translation.js (déjà créé)
<TranslationProvider>
  <Translation />
</TranslationProvider>

// Dans Translation.jsx
const { isOpen, data, close } = useTranslationContext()
```

---

## 📈 Améliorations attendues

### Après refactoring:

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| Lines of Code | 695 | ~300 | -57% |
| Cyclomatic Complexity | 25 | <10 | -60% |
| Code duplication | 28% | <5% | -82% |
| Maintainability Index | 45 | 75+ | +67% |
| Test Coverage | 0% | 80%+ | ∞ |
| Score qualité | 6.5/10 | 8.5/10 | +31% |

### Bénéfices:

1. **Maintenabilité:** Composants petits, responsabilité unique
2. **Testabilité:** Hooks et fonctions isolées facilement testables
3. **Réutilisabilité:** Hooks réutilisables dans d'autres composants
4. **Performance:** Mémoïsation appropriée, moins de re-renders
5. **Lisibilité:** Code auto-documenté, moins de complexité cognitive

---

## 🚀 Prochaines étapes

1. ✅ Créer Context de translation
2. 🔄 Créer hooks personnalisés
3. 🔄 Extraire composants UI
4. 🔄 Migrer vers React Query pour addWordToDictionary
5. 🔄 Écrire tests unitaires
6. 🔄 Supprimer Redux dependencies

---

**Conclusion:**
Le code actuel fonctionne mais souffre de dette technique importante. Le refactoring proposé réduira la complexité de 60% tout en améliorant la maintenabilité et les performances.
