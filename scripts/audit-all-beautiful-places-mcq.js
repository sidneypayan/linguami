const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function auditAllBeautifulPlaces() {
  try {
    // Get all beautiful-places materials
    const { data: materials, error: materialsError } = await supabase
      .from('materials')
      .select('id, title, body, lang')
      .eq('section', 'beautiful-places')
      .order('id')

    if (materialsError) throw materialsError

    console.log(`\n📚 Found ${materials.length} beautiful-places materials\n`)

    for (const material of materials) {
      // Get MCQ exercise for this material
      const { data: exercise, error: exerciseError } = await supabase
        .from('exercises')
        .select('*')
        .eq('material_id', material.id)
        .eq('type', 'mcq')
        .single()

      if (exerciseError || !exercise || !exercise.data?.questions) {
        console.log(`⚠️  Material ${material.id} (${material.title}): No MCQ exercise found`)
        continue
      }

      console.log(`\n📖 Material ${material.id}: ${material.title} (${material.lang})`)
      console.log(`   Exercise ID: ${exercise.id}`)
      console.log(`   Number of questions: ${exercise.data.questions.length}`)

      // Show first 200 chars of body
      const bodyPreview = material.body ? material.body.substring(0, 200) + '...' : 'NO BODY'
      console.log(`   Body preview: ${bodyPreview}`)

      console.log(`   Questions:`)
      exercise.data.questions.forEach((q, i) => {
        console.log(`     ${i + 1}. ${q.question}`)
      })
    }

    console.log('\n✅ Audit complete!')
    console.log('\n⚠️  Manual review needed:')
    console.log('Check if each question can be answered using ONLY the text in "body"')
    console.log('Questions about specific numbers, dates, heights, etc. should be verified')

  } catch (error) {
    console.error('Error:', error.message)
  }
}

auditAllBeautifulPlaces()
