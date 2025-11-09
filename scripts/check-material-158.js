const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkMaterial158() {
  try {
    // Get material details
    const { data: material, error: materialError } = await supabase
      .from('materials')
      .select('*')
      .eq('id', 158)
      .single()

    if (materialError) throw materialError

    console.log('\n📚 Material 158:')
    console.log('Title (RU):', material.title)
    console.log('Title (EN):', material.title_en)
    console.log('Title (FR):', material.title_fr)
    console.log('\n📝 Full material object:')
    console.log(JSON.stringify(material, null, 2))

    // Get exercise
    const { data: exercise, error: exerciseError } = await supabase
      .from('exercises')
      .select('*')
      .eq('material_id', 158)
      .eq('type', 'mcq')
      .single()

    if (exerciseError) {
      console.log('\n❌ Exercise error:', exerciseError.message)
    } else if (exercise) {
      console.log('\n❓ Current MCQ Questions:')
      if (exercise.questions && exercise.questions.length > 0) {
        exercise.questions.forEach((q, i) => {
          console.log(`\n${i + 1}. ${q.question}`)
          console.log('   Options:', q.options.map(o => `${o.key}: ${o.text}`).join(' | '))
          console.log('   Correct:', q.correctAnswer)
        })
      } else {
        console.log('No questions found')
      }
    }

  } catch (error) {
    console.error('Error:', error.message)
  }
}

checkMaterial158()
