const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifyIPARemoval() {
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

    console.log('🔍 Checking for IPA in text content:\n')

    let foundIPA = false

    // Check usageList examples
    const usageLists = lesson.blocks_en.filter(b => b.type === 'usageList')
    usageLists.forEach((block, i) => {
      block.items?.forEach((item, j) => {
        item.examples?.forEach((ex, k) => {
          if (/\[[^\]]+\]/.test(ex)) {
            console.log(`❌ usageList block ${i + 1}, item ${j + 1}, example ${k + 1}:`)
            console.log(`   "${ex}"`)
            foundIPA = true
          }
        })
      })
    })

    // Check mistakesTable explanations
    const mistakesTables = lesson.blocks_en.filter(b => b.type === 'mistakesTable')
    mistakesTables.forEach(block => {
      block.rows?.forEach((row, i) => {
        if (row.explanation && /\[[^\]]+\]/.test(row.explanation)) {
          console.log(`❌ mistakesTable row ${i + 1} explanation:`)
          console.log(`   "${row.explanation}"`)
          foundIPA = true
        }
      })
    })

    if (!foundIPA) {
      console.log('✅ No IPA found in text content!')
      console.log('\n📊 Summary:')
      console.log(`   - ${usageLists.length} usageList blocks checked`)
      console.log(`   - ${mistakesTables.length} mistakesTable blocks checked`)
      console.log('   - All IPA notation successfully removed')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

verifyIPARemoval()
