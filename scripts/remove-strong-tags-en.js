const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeStrongTags() {
  try {
    console.log('📋 Fetching lesson 1...\n')

    const { data: lesson, error: fetchError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', 1)
      .single()

    if (fetchError) {
      console.error('❌ Error:', fetchError)
      return
    }

    console.log('✓ Found lesson 1\n')
    console.log('Removing <strong> tags from English blocks...\n')

    const updatedBlocks = lesson.blocks_en.map((block, index) => {
      // Remove <strong> tags from importantNote examples
      if (block.type === 'importantNote' && block.examples) {
        console.log(`Block ${index + 1}: [${block.type}] ${block.title}`)
        block.examples = block.examples.map(ex => {
          const cleaned = ex.replace(/<\/?strong>/g, '')
          console.log(`  Before: ${ex}`)
          console.log(`  After:  ${cleaned}`)
          return cleaned
        })
        console.log(`  ✓ Removed <strong> tags from ${block.examples.length} examples\n`)
      }

      return block
    })

    // Save to database
    console.log('💾 Saving to database...')
    const { error: updateError } = await supabase
      .from('lessons')
      .update({ blocks_en: updatedBlocks })
      .eq('id', 1)

    if (updateError) {
      console.error('\n❌ Error updating lesson:', updateError)
      return
    }

    console.log('\n✅ Successfully removed <strong> tags!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

removeStrongTags()
