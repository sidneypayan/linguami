/**
 * Add drag and drop exercises to lesson "bonjour-saluer-prendre-conge"
 * - After Step 2 (Vocabulaire: Les salutations)
 * - After Step 6 (Vocabulaire: Prendre congé)
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Exercise 1: After Step 2 - Les salutations
const exerciseSalutations = {
  type: 'exerciseInline',
  exerciseType: 'dragAndDrop',
  title: 'Associez les salutations',
  icon: 'edit',
  xpReward: 10,
  pairs: [
    {
      id: 1,
      left: { fr: 'Bonjour', en: 'Bonjour', ru: 'Bonjour' },
      right: { fr: 'Salutation formelle (matin/après-midi)', en: 'Formal greeting (morning/afternoon)', ru: 'Формальное приветствие (утро/день)' }
    },
    {
      id: 2,
      left: { fr: 'Bonsoir', en: 'Bonsoir', ru: 'Bonsoir' },
      right: { fr: 'Salutation du soir (après 18h)', en: 'Evening greeting (after 6pm)', ru: 'Вечернее приветствие (после 18:00)' }
    },
    {
      id: 3,
      left: { fr: 'Salut', en: 'Salut', ru: 'Salut' },
      right: { fr: 'Salutation informelle (entre amis)', en: 'Informal greeting (between friends)', ru: 'Неформальное приветствие (между друзьями)' }
    },
    {
      id: 4,
      left: { fr: 'Coucou', en: 'Coucou', ru: 'Coucou' },
      right: { fr: 'Salutation très informelle (familier)', en: 'Very informal greeting (familiar)', ru: 'Очень неформальное приветствие (близкие)' }
    }
  ]
}

// Exercise 2: After Step 6 - Prendre congé
const exerciseFarewells = {
  type: 'exerciseInline',
  exerciseType: 'dragAndDrop',
  title: 'Associez les formules d\'adieu',
  icon: 'edit',
  xpReward: 10,
  pairs: [
    {
      id: 1,
      left: { fr: 'Au revoir', en: 'Au revoir', ru: 'Au revoir' },
      right: { fr: 'Formule d\'adieu standard', en: 'Standard farewell', ru: 'Стандартное прощание' }
    },
    {
      id: 2,
      left: { fr: 'À bientôt', en: 'À bientôt', ru: 'À bientôt' },
      right: { fr: 'À bientôt (quand on va se revoir)', en: 'See you soon (when meeting again)', ru: 'До скорой встречи' }
    },
    {
      id: 3,
      left: { fr: 'À demain', en: 'À demain', ru: 'À demain' },
      right: { fr: 'Quand on se revoit le lendemain', en: 'When meeting tomorrow', ru: 'До завтра' }
    },
    {
      id: 4,
      left: { fr: 'Bonne journée', en: 'Bonne journée', ru: 'Bonne journée' },
      right: { fr: 'Souhait pour la journée', en: 'Wish for the day', ru: 'Пожелание хорошего дня' }
    },
    {
      id: 5,
      left: { fr: 'Bonne soirée', en: 'Bonne soirée', ru: 'Bonne soirée' },
      right: { fr: 'Souhait pour la soirée', en: 'Wish for the evening', ru: 'Пожелание хорошего вечера' }
    },
    {
      id: 6,
      left: { fr: 'Bonne nuit', en: 'Bonne nuit', ru: 'Bonne nuit' },
      right: { fr: 'Avant d\'aller dormir', en: 'Before going to sleep', ru: 'Перед сном' }
    }
  ]
}

async function addExercises() {
  console.log('🔍 Fetching lesson...')

  const { data: lesson, error: fetchError } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('slug', 'bonjour-saluer-prendre-conge')
    .single()

  if (fetchError) {
    console.error('❌ Error fetching lesson:', fetchError)
    return
  }

  console.log('✅ Lesson found:', lesson.title_fr)

  // Update blocks_fr
  if (lesson.blocks_fr && Array.isArray(lesson.blocks_fr)) {
    // Insert after step 2 (index 1 - vocabulary "Les salutations")
    lesson.blocks_fr.splice(2, 0, exerciseSalutations)

    // Insert after step 6 (now index 6 because we added one - vocabulary "Prendre congé")
    // Original step 6 is now at index 6 (0-indexed: dialogue=0, vocab=1, exercise=2, grammar=3, exerciseInline=4, culture=5, vocab=6)
    lesson.blocks_fr.splice(7, 0, exerciseFarewells)

    console.log('✅ Added exercises to blocks_fr')
  }

  // Update blocks_ru (with Russian translations)
  if (lesson.blocks_ru && Array.isArray(lesson.blocks_ru)) {
    const exerciseSalutationsRu = {
      ...exerciseSalutations,
      title: 'Сопоставьте приветствия'
    }

    const exerciseFarewellsRu = {
      ...exerciseFarewells,
      title: 'Сопоставьте прощания'
    }

    lesson.blocks_ru.splice(2, 0, exerciseSalutationsRu)
    lesson.blocks_ru.splice(7, 0, exerciseFarewellsRu)

    console.log('✅ Added exercises to blocks_ru')
  }

  // Update blocks_en (with English translations)
  if (lesson.blocks_en && Array.isArray(lesson.blocks_en)) {
    const exerciseSalutationsEn = {
      ...exerciseSalutations,
      title: 'Match the greetings'
    }

    const exerciseFarewellsEn = {
      ...exerciseFarewells,
      title: 'Match the farewells'
    }

    lesson.blocks_en.splice(2, 0, exerciseSalutationsEn)
    lesson.blocks_en.splice(7, 0, exerciseFarewellsEn)

    console.log('✅ Added exercises to blocks_en')
  }

  // Update in database
  const { error: updateError } = await supabase
    .from('course_lessons')
    .update({
      blocks_fr: lesson.blocks_fr,
      blocks_ru: lesson.blocks_ru,
      blocks_en: lesson.blocks_en,
      updated_at: new Date().toISOString()
    })
    .eq('id', lesson.id)

  if (updateError) {
    console.error('❌ Error updating lesson:', updateError)
  } else {
    console.log('✅ Exercises added successfully!')
    console.log(`📊 Total blocks in blocks_fr: ${lesson.blocks_fr.length}`)
    console.log(`📊 Total blocks in blocks_ru: ${lesson.blocks_ru.length}`)
    console.log(`📊 Total blocks in blocks_en: ${lesson.blocks_en.length}`)
  }
}

addExercises()
