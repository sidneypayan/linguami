const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', '[locale]', 'materials', '[section]', 'page.js')

let content = fs.readFileSync(filePath, 'utf-8')

// Remplacer le debug de displayedMaterials pour montrer les locales
content = content.replace(
  /console\.log\('🔍 DEBUG displayedMaterials:', \{[\s\S]*?\}\);/,
  `console.log('🔍 DEBUG displayedMaterials:', {
      section,
      userLearningLanguage,
      filtered_materials_count: filtered_materials?.length,
      materials_loading,
      sample_locales: filtered_materials?.slice(0, 5).map(m => ({ id: m.id, locale: m.locale, lang: m.lang }))
    });`
)

fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ Debug locale ajouté!')
