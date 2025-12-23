const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function findIPA() {
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

    console.log('🔍 Searching for IPA notation in English blocks:\n')

    lesson.blocks_en.forEach((block, i) => {
      const blockStr = JSON.stringify(block, null, 2)
      const ipaMatches = blockStr.match(/\[[^\]]+\]/g)

      if (ipaMatches) {
        console.log(`\n❌ Block ${i + 1} [${block.type}] "${block.title || block.text || 'N/A'}"`)
        console.log('   Found IPA:')
        ipaMatches.forEach(match => {
          console.log(`   - ${match}`)
        })
      }
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

findIPA()
