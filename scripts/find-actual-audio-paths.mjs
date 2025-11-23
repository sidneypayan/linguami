import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

const r2Client = new S3Client({
	region: 'auto',
	endpoint: 'https://' + process.env.R2_ACCOUNT_ID + '.r2.cloudflarestorage.com',
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	},
})

async function listAllR2Files() {
	const allFiles = new Set()
	let continuationToken = undefined

	do {
		const command = new ListObjectsV2Command({
			Bucket: process.env.R2_BUCKET_NAME,
			Prefix: 'audios/',
			ContinuationToken: continuationToken,
		})

		const response = await r2Client.send(command)
		
		if (response.Contents) {
			response.Contents.forEach(obj => {
				allFiles.add(obj.Key)
			})
		}

		continuationToken = response.NextContinuationToken
	} while (continuationToken)

	return allFiles
}

async function findActualPaths() {
	console.log('🔍 Finding actual audio file paths...\n')

	// Get problematic materials
	const { data: materials, error } = await supabase
		.from('materials')
		.select('id, title, lang, audio_filename')
		.in('id', [128, 129, 130, 132, 134, 136, 142, 143, 144, 146, 147, 149, 150, 192])

	if (error) {
		console.error('Error:', error)
		return
	}

	const r2Files = await listAllR2Files()

	console.log('Checking each material...\n')

	for (const material of materials) {
		console.log('Material #' + material.id + ': ' + material.title)
		console.log('   DB value: ' + material.audio_filename)

		// Try different path patterns
		const patterns = [
			'audios/' + material.lang + '/materials/' + material.audio_filename,
			material.audio_filename, // Try as-is
			'audios/' + material.audio_filename, // Try with audios prefix
		]

		let found = false
		for (const pattern of patterns) {
			if (r2Files.has(pattern)) {
				console.log('   ✅ Found at: ' + pattern)
				found = true
				break
			}
		}

		if (!found) {
			// Search for similar files
			const baseName = material.audio_filename.split('/').pop().replace('.mp3', '')
			const similar = Array.from(r2Files).filter(f => f.includes(baseName))
			if (similar.length > 0) {
				console.log('   ⚠️  Similar files found:')
				similar.forEach(f => console.log('       - ' + f))
			} else {
				console.log('   ❌ Not found anywhere')
			}
		}

		console.log('')
	}
}

findActualPaths()
