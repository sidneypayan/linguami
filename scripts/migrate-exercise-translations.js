#!/usr/bin/env node
/**
 * Script to migrate exercise translations from JSON blocks to exercises table
 * Then remove the JSON blocks
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const LESSON_ID = 1

async function migrateTranslations() {
  console.log('\n📚 Migrating exercise translations from JSON blocks...\n')

  // Get lesson with all language blocks
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', LESSON_ID)
    .single()

  // Extract exercises from each language block
  const ruExercises = lesson.blocks_ru?.filter(b => b.type === 'exercise_inline') || []
  const enExercises = lesson.blocks_en?.filter(b => b.type === 'exercise_inline') || []
  const frExercises = lesson.blocks_fr?.filter(b => b.type === 'exercise_inline') || []

  console.log('Found exercises in JSON:')
  console.log('  Russian blocks:', ruExercises.length)
  console.log('  English blocks:', enExercises.length)
  console.log('  French blocks:', frExercises.length)

  // Get current exercises from table
  const { data: tableExercises } = await supabase
    .from('exercises')
    .select('*')
    .eq('parent_type', 'lesson')
    .eq('parent_id', LESSON_ID)
    .order('id')

  console.log('\nExercises in table:', tableExercises.length)

  // Map exercises by type
  const ruMCQ = ruExercises.find(e => e.exerciseType === 'multipleChoice')
  const enMCQ = enExercises.find(e => e.exerciseType === 'multipleChoice')
  const frMCQ = frExercises.find(e => e.exerciseType === 'multipleChoice')

  const ruDrag = ruExercises.find(e => e.exerciseType === 'dragAndDrop')
  const enDrag = enExercises.find(e => e.exerciseType === 'dragAndDrop')
  const frDrag = frExercises.find(e => e.exerciseType === 'dragAndDrop')

  const ruFITB = ruExercises.find(e => e.exerciseType === 'fillInBlank')
  const enFITB = enExercises.find(e => e.exerciseType === 'fillInBlank')
  const frFITB = frExercises.find(e => e.exerciseType === 'fillInBlank')

  // Update MCQ with multilingual questions
  if (ruMCQ || enMCQ || frMCQ) {
    console.log('\n📝 Updating MCQ exercise...')
    const tableMCQ = tableExercises.find(e => e.type === 'mcq')

    if (tableMCQ && (ruMCQ || enMCQ)) {
      const questions = tableMCQ.data.questions.map((q, idx) => {
        const ruQ = ruMCQ?.questions?.[idx]
        const enQ = enMCQ?.questions?.[idx]
        const frQ = frMCQ?.questions?.[idx]

        return {
          ...q,
          question: frQ?.question || ruQ?.question || enQ?.question || q.question,
          question_en: enQ?.question || q.question_en,
          question_ru: ruQ?.question || q.question_ru,
          options: frQ?.options || ruQ?.options || enQ?.options || q.options,
          correctAnswer: frQ?.correctAnswer || ruQ?.correctAnswer || enQ?.correctAnswer || q.correctAnswer,
          explanation: frQ?.explanation || ruQ?.explanation || enQ?.explanation || q.explanation || ''
        }
      })

      const { error } = await supabase
        .from('exercises')
        .update({ data: { questions } })
        .eq('id', tableMCQ.id)

      if (error) {
        console.error('❌ Error updating MCQ:', error.message)
      } else {
        console.log('✅ MCQ updated with translations')
        console.log('   Questions:', questions.length)
      }
    }
  }

  // Update Drag & Drop
  if (ruDrag || enDrag || frDrag) {
    console.log('\n🎯 Updating Drag & Drop exercise...')
    const tableDrag = tableExercises.find(e => e.type === 'drag_and_drop')

    if (tableDrag && (ruDrag || enDrag || frDrag)) {
      const pairs = frDrag?.pairs || ruDrag?.pairs || enDrag?.pairs || tableDrag.data.pairs

      const { error } = await supabase
        .from('exercises')
        .update({ data: { pairs } })
        .eq('id', tableDrag.id)

      if (error) {
        console.error('❌ Error updating Drag & Drop:', error.message)
      } else {
        console.log('✅ Drag & Drop updated')
        console.log('   Pairs:', pairs.length)
      }
    }
  }

  // Update Fill in the Blank
  if (ruFITB || enFITB || frFITB) {
    console.log('\n✍️  Updating Fill in the Blank exercise...')
    const tableFITB = tableExercises.find(e => e.type === 'fill_in_blank')

    if (tableFITB && (ruFITB || enFITB || frFITB)) {
      const sentences = frFITB?.questions || ruFITB?.questions || enFITB?.questions || tableFITB.data.sentences

      const { error } = await supabase
        .from('exercises')
        .update({ data: { sentences } })
        .eq('id', tableFITB.id)

      if (error) {
        console.error('❌ Error updating Fill in Blank:', error.message)
      } else {
        console.log('✅ Fill in Blank updated')
        console.log('   Sentences:', sentences.length)
      }
    }
  }

  // Now remove exercise_inline blocks from all language versions
  console.log('\n🧹 Removing exercise_inline blocks from JSON...')

  const cleanedBlocksRu = lesson.blocks_ru?.filter(b => b.type !== 'exercise_inline') || []
  const cleanedBlocksEn = lesson.blocks_en?.filter(b => b.type !== 'exercise_inline') || []
  const cleanedBlocksFr = lesson.blocks_fr?.filter(b => b.type !== 'exercise_inline') || []

  const { error: updateError } = await supabase
    .from('lessons')
    .update({
      blocks_ru: cleanedBlocksRu,
      blocks_en: cleanedBlocksEn,
      blocks_fr: cleanedBlocksFr
    })
    .eq('id', LESSON_ID)

  if (updateError) {
    console.error('❌ Error removing blocks:', updateError.message)
  } else {
    console.log('✅ Removed exercise_inline blocks from all languages')
    console.log('   blocks_ru: removed', (lesson.blocks_ru?.length || 0) - cleanedBlocksRu.length)
    console.log('   blocks_en: removed', (lesson.blocks_en?.length || 0) - cleanedBlocksEn.length)
    console.log('   blocks_fr: removed', (lesson.blocks_fr?.length || 0) - cleanedBlocksFr.length)
  }

  console.log('\n🎉 Migration completed!')
  console.log('\n✨ Refresh the page to see the exercises with proper translations!\n')
}

migrateTranslations()
