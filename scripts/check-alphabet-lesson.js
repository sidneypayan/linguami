const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkLesson() {
  try {
    // First, let's see all lessons to find the right one
    const { data: lessons, error: lessonError } = await supabase
      .from('course_lessons')
      .select('id, slug, blocks_ru')
      .order('id')
      .limit(20)

    if (lessonError) {
      console.error('Error fetching lessons:', lessonError)
      return
    }

    console.log('Searching for lesson with "Французские акценты"...\n')

    let targetLesson = null
    for (const l of lessons) {
      if (l.blocks_ru) {
        const hasAccentBlock = l.blocks_ru.some(block =>
          block.title === 'Французские акценты'
        )
        if (hasAccentBlock) {
          targetLesson = l
          break
        }
      }
    }

    if (!targetLesson) {
      console.log('Lesson with "Французские акценты" not found in first 20 lessons')
      console.log('\nAll lessons:')
      lessons.forEach(l => {
        console.log(`- ID: ${l.id}, Slug: ${l.slug || 'N/A'}`)
      })
      return
    }

    const lesson = targetLesson
    console.log('✓ Found lesson!')
    console.log('Lesson ID:', lesson.id)
    console.log('Lesson Slug:', lesson.slug)
    console.log('\n=== Blocks (Russian) ===')

    if (lesson.blocks_ru) {
      const blocks = lesson.blocks_ru
      blocks.forEach((block, index) => {
        console.log(`\nBlock ${index + 1}:`)
        console.log('Type:', block.type)
        console.log('Title:', block.title)

        if (block.type === 'vocabulary' && block.title === 'Французские акценты') {
          console.log('\n=== FOUND: Французские акценты ===')
          console.log('Content:', JSON.stringify(block, null, 2))
        }
      })
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

checkLesson()
