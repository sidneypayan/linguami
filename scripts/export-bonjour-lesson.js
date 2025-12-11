require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function exportLessonToJSON() {
  const lessonId = 11 // bonjour-saluer-prendre-conge
  const levelSlug = 'beginner'

  console.log(`📖 Fetching lesson ID: ${lessonId}...`)

  // Get the lesson directly by ID
  const { data: lesson, error } = await supabase
    .from('course_lessons')
    .select('*, courses!inner(id, level_id, target_language)')
    .eq('id', lessonId)
    .single()

  if (error) {
    console.error('❌ Error fetching lesson:', error)
    return
  }

  if (!lesson) {
    console.error('❌ Lesson not found')
    return
  }

  console.log(`✅ Found lesson: ${lesson.title_fr}`)
  console.log(`   Course ID: ${lesson.course_id}`)
  console.log(`   Level ID: ${lesson.courses.level_id}`)
  console.log(`   Target Language: ${lesson.courses.target_language}`)

  // Create directory structure
  const dataDir = path.join(process.cwd(), 'data', 'method', 'lessons', levelSlug)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
    console.log(`✅ Created directory: ${dataDir}`)
  }

  // Create JSON file
  const filename = `${lesson.slug}.json`
  const filepath = path.join(dataDir, filename)

  // Clean up the lesson data
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
    level_id: lesson.courses.level_id,
    target_language: lesson.courses.target_language,
    course_id: lesson.course_id
  }

  fs.writeFileSync(filepath, JSON.stringify(lessonData, null, 2), 'utf8')

  console.log(`\n✅ Lesson exported to: ${filepath}`)
  console.log(`📊 Lesson data:`)
  console.log(`   - ID: ${lesson.id}`)
  console.log(`   - Slug: ${lesson.slug}`)
  console.log(`   - Title (FR): ${lesson.title_fr}`)
  console.log(`   - Title (EN): ${lesson.title_en}`)
  console.log(`   - Title (RU): ${lesson.title_ru}`)
  console.log(`   - Blocks (FR): ${lesson.blocks_fr?.length || 0} blocks`)
  console.log(`   - Blocks (EN): ${lesson.blocks_en?.length || 0} blocks`)
  console.log(`   - Blocks (RU): ${lesson.blocks_ru?.length || 0} blocks`)
  console.log(`   - Order: ${lesson.order_index}`)
}

exportLessonToJSON().catch(console.error)
