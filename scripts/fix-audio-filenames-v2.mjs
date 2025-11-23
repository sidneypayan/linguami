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
	const allFiles = new Map() // Map: filename -> full path
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
				const filename = obj.Key.split('/').pop()
				// Only add files with meaningful names (more than 2 chars before extension)
				const baseName = filename.replace(/\.(mp3|m4a)$/, '')
				if (baseName.length > 2) {
					allFiles.set(filename, obj.Key)
				}
			})
		}

		continuationToken = response.NextContinuationToken
	} while (continuationToken)

	console.log('Found ' + allFiles.size + ' audio files in R2\n')
	return allFiles
}

function calculateSimilarity(str1, str2) {
	// Normalize strings
	const s1 = str1.toLowerCase().replace(/[_-]/g, '').replace(/\.(mp3|m4a)$/, '')
	const s2 = str2.toLowerCase().replace(/[_-]/g, '').replace(/\.(mp3|m4a)$/, '')
	
	// Check if one contains the other (good match)
	if (s1.includes(s2) || s2.includes(s1)) {
		// But only if the length difference is not too big
		const lengthRatio = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length)
		if (lengthRatio > 0.5) {
			return 0.8
		}
	}
	
	return 0
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
			.replace(/^[a-z]{2}\//, '')
			.replace(/^materials\//, '')
			.replace(/^.*\//, '')

		// Build expected R2 path
		const expectedPath = 'audios/' + material.lang + '/materials/' + cleanFilename

		// Check if file exists with cleaned filename
		let foundPath = null
		for (const [filename, path] of r2Files) {
			if (path === expectedPath) {
				foundPath = path
				break
			}
		}

		if (foundPath) {
			// Exact match found
			if (cleanFilename !== currentFilename) {
				updates.push({
					id: material.id,
					title: material.title,
					old: currentFilename,
					new: cleanFilename,
					status: 'cleaned',
					path: foundPath
				})
			}
		} else {
			// Try to find similar file in the same language
			let bestMatch = null
			let bestScore = 0
			
			for (const [filename, path] of r2Files) {
				// Only consider files in the correct language folder
				if (path.startsWith('audios/' + material.lang + '/materials/')) {
					const score = calculateSimilarity(cleanFilename, filename)
					if (score > bestScore && score > 0.7) { // High threshold
						bestScore = score
						bestMatch = { filename, path }
					}
				}
			}

			if (bestMatch) {
				updates.push({
					id: material.id,
					title: material.title,
					old: currentFilename,
					new: bestMatch.filename,
					status: 'matched',
					path: bestMatch.path,
					score: bestScore
				})
			} else {
				// No match found - set to NULL
				setToNull.push({
					id: material.id,
					title: material.title,
					old: currentFilename
				})
			}
		}
	}

	// Display results
	console.log('═══════════════════════════════════════════════════════════')
	console.log('📊 SUMMARY:')
	console.log('  ✅ Files to clean: ' + updates.filter(u => u.status === 'cleaned').length)
	console.log('  🔗 Files to match: ' + updates.filter(u => u.status === 'matched').length)
	console.log('  ❌ Files to set NULL: ' + setToNull.length)
	console.log('═══════════════════════════════════════════════════════════\n')

	if (updates.length > 0) {
		console.log('✏️  UPDATES TO APPLY:\n')
		updates.forEach(u => {
			console.log('Material #' + u.id + ': ' + u.title)
			console.log('  Old: ' + u.old)
			console.log('  New: ' + u.new)
			console.log('  Path: ' + u.path)
			if (u.score) {
				console.log('  Match score: ' + u.score.toFixed(2))
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
	console.log('Review the changes above carefully before applying.\n')
}

fixAudioFilenames()
