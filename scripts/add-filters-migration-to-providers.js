const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../app/providers.js')
let content = fs.readFileSync(filePath, 'utf8')

console.log('Adding FiltersMigration to providers.js...')

// Step 1: Add import
const importLine = "import { migrateFiltersLocalStorage } from '@/utils/migrateFiltersLocalStorage'"
if (!content.includes(importLine)) {
  const gtmImportPos = content.indexOf("import * as gtm from '@/lib/gtm'")
  const lineEnd = content.indexOf('\n', gtmImportPos)
  content = content.slice(0, lineEnd + 1) + importLine + '\n' + content.slice(lineEnd + 1)
  console.log('✓ Added import for migrateFiltersLocalStorage')
}

// Step 2: Add FiltersMigration component
const migrationComponent = `
// Composant pour migrer les anciennes clés localStorage des filtres
function FiltersMigration() {
\tuseEffect(() => {
\t\tmigrateFiltersLocalStorage()
\t}, [])

\treturn null
}
`

if (!content.includes('function FiltersMigration')) {
  const gtmComponentPos = content.indexOf('// Composant pour gérer le tracking GTM')
  content = content.slice(0, gtmComponentPos) + migrationComponent + '\n' + content.slice(gtmComponentPos)
  console.log('✓ Added FiltersMigration component')
}

// Step 3: Add FiltersMigration to JSX
if (!content.includes('<FiltersMigration />')) {
  content = content.replace(
    '<GTMTracking />',
    '<FiltersMigration />\n\t\t\t\t\t\t\t\t<GTMTracking />'
  )
  console.log('✓ Added <FiltersMigration /> to JSX')
}

fs.writeFileSync(filePath, content, 'utf8')
console.log('\n✅ Successfully updated app/providers.js')
