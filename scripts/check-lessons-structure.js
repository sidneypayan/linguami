const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkStructure() {
  try {
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .limit(5)

    if (error) {
      console.error('Error:', error)
      return
    }

    if (lessons.length > 0) {
      console.log('📋 Lessons table structure:\n')
      console.log('Columns:', Object.keys(lessons[0]).join(', '))
      console.log('\n=== Sample lessons ===\n')

      lessons.forEach(lesson => {
        console.log(`ID: ${lesson.id}`)
        console.log(`Title: ${lesson.title}`)
        console.log(`Slug: ${lesson.slug}`)
        console.log(`Columns:`, Object.keys(lesson).filter(k => !k.startsWith('blocks_')).join(', '))
        console.log('---')
      })
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

checkStructure()
