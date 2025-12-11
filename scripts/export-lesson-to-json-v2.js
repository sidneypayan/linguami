require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function exportLessonToJSON() {
  const lessonSlug = 'bonjour-saluer-prendre-conge'
  const levelSlug = 'beginner'
  const levelId = 1 // Beginner level ID from static data

  console.log(`📖 Fetching lesson: ${lessonSlug}...`)

  // 1. Get course for this level (Russian target language)
  const { data: courses } = await supabase
    .from('courses')
    .select('id, level_id, target_language')
    .eq('level_id', levelId)
    .eq('target_language', 'ru')

  const course = courses?.[0]
  if (!course) {
    console.error('❌ Course not found for level and language')
    console.log('Available courses:', courses)
    return
  }

  console.log(`✅ Found course ID: ${course.id}`)

  // 2. Get the lesson
  const { data: lessons, error } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('course_id', course.id)
    .eq('slug', lessonSlug)

  if (error) {
    console.error('❌ Error fetching lesson:', error)
    return
  }

  const lesson = lessons?.[0]
  if (!lesson) {
    console.error('❌ Lesson not found')
    console.log('Available lessons for this course:', lessons)
    return
  }

  console.log(`✅ Found lesson: ${lesson.title_fr}`)

  // 3. Create directory structure
  const dataDir = path.join(process.cwd(), 'data', 'method', 'lessons', levelSlug)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
    console.log(`✅ Created directory: ${dataDir}`)
  }

  // 4. Create JSON file
  const filename = `${lessonSlug}.json`
  const filepath = path.join(dataDir, filename)

  // Clean up the lesson data (remove DB-specific fields)
  const lessonData = {
    id: lesson.id,
    slug: lesson.slug,
    title_fr: lesson.title_fr,
    title_en: lesson.title_en,
    title_ru: lesson.title_ru,
    objectives_fr: lesson.objectives_fr,
    objectives_en: lesson.objectives_en,
    objectives_ru: lesson.objectives_ru,
    blocks_fr: lesson.blocks_fr,
    blocks_en: lesson.blocks_en,
    blocks_ru: lesson.blocks_ru,
    order_index: lesson.order_index,
    level_slug: levelSlug,
    target_language: 'ru',
    course_id: course.id
  }

  fs.writeFileSync(filepath, JSON.stringify(lessonData, null, 2), 'utf8')

  console.log(`\n✅ Lesson exported to: ${filepath}`)
  console.log(`📊 Lesson data:`)
  console.log(`   - Title (FR): ${lesson.title_fr}`)
  console.log(`   - Title (EN): ${lesson.title_en}`)
  console.log(`   - Title (RU): ${lesson.title_ru}`)
  console.log(`   - Blocks (FR): ${lesson.blocks_fr?.length || 0} blocks`)
  console.log(`   - Blocks (EN): ${lesson.blocks_en?.length || 0} blocks`)
  console.log(`   - Blocks (RU): ${lesson.blocks_ru?.length || 0} blocks`)
}

exportLessonToJSON().catch(console.error)
