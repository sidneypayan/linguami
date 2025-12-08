const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function findAllLessons() {
  // Find all lessons with this slug
  const { data: lessons, error } = await supabase
    .from('course_lessons')
    .select(`
      id,
      slug,
      title_fr,
      courses!inner (
        id,
        slug,
        lang,
        title_fr
      )
    `)
    .eq('slug', 'bonjour-saluer-prendre-conge')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Found', lessons.length, 'lesson(s) with slug "bonjour-saluer-prendre-conge":\n')

  lessons.forEach((lesson, index) => {
    console.log(`${index + 1}. Lesson ID: ${lesson.id}`)
    console.log(`   Lesson title: ${lesson.title_fr}`)
    console.log(`   Course ID: ${lesson.courses.id}`)
    console.log(`   Course slug: ${lesson.courses.slug}`)
    console.log(`   Course lang: ${lesson.courses.lang}`)
    console.log(`   Course title: ${lesson.courses.title_fr}`)
    console.log()
  })
}

findAllLessons()
