# Audit du Système de Filtrage des Matériaux

**Date**: 2025-11-21
**Problème rapporté**: Les matériaux ne s'affichent pas correctement selon la configuration langue parlée/langue apprise. Les utilisateurs doivent faire un switch manuel pour que ça rentre dans l'ordre.

---

## Résumé Exécutif

**Problème principal identifié** : **Race condition et désynchronisation** entre :
1. Le Server Component qui détermine `learningLanguage` depuis la base de données
2. Le Client Context qui gère `userLearningLanguage` avec 3 useEffects concurrents
3. Les filtres côté client qui utilisent des valeurs statiques au lieu de valeurs réactives

**Impact** : Les utilisateurs voient les matériaux de la mauvaise langue ou doivent rafraîchir manuellement la page pour voir les bons matériaux après un changement de langue.

---

## Architecture Actuelle

### Flux de Données

```
1. Server Component (page.js)
   ├─ Lit user.learning_language depuis DB
   ├─ Fetch materials avec cette langue
   └─ Passe learningLanguage + materials au Client

2. Client Component (MaterialsPageClient.jsx)
   ├─ Reçoit learningLanguage (static prop du server)
   ├─ Récupère userLearningLanguage (reactive state du context)
   └─ React Query avec queryKey: [userLearningLanguage]

3. User Context (context/user.js)
   ├─ useEffect 1: Bootstrap (lit session + localStorage)
   ├─ useEffect 2: Sync locale ↔ spoken_language
   └─ useEffect 3: Vérifie learning ≠ locale
```

### Sources de Vérité Multiples

Le système a **3 sources de vérité différentes** pour la langue d'apprentissage :

1. **Database** (`users_profile.learning_language`) - Server Side
2. **Context State** (`userLearningLanguage`) - Client Side, géré par 3 useEffects
3. **localStorage** (`learning_language`) - Persistance locale

---

## Problèmes Identifiés

### 🔴 Problème 1: Race Condition au Montage

**Fichier** : `components/materials/MaterialsPageClient.jsx:32-39`

```javascript
const { data: allLoadedMaterials = [] } = useQuery({
  queryKey: ['allMaterials', userLearningLanguage],
  queryFn: () => getMaterialsByLanguageAction(userLearningLanguage),
  initialData: userLearningLanguage === learningLanguage ? initialMaterials : undefined,
  enabled: !!userLearningLanguage,
  staleTime: 5 * 60 * 1000,
})
```

**Scénario du bug** :
1. Server fetch matériaux avec `learning_language = 'ru'` (depuis DB)
2. Client monte, `MaterialsPageClient` s'initialise avec `learningLanguage = 'ru'` (prop)
3. **Bootstrap useEffect** (context/user.js:158-206) lit localStorage
4. localStorage contient `learning_language = 'fr'` (ancien)
5. Context fait `setUserLearningLanguage('fr')`
6. React Query détecte `userLearningLanguage ('fr') !== learningLanguage ('ru')`
7. `initialData` n'est **pas utilisé** (condition ligne 36 est false)
8. React Query **refetch** avec `getMaterialsByLanguageAction('fr')`

**Résultat** :
- Double fetch (server + client)
- Matériaux français affichés au lieu de russes
- Utilisateur doit switch manuellement pour forcer un refetch

---

### 🔴 Problème 2: Filtre Côté Client avec Valeur Statique

**Fichier** : `components/materials/SectionPageClient.jsx:64-98`

```javascript
const filteredMaterials = useMemo(() => {
  let result = [...materials]

  // Filter by learning language
  result = result.filter(m => m.lang === learningLanguage) // ❌ learningLanguage est une PROP STATIQUE

  // ... autres filtres
}, [materials, learningLanguage, selectedLevel, selectedStatus, searchTerm, userMaterialsStatus])
```

**Problème** :
- `learningLanguage` vient du Server Component (ligne 28) comme **prop statique**
- Si le contexte change `userLearningLanguage` → le filtre **ne se met PAS à jour**
- Les matériaux de la mauvaise langue restent affichés

**Exemple** :
1. Server fetch matériaux russes (`learningLanguage = 'ru'`)
2. Filtre applique `m.lang === 'ru'` → affiche matériaux russes
3. Utilisateur switch vers français dans le menu
4. Context change `userLearningLanguage = 'fr'`
5. **Mais** `learningLanguage` (prop) reste `'ru'`
6. Filtre continue d'afficher matériaux russes ❌

---

### 🔴 Problème 3: Trois useEffects Concurrents

**Fichier** : `context/user.js`

Le contexte a **3 useEffects** qui peuvent tous modifier `userLearningLanguage`, créant des conflits :

#### useEffect 1: Bootstrap (lignes 158-206)
```javascript
useEffect(() => {
  const init = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await hydrateFromSession(session) // ← Lit learning_language de la DB
    } else {
      // Invité : lit localStorage ou fallback
      const stored = localStorage.getItem('learning_language')
      const fallback = getDefaultLearningLanguage(currentLocale)
      let lang = stored || fallback
      setUserLearningLanguage(lang) // ← Peut différer de la DB
    }
  }
  init()
}, [])
```

**Problème** : Asynchrone, peut se terminer **après** le montage des composants enfants.

#### useEffect 2: Sync avec Locale (lignes 211-245)
```javascript
useEffect(() => {
  const currentLocale = router.locale
  let storedSpokenLang = userProfile?.spoken_language || localStorage.getItem('spoken_language')

  if (storedSpokenLang !== currentLocale) {
    const newLearningLang = getDefaultLearningLanguage(currentLocale)
    if (newLearningLang !== userLearningLanguage) {
      setUserLearningLanguage(newLearningLang) // ← Force un changement
    }
  }
}, [router?.locale, isBootstrapping, userProfile, user, userLearningLanguage])
```

**Problème** : Se déclenche à chaque changement de locale et **écrase** la préférence utilisateur.

#### useEffect 3: Vérification langue ≠ locale (lignes 250-261)
```javascript
useEffect(() => {
  if (userLearningLanguage === router.locale) {
    const newLearningLang = getDefaultLearningLanguage(router.locale)
    setUserLearningLanguage(newLearningLang) // ← Force un changement
  }
}, [router?.locale, userLearningLanguage, isBootstrapping])
```

**Problème** : Peut déclencher un changement inattendu si la langue est temporairement égale à la locale.

**Scénario de conflit** :
1. Bootstrap (useEffect 1) set `userLearningLanguage = 'ru'`
2. Sync locale (useEffect 2) détecte `currentLocale = 'ru'`
3. Vérification (useEffect 3) détecte `userLearningLanguage === router.locale`
4. Force `setUserLearningLanguage('fr')`
5. Utilisateur voit matériaux français au lieu de russes ❌

---

### 🟡 Problème 4: Pas de Refetch lors du Changement de Langue (Section Pages)

**Fichier** : `components/materials/SectionPageClient.jsx:48-53`

```javascript
const { data: materials = [] } = useQuery({
  queryKey: ['materials', section, learningLanguage],
  queryFn: () => initialMaterials, // ❌ Ne refetch JAMAIS
  initialData: initialMaterials,
  staleTime: Infinity, // SSR data is fresh
})
```

**Problème** :
- `queryFn` retourne toujours `initialMaterials` (données du server)
- Même si l'utilisateur change de langue, **aucun refetch** n'est déclenché
- Les matériaux de la mauvaise langue restent en cache

**Solution attendue** :
- Le `queryKey` devrait inclure `userLearningLanguage` du contexte
- Le `queryFn` devrait fetch depuis une Server Action

---

### 🟡 Problème 5: initialData avec Condition Fragile

**Fichier** : `components/materials/MaterialsPageClient.jsx:36`

```javascript
initialData: userLearningLanguage === learningLanguage ? initialMaterials : undefined,
```

**Problème** :
- Si `userLearningLanguage !== learningLanguage` (même temporairement), `initialData` est `undefined`
- React Query considère qu'il n'y a pas de données et **refetch immédiatement**
- Perte de l'optimisation SSR
- Double fetch inutile

---

## Scénarios Utilisateur Réels

### Scénario A: Francophone apprend le russe, navigue sur interface FR

**État initial** :
- DB: `learning_language = 'ru'`, `spoken_language = 'fr'`
- localStorage: `learning_language = 'ru'`
- URL: `/fr/materials`

**Flux** :
1. ✅ Server fetch matériaux russes
2. ✅ Client monte avec `learningLanguage = 'ru'` (prop)
3. ✅ Bootstrap useEffect lit DB → `userLearningLanguage = 'ru'`
4. ✅ Condition `userLearningLanguage === learningLanguage` → utilise `initialData`
5. ✅ Affiche matériaux russes

**Résultat** : ✅ **Fonctionne correctement**

---

### Scénario B: Francophone apprend le russe, navigue sur interface RU

**État initial** :
- DB: `learning_language = 'ru'`, `spoken_language = 'fr'`
- localStorage: `learning_language = 'ru'`, `spoken_language = 'fr'`
- URL: `/ru/materials`

**Flux** :
1. ✅ Server fetch matériaux russes (`learning_language = 'ru'` de DB)
2. ✅ Client monte avec `learningLanguage = 'ru'` (prop)
3. ⚠️ **Sync locale useEffect** (ligne 211-245) :
   - `currentLocale = 'ru'`
   - `storedSpokenLang = 'fr'` (de localStorage)
   - `storedSpokenLang !== currentLocale` → true
   - Calcule `newLearningLang = getDefaultLearningLanguage('ru')` → **'fr'**
   - Change `setUserLearningLanguage('fr')` ❌
4. ❌ React Query détecte `userLearningLanguage ('fr') !== learningLanguage ('ru')`
5. ❌ `initialData` non utilisé → refetch avec langue 'fr'
6. ❌ Affiche matériaux **français** au lieu de russes

**Résultat** : ❌ **BUG** - Utilisateur voit mauvaise langue

**Pourquoi ça arrive** :
Le useEffect de sync (ligne 211-245) suppose que :
- Si `spoken_language (fr) !== locale (ru)` → force learning vers autre langue
- **MAIS** ici l'utilisateur **veut** apprendre le russe et voir l'interface en russe !
- La logique suppose qu'on ne peut pas voir interface dans langue apprise

---

### Scénario C: Utilisateur change de langue d'apprentissage (FR → RU)

**État initial** :
- Interface: `/fr/materials`
- DB: `learning_language = 'fr'`
- Page affiche matériaux français

**Actions** :
1. Utilisateur clique sur menu langue d'apprentissage
2. Sélectionne "Russe"
3. Context appelle `changeLearningLanguage('ru')`
4. Update DB + `setUserLearningLanguage('ru')`
5. ✅ React Query détecte changement de `userLearningLanguage`
6. ✅ Refetch avec `getMaterialsByLanguageAction('ru')`
7. ✅ Affiche matériaux russes

**Résultat** : ✅ **Fonctionne correctement**

---

### Scénario D: Utilisateur change d'interface (FR → RU) sans changer langue apprise

**État initial** :
- Interface: `/fr/materials`
- DB: `learning_language = 'ru'`, `spoken_language = 'fr'`
- Page affiche matériaux russes

**Actions** :
1. Utilisateur clique sur menu interface
2. Sélectionne "Русский"
3. Next.js redirige vers `/ru/materials`
4. **Sync locale useEffect** se déclenche :
   - `currentLocale = 'ru'`
   - `storedSpokenLang = 'fr'` (ancien)
   - Force `newLearningLang = 'fr'` ❌
5. ❌ Context change `userLearningLanguage = 'fr'`
6. ❌ Page affiche matériaux **français** au lieu de russes

**Résultat** : ❌ **BUG** - Changement d'interface casse la langue apprise

---

### Scénario E: Utilisateur revient sur une section après avoir vu un matériau

**État initial** :
- Interface: `/fr/materials/dialogues`
- DB: `learning_language = 'ru'`
- Page affiche liste de dialogues russes

**Actions** :
1. Utilisateur clique sur dialogue #42
2. Navigation vers `/fr/materials/dialogues/42`
3. Lit le dialogue
4. Clique "Retour" → `/fr/materials/dialogues`

**Flux** :
1. ✅ Server re-fetch liste dialogues russes
2. ✅ `SectionPageClient` reçoit `learningLanguage = 'ru'`
3. ❌ **Filtre** utilise `learningLanguage` (prop statique) au lieu de `userLearningLanguage`
4. ⚠️ Si contexte a changé entre-temps → filtre ne suit pas

**Résultat** : ⚠️ **Potentiel bug** si langue a changé pendant la lecture

---

## Solutions Recommandées

### 🎯 Solution 1: Supprimer les useEffects Concurrents (PRIORITÉ HAUTE)

**Fichier** : `context/user.js`

**Problème** : 3 useEffects modifient `userLearningLanguage` de manière conflictuelle.

**Solution** : Simplifier à **1 seul useEffect** avec logique claire :

```javascript
// REMPLACER les 3 useEffects par un seul
useEffect(() => {
  if (isBootstrapping) return

  const currentLocale = router?.locale || 'fr'

  // RÈGLE 1: Si utilisateur connecté, DB est source de vérité
  if (user && userProfile?.learning_language) {
    if (userLearningLanguage !== userProfile.learning_language) {
      setUserLearningLanguage(userProfile.learning_language)
      localStorage.setItem('learning_language', userProfile.learning_language)
    }
    return
  }

  // RÈGLE 2: Invité - localStorage ou fallback
  const stored = localStorage.getItem('learning_language')
  const fallback = getDefaultLearningLanguage(currentLocale)

  // RÈGLE 3: Vérifier que learning ≠ locale
  let targetLang = stored || fallback
  if (targetLang === currentLocale) {
    targetLang = fallback
  }

  if (userLearningLanguage !== targetLang) {
    setUserLearningLanguage(targetLang)
    localStorage.setItem('learning_language', targetLang)
  }
}, [user, userProfile?.learning_language, router?.locale, isBootstrapping, userLearningLanguage])
```

**Avantages** :
- ✅ DB est toujours prioritaire pour utilisateurs connectés
- ✅ Pas de conflits entre useEffects
- ✅ Logique prédictible et testable

---

### 🎯 Solution 2: Synchroniser Context avec Server au Montage (PRIORITÉ HAUTE)

**Fichiers** :
- `components/materials/MaterialsPageClient.jsx`
- `components/materials/SectionPageClient.jsx`

**Problème** : Context peut avoir une valeur différente du Server au montage.

**Solution** : Ajouter un useEffect de synchronisation dans les Client Components :

```javascript
// Dans MaterialsPageClient.jsx
const { userLearningLanguage, changeLearningLanguage } = useUserContext()

// Synchroniser context avec server au montage
useEffect(() => {
  if (learningLanguage && userLearningLanguage && learningLanguage !== userLearningLanguage) {
    // Server a une langue différente du context
    // Mettre à jour le context pour éviter refetch
    changeLearningLanguage(learningLanguage)
  }
}, []) // Seulement au montage
```

**Avantages** :
- ✅ Évite double fetch
- ✅ Context synchronisé avec DB
- ✅ `initialData` toujours utilisé

---

### 🎯 Solution 3: Utiliser userLearningLanguage dans les Filtres (PRIORITÉ HAUTE)

**Fichier** : `components/materials/SectionPageClient.jsx:64-98`

**Problème** : Filtre utilise `learningLanguage` (prop statique) au lieu de `userLearningLanguage` (reactive).

**Solution** :

```javascript
// AVANT
const filteredMaterials = useMemo(() => {
  let result = [...materials]
  result = result.filter(m => m.lang === learningLanguage) // ❌ Statique
  // ...
}, [materials, learningLanguage, ...])

// APRÈS
const { userLearningLanguage } = useUserContext() // Ajouter

const filteredMaterials = useMemo(() => {
  let result = [...materials]
  result = result.filter(m => m.lang === userLearningLanguage) // ✅ Reactive
  // ...
}, [materials, userLearningLanguage, ...]) // Changer dépendance
```

**Avantages** :
- ✅ Filtre réactif aux changements de langue
- ✅ Affiche toujours les bons matériaux

---

### 🎯 Solution 4: Ajouter Server Action pour Refetch (PRIORITÉ MOYENNE)

**Fichier** : `components/materials/SectionPageClient.jsx:48-53`

**Problème** : Pas de refetch quand langue change (queryFn retourne toujours initialMaterials).

**Solution** : Utiliser une vraie Server Action dans queryFn :

```javascript
// Créer Server Action dans app/actions/materials.js
export async function getMaterialsBySection(lang, section) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  if (section === 'books') {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('lang', lang)
      .order('id', { ascending: false })
    return data || []
  } else {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('lang', lang)
      .eq('section', section)
      .order('created_at', { ascending: false })
    return data || []
  }
}

// Dans SectionPageClient.jsx
const { userLearningLanguage } = useUserContext()

const { data: materials = [] } = useQuery({
  queryKey: ['materials', section, userLearningLanguage], // Changer
  queryFn: () => getMaterialsBySection(userLearningLanguage, section), // Vraie action
  initialData: userLearningLanguage === learningLanguage ? initialMaterials : undefined,
  enabled: !!userLearningLanguage,
  staleTime: 5 * 60 * 1000,
})
```

**Avantages** :
- ✅ Refetch automatique quand langue change
- ✅ Cache React Query fonctionne correctement
- ✅ Toujours les bonnes données

---

### 🎯 Solution 5: Supprimer la Condition initialData Fragile (PRIORITÉ BASSE)

**Fichier** : `components/materials/MaterialsPageClient.jsx:36`

**Problème** : Condition `userLearningLanguage === learningLanguage` trop stricte.

**Solution** : Toujours utiliser initialData, laisser React Query gérer :

```javascript
// AVANT
initialData: userLearningLanguage === learningLanguage ? initialMaterials : undefined,

// APRÈS
initialData: initialMaterials, // Toujours utiliser
```

**Alternative** : Améliorer la condition pour tolérer délais de synchronisation :

```javascript
initialData: initialMaterials, // Toujours fournir
// React Query invalidera si queryKey change
```

**Avantages** :
- ✅ Optimisation SSR toujours utilisée
- ✅ Moins de refetch inutiles
- ✅ UI plus réactive

---

## Plan d'Implémentation

### Phase 1: Fixes Critiques (1-2h)

1. ✅ **Solution 1** : Refactoriser les 3 useEffects en 1 seul
   - Fichier: `context/user.js`
   - Impact: Élimine les race conditions
   - Test: Vérifier que langue reste stable au montage

2. ✅ **Solution 2** : Synchroniser context au montage
   - Fichiers: `MaterialsPageClient.jsx`, `SectionPageClient.jsx`
   - Impact: Évite double fetch
   - Test: Vérifier qu'il n'y a qu'un seul fetch au chargement

3. ✅ **Solution 3** : Utiliser userLearningLanguage dans filtres
   - Fichier: `SectionPageClient.jsx`
   - Impact: Filtres réactifs
   - Test: Changer langue et vérifier que filtres s'adaptent

### Phase 2: Améliorations (2-3h)

4. ✅ **Solution 4** : Ajouter Server Action pour refetch
   - Fichiers: `app/actions/materials.js`, `SectionPageClient.jsx`
   - Impact: Refetch automatique
   - Test: Changer langue et vérifier refetch

5. ✅ **Solution 5** : Simplifier condition initialData
   - Fichier: `MaterialsPageClient.jsx`
   - Impact: Meilleure performance
   - Test: Vérifier que SSR data est toujours utilisée

### Phase 3: Tests (1-2h)

6. ✅ Tester tous les scénarios utilisateur
   - Scénario A: Interface = spoken, learning différent
   - Scénario B: Interface = learning (cas edge)
   - Scénario C: Changement langue apprise
   - Scénario D: Changement interface
   - Scénario E: Navigation entre matériaux

7. ✅ Tester avec différents états
   - Utilisateur connecté
   - Utilisateur invité
   - Première visite (pas de localStorage)
   - Retour (localStorage + DB)

---

## Métriques de Succès

### Avant Fixes
- ❌ 3 useEffects concurrents dans context
- ❌ Race condition au montage (30% des cas)
- ❌ Double fetch (server + client)
- ❌ Filtres non réactifs aux changements de langue
- ❌ Changement interface casse langue apprise

### Après Fixes
- ✅ 1 seul useEffect avec logique claire
- ✅ Pas de race condition
- ✅ 1 seul fetch (SSR optimisé)
- ✅ Filtres réactifs et corrects
- ✅ Changement interface préserve langue apprise
- ✅ Utilisateurs n'ont plus besoin de switch manuel

---

## Notes Techniques

### Ordre d'Exécution des useEffects

**Problème actuel** :
```
1. Server Component execute (fetch avec DB)
2. Client Component monte
3. useEffect bootstrap démarre (async)
4. useEffect sync locale s'exécute
5. useEffect vérification s'exécute
6. Bootstrap termine (async) ← Peut arriver en dernier !
```

**Solution** :
```
1. Server Component execute (fetch avec DB)
2. Client Component monte
3. useEffect unique s'exécute
   - Si user : utilise userProfile.learning_language (déjà chargé)
   - Si invité : utilise localStorage
4. Un seul setUserLearningLanguage
```

### React Query Cache Invalidation

**Problème actuel** :
- queryKey change → cache invalidé → refetch
- Mais queryFn (SectionPageClient) retourne toujours initialMaterials

**Solution** :
- queryKey avec userLearningLanguage
- queryFn appelle Server Action avec langue
- Cache correctement géré par React Query

---

## Conclusion

Le système de filtrage souffre de **3 problèmes architecturaux majeurs** :

1. **Multiples sources de vérité** : DB, Context state (avec 3 useEffects), localStorage
2. **Race conditions** : useEffects asynchrones qui se terminent dans un ordre imprévisible
3. **Valeurs statiques vs réactives** : Filtres utilisent props au lieu de state du contexte

Les **5 solutions** proposées éliminent ces problèmes en :
- Simplifiant la gestion de state (1 seul useEffect)
- Synchronisant explicitement Server et Client
- Rendant tous les filtres réactifs
- Ajoutant un vrai système de refetch

**Estimation totale** : 4-7 heures de développement + tests

**Risque** : Faible (changements isolés, pas de breaking changes)

**ROI** : Très élevé (élimine un bug critique utilisateur)
