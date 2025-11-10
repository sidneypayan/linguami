require('dotenv').config({ path: '.env.local' })
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3')

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	},
})

async function listAllR2Content() {
	console.log('📦 Listing all R2 bucket content...\n')
	console.log(`Bucket: ${process.env.R2_BUCKET_NAME}`)
	console.log(`Public URL: ${process.env.R2_PUBLIC_URL}\n`)

	try {
		const allObjects = []
		let continuationToken = undefined
		let totalSize = 0

		// Liste tous les objets (avec pagination)
		do {
			const command = new ListObjectsV2Command({
				Bucket: process.env.R2_BUCKET_NAME,
				ContinuationToken: continuationToken,
				MaxKeys: 1000,
			})

			const response = await s3Client.send(command)

			if (response.Contents) {
				allObjects.push(...response.Contents)
				totalSize += response.Contents.reduce((sum, obj) => sum + (obj.Size || 0), 0)
			}

			continuationToken = response.NextContinuationToken
			console.log(`Fetched ${allObjects.length} objects so far...`)
		} while (continuationToken)

		console.log(`\n📊 SUMMARY:`)
		console.log(`   Total files: ${allObjects.length}`)
		console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)

		// Grouper par dossier/type
		const filesByFolder = {}
		allObjects.forEach(obj => {
			const parts = obj.Key.split('/')
			const folder = parts[0] || 'root'
			if (!filesByFolder[folder]) {
				filesByFolder[folder] = []
			}
			filesByFolder[folder].push(obj)
		})

		console.log(`\n📁 Content by folder:\n`)
		Object.keys(filesByFolder).sort().forEach(folder => {
			const files = filesByFolder[folder]
			const folderSize = files.reduce((sum, f) => sum + (f.Size || 0), 0)
			console.log(`   ${folder}/`)
			console.log(`      Files: ${files.length}`)
			console.log(`      Size: ${(folderSize / 1024 / 1024).toFixed(2)} MB`)

			// Afficher quelques exemples
			if (files.length > 0) {
				console.log(`      Samples:`)
				files.slice(0, 5).forEach(file => {
					console.log(`         - ${file.Key}`)
				})
				if (files.length > 5) {
					console.log(`         ... and ${files.length - 5} more`)
				}
			}
			console.log('')
		})

	} catch (error) {
		console.error('❌ Error listing R2 content:', error.message)
	}
}

listAllR2Content()
