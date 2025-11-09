# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
  - Fields: name, avatar_id, learning_language, is_premium, role
  - XP fields: total_xp, current_level, daily_streak, total_gold

**Learning Language vs UI Language:**
- UI language (`router.locale`) - Interface language (fr, ru, en)
- Learning language (`userProfile.learning_language`) - Target language for study
- These are independent - user can learn Russian while using French interface

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
- `common` - Global UI strings (navbar, footer, buttons)
- `materials` - Materials page
- `words` - Dictionary page
- `exercises` - Exercise components and pages
- `admin` - Admin panel
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
- `POST /api/exercises/submit` - Submit exercise completion and award XP

### Component Organization

**File-based routing:** `/pages/`
- Each file = route (e.g., `/pages/materials/index.js` → `/materials`)
- Dynamic routes: `[id].js` for parameters
- API routes: `/pages/api/` folder

**Components:** `/components/`
- **Layouts:** Navbar, Footer, BottomNav, UserMenu
- **Feature-based:**
  - materials/ - Material cards, content display
  - dictionary/ - Word lookup and management
  - exercises/ - MCQ, FillInTheBlank, DragAndDrop, ExerciseSection
  - admin/ - Admin panel, exercise creation/editing
  - blog/ - Blog posts and content
  - auth/ - Authentication forms
- **Shared:** LoadingSpinner, ThemeToggle, AchievementNotification, etc.

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
- `users_profile` - User profile data
- `user_xp_profile` - XP, level, streak data
- `materials` - Learning materials (videos, books)
- `user_materials` - User's study progress
- `user_words` - User's dictionary words
- `user_words_cards` - SRS flashcard data
- `exercises` - Interactive exercises (MCQ, fill-in-blank, drag-drop)
- `user_exercise_progress` - User's exercise scores and attempts
- `xp_rewards_config` - XP reward amounts
- `xp_transactions` - XP transaction history

**Row Level Security (RLS):**
- All tables have RLS policies
- Users can only access their own data
- Service role key bypasses RLS (use carefully)

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

**4. Interactive Exercise System**
- Location: `/components/exercises/`
- Three exercise types:
  1. **Multiple Choice (MCQ)** - Questions with 2-6 options
  2. **Fill in the Blank** - Text with `___` placeholders
  3. **Drag and Drop** - Match pairs between two columns
- Features:
  - Multilingual support (questions can have translations in fr, ru, en)
  - XP rewards for 100% completion (first time only)
  - Progress tracking in `user_exercise_progress` table
  - Explanations shown after each answer
  - Mobile-responsive drag-and-drop interface
- Exercise data structure in DB:
  ```json
  {
    "type": "mcq|fill_in_blank|drag_and_drop",
    "material_id": 123,
    "title": "Exercise title",
    "level": "beginner|intermediate|advanced",
    "lang": "fr|ru|en",
    "xp_reward": 10,
    "data": {
      "questions": [
        // Question objects vary by type
      ]
    }
  }
  ```
- Admin pages: `/pages/admin/exercises/` for creating/editing exercises
- API endpoints:
  - `POST /api/exercises/submit` - Submit exercise completion
  - Validates 100% score for XP rewards
  - Tracks first-time completion for XP eligibility

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

**Using Sonner (recommended):**
```javascript
import toast from '@/utils/toast'

toast.success('Success message')
toast.error('Error message')
toast.warning('Warning message')
toast.info('Info message')
```

**Legacy approach (still works):**
```javascript
import { toast } from 'react-toastify'
// Same API as above
```

**Note:** The project uses a custom toast wrapper in `utils/toast.js` that currently uses Sonner. Import from `@/utils/toast` for consistency.

### Creating Exercises with Multilingual Support

**Exercise data with translations:**
```javascript
// Questions can have translations for all supported locales
const question = {
  id: 1,
  question: "Quelle est la capitale de la France?",  // Default (fr)
  question_en: "What is the capital of France?",     // English translation
  question_ru: "Какая столица Франции?",             // Russian translation
  options: [
    { key: 'A', text: 'Paris', text_en: 'Paris', text_ru: 'Париж' },
    { key: 'B', text: 'Londres', text_en: 'London', text_ru: 'Лондон' }
  ],
  correctAnswer: 'A',
  explanation: "Paris est la capitale de la France.",
  explanation_en: "Paris is the capital of France.",
  explanation_ru: "Париж - столица Франции."
}
```

**Retrieving localized content:**
```javascript
import { getLocalizedQuestion } from '@/utils/exerciseHelpers'

// In component
const locale = router.locale || 'fr'
const localizedQuestion = getLocalizedQuestion(question, locale)
// Returns question with locale-specific fields
```

**Exercise component integration:**
```javascript
// ExerciseSection.jsx automatically loads exercises for a material
import ExerciseSection from '@/components/exercises/ExerciseSection'

// In material page
<ExerciseSection materialId={material.id} />
```

## Important Notes

### Guest User Support
- Translation limit: 20/day (tracked by IP + cookie)
- Dictionary stored in localStorage as `guestDictionary`
- XP tracking disabled for guests
- Prompt to sign up when limits reached

### Middleware
`/middleware.js` runs on every request to:
- Refresh Supabase session tokens
- Maintain auth state across page loads
- Required for Supabase SSR

### Image Optimization
- Images served from Supabase Storage
- WebP format preferred
- Sharp library for optimization
- Scripts available for batch optimization

### Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_API_URL
YANDEX_DICT_API_KEY
RESEND_API_KEY (for emails)
NEXT_PUBLIC_GTM_ID (Google Tag Manager)
```

### Testing
- Jest configured for unit tests
- Test files: `__tests__/` or `*.test.js`
- Run with `npm run test`

## Code Style

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

## Performance Considerations

- Images: Use Next.js `<Image>` component with optimization
- Code splitting: Automatic with Next.js dynamic imports
- Redux: Use `createAsyncThunk` for server calls
- Memoization: Use `useMemo` and `useCallback` for expensive operations
- Bundle size: Monitored with `@next/bundle-analyzer`
