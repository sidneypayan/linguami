const fs = require('fs')
const path = require('path')

/**
 * Consolidate all translations from locales/ structure to messages/ structure
 *
 * From: locales/fr/register.json, locales/fr/common.json, etc.
 * To: messages/fr.json with all namespaces
 */

const LOCALES = ['fr', 'ru', 'en']
const LOCALES_DIR = path.join(process.cwd(), 'locales')
const MESSAGES_DIR = path.join(process.cwd(), 'messages')

function consolidateLocale(locale) {
  console.log(`\n📦 Consolidating ${locale}...`)

  const localeDir = path.join(LOCALES_DIR, locale)
  const consolidated = {}

  if (!fs.existsSync(localeDir)) {
    console.error(`❌ Directory not found: ${localeDir}`)
    return
  }

  // Read all JSON files in locale directory
  const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.json'))

  console.log(`Found ${files.length} namespace files`)

  files.forEach(file => {
    const namespace = path.basename(file, '.json')
    const filePath = path.join(localeDir, file)

    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      consolidated[namespace] = content
      console.log(`  ✓ ${namespace} (${Object.keys(content).length} keys)`)
    } catch (error) {
      console.error(`  ❌ Error reading ${file}:`, error.message)
    }
  })

  // Write consolidated file
  const outputPath = path.join(MESSAGES_DIR, `${locale}.json`)
  fs.writeFileSync(outputPath, JSON.stringify(consolidated, null, 2), 'utf8')

  const totalKeys = Object.values(consolidated).reduce((sum, ns) => sum + Object.keys(ns).length, 0)
  console.log(`✅ Wrote ${outputPath} (${Object.keys(consolidated).length} namespaces, ${totalKeys} total keys)`)
}

function main() {
  console.log('🔄 Consolidating translations from locales/ to messages/\n')
  console.log('=' .repeat(60))

  // Create messages directory if it doesn't exist
  if (!fs.existsSync(MESSAGES_DIR)) {
    fs.mkdirSync(MESSAGES_DIR, { recursive: true })
    console.log('Created messages/ directory')
  }

  // Consolidate each locale
  LOCALES.forEach(locale => {
    consolidateLocale(locale)
  })

  console.log('\n' + '=' .repeat(60))
  console.log('✅ Translation consolidation complete!')
  console.log('\n💡 Next steps:')
  console.log('1. Restart the dev server to pick up new translations')
  console.log('2. Test the login page refresh')
}

main()
