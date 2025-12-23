const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkLesson() {
  try {
    // Get lesson with ID 1 from lessons table
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log('✓ Found lesson ID 1')
    console.log('Title:', lesson.title)
    console.log('Slug:', lesson.slug)
    console.log('\n=== Blocks (Russian) ===')

    if (lesson.blocks_ru) {
      lesson.blocks_ru.forEach((block, i) => {
        console.log(`\n${i + 1}. [${block.type}] ${block.title}`)

        if (block.title === 'Французские акценты') {
          console.log('\n🎯 FOUND: Французские акценты block!')
          console.log(JSON.stringify(block, null, 2))
        }
      })
    } else {
      console.log('No blocks_ru found')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

checkLesson()
