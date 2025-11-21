/**
 * Modifie le tri des materials pour grouper les dialogues par chapter_number
 */

const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', 'actions', 'materials.js')

console.log('\n🔧 Modification du tri dans materials.js...\n')

// Lire le fichier
let content = fs.readFileSync(filePath, 'utf8')

// Remplacer la ligne de tri
const oldLine = "    .order('created_at', { ascending: false })"
const newLines = "    .order('chapter_number', { ascending: true, nullsLast: true })\n    .order('created_at', { ascending: false })"

if (content.includes(oldLine)) {
  content = content.replace(oldLine, newLines)
  fs.writeFileSync(filePath, content, 'utf8')
  console.log('✅ Fichier modifié avec succès !')
  console.log('\n📝 Nouvelle logique de tri :')
  console.log('   1. chapter_number ascendant (groupe les dialogues par titre)')
  console.log('   2. created_at descendant (matériaux récents en premier)')
  console.log('\n✨ Terminé !')
} else {
  console.log('⚠️  La ligne à remplacer n\'a pas été trouvée.')
  console.log('   Le fichier a peut-être déjà été modifié.')
}
