const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixPetitExplanation() {
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
    console.log('Fixing "petit, NOT" explanation...\n')

    const updatedBlocks = lesson.blocks_en.map((block, index) => {
      if (block.type === 'mistakesTable' && block.rows) {
        block.rows = block.rows.map((row, i) => {
          if (row.explanation === 'petit, NOT') {
            console.log(`Before: "${row.explanation}"`)
            row.explanation = 'petit: the T at the end is silent'
            console.log(`After:  "${row.explanation}"`)
          }
          return row
        })
      }
      return block
    })

    // Save to database
    console.log('\n💾 Saving to database...')
    const { error: updateError } = await supabase
      .from('lessons')
      .update({ blocks_en: updatedBlocks })
      .eq('id', 1)

    if (updateError) {
      console.error('\n❌ Error updating lesson:', updateError)
      return
    }

    console.log('✅ Successfully fixed explanation!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

fixPetitExplanation()
