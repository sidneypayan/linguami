const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3')
require('dotenv').config({ path: '.env.local' })

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

async function listFiles() {
  try {
    console.log('Searching for audio files in R2...\n')
    console.log('Bucket:', process.env.R2_BUCKET_NAME)
    console.log('Public URL:', process.env.NEXT_PUBLIC_R2_PUBLIC_URL)
    console.log()

    // Search for files containing "cafe" or other lesson words
    const searchPrefixes = [
      'linguami/audios/fr/',
      'audios/fr/',
      'linguami/audio/fr/',
      'audio/fr/',
    ]

    for (const prefix of searchPrefixes) {
      console.log(`Searching in: ${prefix}`)
      const response = await s3Client.send(new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: 200,
      }))

      if (response.Contents && response.Contents.length > 0) {
        // Filter for mp3 files containing lesson words
        const lessonFiles = response.Contents.filter(item =>
          item.Key.includes('cafe') ||
          item.Key.includes('etudiant') ||
          item.Key.includes('mere') ||
          item.Key.includes('pere') ||
          item.Key.includes('etre') ||
          item.Key.includes('foret') ||
          item.Key.includes('noel') ||
          item.Key.includes('naif') ||
          item.Key.includes('lesson-1') ||
          item.Key.includes('beginner')
        )

        if (lessonFiles.length > 0) {
          console.log(`  ✓ Found ${lessonFiles.length} files:`)
          lessonFiles.forEach(item => console.log(`    - ${item.Key}`))
        } else {
          console.log(`  No lesson files found (${response.Contents.length} total files)`)
        }
      } else {
        console.log(`  (empty)`)
      }
      console.log()
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
}

listFiles()
