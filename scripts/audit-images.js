/**
 * Script d'audit des images dans le bucket R2 (VERSION OPTIMISÉE)
 *
 * Ce script analyse toutes les images du bucket et détermine :
 * - Quelles images sont utilisées (et où)
 * - Quelles images sont potentiellement obsolètes
 *
 * Approche optimisée :
 * 1. Liste toutes les images du bucket
 * 2. Scan du code UNE SEULE FOIS pour extraire toutes les références
 * 3. Vérification dans la DB
 * 4. Comparaison et rapport
 *
 * Usage :
 * node scripts/audit-images.js
 */

require('dotenv').config({ path: '.env.local' })
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3')
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Configuration R2
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

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Résultats de l'audit
const audit = {
	totalImages: 0,
	usedImages: [],
	unusedImages: [],
	imageReferences: {}, // Map: filename -> [references]
	errors: [],
}

/**
 * Liste toutes les images dans le bucket R2
 */
async function listAllImages() {
	console.log('📋 Liste des images dans le bucket R2...')

	const images = []
	let continuationToken = null

	do {
		const command = new ListObjectsV2Command({
			Bucket: R2_BUCKET_NAME,
			Prefix: 'image/',
			ContinuationToken: continuationToken,
		})

		const response = await r2Client.send(command)

		if (response.Contents) {
			// Filtrer pour ne garder que les fichiers images
			const files = response.Contents.filter(obj => {
				const key = obj.Key
				if (key.endsWith('/')) return false
				return /\.(webp|png|jpg|jpeg|gif|svg)$/i.test(key)
			})
			images.push(...files.map(obj => obj.Key))
		}

		continuationToken = response.NextContinuationToken
	} while (continuationToken)

	console.log(`   ✓ ${images.length} images trouvées\n`)
	return images
}

/**
 * Scan du code pour extraire toutes les références d'images
 */
function scanCodebase() {
	console.log('🔍 Scan du codebase pour extraire les références d\'images...')

	const imageReferences = new Map()

	// Patterns à chercher
	const patterns = [
		'**/*.js',
		'**/*.jsx',
		'**/*.ts',
		'**/*.tsx',
		'**/*.json',
		'**/*.md',
	]

	// Fichiers/dossiers à ignorer
	const ignore = [
		'**/node_modules/**',
		'**/.next/**',
		'**/.git/**',
		'**/dist/**',
		'**/build/**',
		'**/scripts/audit-images.js',
		'**/image-audit-report.*',
		'**/migration-log.json',
		'**/migration-plan.json',
		'**/*-log.json',
		'**/*-report.json',
		'**/package-lock.json',
	]

	let filesScanned = 0

	for (const pattern of patterns) {
		const files = glob.sync(pattern, { ignore, nodir: true })

		for (const file of files) {
			try {
				const content = fs.readFileSync(file, 'utf-8')

				// 1. Regex pour trouver les noms de fichiers d'images littéraux
				// Cherche : nom_fichier.webp (ou .png, .jpg, etc.)
				const regex = /([a-z0-9_\-\.]+\.(webp|png|jpg|jpeg|gif|svg))/gi
				let match

				while ((match = regex.exec(content)) !== null) {
					const filename = match[1].toLowerCase()

					if (!imageReferences.has(filename)) {
						imageReferences.set(filename, [])
					}

					// Éviter les doublons pour le même fichier
					const refs = imageReferences.get(filename)
					if (!refs.includes(file)) {
						refs.push(file)
					}
				}

				// 2. Détecter les template literals qui construisent des noms de fichiers dynamiquement
				// Pattern: `quelquechose${variable}autrechose.webp`
				const templateLiteralRegex = /`[^`]*\$\{[^}]+\}[^`]*\.(webp|png|jpg|jpeg|gif|svg)`/gi
				let templateMatch

				while ((templateMatch = templateLiteralRegex.exec(content)) !== null) {
					const templateString = templateMatch[0]

					// Cas spécial: badges reviewed_words (0${index + 1}_reviewed_words_badge.webp)
					if (templateString.includes('reviewed_words_badge')) {
						// Générer les 7 badges (01 à 07)
						for (let i = 1; i <= 7; i++) {
							const filename = `0${i}_reviewed_words_badge.webp`
							if (!imageReferences.has(filename)) {
								imageReferences.set(filename, [])
							}
							const refs = imageReferences.get(filename)
							if (!refs.includes(file)) {
								refs.push(file)
							}
						}
					}

					// Cas spécial: badges XP (xp_${index + 1}.webp)
					if (templateString.includes('xp_') && templateString.includes('.webp')) {
						// Générer les 7 badges XP
						for (let i = 1; i <= 7; i++) {
							const filename = `xp_${i}.webp`
							if (!imageReferences.has(filename)) {
								imageReferences.set(filename, [])
							}
							const refs = imageReferences.get(filename)
							if (!refs.includes(file)) {
								refs.push(file)
							}
						}
					}
				}

				filesScanned++
			} catch (error) {
				// Ignorer les erreurs de lecture de fichiers
			}
		}
	}

	console.log(`   ✓ ${filesScanned} fichiers scannés`)
	console.log(`   ✓ ${imageReferences.size} images référencées trouvées\n`)

	return imageReferences
}

/**
 * Cherche dans la base de données
 */
async function scanDatabase() {
	console.log('🗄️  Scan de la base de données...')

	const dbReferences = new Map()

	try {
		// Chercher dans la table materials
		const { data: materials, error: materialsError } = await supabase
			.from('materials')
			.select('id, title, image')
			.not('image', 'is', null)

		if (materialsError) throw materialsError

		if (materials) {
			materials.forEach(m => {
				if (m.image) {
					const filename = path.basename(m.image).toLowerCase()
					if (!dbReferences.has(filename)) {
						dbReferences.set(filename, [])
					}
					dbReferences
						.get(filename)
						.push(`DB: materials (id: ${m.id}, title: ${m.title})`)
				}
			})
		}

		// Chercher dans la table books
		try {
			const { data: books, error: booksError } = await supabase
				.from('books')
				.select('id, title, image')
				.not('image', 'is', null)

			if (!booksError && books) {
				books.forEach(book => {
					if (book.image) {
						const filename = path.basename(book.image).toLowerCase()
						if (!dbReferences.has(filename)) {
							dbReferences.set(filename, [])
						}
						dbReferences
							.get(filename)
							.push(`DB: books (id: ${book.id}, title: ${book.title})`)
					}
				})
			}
		} catch (error) {
			// Table books n'existe peut-être pas
		}

		// Chercher dans la table posts
		try {
			const { data: posts, error: postsError } = await supabase
				.from('posts')
				.select('id, title, img')
				.not('img', 'is', null)

			if (!postsError && posts) {
				posts.forEach(p => {
					if (p.img) {
						const filename = path.basename(p.img).toLowerCase()
						if (!dbReferences.has(filename)) {
							dbReferences.set(filename, [])
						}
						dbReferences
							.get(filename)
							.push(`DB: posts (id: ${p.id}, title: ${p.title})`)
					}
				})
			}
		} catch (error) {
			// Table posts n'existe peut-être pas
		}

		// Chercher dans la table blog_posts (si elle existe)
		try {
			const { data: blogPosts, error: blogError } = await supabase
				.from('blog_posts')
				.select('id, title, img')

			if (!blogError && blogPosts) {
				blogPosts.forEach(p => {
					if (p.img) {
						const filename = path.basename(p.img).toLowerCase()
						if (!dbReferences.has(filename)) {
							dbReferences.set(filename, [])
						}
						dbReferences
							.get(filename)
							.push(`DB: blog_posts (id: ${p.id}, title: ${p.title})`)
					}
				})
			}
		} catch (error) {
			// Table blog_posts n'existe peut-être pas
		}

		console.log(`   ✓ ${dbReferences.size} images référencées dans la DB\n`)
	} catch (error) {
		console.error(`   ✗ Erreur DB: ${error.message}\n`)
		audit.errors.push({ error: `Erreur DB: ${error.message}` })
	}

	return dbReferences
}

/**
 * Analyse et compare les résultats
 */
function analyzeResults(bucketImages, codeReferences, dbReferences) {
	console.log('📊 Analyse des résultats...\n')

	for (const imagePath of bucketImages) {
		const filename = path.basename(imagePath).toLowerCase()
		const references = []

		// Chercher dans le code
		if (codeReferences.has(filename)) {
			references.push(...codeReferences.get(filename))
		}

		// Chercher dans la DB
		if (dbReferences.has(filename)) {
			references.push(...dbReferences.get(filename))
		}

		const imageData = {
			path: imagePath,
			filename: path.basename(imagePath),
			used: references.length > 0,
			references: references,
		}

		if (imageData.used) {
			audit.usedImages.push(imageData)
		} else {
			audit.unusedImages.push(imageData)
		}
	}

	audit.totalImages = bucketImages.length
}

/**
 * Génère un rapport Markdown
 */
function generateMarkdownReport() {
	const lines = []

	lines.push('# 📊 Rapport d\'audit des images R2\n')
	lines.push(`**Date:** ${new Date().toLocaleString('fr-FR')}\n`)
	lines.push('---\n')

	// Statistiques
	lines.push('## 📈 Statistiques\n')
	lines.push(`- **Total d'images analysées:** ${audit.totalImages}`)
	lines.push(`- **Images utilisées:** ${audit.usedImages.length} (${Math.round((audit.usedImages.length / audit.totalImages) * 100)}%)`)
	lines.push(`- **Images potentiellement inutilisées:** ${audit.unusedImages.length} (${Math.round((audit.unusedImages.length / audit.totalImages) * 100)}%)`)
	if (audit.errors.length > 0) {
		lines.push(`- **Erreurs:** ${audit.errors.length}`)
	}
	lines.push('')

	// Images inutilisées (les plus intéressantes)
	if (audit.unusedImages.length > 0) {
		lines.push('---\n')
		lines.push('## ⚠️ Images potentiellement inutilisées\n')
		lines.push('*Ces images n\'ont aucune référence détectée dans le code ou la base de données.*\n')
		lines.push('**⚠️ ATTENTION:** Vérifiez manuellement avant de supprimer ! Certaines peuvent être utilisées dynamiquement.\n')

		// Grouper par dossier
		const byFolder = {}
		audit.unusedImages.forEach(img => {
			const folder = path.dirname(img.path)
			if (!byFolder[folder]) {
				byFolder[folder] = []
			}
			byFolder[folder].push(img.filename)
		})

		Object.keys(byFolder)
			.sort()
			.forEach(folder => {
				lines.push(`### ${folder}/\n`)
				byFolder[folder].forEach(filename => {
					lines.push(`- \`${filename}\``)
				})
				lines.push('')
			})
	}

	// Images utilisées (résumé seulement)
	if (audit.usedImages.length > 0) {
		lines.push('---\n')
		lines.push('## ✅ Images utilisées\n')
		lines.push(`${audit.usedImages.length} images sont activement utilisées.\n`)
		lines.push('*Détails complets dans le fichier JSON.*\n')
	}

	// Erreurs
	if (audit.errors.length > 0) {
		lines.push('---\n')
		lines.push('## ❌ Erreurs\n')
		audit.errors.forEach(err => {
			lines.push(`- ${err.error}`)
		})
		lines.push('')
	}

	return lines.join('\n')
}

/**
 * Fonction principale
 */
async function main() {
	console.log('🚀 Audit des images du bucket R2\n')
	console.log('='.repeat(60))
	console.log('')

	// Vérification
	if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
		console.error('❌ Variables d\'environnement R2 manquantes')
		process.exit(1)
	}

	if (!supabaseUrl || !supabaseKey) {
		console.error('❌ Variables d\'environnement Supabase manquantes')
		process.exit(1)
	}

	try {
		// 1. Lister toutes les images du bucket
		const bucketImages = await listAllImages()

		// 2. Scanner le codebase
		const codeReferences = scanCodebase()

		// 3. Scanner la DB
		const dbReferences = await scanDatabase()

		// 4. Analyser et comparer
		analyzeResults(bucketImages, codeReferences, dbReferences)

		// 5. Générer les rapports
		console.log('📝 Génération des rapports...')

		// Rapport JSON (complet)
		fs.writeFileSync(
			'image-audit-report.json',
			JSON.stringify(audit, null, 2),
			'utf-8'
		)
		console.log('   ✓ Rapport JSON: image-audit-report.json')

		// Rapport Markdown (résumé)
		const markdown = generateMarkdownReport()
		fs.writeFileSync('image-audit-report.md', markdown, 'utf-8')
		console.log('   ✓ Rapport Markdown: image-audit-report.md\n')

		// 6. Afficher le résumé
		console.log('='.repeat(60))
		console.log('📊 RÉSUMÉ')
		console.log('='.repeat(60))
		console.log(`Total d'images:           ${audit.totalImages}`)
		console.log(`✓ Utilisées:              ${audit.usedImages.length} (${Math.round((audit.usedImages.length / audit.totalImages) * 100)}%)`)
		console.log(`⚠ Potentiellement inutilisées: ${audit.unusedImages.length} (${Math.round((audit.unusedImages.length / audit.totalImages) * 100)}%)`)
		if (audit.errors.length > 0) {
			console.log(`❌ Erreurs:               ${audit.errors.length}`)
		}
		console.log('='.repeat(60))

		console.log('\n✨ Audit terminé! Consultez les rapports pour plus de détails.\n')
	} catch (error) {
		console.error('❌ Erreur fatale:', error)
		process.exit(1)
	}
}

// Exécution
main()
