const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkBlocksEn() {
  try {
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('blocks_en')
      .eq('id', 1)
      .single()

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log('📋 English blocks for lesson 1:\n')

    if (lesson.blocks_en && lesson.blocks_en.length > 0) {
      lesson.blocks_en.forEach((block, i) => {
        console.log(`\n${i + 1}. [${block.type}] ${block.title || block.text || 'N/A'}`)

        // Show structure for each block type
        if (block.type === 'importantNote' || block.type === 'paragraph') {
          console.log('   Content preview:', block.content?.substring(0, 100) || block.text?.substring(0, 100))
        }

        if (block.audioUrls) {
          console.log('   Has audio URLs:', Object.keys(block.audioUrls).length, 'words')
        }
      })

      console.log('\n\n=== Full JSON ===\n')
      console.log(JSON.stringify(lesson.blocks_en, null, 2))
    } else {
      console.log('No blocks_en found or empty array')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

checkBlocksEn()
