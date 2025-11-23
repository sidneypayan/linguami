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
	console.log('📂 Listing all audio files in R2...\n')
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

	console.log('Found ' + allFiles.size + ' audio files in R2\n')
	return allFiles
}

async function checkMaterialsAudio() {
	console.log('🔍 Checking materials audio files...\n')

	// Get all materials with audio_filename
	const { data: materials, error } = await supabase
		.from('materials')
		.select('id, title, section, lang, audio_filename')
		.not('audio_filename', 'is', null)
		.order('id')

	if (error) {
		console.error('Error fetching materials:', error)
		return
	}

	console.log('Found ' + materials.length + ' materials with audio_filename\n')

	// Get all R2 files
	const r2Files = await listAllR2Files()

	// Check each material
	const missingFiles = []

	for (const material of materials) {
		// Build expected path: audios/{lang}/materials/{filename}
		const expectedPath = 'audios/' + material.lang + '/materials/' + material.audio_filename

		// Check if file exists in R2
		if (!r2Files.has(expectedPath)) {
			missingFiles.push({
				id: material.id,
				title: material.title,
				section: material.section,
				lang: material.lang,
				audio_filename: material.audio_filename,
				expected_path: expectedPath,
			})
		}
	}

	// Report results
	console.log('═══════════════════════════════════════════════════════════')
	console.log('✅ Valid audio files: ' + (materials.length - missingFiles.length))
	console.log('❌ Missing audio files: ' + missingFiles.length)
	console.log('═══════════════════════════════════════════════════════════\n')

	if (missingFiles.length > 0) {
		console.log('❌ Missing audio files:\n')
		missingFiles.slice(0, 20).forEach(item => {
			console.log('Material #' + item.id + ': ' + item.title + ' (' + item.section + '/' + item.lang + ')')
			console.log('   Filename: ' + item.audio_filename)
			console.log('   Expected at: ' + item.expected_path)
			console.log('')
		})
		
		if (missingFiles.length > 20) {
			console.log('... and ' + (missingFiles.length - 20) + ' more missing files\n')
		}
	}
}

checkMaterialsAudio()
