require('dotenv').config({ path: '.env.local' })

async function listVoices() {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      }
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    console.log('\n🎤 Available ElevenLabs Voices:\n')
    console.log('=' .repeat(70))

    data.voices.forEach(voice => {
      console.log(`\nName: ${voice.name}`)
      console.log(`ID: ${voice.voice_id}`)
      console.log(`Category: ${voice.category || 'N/A'}`)
      console.log(`Labels: ${JSON.stringify(voice.labels)}`)
    })

    console.log('\n' + '='.repeat(70))

    // Try to find Ekaterina and Sébas
    const ekaterina = data.voices.find(v => v.name.toLowerCase().includes('ekaterina'))
    const sebas = data.voices.find(v => v.name.toLowerCase().includes('sébas') || v.name.toLowerCase().includes('sebas'))

    console.log('\n📌 Voices for Linguami:')
    if (ekaterina) {
      console.log(`✅ Ekaterina (Russian): ${ekaterina.voice_id}`)
    } else {
      console.log('❌ Ekaterina not found')
    }

    if (sebas) {
      console.log(`✅ Sébas (French): ${sebas.voice_id}`)
    } else {
      console.log('❌ Sébas not found')
    }

  } catch (error) {
    console.error('Error:', error.message)
  }
}

listVoices()
