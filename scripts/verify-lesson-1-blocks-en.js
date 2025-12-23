const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifyBlocksEn() {
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

    console.log('📋 Verification of English blocks:\n')

    // Check for IPA notation
    const hasIPA = lesson.blocks_en.some(block => {
      const blockStr = JSON.stringify(block)
      return /\[[\wɑɔɛœʁ̃]+\]/.test(blockStr)
    })

    if (hasIPA) {
      console.log('❌ IPA notation still present!')
    } else {
      console.log('✅ No IPA notation found')
    }

    // Check audio URLs
    let totalAudioUrls = 0
    lesson.blocks_en.forEach((block, i) => {
      if (block.audioUrls && Object.keys(block.audioUrls).length > 0) {
        console.log(`✅ Block ${i + 1} [${block.type}]: ${Object.keys(block.audioUrls).length} audio URLs`)
        totalAudioUrls += Object.keys(block.audioUrls).length

        // Check if they point to correct path
        const firstUrl = Object.values(block.audioUrls)[0]
        if (firstUrl.includes('audios/fr/lessons/beginner/lesson-1')) {
          console.log(`   ✓ Correct path`)
        } else {
          console.log(`   ❌ Wrong path: ${firstUrl}`)
        }
      }
    })

    console.log(`\n📊 Total audio URLs: ${totalAudioUrls}`)

    // Show sample of usageList without IPA
    const usageListBlock = lesson.blocks_en.find(b => b.type === 'usageList')
    if (usageListBlock && usageListBlock.items && usageListBlock.items[0]) {
      console.log('\n📝 Sample usageList example (checking IPA removal):')
      console.log('   ', usageListBlock.items[0].examples[1])
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

verifyBlocksEn()
