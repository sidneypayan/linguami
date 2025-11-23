import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	},
})

async function checkAudioStructure() {
	console.log('🔍 Checking R2 audio structure...\n')
	console.log(`Bucket: ${process.env.R2_BUCKET_NAME}\n`)

	// Check for "audio/" prefix
	const audioCommand = new ListObjectsV2Command({
		Bucket: process.env.R2_BUCKET_NAME,
		Prefix: 'audio/',
		MaxKeys: 20,
	})

	// Check for "audios/" prefix
	const audiosCommand = new ListObjectsV2Command({
		Bucket: process.env.R2_BUCKET_NAME,
		Prefix: 'audios/',
		MaxKeys: 20,
	})

	try {
		console.log('📁 Checking "audio/" prefix:')
		const audioResult = await client.send(audioCommand)
		if (audioResult.Contents && audioResult.Contents.length > 0) {
			console.log(`   Found ${audioResult.KeyCount} files`)
			audioResult.Contents.slice(0, 5).forEach(obj => {
				console.log(`   - ${obj.Key}`)
			})
		} else {
			console.log('   ❌ No files found')
		}

		console.log('\n📁 Checking "audios/" prefix:')
		const audiosResult = await client.send(audiosCommand)
		if (audiosResult.Contents && audiosResult.Contents.length > 0) {
			console.log(`   Found ${audiosResult.KeyCount} files`)
			audiosResult.Contents.slice(0, 5).forEach(obj => {
				console.log(`   - ${obj.Key}`)
			})
		} else {
			console.log('   ❌ No files found')
		}

		// Check specifically for the presentations.m4a file
		console.log('\n🔍 Looking for presentations.m4a file:')
		const searchPaths = [
			'audio/ru/materials/presentations.m4a',
			'audios/ru/materials/presentations.m4a',
			'audio/materials/ru/presentations.m4a',
			'audios/materials/ru/presentations.m4a',
		]

		for (const path of searchPaths) {
			const checkCommand = new ListObjectsV2Command({
				Bucket: process.env.R2_BUCKET_NAME,
				Prefix: path,
				MaxKeys: 1,
			})
			const result = await client.send(checkCommand)
			if (result.Contents && result.Contents.length > 0) {
				console.log(`   ✅ Found at: ${path}`)
			} else {
				console.log(`   ❌ Not found at: ${path}`)
			}
		}

	} catch (error) {
		console.error('Error checking R2:', error)
	}
}

checkAudioStructure()
