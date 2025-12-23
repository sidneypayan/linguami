const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixBlocksRuPetit() {
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
    console.log('Fixing Russian blocks - removing IPA from petit explanation...\n')

    const updatedBlocks = lesson.blocks_ru.map((block, index) => {
      if (block.type === 'mistakesTable' && block.rows) {
        block.rows = block.rows.map((row, i) => {
          // Remove IPA from petit explanation
          if (row.explanation && row.explanation.includes('[пти]')) {
            console.log(`Before: "${row.explanation}"`)
            row.explanation = 'petit: буква T в конце не произносится'
            console.log(`After:  "${row.explanation}"`)
          }
          // Also remove IPA from other explanations if present
          if (row.explanation && /\[[^\]]+\]/.test(row.explanation)) {
            console.log(`\nRemoving remaining IPA from: "${row.explanation}"`)
            row.explanation = row.explanation.replace(/\s*\[[^\]]+\]/g, '')
            console.log(`After: "${row.explanation}"`)
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
      .update({ blocks_ru: updatedBlocks })
      .eq('id', 1)

    if (updateError) {
      console.error('\n❌ Error updating lesson:', updateError)
      return
    }

    console.log('✅ Successfully fixed Russian blocks!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

fixBlocksRuPetit()
