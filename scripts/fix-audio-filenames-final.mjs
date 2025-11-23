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
	const allFiles = new Map()
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
				const baseName = filename.replace(/\.(mp3|m4a)$/, '')
				if (baseName.length > 2) {
					allFiles.set(filename, obj.Key)
				}
			})
		}

		continuationToken = response.NextContinuationToken
	} while (continuationToken)

	return allFiles
}

function normalize(str) {
	return str.toLowerCase().replace(/[_-]/g, '').replace(/\.(mp3|m4a)$/, '')
}

function findBestMatch(cleanFilename, r2Files, materialLang) {
	let bestMatch = null
	let bestScore = 0
	
	const searchBase = normalize(cleanFilename)
	
	for (const [filename, path] of r2Files) {
		// Only consider files in the correct language folder
		if (!path.startsWith('audios/' + materialLang + '/materials/')) continue
		
		const fileBase = normalize(filename)
		
		// Scoring system
		let score = 0
		
		// Perfect match
		if (fileBase === searchBase) {
			score = 1.0
		}
		// One starts with the other
		else if (fileBase.startsWith(searchBase) || searchBase.startsWith(fileBase)) {
			const minLen = Math.min(fileBase.length, searchBase.length)
			const maxLen = Math.max(fileBase.length, searchBase.length)
			score = 0.7 + (minLen / maxLen) * 0.2
		}
		// One contains the other
		else if (fileBase.includes(searchBase) || searchBase.includes(fileBase)) {
			score = 0.5
		}
		
		if (score > bestScore) {
			bestScore = score
			bestMatch = { filename, path, score }
		}
	}
	
	// Only return matches with score > 0.5
	return bestScore > 0.5 ? bestMatch : null
}

async function fixAudioFilenames(applyChanges = false) {
	console.log('🔧 Fixing audio_filename values in database...\n')

	const { data: materials, error } = await supabase
		.from('materials')
		.select('id, title, lang, section, audio_filename')
		.not('audio_filename', 'is', null)
		.order('id')

	if (error) {
		console.error('Error:', error)
		return
	}

	console.log('Found ' + materials.length + ' materials with audio_filename\n')

	const r2Files = await listAllR2Files()
	console.log('Found ' + r2Files.size + ' audio files in R2\n')

	const updates = []
	const setToNull = []

	for (const material of materials) {
		const currentFilename = material.audio_filename
		
		// Clean filename
		let cleanFilename = currentFilename
			.replace(/^audio\//, '')
			.replace(/^audios\//, '')
			.replace(/^[a-z]{2}\//, '')
			.replace(/^materials\//, '')
			.replace(/^.*\//, '')

		// Build expected path
		const expectedPath = 'audios/' + material.lang + '/materials/' + cleanFilename

		// Check exact match first
		let match = null
		for (const [filename, path] of r2Files) {
			if (path === expectedPath) {
				match = { filename: cleanFilename, path: expectedPath, score: 1.0 }
				break
			}
		}

		// If no exact match, try to find similar
		if (!match) {
			match = findBestMatch(cleanFilename, r2Files, material.lang)
		}

		if (match) {
			if (match.filename !== currentFilename) {
				updates.push({
					id: material.id,
					title: material.title,
					old: currentFilename,
					new: match.filename,
					path: match.path,
					score: match.score
				})
			}
		} else {
			setToNull.push({
				id: material.id,
				title: material.title,
				old: currentFilename
			})
		}
	}

	// Display results
	console.log('═══════════════════════════════════════════════════════════')
	console.log('📊 SUMMARY:')
	console.log('  ✅ Files to update: ' + updates.length)
	console.log('  ❌ Files to set NULL: ' + setToNull.length)
	console.log('═══════════════════════════════════════════════════════════\n')

	if (updates.length > 0) {
		console.log('✏️  UPDATES:\n')
		updates.forEach(u => {
			console.log('Material #' + u.id + ': ' + u.title)
			console.log('  ' + u.old + ' → ' + u.new)
			console.log('  Path: ' + u.path)
			console.log('  Score: ' + u.score.toFixed(2))
			console.log('')
		})
	}

	if (setToNull.length > 0) {
		console.log('❌ SET TO NULL:\n')
		setToNull.forEach(item => {
			console.log('Material #' + item.id + ': ' + item.title)
			console.log('  ' + item.old)
			console.log('')
		})
	}

	// Apply changes if requested
	if (applyChanges) {
		console.log('\n🚀 Applying changes...\n')
		
		for (const update of updates) {
			const { error } = await supabase
				.from('materials')
				.update({ audio_filename: update.new })
				.eq('id', update.id)
			
			if (error) {
				console.log('❌ Error updating #' + update.id + ': ' + error.message)
			} else {
				console.log('✅ Updated #' + update.id)
			}
		}
		
		for (const item of setToNull) {
			const { error } = await supabase
				.from('materials')
				.update({ audio_filename: null })
				.eq('id', item.id)
			
			if (error) {
				console.log('❌ Error updating #' + item.id + ': ' + error.message)
			} else {
				console.log('✅ Set NULL for #' + item.id)
			}
		}
		
		console.log('\n✅ Done!')
	} else {
		console.log('\n⚠️  DRY RUN - No changes applied')
		console.log('Run with APPLY=true to apply changes: APPLY=true node script.mjs\n')
	}
}

const applyChanges = process.env.APPLY === 'true'
fixAudioFilenames(applyChanges)
