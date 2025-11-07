/**
 * Script de migration de Supabase Storage vers Cloudflare R2
 *
 * Ce script :
 * 1. Liste tous les fichiers dans le bucket Supabase "linguami"
 * 2. Télécharge chaque fichier
 * 3. Les upload vers Cloudflare R2
 * 4. Génère un rapport de migration
 *
 * Prérequis :
 * - npm install @aws-sdk/client-s3 @supabase/supabase-js dotenv
 * - Configurer les variables d'environnement R2 dans .env.local
 *
 * Usage :
 * node scripts/migrate-to-r2.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3')
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Configuration Cloudflare R2
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'linguami'

// Client S3 pour R2 (R2 est compatible avec l'API S3)
const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
})

// Statistiques de migration
const stats = {
	total: 0,
	success: 0,
	failed: 0,
	skipped: 0,
	errors: [],
}

/**
 * Télécharge un fichier depuis une URL
 */
async function downloadFile(url) {
	return new Promise((resolve, reject) => {
		const protocol = url.startsWith('https') ? https : http

		protocol.get(url, (response) => {
			if (response.statusCode !== 200) {
				reject(new Error(`Failed to download: ${response.statusCode}`))
				return
			}

			const chunks = []
			response.on('data', (chunk) => chunks.push(chunk))
			response.on('end', () => resolve(Buffer.concat(chunks)))
			response.on('error', reject)
		}).on('error', reject)
	})
}

/**
 * Détermine le Content-Type basé sur l'extension du fichier
 */
function getContentType(filename) {
	const ext = path.extname(filename).toLowerCase()
	const contentTypes = {
		'.jpg': 'image/jpeg',
		'.jpeg': 'image/jpeg',
		'.png': 'image/png',
		'.gif': 'image/gif',
		'.webp': 'image/webp',
		'.svg': 'image/svg+xml',
		'.mp3': 'audio/mpeg',
		'.m4a': 'audio/mp4',
		'.wav': 'audio/wav',
		'.mp4': 'video/mp4',
		'.webm': 'video/webm',
		'.pdf': 'application/pdf',
	}
	return contentTypes[ext] || 'application/octet-stream'
}

/**
 * Upload un fichier vers R2
 */
async function uploadToR2(buffer, key, contentType) {
	const command = new PutObjectCommand({
		Bucket: R2_BUCKET_NAME,
		Key: key,
		Body: buffer,
		ContentType: contentType,
		CacheControl: 'public, max-age=31536000, immutable',
	})

	await r2Client.send(command)
}

/**
 * Liste tous les fichiers dans le bucket Supabase
 */
async function listSupabaseFiles(bucketName = 'linguami', folder = '') {
	const { data, error } = await supabase.storage
		.from(bucketName)
		.list(folder, {
			limit: 1000,
			sortBy: { column: 'name', order: 'asc' },
		})

	if (error) {
		console.error(`❌ Erreur lors du listing de ${folder}:`, error)
		return []
	}

	return data || []
}

/**
 * Migre récursivement tous les fichiers d'un dossier
 */
async function migrateFolder(bucketName, folderPath = '') {
	console.log(`\n📁 Exploration du dossier: ${folderPath || '(root)'}`)

	const files = await listSupabaseFiles(bucketName, folderPath)

	for (const file of files) {
		const fullPath = folderPath ? `${folderPath}/${file.name}` : file.name

		// Si c'est un dossier, explorer récursivement
		if (!file.id) {
			await migrateFolder(bucketName, fullPath)
			continue
		}

		stats.total++

		try {
			// Obtenir l'URL publique du fichier
			const { data: { publicUrl } } = supabase.storage
				.from(bucketName)
				.getPublicUrl(fullPath)

			console.log(`📥 Téléchargement: ${fullPath}`)

			// Télécharger le fichier
			const buffer = await downloadFile(publicUrl)

			// Déterminer le Content-Type
			const contentType = getContentType(file.name)

			console.log(`📤 Upload vers R2: ${fullPath}`)

			// Upload vers R2 avec le même chemin
			await uploadToR2(buffer, fullPath, contentType)

			stats.success++
			console.log(`✅ Migré avec succès: ${fullPath}`)

		} catch (error) {
			stats.failed++
			const errorMsg = `Erreur pour ${fullPath}: ${error.message}`
			console.error(`❌ ${errorMsg}`)
			stats.errors.push(errorMsg)
		}
	}
}

/**
 * Fonction principale
 */
async function main() {
	console.log('🚀 Début de la migration Supabase Storage → Cloudflare R2\n')
	console.log(`📦 Bucket source: linguami (Supabase)`)
	console.log(`📦 Bucket destination: ${R2_BUCKET_NAME} (R2)`)
	console.log('=' .repeat(60))

	// Vérifier la configuration
	if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
		console.error('❌ Variables d\'environnement R2 manquantes!')
		console.log('\nAjoutez ces variables dans votre .env.local :')
		console.log('R2_ACCOUNT_ID=your_account_id')
		console.log('R2_ACCESS_KEY_ID=your_access_key')
		console.log('R2_SECRET_ACCESS_KEY=your_secret_key')
		console.log('R2_BUCKET_NAME=linguami')
		process.exit(1)
	}

	const startTime = Date.now()

	try {
		// Migrer tous les fichiers du bucket
		await migrateFolder('linguami')

		const duration = ((Date.now() - startTime) / 1000).toFixed(2)

		console.log('\n' + '='.repeat(60))
		console.log('📊 RAPPORT DE MIGRATION')
		console.log('='.repeat(60))
		console.log(`✅ Fichiers migrés avec succès: ${stats.success}`)
		console.log(`❌ Fichiers échoués: ${stats.failed}`)
		console.log(`⏭️  Fichiers ignorés: ${stats.skipped}`)
		console.log(`📁 Total de fichiers traités: ${stats.total}`)
		console.log(`⏱️  Durée totale: ${duration}s`)

		if (stats.errors.length > 0) {
			console.log('\n❌ ERREURS:')
			stats.errors.forEach(err => console.log(`  - ${err}`))
		}

		// Sauvegarder le rapport
		const reportPath = path.join(__dirname, 'migration-report.json')
		fs.writeFileSync(reportPath, JSON.stringify({
			timestamp: new Date().toISOString(),
			duration: `${duration}s`,
			stats,
		}, null, 2))

		console.log(`\n💾 Rapport sauvegardé: ${reportPath}`)

		if (stats.failed === 0) {
			console.log('\n🎉 Migration terminée avec succès!')
			console.log('\n📝 Prochaines étapes:')
			console.log('1. Vérifier que tous les fichiers sont sur R2')
			console.log('2. Configurer le domaine personnalisé R2 (optionnel)')
			console.log('3. Mettre à jour NEXT_PUBLIC_SUPABASE_IMAGE dans .env.local')
			console.log('4. Tester l\'application avec les nouvelles URLs')
			console.log('5. Supprimer les fichiers de Supabase Storage (après vérification)')
		} else {
			console.log('\n⚠️  Migration terminée avec des erreurs')
			console.log('Vérifiez le rapport et réessayez pour les fichiers échoués')
		}

	} catch (error) {
		console.error('\n❌ Erreur fatale:', error)
		process.exit(1)
	}
}

// Lancer la migration
main().catch(console.error)
