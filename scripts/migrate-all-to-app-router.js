const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 MIGRATION COMPLÈTE VERS APP ROUTER\n')

// Trouver tous les fichiers utilisant useRouter de next/router
console.log('📝 Recherche de tous les fichiers à migrer...\n')

const findCommand = process.platform === 'win32'
	? 'findstr /S /M "from \'next/router\'" components\\*.jsx components\\*.js'
	: 'grep -r "from \'next/router\'" components --include="*.jsx" --include="*.js" -l'

let filesToMigrate = []
try {
	const result = execSync(findCommand, { cwd: path.join(__dirname, '..'), encoding: 'utf-8' })
	filesToMigrate = result.trim().split('\n').filter(Boolean)
} catch (error) {
	console.log('Aucun fichier trouvé ou erreur de recherche')
}

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

function migrateFile(filePath) {
	const fullPath = path.join(__dirname, '..', filePath)

	console.log(`\n📄 Traitement: ${filePath}`)

	if (!fs.existsSync(fullPath)) {
		console.log('   ⏭️  Fichier introuvable, ignoré')
		stats.skipped++
		return
	}

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
	console.log('   🔍 Usage détecté:', Object.keys(usage).filter(k => usage[k]).join(', '))

	// Cas spéciaux qui nécessitent une révision manuelle
	if (usage.usesEvents || usage.usesPrefetch || usage.usesReload) {
		console.log('   ⚠️  Cas spécial détecté - nécessite révision manuelle')
		stats.needsManualReview.push({
			file: filePath,
			reason: 'Uses router.events, router.prefetch, or router.reload'
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
			"import { useRouter } from 'next/router'",
			"import { useRouter, usePathname, useParams } from 'next/navigation'"
		)

		// Déclarer les hooks nécessaires
		if (usage.usesPathname || usage.usesQuery || usage.usesAsPath || usage.usesLocale) {
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
		}

		// Remplacer router.query
		if (usage.usesQuery) {
			content = content.replace(/router\.query\.(\w+)/g, 'params?.$1')
			content = content.replace(/router\.query/g, 'params')
		}

		// Gérer router.asPath (utilisé souvent avec router.push pour le locale)
		if (usage.usesAsPath) {
			// Cas spécial : changement de locale
			if (usage.usesLocale || /locale:\s*\w+/.test(content)) {
				console.log('   🔧 Détection changement de locale')

				// Remplacer le pattern de changement de locale
				content = content.replace(
					/router\.push\(router\.asPath,\s*router\.asPath,\s*\{\s*locale:\s*(\w+)\s*\}\)/g,
					`const currentLocale = params.locale
		const newPath = pathname.replace(\`/\${currentLocale}\`, \`/\${$1}\`)
		router.push(newPath || \`/\${$1}\`)`
				)
			}

			// Remplacer les autres usages de router.asPath par pathname
			content = content.replace(/router\.asPath/g, 'pathname')
		}

		// Remplacer router.locale
		if (usage.usesLocale) {
			content = content.replace(/router\.locale/g, 'params.locale')
		}

		// router.back() et router.replace() fonctionnent de la même manière
		// Pas besoin de changement pour push, back, replace

		// Écrire le fichier
		fs.writeFileSync(fullPath, content, 'utf-8')
		console.log('   ✅ Migré avec succès')
		stats.migrated++

	} catch (error) {
		console.log('   ❌ Erreur:', error.message)
		stats.errors.push({ file: filePath, error: error.message })

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
	// Normaliser le chemin pour Windows
	const normalizedFile = file.replace(/\\/g, '/')
	migrateFile(normalizedFile)
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
		console.log(`   - ${item.file}`)
		console.log(`     Raison: ${item.reason}`)
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
