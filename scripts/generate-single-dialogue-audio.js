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

// French voices for ElevenLabs
const FRENCH_VOICES = {
  'PIERRE': '5jCmrHdxbpU36l1wb3Ke',     // Sébas - young male
  'MARIE': 'sANWqF1bCMzR6eyZbCGw',      // Marie - female
  'THOMAS': '5jCmrHdxbpU36l1wb3Ke',     // Sébas
  'JULIE': 'sANWqF1bCMzR6eyZbCGw',      // Marie
  'CLAIRE': 'sANWqF1bCMzR6eyZbCGw',     // Marie
  'MARC': 'qNc8cbRJLnPqGTjuVcKa',       // Other male voice
  'SOPHIE': 'sANWqF1bCMzR6eyZbCGw',     // Marie
  'NICOLAS': '5jCmrHdxbpU36l1wb3Ke',    // Sébas
  'JULIEN': 'qNc8cbRJLnPqGTjuVcKa',     // Other male voice
  'ALEXANDRE': '5jCmrHdxbpU36l1wb3Ke',  // Sébas
  'EMMA': 'sANWqF1bCMzR6eyZbCGw',       // Marie
  'MAXIME': 'qNc8cbRJLnPqGTjuVcKa',     // Other male voice
  'LAURA': 'sANWqF1bCMzR6eyZbCGw',      // Marie
  'CHARLOTTE': 'sANWqF1bCMzR6eyZbCGw',  // Marie
  'ANTOINE': '5jCmrHdxbpU36l1wb3Ke',    // Sébas
  'LUCIE': 'sANWqF1bCMzR6eyZbCGw',      // Marie

  // Roles
  'CLIENT': '5jCmrHdxbpU36l1wb3Ke',     // Sébas
  'EMPLOYÉ': 'qNc8cbRJLnPqGTjuVcKa',    // Professional male
  'CAISSIER': 'qNc8cbRJLnPqGTjuVcKa',   // Professional male
  'VENDEUR': 'qNc8cbRJLnPqGTjuVcKa',    // Professional male
  'SERVEUR': 'qNc8cbRJLnPqGTjuVcKa',    // Professional male
  'PASSAGER': '5jCmrHdxbpU36l1wb3Ke',   // Sébas
  'PHARMACIEN': 'qNc8cbRJLnPqGTjuVcKa', // Professional male
  'LIBRAIRE': 'qNc8cbRJLnPqGTjuVcKa',   // Professional male
  'FLEURISTE': 'sANWqF1bCMzR6eyZbCGw',  // Marie
  'PROFESSEUR': 'qNc8cbRJLnPqGTjuVcKa', // Professional male
  'ÉLÈVE': 'sANWqF1bCMzR6eyZbCGw',      // Marie
  'GRAND-MÈRE': 'sANWqF1bCMzR6eyZbCGw', // Marie
  'ENFANT': 'sANWqF1bCMzR6eyZbCGw',     // Marie
  'DOCTEUR': 'qNc8cbRJLnPqGTjuVcKa',    // Professional male
  'PATIENT': '5jCmrHdxbpU36l1wb3Ke',    // Sébas
}

function parseDialogue(content) {
  const lines = content.split('\n').filter(line => line.trim())
  const dialogueLines = []

  lines.forEach(line => {
    const match = line.match(/\[([A-ZÀ-ÿ\-\s]+)\]\s*(.+)/)
    if (match) {
      const character = match[1].trim()
      const text = match[2].trim()
      dialogueLines.push({ character, text })
    }
  })

  return dialogueLines
}

async function generateDialogueAudio(materialId) {
  console.log(`\n🎭 Generating audio for dialogue #${materialId}\n`)

  // Get dialogue from database
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
  console.log(`   Level: ${material.level}`)

  // Parse dialogue content
  const dialogueLines = parseDialogue(material.content)
  console.log(`\n📝 Found ${dialogueLines.length} dialogue lines`)

  // Build inputs for ElevenLabs v3 Dialogue Mode
  const dialogueInputs = dialogueLines.map(({ character, text }) => {
    const voiceId = FRENCH_VOICES[character]
    if (!voiceId) {
      console.warn(`⚠️  No voice configured for character: ${character}`)
      return null
    }

    console.log(`   ${character}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`)

    return {
      text: text,
      voice_id: voiceId
    }
  }).filter(Boolean)

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

  // Create slug from title
  const slug = material.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  // Upload to R2
  const key = `audios/fr/dialogues/material_${materialId}/${slug}.mp3`

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

  // Update database with audio filename
  const { error: updateError } = await supabase
    .from('materials')
    .update({ audio_filename: `${slug}.mp3` })
    .eq('id', materialId)

  if (updateError) {
    console.error(`❌ Error updating database:`, updateError)
  } else {
    console.log(`✅ Database updated with audio filename`)
  }

  console.log(`\n✅ Dialogue audio generation complete!`)
  console.log(`\n📊 Summary:`)
  console.log(`   ID: ${materialId}`)
  console.log(`   Title: ${material.title}`)
  console.log(`   Lines: ${dialogueInputs.length}`)
  console.log(`   Audio URL: ${publicUrl}`)
}

// Main execution
if (require.main === module) {
  const materialId = parseInt(process.argv[2])

  if (!materialId) {
    console.log('❌ Usage: node scripts/generate-single-dialogue-audio.js <material_id>')
    console.log('\n📝 Example:')
    console.log('   node scripts/generate-single-dialogue-audio.js 677')
    process.exit(1)
  }

  generateDialogueAudio(materialId).catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
}
