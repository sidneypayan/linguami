import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config({ path: '.env.local' })
const prodEnv = dotenv.config({ path: '.env.production' })

const supabase = createClient(
	prodEnv.parsed.NEXT_PUBLIC_SUPABASE_URL,
	prodEnv.parsed.SUPABASE_SERVICE_ROLE_KEY
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

	console.log('Found ' + allFiles.size + ' audio files in R2\n')
	return allFiles
}

async function auditProdAudio() {
	console.log('🔍 Auditing PRODUCTION database audio files...\n')
	console.log('⚠️  WARNING: This is the PRODUCTION database!\n')

	const { data: materials, error } = await supabase
		.from('materials')
		.select('id, title, lang, section, audio_filename')
		.not('audio_filename', 'is', null)
		.neq('audio_filename', '')  // Exclude empty strings
		.order('id')

	if (error) {
		console.error('Error:', error)
		return
	}

	console.log('Found ' + materials.length + ' materials with audio_filename\n')

	const r2Files = await listAllR2Files()

	const needsCleaning = []
	const needsNull = []
	const alreadyCorrect = []

	for (const material of materials) {
		const currentFilename = material.audio_filename.trim()
		
		if (!currentFilename) {
			needsNull.push({
				id: material.id,
				title: material.title,
				lang: material.lang,
				old: material.audio_filename
			})
			continue
		}

		// Check if filename has path prefixes
		const hasPrefix = currentFilename.includes('/') || currentFilename.startsWith('audio')
		
		// Clean filename
		let cleanFilename = currentFilename
			.replace(/^audio\//, '')
			.replace(/^audios\//, '')
			.replace(/^[a-z]{2}\//, '')
			.replace(/^materials\//, '')
			.replace(/^.*\//, '')

		// Build expected path
		const expectedPath = 'audios/' + material.lang + '/materials/' + cleanFilename

		// Check exact match
		let exists = false
		for (const [filename, path] of r2Files) {
			if (path === expectedPath) {
				exists = true
				break
			}
		}

		if (exists) {
			if (hasPrefix) {
				needsCleaning.push({
					id: material.id,
					title: material.title,
					lang: material.lang,
					old: currentFilename,
					new: cleanFilename
				})
			} else {
				alreadyCorrect.push({
					id: material.id,
					title: material.title,
					filename: currentFilename
				})
			}
		} else {
			needsNull.push({
				id: material.id,
				title: material.title,
				lang: material.lang,
				old: currentFilename
			})
		}
	}

	// Display results
	console.log('═══════════════════════════════════════════════════════════')
	console.log('📊 PRODUCTION AUDIT RESULTS:')
	console.log('  ✅ Already correct: ' + alreadyCorrect.length)
	console.log('  🧹 Need path cleaning: ' + needsCleaning.length)
	console.log('  ❌ Files missing (set to NULL): ' + needsNull.length)
	console.log('═══════════════════════════════════════════════════════════\n')

	if (alreadyCorrect.length > 0) {
		console.log('✅ Already correct (' + alreadyCorrect.length + ' files) - no action needed\n')
	}

	if (needsCleaning.length > 0) {
		console.log('🧹 NEED PATH CLEANING (' + needsCleaning.length + '):\n')
		needsCleaning.forEach(item => {
			console.log('Material #' + item.id + ': ' + item.title + ' (' + item.lang + ')')
			console.log('  ' + item.old + ' → ' + item.new)
			console.log('')
		})
	}

	if (needsNull.length > 0) {
		console.log('❌ SET TO NULL (' + needsNull.length + '):\n')
		needsNull.slice(0, 30).forEach(item => {
			console.log('Material #' + item.id + ': ' + item.title + ' (' + item.lang + ')')
			console.log('  Old: ' + item.old)
			console.log('')
		})
		if (needsNull.length > 30) {
			console.log('... and ' + (needsNull.length - 30) + ' more\n')
		}
	}

	// Save fix data
	console.log('\n💾 Saving fix data...')
	
	const fixData = {
		needsCleaning,
		needsNull
	}

	fs.writeFileSync(
		'D:/linguami/scripts/prod-audio-fixes.json',
		JSON.stringify(fixData, null, 2)
	)

	console.log('✅ Audit complete! Fix data saved to scripts/prod-audio-fixes.json')
	console.log('\n⚠️  Review the changes carefully before applying to production!')
}

auditProdAudio()
