/**
 * Add drag and drop exercises to lesson "bonjour-saluer-prendre-conge"
 * - After Step 2 (Vocabulaire: Les salutations) at index 2
 * - After Step 6 (Vocabulaire: Prendre congé) at index 6
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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

const exerciseSalutationsRu = {
  ...exerciseSalutations,
  title: 'Сопоставьте приветствия'
}

const exerciseSalutationsEn = {
  ...exerciseSalutations,
  title: 'Match the greetings'
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

const exerciseFarewellsRu = {
  ...exerciseFarewells,
  title: 'Сопоставьте прощания'
}

const exerciseFarewellsEn = {
  ...exerciseFarewells,
  title: 'Match the farewells'
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
  console.log('📊 Current blocks_fr length:', lesson.blocks_fr.length)

  // Create new arrays with exercises inserted
  const newBlocksFr = [
    lesson.blocks_fr[0],  // 0: dialogue
    lesson.blocks_fr[1],  // 1: vocabulary - Les salutations
    exerciseSalutations,  // 2: NEW - Exercise salutations
    lesson.blocks_fr[2],  // 3: grammar
    lesson.blocks_fr[3],  // 4: exerciseInline
    lesson.blocks_fr[4],  // 5: culture
    lesson.blocks_fr[5],  // 6: vocabulary - Prendre congé
    exerciseFarewells,    // 7: NEW - Exercise farewells
    ...lesson.blocks_fr.slice(6)  // 8+: rest of blocks
  ]

  const newBlocksRu = [
    lesson.blocks_ru[0],
    lesson.blocks_ru[1],
    exerciseSalutationsRu,
    lesson.blocks_ru[2],
    lesson.blocks_ru[3],
    lesson.blocks_ru[4],
    lesson.blocks_ru[5],
    exerciseFarewellsRu,
    ...lesson.blocks_ru.slice(6)
  ]

  const newBlocksEn = [
    lesson.blocks_en[0],
    lesson.blocks_en[1],
    exerciseSalutationsEn,
    lesson.blocks_en[2],
    lesson.blocks_en[3],
    lesson.blocks_en[4],
    lesson.blocks_en[5],
    exerciseFarewellsEn,
    ...lesson.blocks_en.slice(6)
  ]

  console.log('📊 New blocks_fr length:', newBlocksFr.length)

  // Update in database
  const { error: updateError } = await supabase
    .from('course_lessons')
    .update({
      blocks_fr: newBlocksFr,
      blocks_ru: newBlocksRu,
      blocks_en: newBlocksEn,
      updated_at: new Date().toISOString()
    })
    .eq('id', lesson.id)

  if (updateError) {
    console.error('❌ Error updating lesson:', updateError)
  } else {
    console.log('✅ Exercises added successfully!')
    console.log('📍 Exercise 1 at index 2 (after Les salutations)')
    console.log('📍 Exercise 2 at index 7 (after Prendre congé)')
  }
}

addExercises()
