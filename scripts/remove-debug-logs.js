const fs = require('fs')
const path = require('path')

const files = [
  path.join(__dirname, '..', 'app', '[locale]', 'materials', '[section]', 'page.js'),
  path.join(__dirname, '..', 'app', '[locale]', 'materials', 'page.js')
]

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`)
    return
  }

  let content = fs.readFileSync(filePath, 'utf-8')

  // Remove all debug console.log statements
  content = content.replace(/\s*console\.log\('🔍 DEBUG[^)]+\);?\n?/g, '')
  content = content.replace(/\s*console\.log\('🔍 DEBUG[^}]+\}\);?\n?/g, '')

  // Clean up multiple empty lines
  content = content.replace(/\n\n\n+/g, '\n\n')

  fs.writeFileSync(filePath, content, 'utf-8')

  const fileName = path.basename(path.dirname(filePath)) + '/' + path.basename(filePath)
  console.log(`✅ Removed debug logs from ${fileName}`)
})

console.log('\n✨ All debug logs removed!')
