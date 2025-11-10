const fs = require('fs')
const path = require('path')

/**
 * Script pour remplacer tous les imports relatifs par des alias @/
 */

// Patterns de remplacement
const replacements = [
	// 6 niveaux up
	{ from: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/(components|lib|utils|context|features|styles|public)/g, to: "from '@/$1" },
	// 5 niveaux up
	{ from: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/(components|lib|utils|context|features|styles|public)/g, to: "from '@/$1" },
	// 4 niveaux up
	{ from: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/(components|lib|utils|context|features|styles|public)/g, to: "from '@/$1" },
	// 3 niveaux up
	{ from: /from ['"]\.\.\/\.\.\/\.\.\/(components|lib|utils|context|features|styles|public)/g, to: "from '@/$1" },
	// 2 niveaux up
	{ from: /from ['"]\.\.\/\.\.\/(components|lib|utils|context|features|styles|public)/g, to: "from '@/$1" },
	// 1 niveau up
	{ from: /from ['"]\.\.\/(components|lib|utils|context|features|styles|public)/g, to: "from '@/$1" },
]

// Fonction pour parcourir récursivement un dossier
function getAllFiles(dirPath, arrayOfFiles = []) {
	const files = fs.readdirSync(dirPath)

	files.forEach(file => {
		const filePath = path.join(dirPath, file)

		if (fs.statSync(filePath).isDirectory()) {
			// Ignorer certains dossiers
			if (!['node_modules', '.next', '.git'].includes(file)) {
				arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
			}
		} else {
			// Garder seulement les fichiers JS/JSX
			if (file.endsWith('.js') || file.endsWith('.jsx')) {
				arrayOfFiles.push(filePath)
			}
		}
	})

	return arrayOfFiles
}

function refactorImports() {
	console.log('🔍 Recherche des fichiers à refactorer...\n')

	// Trouver tous les fichiers JS/JSX
	const files = getAllFiles(process.cwd())

	console.log(`📝 ${files.length} fichiers trouvés\n`)

	let modifiedCount = 0
	let errorCount = 0

	for (const filePath of files) {
		try {
			let content = fs.readFileSync(filePath, 'utf8')
			let modified = false
			const originalContent = content

			// Appliquer tous les patterns de remplacement
			for (const { from, to } of replacements) {
				const newContent = content.replace(from, to)
				if (newContent !== content) {
					content = newContent
					modified = true
				}
			}

			if (modified) {
				fs.writeFileSync(filePath, content, 'utf8')
				const relativePath = path.relative(process.cwd(), filePath)
				console.log(`✅ ${relativePath}`)
				modifiedCount++
			}
		} catch (error) {
			const relativePath = path.relative(process.cwd(), filePath)
			console.error(`❌ Erreur sur ${relativePath}:`, error.message)
			errorCount++
		}
	}

	console.log(`\n📊 RÉSUMÉ:`)
	console.log(`   ✅ Fichiers modifiés: ${modifiedCount}`)
	console.log(`   ❌ Erreurs: ${errorCount}`)
	console.log(`   📁 Total analysé: ${files.length}`)
	console.log(`\n✨ Refactoring terminé !`)
}

refactorImports()
