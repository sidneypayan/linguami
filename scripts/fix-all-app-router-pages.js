const fs = require('fs')
const path = require('path')

console.log('🚀 CORRECTION DES PAGES APP ROUTER\n')

// Fonction pour parcourir récursivement un répertoire
function findFilesRecursive(dir, fileList = []) {
	const files = fs.readdirSync(dir)

	files.forEach(file => {
		const filePath = path.join(dir, file)
		const stat = fs.statSync(filePath)

		if (stat.isDirectory()) {
			if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
				findFilesRecursive(filePath, fileList)
			}
		} else if (stat.isFile() && (file.endsWith('.jsx') || file.endsWith('.js'))) {
			fileList.push(filePath)
		}
	})

	return fileList
}

// Trouver tous les fichiers dans app/[locale]
const appDir = path.join(__dirname, '..', 'app', '[locale]')
const allFiles = findFilesRecursive(appDir)

console.log(`📝 ${allFiles.length} fichiers trouvés\n`)

let stats = {
	fixed: 0,
	skipped: 0,
	errors: []
}

function fixFile(fullPath) {
	const relativePath = path.relative(path.join(__dirname, '..'), fullPath)

	let content = fs.readFileSync(fullPath, 'utf-8')
	let modified = false

	// Vérifier si le fichier utilise next-translate ou next/router
	const usesNextTranslate = /from ["']next-translate/.test(content)
	const usesOldRouter = /from ["']next\/router["']/.test(content)

	if (!usesNextTranslate && !usesOldRouter) {
		return // Rien à faire
	}

	console.log(`\n📄 ${relativePath}`)

	try {
		// 1. Remplacer next-translate par next-intl
		if (usesNextTranslate) {
			console.log('   🔧 Remplace next-translate par next-intl')

			// Remplacer useTranslation par useTranslations
			content = content.replace(
				/import useTranslation from ["']next-translate\/useTranslation["'];?/g,
				'import { useTranslations } from "next-intl";'
			)

			// Ajouter useLocale si nécessaire
			if (/\blang\b/.test(content) || /\blocale\b/.test(content)) {
				content = content.replace(
					'import { useTranslations } from "next-intl";',
					'import { useTranslations, useLocale } from "next-intl";'
				)
			}

			// Remplacer const { t, lang } = useTranslation(...) par const t = useTranslations(...)
			content = content.replace(
				/const\s*\{\s*t\s*,\s*lang\s*\}\s*=\s*useTranslation\(/g,
				'const t = useTranslations('
			)

			// Si lang est utilisé, ajouter const locale = useLocale()
			if (/\blang\b/.test(content)) {
				// Trouver où t est déclaré et ajouter locale juste après
				content = content.replace(
					/(const t = useTranslations\([^)]+\))/,
					'$1\n  const locale = useLocale();'
				)
				// Remplacer toutes les utilisations de lang par locale
				content = content.replace(/\blang\b/g, 'locale')
			}

			modified = true
		}

		// 2. Remplacer next/router par next/navigation
		if (usesOldRouter) {
			console.log('   🔧 Remplace next/router par next/navigation')

			content = content.replace(
				/import \{ useRouter \} from ["']next\/router["'];?/g,
				'import { useRouter, useParams } from "next/navigation";'
			)

			// Remplacer useRouterCompat par useRouter
			content = content.replace(/useRouterCompat/g, 'useRouter')

			// Ajouter params si router.query est utilisé
			if (/router\.query/.test(content)) {
				// Ajouter const params = useParams() après const router = useRouter()
				content = content.replace(
					/(const router = useRouter\(\);?)/,
					'$1\n  const params = useParams();'
				)

				// Remplacer router.query.xxx par params.xxx
				content = content.replace(/router\.query\.(\w+)/g, 'params.$1')
				content = content.replace(/router\.query/g, 'params')
			}

			modified = true
		}

		if (modified) {
			// Créer une sauvegarde
			const backupPath = fullPath + '.backup-app-router'
			if (!fs.existsSync(backupPath)) {
				fs.writeFileSync(backupPath, fs.readFileSync(fullPath, 'utf-8'), 'utf-8')
			}

			fs.writeFileSync(fullPath, content, 'utf-8')
			console.log('   ✅ Corrigé')
			stats.fixed++
		}

	} catch (error) {
		console.log('   ❌ Erreur:', error.message)
		stats.errors.push({ file: relativePath, error: error.message })
	}
}

// Traiter tous les fichiers
console.log('='.repeat(60))
console.log('DÉBUT DU TRAITEMENT')
console.log('='.repeat(60))

allFiles.forEach(file => fixFile(file))

// Rapport
console.log('\n' + '='.repeat(60))
console.log('RAPPORT')
console.log('='.repeat(60))
console.log(`\n📊 Statistiques:`)
console.log(`   ✅ Fichiers corrigés: ${stats.fixed}`)
console.log(`   ⏭️  Fichiers ignorés: ${allFiles.length - stats.fixed - stats.errors.length}`)
console.log(`   ❌ Erreurs: ${stats.errors.length}`)

if (stats.errors.length > 0) {
	console.log('\n❌ ERREURS:')
	stats.errors.forEach(item => {
		console.log(`   - ${item.file}`)
		console.log(`     ${item.error}`)
	})
}

console.log('\n✨ Traitement terminé!\n')
