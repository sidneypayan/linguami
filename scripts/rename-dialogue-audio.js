#!/usr/bin/env node
const { S3Client, CopyObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { createClient } = require('@supabase/supabase-js')
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

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD') // Normalize accents
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

async function renameDialogueAudio(materialId) {
  console.log(`\n📝 Renaming dialogue audio for material #${materialId}\n`)

  // Get material from database
  const { data: material, error: materialError } = await supabase
    .from('materials')
    .select('title')
    .eq('id', materialId)
    .single()

  if (materialError || !material) {
    console.error(`❌ Material ${materialId} not found`)
    process.exit(1)
  }

  const slug = slugify(material.title)
  console.log(`📖 Dialogue title: ${material.title}`)
  console.log(`🔤 Slug: ${slug}`)

  const oldKey = `audios/fr/dialogues/material_${materialId}/full_dialogue_v3.mp3`
  const newKey = `audios/fr/dialogues/material_${materialId}/${slug}.mp3`

  console.log(`\n📁 Old key: ${oldKey}`)
  console.log(`📁 New key: ${newKey}`)

  // Copy object with new name
  console.log(`\n📋 Copying object...`)
  const copyCommand = new CopyObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    CopySource: `${process.env.R2_BUCKET_NAME}/${oldKey}`,
    Key: newKey,
    ContentType: 'audio/mpeg',
  })

  await r2.send(copyCommand)
  console.log(`✅ Copied to new location`)

  // Delete old object
  console.log(`\n🗑️  Deleting old file...`)
  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: oldKey
  })

  await r2.send(deleteCommand)
  console.log(`✅ Old file deleted`)

  const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${newKey}`
  console.log(`\n✅ Rename complete!`)
  console.log(`\n🔗 New URL: ${publicUrl}`)

  // Update metadata file
  const fs = require('fs')
  const metadataFile = `dialogue-${materialId}-v3-metadata.json`

  if (fs.existsSync(metadataFile)) {
    const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'))
    metadata.audioUrl = publicUrl
    metadata.fileName = `${slug}.mp3`
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2))
    console.log(`\n💾 Metadata updated: ${metadataFile}`)
  }
}

// Main execution
if (require.main === module) {
  const materialId = parseInt(process.argv[2])

  if (!materialId) {
    console.log('❌ Usage: node scripts/rename-dialogue-audio.js <material_id>')
    console.log('\n📝 Example:')
    console.log('   node scripts/rename-dialogue-audio.js 676')
    process.exit(1)
  }

  renameDialogueAudio(materialId).catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
}
