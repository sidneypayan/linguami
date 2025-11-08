/**
 * Vérifie la structure des dossiers audio/ dans le bucket R2
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

async function listAudioStructure() {
	console.log('🔍 Structure du dossier audio/\n')
	console.log('='.repeat(60))
	console.log('')

	// Lister avec délimiteur pour voir les "dossiers"
	const command = new ListObjectsV2Command({
		Bucket: R2_BUCKET_NAME,
		Prefix: 'audio/',
		Delimiter: '/',
		MaxKeys: 1000,
	})

	const response = await r2Client.send(command)

	console.log('📁 Sous-dossiers dans audio/:\n')
	if (response.CommonPrefixes && response.CommonPrefixes.length > 0) {
		response.CommonPrefixes.forEach(prefix => {
			console.log(`   ${prefix.Prefix}`)
		})
	} else {
		console.log('   (Aucun sous-dossier trouvé)')
	}

	console.log('')
	console.log('📄 Fichiers à la racine de audio/:\n')
	if (response.Contents && response.Contents.length > 0) {
		const rootFiles = response.Contents.filter(obj => !obj.Key.endsWith('/'))
		console.log(`   ${rootFiles.length} fichier(s) trouvé(s)`)
		rootFiles.slice(0, 20).forEach(obj => {
			console.log(`   - ${obj.Key}`)
		})
		if (rootFiles.length > 20) {
			console.log(`   ... et ${rootFiles.length - 20} autres fichiers`)
		}
	} else {
		console.log('   (Aucun fichier à la racine)')
	}

	console.log('')
	console.log('='.repeat(60))

	// Compter les fichiers dans chaque sous-dossier
	console.log('📊 Nombre de fichiers par sous-dossier:\n')

	const folders = ['audio/fr/', 'audio/ru/', 'audio/en/']

	for (const folder of folders) {
		let count = 0
		let continuationToken = null

		do {
			const cmd = new ListObjectsV2Command({
				Bucket: R2_BUCKET_NAME,
				Prefix: folder,
				ContinuationToken: continuationToken,
			})

			const resp = await r2Client.send(cmd)

			if (resp.Contents) {
				count += resp.Contents.filter(obj => !obj.Key.endsWith('/')).length
			}

			continuationToken = resp.NextContinuationToken
		} while (continuationToken)

		console.log(`   ${folder} → ${count} fichier(s)`)
	}

	console.log('')
	console.log('='.repeat(60))
}

listAudioStructure().catch(console.error)
