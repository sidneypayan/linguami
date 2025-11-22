#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
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

// Voice configuration for "Au restaurant" dialogue
const VOICES = {
  SERVEUR: 'qNc8cbRJLnPqGTjuVcKa',  // Voice for waiter
  SOPHIE: 'sANWqF1bCMzR6eyZbCGw',   // Marie - middle-aged, confident
  MARC: '5jCmrHdxbpU36l1wb3Ke'      // Sébas - young, casual
}

function parseDialogue(content) {
  // Parse dialogue format: [CHARACTER_NAME] text
  const lines = content.split('\n').filter(line => line.trim())
  const dialogueLines = []

  lines.forEach(line => {
    const match = line.match(/\[([A-ZÀ-ÿ\s]+)\]\s*(.+)/)
    if (match) {
      const character = match[1].trim()
      const text = match[2].trim()
      dialogueLines.push({ character, text })
    }
  })

  return dialogueLines
}

async function generateDialogueWithV3(materialId) {
  console.log(`\n🎭 Generating dialogue audio with Eleven v3 Dialogue Mode\n`)

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

  console.log(`📖 Dialogue: ${material.title}`)
  console.log(`   Language: ${material.lang}`)
  console.log(`   Section: ${material.section}`)

  // Parse dialogue content
  const dialogueLines = parseDialogue(material.content)
  console.log(`\n📝 Found ${dialogueLines.length} dialogue lines\n`)

  // Build dialogue_inputs array for API
  const dialogueInputs = dialogueLines.map(({ character, text }) => {
    const voiceId = VOICES[character]
    if (!voiceId) {
      console.warn(`⚠️  No voice configured for character: ${character}`)
      return null
    }

    console.log(`   ${character}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`)

    return {
      text: text,
      voice_id: voiceId
    }
  }).filter(Boolean) // Remove any null entries

  console.log(`\n🎙️  Generating dialogue with ${dialogueInputs.length} turns...\n`)

  // Call ElevenLabs Text-to-Dialogue API
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-dialogue', {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: dialogueInputs,
      model_id: 'eleven_v3',
      output_format: 'mp3_44100_128',
      language_code: 'fr'
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`ElevenLabs API error: ${errorText}`)
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer())
  console.log(`✅ Audio generated successfully (${audioBuffer.length} bytes)`)

  // Upload to R2
  const key = `audios/fr/dialogues/material_${materialId}/full_dialogue_v3.mp3`

  console.log(`\n📤 Uploading to R2: ${key}`)

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: audioBuffer,
    ContentType: 'audio/mpeg',
  })

  await r2.send(command)

  const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`
  console.log(`✅ Uploaded: ${publicUrl}`)

  // Save metadata to JSON file
  const fs = require('fs')
  const metadata = {
    materialId,
    title: material.title,
    model: 'eleven_v3',
    dialogueMode: true,
    speakers: Object.keys(VOICES),
    audioUrl: publicUrl,
    linesCount: dialogueInputs.length,
    generatedAt: new Date().toISOString()
  }

  const outputFile = `dialogue-${materialId}-v3-metadata.json`
  fs.writeFileSync(outputFile, JSON.stringify(metadata, null, 2))

  console.log(`\n✅ Dialogue generation complete!`)
  console.log(`\n📊 Summary:`)
  console.log(`   Model: Eleven v3 (Dialogue Mode)`)
  console.log(`   Speakers: ${Object.keys(VOICES).join(', ')}`)
  console.log(`   Lines: ${dialogueInputs.length}`)
  console.log(`   Audio URL: ${publicUrl}`)
  console.log(`\n💾 Metadata saved to: ${outputFile}`)
}

// Main execution
if (require.main === module) {
  const materialId = parseInt(process.argv[2])

  if (!materialId) {
    console.log('❌ Usage: node scripts/generate-dialogue-v3.js <material_id>')
    console.log('\n📝 Example:')
    console.log('   node scripts/generate-dialogue-v3.js 676')
    console.log('\n✨ This uses ElevenLabs Eleven v3 Dialogue Mode to generate')
    console.log('   a single, natural-flowing dialogue audio file with multiple speakers.')
    process.exit(1)
  }

  generateDialogueWithV3(materialId).catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
}
