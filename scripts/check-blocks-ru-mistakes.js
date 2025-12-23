const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkBlocksRu() {
  try {
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('blocks_ru')
      .eq('id', 1)
      .single()

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log('🔍 Checking Russian blocks for mistakesTable:\n')

    const mistakesTable = lesson.blocks_ru.find(b => b.type === 'mistakesTable')

    if (mistakesTable) {
      console.log(`✓ Found mistakesTable: "${mistakesTable.title}"\n`)

      console.log('Rows:')
      mistakesTable.rows?.forEach((row, i) => {
        console.log(`\n${i + 1}. Wrong: "${row.wrong}"`)
        console.log(`   Correct: "${row.correct}"`)
        console.log(`   Explanation: "${row.explanation}"`)
      })
    } else {
      console.log('❌ No mistakesTable found in Russian blocks')
    }

    // Also check usageList for comparison
    console.log('\n\n🔍 Checking usageList blocks:\n')
    const usageLists = lesson.blocks_ru.filter(b => b.type === 'usageList')

    usageLists.forEach((block, i) => {
      console.log(`\nusageList ${i + 1}: "${block.title}"`)
      block.items?.forEach((item, j) => {
        if (item.usage && item.usage.includes('petit')) {
          console.log(`  Item ${j + 1}: ${item.usage}`)
          item.examples?.forEach((ex, k) => {
            console.log(`    Example ${k + 1}: "${ex}"`)
          })
        }
      })
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

checkBlocksRu()
