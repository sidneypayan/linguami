const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Use PROD database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || 'https://psomseputtsdizmmqugy.supabase.co'
const supabaseKey = process.env.SUPABASE_COURSES_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzb21zZXB1dHRzZGl6bW1xdWd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTk0NTkzOSwiZXhwIjoyMDU1NTIxOTM5fQ.4fCtRWcobxYPt2_egoqGyD9u82G_LdgIOfi8u28VvSs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function exportTrainingQuestions() {
  console.log('Fetching training themes...')

  // First get all themes to understand the structure
  const { data: themes, error: themesError } = await supabase
    .from('training_themes')
    .select('*')
    .order('lang, level, display_order')

  if (themesError) {
    console.error('Error fetching themes:', themesError)
    return
  }

  console.log(`Found ${themes.length} themes`)
  console.log('\nThemes structure:')
  themes.forEach(t => {
    console.log(`  - [${t.id}] ${t.lang}/${t.level}/${t.key} (${t.icon} ${t.label_en})`)
  })

  // Now get all questions
  console.log('\nFetching training questions...')
  const { data: questions, error: questionsError } = await supabase
    .from('training_questions')
    .select('*')
    .order('theme_id, id')

  if (questionsError) {
    console.error('Error fetching questions:', questionsError)
    return
  }

  console.log(`Found ${questions.length} questions`)

  // Group questions by theme
  const questionsByTheme = {}
  questions.forEach(q => {
    if (!questionsByTheme[q.theme_id]) {
      questionsByTheme[q.theme_id] = []
    }
    questionsByTheme[q.theme_id].push(q)
  })

  // Show summary
  console.log('\nQuestions per theme:')
  for (const theme of themes) {
    const count = questionsByTheme[theme.id]?.length || 0
    console.log(`  - ${theme.lang}/${theme.level}/${theme.key}: ${count} questions`)
  }

  // Create output directory
  const outputDir = path.join(__dirname, '..', 'data', 'training')

  // Export themes for reference
  const themesOutput = path.join(outputDir, 'themes-export.json')
  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(themesOutput, JSON.stringify(themes, null, 2))
  console.log(`\nExported themes to ${themesOutput}`)

  // Export questions grouped by lang/level/theme
  for (const theme of themes) {
    const themeQuestions = questionsByTheme[theme.id] || []
    if (themeQuestions.length === 0) continue

    const langDir = path.join(outputDir, theme.lang, theme.level)
    fs.mkdirSync(langDir, { recursive: true })

    const filename = path.join(langDir, `${theme.key}.json`)

    // Clean up questions for JSON export (remove DB-specific fields)
    const cleanQuestions = themeQuestions.map(q => ({
      id: q.id,
      type: q.type,
      question_fr: q.question_fr,
      question_en: q.question_en,
      question_ru: q.question_ru,
      sentence: q.sentence,
      blank: q.blank,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation_fr: q.explanation_fr,
      explanation_en: q.explanation_en,
      explanation_ru: q.explanation_ru,
      difficulty: q.difficulty
    }))

    fs.writeFileSync(filename, JSON.stringify(cleanQuestions, null, 2))
    console.log(`Exported ${themeQuestions.length} questions to ${filename}`)
  }

  console.log('\nExport complete!')
}

exportTrainingQuestions()
