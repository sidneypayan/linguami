const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkAccentBlock() {
  try {
    // Chercher toutes les leçons
    const { data: lessons, error: lessonError } = await supabase
      .from('course_lessons')
      .select('*')
      .order('id')

    if (lessonError) {
      console.error('Error fetching lessons:', lessonError)
      return
    }

    console.log(`Found ${lessons.length} lessons\n`)

    // Afficher toutes les leçons et leurs blocs
    for (const lesson of lessons) {
      console.log(`\n📚 Lesson ID: ${lesson.id}`)
      console.log(`   Slug: ${lesson.slug || 'N/A'}`)
      console.log(`   Blocks:`)

      if (lesson.blocks_ru) {
        lesson.blocks_ru.forEach((block, i) => {
          console.log(`     ${i + 1}. [${block.type}] ${block.title}`)
        })
      } else {
        console.log('     (no blocks_ru)')
      }

      if (lesson.blocks_fr) {
        console.log(`   French blocks:`)
        lesson.blocks_fr.forEach((block, i) => {
          console.log(`     ${i + 1}. [${block.type}] ${block.title || 'N/A'}`)
        })
      }
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

checkAccentBlock()
