const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkLesson() {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('id, slug, blocks, blocks_fr, blocks_en, blocks_ru')
    .eq('slug', 'se-presenter')
    .single()

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Lesson ID:', data.id)
  console.log('Slug:', data.slug)
  console.log('Has blocks:', !!data.blocks)
  console.log('Has blocks_fr:', !!data.blocks_fr)
  console.log('Has blocks_en:', !!data.blocks_en)
  console.log('Has blocks_ru:', !!data.blocks_ru)

  if (data.blocks) {
    console.log('\nblocks field type:', typeof data.blocks)
    if (Array.isArray(data.blocks)) {
      console.log('blocks length:', data.blocks.length)
      console.log('First block:', JSON.stringify(data.blocks[0], null, 2))
    }
  }

  if (data.blocks_fr) {
    console.log('\nblocks_fr field type:', typeof data.blocks_fr)
    if (Array.isArray(data.blocks_fr)) {
      console.log('blocks_fr length:', data.blocks_fr.length)
      console.log('First block_fr:', JSON.stringify(data.blocks_fr[0], null, 2))
    }
  }

  if (data.blocks_en) {
    console.log('\nblocks_en field type:', typeof data.blocks_en)
    if (Array.isArray(data.blocks_en)) {
      console.log('blocks_en length:', data.blocks_en.length)
    }
  }
}

checkLesson()
