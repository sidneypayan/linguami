const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkLiaisons() {
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

    // Find the usageList block with "Mandatory liaisons"
    const usageListBlocks = lesson.blocks_en.filter(b => b.type === 'usageList')

    usageListBlocks.forEach((block, i) => {
      console.log(`\n=== usageList Block ${i + 1}: ${block.title} ===\n`)

      block.items?.forEach((item, j) => {
        console.log(`Item ${j + 1}: ${item.usage}`)

        if (item.usage === 'Mandatory liaisons') {
          console.log('Examples:')
          item.examples?.forEach((ex, k) => {
            console.log(`  ${k + 1}. "${ex}"`)
          })

          if (block.audioUrls) {
            console.log('\nAudio URLs available:')
            Object.keys(block.audioUrls).forEach(key => {
              console.log(`  - "${key}"`)
            })

            console.log('\n🔍 Checking matches:')
            item.examples?.forEach(ex => {
              // Extract word from example like "les_enfants (S → Z)"
              const match = ex.match(/^([^\s(]+)/)
              if (match) {
                const word = match[1]
                const hasAudio = block.audioUrls[word]
                console.log(`  ${hasAudio ? '✅' : '❌'} "${word}" ${hasAudio ? '→ has audio' : '→ NO AUDIO'}`)
              }
            })
          } else {
            console.log('\n❌ No audioUrls in this block!')
          }
        }
      })
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

checkLiaisons()
