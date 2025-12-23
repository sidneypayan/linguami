const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BASE_URL = 'https://linguami-cdn.etreailleurs.workers.dev'
const AUDIO_PATH = 'audios/fr/lessons/beginner/lesson-1'

// Complete audio files mapping
const audioFiles = {
  // Alphabet
  'a': 'a.mp3', 'b': 'b.mp3', 'c': 'c.mp3', 'd': 'd.mp3', 'e': 'e.mp3',
  'f': 'f.mp3', 'g': 'g.mp3', 'h': 'h.mp3', 'i': 'i.mp3', 'j': 'j.mp3',
  'k': 'k.mp3', 'l': 'l.mp3', 'm': 'm.mp3', 'n': 'n.mp3', 'o': 'o.mp3',
  'p': 'p.mp3', 'q': 'q.mp3', 'r': 'r.mp3', 's': 's.mp3', 't': 't.mp3',
  'u': 'u.mp3', 'v': 'v.mp3', 'w': 'w.mp3', 'x': 'x.mp3', 'y': 'y.mp3', 'z': 'z.mp3',

  // Accented words
  'café': 'cafe.mp3',
  'étudiant': 'etudiant.mp3',
  'mère': 'mere.mp3',
  'père': 'pere.mp3',
  'être': 'etre.mp3',
  'forêt': 'foret.mp3',
  'Noël': 'noel.mp3',
  'naïf': 'naif.mp3',
  'ça': 'ca.mp3',
  'garçon': 'garcon.mp3',
  'français': 'francais.mp3',

  // Other words
  'homme': 'homme.mp3',
  'hôtel': 'hotel.mp3',
  'dehors': 'dehors.mp3',
  'ah': 'ah.mp3',
  'petit': 'petit.mp3',
  'beaucoup': 'beaucoup.mp3',
  'avec': 'avec.mp3',
  'pour': 'pour.mp3',
  'neuf': 'neuf.mp3',
  'mal': 'mal.mp3',
  'les enfants': 'les-enfants.mp3',
  'un ami': 'un-ami.mp3',
  'deux heures': 'deux-heures.mp3',
  'le': 'le.mp3',
  'je': 'je.mp3',
  'de': 'de.mp3',
  'parler': 'parler.mp3',
  'manger': 'manger.mp3',
  'comme': 'comme.mp3',
  'cube': 'cube.mp3',
  'ce': 'ce.mp3',
  'ici': 'ici.mp3',
  'gare': 'gare.mp3',
  'gomme': 'gomme.mp3',
  'guide': 'guide.mp3',
  'girafe': 'girafe.mp3',
  'mangeons': 'mangeons.mp3',
  'Georges': 'georges.mp3',
  'où': 'ou.mp3',
  'Comment ça va ?': 'comment-ca-va.mp3',
  'Très bien, merci ! Et toi ?': 'tres-bien-merci-et-toi.mp3',
  'Très bien, merci. Et toi ?': 'tres-bien-merci-et-toi.mp3',
}

function removeIPA(text) {
  // Remove ALL IPA notation between square brackets
  return text.replace(/\s*\[[^\]]+\]/g, '')
}

function createAudioUrls(words) {
  const audioUrls = {}
  words.forEach(word => {
    const cleanWord = word.trim()
    if (audioFiles[cleanWord]) {
      audioUrls[cleanWord] = `${BASE_URL}/${AUDIO_PATH}/${audioFiles[cleanWord]}`
    }
  })
  return audioUrls
}

async function updateBlocksEn() {
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
    console.log('Updating English blocks...\n')

    const updatedBlocks = lesson.blocks_en.map((block, index) => {
      console.log(`Block ${index + 1}: [${block.type}] ${block.title || block.text || 'N/A'}`)

      // Update existing audioUrls to new path
      if (block.audioUrls) {
        const newAudioUrls = {}
        for (const [word, oldUrl] of Object.entries(block.audioUrls)) {
          const filename = audioFiles[word] || oldUrl.split('/').pop()
          newAudioUrls[word] = `${BASE_URL}/${AUDIO_PATH}/${filename}`
        }
        block.audioUrls = newAudioUrls
        console.log(`  ✓ Updated ${Object.keys(newAudioUrls).length} audio URLs`)
      }

      // Process usageList blocks: remove IPA and add audio
      if (block.type === 'usageList') {
        block.items = block.items.map(item => {
          // Remove IPA from examples
          if (item.examples) {
            item.examples = item.examples.map(ex => removeIPA(ex))
          }
          return item
        })

        // Add audioUrls for common words
        const wordsInBlock = ['petit', 'français', 'beaucoup', 'avec', 'pour', 'neuf', 'mal',
                              'les enfants', 'un ami', 'deux heures', 'le', 'je', 'de',
                              'parler', 'manger', 'café', 'comme', 'cube', 'ce', 'ici',
                              'garçon', 'gare', 'gomme', 'guide', 'girafe', 'mangeons', 'Georges']
        block.audioUrls = createAudioUrls(wordsInBlock)
        console.log(`  ✓ Removed IPA and added ${Object.keys(block.audioUrls).length} audio URLs`)
      }

      // Process importantNote: add audio for H words
      if (block.type === 'importantNote' && block.title === 'The silent letter H') {
        const wordsInBlock = ['homme', 'hôtel', 'dehors', 'ah']
        block.audioUrls = createAudioUrls(wordsInBlock)
        console.log(`  ✓ Added ${Object.keys(block.audioUrls).length} audio URLs`)
      }

      // Process mistakesTable: remove IPA from explanations and add audio
      if (block.type === 'mistakesTable') {
        if (block.rows) {
          block.rows = block.rows.map(row => {
            if (row.explanation) {
              row.explanation = removeIPA(row.explanation)
            }
            return row
          })
        }
        const wordsInBlock = ['été', 'où', 'petit', 'père']
        block.audioUrls = createAudioUrls(wordsInBlock)
        console.log(`  ✓ Removed IPA from explanations and added ${Object.keys(block.audioUrls).length} audio URLs`)
      }

      // Process miniDialogue: add audio
      if (block.type === 'miniDialogue') {
        const wordsInBlock = ['Comment ça va ?', 'Très bien, merci ! Et toi ?']
        block.audioUrls = createAudioUrls(wordsInBlock)
        console.log(`  ✓ Added ${Object.keys(block.audioUrls).length} audio URLs`)
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

    console.log('\n✅ Successfully updated English blocks!')
    console.log('   - Removed all IPA notation')
    console.log('   - Updated audio URLs to new path')
    console.log('   - Added missing audio URLs to all blocks')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

updateBlocksEn()
