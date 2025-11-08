/**
 * Script pour supprimer les doublons d'images UI dans image/materials/
 *
 * Supprime les fichiers qui devraient être dans image/ui/ mais qui sont aussi dans image/materials/
 *
 * Usage :
 * node scripts/cleanup-materials-duplicates.js
 */

require('dotenv').config({ path: '.env.local' })
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3')

// Configuration Cloudflare R2
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'linguami'

// Client S3 pour R2
const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
})

// Liste des fichiers UI à supprimer de image/materials/
const UI_FILES_TO_REMOVE = [
	'404.webp',
	'dwarf_female.webp',
	'dwarf_male.webp',
	'elf_female.webp',
	'elf_male.webp',
	'facebook.webp',
	'gnome_female.webp',
	'gnome_male.webp',
	'google.webp',
	'hero.webp',
	'human_female.webp',
	'human_male.webp',
	'orc_female.webp',
	'orc_male.webp',
	'tauren_female.webp',
	'tauren_male.webp',
	'undead_female.webp',
	'undead_male.webp',
	'wizard_female.webp',
	'wizard_male.webp',
	'xp_1.webp',
	'xp_2.webp',
	'xp_3.webp',
	'xp_4.webp',
	'xp_5.webp',
	'xp_6.webp',
	'xp_7.webp',
]

// Statistiques
const stats = {
	total: 0,
	deleted: 0,
	errors: 0,
}

/**
 * Supprime un objet dans R2
 */
async function deleteObject(key) {
	try {
		const command = new DeleteObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: key,
		})
		await r2Client.send(command)
		console.log(`✓ Supprimé: ${key}`)
		return true
	} catch (error) {
		console.error(`✗ Erreur lors de la suppression de ${key}:`, error.message)
		return false
	}
}

/**
 * Fonction principale
 */
async function main() {
	console.log('🚀 Nettoyage des doublons UI dans image/materials/...\n')

	// Vérification de la configuration
	if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
		console.error('❌ Variables d\'environnement R2 manquantes dans .env.local')
		process.exit(1)
	}

	console.log(`📋 ${UI_FILES_TO_REMOVE.length} fichiers UI à supprimer de image/materials/:\n`)
	UI_FILES_TO_REMOVE.forEach(file => console.log(`  - ${file}`))

	// Confirmation
	console.log(`\n⚠️  Ces fichiers existent déjà dans image/ui/`)
	console.log('Appuyez sur Ctrl+C pour annuler, ou attendez 5 secondes pour continuer...\n')

	// Attendre 5 secondes
	await new Promise(resolve => setTimeout(resolve, 5000))

	console.log('🔄 Suppression en cours...\n')

	for (const filename of UI_FILES_TO_REMOVE) {
		const key = `image/materials/${filename}`
		stats.total++

		const success = await deleteObject(key)

		if (success) {
			stats.deleted++
		} else {
			stats.errors++
		}
	}

	// Afficher le résumé
	console.log('\n' + '='.repeat(60))
	console.log('📊 RÉSUMÉ DU NETTOYAGE')
	console.log('='.repeat(60))
	console.log(`Total de fichiers traités : ${stats.total}`)
	console.log(`✓ Supprimés avec succès  : ${stats.deleted}`)
	console.log(`✗ Erreurs                : ${stats.errors}`)
	console.log('='.repeat(60))

	console.log('\n✨ Nettoyage terminé!\n')
}

// Exécution
main()
