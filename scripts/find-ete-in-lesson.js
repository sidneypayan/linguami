const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function findEte() {
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

    console.log('🔍 Searching for "été" in English blocks:\n')

    lesson.blocks_en.forEach((block, i) => {
      const blockStr = JSON.stringify(block)
      if (blockStr.includes('été')) {
        console.log(`\n✓ Found in Block ${i + 1} [${block.type}] "${block.title || block.text || 'N/A'}"`)

        if (block.type === 'usageList' && block.items) {
          block.items.forEach((item, j) => {
            item.examples?.forEach((ex, k) => {
              if (ex.includes('été')) {
                console.log(`  Item ${j + 1}, Example ${k + 1}: "${ex}"`)
              }
            })
          })
        }

        if (block.type === 'mistakesTable' && block.rows) {
          block.rows.forEach((row, j) => {
            if (row.explanation?.includes('été')) {
              console.log(`  Row ${j + 1} explanation: "${row.explanation}"`)
            }
            if (row.wrong?.includes('été')) {
              console.log(`  Row ${j + 1} wrong: "${row.wrong}"`)
            }
            if (row.correct?.includes('été')) {
              console.log(`  Row ${j + 1} correct: "${row.correct}"`)
            }
          })
        }

        // Check if block has audioUrls
        if (block.audioUrls) {
          console.log('\n  AudioUrls in this block:')
          const hasEte = block.audioUrls['été']
          console.log(`    ${hasEte ? '✅' : '❌'} "été" ${hasEte ? '→ ' + hasEte : '→ NOT FOUND'}`)
        } else {
          console.log('\n  ❌ No audioUrls in this block')
        }
      }
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

findEte()
