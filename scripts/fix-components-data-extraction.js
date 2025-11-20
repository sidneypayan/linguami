const fs = require('fs')
const path = require('path')

console.log('🔧 Fixing components to extract data from Server Actions...\n')

const files = [
	{
		path: 'components/dictionary/DictionaryClient.jsx',
		replacements: [
			{
				from: /queryFn: \(\) => getUserWordsAction\(\{ userId, userLearningLanguage \}\),/g,
				to: `queryFn: async () => {
			const result = await getUserWordsAction({ userId, userLearningLanguage })
			return result.success ? result.data : []
		},`
			}
		]
	},
	{
		path: 'components/materials/MaterialsPageClient.jsx',
		replacements: [
			{
				from: /queryFn: \(\) => getMaterialsByLanguageAction\(userLearningLanguage\),/g,
				to: `queryFn: async () => {
			const result = await getMaterialsByLanguageAction(userLearningLanguage)
			return result.success ? result.data : []
		},`
			}
		]
	},
	{
		path: 'components/layouts/BottomNav.jsx',
		replacements: [
			{
				from: /queryFn: \(\) => getUserWordsAction\(\{ userId, userLearningLanguage \}\),/g,
				to: `queryFn: async () => {
			const result = await getUserWordsAction({ userId, userLearningLanguage })
			return result.success ? result.data : []
		},`
			}
		]
	}
]

files.forEach(file => {
	const fullPath = path.join(__dirname, '..', file.path)
	console.log(`📝 Updating ${file.path}...`)

	let content = fs.readFileSync(fullPath, 'utf8')

	file.replacements.forEach(replacement => {
		content = content.replace(replacement.from, replacement.to)
	})

	fs.writeFileSync(fullPath, content, 'utf8')
	console.log(`✅ ${file.path} updated\n`)
})

console.log('🎉 All components updated successfully!')
console.log('\n📋 Summary:')
console.log('  - Fixed data extraction from Server Actions in all components')
console.log('  - Server Actions responses are now properly unwrapped')
