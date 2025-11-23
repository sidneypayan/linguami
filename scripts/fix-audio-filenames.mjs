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
	console.log('📂 Listing all audio files in R2...')
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

async function fixAudioFilenames() {
	console.log('🔧 Fixing audio_filename values in database...\n')

	// Get all materials with audio_filename
	const { data: materials, error } = await supabase
		.from('materials')
		.select('id, title, lang, section, audio_filename')
		.not('audio_filename', 'is', null)
		.order('id')

	if (error) {
		console.error('Error fetching materials:', error)
		return
	}

	console.log('Found ' + materials.length + ' materials with audio_filename\n')

	// Get all R2 files
	const r2Files = await listAllR2Files()

	const updates = []
	const setToNull = []

	for (const material of materials) {
		const currentFilename = material.audio_filename
		
		// Remove any path prefixes to get just the filename
		let cleanFilename = currentFilename
			.replace(/^audio\//, '')
			.replace(/^audios\//, '')
			.replace(/^[a-z]{2}\//, '') // Remove lang prefix (fr/, ru/, en/)
			.replace(/^materials\//, '')
			.replace(/^.*\//, '') // Remove any remaining path

		// Build expected R2 path
		const expectedPath = 'audios/' + material.lang + '/materials/' + cleanFilename

		// Check if file exists
		if (r2Files.has(expectedPath)) {
			// File exists with cleaned filename
			if (cleanFilename !== currentFilename) {
				updates.push({
					id: material.id,
					title: material.title,
					old: currentFilename,
					new: cleanFilename,
					status: 'cleaned'
				})
			}
		} else {
			// File doesn't exist - try to find similar file
			const baseName = cleanFilename.replace(/\.(mp3|m4a)$/, '').toLowerCase()
			const similar = Array.from(r2Files).filter(path => {
				const filename = path.split('/').pop().replace(/\.(mp3|m4a)$/, '').toLowerCase()
				return filename.includes(baseName) || baseName.includes(filename)
			})

			if (similar.length > 0) {
				// Found similar file - use it
				const actualFilename = similar[0].split('/').pop()
				updates.push({
					id: material.id,
					title: material.title,
					old: currentFilename,
					new: actualFilename,
					status: 'matched_similar',
					similarPath: similar[0]
				})
			} else {
				// No file found - set to NULL
				setToNull.push({
					id: material.id,
					title: material.title,
					old: currentFilename,
					status: 'not_found'
				})
			}
		}
	}

	// Display results
	console.log('═══════════════════════════════════════════════════════════')
	console.log('📊 SUMMARY:')
	console.log('  ✅ Files to clean: ' + updates.filter(u => u.status === 'cleaned').length)
	console.log('  🔗 Files to match: ' + updates.filter(u => u.status === 'matched_similar').length)
	console.log('  ❌ Files to set NULL: ' + setToNull.length)
	console.log('═══════════════════════════════════════════════════════════\n')

	if (updates.length > 0) {
		console.log('✏️  UPDATES TO APPLY:\n')
		updates.forEach(u => {
			console.log('Material #' + u.id + ': ' + u.title)
			console.log('  Old: ' + u.old)
			console.log('  New: ' + u.new)
			if (u.similarPath) {
				console.log('  Found at: ' + u.similarPath)
			}
			console.log('')
		})
	}

	if (setToNull.length > 0) {
		console.log('❌ SET TO NULL (files not found):\n')
		setToNull.forEach(item => {
			console.log('Material #' + item.id + ': ' + item.title)
			console.log('  Old: ' + item.old)
			console.log('')
		})
	}

	console.log('\n⚠️  NO CHANGES APPLIED YET - This is a dry run')
	console.log('Review the changes above and confirm if you want to apply them.\n')
}

fixAudioFilenames()
