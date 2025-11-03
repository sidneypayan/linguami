/**
 * Script d'optimisation des images Supabase
 *
 * Ce script télécharge les images depuis Supabase Storage,
 * les optimise (redimensionnement + conversion WebP),
 * et les réupload dans des dossiers organisés.
 *
 * Usage: node scripts/optimize-images.js
 */

const { createClient } = require('@supabase/supabase-js')
const sharp = require('sharp')
const fs = require('fs').promises
const path = require('path')

// Charger les variables d'environnement depuis .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

// Configuration
const CONFIG = {
	// Tailles d'images à générer
	sizes: {
		thumbnail: { width: 200, height: 200, folder: 'thumbnails' },
		small: { width: 400, height: 400, folder: 'small' },
		medium: { width: 800, height: 800, folder: 'medium' },
		large: { width: 1200, height: 1200, folder: 'large' },
	},
	// Qualité WebP (0-100)
	webpQuality: 85,
	// Dossier temporaire pour le traitement
	tempDir: path.join(__dirname, '../.temp-images'),
	// Bucket Supabase
	bucketName: 'linguami',
	// Préfixe du chemin des images
	imagePrefix: 'image/',
}

// Initialiser le client Supabase
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * Crée le dossier temporaire s'il n'existe pas
 */
async function ensureTempDir() {
	try {
		await fs.mkdir(CONFIG.tempDir, { recursive: true })
		console.log('✅ Dossier temporaire créé:', CONFIG.tempDir)
	} catch (error) {
		console.error('❌ Erreur création dossier temporaire:', error.message)
		throw error
	}
}

/**
 * Nettoie le dossier temporaire
 */
async function cleanTempDir() {
	try {
		await fs.rm(CONFIG.tempDir, { recursive: true, force: true })
		console.log('✅ Dossier temporaire nettoyé')
	} catch (error) {
		console.warn('⚠️  Erreur nettoyage dossier temporaire:', error.message)
	}
}

/**
 * Liste tous les fichiers images dans le bucket
 */
async function listImages() {
	console.log('\n📋 Récupération de la liste des images...')

	const { data, error } = await supabase.storage
		.from(CONFIG.bucketName)
		.list(CONFIG.imagePrefix, {
			limit: 1000,
			sortBy: { column: 'name', order: 'asc' },
		})

	if (error) {
		throw new Error(`Erreur listing images: ${error.message}`)
	}

	// Filtrer seulement les images
	const images = data.filter(file => {
		const ext = path.extname(file.name).toLowerCase()
		return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
	})

	console.log(`✅ ${images.length} images trouvées`)
	return images
}

/**
 * Télécharge une image depuis Supabase
 */
async function downloadImage(imagePath) {
	const { data, error } = await supabase.storage
		.from(CONFIG.bucketName)
		.download(imagePath)

	if (error) {
		throw new Error(`Erreur téléchargement ${imagePath}: ${error.message}`)
	}

	return Buffer.from(await data.arrayBuffer())
}

/**
 * Optimise une image et génère plusieurs tailles
 */
async function optimizeImage(imageBuffer, originalName) {
	const baseName = path.parse(originalName).name
	const results = {}

	console.log(`\n🔄 Optimisation de ${originalName}...`)

	for (const [sizeName, config] of Object.entries(CONFIG.sizes)) {
		try {
			const outputFileName = `${baseName}.webp`
			const outputPath = path.join(CONFIG.tempDir, sizeName, outputFileName)

			// Créer le dossier de sortie
			await fs.mkdir(path.dirname(outputPath), { recursive: true })

			// Traiter l'image
			await sharp(imageBuffer)
				.resize(config.width, config.height, {
					fit: 'cover',
					position: 'center',
				})
				.webp({ quality: CONFIG.webpQuality })
				.toFile(outputPath)

			const stats = await fs.stat(outputPath)
			results[sizeName] = {
				path: outputPath,
				size: stats.size,
				fileName: outputFileName,
				folder: config.folder,
			}

			console.log(`  ✅ ${sizeName}: ${(stats.size / 1024).toFixed(2)} KB`)
		} catch (error) {
			console.error(`  ❌ Erreur ${sizeName}:`, error.message)
		}
	}

	return results
}

/**
 * Upload une image optimisée vers Supabase
 */
async function uploadOptimizedImage(filePath, destinationPath) {
	const fileBuffer = await fs.readFile(filePath)

	const { data, error } = await supabase.storage
		.from(CONFIG.bucketName)
		.upload(destinationPath, fileBuffer, {
			contentType: 'image/webp',
			upsert: true, // Écraser si existe déjà
		})

	if (error) {
		throw new Error(`Erreur upload ${destinationPath}: ${error.message}`)
	}

	return data
}

/**
 * Traite toutes les images
 */
async function processAllImages() {
	try {
		// Préparation
		await ensureTempDir()
		const images = await listImages()

		if (images.length === 0) {
			console.log('\n⚠️  Aucune image à traiter')
			return
		}

		console.log(`\n🚀 Début du traitement de ${images.length} images...\n`)

		let processedCount = 0
		let errorCount = 0
		const stats = {
			originalSize: 0,
			optimizedSize: 0,
		}

		// Traiter chaque image
		for (const image of images) {
			const imagePath = `${CONFIG.imagePrefix}${image.name}`

			try {
				console.log(`\n[${processedCount + 1}/${images.length}] Traitement de ${image.name}`)

				// Télécharger l'image originale
				const imageBuffer = await downloadImage(imagePath)
				stats.originalSize += imageBuffer.length
				console.log(`  📥 Téléchargé: ${(imageBuffer.length / 1024).toFixed(2)} KB`)

				// Optimiser l'image
				const optimized = await optimizeImage(imageBuffer, image.name)

				// Upload des versions optimisées
				for (const [sizeName, result] of Object.entries(optimized)) {
					const destinationPath = `${CONFIG.imagePrefix}${result.folder}/${result.fileName}`
					await uploadOptimizedImage(result.path, destinationPath)
					stats.optimizedSize += result.size
					console.log(`  📤 Uploadé: ${destinationPath}`)
				}

				processedCount++
			} catch (error) {
				console.error(`❌ Erreur traitement ${image.name}:`, error.message)
				errorCount++
			}
		}

		// Résumé
		console.log('\n' + '='.repeat(60))
		console.log('📊 RÉSUMÉ')
		console.log('='.repeat(60))
		console.log(`✅ Images traitées: ${processedCount}`)
		console.log(`❌ Erreurs: ${errorCount}`)
		console.log(`📦 Taille originale totale: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`)
		console.log(`📦 Taille optimisée totale: ${(stats.optimizedSize / 1024 / 1024).toFixed(2)} MB`)

		if (stats.originalSize > 0) {
			const savings = ((1 - stats.optimizedSize / stats.originalSize) * 100).toFixed(1)
			console.log(`💾 Économie d'espace: ${savings}%`)
		}
		console.log('='.repeat(60))

	} catch (error) {
		console.error('\n❌ Erreur fatale:', error.message)
		throw error
	} finally {
		// Nettoyage
		await cleanTempDir()
	}
}

/**
 * Point d'entrée principal
 */
async function main() {
	console.log('🎨 Script d\'optimisation d\'images Supabase')
	console.log('='.repeat(60))

	// Vérifier les variables d'environnement
	if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
		console.error('❌ Variables d\'environnement manquantes!')
		console.error('Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies')
		process.exit(1)
	}

	try {
		await processAllImages()
		console.log('\n✨ Optimisation terminée avec succès!')
		process.exit(0)
	} catch (error) {
		console.error('\n💥 Échec de l\'optimisation:', error)
		process.exit(1)
	}
}

// Exécuter le script
if (require.main === module) {
	main()
}

module.exports = { processAllImages }
