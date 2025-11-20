const fs = require('fs')
const path = require('path')

console.log('🔧 Fixing all translation imports to resolve client/server boundary issue...\n')

const files = [
	'components/dictionary/DictionaryClient.jsx',
	'components/dictionary/AddWordModal.jsx',
	'components/layouts/BottomNav.jsx',
	'components/material/WordsContainer.jsx'
]

// Mapping of old function names to new ones
const functionMap = {
	'translateWord': 'translateWordAction',
	'getTranslationStats': 'getTranslationStatsAction',
	'addWord': 'addWordAction',
	'getUserWords': 'getUserWordsAction',
	'deleteWord': 'deleteWordAction',
	'deleteWords': 'deleteWordsAction',
	'updateWordReview': 'updateWordReviewAction',
	'initializeWordSRS': 'initializeWordSRSAction',
	'suspendCard': 'suspendCardAction',
	'getMaterialWords': 'getMaterialWordsAction'
}

files.forEach(filePath => {
	const fullPath = path.join(__dirname, '..', filePath)
	console.log(`📝 Updating ${filePath}...`)

	let content = fs.readFileSync(fullPath, 'utf8')

	// Replace import statement
	content = content.replace(
		/import \{([^}]+)\} from '@\/lib\/words-client'/,
		(match, imports) => {
			// Extract function names and map them to Action versions
			const functionNames = imports.split(',').map(name => name.trim())
			const actionNames = functionNames.map(name => {
				// Check if already has Action suffix
				if (name.endsWith('Action')) return name
				return functionMap[name] || name
			})
			return `import { ${actionNames.join(', ')} } from '@/app/actions/words'`
		}
	)

	// Replace function calls in the code
	Object.keys(functionMap).forEach(oldName => {
		const newName = functionMap[oldName]
		// Replace function calls (but not if already Action)
		const regex = new RegExp(`\\b${oldName}\\(`, 'g')
		content = content.replace(regex, `${newName}(`)

		// Replace in mutationFn
		const mutationRegex = new RegExp(`mutationFn:\\s*${oldName}`, 'g')
		content = content.replace(mutationRegex, `mutationFn: ${newName}`)
	})

	fs.writeFileSync(fullPath, content, 'utf8')
	console.log(`✅ ${filePath} updated\n`)
})

console.log('🎉 All files updated successfully!')
console.log('\n📋 Summary:')
console.log('  - Replaced wrapper functions from lib/words-client.js with direct Server Action imports')
console.log('  - This fixes the client/server boundary violation in production builds')
console.log('\n⚠️  Files updated:')
files.forEach(file => console.log(`    - ${file}`))
