const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', '[locale]', 'not-found.js')

console.log('🔧 Fixing typographic apostrophe in not-found.js...')

let content = fs.readFileSync(filePath, 'utf8')

// Replace typographic apostrophe with HTML entity
content = content.replace(/← Retour à l'accueil/g, '← Retour à l&apos;accueil')

fs.writeFileSync(filePath, content, 'utf8')

console.log('✅ Fixed!')
