/**
 * Script de vérification de la migration R2
 *
 * Ce script compare les fichiers entre Supabase et R2 pour s'assurer
 * que tous les fichiers ont été correctement migrés.
 *
 * Usage:
 * node scripts/verify-r2-migration.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { S3Client, ListObjectsV2Command, HeadObjectCommand } = require('@aws-sdk/client-s3')

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

const results = {
	supabaseFiles: [],
	r2Files: [],
	missing: [],
	extra: [],
	sizeMismatch: [],
}

/**
 * Liste tous les fichiers Supabase récursivement
 */
async function listSupabaseFiles(bucketName = 'linguami', folder = '', allFiles = []) {
	const { data, error } = await supabase.storage
		.from(bucketName)
		.list(folder, {
			limit: 1000,
			sortBy: { column: 'name', order: 'asc' },
		})

	if (error) {
		console.error(`❌ Erreur lors du listing de ${folder}:`, error)
		return allFiles
	}

	for (const file of data || []) {
		const fullPath = folder ? `${folder}/${file.name}` : file.name

		if (!file.id) {
			// C'est un dossier, explorer récursivement
			await listSupabaseFiles(bucketName, fullPath, allFiles)
		} else {
			// C'est un fichier
			allFiles.push({
				path: fullPath,
				size: file.metadata?.size || 0,
			})
		}
	}

	return allFiles
}

/**
 * Liste tous les fichiers R2
 */
async function listR2Files() {
	const files = []
	let continuationToken = null

	do {
		const command = new ListObjectsV2Command({
			Bucket: R2_BUCKET_NAME,
			ContinuationToken: continuationToken,
		})

		const response = await r2Client.send(command)

		if (response.Contents) {
			for (const object of response.Contents) {
				files.push({
					path: object.Key,
					size: object.Size,
				})
			}
		}

		continuationToken = response.NextContinuationToken
	} while (continuationToken)

	return files
}

/**
 * Vérifie qu'un fichier existe dans R2
 */
async function checkR2FileExists(key) {
	try {
		const command = new HeadObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: key,
		})
		await r2Client.send(command)
		return true
	} catch (error) {
		return false
	}
}

/**
 * Fonction principale
 */
async function main() {
	console.log('🔍 Vérification de la migration Supabase → R2\n')
	console.log('=' .repeat(60))

	try {
		// Liste les fichiers Supabase
		console.log('📥 Listing des fichiers Supabase...')
		results.supabaseFiles = await listSupabaseFiles()
		console.log(`   ✅ ${results.supabaseFiles.length} fichiers trouvés`)

		// Liste les fichiers R2
		console.log('📥 Listing des fichiers R2...')
		results.r2Files = await listR2Files()
		console.log(`   ✅ ${results.r2Files.length} fichiers trouvés`)

		// Créer des maps pour comparaison rapide
		const supabaseMap = new Map(results.supabaseFiles.map(f => [f.path, f]))
		const r2Map = new Map(results.r2Files.map(f => [f.path, f]))

		// Vérifier les fichiers manquants dans R2
		console.log('\n🔎 Vérification des fichiers manquants...')
		for (const [path, file] of supabaseMap) {
			if (!r2Map.has(path)) {
				results.missing.push(path)
			} else {
				// Vérifier la taille (optionnel)
				const r2File = r2Map.get(path)
				if (file.size > 0 && r2File.size !== file.size) {
					results.sizeMismatch.push({
						path,
						supabaseSize: file.size,
						r2Size: r2File.size,
					})
				}
			}
		}

		// Vérifier les fichiers en trop dans R2
		console.log('🔎 Vérification des fichiers supplémentaires...')
		for (const [path] of r2Map) {
			if (!supabaseMap.has(path)) {
				results.extra.push(path)
			}
		}

		// Afficher le rapport
		console.log('\n' + '='.repeat(60))
		console.log('📊 RAPPORT DE VÉRIFICATION')
		console.log('='.repeat(60))
		console.log(`📁 Fichiers dans Supabase: ${results.supabaseFiles.length}`)
		console.log(`📁 Fichiers dans R2: ${results.r2Files.length}`)

		if (results.missing.length === 0 && results.sizeMismatch.length === 0) {
			console.log('\n✅ PARFAIT! Tous les fichiers ont été migrés correctement!')
		} else {
			console.log(`\n⚠️  Fichiers manquants dans R2: ${results.missing.length}`)
			if (results.missing.length > 0) {
				console.log('\nFichiers manquants:')
				results.missing.forEach(path => console.log(`  ❌ ${path}`))
			}

			if (results.sizeMismatch.length > 0) {
				console.log(`\n⚠️  Fichiers avec différence de taille: ${results.sizeMismatch.length}`)
				results.sizeMismatch.forEach(({ path, supabaseSize, r2Size }) => {
					console.log(`  ⚠️  ${path}: Supabase=${supabaseSize}B, R2=${r2Size}B`)
				})
			}
		}

		if (results.extra.length > 0) {
			console.log(`\nℹ️  Fichiers supplémentaires dans R2: ${results.extra.length}`)
			console.log('(Ces fichiers sont dans R2 mais pas dans Supabase)')
		}

		// Sauvegarder le rapport
		const fs = require('fs')
		const path = require('path')
		const reportPath = path.join(__dirname, 'verification-report.json')
		fs.writeFileSync(reportPath, JSON.stringify({
			timestamp: new Date().toISOString(),
			summary: {
				supabaseFiles: results.supabaseFiles.length,
				r2Files: results.r2Files.length,
				missing: results.missing.length,
				extra: results.extra.length,
				sizeMismatch: results.sizeMismatch.length,
			},
			details: results,
		}, null, 2))

		console.log(`\n💾 Rapport détaillé sauvegardé: ${reportPath}`)

		if (results.missing.length > 0) {
			console.log('\n⚠️  Action recommandée: Relancez la migration pour les fichiers manquants')
			process.exit(1)
		}

	} catch (error) {
		console.error('\n❌ Erreur:', error)
		process.exit(1)
	}
}

main().catch(console.error)
