const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setLesson1Public() {
  try {
    console.log('📋 Setting French lesson availability...\n')

    // 1. Keep lesson 1 as published
    console.log('✅ Keeping lesson 1 as "published"...')
    const { error: updateLesson1Error } = await supabase
      .from('lessons')
      .update({ status: 'published' })
      .eq('id', 1)
      .eq('target_language', 'fr')

    if (updateLesson1Error) {
      console.error('❌ Error updating lesson 1:', updateLesson1Error)
      return
    }
    console.log('   ✓ Lesson 1 is "published"\n')

    // 2. Mark other French lessons as "draft" (coming soon)
    console.log('🔒 Marking lessons 2-15 as "draft" (coming soon)...')
    const { error: updateOthersError } = await supabase
      .from('lessons')
      .update({ status: 'draft' })
      .neq('id', 1)
      .eq('target_language', 'fr')

    if (updateOthersError) {
      console.error('❌ Error updating other lessons:', updateOthersError)
      return
    }
    console.log('   ✓ Lessons 2-15 marked as "draft"\n')

    // 3. Display final status
    console.log('📊 Final status:\n')
    const { data: allLessons } = await supabase
      .from('lessons')
      .select('id, title_ru, slug, status, order')
      .eq('target_language', 'fr')
      .order('order')

    allLessons?.forEach(lesson => {
      const emoji = lesson.status === 'published' ? '✅' : '🔒'
      console.log(`${emoji} Lesson ${lesson.id} (order ${lesson.order}): ${lesson.title_ru}`)
      console.log(`   Status: ${lesson.status}`)
      console.log()
    })

    console.log('✅ Done!')
    console.log('\n⚠️  Note: The /lessons page is currently admin-only.')
    console.log('   Only admins can access it regardless of lesson status.')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

setLesson1Public()
