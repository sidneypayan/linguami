# Organisation des Hooks

**Date:** 17 novembre 2025

---

## 📂 Structure organisée

Les hooks ont été réorganisés par **fonctionnalité** plutôt qu'en vrac dans un seul dossier :

```
hooks/
├── shared/               # Hooks génériques réutilisables
│   ├── useClickOutside.js
│   └── useRouterCompat.js
├── gamification/         # Hooks pour gamification/XP
│   └── useAchievements.js
├── materials/            # Hooks pour materials
│   └── useMaterialFilters.js
└── translation/          # Hooks pour translation/dictionary
    ├── useGuestWordsCount.js
    └── useTranslationPosition.js
```

---

## 📋 Catalogue des hooks

### Hooks partagés (`hooks/shared/`)

**Hooks génériques réutilisables dans tout le projet**

#### `useClickOutside.js`
- **Utilité:** Détecte les clics en dehors d'un élément
- **Paramètres:** `(ref, handler)`
- **Utilisation:** Fermer modals, popups, menus déroulants
- **Exemple:**
  ```javascript
  import { useClickOutside } from '@/hooks/shared/useClickOutside'

  const ref = useRef()
  useClickOutside(ref, () => setIsOpen(false))
  ```

#### `useRouterCompat.js`
- **Utilité:** Hook compatible Pages Router ET App Router
- **Retourne:** `{ locale, push, replace, routerType }`
- **Utilisation:** Détection automatique du type de router
- **Exemple:**
  ```javascript
  import { useRouterCompat } from '@/hooks/shared/useRouterCompat'

  const { locale, push } = useRouterCompat()
  ```

---

### Hooks gamification (`hooks/gamification/`)

**Hooks pour le système d'XP, achievements, et gamification**

#### `useAchievements.js`
- **Utilité:** Gestion de la queue d'achievements
- **Retourne:** `{ showAchievement, showAchievements, currentAchievement, isOpen, handleClose }`
- **Fonctionnalités:**
  - File d'attente d'achievements
  - Affichage séquentiel
  - Délai entre chaque achievement (500ms)
- **Exemple:**
  ```javascript
  import useAchievements from '@/hooks/gamification/useAchievements'

  const { showAchievement } = useAchievements()
  showAchievement({ type: 'level_up', level: 5 })
  ```

---

### Hooks materials (`hooks/materials/`)

**Hooks pour la page materials et filtres**

#### `useMaterialFilters.js`
- **Utilité:** Gestion complète des filtres materials
- **Paramètres:** `(allMaterials, userMaterialsStatus, userLevel)`
- **Gère:**
  - Mode d'affichage (catégorie/liste)
  - Recherche par titre
  - Filtres: niveau, status, section
  - Vue (card/table)
  - Pagination
  - Persistance localStorage
- **Retourne:** State + handlers (14 propriétés)
- **Exemple:**
  ```javascript
  import { useMaterialFilters } from '@/hooks/materials/useMaterialFilters'

  const {
    displayMode,
    filteredMaterials,
    handleSearchChange,
    clearFilters
  } = useMaterialFilters(materials, status, 'intermediate')
  ```

---

### Hooks translation (`hooks/translation/`)

**Hooks pour le système de traduction et dictionnaire**

#### `useGuestWordsCount.js`
- **Utilité:** Gestion du compteur de mots pour invités
- **Paramètres:** `(isUserLoggedIn)`
- **Fonctionnalités:**
  - Synchronisation avec localStorage
  - Écoute des événements `guestWordAdded` / `guestWordDeleted`
  - Mise à jour automatique
- **Retourne:** `guestWordsCount` (number)
- **Exemple:**
  ```javascript
  import { useGuestWordsCount } from '@/hooks/translation/useGuestWordsCount'

  const guestWordsCount = useGuestWordsCount(isUserLoggedIn)
  const hasLimit = guestWordsCount >= 20
  ```

#### `useTranslationPosition.js`
- **Utilité:** Calcul intelligent de position pour popup translation
- **Paramètres:** `(coordinates, isOpen)`
- **Fonctionnalités:**
  - Gestion débordement viewport (horizontal + vertical)
  - Support responsive mobile/desktop
  - Padding automatique
  - Mémoïsé avec `useMemo`
- **Retourne:** `{ left: '10px', top: '20px' }`
- **Exemple:**
  ```javascript
  import { useTranslationPosition } from '@/hooks/translation/useTranslationPosition'

  const position = useTranslationPosition(coordinates, isTranslationOpen)
  <Paper sx={{ position: 'fixed', ...position }} />
  ```

---

## 🔄 Migrations effectuées

**Fichiers dont les imports ont été mis à jour:**

### Hooks shared
- ✅ `context/user.js` → `useRouterCompat`
- ✅ `components/method/MethodPageClient.jsx` → `useRouterCompat`
- ✅ `components/method/LevelPageClient.jsx` → `useRouterCompat`
- ✅ `components/method/LessonPageClient.jsx` → `useRouterCompat`
- ✅ `components/material/MaterialPageClient.jsx` → `useRouterCompat`
- ✅ `components/material/Translation.jsx` → `useClickOutside`
- ✅ `scripts/fix-user-context.js` → `useRouterCompat`

### Hooks gamification
- ✅ `components/AchievementProvider.jsx` → `useAchievements`

### Hooks materials
- ✅ `components/materials/MyMaterialsClient.jsx` → `useMaterialFilters`

### Hooks translation
- ✅ `components/material/Translation.jsx` → `useGuestWordsCount`, `useTranslationPosition`

**Total:** 11 fichiers migrés ✅

---

## ✅ Bénéfices

### Avant
```
hooks/
├── useClickOutside.js
├── useRouterCompat.js
├── useAchievements.js
├── useMaterialFilters.js
├── useGuestWordsCount.js
└── useTranslationPosition.js
```
❌ Difficile de trouver les hooks
❌ Pas de séparation par domaine
❌ Pas évident quels hooks sont réutilisables

### Après
```
hooks/
├── shared/              # → Hooks réutilisables partout
├── gamification/        # → Hooks pour XP/achievements
├── materials/           # → Hooks pour materials
└── translation/         # → Hooks pour traduction
```
✅ Organisation claire par fonctionnalité
✅ Facile de trouver les hooks pertinents
✅ Réutilisabilité évidente (dossier `shared/`)
✅ Scalable pour ajouter de nouveaux hooks

---

## 📝 Bonnes pratiques

### Où créer un nouveau hook ?

**1. Hook générique réutilisable ?** → `hooks/shared/`
- Exemples: `useDebounce`, `useLocalStorage`, `useMediaQuery`

**2. Hook spécifique à une feature ?** → `hooks/{feature}/`
- Exemples: `hooks/courses/useCoursesFilters`, `hooks/flashcards/useSRSAlgorithm`

**3. Créer un nouveau dossier ?**
- Quand on a 2+ hooks pour une nouvelle feature
- Exemples futurs: `hooks/courses/`, `hooks/flashcards/`

### Naming conventions
- ✅ `useNomDescriptif` - toujours commencer par `use`
- ✅ Nom clair et auto-descriptif
- ✅ Verbe d'action si applicable: `useClickOutside`, `useMaterialFilters`

---

## 🎯 Prochaines étapes (si nouvelles features)

Quand on crée de nouveaux hooks, suivre cette structure :

```
hooks/
├── shared/              # Hooks génériques
├── gamification/        # XP, achievements
├── materials/           # Materials
├── translation/         # Translation, dictionary
├── courses/             # 🆕 Hooks pour courses/method
├── flashcards/          # 🆕 Hooks pour SRS flashcards
└── auth/                # 🆕 Hooks pour authentification
```

---

**Conclusion:** Les hooks sont maintenant bien organisés et faciles à maintenir ! 🎉
