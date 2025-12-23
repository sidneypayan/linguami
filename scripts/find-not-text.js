const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function findNOT() {
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

    console.log('🔍 Searching for "NOT" in English blocks:\n')

    lesson.blocks_en.forEach((block, i) => {
      const blockStr = JSON.stringify(block)
      if (blockStr.toUpperCase().includes('NOT')) {
        console.log(`\n✓ Found in Block ${i + 1} [${block.type}] "${block.title || block.text || 'N/A'}"`)

        if (block.type === 'usageList' && block.items) {
          block.items.forEach((item, j) => {
            item.examples?.forEach((ex, k) => {
              if (ex.toUpperCase().includes('NOT')) {
                console.log(`  Item ${j + 1}, Example ${k + 1}: "${ex}"`)
              }
            })
          })
        }

        if (block.type === 'mistakesTable' && block.rows) {
          block.rows.forEach((row, j) => {
            if (row.explanation?.toUpperCase().includes('NOT')) {
              console.log(`  Row ${j + 1} explanation: "${row.explanation}"`)
            }
          })
        }
      }
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

findNOT()
