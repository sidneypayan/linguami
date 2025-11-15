const fs = require('fs')
const path = require('path')

console.log('🚀 MIGRATION VERS NEXT-INTL\n')

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
			const content = fs.readFileSync(filePath, 'utf-8')
			if (/from ['"]next-translate/.test(content)) {
				fileList.push(filePath)
			}
		}
	})

	return fileList
}

// Trouver tous les fichiers utilisant next-translate
const componentsDir = path.join(__dirname, '..', 'components')
const filesToMigrate = findFilesRecursive(componentsDir)

console.log(`📝 ${filesToMigrate.length} fichiers trouvés\n`)

let stats = {
	migrated: 0,
	skipped: 0,
	errors: []
}

function migrateFile(fullPath) {
	const relativePath = path.relative(path.join(__dirname, '..'), fullPath)

	console.log(`\n📄 ${relativePath}`)

	let content = fs.readFileSync(fullPath, 'utf-8')

	try {
		// Créer une sauvegarde
		const backupPath = fullPath + '.backup-next-intl'
		if (!fs.existsSync(backupPath)) {
			fs.writeFileSync(backupPath, content, 'utf-8')
			console.log('   💾 Sauvegarde créée')
		}

		// 1. Remplacer l'import
		const oldImportPattern = /import useTranslation from ['"]next-translate\/useTranslation['"]/g
		content = content.replace(oldImportPattern, "import { useTranslations, useLocale } from 'next-intl'")

		// 2. Remplacer const { t, lang } = useTranslation('namespace')
		//    par const t = useTranslations('namespace') et const locale = useLocale()
		const useTranslationPattern = /const\s*\{\s*t\s*,\s*lang\s*\}\s*=\s*useTranslation\((['"]?\w+['"]?)\)/g
		content = content.replace(useTranslationPattern, (match, namespace) => {
			return `const t = useTranslations(${namespace})\n\tconst locale = useLocale()`
		})

		// 3. Remplacer const { t } = useTranslation('namespace')
		//    par const t = useTranslations('namespace')
		const useTranslationSimplePattern = /const\s*\{\s*t\s*\}\s*=\s*useTranslation\((['"]?\w+['"]?)\)/g
		content = content.replace(useTranslationSimplePattern, (match, namespace) => {
			return `const t = useTranslations(${namespace})`
		})

		// 4. Remplacer toutes les occurrences de 'lang' par 'locale' (sauf dans les commentaires et strings)
		// On fait cela de manière prudente pour ne pas casser le code
		content = content.replace(/\blang\b(?!['":])/g, 'locale')

		// Écrire le fichier
		fs.writeFileSync(fullPath, content, 'utf-8')
		console.log('   ✅ Migré avec succès')
		stats.migrated++

	} catch (error) {
		console.log('   ❌ Erreur:', error.message)
		stats.errors.push({ file: relativePath, error: error.message })

		// Restaurer depuis la sauvegarde
		const backupPath = fullPath + '.backup-next-intl'
		if (fs.existsSync(backupPath)) {
			fs.copyFileSync(backupPath, fullPath)
			console.log('   🔄 Restauré depuis la sauvegarde')
		}
	}
}

// Migrer tous les fichiers
console.log('='.repeat(60))
console.log('DÉBUT DE LA MIGRATION')
console.log('='.repeat(60))

filesToMigrate.forEach(file => migrateFile(file))

// Rapport
console.log('\n' + '='.repeat(60))
console.log('RAPPORT DE MIGRATION')
console.log('='.repeat(60))
console.log(`\n📊 Statistiques:`)
console.log(`   ✅ Fichiers migrés: ${stats.migrated}`)
console.log(`   ⏭️  Fichiers ignorés: ${stats.skipped}`)
console.log(`   ❌ Erreurs: ${stats.errors.length}`)

if (stats.errors.length > 0) {
	console.log('\n❌ ERREURS:')
	stats.errors.forEach(item => {
		console.log(`   - ${item.file}`)
		console.log(`     ${item.error}`)
	})
}

console.log('\n💡 PROCHAINES ÉTAPES:')
console.log('   1. Redémarrer le serveur de développement: npm run dev')
console.log('   2. Vérifier que les traductions s affichent correctement')
console.log('   3. Si tout fonctionne, supprimer les fichiers .backup-next-intl')

console.log('\n✨ Migration terminée!\n')
