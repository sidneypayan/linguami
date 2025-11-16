# Migration Next.js 15 & Modernisation Architecture

Ce document trace l'historique de la migration vers Next.js 15 (App Router) et les modernisations à venir.

---

## ✅ Migrations Complétées

### 1. Next.js 15 App Router (Décembre 2024)

**Status :** ✅ **TERMINÉ**

#### Pages migrées vers Server Components + Metadata API

Toutes les pages de l'application ont été migrées de `next/head` vers l'API Metadata de Next.js 15 :

**Pages publiques (SEO complet) :**
- ✅ `/` (Homepage) - Avec JSON-LD structured data
- ✅ `/lessons` - Metadata dynamique basée sur `searchParams.slug`
- ✅ `/premium` - Avec JSON-LD Product/Offer schema
- ✅ `/teacher` - SEO complet (OpenGraph, Twitter, hreflang)
- ✅ `/materials` - Avec JSON-LD ItemList
- ✅ `/materials/[section]` - Metadata dynamique par section
- ✅ `/materials/[section]/[material]` - Fetch Supabase pour metadata
- ✅ `/method` - Page principale méthode
- ✅ `/method/[level]` - Pages par niveau (A1, A2, etc.)
- ✅ `/method/[level]/[lessonSlug]` - Pages de leçons
- ✅ `/blog` - Blog principal et articles

**Pages privées (robots noindex) :**
- ✅ `/dictionary` - Page personnelle utilisateur
- ✅ `/statistics` - Statistiques personnelles
- ✅ `/my-materials` - Matériaux sauvegardés
- ✅ `/settings` - Paramètres utilisateur

#### Client Components créés

Pour respecter la séparation Server/Client :

```
components/
├── homepage/index.js          # Client Component (interactivité)
├── lessons/LessonsPageClient.jsx
├── materials/
│   ├── MaterialsPageClient.jsx
│   ├── SectionPageClient.jsx
│   └── MyMaterialsClient.jsx
├── material/MaterialPageClient.jsx
├── teacher/TeacherClient.jsx
├── premium/PremiumClient.jsx
└── method/
    ├── MethodPageClient.jsx
    ├── LevelPageClient.jsx
    └── LessonPageClient.jsx
```

#### Amélioration : Persistance des filtres

Implémenté dans `MaterialsPageClient.jsx` et `SectionPageClient.jsx` :

**Comportement pour invités :**
- Pas de filtres par défaut
- Affiche tous les matériaux
- Filtres sauvegardés dans localStorage

**Comportement pour utilisateurs authentifiés :**
- Filtres par défaut : niveau utilisateur + "non étudiés"
- Persistance via localStorage avec clés spécifiques par section
- Restauration automatique lors du retour sur la page
- Détection de navigation via `usePathname` et `useRef`

**Implémentation :**
```javascript
// Clés localStorage spécifiques
const storageKey = `materials_section_${section}_filters`

// Sauvegarde automatique
localStorage.setItem(storageKey, JSON.stringify({
  level: selectedLevel,
  status: selectedStatus,
  search: searchTerm
}))

// Restauration lors du retour
const isReturningFromMaterial =
  prevPath.includes(`/materials/${section}/`) &&
  pathname.includes(`/materials/${section}`) &&
  !pathname.includes(`/materials/${section}/`)
```

#### Nettoyage

- ✅ Suppression du composant `components/SEO.jsx` (obsolète)
- ✅ Suppression des logs de debug (console.log avec emojis)
- ✅ Fix des imports relatifs → alias `@/data/sections`

#### Commits

```
a15b866 - refactor: migrate all pages to Next.js 15 Metadata API
8b4a76b - fix: correct import paths for data/sections
```

**Impact :**
- **-2,291 lignes** de code (séparation Server/Client plus propre)
- Plus aucun warning `next/head` dans la console
- SEO amélioré (OpenGraph, Twitter Cards, hreflang alternates)
- Performance : données chargées côté serveur quand possible

---

### 2. next-intl Migration

**Status :** ✅ **TERMINÉ**

- Migration complète de `next-translate` → `next-intl`
- `next-translate` supprimé du package.json
- 118 occurrences de `next-intl` dans 107 fichiers
- Middleware intégré avec `createMiddleware(routing)`

---

### 3. Supabase SSR

**Status :** ✅ **TERMINÉ**

- Package `@supabase/ssr` installé et configuré
- Middleware utilise `createServerClient` pour refresh des sessions
- Compatible avec Server Components

---

### 4. React 19 & Next.js 15.5

**Status :** ✅ **TERMINÉ**

**Versions actuelles :**
```json
"next": "^15.5.0",
"react": "^19.0.0",
"react-dom": "^19.0.0"
```

---

## 🔄 Modernisations Restantes

### Priorité 🔴 HAUTE

#### 1. Migration Redux → Server Components + Server Actions

**Problème actuel :**
- 86 occurrences de Redux (useSelector/useDispatch) dans 30 fichiers
- Redux conçu pour SPAs, pas optimal pour Server Components
- Fetch côté client = mauvais pour SEO et performance

**Solution recommandée :**

**Phase 1 : Identifier les slices "data-only"**
```
features/
├── materials/materialsSlice.js  → Server Component
├── courses/coursesSlice.js      → Server Component
├── words/wordsSlice.js          → Server Component
├── cards/cardsSlice.js          → Garder (état UI complexe)
└── exercises/                   → Garder (état UI)
```

**Phase 2 : Pattern de migration**

**AVANT (Redux Client-side) :**
```javascript
// components/materials/MaterialsPageClient.jsx
const materials = useSelector(state => state.materials.data)
const dispatch = useDispatch()

useEffect(() => {
  dispatch(getMaterials({ userLearningLanguage, section }))
}, [userLearningLanguage, section])
```

**APRÈS (Server Component) :**
```javascript
// app/[locale]/materials/[section]/page.js
import { createClient } from '@/lib/supabase-server'

export default async function SectionPage({ params }) {
  const { locale, section } = await params
  const supabase = createClient()

  // Fetch côté serveur
  const { data: materials } = await supabase
    .from('materials')
    .select('*')
    .eq('section', section)

  return <SectionPageClient materials={materials} />
}

// components/materials/SectionPageClient.jsx
'use client'
export default function SectionPageClient({ materials }) {
  // Juste filtrage local et UI
  const [filteredMaterials, setFilteredMaterials] = useState(materials)
  // ...
}
```

**Phase 3 : Mutations avec Server Actions**

**AVANT (API Route + Redux) :**
```javascript
// pages/api/words/index.js
export default async function handler(req, res) {
  const { data } = await supabase.from('words').insert(req.body)
  res.json(data)
}

// Client
const response = await fetch('/api/words', { method: 'POST', body })
dispatch(addWord(response.data))
```

**APRÈS (Server Action) :**
```javascript
// app/actions/words.js
'use server'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function addWord(formData) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('words')
    .insert({
      word: formData.get('word'),
      translation: formData.get('translation')
    })

  if (error) throw error

  revalidatePath('/dictionary')
  return data
}

// Client Component
import { addWord } from '@/app/actions/words'

function AddWordForm() {
  return (
    <form action={addWord}>
      <input name="word" />
      <input name="translation" />
      <button type="submit">Add</button>
    </form>
  )
}
```

**Slices à migrer par ordre de priorité :**

1. **materialsSlice** (PRIORITÉ 1)
   - Simple fetch de données
   - Actuellement fetch côté client
   - Impact visible sur performance

2. **coursesSlice** (PRIORITÉ 2)
   - Fetch de leçons et progression
   - Pourrait bénéficier du SSR

3. **wordsSlice** (PRIORITÉ 3)
   - Dictionnaire personnel
   - Mutations fréquentes → Server Actions

**À GARDER en Redux :**
- `cardsSlice` - Gestion de l'état des flashcards (UI complexe)
- `exercisesSlice` - État des exercices en cours (UI)
- Préférences UI (thème, etc.) - À migrer vers Context ou localStorage

**Effort estimé :** 4-6 semaines

---

#### 2. Migration API Routes → Server Actions / Route Handlers

**État actuel :** 17 fichiers dans `pages/api/`

**Catégorisation :**

**🔥 HAUTE PRIORITÉ - Migrer vers Server Actions :**
```
pages/api/
├── words/          → Server Actions (CRUD simple)
├── courses/        → Server Actions (fetch + mutations)
├── materials/      → Server Actions
├── exercises/      → Server Actions
└── xp/             → Server Actions (mutations XP)
```

**🟡 MOYENNE PRIORITÉ - Migrer vers Route Handlers :**
```
pages/api/
├── auth/           → Route Handlers (OAuth callbacks)
│   ├── callback/
│   └── verify-email/
└── translations/   → Route Handlers (API externe Yandex)
```

**🟢 BASSE PRIORITÉ - Garder en Route Handlers :**
```
pages/api/
├── upload-r2.js        → Route Handler (upload fichiers)
└── verify-turnstile.js → Route Handler (webhook Cloudflare)
```

**Pattern de migration :**

**API Route (legacy) :**
```javascript
// pages/api/words/index.js
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data } = await supabase.from('words').select('*')
    return res.json(data)
  }
  if (req.method === 'POST') {
    const { data } = await supabase.from('words').insert(req.body)
    return res.json(data)
  }
}
```

**Server Actions (moderne) :**
```javascript
// app/actions/words.js
'use server'
import { createClient } from '@/lib/supabase-server'

export async function getWords() {
  const supabase = createClient()
  const { data } = await supabase.from('words').select('*')
  return data
}

export async function createWord(formData) {
  const supabase = createClient()
  const { data } = await supabase.from('words').insert({
    word: formData.get('word')
  })
  return data
}
```

**Avantages :**
- ✅ Pas besoin de routes API séparées
- ✅ Type-safe avec TypeScript (futur)
- ✅ Intégration native avec React 19 (useFormState, useFormStatus)
- ✅ Revalidation automatique avec `revalidatePath()`

**Effort estimé :** 2-3 semaines

---

### Priorité 🟠 MOYENNE

#### 3. Optimisation du Context API

**Problème actuel :**
- `UserContext` charge toutes les données utilisateur côté client
- Fetch dans useEffect → mauvais pour SEO

**Solution :**

**AVANT (Client Context) :**
```javascript
// context/user.js
const UserContext = createContext()

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    fetchUserProfile().then(setUserProfile)
  }, [])

  return <UserContext.Provider value={{ userProfile }}>
}
```

**APRÈS (Server Component) :**
```javascript
// app/[locale]/layout.js
import { createClient } from '@/lib/supabase-server'

export default async function RootLayout({ children, params }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    profile = data
  }

  return (
    <html>
      <body>
        <UserProvider initialProfile={profile}>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}

// context/user.js (simplifié)
'use client'
export function UserProvider({ children, initialProfile }) {
  const [profile, setProfile] = useState(initialProfile)
  // Juste gestion locale, pas de fetch
}
```

**À garder en Context :**
- Thème (dark/light mode)
- Langue d'interface
- Préférences UI

**Effort estimé :** 1-2 semaines

---

#### 4. Upgrade Material-UI

**État actuel :** MUI 5.16.7

**Options :**

**Option A : Upgrade vers MUI 6**
- ✅ Continuité
- ✅ Composants déjà maîtrisés
- ❌ Bundle size toujours lourd

**Option B : Migration vers Tailwind + shadcn/ui**
- ✅ Bundle size réduit
- ✅ Plus moderne
- ✅ Mieux intégré avec Server Components
- ❌ Refonte complète de l'UI

**Recommandation :** Garder MUI pour l'instant (refonte UI = projet à part entière)

**Effort estimé :**
- MUI 6 : 1 semaine
- Tailwind : 8-12 semaines (refonte complète)

---

### Priorité 🟢 BASSE

#### 5. TypeScript

**État actuel :** JavaScript pur

**Avantages de TypeScript :**
- Type safety
- Meilleure DX (autocomplétion)
- Moins de bugs en production
- Mieux intégré avec Server Actions

**Recommandation :**
- Adopter TypeScript pour **nouveaux fichiers uniquement**
- Ne PAS migrer l'existant (trop d'effort)
- Activer `allowJs: true` dans tsconfig.json

**Effort estimé :**
- Setup : 1 jour
- Migration complète : 6-8 semaines (NON RECOMMANDÉ)

---

#### 6. Optimisation Middleware

**Amélioration possible :**

**AVANT (code dupliqué) :**
```javascript
export async function middleware(request) {
  if (isApiRoute || isStaticFile) {
    const supabase = createServerClient(...) // Duplication
    await supabase.auth.getUser()
  }

  const supabase = createServerClient(...) // Duplication
  await supabase.auth.getUser()
}
```

**APRÈS (factorisation) :**
```javascript
function createSupabaseClient(request, response) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => response.cookies.set({ name, value, ...options }),
        remove: (name, options) => response.cookies.set({ name, value: '', ...options, maxAge: 0 })
      }
    }
  )
}

export async function middleware(request) {
  const response = isApiRoute || isStaticFile
    ? NextResponse.next()
    : intlMiddleware(request)

  const supabase = createSupabaseClient(request, response)
  await supabase.auth.getUser()

  return response
}
```

**Effort estimé :** 1 heure

---

## 📋 Roadmap Recommandée

### Phase 1 : Data Fetching (4-6 semaines) ⏳ PROCHAIN

**Objectif :** Éliminer Redux pour les données

1. **Semaine 1-2 : materialsSlice**
   - Migrer fetch vers Server Component
   - Créer Server Actions pour mutations
   - Tester performance

2. **Semaine 3-4 : coursesSlice**
   - Migrer leçons vers Server Component
   - Progression → Server Actions

3. **Semaine 5-6 : wordsSlice**
   - Dictionnaire → Server Component
   - CRUD → Server Actions

**Résultat attendu :** -60% de Redux, +40% performance SSR

---

### Phase 2 : API Routes (2-3 semaines)

**Objectif :** Remplacer API Routes legacy

1. **Semaine 1 : CRUD simple**
   - `/api/words` → Server Actions
   - `/api/materials` → Server Actions

2. **Semaine 2 : OAuth**
   - `/api/auth/callback` → Route Handlers

3. **Semaine 3 : Nettoyage**
   - Supprimer routes migrées
   - Tests de régression

---

### Phase 3 : Context Optimization (1-2 semaines)

**Objectif :** Optimiser UserContext

1. **Semaine 1 : Fetch server-side**
   - Layout.js fetch user profile
   - Passer via props au Context

2. **Semaine 2 : Simplification**
   - Supprimer fetch côté client
   - Garder uniquement état UI

---

## 🎯 Quick Win Immédiat

**Migration de materialsSlice → Server Component**

**Pourquoi commencer par là ?**
- ✅ Fetch simple (pas de logique complexe)
- ✅ Impact visible sur performance
- ✅ Pas de mutations complexes
- ✅ Bon apprentissage du pattern

**Étapes :**

1. **Créer Server Component**
```javascript
// app/[locale]/materials/page.js
async function MaterialsPage({ params }) {
  const { locale } = await params
  const supabase = createClient()

  const { data: sections } = await supabase
    .from('materials')
    .select('section')
    .distinct()

  return <MaterialsPageClient sections={sections} />
}
```

2. **Simplifier Client Component**
```javascript
// components/materials/MaterialsPageClient.jsx
'use client'
export default function MaterialsPageClient({ sections }) {
  // Plus de useSelector, plus de dispatch
  // Juste filtrage et UI
}
```

3. **Supprimer Redux slice**
```javascript
// features/materials/materialsSlice.js
// → SUPPRIMER (ou garder juste pour legacy)
```

**Temps estimé :** 1-2 jours
**Gain :** -30% de code Redux, +20% performance

---

## 📊 Métriques de Succès

### Avant Migration (Baseline)

- **Bundle size client :** ~450KB (gzip)
- **Redux slices actifs :** 8
- **API Routes :** 17
- **Time to Interactive (TTI) :** ~3.2s
- **First Contentful Paint (FCP) :** ~1.8s

### Après Phase 1 (Data Fetching)

**Objectifs :**
- Bundle size : -25% → ~340KB
- Redux slices : 3 (UI uniquement)
- TTI : -30% → ~2.2s
- FCP : -20% → ~1.4s

### Après Phase 2 (API Routes)

**Objectifs :**
- API Routes : 3 (webhooks uniquement)
- Server Actions : 15+
- Latence mutations : -40%

### Après Phase 3 (Context)

**Objectifs :**
- Client-side fetches : 0 (sauf mutations)
- SSR coverage : 100%

---

## 🔧 Outils & Ressources

### Documentation officielle

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Exemples de migration

- [Next.js Examples - App Router](https://github.com/vercel/next.js/tree/canary/examples)
- [Supabase + Next.js 15](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)

---

## 📝 Notes de Migration

### Commits clés

```
a15b866 - refactor: migrate all pages to Next.js 15 Metadata API
8b4a76b - fix: correct import paths for data/sections
```

### Décisions techniques

1. **Pourquoi Server Components partout ?**
   - SEO optimal (metadata côté serveur)
   - Performance (moins de JS client)
   - Simplicité (pas de useEffect pour fetch)

2. **Pourquoi garder certains Redux slices ?**
   - État UI complexe (flashcards, exercises)
   - Pas de bénéfice à migrer vers Server

3. **Pourquoi Server Actions > API Routes ?**
   - Moins de code (pas de routes séparées)
   - Type-safe
   - Intégration native React 19

---

## 🚀 Pour Commencer

**Prochaine étape recommandée :** Migration de `materialsSlice`

**Commande :**
```bash
# Créer une branche pour la migration
git checkout -b feat/migrate-materials-to-server-components

# Lancer le dev server
npm run dev

# Commencer par app/[locale]/materials/page.js
```

**Besoin d'aide ?** Consulter les exemples dans ce document ou la [documentation Next.js 15](https://nextjs.org/docs).
