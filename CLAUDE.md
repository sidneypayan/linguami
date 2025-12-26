# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 📋 Table des matières

1. [🚨 Règles Critiques](#-règles-critiques)
2. [🚀 Quick Start](#-quick-start)
3. [⚠️ Systèmes Critiques](#️-systèmes-critiques)
4. [📚 Documentation](#-documentation)
5. [💻 Development Patterns](#-development-patterns)
6. [🎨 Styling](#-styling)
7. [🔧 Troubleshooting](#-troubleshooting)

---

# 🚨 Règles Critiques

## ⛔ Git & Commits : Règles Absolues

### Workflow complet : Test PUIS Commit

**RÈGLES :**
1. ✅ Faire les modifications de code et expliquer les changements
2. ✅ **ATTENDRE** que l'utilisateur teste et valide
3. ✅ Seulement APRÈS validation → procéder au commit
4. ✅ Toujours commiter **100% des fichiers modifiés** (pas de sélection partielle)

**PROCÉDURE DE COMMIT :**

```bash
# 1. Voir TOUS les fichiers modifiés
git status

# 2. Montrer la liste à l'utilisateur et demander confirmation
"Voici tous les fichiers modifiés :
- app/actions/materials.js
- components/MaterialsCard.jsx
- scripts/create-lesson.js

Je vais TOUS les inclure dans le commit. Confirmes-tu ?"

# 3. Ajouter TOUS les fichiers
git add fichier1 fichier2 fichier3 ...

# 4. Vérifier qu'il ne reste RIEN
git status  # DOIT afficher "nothing to commit" ou tous les fichiers en vert

# 5. Commiter
git commit -m "feat: description

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**🎯 OBJECTIF : `git status` → "nothing to commit, working tree clean"**

**💀 ERREUR CATASTROPHIQUE À ÉVITER :**
Commiter seulement `scripts/create-lesson.js` mais oublier `components/lessons/Lesson.jsx` et `app/actions/lessons.js` → Les leçons existent en DB mais ne s'affichent pas.

### Gestion des branches

**RÈGLE ABSOLUE :** Ne JAMAIS push d'autres branches que `develop` et `main`.

- La branche `claude` reste **uniquement en local**
- **SEULES** `develop` et `main` peuvent être pushées vers GitHub
- Ne JAMAIS créer ou pusher de branches temporaires (feature/*, fix/*, etc.)

**Workflow correct :**
1. Travailler sur `claude` en local
2. Quand l'utilisateur demande de pusher :
   - Créer le commit sur `claude`
   - Merger `claude` → `develop` localement
   - Push `develop`
   - Merger `develop` → `main` localement
   - Push `main`

---

# 🚀 Quick Start

## Tech Stack

**Framework & Language:**
- Next.js 15.5 (App Router only)
- React 19.0
- TypeScript (partiel, migration en cours)

**UI & Styling:**
- TailwindCSS 3.4
- Radix UI (composants primitifs)
- Lucide Icons
- shadcn/ui pattern

**State & Data:**
- React Context (user, theme)
- React Query (@tanstack/react-query)
- Server Actions (no API routes except webhooks)

**Database & Auth:**
- Supabase (PostgreSQL + Auth)
- Supabase SSR (@supabase/ssr)

**i18n:**
- next-intl 4.5
- Translation files in `messages/`
- Supported locales: fr, ru, en

**Storage:**
- Cloudflare R2 (images, audio, video)

## Run Locally

```bash
npm run dev          # Start dev server with Turbopack (http://localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
```

## 🗄️ Database Configuration

**IMPORTANT:** Le projet utilise **UNIQUEMENT la base de données de PRODUCTION**.

- Tous les scripts et composants utilisent la DB de production
- Credentials dans `.env.local`
- Ne JAMAIS chercher ou créer de tables en local
- Ne jamais lancer de build entre les modifications

---

# ⚠️ Systèmes Critiques

## 1. Three-Language System

⚠️ **CRITICAL:** Linguami uses THREE distinct language concepts - do NOT confuse them:

### 1. Interface Language (`locale`)
- Language of the UI/menus/buttons
- Values: `fr`, `ru`, `en`
- Access: `const locale = useLocale()` (next-intl)
- Set via URL: `/fr/materials`, `/en/materials`, `/ru/materials`

### 2. Learning Language (`userLearningLanguage`)
- Language the user is STUDYING (target language)
- Values: `fr`, `ru`
- Access: `const { userLearningLanguage } = useUserContext()`
- **Used for:** Filtering materials and courses

### 3. Spoken Language (`spoken_language`)
- User's NATIVE language (for explanations in lessons)
- Values: `fr`, `ru`, `en`
- Access: `const spokenLang = userProfile?.spoken_language || locale`
- **Used for:** Selecting lesson content blocks (`blocks_fr`, `blocks_en`, `blocks_ru`)

**Example scenario:**
- French speaker learning Russian with English interface
- Interface: `en` (menus in English)
- Learning: `ru` (studying Russian materials)
- Spoken: `fr` (lesson explanations in French)

## 2. Two Lesson Systems

Linguami has **TWO DISTINCT lesson systems** - do NOT confuse them:

### Method Lessons (Structured Courses)
- **Table:** `course_lessons`
- **Purpose:** Structured courses (A1, A2, etc.) with progression tracking
- **Features:** Multilingual blocks (blocks_fr, blocks_en, blocks_ru), exercises, XP rewards, audio
- **URL:** `/method/beginner/lesson-slug`
- **Documentation:** `docs/method/LESSON_CREATION_GUIDE.md`

### Standalone Lessons (Site Content)
- **Table:** `lessons`
- **Purpose:** Independent tutorials/articles/grammar explanations
- **Features:** Simpler structure, no multilingual blocks system
- **URL:** `/lessons`

**When querying lessons:**
- For method courses → Use `course_lessons` table
- For standalone content → Use `lessons` table

## 3. Data Fetching Pattern (App Router)

**ALWAYS use Server Actions + React Query. NEVER create API routes (except webhooks).**

### ✅ Correct Pattern

**1. Create Server Action** in `app/actions/myFeature.js`:
```javascript
'use server'
import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function getData(lang) {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('table')
    .select('*')
    .eq('lang', lang)

  if (error) throw error
  return data
}
```

**2. Use with React Query** in Client Component:
```javascript
'use client'
import { useQuery } from '@tanstack/react-query'
import { getData } from '@/app/actions/myFeature'

export default function MyComponent() {
  const { userLearningLanguage } = useUserContext()

  const { data, isLoading } = useQuery({
    queryKey: ['myData', userLearningLanguage],
    queryFn: () => getData(userLearningLanguage)
  })

  if (isLoading) return <div>Loading...</div>
  return <div>{data}</div>
}
```

### ❌ DON'T DO THIS

- ❌ Creating `app/api/*` routes (except webhooks like Stripe)
- ❌ Using `window.location.reload()` to refresh data
- ❌ Using Redux or other state management for server data

---

# 📚 Documentation

All detailed documentation is in the `docs/` folder. **Always consult the appropriate guide before working on a feature.**

## Architecture

- **[Database Architecture](docs/architecture/database.md)** - Tables, schemas, RLS policies, common queries
- **[State Management](docs/architecture/state-management.md)** - React Context, React Query, localStorage
- **[Authentication](docs/architecture/authentication.md)** - Login, OAuth, user profiles, protected routes
- **[i18n System](docs/architecture/i18n.md)** - next-intl, three-language concept, multilingual content

## Creation Guides

**⚠️ MUST READ before creating content:**

- **[Lesson Creation Guide](docs/method/LESSON_CREATION_GUIDE.md)** - Creating lessons, translations, audio workflow
- **[Lesson Template](docs/method/LESSON_TEMPLATE.json)** - Complete JSON template
- **[Lesson Blocks Reference](docs/method/LESSON_BLOCKS_REFERENCE.md)** - All block types with schemas
- **[Audio Generation](docs/method/AUDIO_GENERATION.md)** - Voice IDs, voice mapping, dialogue audio
- **[Exercise Creation Guide](docs/exercises/CREATION_GUIDE.md)** - 3 exercise types, field naming, validation

## Quick Reference

**I want to...**
- Understand database tables → [Database Architecture](docs/architecture/database.md)
- Add React Context/Query → [State Management](docs/architecture/state-management.md)
- Implement login → [Authentication](docs/architecture/authentication.md)
- Add translations → [i18n System](docs/architecture/i18n.md)
- Create exercises → [Exercise Creation Guide](docs/exercises/CREATION_GUIDE.md)
- Create lessons → [Lesson Creation Guide](docs/method/LESSON_CREATION_GUIDE.md)
- Generate audio → [Audio Generation](docs/method/AUDIO_GENERATION.md)

---

# 💻 Development Patterns

## Project Structure

```
linguami/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Localized routes (fr, ru, en)
│   ├── actions/           # Server Actions (NO API routes)
│   ├── api/               # Only webhooks (Stripe, etc.)
│   └── providers.js       # React Query, etc.
├── components/            # React components
│   ├── layouts/          # Navbar, Footer, BottomNav
│   └── ui/               # Reusable UI components
├── context/              # React Context (user, theme)
├── hooks/                # Custom React hooks
├── lib/                  # Third-party clients (Supabase, R2)
├── messages/             # i18n translation files (next-intl)
│   ├── fr.json
│   ├── ru.json
│   └── en.json
├── i18n/                 # next-intl configuration
├── public/               # Static assets
├── scripts/              # Utility scripts
├── supabase/
│   └── migrations/       # Database migrations
├── docs/                 # Documentation
│   ├── architecture/
│   ├── method/
│   └── exercises/
└── utils/                # Utility functions
```

## Adding a New Feature

1. **Plan data model** → See [Database Architecture](docs/architecture/database.md)
2. **Create Server Actions** in `app/actions/` → See [Data Fetching Pattern](#3-data-fetching-pattern-app-router)
3. **Use React Query** for client-side data fetching
4. **Create components** with Tailwind + Radix UI
5. **Add translations** to `messages/{fr,ru,en}.json`

## Creating Content

**Lessons:**
1. Read [Lesson Creation Guide](docs/method/LESSON_CREATION_GUIDE.md) first
2. Create text content (Phase 1: NO audio)
3. Get user validation
4. Generate audio (Phase 2: AFTER validation)

**Exercises:**
1. Read [Exercise Creation Guide](docs/exercises/CREATION_GUIDE.md) first
2. Choose one of 3 supported types (MCQ, Fill-in-blank, Drag-and-drop)
3. Use automated scripts (`scripts/create-*.js`)
4. Validate all fields before insertion

## Component Pattern

```javascript
'use client'
import { useQuery } from '@tanstack/react-query'
import { useUserContext } from '@/context/user'
import { useTranslations } from 'next-intl'
import { getData } from '@/app/actions/myFeature'

export default function MyComponent() {
  const t = useTranslations('common')
  const { isUserLoggedIn, userProfile } = useUserContext()
  const { userLearningLanguage } = useUserContext()

  const { data, isLoading } = useQuery({
    queryKey: ['myData', userLearningLanguage],
    queryFn: () => getData(userLearningLanguage)
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="p-4 bg-background">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      {/* ... */}
    </div>
  )
}
```

## Protected Route Pattern

```javascript
'use client'
import { useUserContext } from '@/context/user'
import { redirect } from 'next/navigation'

export default function ProtectedPage() {
  const { isUserLoggedIn, isUserAdmin } = useUserContext()

  if (!isUserLoggedIn) {
    redirect('/login')
  }

  if (!isUserAdmin) {
    return <div>Access denied</div>
  }

  return <div>Protected content</div>
}
```

---

# 🎨 Styling

## TailwindCSS (Preferred)

The project uses **TailwindCSS** for all styling. Use utility classes:

```jsx
<div className="flex gap-4 p-4 md:p-8 bg-background hover:opacity-80">
  <h1 className="text-2xl font-bold text-foreground">Title</h1>
</div>
```

## Responsive Breakpoints

```javascript
// Tailwind breakpoints
sm: '640px'   // Tablet
md: '768px'   // Small desktop
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large

// Usage
<div className="p-2 md:p-4 lg:p-8">
```

## Radix UI Components

Use Radix UI primitives for complex components:

```jsx
import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import * as Switch from '@radix-ui/react-switch'
```

See `components/ui/` for pre-built shadcn-style components.

## CSS Variables (Theme)

Theme colors are defined as CSS variables in Tailwind config:

```css
/* Use in Tailwind */
bg-background
bg-foreground
bg-primary
bg-secondary
bg-muted
bg-accent
```

---

# 🔧 Troubleshooting

## Build Errors

```bash
rm -rf .next node_modules
npm install
npm run build
```

## Database Issues

Check RLS policies if queries fail for authenticated users.

## Translation Missing

1. Add key to all 3 files: `messages/fr.json`, `messages/en.json`, `messages/ru.json`
2. Restart dev server
3. Use `t('key')` in components with `useTranslations()`

## JSX Text Content Rules

**CRITICAL: Never use typographic apostrophes (') in JSX**

```javascript
// ❌ WRONG - Typographic apostrophe causes build errors
<div>Débloquez l'accès complet</div>

// ✅ CORRECT - Straight apostrophe
<div>Débloquez l'accès complet</div>

// ✅ BEST - Use i18n
<div>{t('unlock_full_access')}</div>
```

**Why:** React's ESLint rule `react/no-unescaped-entities` flags typographic apostrophes (') as errors.

**Solution:** Always use i18n. Add translations to `messages/{fr,ru,en}.json`.

---

## Environment Variables

Required in `.env.local`:

```bash
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudflare R2 (File Storage)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
NEXT_PUBLIC_R2_PUBLIC_URL=

# APIs
ELEVENLABS_API_KEY=
RESEND_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Analytics
NEXT_PUBLIC_GTM_ID=
```

---

## Important Notes

### Guest User Support

Non-authenticated users get:
- Learning language stored in localStorage
- Course progress in localStorage (migrated on login)
- Dictionary in localStorage (migrated on login)

See [Authentication](docs/architecture/authentication.md) for details.

### File Storage

All media files stored in **Cloudflare R2**:
- Images: `images/ui/`, `images/materials/`, `images/blog/`
- Audio: `audio/fr/`, `audio/ru/`, `audio/en/`
- Video: `video/materials/`

Public URL: `NEXT_PUBLIC_R2_PUBLIC_URL`

### Middleware

`middleware.js` runs on every request to:
- Handle next-intl locale routing
- Refresh Supabase session tokens (required for Supabase SSR)

---

**Remember:** This is just an index. All detailed documentation is in the `docs/` folder. Always consult the appropriate guide before working on a feature.
