#!/usr/bin/env node
/**
 * Script to fix exercise content for lesson "alphabet-sons-et-accents"
 * - Questions should be in target language (French)
 * - Translations in spoken languages (English, Russian)
 * - Proper French alphabet content
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const LESSON_ID = 1
const LESSON_SLUG = 'alphabet-sons-et-accents'

// MCQ Exercise - Questions in French with translations
const mcqData = {
  questions: [
    {
      id: 1,
      question: "Combien de lettres compte l'alphabet français ?",
      question_en: "How many letters are in the French alphabet?",
      question_ru: "Сколько букв во французском алфавите?",
      options: [
        { key: 'A', text: '26' },
        { key: 'B', text: '24' },
        { key: 'C', text: '28' }
      ],
      correctAnswer: 'A',
      explanation: "L'alphabet français compte 26 lettres, comme l'alphabet anglais."
    },
    {
      id: 2,
      question: "Quel accent peut apparaître sur la lettre 'e' ?",
      question_en: "Which accent can appear on the letter 'e'?",
      question_ru: "Какой акцент может стоять над буквой 'e'?",
      options: [
        { key: 'A', text: 'Accent aigu (é)' },
        { key: 'B', text: 'Accent circonflexe (ê)' },
        { key: 'C', text: 'Les deux' }
      ],
      correctAnswer: 'C',
      explanation: "La lettre 'e' peut avoir un accent aigu (é), grave (è) ou circonflexe (ê)."
    },
    {
      id: 3,
      question: "Comment s'appelle ce symbole : ç ?",
      question_en: "What is this symbol called: ç?",
      question_ru: "Как называется этот символ: ç?",
      options: [
        { key: 'A', text: 'Cédille' },
        { key: 'B', text: 'Tréma' },
        { key: 'C', text: 'Apostrophe' }
      ],
      correctAnswer: 'A',
      explanation: "Le ç s'appelle 'c cédille' et se prononce [s]."
    },
    {
      id: 4,
      question: "Quelle est la prononciation du 'h' en français ?",
      question_en: "How is 'h' pronounced in French?",
      question_ru: "Как произносится 'h' во французском языке?",
      options: [
        { key: 'A', text: 'Comme en anglais' },
        { key: 'B', text: 'Il est muet' },
        { key: 'C', text: 'Comme [r]' }
      ],
      correctAnswer: 'B',
      explanation: "Le 'h' est généralement muet en français."
    },
    {
      id: 5,
      question: "Combien de voyelles y a-t-il dans l'alphabet français ?",
      question_en: "How many vowels are in the French alphabet?",
      question_ru: "Сколько гласных во французском алфавите?",
      options: [
        { key: 'A', text: '5' },
        { key: 'B', text: '6' },
        { key: 'C', text: '7' }
      ],
      correctAnswer: 'B',
      explanation: "Il y a 6 voyelles : a, e, i, o, u, y."
    }
  ]
}

// Drag and Drop - French words with translations
const dragDropData = {
  pairs: [
    { fr: 'accent aigu', translation: 'acute accent / острый акцент', translationEn: 'acute accent', translationRu: 'острый акцент' },
    { fr: 'accent grave', translation: 'grave accent / тупой акцент', translationEn: 'grave accent', translationRu: 'тупой акцент' },
    { fr: 'accent circonflexe', translation: 'circumflex / циркумфлекс', translationEn: 'circumflex', translationRu: 'циркумфлекс' },
    { fr: 'tréma', translation: 'diaeresis / трема', translationEn: 'diaeresis', translationRu: 'трема' },
    { fr: 'cédille', translation: 'cedilla / седиль', translationEn: 'cedilla', translationRu: 'седиль' }
  ]
}

// Fill in the Blank - French sentences
const fillInBlankData = {
  sentences: [
    {
      id: 1,
      sentence: "L'alphabet français compte ___ lettres.",
      answer: "26",
      hint: "Le même nombre que l'alphabet anglais"
    },
    {
      id: 2,
      sentence: "La lettre 'c' avec une cédille se prononce ___.",
      answer: "s",
      hint: "Comme dans 'français'"
    },
    {
      id: 3,
      sentence: "Le symbole sur le 'ê' s'appelle un accent ___.",
      answer: "circonflexe",
      hint: "Il ressemble à un petit chapeau"
    },
    {
      id: 4,
      sentence: "Les voyelles de l'alphabet français sont : a, e, i, o, u et ___.",
      answer: "y",
      hint: "Une lettre qui peut être voyelle ou consonne"
    },
    {
      id: 5,
      sentence: "Le 'h' est généralement ___ en français.",
      answer: "muet",
      hint: "On ne le prononce pas"
    }
  ]
}

async function fixExercises() {
  console.log('\n🔧 Fixing exercises for lesson:', LESSON_SLUG, '\n')

  // Update MCQ exercise
  console.log('📝 Updating MCQ exercise...')
  const { error: mcqError } = await supabase
    .from('exercises')
    .update({ data: mcqData })
    .eq('parent_type', 'lesson')
    .eq('parent_id', LESSON_ID)
    .eq('type', 'mcq')

  if (mcqError) {
    console.error('❌ Error updating MCQ:', mcqError.message)
  } else {
    console.log('✅ MCQ updated with proper French questions')
  }

  // Update Drag & Drop exercise
  console.log('\n🎯 Updating Drag & Drop exercise...')
  const { error: dragError } = await supabase
    .from('exercises')
    .update({ data: dragDropData })
    .eq('parent_type', 'lesson')
    .eq('parent_id', LESSON_ID)
    .eq('type', 'drag_and_drop')

  if (dragError) {
    console.error('❌ Error updating Drag & Drop:', dragError.message)
  } else {
    console.log('✅ Drag & Drop updated with French vocabulary')
  }

  // Update Fill in the Blank exercise
  console.log('\n✍️  Updating Fill in the Blank exercise...')
  const { error: fitbError } = await supabase
    .from('exercises')
    .update({ data: fillInBlankData })
    .eq('parent_type', 'lesson')
    .eq('parent_id', LESSON_ID)
    .eq('type', 'fill_in_blank')

  if (fitbError) {
    console.error('❌ Error updating Fill in Blank:', fitbError.message)
  } else {
    console.log('✅ Fill in Blank updated with French sentences')
  }

  console.log('\n🎉 All exercises fixed!')
  console.log(`\n✨ Visit: http://localhost:3000/fr/lessons?slug=${LESSON_SLUG}`)
  console.log('   Exercises should now be in French with proper translations!\n')
}

fixExercises()
