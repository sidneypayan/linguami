require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const path = require('path')

// Load prod env
const prodEnv = dotenv.config({ path: path.resolve(__dirname, '../.env.production') }).parsed

const devSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const prodSupabase = createClient(
  prodEnv.NEXT_PUBLIC_SUPABASE_URL,
  prodEnv.SUPABASE_SERVICE_ROLE_KEY
)

async function compareData() {
  console.log('🔍 Comparing courses and course_lessons between DEV and PROD...\n')

  // Fetch courses from both DBs
  const { data: devCourses } = await devSupabase
    .from('courses')
    .select('id, slug, title_fr, title_en, title_ru, level_id, target_language, is_published')
    .order('id')

  const { data: prodCourses } = await prodSupabase
    .from('courses')
    .select('id, slug, title_fr, title_en, title_ru, level_id, target_language, is_published')
    .order('id')

  console.log('📊 COURSES:')
  console.log(`DEV:  ${devCourses?.length || 0} courses`)
  console.log(`PROD: ${prodCourses?.length || 0} courses\n`)

  // Compare courses
  const devCourseIds = new Set(devCourses?.map(c => c.id) || [])
  const prodCourseIds = new Set(prodCourses?.map(c => c.id) || [])

  const onlyInDev = [...devCourseIds].filter(id => !prodCourseIds.has(id))
  const onlyInProd = [...prodCourseIds].filter(id => !devCourseIds.has(id))

  if (onlyInDev.length > 0) {
    console.log('⚠️  Courses only in DEV:', onlyInDev)
  }
  if (onlyInProd.length > 0) {
    console.log('⚠️  Courses only in PROD:', onlyInProd)
  }

  // Fetch lessons from both DBs
  const { data: devLessons } = await devSupabase
    .from('course_lessons')
    .select('id, slug, title_fr, course_id, order_index, is_published')
    .order('id')

  const { data: prodLessons } = await prodSupabase
    .from('course_lessons')
    .select('id, slug, title_fr, course_id, order_index, is_published')
    .order('id')

  console.log('\n📖 COURSE_LESSONS:')
  console.log(`DEV:  ${devLessons?.length || 0} lessons`)
  console.log(`PROD: ${prodLessons?.length || 0} lessons\n`)

  // Compare lessons
  const devLessonIds = new Set(devLessons?.map(l => l.id) || [])
  const prodLessonIds = new Set(prodLessons?.map(l => l.id) || [])

  const lessonsOnlyInDev = [...devLessonIds].filter(id => !prodLessonIds.has(id))
  const lessonsOnlyInProd = [...prodLessonIds].filter(id => !prodLessonIds.has(id))

  if (lessonsOnlyInDev.length > 0) {
    console.log('⚠️  Lessons only in DEV:', lessonsOnlyInDev)
    devLessons.filter(l => lessonsOnlyInDev.includes(l.id)).forEach(l => {
      console.log(`   - [${l.id}] ${l.slug} (course: ${l.course_id})`)
    })
  }
  if (lessonsOnlyInProd.length > 0) {
    console.log('⚠️  Lessons only in PROD:', lessonsOnlyInProd)
    prodLessons.filter(l => lessonsOnlyInProd.includes(l.id)).forEach(l => {
      console.log(`   - [${l.id}] ${l.slug} (course: ${l.course_id})`)
    })
  }

  // Detailed comparison of common lessons
  console.log('\n🔍 Detailed comparison of common lessons:')
  const commonLessonIds = [...devLessonIds].filter(id => prodLessonIds.has(id))

  let hasDifferences = false
  commonLessonIds.forEach(id => {
    const devLesson = devLessons.find(l => l.id === id)
    const prodLesson = prodLessons.find(l => l.id === id)

    if (devLesson.slug !== prodLesson.slug ||
        devLesson.title_fr !== prodLesson.title_fr ||
        devLesson.order_index !== prodLesson.order_index ||
        devLesson.is_published !== prodLesson.is_published) {
      hasDifferences = true
      console.log(`\n⚠️  Lesson ${id} differs:`)
      console.log(`   DEV:  slug=${devLesson.slug}, order=${devLesson.order_index}, published=${devLesson.is_published}`)
      console.log(`   PROD: slug=${prodLesson.slug}, order=${prodLesson.order_index}, published=${prodLesson.is_published}`)
    }
  })

  if (!hasDifferences && lessonsOnlyInDev.length === 0 && lessonsOnlyInProd.length === 0) {
    console.log('✅ All common lessons are identical!\n')
  }

  // Recommendation
  console.log('\n💡 RECOMMENDATION:')
  if (devCourses?.length === prodCourses?.length && devLessons?.length === prodLessons?.length && !hasDifferences) {
    console.log('✅ DBs are in sync. You can keep current setup.')
    console.log('   OR switch to PROD-only for these tables (cleaner approach)')
  } else {
    console.log('⚠️  DBs are NOT in sync!')
    console.log('   OPTION 1: Use PROD DB for courses/lessons even in dev (recommended)')
    console.log('   OPTION 2: Sync DEV → PROD or PROD → DEV')
  }
}

compareData().catch(console.error)
