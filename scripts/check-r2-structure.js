/**
 * Script pour vérifier la structure du bucket R2
 */

require('dotenv').config({ path: '.env.local' })
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3')

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'linguami'

const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
})

async function listAll(prefix = '') {
	const objects = []
	let continuationToken = null

	do {
		const command = new ListObjectsV2Command({
			Bucket: R2_BUCKET_NAME,
			Prefix: prefix,
			ContinuationToken: continuationToken,
			MaxKeys: 100,
		})

		const response = await r2Client.send(command)

		if (response.Contents) {
			objects.push(...response.Contents)
		}

		continuationToken = response.NextContinuationToken
	} while (continuationToken)

	return objects
}

async function main() {
	console.log('📋 Fichiers UI dans image/:\n')

	try {
		const objects = await listAll('image/')

		// Patterns à rechercher
		const PATTERNS = [
			/^xp_/i,
			/^dwarf_(male|female)\.webp$/i,
			/^elf_(male|female)\.webp$/i,
			/^undead_(male|female)\.webp$/i,
			/^tauren_(male|female)\.webp$/i,
			/^gnome_(male|female)\.webp$/i,
			/^wizard_(male|female)\.webp$/i,
			/^orc_(male|female)\.webp$/i,
		]

		const uiFiles = objects
			.filter(obj => {
				// Extraire le nom du dossier (qui est le nom du fichier)
				const parts = obj.Key.split('/')
				if (parts.length < 2) return false

				const folderName = parts[1]

				// Vérifier si c'est un fichier UI
				return PATTERNS.some(pattern => pattern.test(folderName))
			})
			.map(obj => obj.Key)

		console.log(`Trouvé ${uiFiles.length} objets UI:\n`)

		uiFiles.sort().forEach((key, index) => {
			if (index < 3) {
				console.log(`  - ${key} (exemple complet)`)
			} else {
				const folderName = key.split('/')[1]
				console.log(`  - ${folderName}`)
			}
		})
	} catch (error) {
		console.error('Erreur:', error)
	}
}

main()
