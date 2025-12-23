const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BASE_URL = 'https://linguami-cdn.etreailleurs.workers.dev'
const AUDIO_PATH = 'audios/fr/lessons/beginner/lesson-1'

async function updateAudio() {
  try {
    // Get lesson 1
    const { data: lesson, error: fetchError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', 1)
      .single()

    if (fetchError) {
      console.error('Error fetching lesson:', fetchError)
      return
    }

    console.log('✓ Found lesson 1\n')

    // Update blocks_ru
    const updatedBlocks = lesson.blocks_ru.map(block => {
      if (block.title === 'Французские акценты' && block.audioUrls) {
        console.log('📝 Updating audio URLs...\n')

        const updatedAudioUrls = {}
        for (const [word, oldUrl] of Object.entries(block.audioUrls)) {
          // Extract filename from old URL or create new one
          const filename = oldUrl.split('/').pop()
          const newUrl = `${BASE_URL}/${AUDIO_PATH}/${filename}`

          updatedAudioUrls[word] = newUrl
          console.log(`  ${word}: ${filename}`)
        }

        return {
          ...block,
          audioUrls: updatedAudioUrls
        }
      }
      return block
    })

    // Save to database
    const { error: updateError } = await supabase
      .from('lessons')
      .update({ blocks_ru: updatedBlocks })
      .eq('id', 1)

    if (updateError) {
      console.error('\n❌ Error updating lesson:', updateError)
      return
    }

    console.log('\n✅ Audio URLs updated successfully!')
    console.log('\nNew URLs:')
    const accentBlock = updatedBlocks.find(b => b.title === 'Французские акценты')
    if (accentBlock) {
      for (const [word, url] of Object.entries(accentBlock.audioUrls)) {
        console.log(`  ${word}: ${url}`)
      }
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

updateAudio()
