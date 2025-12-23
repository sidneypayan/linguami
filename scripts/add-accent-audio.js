const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const AUDIO_BASE_PATH = 'linguami/audios/fr/lessons/beginner/lesson-1/'

// Mapping des mots aux fichiers audio
const audioFiles = {
  'café': 'cafe.mp3',
  'étudiant': 'etudiant.mp3',
  'mère': 'mere.mp3',
  'père': 'pere.mp3',
  'être': 'etre.mp3',
  'forêt': 'foret.mp3',
  'Noël': 'noel.mp3',
  'naïf': 'naif.mp3'
}

async function addAccentAudio() {
  try {
    // Chercher toutes les leçons françaises pour débutants
    const { data: lessons, error: lessonError } = await supabase
      .from('course_lessons')
      .select('*')
      .order('id')

    if (lessonError) {
      console.error('Error fetching lessons:', lessonError)
      return
    }

    console.log(`Found ${lessons.length} lessons total\n`)

    // Chercher la leçon avec le bloc "Французские акценты"
    let targetLesson = null
    for (const lesson of lessons) {
      // Vérifier dans blocks_ru
      if (lesson.blocks_ru) {
        const accentBlock = lesson.blocks_ru.find(block =>
          block.title === 'Французские акценты'
        )
        if (accentBlock) {
          targetLesson = lesson
          console.log('✓ Found lesson with "Французские акценты"')
          console.log(`  Lesson ID: ${lesson.id}`)
          console.log(`  Slug: ${lesson.slug || 'N/A'}`)
          break
        }
      }
    }

    if (!targetLesson) {
      console.log('❌ Lesson with "Французские акценты" not found')
      return
    }

    // Mettre à jour le bloc avec les chemins audio
    const updatedBlocks = targetLesson.blocks_ru.map(block => {
      if (block.title === 'Французские акценты') {
        console.log('\n📝 Updating accent block...')

        // Le bloc devrait avoir une structure comme:
        // { type: 'vocabulary', title: 'Французские акценты', items: [...] }
        if (block.items && Array.isArray(block.items)) {
          block.items = block.items.map(item => {
            // item pourrait être structuré comme:
            // { term: 'Accent aigu', symbol: 'é', examples: ['café', 'étudiant'] }
            if (item.examples && Array.isArray(item.examples)) {
              item.examples = item.examples.map(example => {
                // Si example est une string, convertir en objet
                if (typeof example === 'string') {
                  const word = example.trim()
                  const audioFile = audioFiles[word]
                  if (audioFile) {
                    console.log(`  ✓ Adding audio for "${word}": ${audioFile}`)
                    return {
                      text: word,
                      audio: AUDIO_BASE_PATH + audioFile
                    }
                  }
                  return { text: word }
                }
                // Si example est déjà un objet, ajouter l'audio
                else if (example.text) {
                  const word = example.text.trim()
                  const audioFile = audioFiles[word]
                  if (audioFile) {
                    console.log(`  ✓ Adding audio for "${word}": ${audioFile}`)
                    return {
                      ...example,
                      audio: AUDIO_BASE_PATH + audioFile
                    }
                  }
                }
                return example
              })
            }
            return item
          })
        }
      }
      return block
    })

    // Sauvegarder les changements
    const { error: updateError } = await supabase
      .from('course_lessons')
      .update({ blocks_ru: updatedBlocks })
      .eq('id', targetLesson.id)

    if (updateError) {
      console.error('❌ Error updating lesson:', updateError)
      return
    }

    console.log('\n✅ Audio files linked successfully!')
    console.log('\nNext steps:')
    console.log('1. Verify the audio files exist in R2: ' + AUDIO_BASE_PATH)
    console.log('2. Test the audio buttons on the lesson page')
  } catch (error) {
    console.error('Error:', error)
  }
}

addAccentAudio()
