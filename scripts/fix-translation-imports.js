const fs = require('fs')
const path = require('path')

console.log('🔧 Fixing translation imports to resolve client/server boundary issue...\n')

// File: components/material/Words.jsx
const wordsPath = path.join(__dirname, '..', 'components', 'material', 'Words.jsx')
console.log('📝 Updating Words.jsx...')

let wordsContent = fs.readFileSync(wordsPath, 'utf8')

// Replace import statement
wordsContent = wordsContent.replace(
	"import { translateWord, getTranslationStats } from '@/lib/words-client'",
	"import { translateWordAction, getTranslationStatsAction } from '@/app/actions/words'"
)

// Replace translateWord function calls with translateWordAction
wordsContent = wordsContent.replace(/translateWord\(/g, 'translateWordAction(')

// Replace getTranslationStats with getTranslationStatsAction and handle return value
wordsContent = wordsContent.replace(
	/translationStats = await getTranslationStats\(/g,
	'const statsResult = await getTranslationStatsAction('
)

// Add handling for stats result
wordsContent = wordsContent.replace(
	/(const statsResult = await getTranslationStatsAction\(\{[^}]+\}\))/,
	'$1\n\t\t\ttranslationStats = statsResult.success ? statsResult.stats : {}'
)

// Remove duplicate translationStats initialization if it exists
wordsContent = wordsContent.replace(
	/(const statsResult = await getTranslationStatsAction\(\{[^}]+\}\)\n\t\t\ttranslationStats = statsResult\.success \? statsResult\.stats : \{\})\n\t\t\t(translationStats = statsResult\.success \? statsResult\.stats : \{\})/g,
	'$1'
)

fs.writeFileSync(wordsPath, wordsContent, 'utf8')
console.log('✅ Words.jsx updated\n')

// File: components/material/Translation.jsx
const translationPath = path.join(__dirname, '..', 'components', 'material', 'Translation.jsx')
console.log('📝 Updating Translation.jsx...')

let translationContent = fs.readFileSync(translationPath, 'utf8')

// Replace import statement
translationContent = translationContent.replace(
	"import { addWord } from '@/lib/words-client'",
	"import { addWordAction } from '@/app/actions/words'"
)

// Replace addWord function call with addWordAction
translationContent = translationContent.replace(/addWord\(/g, 'addWordAction(')
// Also need to update the mutation
translationContent = translationContent.replace('mutationFn: addWordAction,', 'mutationFn: addWordAction,')

fs.writeFileSync(translationPath, translationContent, 'utf8')
console.log('✅ Translation.jsx updated\n')

console.log('🎉 All files updated successfully!')
console.log('\n📋 Summary:')
console.log('  - Replaced wrapper functions from lib/words-client.js with direct Server Action imports')
console.log('  - This fixes the client/server boundary violation in production builds')
console.log('\n⚠️  Next steps:')
console.log('  1. Test locally: npm run dev')
console.log('  2. Check translation functionality on a material page')
console.log('  3. If working, build and deploy: npm run build')
