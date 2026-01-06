# Database Architecture

## Database & Supabase

**Client setup:**
- Browser: `createBrowserClient()` from `/lib/supabase.js`
- Server: `createServerClient(req, res)` from `/lib/supabase-server.js`

## Database Tables

### User & Profile

**`users_profile`** - User profile data
- `id` (uuid, FK to auth.users)
- `name` (text)
- `username` (text, unique)
- `avatar_id` (integer)
- `learning_language` (text) - Target language being studied (fr/ru/en)
- `spoken_language` (text) - Native language for explanations (fr/ru/en)
- `is_premium` (boolean)
- `role` (text) - user/admin
- `created_at` (timestamp)

**`user_xp_profile`** - XP and gamification data
- `user_id` (uuid, FK to users_profile)
- `total_xp` (integer)
- `current_level` (integer)
- `daily_streak` (integer)
- `total_gold` (integer)
- `weekly_xp` (integer)
- `monthly_xp` (integer)
- `last_activity_date` (date)

### Learning Materials

**`materials`** - Learning content (videos, books, articles)
- `id` (integer, PK)
- `title` (text)
- `slug` (text, unique)
- `section` (text) - Category (videos/books/articles)
- `lang` (text) - Material language (fr/ru/en)
- `level` (text) - Difficulty (beginner/intermediate/advanced)
- `content` (text) - Main text content
- `image_url` (text)
- `video_url` (text, nullable)
- `author` (text)
- `created_at` (timestamp)

**`user_materials`** - User's study progress on materials
- `id` (integer, PK)
- `user_id` (uuid, FK to users_profile)
- `material_id` (integer, FK to materials)
- `is_studying` (boolean)
- `created_at` (timestamp)

**`user_words`** - User's dictionary words
- `id` (integer, PK)
- `user_id` (uuid, FK to users_profile)
- `material_id` (integer, FK to materials)
- `word` (text) - The word in material language
- `translation` (text) - Translation in user's language
- `context` (text) - Sentence where word was found
- `created_at` (timestamp)

**`user_words_cards`** - SRS flashcard data
- `id` (integer, PK)
- `word_id` (integer, FK to user_words)
- `user_id` (uuid, FK to users_profile)
- `state` (text) - new/learning/review/relearning
- `ease_factor` (float) - Anki algorithm parameter
- `interval` (integer) - Days until next review
- `repetitions` (integer) - Number of successful reviews
- `last_review` (timestamp)
- `next_review` (timestamp)
- `created_at` (timestamp)

**`exercises`** - Interactive exercises
- `id` (integer, PK)
- `material_id` (integer, FK to materials)
- `type` (text) - mcq/fill_in_blank/drag_and_drop
- `title` (text)
- `level` (text) - beginner/intermediate/advanced
- `lang` (text) - Material language
- `xp_reward` (integer)
- `data` (jsonb) - Exercise content (questions/sentences/pairs)
- `created_at` (timestamp)

**`user_exercise_progress`** - User's exercise completion
- `id` (integer, PK)
- `user_id` (uuid, FK to users_profile)
- `exercise_id` (integer, FK to exercises)
- `score` (integer) - Percentage score (0-100)
- `attempts` (integer) - Number of attempts
- `completed_at` (timestamp)
- `xp_awarded` (boolean) - Whether XP was given (first time only)

### Method System (Structured Courses)

**`course_levels`** - CEFR proficiency levels
- `id` (integer, PK)
- `slug` (text, unique) - beginner/intermediate/advanced
- `name_fr` (text) - Débutant/Intermédiaire/Avancé
- `name_en` (text) - Beginner/Intermediate/Advanced
- `name_ru` (text) - Начинающий/Средний/Продвинутый
- `description_fr` (text)
- `description_en` (text)
- `description_ru` (text)
- `order_index` (integer)
- `is_free` (boolean) - Free or requires purchase
- `created_at` (timestamp)

**`courses`** - Language-specific courses
- `id` (integer, PK)
- `level_id` (integer, FK to course_levels)
- `target_language` (text) - Language being taught (fr/ru/en)
- `slug` (text, unique) - beginner-russian/intermediate-french
- `title_fr` (text) - Course title in French
- `title_en` (text) - Course title in English
- `title_ru` (text) - Course title in Russian
- `description_fr` (text)
- `description_en` (text)
- `description_ru` (text)
- `lang` (text) - ⚠️ OBSOLETE, use target_language instead
- `order_index` (integer)
- `created_at` (timestamp)

⚠️ **Important:** Courses are filtered by `target_language` (learning language), NOT by interface language.

### ⚠️ CRITICAL: Two Lesson Systems

**DO NOT CONFUSE:**

**1. Method Lessons** (`course_lessons` table):
- Structured course lessons with progression (A1, A2, etc.)
- Multilingual blocks: `blocks_fr`, `blocks_en`, `blocks_ru`
- Linked to `courses` via `course_id`
- Have exercises, XP rewards, audio
- Examples: "Alphabet cyrillique", "Verbes du 1er groupe"

**2. Standalone Lessons** (`lessons` table):
- Independent site content (tutorials, grammar explanations)
- Simpler structure, no multilingual blocks
- Not part of structured courses
- Examples: Blog posts, grammar tips

**`course_lessons`** - Method lessons with multilingual content
- `id` (integer, PK)
- `course_id` (integer, FK to courses)
- `slug` (text) - se-presenter/les-verbes-etre-avoir
- `title_fr` (text) - Lesson title in French
- `title_en` (text) - Lesson title in English
- `title_ru` (text) - Lesson title in Russian
- `objectives_fr` (jsonb) - Learning objectives in French
- `objectives_en` (jsonb) - Learning objectives in English
- `objectives_ru` (jsonb) - Learning objectives in Russian
- `blocks_fr` (jsonb) - Lesson content blocks for French speakers
- `blocks_en` (jsonb) - Lesson content blocks for English speakers
- `blocks_ru` (jsonb) - Lesson content blocks for Russian speakers
- `order_index` (integer)
- `estimated_duration` (integer) - Minutes
- `created_at` (timestamp)

⚠️ **Important:** `blocks_XX` is selected based on user's `spoken_language` (native language for explanations), NOT interface language.

**`user_course_access`** - Purchased course levels
- `id` (integer, PK)
- `user_id` (uuid, FK to users_profile)
- `level_id` (integer, FK to course_levels)
- `purchased_at` (timestamp)
- `expires_at` (timestamp, nullable) - Null = lifetime access

**`user_course_progress`** - Lesson completion tracking
- `id` (integer, PK)
- `user_id` (uuid, FK to users_profile)
- `lesson_id` (integer, FK to course_lessons)
- `completed_at` (timestamp)
- `time_spent` (integer) - Seconds spent on lesson

### XP & Gamification

**`xp_rewards_config`** - XP reward amounts per action
- `id` (integer, PK)
- `action` (text, unique) - Action identifier
  - material_started
  - material_completed
  - word_added
  - exercise_completed
  - lesson_completed
  - daily_goal
  - weekly_goal
  - monthly_goal
- `xp_amount` (integer) - XP awarded for action
- `description` (text)
- `created_at` (timestamp)

**`xp_transactions`** - XP transaction history
- `id` (integer, PK)
- `user_id` (uuid, FK to users_profile)
- `action` (text) - Action that triggered XP
- `xp_amount` (integer) - XP change (can be negative)
- `related_entity_type` (text) - material/exercise/lesson/etc
- `related_entity_id` (integer)
- `created_at` (timestamp)

### Content Management

**`lessons`** - Standalone lessons (NOT method courses)
- `id` (integer, PK)
- `title_fr` (text) - Lesson title in French
- `title_en` (text) - Lesson title in English
- `title_ru` (text) - Lesson title in Russian
- `slug` (text, unique)
- `target_language` (text) - Language being taught (fr/ru/en)
- `content` (jsonb or text) - Lesson content
- `created_at` (timestamp)
- `updated_at` (timestamp)

⚠️ **Note:** This table is for standalone lessons (tutorials, grammar tips). For structured method courses, use `course_lessons` table.

**`posts`** - Blog posts
- `id` (integer, PK)
- `title` (text)
- `slug` (text, unique)
- `content` (text)
- `lang` (text) - Post language (fr/ru/en)
- `author_id` (uuid, FK to users_profile)
- `published` (boolean)
- `thumbnail_url` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Row Level Security (RLS)

**All tables have RLS policies enabled:**
- Users can only access their own data
- Public read access for: materials, exercises, courses, course_levels, course_lessons, posts (published)
- Admin users bypass most restrictions via role check
- Service role key bypasses all RLS (use carefully in API routes)

**Example policy patterns:**

```sql
-- Users can only see their own words
CREATE POLICY "Users can view own words"
ON user_words FOR SELECT
USING (auth.uid() = user_id);

-- Anyone can view published materials
CREATE POLICY "Anyone can view materials"
ON materials FOR SELECT
USING (true);

-- Only admins can insert exercises
CREATE POLICY "Admins can insert exercises"
ON exercises FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users_profile
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

## Database Conventions

### Naming Conventions
- Table names: snake_case, plural (e.g., `user_words`)
- Column names: snake_case (e.g., `created_at`)
- Foreign keys: `{table_singular}_id` (e.g., `user_id`, `material_id`)
- Timestamps: `created_at`, `updated_at`

### Multilingual Columns
- Pattern: `{field}_{locale}` (e.g., `title_fr`, `title_en`, `title_ru`)
- Used for: titles, descriptions, names, objectives
- JSONB blocks: `blocks_fr`, `blocks_en`, `blocks_ru`

### Common Queries

**Get user with profile and XP:**
```javascript
const { data: user } = await supabase
  .from('users_profile')
  .select(`
    *,
    user_xp_profile (*)
  `)
  .eq('id', userId)
  .single()
```

**Get materials with user progress:**
```javascript
const { data: materials } = await supabase
  .from('materials')
  .select(`
    *,
    user_materials!left (is_studying)
  `)
  .eq('lang', learningLanguage)
  .eq('user_materials.user_id', userId)
```

**Get course lessons with user completion:**
```javascript
const { data: lessons } = await supabase
  .from('course_lessons')
  .select(`
    *,
    user_course_progress!left (completed_at)
  `)
  .eq('course_id', courseId)
  .eq('user_course_progress.user_id', userId)
  .order('order_index')
```

## Migrations

Migrations are stored in `/supabase/migrations/` and named with timestamp prefix:
- `20250110_create_courses_structure.sql`
- `20250111_add_multilingual_blocks.sql`
- `20250111_add_target_language_and_premium_discount.sql`

Apply migrations via **Supabase Dashboard SQL Editor** (production DB only):
1. Go to https://supabase.com/dashboard → SQL Editor
2. Copy migration file content
3. Execute in production

## Related Documentation

- [Authentication Flow](authentication.md)
- [State Management](state-management.md)
- [Method System Features](../features/method-courses.md)
- [Exercise System Features](../features/exercises.md)
