/**
 * Script d'optimisation d'une seule image
 *
 * Usage: node scripts/optimize-single-image.js <nom-fichier.jpg>
 * Exemple: node scripts/optimize-single-image.js dialogues.jpg
 */

const { createClient } = require('@supabase/supabase-js')
const sharp = require('sharp')
const fs = require('fs').promises
const path = require('path')

// Charger les variables d'environnement depuis .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

// Configuration (identique au script principal)
const CONFIG = {
	sizes: {
		thumbnail: { width: 200, height: 200, folder: 'thumbnails' },
		small: { width: 400, height: 400, folder: 'small' },
		medium: { width: 800, height: 800, folder: 'medium' },
		large: { width: 1200, height: 1200, folder: 'large' },
	},
	webpQuality: 85,
	tempDir: path.join(__dirname, '../.temp-images'),
	bucketName: 'linguami',
	imagePrefix: 'image/',
}

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function optimizeSingleImage(imageName) {
	const imagePath = `${CONFIG.imagePrefix}${imageName}`

	console.log(`\n🎨 Optimisation de ${imageName}...`)

	try {
		// Créer le dossier temporaire
		await fs.mkdir(CONFIG.tempDir, { recursive: true })

		// Télécharger l'image
		console.log('📥 Téléchargement...')
		const { data, error } = await supabase.storage
			.from(CONFIG.bucketName)
			.download(imagePath)

		if (error) throw error

		const imageBuffer = Buffer.from(await data.arrayBuffer())
		console.log(`  ✅ Téléchargé: ${(imageBuffer.length / 1024).toFixed(2)} KB`)

		// Optimiser pour chaque taille
		const baseName = path.parse(imageName).name

		for (const [sizeName, config] of Object.entries(CONFIG.sizes)) {
			console.log(`\n🔄 Génération ${sizeName}...`)

			const outputFileName = `${baseName}.webp`
			const outputPath = path.join(CONFIG.tempDir, outputFileName)

			// Traiter l'image
			await sharp(imageBuffer)
				.resize(config.width, config.height, {
					fit: 'cover',
					position: 'center',
				})
				.webp({ quality: CONFIG.webpQuality })
				.toFile(outputPath)

			const stats = await fs.stat(outputPath)
			console.log(`  ✅ Créé: ${(stats.size / 1024).toFixed(2)} KB`)

			// Upload vers Supabase
			const fileBuffer = await fs.readFile(outputPath)
			const destinationPath = `${CONFIG.imagePrefix}${config.folder}/${outputFileName}`

			const { error: uploadError } = await supabase.storage
				.from(CONFIG.bucketName)
				.upload(destinationPath, fileBuffer, {
					contentType: 'image/webp',
					upsert: true,
				})

			if (uploadError) throw uploadError

			console.log(`  📤 Uploadé vers: ${destinationPath}`)
		}

		// Nettoyage
		await fs.rm(CONFIG.tempDir, { recursive: true, force: true })

		console.log('\n✨ Optimisation terminée avec succès!')
	} catch (error) {
		console.error('\n❌ Erreur:', error.message)
		process.exit(1)
	}
}

// Point d'entrée
const imageName = process.argv[2]

if (!imageName) {
	console.error('❌ Usage: node scripts/optimize-single-image.js <nom-fichier>')
	console.error('   Exemple: node scripts/optimize-single-image.js dialogues.jpg')
	process.exit(1)
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
	console.error('❌ Variables d\'environnement manquantes!')
	process.exit(1)
}

optimizeSingleImage(imageName)
