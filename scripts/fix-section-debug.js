const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', '[locale]', 'materials', '[section]', 'page.js')

let content = fs.readFileSync(filePath, 'utf-8')

// Supprimer l'ancien debug mal placé
content = content.replace(/\/\/ DEBUG - À SUPPRIMER[\s\S]*?\/\/ FIN DEBUG\s*/g, '')

// Ajouter le debug dans le useMemo de displayedMaterials
content = content.replace(
  /(const displayedMaterials = useMemo\(\(\) => \{)/,
  `$1
    console.log('🔍 DEBUG displayedMaterials:', {
      section,
      userLearningLanguage,
      filtered_materials_count: filtered_materials?.length,
      materials_loading
    });`
)

// Ajouter aussi un debug après la déclaration de section (sans filtered_materials)
content = content.replace(
  /(const section = params\.section;)/,
  `$1
  
  console.log('🔍 DEBUG Section:', { section, params });`
)

fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ Debug corrigé!')
