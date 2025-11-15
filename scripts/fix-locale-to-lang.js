const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', '[locale]', 'materials', '[section]', 'page.js')

let content = fs.readFileSync(filePath, 'utf-8')

// Remplacer material.locale par material.lang dans le filtre
content = content.replace(
  /return material\.locale === userLearningLanguage;/g,
  'return material.lang === userLearningLanguage;'
)

fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ Filtre corrigé : locale → lang')
