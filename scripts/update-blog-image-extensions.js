/**
 * Script pour mettre à jour les extensions d'images .png en .webp
 * dans les fichiers markdown du blog
 */

const fs = require('fs')
const path = require('path')

const postsDirectory = path.join(process.cwd(), 'posts')

// Vérifier si le dossier posts existe
if (!fs.existsSync(postsDirectory)) {
	console.error('❌ Le dossier "posts" n\'existe pas')
	process.exit(1)
}

// Lire tous les fichiers .mdx dans le dossier posts
const files = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.mdx'))

console.log(`📝 Traitement de ${files.length} fichiers markdown...\n`)

let updatedCount = 0

files.forEach(filename => {
	const filePath = path.join(postsDirectory, filename)
	let content = fs.readFileSync(filePath, 'utf-8')

	// Sauvegarder le contenu original pour comparaison
	const originalContent = content

	// Remplacer toutes les occurrences de .png par .webp dans les URLs d'images
	// Cible les patterns: img: "filename.png" ou src="filename.png"
	content = content.replace(/(\.(png|PNG))/g, '.webp')

	// Si le contenu a changé, écrire le fichier mis à jour
	if (content !== originalContent) {
		fs.writeFileSync(filePath, content, 'utf-8')
		console.log(`✅ ${filename} - mis à jour`)
		updatedCount++
	} else {
		console.log(`⏭️  ${filename} - aucun changement nécessaire`)
	}
})

console.log(`\n🎉 Terminé ! ${updatedCount} fichier(s) mis à jour sur ${files.length}`)
