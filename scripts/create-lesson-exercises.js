#!/usr/bin/env node
/**
 * Script to create 3 exercises for a standalone lesson:
 * 1. MCQ (5 questions, 3 options each)
 * 2. Drag and Drop
 * 3. Fill in the Blank
 *
 * Usage: node scripts/create-lesson-exercises.js <lesson-slug>
 * Example: node scripts/create-lesson-exercises.js alphabet-sons-et-accents
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createExercisesForLesson(lessonSlug) {
  console.log(`\n🎯 Creating exercises for lesson: ${lessonSlug}\n`)

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

  // Step 2: Create MCQ Exercise
  console.log('📝 Creating MCQ exercise...')
  const mcqExercise = {
    parent_type: 'lesson',
    parent_id: lesson.id,
    type: 'mcq',
    title: 'Compréhension de la leçon',
    lang: lesson.target_language,
    level: 'beginner',
    xp_reward: 15,
    data: {
      questions: [
        {
          id: 1,
          question: 'Question 1 - À compléter',
          question_en: 'Question 1 - To complete',
          question_ru: 'Вопрос 1 - Заполнить',
          options: [
            { key: 'A', text: 'Réponse A' },
            { key: 'B', text: 'Réponse B' },
            { key: 'C', text: 'Réponse C' }
          ],
          correctAnswer: 'A',
          explanation: 'Explication de la réponse correcte'
        },
        {
          id: 2,
          question: 'Question 2 - À compléter',
          question_en: 'Question 2 - To complete',
          question_ru: 'Вопрос 2 - Заполнить',
          options: [
            { key: 'A', text: 'Réponse A' },
            { key: 'B', text: 'Réponse B' },
            { key: 'C', text: 'Réponse C' }
          ],
          correctAnswer: 'B',
          explanation: 'Explication de la réponse correcte'
        },
        {
          id: 3,
          question: 'Question 3 - À compléter',
          question_en: 'Question 3 - To complete',
          question_ru: 'Вопрос 3 - Заполнить',
          options: [
            { key: 'A', text: 'Réponse A' },
            { key: 'B', text: 'Réponse B' },
            { key: 'C', text: 'Réponse C' }
          ],
          correctAnswer: 'C',
          explanation: 'Explication de la réponse correcte'
        },
        {
          id: 4,
          question: 'Question 4 - À compléter',
          question_en: 'Question 4 - To complete',
          question_ru: 'Вопрос 4 - Заполнить',
          options: [
            { key: 'A', text: 'Réponse A' },
            { key: 'B', text: 'Réponse B' },
            { key: 'C', text: 'Réponse C' }
          ],
          correctAnswer: 'A',
          explanation: 'Explication de la réponse correcte'
        },
        {
          id: 5,
          question: 'Question 5 - À compléter',
          question_en: 'Question 5 - To complete',
          question_ru: 'Вопрос 5 - Заполнить',
          options: [
            { key: 'A', text: 'Réponse A' },
            { key: 'B', text: 'Réponse B' },
            { key: 'C', text: 'Réponse C' }
          ],
          correctAnswer: 'B',
          explanation: 'Explication de la réponse correcte'
        }
      ]
    }
  }

  const { data: mcqData, error: mcqError } = await supabase
    .from('exercises')
    .insert(mcqExercise)
    .select()

  if (mcqError) {
    console.error('❌ Error creating MCQ:', mcqError.message)
  } else {
    console.log(`✅ MCQ created (ID: ${mcqData[0].id})`)
  }

  // Step 3: Create Drag and Drop Exercise
  console.log('\n🎯 Creating Drag and Drop exercise...')
  const dragDropExercise = {
    parent_type: 'lesson',
    parent_id: lesson.id,
    type: 'drag_and_drop',
    title: 'Association de vocabulaire',
    lang: lesson.target_language,
    level: 'beginner',
    xp_reward: 15,
    data: {
      pairs: [
        { fr: 'Mot 1 - À compléter', translation: 'Translation 1' },
        { fr: 'Mot 2 - À compléter', translation: 'Translation 2' },
        { fr: 'Mot 3 - À compléter', translation: 'Translation 3' },
        { fr: 'Mot 4 - À compléter', translation: 'Translation 4' },
        { fr: 'Mot 5 - À compléter', translation: 'Translation 5' }
      ]
    }
  }

  const { data: dragData, error: dragError } = await supabase
    .from('exercises')
    .insert(dragDropExercise)
    .select()

  if (dragError) {
    console.error('❌ Error creating Drag and Drop:', dragError.message)
  } else {
    console.log(`✅ Drag and Drop created (ID: ${dragData[0].id})`)
  }

  // Step 4: Create Fill in the Blank Exercise
  console.log('\n✍️  Creating Fill in the Blank exercise...')
  const fitbExercise = {
    parent_type: 'lesson',
    parent_id: lesson.id,
    type: 'fill_in_blank',
    title: 'Compléter les phrases',
    lang: lesson.target_language,
    level: 'beginner',
    xp_reward: 20,
    data: {
      sentences: [
        {
          id: 1,
          sentence: 'Phrase 1 avec un ___ à compléter.',
          answer: 'mot',
          hint: 'Indice pour aider'
        },
        {
          id: 2,
          sentence: 'Phrase 2 avec un ___ à compléter.',
          answer: 'autre mot',
          hint: 'Indice pour aider'
        },
        {
          id: 3,
          sentence: 'Phrase 3 avec un ___ à compléter.',
          answer: 'dernier mot',
          hint: 'Indice pour aider'
        },
        {
          id: 4,
          sentence: 'Phrase 4 avec un ___ à compléter.',
          answer: 'réponse',
          hint: 'Indice pour aider'
        },
        {
          id: 5,
          sentence: 'Phrase 5 avec un ___ à compléter.',
          answer: 'solution',
          hint: 'Indice pour aider'
        }
      ]
    }
  }

  const { data: fitbData, error: fitbError } = await supabase
    .from('exercises')
    .insert(fitbExercise)
    .select()

  if (fitbError) {
    console.error('❌ Error creating Fill in the Blank:', fitbError.message)
  } else {
    console.log(`✅ Fill in the Blank created (ID: ${fitbData[0].id})`)
  }

  console.log('\n🎉 All exercises created successfully!')
  console.log('\n⚠️  IMPORTANT: The exercises have placeholder content.')
  console.log('   You need to edit them with real questions based on the lesson content.')
  console.log(`\n   Visit: http://localhost:3000/admin/exercises to edit them.\n`)
}

// Get lesson slug from command line argument
const lessonSlug = process.argv[2]

if (!lessonSlug) {
  console.error('❌ Usage: node scripts/create-lesson-exercises.js <lesson-slug>')
  console.error('   Example: node scripts/create-lesson-exercises.js alphabet-sons-et-accents')
  process.exit(1)
}

createExercisesForLesson(lessonSlug)
