const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', '[locale]', 'materials', '[section]', 'page.js')

let content = fs.readFileSync(filePath, 'utf-8')

// Ajouter des console.log après la déclaration de section
const afterSection = `  const section = params.section;
  
  // DEBUG - À SUPPRIMER
  console.log('🔍 DEBUG Section Page:', {
    section,
    params,
    userLearningLanguage,
    filtered_materials: filtered_materials?.length,
    materials_loading
  })
  // FIN DEBUG`

content = content.replace(
  /const section = params\.section;/,
  afterSection
)

fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ Debug ajouté!')
