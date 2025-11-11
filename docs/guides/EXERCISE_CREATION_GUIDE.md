# Exercise Creation Guide

## Overview

**CRITICAL: There are ONLY 3 types of exercises supported. All exercises MUST follow these exact models.**

This guide provides detailed instructions for creating exercises in Linguami. Always consult this guide before creating or modifying exercises.

## Supported Exercise Types

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

## Global Exercise Rules

### Exercise Titles

- MUST be displayed in user's browser language (not material language)
- Component automatically translates titles based on locale
- French: Use appropriate French title
- English: Use appropriate English title
- Russian: Use appropriate Russian title

### Exercise Language

- `lang` field MUST match material language
- Questions can be translated for UI, but content stays in material language
- See specific exercise sections below for exact field naming rules

### DO NOT Create

- Classic Fill-in-the-Blank without audio
- Exercises with different question/pair counts than specified
- Any other exercise types not listed above

---

## 1. Audio Dictation Fill-in-the-Blank

### Overview

**IMPORTANT: Always use this exact process when creating FITB exercises with audio.**

Extract 6 sentences from material, each with ONE blank. User listens to complete audio and fills in the missing word.

### Exercise Title Display

- Title MUST be displayed in user's browser language (not material language)
- French: "Compréhension auditive"
- English: "Listening Comprehension"
- Russian: "Понимание на слух"

### Format

- Extract **6 sentences** from the material text
- Each sentence has **ONE blank** (missing word) indicated by `___`
- Audio file plays the **complete sentence** (including the missing word)
- User listens and fills in **only the missing word**

### Data Structure

```json
{
  "type": "fill_in_blank",
  "material_id": 158,
  "title": "Понимание на слух",
  "level": "intermediate",
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
      },
      {
        "id": 2,
        "audioUrl": "https://linguami-cdn.etreailleurs.workers.dev/audio/exercises/ru/material_158/sentence_2.m4a",
        "sentenceWithBlank": "Гора находится на ___ 417 метров.",
        "sentenceWithBlank_en": "The mountain is at an ___ of 417 meters.",
        "sentenceWithBlank_fr": "La montagne se trouve à une ___ de 417 mètres.",
        "correctAnswer": "высоте",
        "correctAnswer_en": "altitude",
        "correctAnswer_fr": "altitude"
      }
      // ... 4 more sentences (6 TOTAL)
    ]
  }
}
```

### Field Naming Rules

**CRITICAL:** Component uses base fields for display, NOT suffixed versions.

- **Base field** (no suffix): Material language
  - `sentenceWithBlank` - Sentence in material language
  - `correctAnswer` - Answer in material language

- **Suffixed fields**: Translations for UI in other languages
  - `sentenceWithBlank_en` - English translation (for English UI users)
  - `sentenceWithBlank_fr` - French translation (for French UI users)
  - `sentenceWithBlank_ru` - Russian translation (for Russian UI users)
  - `correctAnswer_en` - English answer
  - `correctAnswer_fr` - French answer
  - `correctAnswer_ru` - Russian answer

### Audio Generation Process

**Step 1: Extract 6 Key Sentences**

Choose sentences that:
- Contain important vocabulary
- Represent key concepts
- Are grammatically interesting
- Have clear context

**Step 2: Generate Audio via ElevenLabs API**

**Voices:**
- Russian materials: `Ekaterina` (ID: `C3FusDjPequ6qFchqpzu`)
- French materials: Voice ID `5jCmrHdxbpU36l1wb3Ke`

**Settings:**
- Model: `eleven_turbo_v2_5` (v3)
- Stability: 0.5
- Similarity boost: 0.75

**Step 3: Upload to Cloudflare R2**

**Path pattern:**
```
audio/exercises/{lang}/material_{id}/sentence_{num}.m4a
```

**Examples:**
- `audio/exercises/ru/material_158/sentence_1.m4a`
- `audio/exercises/fr/material_481/sentence_1.m4a`

Use AWS S3 SDK (R2 is S3-compatible).

**Step 4: Update Exercise in Database**

Insert exercise with all audio URLs.

### Automated Script (RECOMMENDED)

**Script:** `scripts/create-fitb-audio.js`

**Usage:**

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
  },
  {
    "id": 2,
    "fullText": "Le lavandin pousse dans cette région.",
    "sentenceWithBlank": "Le ___ pousse dans cette région.",
    "sentenceWithBlank_en": "___ grows in this region.",
    "sentenceWithBlank_ru": "___ растёт в этом регионе.",
    "correctAnswer": "lavandin",
    "correctAnswer_en": "lavender",
    "correctAnswer_ru": "лаванда"
  }
  // ... 4 more sentences
]

# Step 2: Run the script
node scripts/create-fitb-audio.js <material_id> <sentences_json_file>

# Example:
node scripts/create-fitb-audio.js 481 sentences-481.json
```

**What the script does:**
- Fetches material from DB to get language
- Selects correct voice (Ekaterina for ru, Sébastien for fr)
- Generates audio for each sentence via ElevenLabs
- Uploads to R2 with correct path structure
- Creates exercise in database with all fields

### Component Detection

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

### Key Features

- **Russian text normalization:** `е` and `ё` are treated as equivalent
- **Inline display:** Number + Play button + Sentence on same line
- **Audio controls:** Play/pause with visual feedback
- **Small input field:** For single word answer
- **Real-time validation:** Immediate feedback

---

## 2. Drag and Drop - Vocabulary Association

### Overview

**IMPORTANT: Drag and Drop exercises MUST have exactly 6 vocabulary pairs.**

Match words in material language (left) with their translations (right).

### Exercise Title Display

- Title MUST be displayed in user's browser language (not material language)
- French: "Association de vocabulaire"
- English: "Vocabulary Association"
- Russian: "Ассоциация слов"

### Format

- Extract **6 key vocabulary words** from the material text
- Each pair: word in material language (left) + translation (right)
- Pairs include all 3 language translations for UI flexibility

### Data Structure

```json
{
  "type": "drag_and_drop",
  "material_id": 481,
  "title": "Association de vocabulaire",
  "level": "intermediate",
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
        },
        {
          "id": 2,
          "left": {
            "en": "truffe",
            "fr": "truffe",
            "ru": "truffe"
          },
          "right": {
            "en": "truffle",
            "fr": "truffe",
            "ru": "трюфель"
          }
        }
        // ... 4 more pairs (6 TOTAL REQUIRED)
      ]
    }]
  }
}
```

### Field Naming Rules

**Left side:** Word in material language, REPEATED in all locales

- For FR material: `left: { en: "mot", fr: "mot", ru: "mot" }`
- For RU material: `left: { en: "слово", fr: "слово", ru: "слово" }`

**Right side:** Translations in all locales

- Component displays the translation matching user's browser locale
- Each side has all 3 locales: `fr`, `en`, `ru`

### Example Pairs for French Material

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

### How It Displays to Users

- **FR material + RU browser:** Left shows "lavandin" (FR) → Right shows "лаванда" (RU)
- **FR material + EN browser:** Left shows "lavandin" (FR) → Right shows "lavender" (EN)
- **RU material + FR browser:** Left shows "гора" (RU) → Right shows "montagne" (FR)
- **RU material + EN browser:** Left shows "гора" (RU) → Right shows "mountain" (EN)

### Automated Script (RECOMMENDED)

**Script:** `scripts/create-dragdrop.js`

**Usage:**

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
  },
  {
    "word": "altitude",
    "translations": {
      "en": "altitude",
      "fr": "hauteur",
      "ru": "высота"
    }
  },
  {
    "word": "patrimoine",
    "translations": {
      "en": "heritage",
      "fr": "héritage",
      "ru": "наследие"
    }
  },
  {
    "word": "archéologique",
    "translations": {
      "en": "archaeological",
      "fr": "archéologique",
      "ru": "археологический"
    }
  },
  {
    "word": "orageux",
    "translations": {
      "en": "stormy",
      "fr": "orageux",
      "ru": "грозовой"
    }
  }
]

# Step 2: Run the script
node scripts/create-dragdrop.js <material_id> <pairs_json_file>

# Example:
node scripts/create-dragdrop.js 481 pairs-481.json
```

**What the script does:**
- Fetches material from DB to get language
- Structures left side (material word repeated in all locales)
- Structures right side (translations in all locales)
- Determines exercise title based on material language
- Creates exercise in database with correct format

### Manual Creation (If Needed)

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

### Reference Exercises

- **Exercise ID 13** (Material 121 "Эльбрус", RU): Complete example with Russian material
  - Left: `{ en: "гора", fr: "гора", ru: "гора" }` (RU word repeated)
  - Right: `{ en: "mountain", fr: "montagne", ru: "гора" }` (Translations)

- **Exercise ID 74** (Material 481 "Le plateau de Valensole", FR): Complete example with French material
  - Left: `{ en: "lavandin", fr: "lavandin", ru: "lavandin" }` (FR word repeated)
  - Right: `{ en: "lavender", fr: "lavande", ru: "лаванда" }` (Translations)

---

## 3. Multiple Choice Questions - Text Comprehension

### Overview

**IMPORTANT: MCQ exercises MUST have exactly 6 questions with 4 options each.**

Test reading comprehension with multiple choice questions about the material text.

### Exercise Title Display

- Title MUST be displayed in user's browser language (not material language)
- French: "Compréhension du texte"
- English: "Text Comprehension"
- Russian: "Понимание текста"

### Format

- Create **6 comprehension questions** about the material text
- Each question has **exactly 4 options** (A, B, C, D)
- Questions must be **well-thought and relevant** to test understanding
- **Questions:** Translated for display in user's browser language
- **Answer options:** ALWAYS in material language (no translations)

### Data Structure

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
      // ... 5 more questions (6 TOTAL REQUIRED)
    ]
  }
}
```

### Field Naming Rules

- **question:** The question text in material language
- **question_en, question_ru:** Question translations for UI
- **options[].text:** Answer text in material language ONLY (no translations)
- **correctAnswer:** The correct option key (A, B, C, or D)
- **explanation:** Explanation in material language (optional)
- **explanation_en, explanation_ru:** Explanation translations (optional)

### How It Displays to Users

- **FR material + RU browser:** Question shows Russian translation, options show French text
- **FR material + EN browser:** Question shows English translation, options show French text
- **RU material + FR browser:** Question shows French translation, options show Russian text
- **RU material + EN browser:** Question shows English translation, options show Russian text

### Question Writing Guidelines

1. **Factual questions:** Test specific information from the text
   - Example: "Dans quelle région se trouve...?"

2. **Comprehension questions:** Test understanding of concepts
   - Example: "Pourquoi le plateau est-il célèbre?"

3. **Inference questions:** Test ability to draw conclusions
   - Example: "Que peut-on déduire du texte?"

4. **Vocabulary questions:** Test understanding of key terms
   - Example: "Que signifie le mot 'lavandin'?"

5. **Detail questions:** Test attention to important details
   - Example: "Combien de temps dure la floraison?"

6. **Main idea questions:** Test overall understanding
   - Example: "Quel est le sujet principal du texte?"

### Automated Script (RECOMMENDED)

**Script:** `scripts/create-mcq.js`

**Usage:**

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

**What the script does:**
- Fetches material from DB to get language
- Structures questions with material language + translations
- Structures options in material language ONLY (no translations)
- Determines exercise title based on material language
- Validates 6 questions with 4 options each
- Creates exercise in database

### Reference Exercise

- **Exercise ID 70** (Material 481 "Le plateau de Valensole", FR): Complete MCQ example
  - 5 questions (older format, should be 6 now)
  - Questions have FR + EN + RU translations
  - Options have translations (legacy format - new format has no option translations)

---

## Common Errors to Avoid

### ❌ Error 1: Wrong Question/Pair Count

```javascript
// ❌ Wrong - Only 4 sentences
{
  "data": {
    "sentences": [
      { "id": 1, ... },
      { "id": 2, ... },
      { "id": 3, ... },
      { "id": 4, ... }
    ]
  }
}

// ✅ Correct - 6 sentences
{
  "data": {
    "sentences": [
      { "id": 1, ... },
      { "id": 2, ... },
      { "id": 3, ... },
      { "id": 4, ... },
      { "id": 5, ... },
      { "id": 6, ... }
    ]
  }
}
```

### ❌ Error 2: Missing Translations

```javascript
// ❌ Wrong - No English/Russian translations
{
  "sentenceWithBlank": "Le plateau de Valensole est une région ___ de France.",
  "correctAnswer": "naturelle"
}

// ✅ Correct - All translations included
{
  "sentenceWithBlank": "Le plateau de Valensole est une région ___ de France.",
  "sentenceWithBlank_en": "The Valensole plateau is a ___ region of France.",
  "sentenceWithBlank_ru": "Плато Валансоль — это ___ регион Франции.",
  "correctAnswer": "naturelle",
  "correctAnswer_en": "natural",
  "correctAnswer_ru": "природный"
}
```

### ❌ Error 3: Wrong Field Structure for Drag-Drop

```javascript
// ❌ Wrong - Left side not repeated
{
  "left": {
    "fr": "lavandin"  // Missing en and ru
  }
}

// ✅ Correct - Left side repeated in all locales
{
  "left": {
    "en": "lavandin",
    "fr": "lavandin",
    "ru": "lavandin"
  }
}
```

### ❌ Error 4: Translating MCQ Options

```javascript
// ❌ Wrong - Options have translations
{
  "options": [
    { "key": "A", "text": "Paris", "text_en": "Paris", "text_ru": "Париж" }
  ]
}

// ✅ Correct - Options ONLY in material language
{
  "options": [
    { "key": "A", "text": "Paris" }
  ]
}
```

### ❌ Error 5: Wrong Audio Path

```javascript
// ❌ Wrong - Inconsistent path
"audioUrl": "https://linguami-cdn.etreailleurs.workers.dev/exercises/sentence_1.m4a"

// ✅ Correct - Follows pattern
"audioUrl": "https://linguami-cdn.etreailleurs.workers.dev/audio/exercises/fr/material_481/sentence_1.m4a"
```

### ❌ Error 6: Wrong Lang Field

```javascript
// ❌ Wrong - Lang doesn't match material
{
  "material_id": 481,  // Material is French
  "lang": "ru"         // Wrong!
}

// ✅ Correct - Lang matches material
{
  "material_id": 481,  // Material is French
  "lang": "fr"         // Correct!
}
```

---

## Checklist Before Insertion

Before inserting any exercise into the database, verify:

**General:**
- [ ] Exercise type is one of the 3 supported types
- [ ] `material_id` is correct
- [ ] `lang` matches material language
- [ ] `level` is appropriate (beginner/intermediate/advanced)
- [ ] `xp_reward` is correct (10 for FITB/DragDrop, 15 for MCQ)

**Audio Dictation FITB:**
- [ ] Exactly 6 sentences
- [ ] Each sentence has ONE blank
- [ ] All audio URLs are valid and uploaded to R2
- [ ] Audio path follows pattern: `audio/exercises/{lang}/material_{id}/sentence_{num}.m4a`
- [ ] All translations present (_en, _fr, _ru for both sentence and answer)
- [ ] Audio voice matches material language (Ekaterina for RU, Sébastien for FR)

**Drag and Drop:**
- [ ] Exactly 6 pairs
- [ ] Left side: Material word repeated in all locales (en, fr, ru)
- [ ] Right side: Translations in all locales (en, fr, ru)
- [ ] All translations are accurate

**MCQ:**
- [ ] Exactly 6 questions
- [ ] Each question has exactly 4 options (A, B, C, D)
- [ ] Question translations present (question_en, question_ru)
- [ ] Options ONLY in material language (no translations)
- [ ] `correctAnswer` is valid option key (A/B/C/D)
- [ ] Explanations present and translated (optional but recommended)
- [ ] Questions test different aspects (factual, comprehension, inference, etc.)

---

## Related Documentation

- [Interactive Exercise System](../features/exercises.md) - Exercise system overview
- [Database Architecture](../architecture/database.md) - Exercise tables schema
- [i18n System](../architecture/i18n.md) - Translation system
