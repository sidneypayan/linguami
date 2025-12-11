require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function listAllLessons() {
  console.log('📚 Listing all lessons in database...\n')

  // Get all lessons with their course info
  const { data: lessons, error } = await supabase
    .from('course_lessons')
    .select(`
      id,
      slug,
      title_fr,
      title_en,
      title_ru,
      order_index,
      course_id,
      courses!inner(
        id,
        level_id,
        target_language
      )
    `)
    .order('course_id')
    .order('order_index')

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  console.log(`Found ${lessons?.length || 0} lessons:\n`)

  // Group by course
  const lessonsByCourse = {}
  lessons?.forEach(lesson => {
    const courseKey = `${lesson.course_id}_${lesson.courses.target_language}_L${lesson.courses.level_id}`
    if (!lessonsByCourse[courseKey]) {
      lessonsByCourse[courseKey] = []
    }
    lessonsByCourse[courseKey].push(lesson)
  })

  // Display grouped
  Object.entries(lessonsByCourse).forEach(([courseKey, courseLessons]) => {
    const firstLesson = courseLessons[0]
    console.log(`📖 Course ${firstLesson.course_id} (${firstLesson.courses.target_language.toUpperCase()}, Level ${firstLesson.courses.level_id}):`)
    courseLessons.forEach(lesson => {
      console.log(`   ${lesson.order_index}. [${lesson.id}] ${lesson.slug}`)
      console.log(`      FR: ${lesson.title_fr}`)
      console.log(`      EN: ${lesson.title_en}`)
      console.log(`      RU: ${lesson.title_ru}`)
    })
    console.log('')
  })
}

listAllLessons().catch(console.error)
