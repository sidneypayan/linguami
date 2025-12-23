const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkFrenchLessons() {
  try {
    console.log('📋 Fetching all French lessons...\n')

    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('id, title_fr, title_ru, title_en, slug, target_language, status, level, order')
      .eq('target_language', 'fr')
      .order('order')

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log(`Found ${lessons.length} French lessons\n`)

    lessons.forEach(lesson => {
      const statusEmoji = lesson.status === 'published' ? '✅' : '🔒'
      console.log(`${statusEmoji} ID ${lesson.id}: ${lesson.title_ru || lesson.title_en || lesson.slug}`)
      console.log(`   Slug: ${lesson.slug}`)
      console.log(`   Status: ${lesson.status || 'unknown'}`)
      console.log(`   Level: ${lesson.level}`)
      console.log(`   Order: ${lesson.order}`)
      console.log()
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

checkFrenchLessons()
