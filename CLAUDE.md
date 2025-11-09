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
- Four exercise types:
  1. **Multiple Choice (MCQ)** - Questions with 2-6 options
  2. **Fill in the Blank (Classic)** - Text with `___` placeholders
  3. **Fill in the Blank (Audio Dictation)** - Listen to audio and fill in missing word
  4. **Drag and Drop** - Match pairs between two columns
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
      "questions": [...]  // For MCQ, classic FITB, Drag&Drop
      // OR
      "sentences": [...]  // For Audio Dictation FITB
    }
  }
  ```
- Admin pages: `/pages/admin/exercises/` for creating/editing exercises
- API endpoints:
  - `POST /api/exercises/submit` - Submit exercise completion
  - Validates 100% score for XP rewards
  - Tracks first-time completion for XP eligibility

## Exercise Creation - Overview

**CRITICAL: There are ONLY 3 types of exercises supported. All exercises MUST follow these exact models.**

### Supported Exercise Types

1. **Audio Dictation Fill-in-the-Blank** (`fill_in_blank` with audio)
   - Type: `fill_in_blank`
   - MUST have: 6 sentences with audio files
   - Script: `scripts/create-fitb-audio.js`
   - Title: "Compréhension auditive" / "Listening Comprehension" / "Понимание на слух"

2. **Drag and Drop - Vocabulary Association** (`drag_and_drop`)
   - Type: `drag_and_drop`
   - MUST have: 6 vocabulary pairs
   - Script: `scripts/create-dragdrop.js`
   - Title: "Association de vocabulaire" / "Vocabulary Association" / "Ассоциация слов"

3. **Multiple Choice Questions - Text Comprehension** (`mcq`)
   - Type: `mcq`
   - MUST have: 6 questions with 4 options each
   - Script: `scripts/create-mcq.js`
   - Title: "Compréhension du texte" / "Text Comprehension" / "Понимание текста"

### Global Exercise Rules

**Exercise titles:**
- MUST be displayed in user's browser language (not material language)
- Component automatically translates titles based on locale

**Exercise language:**
- `lang` field MUST match material language
- Questions can be translated for UI, but content stays in material language
- See specific exercise sections below for exact field naming rules

**DO NOT create:**
- Classic Fill-in-the-Blank without audio
- Exercises with different question/pair counts than specified
- Any other exercise types

### Creating Audio Dictation Fill-in-the-Blank Exercises

**IMPORTANT: Always use this exact process when creating FITB exercises with audio.**

**Exercise title display:**
- Title MUST be displayed in user's browser language (not material language)
- French: "Compréhension auditive"
- English: "Listening Comprehension"
- Russian: "Понимание на слух"

**Format:**
- Extract **6 sentences** from the material text
- Each sentence has **ONE blank** (missing word) indicated by `___`
- Audio file plays the **complete sentence** (including the missing word)
- User listens and fills in **only the missing word**

**Data structure:**
```json
{
  "type": "fill_in_blank",
  "material_id": 158,
  "title": "Понимание на слух",
  "level": "intermediate",
  "lang": "ru",  // CRITICAL: Must match material language
  "xp_reward": 10,
  "data": {
    "sentences": [
      {
        "id": 1,
        "audioUrl": "https://linguami-cdn.etreailleurs.workers.dev/audio/exercises/ru/material_158/sentence_1.m4a",
        "sentenceWithBlank": "Воттоваара – ___ массив на территории республики Карелия.",
        "sentenceWithBlank_en": "Vottovaara is a ___ massif in the Republic of Karelia.",
        "sentenceWithBlank_fr": "Vottovaara est un massif ___ en République de Carélie.",
        "correctAnswer": "скальный",
        "correctAnswer_en": "rock",
        "correctAnswer_fr": "rocheux"
      }
      // ... 5 more sentences
    ]
  }
}
```

**Field naming rules:**
- **Base field** (no suffix): Material language (e.g., `sentenceWithBlank`, `correctAnswer`)
- **Suffixed fields** (`_en`, `_fr`, `_ru`): Translations for UI in other languages
- **CRITICAL**: Component uses base fields ONLY for display (not suffixed versions)

**Audio generation process:**

1. **Extract 6 key sentences** from material text
2. **Generate audio** using ElevenLabs API:
   - Russian materials: Use voice `Ekaterina` (ID: `C3FusDjPequ6qFchqpzu`)
   - French materials: Use voice ID: `5jCmrHdxbpU36l1wb3Ke`
   - Model: `eleven_turbo_v2_5` (v3)
   - Settings: `stability: 0.5`, `similarity_boost: 0.75`
3. **Upload to Cloudflare R2**:
   - Path pattern: `audio/exercises/{lang}/material_{id}/sentence_{num}.m4a`
   - Example: `audio/exercises/ru/material_158/sentence_1.m4a`
   - Use AWS S3 SDK (R2 is S3-compatible)
4. **Update exercise** in database with audio URLs

**Automated script (RECOMMENDED):**

Use the reusable script `scripts/create-fitb-audio.js`:

```bash
# Step 1: Create a JSON file with your 6 sentences
# Example: sentences-481.json
[
  {
    "id": 1,
    "fullText": "Le plateau de Valensole est une région naturelle de France.",
    "sentenceWithBlank": "Le plateau de Valensole est une région ___ de France.",
    "sentenceWithBlank_en": "The Valensole plateau is a ___ region of France.",
    "sentenceWithBlank_ru": "Плато Валансоль — это ___ регион Франции.",
    "correctAnswer": "naturelle",
    "correctAnswer_en": "natural",
    "correctAnswer_ru": "природный"
  }
  // ... 5 more sentences
]

# Step 2: Run the script
node scripts/create-fitb-audio.js <material_id> <sentences_json_file>

# Example:
node scripts/create-fitb-audio.js 481 sentences-481.json
```

The script automatically:
- Fetches material from DB to get language
- Selects correct voice (Ekaterina for ru, Sébas for fr)
- Generates audio for each sentence
- Uploads to R2 with correct path
- Creates exercise in database

**Component detection:**
The `AudioDictation` component is automatically used when:
- Exercise type is `fill_in_blank` AND
- First sentence has `audioUrl` property

```javascript
// In ExerciseSection.jsx
{activeExercise.type === 'fill_in_blank' && (
  activeExercise.data?.sentences?.[0]?.audioUrl ? (
    <AudioDictation exercise={activeExercise} onComplete={handleExerciseComplete} />
  ) : (
    <FillInTheBlank exercise={activeExercise} onComplete={handleExerciseComplete} />
  )
)}
```

**Key features of AudioDictation component:**
- Russian text normalization: `е` and `ё` are treated as equivalent
- Inline display: Number + Play button + Sentence on same line
- Play/pause audio controls with visual feedback
- Small input field for single word answer
- Real-time validation and feedback

### Creating Drag and Drop (Association de vocabulaire) Exercises

**IMPORTANT: Drag and Drop exercises MUST have exactly 6 vocabulary pairs.**

**Exercise title display:**
- Title MUST be displayed in user's browser language (not material language)
- French: "Association de vocabulaire"
- English: "Vocabulary Association"
- Russian: "Ассоциация слов"

**Format:**
- Extract **6 key vocabulary words** from the material text
- Each pair consists of a word in the material language (left) and its translation (right)
- Pairs include all 3 language translations for UI flexibility

**Data structure:**
```json
{
  "type": "drag_and_drop",
  "material_id": 481,
  "title": "Association de vocabulaire",
  "level": "intermediate",
  "lang": "fr",  // Must match material language
  "xp_reward": 10,
  "data": {
    "questions": [{
      "pairs": [
        {
          "id": 1,
          "left": {
            "en": "lavandin",
            "fr": "lavandin",
            "ru": "lavandin"
          },
          "right": {
            "en": "lavender",
            "fr": "lavande",
            "ru": "лаванда"
          }
        }
        // ... 5 more pairs (6 TOTAL REQUIRED)
      ]
    }]
  }
}
```

**Field naming rules:**
- **Left side**: Word in material language, REPEATED in all locales
  - For FR material: `left: { en: "mot", fr: "mot", ru: "mot" }`
  - For RU material: `left: { en: "слово", fr: "слово", ru: "слово" }`
- **Right side**: Translations in all locales
  - Component displays the translation matching user's browser locale
- Each side has all 3 locales: `fr`, `en`, `ru`

**Example pairs for French material:**
```javascript
const pairs = [
  {
    id: 1,
    left: { en: "lavandin", fr: "lavandin", ru: "lavandin" },  // FR word repeated
    right: { en: "lavender", fr: "lavande", ru: "лаванда" }     // Translations
  },
  {
    id: 2,
    left: { en: "truffe", fr: "truffe", ru: "truffe" },
    right: { en: "truffle", fr: "truffe", ru: "трюфель" }
  },
  {
    id: 3,
    left: { en: "altitude", fr: "altitude", ru: "altitude" },
    right: { en: "altitude", fr: "hauteur", ru: "высота" }
  },
  {
    id: 4,
    left: { en: "patrimoine", fr: "patrimoine", ru: "patrimoine" },
    right: { en: "heritage", fr: "héritage", ru: "наследие" }
  },
  {
    id: 5,
    left: { en: "archéologique", fr: "archéologique", ru: "archéologique" },
    right: { en: "archaeological", fr: "archéologique", ru: "археологический" }
  },
  {
    id: 6,
    left: { en: "orageux", fr: "orageux", ru: "orageux" },
    right: { en: "stormy", fr: "orageux", ru: "грозовой" }
  }
]
```

**How it displays to users:**
- **FR material + RU browser**: Left shows "lavandin" (FR) → Right shows "лаванда" (RU)
- **FR material + EN browser**: Left shows "lavandin" (FR) → Right shows "lavender" (EN)
- **RU material + FR browser**: Left shows "гора" (RU) → Right shows "montagne" (FR)
- **RU material + EN browser**: Left shows "гора" (RU) → Right shows "mountain" (EN)

**Automated script (RECOMMENDED):**

Use the reusable script `scripts/create-dragdrop.js`:

```bash
# Step 1: Create a JSON file with your 6 vocabulary pairs
# Example: pairs-481.json
[
  {
    "word": "lavandin",
    "translations": {
      "en": "lavender",
      "fr": "lavande",
      "ru": "лаванда"
    }
  },
  {
    "word": "truffe",
    "translations": {
      "en": "truffle",
      "fr": "truffe",
      "ru": "трюфель"
    }
  }
  // ... 4 more pairs (6 total)
]

# Step 2: Run the script
node scripts/create-dragdrop.js <material_id> <pairs_json_file>

# Example:
node scripts/create-dragdrop.js 481 pairs-481.json
```

The script automatically:
- Fetches material from DB to get language
- Structures left side (material word repeated in all locales)
- Structures right side (translations in all locales)
- Determines exercise title based on material language
- Creates exercise in database with correct format

**Manual creation (if needed):**
```javascript
const { data, error } = await supabase
  .from('exercises')
  .insert({
    material_id: 481,
    type: 'drag_and_drop',
    title: 'Association de vocabulaire',
    lang: 'fr',  // Material language
    level: 'intermediate',
    xp_reward: 10,
    data: {
      questions: [{
        pairs: pairs  // MUST be 6 pairs
      }]
    }
  })
```

**Reference exercises:**
- **Exercise ID 13** (Material 121 "Эльбрус", RU): Complete example with Russian material
  - Left: `{ en: "гора", fr: "гора", ru: "гора" }` (RU word repeated)
  - Right: `{ en: "mountain", fr: "montagne", ru: "гора" }` (Translations)
- **Exercise ID 74** (Material 481 "Le plateau de Valensole", FR): Complete example with French material
  - Left: `{ en: "lavandin", fr: "lavandin", ru: "lavandin" }` (FR word repeated)
  - Right: `{ en: "lavender", fr: "lavande", ru: "лаванда" }` (Translations)

### Creating Multiple Choice Questions (MCQ) - Text Comprehension

**IMPORTANT: MCQ exercises MUST have exactly 6 questions with 4 options each.**

**Exercise title display:**
- Title MUST be displayed in user's browser language (not material language)
- French: "Compréhension du texte"
- English: "Text Comprehension"
- Russian: "Понимание текста"

**Format:**
- Create **6 comprehension questions** about the material text
- Each question has **exactly 4 options** (A, B, C, D)
- Questions must be **well-thought and relevant** to test understanding
- **Questions**: Translated for display in user's browser language
- **Answer options**: ALWAYS in material language (no translations)

**Data structure:**
```json
{
  "type": "mcq",
  "material_id": 481,
  "title": "Compréhension du texte",
  "level": "beginner",
  "lang": "fr",  // Must match material language
  "xp_reward": 15,
  "data": {
    "questions": [
      {
        "id": 1,
        "question": "Dans quelle région se trouve le plateau de Valensole ?",
        "question_en": "In which region is the Valensole plateau located?",
        "question_ru": "В каком регионе находится плато Валансоль?",
        "options": [
          { "key": "A", "text": "En Provence-Alpes-Côte d'Azur" },
          { "key": "B", "text": "En Normandie" },
          { "key": "C", "text": "En Bretagne" },
          { "key": "D", "text": "En Alsace" }
        ],
        "correctAnswer": "A",
        "explanation": "Le plateau de Valensole se trouve en Provence.",
        "explanation_en": "The Valensole plateau is located in Provence.",
        "explanation_ru": "Плато Валансоль расположено в Провансе."
      }
      // ... 5 more questions (6 TOTAL REQUIRED)
    ]
  }
}
```

**Field naming rules:**
- **question**: The question text in material language
- **question_en**, **question_ru**: Question translations for UI
- **options[].text**: Answer text in material language ONLY (no translations)
- **correctAnswer**: The correct option key (A, B, C, or D)
- **explanation**: Explanation in material language (optional)
- **explanation_en**, **explanation_ru**: Explanation translations (optional)

**How it displays to users:**
- **FR material + RU browser**: Question shows Russian translation, options show French text
- **FR material + EN browser**: Question shows English translation, options show French text
- **RU material + FR browser**: Question shows French translation, options show Russian text
- **RU material + EN browser**: Question shows English translation, options show Russian text

**Question writing guidelines:**
1. **Factual questions**: Test specific information from the text
2. **Comprehension questions**: Test understanding of concepts
3. **Inference questions**: Test ability to draw conclusions
4. **Vocabulary questions**: Test understanding of key terms
5. **Detail questions**: Test attention to important details
6. **Main idea questions**: Test overall understanding

**Automated script (RECOMMENDED):**

Use the reusable script `scripts/create-mcq.js`:

```bash
# Step 1: Create a JSON file with your 6 questions
# Example: questions-481.json
[
  {
    "question": "Dans quelle région se trouve le plateau de Valensole ?",
    "question_translations": {
      "en": "In which region is the Valensole plateau located?",
      "ru": "В каком регионе находится плато Валансоль?"
    },
    "options": [
      "En Provence-Alpes-Côte d'Azur",
      "En Normandie",
      "En Bretagne",
      "En Alsace"
    ],
    "correctAnswer": "A",
    "explanation": "Le plateau de Valensole se trouve en Provence.",
    "explanation_translations": {
      "en": "The Valensole plateau is located in Provence.",
      "ru": "Плато Валансоль расположено в Провансе."
    }
  }
  // ... 5 more questions (6 total)
]

# Step 2: Run the script
node scripts/create-mcq.js <material_id> <questions_json_file>

# Example:
node scripts/create-mcq.js 481 questions-481.json
```

The script automatically:
- Fetches material from DB to get language
- Structures questions with material language + translations
- Structures options in material language ONLY (no translations)
- Determines exercise title based on material language
- Validates 6 questions with 4 options each
- Creates exercise in database

**Reference exercise:**
- **Exercise ID 70** (Material 481 "Le plateau de Valensole", FR): Complete MCQ example
  - 5 questions (older format, should be 6 now)
  - Questions have FR + EN + RU translations
  - Options have translations (legacy format - new format has no option translations)

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
