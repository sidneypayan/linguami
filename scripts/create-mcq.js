#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createMCQExercise(materialId, questionsFile) {
  console.log(`\n🎯 Creating MCQ Exercise for Material ${materialId}\n`)

  // Get material from database
  const { data: material, error: materialError } = await supabase
    .from('materials')
    .select('*')
    .eq('id', materialId)
    .single()

  if (materialError || !material) {
    console.error(`❌ Material ${materialId} not found`)
    process.exit(1)
  }

  console.log(`📖 Material: ${material.title}`)
  console.log(`   Language: ${material.lang}`)
  console.log(`   Section: ${material.section}`)

  // Load questions from file
  let questions
  try {
    const fileContent = fs.readFileSync(questionsFile, 'utf8')
    questions = JSON.parse(fileContent)
  } catch (error) {
    console.error(`❌ Error reading questions file: ${error.message}`)
    process.exit(1)
  }

  // Validate questions
  if (!questions || questions.length !== 6) {
    console.error('❌ You must provide exactly 6 questions')
    process.exit(1)
  }

  // Validate structure
  for (const q of questions) {
    if (!q.question || !q.question_translations || !q.options || !q.correctAnswer) {
      console.error('❌ Each question must have: question, question_translations, options (4), correctAnswer')
      process.exit(1)
    }
    if (!q.question_translations.en || !q.question_translations.ru) {
      console.error('❌ Question translations must include en and ru')
      process.exit(1)
    }
    if (q.options.length !== 4) {
      console.error('❌ Each question must have exactly 4 options (A, B, C, D)')
      process.exit(1)
    }
  }

  // Build proper structure for MCQ
  const formattedQuestions = questions.map((q, index) => ({
    id: index + 1,
    // Question in material language
    question: q.question,
    // Question translations (for UI in other languages)
    question_en: q.question_translations.en,
    question_ru: q.question_translations.ru,
    // Options in material language ONLY (no translations)
    options: q.options.map((opt, i) => ({
      key: String.fromCharCode(65 + i), // A, B, C, D
      text: opt // Option text in material language only
    })),
    correctAnswer: q.correctAnswer,
    // Explanation in material language
    explanation: q.explanation || '',
    // Explanation translations (optional)
    explanation_en: q.explanation_translations?.en || '',
    explanation_ru: q.explanation_translations?.ru || ''
  }))

  console.log('\n📝 Creating exercise in database...')

  // Determine exercise title based on language
  const titles = {
    fr: 'Compréhension du texte',
    ru: 'Понимание текста',
    en: 'Text Comprehension'
  }

  // Create exercise in database
  const { data, error } = await supabase
    .from('exercises')
    .insert({
      material_id: materialId,
      type: 'mcq',
      title: titles[material.lang] || 'Text Comprehension',
      lang: material.lang,
      level: 'beginner',
      xp_reward: 15,
      data: {
        questions: formattedQuestions
      }
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Database error:', error)
    throw error
  }

  console.log('\n✅ MCQ exercise created successfully!')
  console.log(`   Exercise ID: ${data.id}`)
  console.log(`   Material ID: ${materialId}`)
  console.log(`   Type: mcq`)
  console.log(`   Title: ${titles[material.lang]}`)
  console.log(`   Language: ${material.lang}`)
  console.log(`   Number of questions: ${formattedQuestions.length}`)
  console.log('\n📋 Sample questions:')
  formattedQuestions.slice(0, 2).forEach((q, i) => {
    console.log(`   ${i + 1}. Question (${material.lang}): ${q.question}`)
    console.log(`      Question (EN): ${q.question_en}`)
    console.log(`      Question (RU): ${q.question_ru}`)
    console.log(`      Options (${material.lang} ONLY):`)
    q.options.forEach(opt => {
      console.log(`        ${opt.key}. ${opt.text}`)
    })
    console.log(`      Correct: ${q.correctAnswer}`)
    console.log('')
  })
}

// Main execution
if (require.main === module) {
  const materialId = parseInt(process.argv[2])
  const questionsFile = process.argv[3]

  if (!materialId || !questionsFile) {
    console.log('❌ Usage: node scripts/create-mcq.js <material_id> <questions_json_file>')
    console.log('\n📝 Example:')
    console.log('   node scripts/create-mcq.js 481 questions-481.json')
    console.log('\n📄 Questions JSON format:')
    console.log(`   [
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
     ... (6 total questions)
   ]`)
    console.log('\n💡 Important Rules:')
    console.log('   - MUST have exactly 6 questions')
    console.log('   - Each question MUST have exactly 4 options')
    console.log('   - correctAnswer must be A, B, C, or D')
    console.log('   - "question" is in material language')
    console.log('   - "question_translations" has EN and RU translations')
    console.log('   - "options" are in material language ONLY (no translations)')
    console.log('   - This way: Questions display in user browser language, answers stay in material language')
    process.exit(1)
  }

  createMCQExercise(materialId, questionsFile).catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
}
