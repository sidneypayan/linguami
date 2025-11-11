# Interactive Exercise System

## Overview

Linguami provides interactive exercises for materials to reinforce learning through practice.

**Location:** `/components/exercises/`

**Database:** `exercises` table, `user_exercise_progress` table

## Exercise Types

### 1. Multiple Choice Questions (MCQ)

Questions with 2-6 answer options.

**Features:**
- Questions can have translations in fr, ru, en for UI
- Answer options in material language
- Explanations shown after answering
- Immediate feedback

**Example:**
```json
{
  "type": "mcq",
  "material_id": 481,
  "title": "Compréhension du texte",
  "level": "beginner",
  "lang": "fr",
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
    ]
  }
}
```

### 2. Fill in the Blank (Classic)

Text with `___` placeholders to fill in.

**Features:**
- Text-based word completion
- Case-insensitive validation
- Alternative answers support

**Example:**
```json
{
  "type": "fill_in_blank",
  "material_id": 123,
  "title": "Complete the sentences",
  "lang": "fr",
  "xp_reward": 10,
  "data": {
    "questions": [
      {
        "id": 1,
        "text": "Je ___ français.",
        "answer": "parle",
        "alternatives": ["parlais"]
      }
    ]
  }
}
```

### 3. Fill in the Blank (Audio Dictation)

Listen to audio and fill in the missing word.

**Features:**
- Audio playback with play/pause
- Russian text normalization (е = ё)
- Small input field for single word
- Real-time validation

**Example:**
```json
{
  "type": "fill_in_blank",
  "material_id": 158,
  "title": "Понимание на слух",
  "lang": "ru",
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
    ]
  }
}
```

**Component detection:**
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

### 4. Drag and Drop

Match pairs between two columns.

**Features:**
- Mobile-responsive touch support
- Visual feedback during dragging
- Randomized order
- Vocabulary association

**Example:**
```json
{
  "type": "drag_and_drop",
  "material_id": 481,
  "title": "Association de vocabulaire",
  "lang": "fr",
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
      ]
    }]
  }
}
```

## Exercise Flow

### 1. Loading Exercises

Exercises are automatically loaded for materials:

```javascript
import ExerciseSection from '@/components/exercises/ExerciseSection'

function MaterialPage({ material }) {
  return (
    <div>
      <MaterialContent material={material} />
      <ExerciseSection materialId={material.id} />
    </div>
  )
}
```

### 2. Completing Exercises

When user completes an exercise with 100% score:

```javascript
// In exercise component
const handleComplete = (score) => {
  if (score === 100) {
    // Submit to API for XP reward
    onComplete({ exerciseId, score: 100 })
  }
}

// In ExerciseSection
const handleExerciseComplete = async ({ exerciseId, score }) => {
  try {
    const response = await fetch('/api/exercises/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId, score })
    })

    const data = await response.json()

    if (data.xpAwarded) {
      toast.success(`Exercise completed! +${data.xpAmount} XP`)
    }
  } catch (error) {
    toast.error('Error submitting exercise')
  }
}
```

### 3. XP Rewards

XP is awarded on **first 100% completion only**:

```javascript
// pages/api/exercises/submit.js
export default async function handler(req, res) {
  const { exerciseId, score } = req.body
  const { data: { user } } = await supabase.auth.getUser()

  if (score !== 100) {
    return res.json({ xpAwarded: false })
  }

  // Check if user already completed this exercise
  const { data: progress } = await supabase
    .from('user_exercise_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('exercise_id', exerciseId)
    .eq('xp_awarded', true)
    .single()

  if (progress) {
    // Already got XP for this exercise
    return res.json({ xpAwarded: false })
  }

  // Get exercise XP reward
  const { data: exercise } = await supabase
    .from('exercises')
    .select('xp_reward')
    .eq('id', exerciseId)
    .single()

  // Award XP
  await supabase.rpc('add_xp', {
    p_user_id: user.id,
    p_xp_amount: exercise.xp_reward,
    p_action: 'exercise_completed'
  })

  // Record progress
  await supabase.from('user_exercise_progress').insert({
    user_id: user.id,
    exercise_id: exerciseId,
    score,
    attempts: 1,
    xp_awarded: true
  })

  res.json({ xpAwarded: true, xpAmount: exercise.xp_reward })
}
```

## Exercise Components

### ExerciseSection.jsx

**Location:** `/components/exercises/ExerciseSection.jsx`

Main container that:
- Loads exercises for a material
- Manages exercise selection
- Handles completion flow
- Shows exercise list

**Usage:**
```javascript
<ExerciseSection materialId={123} />
```

### MCQ.jsx

**Location:** `/components/exercises/MCQ.jsx`

Renders multiple choice questions with:
- Question text (translated if available)
- Answer options (material language)
- Submit button
- Score display
- Explanations after answering

### FillInTheBlank.jsx

**Location:** `/components/exercises/FillInTheBlank.jsx`

Classic fill-in-the-blank without audio:
- Text with blanks
- Text input fields
- Real-time validation
- Score feedback

### AudioDictation.jsx

**Location:** `/components/exercises/AudioDictation.jsx`

Audio-based fill-in-the-blank:
- Audio playback controls
- Sentence with blank
- Single word input
- Play/pause button
- Visual feedback
- Russian text normalization

**Russian normalization:**
```javascript
// е and ё are treated as equivalent
const normalize = (text) => text.toLowerCase().replace(/ё/g, 'е')
```

### DragAndDrop.jsx

**Location:** `/components/exercises/DragAndDrop.jsx`

Vocabulary association:
- Two columns (left = material word, right = translation)
- Drag-and-drop interaction
- Touch support for mobile
- Visual feedback
- Score display

## Multilingual Support

### Field Naming Convention

**Base field (no suffix):** Material language
```javascript
question: "Dans quelle région..."  // French
sentenceWithBlank: "Le plateau..."   // French
correctAnswer: "naturelle"           // French
```

**Suffixed fields:** Translations for UI
```javascript
question_en: "In which region..."    // English translation
question_ru: "В каком регионе..."    // Russian translation
sentenceWithBlank_en: "The plateau..." // English translation
correctAnswer_en: "natural"          // English translation
```

### Component Translation Logic

```javascript
import useTranslation from 'next-translate/useTranslation'

function MCQ({ exercise }) {
  const { lang } = useTranslation('common')
  const { questions } = exercise.data

  const getLocalizedQuestion = (question) => {
    // Get question in interface language if available
    const questionKey = lang === exercise.lang ? 'question' : `question_${lang}`
    return question[questionKey] || question.question
  }

  return questions.map(q => (
    <div key={q.id}>
      <p>{getLocalizedQuestion(q)}</p>
      {/* Options always in material language */}
      {q.options.map(opt => (
        <button key={opt.key}>{opt.text}</button>
      ))}
    </div>
  ))
}
```

## Exercise Creation

**See detailed guide:** [`../guides/EXERCISE_CREATION_GUIDE.md`](../guides/EXERCISE_CREATION_GUIDE.md)

**Quick reference:**

1. **Audio Dictation FITB** - 6 sentences with audio
2. **Drag and Drop** - 6 vocabulary pairs
3. **MCQ** - 6 questions with 4 options each

**Scripts:**
- `scripts/create-fitb-audio.js` - Generate audio dictation exercises
- `scripts/create-dragdrop.js` - Generate drag-and-drop exercises
- `scripts/create-mcq.js` - Generate MCQ exercises

## Admin Panel

**Location:** `/pages/admin/exercises/`

### Pages:

**`/admin/exercises`** - List all exercises
- View all exercises
- Filter by material/type
- Edit/delete exercises

**`/admin/exercises/create-fitb`** - Create Fill-in-the-Blank
- Audio or classic
- Material selection
- Sentence input
- Audio generation

**`/admin/exercises/create-mcq`** - Create MCQ
- Material selection
- Question/answer input
- Translations
- Validation

**`/admin/exercises/create-drag-drop`** - Create Drag-and-Drop
- Material selection
- Vocabulary pairs
- Translations

**`/admin/exercises/edit/[id]`** - Edit exercise
- Update content
- Regenerate audio
- Preview

**`/admin/exercises/preview/[id]`** - Preview exercise
- Test exercise
- See user view
- Validate functionality

## API Endpoints

### POST /api/exercises/submit

Submit exercise completion for XP reward.

**Request:**
```javascript
{
  exerciseId: 123,
  score: 100  // 0-100
}
```

**Response:**
```javascript
{
  xpAwarded: true,      // Whether XP was given
  xpAmount: 10,         // Amount of XP (if awarded)
  alreadyCompleted: false
}
```

**Rules:**
- Only 100% score qualifies for XP
- XP awarded once per exercise per user
- Progress tracked in `user_exercise_progress`

## Best Practices

### 1. Consistent Exercise Structure

All exercises must follow the standard format:
```javascript
{
  type: 'mcq|fill_in_blank|drag_and_drop',
  material_id: number,
  title: string,
  level: 'beginner|intermediate|advanced',
  lang: 'fr|ru|en',  // Material language
  xp_reward: number,
  data: {
    questions: [...] // or sentences: [...]
  }
}
```

### 2. Multilingual Fields

Always provide translations for questions/explanations:
```javascript
{
  question: "Текст на русском",      // Material language
  question_en: "English translation",
  question_fr: "Traduction française"
}
```

### 3. Audio File Paths

Use consistent R2 paths:
```
audio/exercises/{lang}/material_{id}/sentence_{num}.m4a
audio/exercises/fr/material_481/sentence_1.m4a
audio/exercises/ru/material_158/sentence_1.m4a
```

### 4. Validation

Always validate user answers case-insensitively:
```javascript
const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
```

For Russian, normalize е/ё:
```javascript
const normalize = (text) => text.toLowerCase().replace(/ё/g, 'е')
const isCorrect = normalize(userAnswer) === normalize(correctAnswer)
```

### 5. XP Rewards

Standard XP amounts:
- Fill-in-the-blank: 10 XP
- Drag-and-drop: 10 XP
- MCQ: 15 XP

## Related Documentation

- [Exercise Creation Guide](../guides/EXERCISE_CREATION_GUIDE.md) - Detailed exercise creation rules
- [Database Architecture](../architecture/database.md) - Exercise tables schema
- [XP & Gamification](xp-gamification.md) - XP system details
