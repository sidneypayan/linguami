const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BASE_URL = 'https://linguami-cdn.etreailleurs.workers.dev'
const AUDIO_PATH = 'audios/fr/lessons/beginner/lesson-1'

// Mapping des mots aux fichiers audio (basé sur la capture d'écran)
const audioFiles = {
  'un ami': 'un-ami.mp3',
  'les enfants': 'les-enfants.mp3',
  'mal': 'mal.mp3',
  'neuf': 'neuf.mp3',
  'pour': 'pour.mp3',
  'avec': 'avec.mp3',
  'beaucoup': 'beaucoup.mp3',
  'petit': 'petit.mp3',
  'ah': 'ah.mp3',
  'dehors': 'dehors.mp3',
  'hôtel': 'hotel.mp3',
  'hotel': 'hotel.mp3',
  'homme': 'homme.mp3',
  'ça': 'ca.mp3',
  'garçon': 'garcon.mp3',
  'français': 'francais.mp3',
  'naïf': 'naif.mp3',
  'Noël': 'noel.mp3',
  'forêt': 'foret.mp3',
  'être': 'etre.mp3',
  'père': 'pere.mp3',
  'mère': 'mere.mp3',
  'étudiant': 'etudiant.mp3',
  'café': 'cafe.mp3',
  'deux heures': 'deux-heures.mp3',
  'le': 'le.mp3',
  'je': 'je.mp3',
  'de': 'de.mp3',
  'parler': 'parler.mp3',
  'manger': 'manger.mp3',
  'gare': 'gare.mp3',
  'gomme': 'gomme.mp3',
  'guide': 'guide.mp3',
  'girafe': 'girafe.mp3',
  'cube': 'cube.mp3',
  'mangeons': 'mangeons.mp3',
  'georges': 'georges.mp3',
  'Georges': 'georges.mp3',
  'où': 'ou.mp3',
  'Très bien, merci. Et toi ?': 'tres-bien-merci-et-toi.mp3',
  'Comment ça va ?': 'comment-ca-va.mp3',
  // Lettres de l'alphabet
  'a': 'a.mp3', 'b': 'b.mp3', 'c': 'c.mp3', 'd': 'd.mp3', 'e': 'e.mp3',
  'f': 'f.mp3', 'g': 'g.mp3', 'h': 'h.mp3', 'i': 'i.mp3', 'j': 'j.mp3',
  'k': 'k.mp3', 'l': 'l.mp3', 'm': 'm.mp3', 'n': 'n.mp3', 'o': 'o.mp3',
  'p': 'p.mp3', 'q': 'q.mp3', 'r': 'r.mp3', 's': 's.mp3', 't': 't.mp3',
  'u': 'u.mp3', 'v': 'v.mp3', 'w': 'w.mp3', 'x': 'x.mp3', 'y': 'y.mp3', 'z': 'z.mp3'
}

async function updateAllAudio() {
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
    console.log('Updating all audio URLs in all blocks...\n')

    let updatedCount = 0

    // Update blocks_ru
    const updatedBlocks = lesson.blocks_ru.map((block, index) => {
      if (block.audioUrls && typeof block.audioUrls === 'object') {
        console.log(`📝 Block ${index + 1}: [${block.type}] ${block.title || 'N/A'}`)

        const updatedAudioUrls = {}
        for (const [word, oldUrl] of Object.entries(block.audioUrls)) {
          // Check if we have a mapping for this word
          const filename = audioFiles[word] || audioFiles[word.toLowerCase()] || oldUrl.split('/').pop()
          const newUrl = `${BASE_URL}/${AUDIO_PATH}/${filename}`

          updatedAudioUrls[word] = newUrl
          console.log(`  ✓ ${word} → ${filename}`)
          updatedCount++
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

    console.log(`\n✅ Updated ${updatedCount} audio URLs successfully!`)
    console.log('\nTest the lesson page to verify all audio buttons work.')
  } catch (error) {
    console.error('Error:', error)
  }
}

updateAllAudio()
