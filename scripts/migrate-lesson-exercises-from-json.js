#!/usr/bin/env node
/**
 * Script to migrate exercise_inline blocks from lesson JSON to exercises table
 *
 * Ensures exactly 3 exercises per lesson (MCQ, Drag-and-drop, FITB):
 * - If duplicate types: keeps the best one (most questions)
 * - If missing types: creates placeholder
 * - Adds proper titles, XP rewards, and parent references
 * - Removes exercise_inline blocks from JSON after migration
 *
 * Usage: node scripts/migrate-lesson-exercises-from-json.js <lesson-slug>
 * Example: node scripts/migrate-lesson-exercises-from-json.js alphabet-sons-et-accents
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Title templates by type and language
const TITLES = {
  multipleChoice: {
    fr: 'Compréhension de la leçon',
    ru: 'Понимание урока',
    en: 'Lesson comprehension'
  },
  dragAndDrop: {
    fr: 'Association de vocabulaire',
    ru: 'Словарные пары',
    en: 'Vocabulary matching'
  },
  fillInBlank: {
    fr: 'Compléter les phrases',
    ru: 'Заполнить пропуски',
    en: 'Fill in the blanks'
  }
}

// XP rewards by type
const XP_REWARDS = {
  multipleChoice: 15,
  dragAndDrop: 15,
  fillInBlank: 20
}

function normalizeExerciseType(type) {
  if (type === 'multipleChoice') return 'mcq'
  if (type === 'dragAndDrop') return 'drag_and_drop'
  if (type === 'fillInBlank') return 'fill_in_blank'
  return type
}

function getExerciseQuality(exercise) {
  // Quality score based on number of questions
  const questionCount = exercise.questions?.length || exercise.pairs?.length || 0
  return questionCount
}

function createPlaceholderExercise(type, lang) {
  console.log(`⚠️  Creating placeholder for missing ${type} exercise`)

  if (type === 'multipleChoice') {
    return {
      exerciseType: 'multipleChoice',
      questions: Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        question: `Question ${i + 1} - À compléter`,
        options: [
          { key: 'A', text: 'Réponse A' },
          { key: 'B', text: 'Réponse B' },
          { key: 'C', text: 'Réponse C' }
        ],
        correctAnswer: ['A', 'B', 'C'][i % 3],
        explanation: 'Explication à ajouter'
      })),
      xpReward: XP_REWARDS.multipleChoice
    }
  }

  if (type === 'dragAndDrop') {
    return {
      exerciseType: 'dragAndDrop',
      pairs: Array.from({ length: 5 }, (_, i) => ({
        fr: `Mot ${i + 1} - À compléter`,
        translation: `Translation ${i + 1}`
      })),
      xpReward: XP_REWARDS.dragAndDrop
    }
  }

  if (type === 'fillInBlank') {
    return {
      exerciseType: 'fillInBlank',
      questions: Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        sentence: `Phrase ${i + 1} avec un ___ à compléter.`,
        answer: `mot${i + 1}`,
        hint: 'Indice à ajouter'
      })),
      xpReward: XP_REWARDS.fillInBlank
    }
  }
}

function convertToTableFormat(exercise, lesson) {
  const type = normalizeExerciseType(exercise.exerciseType)
  const titleKey = exercise.exerciseType

  let data = {}

  if (type === 'mcq') {
    data = {
      questions: exercise.questions.map(q => ({
        id: q.id,
        question: q.question,
        question_en: q.question_en || q.question,
        question_ru: q.question_ru || q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || ''
      }))
    }
  } else if (type === 'drag_and_drop') {
    data = {
      pairs: exercise.pairs
    }
  } else if (type === 'fill_in_blank') {
    data = {
      sentences: exercise.questions || exercise.sentences
    }
  }

  return {
    parent_type: 'lesson',
    parent_id: lesson.id,
    type,
    title: TITLES[titleKey][lesson.target_language] || TITLES[titleKey].fr,
    lang: lesson.target_language,
    level: lesson.level || 'beginner',
    xp_reward: exercise.xpReward || XP_REWARDS[exercise.exerciseType] || 15,
    data
  }
}

async function migrateLessonExercises(lessonSlug) {
  console.log(`\n🔄 Migrating exercises for lesson: ${lessonSlug}\n`)

  // Step 1: Get the lesson
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('slug', lessonSlug)
    .single()

  if (lessonError || !lesson) {
    console.error(`❌ Lesson not found: ${lessonSlug}`)
    process.exit(1)
  }

  console.log(`📖 Lesson: ${lesson.title_fr} (ID: ${lesson.id})`)
  console.log(`   Target language: ${lesson.target_language}`)
  console.log(`   Level: ${lesson.level}\n`)

  // Step 2: Extract exercises from JSON blocks (prefer blocks in target language)
  const blocksKey = `blocks_${lesson.target_language === 'ru' ? 'ru' : lesson.target_language === 'fr' ? 'fr' : 'en'}`
  const blocks = lesson[blocksKey] || lesson.blocks_en || lesson.blocks_fr || []

  console.log(`📦 Reading from ${blocksKey}:`, blocks.length, 'blocks')

  const exerciseBlocks = blocks.filter(b => b.type === 'exercise_inline')
  console.log(`🎯 Found ${exerciseBlocks.length} exercise_inline blocks\n`)

  if (exerciseBlocks.length === 0) {
    console.log('⚠️  No exercise_inline blocks found. Nothing to migrate.')
    return
  }

  // Step 3: Group by type and select best of each
  const byType = {
    multipleChoice: [],
    dragAndDrop: [],
    fillInBlank: []
  }

  exerciseBlocks.forEach(ex => {
    const type = ex.exerciseType || 'fillInBlank'
    if (byType[type]) {
      byType[type].push(ex)
    }
  })

  console.log('📊 Exercises by type:')
  console.log('  MCQ:', byType.multipleChoice.length)
  console.log('  Drag & Drop:', byType.dragAndDrop.length)
  console.log('  Fill in Blank:', byType.fillInBlank.length)
  console.log()

  // Step 4: Select best of each type
  const selectedExercises = []

  for (const [type, exercises] of Object.entries(byType)) {
    if (exercises.length === 0) {
      // Missing type - create placeholder
      selectedExercises.push(createPlaceholderExercise(type, lesson.target_language))
    } else if (exercises.length === 1) {
      // Only one - use it
      console.log(`✅ Using ${type} exercise (${getExerciseQuality(exercises[0])} questions)`)
      selectedExercises.push(exercises[0])
    } else {
      // Multiple - select best
      exercises.sort((a, b) => getExerciseQuality(b) - getExerciseQuality(a))
      console.log(`✅ Multiple ${type} found - selecting best (${getExerciseQuality(exercises[0])} questions)`)
      console.log(`   Skipping ${exercises.length - 1} duplicate(s)`)
      selectedExercises.push(exercises[0])
    }
  }

  console.log(`\n✨ Final selection: ${selectedExercises.length} exercises\n`)

  // Step 5: Insert into exercises table
  const exercisesToInsert = selectedExercises.map(ex => convertToTableFormat(ex, lesson))

  console.log('💾 Inserting into exercises table...\n')

  for (const exercise of exercisesToInsert) {
    const { data, error } = await supabase
      .from('exercises')
      .insert(exercise)
      .select()

    if (error) {
      console.error(`❌ Error inserting ${exercise.type}:`, error.message)
    } else {
      console.log(`✅ ${exercise.type.toUpperCase()} created (ID: ${data[0].id}) - ${exercise.title} - ${exercise.xp_reward} XP`)
    }
  }

  // Step 6: Remove exercise_inline blocks from JSON
  console.log('\n🧹 Cleaning up exercise_inline blocks from JSON...')

  const cleanedBlocks = blocks.filter(b => b.type !== 'exercise_inline')

  const { error: updateError } = await supabase
    .from('lessons')
    .update({ [blocksKey]: cleanedBlocks })
    .eq('id', lesson.id)

  if (updateError) {
    console.error('❌ Error updating lesson blocks:', updateError.message)
  } else {
    console.log(`✅ Removed ${exerciseBlocks.length} exercise_inline blocks from ${blocksKey}`)
  }

  console.log('\n🎉 Migration completed successfully!')
  console.log(`\n✨ Visit: http://localhost:3000/${lesson.target_language}/lessons?slug=${lessonSlug}`)
  console.log('   You should now see 3 exercises at the bottom of the lesson!\n')
}

// Get lesson slug from command line
const lessonSlug = process.argv[2]

if (!lessonSlug) {
  console.error('❌ Usage: node scripts/migrate-lesson-exercises-from-json.js <lesson-slug>')
  console.error('   Example: node scripts/migrate-lesson-exercises-from-json.js alphabet-sons-et-accents')
  process.exit(1)
}

migrateLessonExercises(lessonSlug)
