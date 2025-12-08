const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function findCourses() {
  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      id,
      slug,
      lang,
      target_language,
      level_id,
      title_fr,
      course_lessons!inner (
        id,
        slug
      )
    `)
    .eq('course_lessons.slug', 'bonjour-saluer-prendre-conge')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log(`Found ${courses.length} course(s) containing the lesson "bonjour-saluer-prendre-conge":\n`)

  courses.forEach((course, index) => {
    console.log(`${index + 1}. Course ID: ${course.id}`)
    console.log(`   Slug: ${course.slug}`)
    console.log(`   Lang: ${course.lang}`)
    console.log(`   Target Language: ${course.target_language}`)
    console.log(`   Level ID: ${course.level_id}`)
    console.log(`   Title: ${course.title_fr}`)
    console.log(`   Lessons in course: ${course.course_lessons.length}`)
    console.log()
  })
}

findCourses()
