#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

// Voice IDs for different languages
const VOICES = {
  ru: 'C3FusDjPequ6qFchqpzu', // Ekaterina for Russian
  fr: '5jCmrHdxbpU36l1wb3Ke', // French voice
  en: 'EXAVITQu4vr4xnSDxMaL'  // Sarah for English (if needed)
}

async function generateAudio(text, voiceId, sentenceId) {
  console.log(`\n🎙️  Generating audio for sentence ${sentenceId}...`)
  console.log(`   Text: "${text}"`)

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`ElevenLabs API error: ${error}`)
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer())
  console.log(`   ✅ Audio generated (${audioBuffer.length} bytes)`)
  return audioBuffer
}

async function uploadToR2(audioBuffer, materialId, sentenceId, lang) {
  const key = `audio/exercises/${lang}/material_${materialId}/sentence_${sentenceId}.m4a`

  console.log(`\n📤 Uploading to R2: ${key}`)

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: audioBuffer,
    ContentType: 'audio/mp4',
  })

  await r2.send(command)

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`
  console.log(`   ✅ Uploaded: ${publicUrl}`)
  return publicUrl
}

async function createFITBAudio(materialId, sentencesFile) {
  console.log(`\n🎯 Creating FITB Audio Exercise for Material ${materialId}\n`)

  // Get material from database
  const { data: material, error: materialError } = await supabase
    .from('materials')
    .select('*')
    .eq('id', materialId)
    .single()

  if (materialError || !material) {
    console.error(`❌ Material ${materialId} not found`)
    process.exit(1)
  }

  console.log(`📖 Material: ${material.title}`)
  console.log(`   Language: ${material.lang}`)
  console.log(`   Section: ${material.section}`)

  // Get the correct voice for the language
  const voiceId = VOICES[material.lang]
  if (!voiceId) {
    console.error(`❌ No voice configured for language: ${material.lang}`)
    process.exit(1)
  }

  console.log(`🎤 Using voice ID: ${voiceId}`)

  // Load sentences from file
  let sentences
  try {
    const fileContent = fs.readFileSync(sentencesFile, 'utf8')
    sentences = JSON.parse(fileContent)
  } catch (error) {
    console.error(`❌ Error reading sentences file: ${error.message}`)
    process.exit(1)
  }

  // Validate sentences
  if (!sentences || sentences.length !== 6) {
    console.error('❌ You must provide exactly 6 sentences')
    process.exit(1)
  }

  // Generate audio and upload for each sentence
  const sentencesWithAudio = []

  for (const sentence of sentences) {
    try {
      // Generate audio for the FULL sentence (including the blank word)
      const audioBuffer = await generateAudio(sentence.fullText, voiceId, sentence.id)

      // Upload to R2
      const audioUrl = await uploadToR2(audioBuffer, materialId, sentence.id, material.lang)

      // Add to sentences array (remove fullText, keep only what's needed)
      const { fullText, ...sentenceData } = sentence
      sentencesWithAudio.push({
        ...sentenceData,
        audioUrl
      })

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`❌ Error processing sentence ${sentence.id}:`, error.message)
      throw error
    }
  }

  console.log('\n\n📝 Creating exercise in database...')

  // Determine exercise title based on language
  const titles = {
    fr: 'Compréhension auditive',
    ru: 'Понимание на слух',
    en: 'Listening Comprehension'
  }

  // Create exercise in database
  const { data, error } = await supabase
    .from('exercises')
    .insert({
      material_id: materialId,
      type: 'fill_in_blank',
      title: titles[material.lang] || 'Listening Comprehension',
      lang: material.lang,
      level: 'intermediate',
      xp_reward: 10,
      data: { sentences: sentencesWithAudio }
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Database error:', error)
    throw error
  }

  console.log('\n✅ Exercise created successfully!')
  console.log(`   Exercise ID: ${data.id}`)
  console.log(`   Material ID: ${materialId}`)
  console.log(`   Type: fill_in_blank (Audio Dictation)`)
  console.log(`   Language: ${material.lang}`)
  console.log(`   Sentences: ${sentencesWithAudio.length}`)
  console.log('\n📋 Sentences:')
  sentencesWithAudio.forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.sentenceWithBlank}`)
    console.log(`      Answer: ${s.correctAnswer}`)
  })
}

// Main execution
if (require.main === module) {
  const materialId = parseInt(process.argv[2])
  const sentencesFile = process.argv[3]

  if (!materialId || !sentencesFile) {
    console.log('❌ Usage: node scripts/create-fitb-audio.js <material_id> <sentences_json_file>')
    console.log('\n📝 Example:')
    console.log('   node scripts/create-fitb-audio.js 481 sentences-481.json')
    console.log('\n📄 Sentences JSON format:')
    console.log(`   [
     {
       "id": 1,
       "fullText": "Full sentence with the word included.",
       "sentenceWithBlank": "Sentence with ___ blank.",
       "sentenceWithBlank_en": "English translation with ___ blank.",
       "sentenceWithBlank_ru": "Russian translation with ___ blank.",
       "correctAnswer": "word",
       "correctAnswer_en": "word",
       "correctAnswer_ru": "слово"
     },
     ... (6 total)
   ]`)
    process.exit(1)
  }

  createFITBAudio(materialId, sentencesFile).catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
}
