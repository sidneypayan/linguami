# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

**Tech Stack:** Next.js 13.4, React 18.2, Material-UI 5.10, Redux Toolkit, Supabase, next-translate

**Run locally:**
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
```


## ⚠️ Important Rules

### JAMAIS de commit avant test

**RÈGLE ABSOLUE :** Ne JAMAIS commiter de changements avant que l'utilisateur les ait testés et validés.

**Workflow correct :**
1. Faire les modifications de code
2. Expliquer les changements à l'utilisateur
3. **ATTENDRE** que l'utilisateur teste
4. **ATTENDRE** la confirmation explicite de l'utilisateur
5. Seulement APRÈS validation → commit

**❌ Ne PAS faire :**
- Commit automatique après modifications
- Proposer de commiter sans test préalable
- Supposer que le code fonctionne sans validation

**✅ Faire :**
- Expliquer les changements
- Inviter l'utilisateur à tester
- Attendre confirmation explicite
- Demander si l'utilisateur veut commiter

---


cat /tmp/rules_section.txt

## Documentation Structure

All detailed documentation has been modularized. **Always consult the appropriate guide before working on a feature.**

### 📐 Architecture

Core system architecture and patterns:

- **[Database Architecture](docs/architecture/database.md)** - Tables, schemas, RLS policies, common queries
- **[State Management](docs/architecture/state-management.md)** - Redux slices, Context providers, localStorage
- **[Authentication](docs/architecture/authentication.md)** - Login, OAuth, user profiles, protected routes
- **[i18n System](docs/architecture/i18n.md)** - Translation system, three-language concept, multilingual content

### 🎯 Features

Detailed feature documentation:

- **[Interactive Exercises](docs/features/exercises.md)** - MCQ, Fill-in-blank, Drag-and-drop, XP rewards
- **[Method Courses](docs/features/method-courses.md)** - Structured lessons, block system, progression tracking
- **[SRS Flashcards](docs/features/srs-flashcards.md)** - Spaced repetition algorithm, card states, review flow
- **[XP & Gamification](docs/features/xp-gamification.md)** - Leveling, streaks, leaderboard, achievements

### 📚 Creation Guides

**⚠️ MUST READ before creating content:**

- **[Lesson Creation Guide](docs/guides/LESSON_CREATION_GUIDE.md)** - Rules for creating course lessons, translations, audio workflow
- **[Exercise Creation Guide](docs/guides/EXERCISE_CREATION_GUIDE.md)** - 3 exercise types, field naming, validation
- **[Course Blocks Structure](docs/guides/COURSE_BLOCKS_STRUCTURE.md)** - All block types with schemas

## Three-Language System

⚠️ **CRITICAL:** Linguami uses THREE distinct language concepts - do NOT confuse them:

### 1. Interface Language (`router.locale`)
- Language of the UI/menus/buttons
- Values: `fr`, `ru`, `en`
- Access: `const router = useRouter(); const interfaceLang = router.locale`

### 2. Learning Language (`userLearningLanguage`)
- Language the user is STUDYING (target language)
- Values: `fr`, `ru` (en suspended)
- Access: `const { userLearningLanguage } = useUserContext()`
- **Used for:** Filtering materials and courses

### 3. Spoken Language (`spoken_language`)
- User's NATIVE language (for explanations in lessons)
- Values: `fr`, `ru`, `en`
- Access: `const spokenLang = userProfile?.spoken_language || router.locale`
- **Used for:** Selecting lesson content blocks (`blocks_fr`, `blocks_en`, `blocks_ru`)

**Example scenario:**
- French speaker learning Russian with English interface
- Interface: `en` (menus in English)
- Learning: `ru` (studying Russian materials)
- Spoken: `fr` (lesson explanations in French)

## Project Structure

```
cat /tmp/rules_section.txt
linguami/
├── pages/                  # Next.js pages (file-based routing)
│   ├── api/               # API routes
│   ├── method/            # Course system pages
│   ├── materials/         # Learning materials
│   └── admin/             # Admin panel
├── components/
│   ├── layouts/           # Navbar, Footer, BottomNav
│   ├── courses/blocks/    # Lesson block components
│   ├── exercises/         # Exercise components
│   └── shared/            # Reusable components
├── features/              # Redux slices
│   ├── courses/
│   ├── materials/
│   ├── words/
│   └── cards/
├── context/               # React Context providers
│   ├── user.js           # Authentication & user profile
│   └── ThemeContext.js   # Dark/light mode
├── utils/                 # Utility functions
├── lib/                   # Third-party clients (Supabase, R2)
├── locales/              # i18n translation files
│   ├── fr/
│   ├── ru/
│   └── en/
├── supabase/
│   ├── migrations/       # Database migrations
│   └── seed/             # Seed data
├── scripts/              # Utility scripts (audio generation, etc.)
└── docs/                 # 📚 Documentation (YOU ARE HERE)
    ├── architecture/     # System architecture docs
    ├── features/         # Feature-specific docs
    └── guides/           # Creation guides
```
cat /tmp/rules_section.txt

## Common Development Patterns

### Adding a New Feature

1. **Plan data model** → See [Database Architecture](docs/architecture/database.md)
2. **Create Redux slice** (if needed) → See [State Management](docs/architecture/state-management.md)
3. **Add API routes** → See [Authentication](docs/architecture/authentication.md) for auth
4. **Create components** → Follow MUI `sx` prop pattern
5. **Add translations** → See [i18n System](docs/architecture/i18n.md)

### Creating Content

**Lessons:**
1. **Read [Lesson Creation Guide](docs/guides/LESSON_CREATION_GUIDE.md)** first
2. Create text content (Phase 1: NO audio)
3. Get user validation
4. Generate audio (Phase 2: AFTER validation)

**Exercises:**
1. **Read [Exercise Creation Guide](docs/guides/EXERCISE_CREATION_GUIDE.md)** first
2. Choose one of 3 supported types
3. Use automated scripts (`scripts/create-*.js`)
4. Validate all fields before insertion

### Component Pattern

```javascript
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '@/context/user'
import useTranslation from 'next-translate/useTranslation'

function MyComponent() {
  const { t, lang } = useTranslation('common')
  const { isUserLoggedIn, userProfile } = useUserContext()
  const dispatch = useDispatch()
  const data = useSelector(state => state.myFeature.data)

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h4">{t('title')}</Typography>
      {/* ... */}
    </Box>
  )
}
```
cat /tmp/rules_section.txt

### API Route Pattern

```javascript
import { createServerClient } from '@/lib/supabase-server'

export default async function handler(req, res) {
  const supabase = createServerClient(req, res)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Your logic here
  res.json({ success: true })
}
```
cat /tmp/rules_section.txt

### Protected Route Pattern

```javascript
const { isUserLoggedIn, isUserAdmin } = useUserContext()

if (!isUserLoggedIn) {
  router.push('/login')
  return null
}

if (!isUserAdmin) {
  return <div>Access denied</div>
}
```
cat /tmp/rules_section.txt

## Styling

### MUI sx Prop (Preferred)

```javascript
<Box sx={{
  display: 'flex',
  gap: 2,
  p: { xs: 2, md: 4 },     // Responsive padding
  bgcolor: 'background.paper',
  '&:hover': { opacity: 0.8 }
}}>
```
cat /tmp/rules_section.txt

### Responsive Breakpoints

- `xs`: 0px+ (mobile)
- `sm`: 600px+ (tablet)
- `md`: 900px+ (small desktop)
- `lg`: 1200px+ (desktop)
- `xl`: 1536px+ (large desktop)

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
YANDEX_DICT_API_KEY=
ELEVENLABS_API_KEY=
RESEND_API_KEY=
FACEBOOK_APP_SECRET=  # Required for Facebook data deletion callback

# Analytics
NEXT_PUBLIC_GTM_ID=
```
cat /tmp/rules_section.txt

## Key Workflows

### Committing Changes

```bash
git add <files>
git commit -m "feat: description

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```
cat /tmp/rules_section.txt

### Creating Pull Requests

```bash
# Check diff and commits
git status
git diff main...HEAD
git log main..HEAD

# Push and create PR
git push -u origin branch-name
gh pr create --title "Title" --body "Description"
```
cat /tmp/rules_section.txt

### Merge Strategy to Avoid Conflicts

**Before merging feature branch → develop:**

```bash
# Option 1: Regular merge to sync
git checkout feature-branch
git merge develop
# Resolve small conflicts incrementally

# Option 2: Rebase for clean history
git checkout feature-branch
git rebase develop
# Resolve conflicts
git checkout develop
git merge feature-branch  # Clean merge
```
cat /tmp/rules_section.txt

**Why this helps:**
- Modular docs reduce conflict surface area
- Each feature has its own doc file
- Architecture docs rarely change simultaneously

## Troubleshooting

### Build Errors

```bash
rm -rf .next node_modules
npm install
npm run build
```
cat /tmp/rules_section.txt

### Database Issues

Check RLS policies if queries fail for authenticated users.

### Translation Missing

1. Add key to all 3 locale files (`fr`, `en`, `ru`)
2. Update `i18n.json` if new namespace
3. Restart dev server

## Important Notes

### Guest User Support

Non-authenticated users get:
- Learning language stored in localStorage
- Course progress in localStorage (migrated on login)
- Dictionary in localStorage (migrated on login)
- Translation limit: 20/day

See [Authentication](docs/architecture/authentication.md) for migration details.

### File Storage

All media files (images, audio, video) stored in **Cloudflare R2**:
- Images: `images/ui/`, `images/materials/`, `images/blog/`
- Audio: `audio/fr/`, `audio/ru/`, `audio/en/`
- Video: `video/materials/`

Public URL: `NEXT_PUBLIC_R2_PUBLIC_URL`

### Middleware

`/middleware.js` runs on every request to refresh Supabase session tokens. Required for Supabase SSR.

## Getting Help

### JSX Text Content Rules

**CRITICAL: Never use typographic apostrophes (') in JSX**

When writing French or other text directly in JSX, ALWAYS use straight quotes/apostrophes:

```javascript
// ❌ WRONG - Typographic apostrophe causes build errors
<div>Débloquez l'accès complet</div>

// ✅ CORRECT - Straight apostrophe
<div>Débloquez l'accès complet</div>

// ✅ BEST - Use i18n for all user-facing text
<div>{t('unlock_full_access')}</div>
```
cat /tmp/rules_section.txt

**Why:** React's ESLint rule `react/no-unescaped-entities` flags typographic apostrophes (') as errors. They must be escaped as `&apos;` or `&#39;`, which is cumbersome and error-prone.

**Solution:** Always use i18n for user-facing text. Add translations to `/locales/{fr,ru,en}/*.json` files instead of hardcoding strings in components.

### Documentation Map

Not sure where to look? Use this quick reference:

**I want to...**
- Understand database tables → [Database Architecture](docs/architecture/database.md)
- Add Redux state → [State Management](docs/architecture/state-management.md)
- Implement login → [Authentication](docs/architecture/authentication.md)
- Add translations → [i18n System](docs/architecture/i18n.md)
- Create exercises → [Exercise Creation Guide](docs/guides/EXERCISE_CREATION_GUIDE.md) ⚠️ MUST READ
- Create lessons → [Lesson Creation Guide](docs/guides/LESSON_CREATION_GUIDE.md) ⚠️ MUST READ
- Understand exercises → [Interactive Exercises](docs/features/exercises.md)
- Understand courses → [Method Courses](docs/features/method-courses.md)
- Understand flashcards → [SRS Flashcards](docs/features/srs-flashcards.md)
- Understand XP system → [XP & Gamification](docs/features/xp-gamification.md)

### Quick Links

- [GitHub Issues](https://github.com/anthropics/claude-code/issues) - Report bugs
- [Claude Code Docs](https://docs.claude.com/en/docs/claude-code) - Claude Code documentation

---

**Remember:** This is just an index. All detailed documentation is in the `docs/` folder. Always consult the appropriate guide before working on a feature to avoid conflicts and ensure consistency.
