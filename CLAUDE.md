# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference: Language System

**The app uses THREE distinct language concepts - do NOT confuse them:**

1. **Interface Language** (`lang`, `router.locale`) - UI language (fr/ru/en)
2. **Learning Language** (`userLearningLanguage`, `learning_language`) - Language being studied (fr/ru)
   - For auth users: `userProfile.learning_language`
   - For guests: `localStorage.getItem('learning_language')`
   - Access via: `useUserContext().userLearningLanguage`
3. **Spoken Language** (`spoken_language`) - User's native language for explanations (fr/ru/en)
   - For auth users: `userProfile.spoken_language`
   - For guests: defaults to interface language

**Courses are filtered by LEARNING language, NOT interface language.**
**Lesson content (blocks_XX) is selected by SPOKEN language.**

See "Three-Language System" section below for details.

## Development Commands

### Core Commands
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Jest tests in watch mode
```

### Image Optimization
```bash
npm run optimize-images        # Optimize all images in public/
npm run optimize-image         # Optimize a single image
npm run optimize-replace       # Optimize and replace existing images
```

## Architecture Overview

### Tech Stack
- **Next.js 13.4.12** with App Router and API routes
- **React 18.2** with hooks
- **Material-UI (MUI) 5.10** for UI components and theming
- **Redux Toolkit 1.8.5** for global state management
- **Supabase** for PostgreSQL database and authentication
- **next-translate 2.5.2** for internationalization (fr, ru, en)

### State Management Pattern

**Two-tier state architecture:**

1. **Redux** (`/features/`) - Global domain state
   - `materialsSlice` - Learning materials, books, chapters
   - `wordsSlice` - User dictionary, translations, SRS data
   - `cardsSlice` - Flashcard UI state
   - `lessonsSlice` - Lesson content
   - `coursesSlice` - Harrap's-inspired method courses and lessons
   - `activitiesSlice` - User activity tracking
   - `contentSlice` - Blog posts and general content

2. **React Context** (`/context/`) - Local UI state
   - `UserContext` - Authentication, user profile, learning language
   - `ThemeContext` - Dark/light mode toggle

**When to use which:**
- Redux: Cross-feature data, server state, caching
- Context: Authentication, theme, simple UI state

### Authentication Flow

**Location:** `/context/user.js`

**Key functions:**
```javascript
register(email, password, name, username, ...)  // Create account
login(email, password)                          // Email/password login
loginWithThirdPartyOAuth(provider)             // OAuth (Google, Apple, Facebook)
sendMagicLink(email)                            // Passwordless login
logout()                                        // Clear session
```

**User data structure:**
- `user` - Supabase auth user object
- `userProfile` - Combined profile from `users_profile` + `user_xp_profile` tables
  - Fields: name, avatar_id, learning_language, spoken_language, is_premium, role
  - XP fields: total_xp, current_level, daily_streak, total_gold

**Three-Language System:**

The app distinguishes between three types of languages:

1. **Interface Language** (`router.locale`, `lang`)
   - Language of the UI/menus/buttons
   - Values: `fr`, `ru`, `en`
   - Changed via InterfaceLanguageMenu component
   - Stored in Next.js routing (URL prefix)

2. **Learning Language** (`learning_language`, `userLearningLanguage`)
   - The language the user is STUDYING (target language)
   - Values: `fr`, `ru` (en suspended)
   - For authenticated users: stored in `users_profile.learning_language`
   - For non-authenticated users: stored in `localStorage.getItem('learning_language')`
   - Changed via LanguageMenu component
   - Accessed via `useUserContext().userLearningLanguage` (works for both auth/non-auth)
   - Default logic in `getDefaultLearningLanguage()`:
     - Interface `ru` → learn `fr`
     - Interface `fr` or `en` → learn `ru`

3. **Spoken Language** (`spoken_language`, `spokenLanguage`)
   - The user's NATIVE language (for translations in lessons)
   - Values: `fr`, `ru`, `en`
   - For authenticated users: stored in `users_profile.spoken_language`
   - For non-authenticated users: defaults to interface language (`lang`)
   - Used to select which `blocks_XX` to display in lessons (e.g., `blocks_fr` for French speakers)

**Example scenarios:**
- French speaker learning Russian with English interface:
  - Interface: `en`, Learning: `ru`, Spoken: `fr`
  - Sees menus in English, studies Russian, gets explanations in French

- Russian speaker learning French with Russian interface:
  - Interface: `ru`, Learning: `fr`, Spoken: `ru`
  - Sees menus in Russian, studies French, gets explanations in Russian

### Internationalization (i18n)

**Configuration:** `/i18n.json`
- 3 locales: fr (default), ru, en
- Translation files in `/locales/{locale}/{namespace}.json`
- Page-specific namespaces defined in i18n.json

**Usage:**
```javascript
import useTranslation from 'next-translate/useTranslation'

function Component() {
  const { t, lang } = useTranslation('namespace')
  return <div>{t('key')}</div>
}
```

**Common namespaces:**
- `common` - Global UI strings (navbar, footer, buttons, method UI)
  - All method-related keys prefixed with `methode_` (e.g., `methode_title`, `methode_start`)
- `materials` - Materials page
- `words` - Dictionary page
- `register` - Auth pages
- `home` - Homepage

### API Routes Pattern

**Location:** `/pages/api/`

**Authentication in API routes:**
```javascript
import { createServerClient } from '@/lib/supabase-server'

export default async function handler(req, res) {
  const supabase = createServerClient(req, res)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Your logic here
}
```

**Key endpoints:**
- `POST /api/translations/translate` - Yandex Dictionary API (guest limit: 20/day)
- `POST /api/xp/add` - Award XP for actions
- `GET /api/xp/profile` - Get user XP stats
- `GET /api/statistics/index` - User learning statistics
- `GET /api/leaderboard/index` - Global leaderboard

### Component Organization

**File-based routing:** `/pages/`
- Each file = route (e.g., `/pages/materials/index.js` → `/materials`)
- Dynamic routes: `[id].js` for parameters
- API routes: `/pages/api/` folder

**Components:** `/components/`
- **Layouts:** Navbar, Footer, BottomNav, UserMenu
- **Feature-based:** materials/, dictionary/, admin/, blog/, auth/
- **Shared:** LoadingSpinner, ThemeToggle, etc.

**Component pattern:**
```javascript
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '@/context/user'
import useTranslation from 'next-translate/useTranslation'

function MaterialList() {
  const { t } = useTranslation('materials')
  const { isUserLoggedIn } = useUserContext()
  const dispatch = useDispatch()
  const materials = useSelector(state => state.materials.materials)

  useEffect(() => {
    dispatch(getMaterials({ lang, section }))
  }, [dispatch, lang, section])

  return (
    // Material-UI components with sx prop
  )
}
```

### Styling Approach

**Material-UI theming:**
- Theme provider in `/context/ThemeContext.js`
- Dark/light mode stored in localStorage
- Custom color palette:
  - Primary: #667eea / #8b5cf6 (light/dark)
  - Secondary: #f093fb / #f5576c
  - Background gradients: `linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)`

**Styling methods (in order of preference):**
1. MUI `sx` prop for component-level styles
2. Emotion CSS-in-JS for complex animations
3. Global styles in `/styles/globals.css`

### Database & Supabase

**Client setup:**
- Browser: `createBrowserClient()` from `/lib/supabase.js`
- Server: `createServerClient(req, res)` from `/lib/supabase-server.js`

**Key tables:**

**User & Profile:**
- `users_profile` - User profile (name, avatar, learning_language, spoken_language, is_premium)
- `user_xp_profile` - XP, level, streak data

**Learning Materials:**
- `materials` - Learning materials (videos, books)
- `user_materials` - User's study progress on materials
- `user_words` - User's dictionary words
- `user_words_cards` - SRS flashcard data

**Method System (Structured Courses):**
- `course_levels` - Proficiency levels (beginner/intermediate/advanced)
  - Columns: id, slug, name_fr/en/ru, order_index, is_free
- `courses` - Language-specific courses (one per target language per level)
  - Columns: id, level_id, target_language, slug, title_fr/en/ru, description_fr/en/ru
  - ⚠️ `lang` column is obsolete (courses no longer filtered by interface language)
- `course_lessons` - Individual lessons with multilingual content blocks
  - Columns: id, course_id, slug, title_fr/en/ru, objectives_fr/en/ru, blocks_fr/en/ru (JSONB)
  - blocks_XX selected based on user's spoken_language
- `user_course_access` - Purchased levels per user
- `user_course_progress` - Lesson completion tracking (lesson_id, completed_at, time_spent)

**XP & Gamification:**
- `xp_rewards_config` - XP reward amounts per action
- `xp_transactions` - XP transaction history

**Row Level Security (RLS):**
- All tables have RLS policies
- Users can only access their own data
- Service role key bypasses RLS (use carefully)

### File Storage with Cloudflare R2

**Setup:**
- R2 client configured in `/lib/r2.js` (if exists) or API routes
- S3-compatible API using AWS SDK
- Public bucket with custom domain for CDN delivery

**Bucket structure:**
```
linguami-r2/
├── images/
│   ├── ui/           # UI elements (logos, icons, badges)
│   ├── materials/    # Material thumbnails and images
│   └── blog/         # Blog post images
├── audio/
│   ├── fr/           # French audio files
│   ├── ru/           # Russian audio files
│   └── en/           # English audio files
└── video/
    └── materials/    # Video materials
```

**Usage in code:**
```javascript
// Public URL for images
const imageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/images/ui/logo.webp`

// For audio files in courses
const audioUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/audio/fr/dialogue-1.mp3`
```

**Upload via API:**
- Create API route in `/pages/api/upload/`
- Use AWS S3 SDK with R2 credentials
- Handle file validation and optimization
- Return public URL after upload

### Key Features

**1. Spaced Repetition System (SRS)**
- Algorithm: `/utils/spacedRepetition.js`
- Based on Anki with 4 buttons: Again, Hard, Good, Easy
- Card states: new, learning, review, relearning
- Automatic interval calculation
- Next review date tracking

**2. XP & Gamification System**
- Actions configured in `xp_rewards_config` table
- Common actions: material_started, material_completed, word_added
- Level-up system with exponential XP requirements
- Daily streak tracking
- Leaderboard integration

**3. Translation System**
- Yandex Dictionary API integration
- Guest limit: 20 translations/day (IP-based)
- Authenticated users: unlimited
- Caching in Redux state
- Click-to-translate on learning materials

**4. Method System (Structured Courses)**

**Location:** `/pages/method/`

**Database Structure:**

Three-tier hierarchy: Levels → Courses → Lessons

1. **`course_levels` table** - CEFR proficiency levels
   - Slugs: `beginner`, `intermediate`, `advanced` (English convention)
   - Multilingual names: `name_fr`, `name_en`, `name_ru`
   - Free/paid: `is_free` (beginner is free)
   - URLs: `/method/beginner`, `/method/intermediate`, `/method/advanced`

2. **`courses` table** - Language-specific courses within each level
   - Each course teaches ONE target language (`target_language`: `fr`, `ru`, `en`)
   - Identified by: `level_id` + `target_language` (NOT by interface language)
   - Slugs: `beginner-russian`, `beginner-french`, etc.
   - Multilingual metadata: `title_fr/en/ru`, `description_fr/en/ru` (simplified to just language names)
   - ⚠️ `lang` column is legacy/obsolete - courses are NOT filtered by interface language

   **Important:** Courses are selected based on user's **learning language** (`userLearningLanguage`),
   NOT interface language. A course teaches one target language and works for all interface languages.

3. **`course_lessons` table** - Individual lessons with multilingual content
   - Each lesson has: `title_fr/en/ru`, `objectives_fr/en/ru`, `blocks_fr/en/ru`
   - `blocks_XX` are JSONB arrays containing lesson content
   - Content displayed based on user's **spoken language** (native language for explanations)
   - Slugs: `se-presenter`, `se-presenter-fr`, etc.
   - URLs: `/method/beginner/se-presenter`

**How course selection works:**

```javascript
// In pages/method/[level]/index.js and [lessonSlug].js
const { userLearningLanguage } = useUserContext()  // From context (handles auth/non-auth)
const learningLanguage = userLearningLanguage       // e.g., 'ru' or 'fr'

// Filter courses by learning language (NOT interface language)
const currentCourse = courses.find(
  (c) => c.level_id === currentLevel?.id && c.target_language === learningLanguage
)

// For lesson content, use spoken language
const spokenLanguage = userProfile?.spoken_language || lang
const blocksKey = `blocks_${spokenLanguage}`  // e.g., blocks_fr for French speakers
const blocks = currentLesson[blocksKey]        // French explanations for French speakers
```

**Block-based lesson structure:**
- 13+ block types: dialogue, grammar, culture, vocabulary, exercises, tip, conversation, summary, etc.
- Components: `/components/courses/blocks/`
- Renderer: `/components/courses/blocks/BlockRenderer.jsx`
- Documentation: `/docs/COURSE_BLOCKS_STRUCTURE.md`
- **⚠️ IMPORTANT:** When creating or modifying lessons, ALWAYS consult `/docs/LESSON_CREATION_GUIDE.md` first
  - Contains translation rules, examples, and common errors to avoid
  - Ensures proper use of learning_language vs spoken_language
  - Checklist for verifying lesson quality before insertion

**Audio generation:**
- ElevenLabs API integration for dialogue/table/example audio
- Stored in R2: `audio/fr/`, `audio/ru/`, `audio/en/`

**Progression tracking:**
- Authenticated: `user_course_progress` table
- Non-authenticated: localStorage (see Guest User Support below)
- XP rewards: +10 XP per lesson completed

**Access control:**
- `user_course_access` table tracks purchased levels
- Beginner level is free (`course_levels.is_free = true`)
- Intermediate/Advanced require purchase

## Common Development Patterns

### Adding a New Feature with Global State

1. Create Redux slice in `/features/myFeature/myFeatureSlice.js`
2. Add slice to store in `/features/store.js`
3. Create async thunks for API calls
4. Use in components with `useSelector` and `useDispatch`

### Adding a New Page

1. Create file in `/pages/my-page.js`
2. Add translations in `/locales/{fr,ru,en}/namespace.json`
3. Update `/i18n.json` to include namespace for page
4. Use `useTranslation('namespace')` in component

### Adding a New API Route

1. Create file in `/pages/api/my-endpoint.js`
2. Use `createServerClient()` for auth
3. Return JSON with `res.json()`
4. Handle errors with appropriate status codes

### Protected Routes

Check authentication in component:
```javascript
const { isUserLoggedIn } = useUserContext()

if (!isUserLoggedIn) {
  router.push('/login')
  return null
}
```

For admin routes:
```javascript
const { isUserAdmin } = useUserContext()

if (!isUserAdmin) {
  return <div>Access denied</div>
}
```

### Showing Notifications

```javascript
import { toast } from 'react-toastify'

toast.success('Success message')
toast.error('Error message')
toast.warning('Warning message')
toast.info('Info message')
```

For i18n messages, use `utils/toastMessages.js`:
```javascript
import { useToastMessages } from '@/utils/toastMessages'

const toastMessages = useToastMessages()
toast.success(toastMessages.wordAdded())
```

## Important Notes

### Guest User Support (localStorage)

**For non-authenticated users, several features use localStorage:**

1. **Learning Language** (`localStorage.getItem('learning_language')`)
   - Stores user's chosen target language (fr/ru)
   - Managed by `UserContext` and `getDefaultLearningLanguage()`
   - Automatically migrated to database on login
   - Access via: `useUserContext().userLearningLanguage`

2. **Course Progression** (`localStorage.getItem('localCourseProgress')`)
   - Location: `/utils/localCourseProgress.js`
   - Stores completed lessons: `[{ lesson_id: 2, completed_at: "..." }, ...]`
   - Functions:
     - `getLocalProgress()` - Get all completed lessons
     - `completeLocalLesson(lessonId)` - Mark lesson complete
     - `migrateLocalProgressToDatabase()` - Sync to DB on login
   - Automatically migrated to `user_course_progress` table on login
   - Redux actions: `loadLocalProgress`, `completeLocalLessonAction`

3. **Guest Dictionary** (`localStorage.getItem('guestDictionary')`)
   - Stores saved words for non-authenticated users
   - Format: array of word objects
   - Migrated to `user_words` table on login

4. **Translation Limits**
   - 20 translations/day for guests (tracked by IP + cookie)
   - Authenticated users: unlimited
   - Prompt to sign up when limit reached

5. **Theme Preference** (`localStorage.getItem('theme')`)
   - Dark/light mode preference
   - Managed by `ThemeContext`

**Migration on Login:**
- All localStorage data is automatically migrated to database
- Migration happens in `UserContext.hydrateFromSession()`
- After successful migration, localStorage is cleared
- See: `migrateLocalProgressToDatabase()` in `/utils/localCourseProgress.js`

### Middleware
`/middleware.js` runs on every request to:
- Refresh Supabase session tokens
- Maintain auth state across page loads
- Required for Supabase SSR

### File Storage
- **Cloudflare R2** for all media files (images, audio, video)
- Images served from R2 buckets
- WebP format preferred for images
- Sharp library for image optimization
- Scripts available for batch optimization
- Audio files stored in R2 for course dialogues and exercises

### Environment Variables
Required in `.env.local`:
```
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Cloudflare R2 (File Storage)
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
NEXT_PUBLIC_R2_PUBLIC_URL

# APIs
NEXT_PUBLIC_API_URL
YANDEX_DICT_API_KEY
ELEVENLABS_API_KEY (for audio generation)
RESEND_API_KEY (for emails)

# Analytics
NEXT_PUBLIC_GTM_ID (Google Tag Manager)
```

### Testing
- Jest configured for unit tests
- Test files: `__tests__/` or `*.test.js`
- Run with `npm run test`

## Code Style

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

**Why:** React's ESLint rule `react/no-unescaped-entities` flags typographic apostrophes (') as errors. They must be escaped as `&apos;` or `&#39;`, which is cumbersome and error-prone.

**Solution:** Always use i18n for user-facing text. Add translations to `/locales/{fr,ru,en}/*.json` files instead of hardcoding strings in components.

### Material-UI sx Prop
Prefer `sx` prop over inline styles or styled components:
```javascript
<Box sx={{
  display: 'flex',
  gap: 2,
  p: { xs: 2, md: 4 },  // Responsive padding
  bgcolor: 'background.paper'
}}>
```

### Responsive Design
Use MUI breakpoints in sx:
- `xs`: 0px+ (mobile)
- `sm`: 600px+ (tablet)
- `md`: 900px+ (small desktop)
- `lg`: 1200px+ (desktop)
- `xl`: 1536px+ (large desktop)

### Async/Await Pattern
```javascript
const handleSubmit = async () => {
  try {
    const result = await dispatch(asyncThunk()).unwrap()
    toast.success('Success')
  } catch (error) {
    toast.error(error.message)
  }
}
```

### File Naming
- Components: PascalCase (e.g., `MaterialCard.jsx`)
- Utils/hooks: camelCase (e.g., `useUserContext.js`)
- Pages: kebab-case (e.g., `my-materials.js`)
- Constants: UPPER_SNAKE_CASE in files

## Documentation & Resources

**Essential Guides:**
- **[LESSON_CREATION_GUIDE.md](/docs/LESSON_CREATION_GUIDE.md)** - ⚠️ MUST READ before creating/modifying lessons
  - Translation rules for multilingual content
  - Examples of all block types
  - Common errors and how to avoid them
  - Checklist for lesson quality assurance
- **[COURSE_BLOCKS_STRUCTURE.md](/docs/COURSE_BLOCKS_STRUCTURE.md)** - Detailed schemas for all block types
- **[lesson_template_example.json](/docs/lesson_template_example.json)** - Complete lesson example

**When to consult:**
- Creating a new lesson → Read LESSON_CREATION_GUIDE.md
- Modifying lesson content → Check LESSON_CREATION_GUIDE.md for translation rules
- Adding a new block type → Update both COURSE_BLOCKS_STRUCTURE.md and LESSON_CREATION_GUIDE.md
- Understanding project architecture → This file (CLAUDE.md)

## Performance Considerations

- Images: Use Next.js `<Image>` component with optimization
- Code splitting: Automatic with Next.js dynamic imports
- Redux: Use `createAsyncThunk` for server calls
- Memoization: Use `useMemo` and `useCallback` for expensive operations
- Bundle size: Monitored with `@next/bundle-analyzer`
