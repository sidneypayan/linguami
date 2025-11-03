/**
 * Script d'optimisation ET remplacement des images Supabase
 *
 * ⚠️ ATTENTION : Ce script REMPLACE les images originales par des versions optimisées
 * pour économiser de l'espace de stockage. Les images originales seront PERDUES.
 *
 * Ce qui est créé :
 * - 1 version optimisée qui remplace l'original (medium 800x800)
 * - 1 thumbnail pour les miniatures (200x200)
 *
 * Économie d'espace : ~70-85%
 *
 * Usage: node scripts/optimize-and-replace-images.js
 */

const { createClient } = require('@supabase/supabase-js')
const sharp = require('sharp')
const fs = require('fs').promises
const path = require('path')
const readline = require('readline')

// Charger les variables d'environnement depuis .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

// Configuration
const CONFIG = {
	// Taille principale (remplacera l'original)
	mainSize: { width: 800, height: 800 },
	// Taille thumbnail (pour les miniatures)
	thumbnailSize: { width: 200, height: 200 },
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
 * Demande confirmation à l'utilisateur
 */
async function askConfirmation() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})

	return new Promise((resolve) => {
		console.log('\n⚠️  ATTENTION ! OPÉRATION IRRÉVERSIBLE !')
		console.log('=' .repeat(60))
		console.log('Ce script va :')
		console.log('1. Télécharger vos images originales')
		console.log('2. Les optimiser et les convertir en WebP')
		console.log('3. SUPPRIMER les images originales')
		console.log('4. Les remplacer par les versions optimisées')
		console.log('')
		console.log('⚠️  Vous PERDREZ les images originales haute résolution !')
		console.log('=' .repeat(60))
		console.log('\nAssurez-vous d\'avoir une SAUVEGARDE avant de continuer.\n')

		rl.question('Voulez-vous continuer ? Tapez "OUI" en majuscules pour confirmer : ', (answer) => {
			rl.close()
			resolve(answer === 'OUI')
		})
	})
}

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

	// Filtrer seulement les images (exclure les dossiers comme thumbnails/)
	const images = data.filter(file => {
		const ext = path.extname(file.name).toLowerCase()
		return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && file.name
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
 * Optimise une image pour 2 tailles : principale et thumbnail
 */
async function optimizeImage(imageBuffer, originalName) {
	const baseName = path.parse(originalName).name
	const results = {}

	console.log(`\n🔄 Optimisation de ${originalName}...`)

	// Version principale (remplacera l'original)
	try {
		const mainFileName = `${baseName}.webp`
		const mainPath = path.join(CONFIG.tempDir, mainFileName)

		await fs.mkdir(path.dirname(mainPath), { recursive: true })

		await sharp(imageBuffer)
			.resize(CONFIG.mainSize.width, CONFIG.mainSize.height, {
				fit: 'cover',
				position: 'center',
			})
			.webp({ quality: CONFIG.webpQuality })
			.toFile(mainPath)

		const mainStats = await fs.stat(mainPath)
		results.main = {
			path: mainPath,
			size: mainStats.size,
			fileName: mainFileName,
		}

		console.log(`  ✅ Principal (${CONFIG.mainSize.width}x${CONFIG.mainSize.height}): ${(mainStats.size / 1024).toFixed(2)} KB`)
	} catch (error) {
		console.error(`  ❌ Erreur version principale:`, error.message)
		throw error
	}

	// Version thumbnail
	try {
		const thumbFileName = `${baseName}.webp`
		const thumbPath = path.join(CONFIG.tempDir, 'thumbnails', thumbFileName)

		await fs.mkdir(path.dirname(thumbPath), { recursive: true })

		await sharp(imageBuffer)
			.resize(CONFIG.thumbnailSize.width, CONFIG.thumbnailSize.height, {
				fit: 'cover',
				position: 'center',
			})
			.webp({ quality: CONFIG.webpQuality })
			.toFile(thumbPath)

		const thumbStats = await fs.stat(thumbPath)
		results.thumbnail = {
			path: thumbPath,
			size: thumbStats.size,
			fileName: thumbFileName,
		}

		console.log(`  ✅ Thumbnail (${CONFIG.thumbnailSize.width}x${CONFIG.thumbnailSize.height}): ${(thumbStats.size / 1024).toFixed(2)} KB`)
	} catch (error) {
		console.error(`  ❌ Erreur thumbnail:`, error.message)
	}

	return results
}

/**
 * Supprime une image de Supabase
 */
async function deleteImage(imagePath) {
	const { error } = await supabase.storage
		.from(CONFIG.bucketName)
		.remove([imagePath])

	if (error) {
		throw new Error(`Erreur suppression ${imagePath}: ${error.message}`)
	}
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
			upsert: true,
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

				// Supprimer l'original
				await deleteImage(imagePath)
				console.log(`  🗑️  Original supprimé`)

				// Upload version principale (remplace l'original)
				const mainDestPath = `${CONFIG.imagePrefix}${optimized.main.fileName}`
				await uploadOptimizedImage(optimized.main.path, mainDestPath)
				stats.optimizedSize += optimized.main.size
				console.log(`  📤 Uploadé principal: ${mainDestPath}`)

				// Upload thumbnail si disponible
				if (optimized.thumbnail) {
					const thumbDestPath = `${CONFIG.imagePrefix}thumbnails/${optimized.thumbnail.fileName}`
					await uploadOptimizedImage(optimized.thumbnail.path, thumbDestPath)
					stats.optimizedSize += optimized.thumbnail.size
					console.log(`  📤 Uploadé thumbnail: ${thumbDestPath}`)
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
			console.log(`💾 Espace libéré: ${((stats.originalSize - stats.optimizedSize) / 1024 / 1024).toFixed(2)} MB`)
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
	console.log('🎨 Script d\'optimisation ET remplacement d\'images')
	console.log('='.repeat(60))

	// Vérifier les variables d'environnement
	if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
		console.error('❌ Variables d\'environnement manquantes!')
		console.error('Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies')
		process.exit(1)
	}

	// Demander confirmation
	const confirmed = await askConfirmation()

	if (!confirmed) {
		console.log('\n❌ Opération annulée par l\'utilisateur.')
		process.exit(0)
	}

	console.log('\n✅ Confirmation reçue. Démarrage de l\'optimisation...')

	try {
		await processAllImages()
		console.log('\n✨ Optimisation terminée avec succès!')
		console.log('⚠️  N\'oubliez pas de mettre à jour votre code pour utiliser les chemins .webp')
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
