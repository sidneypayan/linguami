const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BASE_URL = 'https://linguami-cdn.etreailleurs.workers.dev'
const AUDIO_PATH = 'audios/fr/lessons/beginner/lesson-1'

async function addEteAudio() {
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
    console.log('Adding "été" audio to blocks...\n')

    const eteAudioUrl = `${BASE_URL}/${AUDIO_PATH}/ete.mp3`

    const updatedBlocks = lesson.blocks_en.map((block, index) => {
      // Add to usageList block 16
      if (block.type === 'usageList' && block.title === 'Letters with multiple sounds') {
        if (!block.audioUrls) {
          block.audioUrls = {}
        }
        block.audioUrls['été'] = eteAudioUrl
        console.log(`✓ Block ${index + 1} [usageList]: Added été audio`)
      }

      // Add to mistakesTable block 17
      if (block.type === 'mistakesTable' && block.title === 'Common mistakes') {
        if (!block.audioUrls) {
          block.audioUrls = {}
        }
        block.audioUrls['été'] = eteAudioUrl
        console.log(`✓ Block ${index + 1} [mistakesTable]: Added été audio`)
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

    console.log('✅ Successfully added "été" audio!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

addEteAudio()
