const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkStep1() {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('blocks_fr, blocks_ru, blocks_en')
    .eq('slug', 'bonjour-saluer-prendre-conge')
    .single()

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('=== Step 1 - blocks_ru ===')
  if (data.blocks_ru && data.blocks_ru[0]) {
    console.log(JSON.stringify(data.blocks_ru[0], null, 2))
  }
}

checkStep1()
