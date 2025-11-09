const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkVottovaaraExercise() {
  try {
    // Get all exercises for material 158
    const { data: exercises, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('material_id', 158)

    if (error) throw error

    console.log('\n📝 Exercises for Material 158 (Воттоваара):')
    console.log('Total exercises found:', exercises.length)

    exercises.forEach(ex => {
      console.log(`\nExercise ID: ${ex.id}`)
      console.log(`Type: ${ex.type}`)
      console.log(`Title: ${ex.title}`)
      if (ex.type === 'mcq') {
        console.log('\nFull exercise data:')
        console.log(JSON.stringify(ex, null, 2))
      }
    })

  } catch (error) {
    console.error('Error:', error.message)
  }
}

checkVottovaaraExercise()
