const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkExercises() {
  try {
    console.log('📋 Fetching exercises for lesson 1...\n')

    const { data: exercises, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('lesson_id', 1)
      .order('id')

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log(`Found ${exercises.length} exercises\n`)

    exercises.forEach((ex, i) => {
      console.log(`\n${i + 1}. Exercise ID ${ex.id} (order: ${ex.order})`)
      console.log(`   Type: ${ex.type}`)
      console.log(`   Title FR: ${ex.title_fr}`)
      console.log(`   Title RU: ${ex.title_ru}`)
      console.log(`   Title EN: ${ex.title_en}`)

      if (ex.questions) {
        console.log(`   Questions: ${ex.questions.length} items`)
      }

      // Show details of third exercise
      if (i === 2) {
        console.log('\n   === THIRD EXERCISE DETAILS ===')
        console.log(`   Full data:`)
        console.log(JSON.stringify(ex, null, 2))
      }
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

checkExercises()
