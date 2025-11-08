require('dotenv').config({ path: '.env.local' })
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3')

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

async function findBadges() {
  const command = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME || 'linguami',
    Prefix: 'image/',
  })

  const response = await r2Client.send(command)
  const badges = response.Contents.filter(obj => {
    const key = obj.Key
    return key.includes('badge') || key.match(/xp_\d+\.webp/)
  })

  console.log(`🔍 ${badges.length} badges trouvés:\n`)

  const byFolder = {}
  badges.forEach(b => {
    const folder = b.Key.split('/').slice(0, -1).join('/')
    if (!byFolder[folder]) byFolder[folder] = []
    byFolder[folder].push(b.Key.split('/').pop())
  })

  Object.keys(byFolder).sort().forEach(folder => {
    console.log(`📁 ${folder}/`)
    byFolder[folder].sort().forEach(file => {
      console.log(`   - ${file}`)
    })
    console.log('')
  })
}

findBadges().catch(console.error)
