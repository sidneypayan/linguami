const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', '[locale]', 'materials', 'page.js')

let content = fs.readFileSync(filePath, 'utf-8')

// Remplacer m.locale par m.lang
content = content.replace(
  /\.filter\(m => m\.locale === userLearningLanguage\)/g,
  '.filter(m => m.lang === userLearningLanguage)'
)

fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ Page materials corrigée : locale → lang')
