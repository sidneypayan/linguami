# Method System (Structured Courses)

## Overview

The Method System provides structured language courses inspired by Harrap's, with progressive lessons from A1 to C2.

**Location:** `/pages/method/`

**Routes:**
- `/method` - Overview page
- `/method/[level]` - Level page (beginner/intermediate/advanced)
- `/method/[level]/[lessonSlug]` - Individual lesson

## Database Structure

### Three-Tier Hierarchy

**Levels → Courses → Lessons**

### 1. Course Levels

**Table:** `course_levels`

Represents CEFR proficiency levels:
- **Beginner** (Débutant) - A1-A2
- **Intermediate** (Intermédiaire) - B1-B2
- **Advanced** (Avancé) - C1-C2

**Schema:**
```javascript
{
  id: integer,
  slug: 'beginner|intermediate|advanced',
  name_fr: 'Débutant',
  name_en: 'Beginner',
  name_ru: 'Начинающий',
  description_fr: 'Niveau A1-A2...',
  description_en: 'Level A1-A2...',
  description_ru: 'Уровень A1-A2...',
  order_index: 1,
  is_free: true,  // Only beginner is free
  created_at: timestamp
}
```

**URLs:**
- `/method/beginner`
- `/method/intermediate`
- `/method/advanced`

### 2. Courses

**Table:** `courses`

Language-specific courses within each level.

⚠️ **IMPORTANT:** Each course teaches **ONE target language** (e.g., Russian, French). Courses are **NOT** duplicated per interface language.

**Schema:**
```javascript
{
  id: integer,
  level_id: integer,          // FK to course_levels
  target_language: 'fr|ru|en', // Language being taught
  slug: 'beginner-russian',
  title_fr: 'Russe',
  title_en: 'Russian',
  title_ru: 'Русский',
  description_fr: '...',
  description_en: '...',
  description_ru: '...',
  lang: 'fr|ru|en',           // ⚠️ OBSOLETE - use target_language instead
  order_index: 1,
  created_at: timestamp
}
```

**How courses are selected:**

Courses are filtered by user's **learning language** (`userLearningLanguage`), NOT interface language:

```javascript
// In pages/method/[level]/index.js
const { userLearningLanguage } = useUserContext()

// Find course for this level teaching the learning language
const currentCourse = courses.find(
  (c) => c.level_id === currentLevel?.id && c.target_language === userLearningLanguage
)
```

**Example:**
- User learning Russian → Gets `beginner-russian` course
- User learning French → Gets `beginner-french` course
- Interface language doesn't matter

### 3. Course Lessons

**Table:** `course_lessons`

Individual lessons with multilingual content blocks.

**Schema:**
```javascript
{
  id: integer,
  course_id: integer,        // FK to courses
  slug: 'se-presenter',
  title_fr: 'Se présenter',
  title_en: 'Introducing yourself',
  title_ru: 'Представиться',
  objectives_fr: ['Apprendre...'],
  objectives_en: ['Learn...'],
  objectives_ru: ['Научиться...'],
  blocks_fr: [{type: 'dialogue', ...}],  // French explanations
  blocks_en: [{type: 'dialogue', ...}],  // English explanations
  blocks_ru: [{type: 'dialogue', ...}],  // Russian explanations
  order_index: 1,
  estimated_duration: 30,    // Minutes
  created_at: timestamp
}
```

**How lesson content is selected:**

Lesson blocks are selected by user's **spoken language** (native language for explanations):

```javascript
// In pages/method/[level]/[lessonSlug].js
const { userProfile } = useUserContext()
const router = useRouter()

const spokenLanguage = userProfile?.spoken_language || router.locale
const blocksKey = `blocks_${spokenLanguage}`
const blocks = currentLesson[blocksKey]
```

**Example:**
- French speaker learning Russian → Gets Russian lesson with French explanations (`blocks_fr`)
- English speaker learning Russian → Gets Russian lesson with English explanations (`blocks_en`)
- Russian speaker learning French → Gets French lesson with Russian explanations (`blocks_ru`)

## Lesson Block System

### Block Types

Lessons are composed of **blocks** - modular content sections:

1. **dialogue** - Conversational dialogues with audio
2. **grammar** - Grammar explanations with tables
3. **vocabulary** - Categorized word lists
4. **culture** - Cultural notes
5. **tip** - Learning tips
6. **conversation** - Practice conversations
7. **summary** - Lesson recap
8. **exercise** - Inline exercises
9. **audio** - Listening comprehension
10. **pronunciation** - Pronunciation guidance
11. **table** - Grammar tables with audio
12. **example** - Grammar examples
13. **mini-dialogue** - Short dialogue snippets

### Block Components

**Location:** `/components/courses/blocks/`

**Main components:**
- `BlockRenderer.jsx` - Router for all block types
- `DialogueBlock.jsx` - Dialogues with audio and vocabulary
- `GrammarBlock.jsx` - Grammar explanations
- `VocabularyBlock.jsx` - Categorized vocabulary
- `CultureBlock.jsx` - Cultural notes
- `ConversationBlock.jsx` - Practice conversations
- `ExerciseInlineBlock.jsx` - Inline exercises
- `TableBlock.jsx` - Grammar tables
- And more...

**BlockRenderer pattern:**
```javascript
// components/courses/blocks/BlockRenderer.jsx
const BlockRenderer = ({ block, lessonId }) => {
  switch (block.type) {
    case 'dialogue':
      return <DialogueBlock block={block} />
    case 'grammar':
      return <GrammarBlock block={block} />
    case 'vocabulary':
      return <VocabularyBlock block={block} />
    // ... other types
    default:
      return <div>Unknown block type: {block.type}</div>
  }
}
```

### Example Block Structure

**DialogueBlock:**
```javascript
{
  type: "dialogue",
  title: "Conversation à l'aéroport",
  lines: [
    {
      speaker: "Андрей",
      speakerGender: "male",
      text: "Привет! Меня зовут Андрей.",
      audioUrl: "https://linguami-cdn.etreailleurs.workers.dev/audio/ru/dialogue_1_line_1.mp3"
    },
    {
      speaker: "Мария",
      speakerGender: "female",
      text: "Привет, Андрей! Меня зовут Мария.",
      audioUrl: "https://linguami-cdn.etreailleurs.workers.dev/audio/ru/dialogue_1_line_2.mp3"
    }
  ],
  vocabulary: [
    {
      word: "привет",
      translation: "hello",
      category: "expressions"
    }
  ]
}
```

**GrammarBlock:**
```javascript
{
  type: "grammar",
  title: "Le verbe être",
  explanation: "Le verbe être est utilisé pour...",
  examples: [
    {
      ru: "Я студент",
      fr: "Je suis étudiant",
      en: "I am a student"
    }
  ]
}
```

**See full documentation:** [`COURSE_BLOCKS_STRUCTURE.md`](../COURSE_BLOCKS_STRUCTURE.md)

## Lesson Creation

⚠️ **ALWAYS consult the lesson creation guide before creating/modifying lessons:**

[`LESSON_CREATION_GUIDE.md`](../guides/LESSON_CREATION_GUIDE.md)

**Key rules:**

### 1. Three-Language System

- **Target Language:** Language being taught (in dialogue/examples)
- **Spoken Language:** Language for explanations (selected via `blocks_XX`)
- **Interface Language:** UI language (buttons, menus)

### 2. Two-Phase Workflow

**Phase 1: Text Only**
- Create all lesson content WITHOUT audio
- All `audioUrl` fields should be `null` or omitted
- Submit for user validation

**Phase 2: Audio Generation**
- ONLY after text is validated
- Generate audio via ElevenLabs
- Upload to R2
- Update lesson with `audioUrl` values

### 3. Dialogue Voice Alternation

**MANDATORY:** Dialogues must alternate male/female voices:

```javascript
// ✅ Correct
lines: [
  { speaker: "Marc", speakerGender: "male", ... },
  { speaker: "Marie", speakerGender: "female", ... },
  { speaker: "Marc", speakerGender: "male", ... },
]

// ❌ Wrong - same gender consecutively
lines: [
  { speaker: "Marc", speakerGender: "male", ... },
  { speaker: "Pierre", speakerGender: "male", ... },  // ❌ No alternation
]
```

## User Progression

### For Authenticated Users

**Table:** `user_course_progress`

Tracks completed lessons:

```javascript
{
  id: integer,
  user_id: uuid,
  lesson_id: integer,
  completed_at: timestamp,
  time_spent: 300  // Seconds
}
```

**Marking lesson complete:**

```javascript
// In lesson page
const handleMarkComplete = async () => {
  await dispatch(completeLesson(lessonId))
  toast.success(t('methode_lesson_completed_toast'))  // "+10 XP"
}
```

### For Guest Users

**localStorage:** `localCourseProgress`

**Utility:** `/utils/localCourseProgress.js`

```javascript
import { getLocalProgress, completeLocalLesson } from '@/utils/localCourseProgress'

// Get progress
const progress = getLocalProgress()
// [{lesson_id: 2, completed_at: "2025-01-10T..."}, ...]

// Mark complete
completeLocalLesson(lessonId)
```

**Migration on login:**

When user logs in, all localStorage progress is automatically migrated to database:

```javascript
// In UserContext
await migrateLocalProgressToDatabase()
```

## Access Control

### Level Access

**Table:** `user_course_access`

Tracks which levels user has purchased:

```javascript
{
  id: integer,
  user_id: uuid,
  level_id: integer,
  purchased_at: timestamp,
  expires_at: null  // Null = lifetime access
}
```

**Checking access:**

```javascript
// In pages/method/[level]/index.js
const { userProfile } = useUserContext()
const { levels } = useSelector(state => state.courses)

const currentLevel = levels.find(l => l.slug === level)

// Check if level is free or user has access
const hasAccess = currentLevel?.is_free || userProfile?.access?.includes(currentLevel?.id)

if (!hasAccess) {
  return <div>This level requires purchase</div>
}
```

### Pricing

- **Beginner:** FREE (`is_free: true`)
- **Intermediate:** Paid
- **Advanced:** Paid

Premium users get discounts (check `userProfile.is_premium`).

## Audio Generation

### ElevenLabs Integration

**Voices:**
- **Russian (female):** Ekaterina (`C3FusDjPequ6qFchqpzu`)
- **French (male):** Sébastien (`5jCmrHdxbpU36l1wb3Ke`)
- **French (female):** TBD

**Settings:**
- Model: `eleven_turbo_v2_5`
- Stability: 0.5
- Similarity boost: 0.75

### Audio Storage (R2)

**Path structure:**
```
audio/
├── fr/
│   ├── dialogue_1_line_1.mp3
│   ├── table_avoir_je.mp3
│   └── example_1.mp3
├── ru/
│   ├── dialogue_1_line_1.mp3
│   └── ...
└── en/
    └── ...
```

**Audio URLs:**
```javascript
audioUrl: "https://linguami-cdn.etreailleurs.workers.dev/audio/ru/dialogue_1_line_1.mp3"
```

### Generation Scripts

**Templates for future lessons:**
- `scripts/generate-lesson-audio.js` - Generate all audio for a lesson
- `scripts/generate-grammar-audio.js` - Grammar examples
- `scripts/generate-table-audio.js` - Table rows

## Lesson Pages

### Overview Mode vs Guided Mode

**Overview Mode:**
- Shows all blocks at once
- Scroll through entire lesson
- See progress (sections completed)
- Good for review

**Guided Mode:**
- Step-by-step navigation
- One block at a time
- Previous/Next buttons
- Focuses attention

**Toggle:**
```javascript
const [isGuidedMode, setIsGuidedMode] = useState(true)

<button onClick={() => setIsGuidedMode(!isGuidedMode)}>
  {isGuidedMode ? t('methode_overview_mode') : t('methode_guided_mode')}
</button>
```

### Lesson Header

Shows:
- Lesson title (translated)
- Estimated duration
- Objectives (translated)
- Mode toggle
- Completion status

### Lesson Footer

Shows:
- Progress indicator
- Mark as complete button (+10 XP)
- Next lesson button
- Back to course button

## Redux Integration

### State Structure

```javascript
// features/courses/coursesSlice.js
{
  levels: [],             // All course levels
  courses: [],            // Courses for selected level
  lessons: [],            // Lessons for selected course
  userAccess: [],         // User's purchased levels
  userProgress: [],       // Completed lessons
  currentLesson: null,    // Currently viewed lesson
  loading: false,
  error: null
}
```

### Key Actions

```javascript
// Fetch data
dispatch(fetchCourseLevels())
dispatch(fetchCourses(levelId))
dispatch(fetchLessons(courseId))
dispatch(fetchUserProgress(userId))

// Complete lesson
dispatch(completeLesson(lessonId))

// Local storage (guests)
dispatch(loadLocalProgress())
dispatch(completeLocalLessonAction(lessonId))
```

## XP Rewards

**Lesson completion:** +10 XP

Awarded when user marks lesson as complete:

```javascript
// In lesson page
const handleMarkComplete = async () => {
  const { data } = await supabase
    .from('user_course_progress')
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      completed_at: new Date(),
      time_spent: timeSpent
    })

  // Award XP
  await supabase.rpc('add_xp', {
    p_user_id: userId,
    p_xp_amount: 10,
    p_action: 'lesson_completed'
  })

  toast.success(t('methode_lesson_completed_toast'))
}
```

## Responsive Design

### Mobile Features

- Bottom navigation
- Touch-friendly buttons
- Collapsible sections
- Mobile-optimized audio controls
- Swipe gestures for navigation

### Desktop Features

- Sidebar navigation
- Hover states
- Keyboard shortcuts
- Larger audio controls
- Multi-column layouts

## Translation Keys

**Namespace:** `common`

**Prefix:** `methode_*`

**Key categories:**

**Navigation:**
- `methode_title`, `methode_subtitle`, `methode_description`
- `methode_back`, `methode_back_to_level`, `methode_back_to_course`

**Status:**
- `methode_free`, `methode_locked`, `methode_unlocked`
- `methode_completed`, `methode_progress`

**Actions:**
- `methode_start`, `methode_lets_go`, `methode_buy`
- `methode_mark_complete`, `methode_next_lesson`

**Content:**
- `methode_objectives`, `methode_lesson`, `methode_lessons`
- `methode_block_dialogue`, `methode_block_grammar`, etc.

**Audio:**
- `methode_play_all`, `methode_pause`
- `methode_speed_slow`, `methode_speed_normal`, `methode_speed_fast`

**See full list:** [`i18n.md`](../architecture/i18n.md)

## Best Practices

### 1. Always Use Lesson Creation Guide

Before creating or modifying ANY lesson, read:
[`LESSON_CREATION_GUIDE.md`](../guides/LESSON_CREATION_GUIDE.md)

### 2. Test on Multiple Scenarios

Test lessons with:
- Different interface languages (fr/ru/en)
- Different learning languages (fr/ru)
- Different spoken languages (fr/ru/en)
- Auth vs guest users

### 3. Validate Audio Before Insertion

Never insert audio URLs without:
1. Generating audio files
2. Uploading to R2
3. Testing playback
4. Verifying correct voice gender

### 4. Keep Blocks Focused

Each block should have ONE clear purpose:
- Dialogue → Conversation practice
- Grammar → ONE grammar point
- Vocabulary → Related words

Don't mix multiple concepts in one block.

### 5. Progressive Difficulty

Within a level, lessons should progressively increase in difficulty:
- Lesson 1: Basic concepts
- Lesson 2: Builds on lesson 1
- Lesson 3: Combines previous concepts
- ...

## Related Documentation

- [Lesson Creation Guide](../guides/LESSON_CREATION_GUIDE.md) - ⚠️ MUST READ
- [Course Blocks Structure](../COURSE_BLOCKS_STRUCTURE.md) - Block schemas
- [Database Architecture](../architecture/database.md) - Course tables
- [i18n System](../architecture/i18n.md) - Translation system
- [XP & Gamification](xp-gamification.md) - XP rewards
