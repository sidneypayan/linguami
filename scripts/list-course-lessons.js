require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function listLessons() {
  const levelId = 1 // Beginner
  const targetLanguage = 'ru'

  console.log(`📚 Listing all lessons for level ${levelId}, language ${targetLanguage}...`)

  // Get course
  const { data: courses } = await supabase
    .from('courses')
    .select('id, level_id, target_language')
    .eq('level_id', levelId)
    .eq('target_language', targetLanguage)

  const course = courses?.[0]
  if (!course) {
    console.error('❌ Course not found')
    return
  }

  console.log(`✅ Course ID: ${course.id}`)

  // Get all lessons
  const { data: lessons, error } = await supabase
    .from('course_lessons')
    .select('id, slug, title_fr, order_index')
    .eq('course_id', course.id)
    .order('order_index')

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  console.log(`\n📖 Found ${lessons?.length || 0} lessons:\n`)
  lessons?.forEach(lesson => {
    console.log(`   ${lesson.order_index}. ${lesson.slug}`)
    console.log(`      Title: ${lesson.title_fr}`)
    console.log(`      ID: ${lesson.id}\n`)
  })
}

listLessons().catch(console.error)
