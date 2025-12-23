const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BASE_URL = 'https://linguami-cdn.etreailleurs.workers.dev'
const AUDIO_PATH = 'audios/fr/lessons/beginner/lesson-1'

async function fixLiaisonsAudio() {
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
    console.log('Adding underscore versions to audio URLs...\n')

    const updatedBlocks = lesson.blocks_en.map((block, index) => {
      if (block.type === 'usageList' && block.audioUrls) {
        // Add underscore versions of liaison words
        if (block.audioUrls['les enfants']) {
          block.audioUrls['les_enfants'] = block.audioUrls['les enfants']
          console.log('✓ Added: les_enfants → les-enfants.mp3')
        }
        if (block.audioUrls['un ami']) {
          block.audioUrls['un_ami'] = block.audioUrls['un ami']
          console.log('✓ Added: un_ami → un-ami.mp3')
        }
        if (block.audioUrls['deux heures']) {
          block.audioUrls['deux_heures'] = block.audioUrls['deux heures']
          console.log('✓ Added: deux_heures → deux-heures.mp3')
        }
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

    console.log('✅ Successfully added underscore versions!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

fixLiaisonsAudio()
