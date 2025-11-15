const fs = require('fs')
const path = require('path')

console.log('🚀 MIGRATION COMPLÈTE VERS APP ROUTER\n')

// Fonction pour parcourir récursivement un répertoire
function findFilesRecursive(dir, pattern, fileList = []) {
	const files = fs.readdirSync(dir)

	files.forEach(file => {
		const filePath = path.join(dir, file)
		const stat = fs.statSync(filePath)

		if (stat.isDirectory()) {
			// Ignorer node_modules et .next
			if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
				findFilesRecursive(filePath, pattern, fileList)
			}
		} else if (stat.isFile() && (file.endsWith('.jsx') || file.endsWith('.js'))) {
			const content = fs.readFileSync(filePath, 'utf-8')
			if (pattern.test(content)) {
				fileList.push(filePath)
			}
		}
	})

	return fileList
}

// Trouver tous les fichiers utilisant useRouter de next/router
console.log('📝 Recherche de tous les fichiers à migrer...\n')

const componentsDir = path.join(__dirname, '..', 'components')
const pattern = /from ['"]next\/router['"]/

const filesToMigrate = findFilesRecursive(componentsDir, pattern)

console.log(`✅ ${filesToMigrate.length} fichiers trouvés\n`)

// Statistiques
let stats = {
	migrated: 0,
	skipped: 0,
	needsManualReview: [],
	errors: []
}

function analyzeRouterUsage(content) {
	return {
		usesPathname: /router\.pathname/.test(content),
		usesQuery: /router\.query/.test(content),
		usesAsPath: /router\.asPath/.test(content),
		usesLocale: /router\.locale/.test(content),
		usesPush: /router\.push/.test(content),
		usesReplace: /router\.replace/.test(content),
		usesBack: /router\.back/.test(content),
		usesReload: /router\.reload/.test(content),
		usesEvents: /router\.events/.test(content),
		usesPrefetch: /router\.prefetch/.test(content)
	}
}

function migrateFile(fullPath) {
	const relativePath = path.relative(path.join(__dirname, '..'), fullPath)

	console.log(`\n📄 Traitement: ${relativePath}`)

	let content = fs.readFileSync(fullPath, 'utf-8')

	// Vérifier si déjà migré
	if (content.includes("from 'next/navigation'")) {
		console.log('   ⏭️  Déjà migré')
		stats.skipped++
		return
	}

	// Créer une sauvegarde
	const backupPath = fullPath + '.backup-app-router'
	if (!fs.existsSync(backupPath)) {
		fs.writeFileSync(backupPath, content, 'utf-8')
		console.log('   💾 Sauvegarde créée')
	}

	// Analyser l'usage du router
	const usage = analyzeRouterUsage(content)
	const usageKeys = Object.keys(usage).filter(k => usage[k])

	if (usageKeys.length > 0) {
		console.log('   🔍 Usage détecté:', usageKeys.join(', '))
	} else {
		console.log('   🔍 Aucun usage spécifique détecté')
	}

	// Cas spéciaux qui nécessitent une révision manuelle
	if (usage.usesEvents || usage.usesPrefetch || usage.usesReload) {
		console.log('   ⚠️  Cas spécial détecté - nécessite révision manuelle')
		stats.needsManualReview.push({
			file: relativePath,
			reason: 'Uses router.events, router.prefetch, or router.reload',
			usage: usageKeys
		})
		return
	}

	try {
		// Ajouter 'use client' si pas déjà présent
		if (!content.startsWith("'use client'") && !content.startsWith('"use client"')) {
			content = `'use client'\n\n${content}`
		}

		// Remplacer les imports
		content = content.replace(
			/import\s*\{\s*useRouter\s*\}\s*from\s*['"]next\/router['"]/g,
			"import { useRouter, usePathname, useParams } from 'next/navigation'"
		)

		// Déclarer les hooks nécessaires
		if (usage.usesPathname || usage.usesQuery || usage.usesAsPath || usage.usesLocale) {
			// Trouver la ligne où useRouter est appelé
			content = content.replace(
				/(const\s+router\s*=\s*useRouter\(\))/,
				'const router = useRouter()\n\tconst pathname = usePathname()\n\tconst params = useParams()'
			)
		}

		// Remplacer router.pathname
		if (usage.usesPathname) {
			content = content.replace(/router\.pathname/g, 'pathname')
			// Ajouter null safety
			content = content.replace(/pathname\.startsWith\(/g, 'pathname?.startsWith(')
			content = content.replace(/pathname\.includes\(/g, 'pathname?.includes(')
			content = content.replace(/pathname\.split\(/g, 'pathname?.split(')
		}

		// Remplacer router.query
		if (usage.usesQuery) {
			// Remplacer les accès spécifiques : router.query.something -> params?.something
			content = content.replace(/router\.query\.(\w+)/g, 'params?.$1')
			// Remplacer router.query générique
			content = content.replace(/router\.query/g, 'params')
		}

		// Gérer router.asPath
		if (usage.usesAsPath) {
			// Cas spécial : changement de locale
			if (usage.usesLocale || /locale:\s*\w+/.test(content)) {
				console.log('   🔧 Détection changement de locale')

				// Remplacer le pattern de changement de locale (peut être multiligne)
				content = content.replace(
					/router\.push\(\s*router\.asPath\s*,\s*router\.asPath\s*,\s*\{\s*locale:\s*(\w+)\s*\}\s*\)/g,
					(match, localeVar) => {
						return `// Changement de locale (App Router)
		const currentLocale = params.locale
		const newPath = pathname.replace(\`/\${currentLocale}\`, \`/\${${localeVar}}\`)
		router.push(newPath || \`/\${${localeVar}}\`)`
					}
				)
			}

			// Remplacer les autres usages de router.asPath par pathname
			content = content.replace(/router\.asPath/g, 'pathname')
		}

		// Remplacer router.locale
		if (usage.usesLocale) {
			content = content.replace(/router\.locale/g, 'params.locale')
		}

		// router.back(), router.push(), router.replace() fonctionnent de la même manière
		// Pas besoin de changement

		// Écrire le fichier
		fs.writeFileSync(fullPath, content, 'utf-8')
		console.log('   ✅ Migré avec succès')
		stats.migrated++

	} catch (error) {
		console.log('   ❌ Erreur:', error.message)
		stats.errors.push({ file: relativePath, error: error.message })

		// Restaurer depuis la sauvegarde en cas d'erreur
		if (fs.existsSync(backupPath)) {
			fs.copyFileSync(backupPath, fullPath)
			console.log('   🔄 Restauré depuis la sauvegarde')
		}
	}
}

// Migrer tous les fichiers
console.log('\n' + '='.repeat(60))
console.log('DÉBUT DE LA MIGRATION')
console.log('='.repeat(60))

filesToMigrate.forEach(file => {
	migrateFile(file)
})

// Afficher le rapport final
console.log('\n' + '='.repeat(60))
console.log('RAPPORT DE MIGRATION')
console.log('='.repeat(60))
console.log(`\n📊 Statistiques:`)
console.log(`   ✅ Fichiers migrés: ${stats.migrated}`)
console.log(`   ⏭️  Fichiers ignorés: ${stats.skipped}`)
console.log(`   ⚠️  Nécessitent révision: ${stats.needsManualReview.length}`)
console.log(`   ❌ Erreurs: ${stats.errors.length}`)

if (stats.needsManualReview.length > 0) {
	console.log('\n⚠️  FICHIERS NÉCESSITANT UNE RÉVISION MANUELLE:')
	stats.needsManualReview.forEach(item => {
		console.log(`\n   📄 ${item.file}`)
		console.log(`      Raison: ${item.reason}`)
		console.log(`      Usage: ${item.usage.join(', ')}`)
	})
}

if (stats.errors.length > 0) {
	console.log('\n❌ ERREURS:')
	stats.errors.forEach(item => {
		console.log(`   - ${item.file}`)
		console.log(`     Erreur: ${item.error}`)
	})
}

console.log('\n💡 PROCHAINES ÉTAPES:')
console.log('   1. Vérifier les fichiers nécessitant une révision manuelle')
console.log('   2. Redémarrer le serveur de développement: npm run dev')
console.log('   3. Tester toutes les pages principales')
console.log('   4. Si tout fonctionne, supprimer les fichiers .backup-app-router')
console.log('\n✨ Migration terminée!\n')
