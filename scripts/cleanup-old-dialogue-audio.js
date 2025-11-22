#!/usr/bin/env node
const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3')
require('dotenv').config({ path: '.env.local' })

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

async function cleanupOldDialogueAudio(materialId) {
  console.log(`\n🧹 Cleaning up old individual audio files for dialogue #${materialId}\n`)

  const prefix = `audios/fr/dialogues/material_${materialId}/line_`

  // List all files with the prefix
  const listCommand = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME,
    Prefix: prefix
  })

  const listResponse = await r2.send(listCommand)

  if (!listResponse.Contents || listResponse.Contents.length === 0) {
    console.log('✅ No old audio files found to delete')
    return
  }

  console.log(`📋 Found ${listResponse.Contents.length} files to delete:\n`)
  listResponse.Contents.forEach(file => {
    console.log(`   - ${file.Key}`)
  })

  // Delete all files
  const deleteCommand = new DeleteObjectsCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Delete: {
      Objects: listResponse.Contents.map(file => ({ Key: file.Key }))
    }
  })

  const deleteResponse = await r2.send(deleteCommand)

  console.log(`\n✅ Deleted ${deleteResponse.Deleted?.length || 0} files`)

  if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
    console.log(`\n⚠️  Errors:`)
    deleteResponse.Errors.forEach(error => {
      console.log(`   - ${error.Key}: ${error.Message}`)
    })
  }

  console.log(`\n✨ Cleanup complete! Only the full dialogue file remains.`)
}

// Main execution
if (require.main === module) {
  const materialId = parseInt(process.argv[2])

  if (!materialId) {
    console.log('❌ Usage: node scripts/cleanup-old-dialogue-audio.js <material_id>')
    console.log('\n📝 Example:')
    console.log('   node scripts/cleanup-old-dialogue-audio.js 676')
    process.exit(1)
  }

  cleanupOldDialogueAudio(materialId).catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
}
