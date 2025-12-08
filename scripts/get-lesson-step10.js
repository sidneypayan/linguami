const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getLessonStep10() {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('slug, blocks_fr')
    .eq('slug', 'bonjour-saluer-prendre-conge')
    .single()

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Lesson found:', data.slug)

  if (data.blocks_fr) {
    const step10 = data.blocks_fr.find((block, index) => index === 9) // step 10 is at index 9
    if (step10) {
      console.log('\n=== Step 10 ===')
      console.log(JSON.stringify(step10, null, 2))
    } else {
      console.log('Step 10 not found')
    }
  }
}

getLessonStep10()
