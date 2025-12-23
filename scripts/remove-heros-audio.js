const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeHerosAudio() {
  try {
    const { data: lesson, error: fetchError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', 1)
      .single()

    if (fetchError) {
      console.error('Error:', fetchError)
      return
    }

    console.log('Removing héros audio reference...\n')

    const updatedBlocks = lesson.blocks_ru.map(block => {
      if (block.audioUrls && block.audioUrls['héros']) {
        console.log(`✓ Removing héros from block: ${block.title}`)
        const { héros, ...restAudioUrls } = block.audioUrls
        return {
          ...block,
          audioUrls: restAudioUrls
        }
      }
      return block
    })

    const { error: updateError } = await supabase
      .from('lessons')
      .update({ blocks_ru: updatedBlocks })
      .eq('id', 1)

    if (updateError) {
      console.error('Error:', updateError)
      return
    }

    console.log('\n✅ Removed héros audio reference')
  } catch (error) {
    console.error('Error:', error)
  }
}

removeHerosAudio()
