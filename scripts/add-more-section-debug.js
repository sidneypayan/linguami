const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', '[locale]', 'materials', '[section]', 'page.js')

let content = fs.readFileSync(filePath, 'utf-8')

// Ajouter un log après le calcul de displayedMaterials
content = content.replace(
  /(}, \[filtered_materials, userLearningLanguage\]\);)/,
  `}, [filtered_materials, userLearningLanguage]);
  
  console.log('🔍 DEBUG displayedMaterials RESULT:', {
    displayedMaterials_count: displayedMaterials.length,
    first_3_materials: displayedMaterials.slice(0, 3).map(m => ({id: m.id, title: m.title, locale: m.locale}))
  });`
)

fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ More debug added!')
