const fs = require('fs')
const path = require('path')

console.log('🔧 Fixing hooks to extract data from Server Actions...\n')

// Fix useMaterialWords.js
const useMaterialWordsPath = path.join(__dirname, '..', 'hooks', 'words', 'useMaterialWords.js')
console.log('📝 Updating useMaterialWords.js...')

let useMaterialWordsContent = fs.readFileSync(useMaterialWordsPath, 'utf8')

// Replace queryFn to extract data from Server Action response
useMaterialWordsContent = useMaterialWordsContent.replace(
	/queryFn: \(\) => getMaterialWordsAction\(\{ materialId: normalizedMaterialId, userId \}\),/,
	`queryFn: async () => {
			const result = await getMaterialWordsAction({ materialId: normalizedMaterialId, userId })
			return result.success ? result.data : []
		},`
)

fs.writeFileSync(useMaterialWordsPath, useMaterialWordsContent, 'utf8')
console.log('✅ useMaterialWords.js updated\n')

// Fix useFlashcardSession.js
const useFlashcardSessionPath = path.join(__dirname, '..', 'hooks', 'flashcards', 'useFlashcardSession.js')
console.log('📝 Updating useFlashcardSession.js...')

let useFlashcardSessionContent = fs.readFileSync(useFlashcardSessionPath, 'utf8')

// Replace queryFn for getUserWords
useFlashcardSessionContent = useFlashcardSessionContent.replace(
	/queryFn: \(\) => getUserWordsAction\(\{ userId, userLearningLanguage \}\),/g,
	`queryFn: async () => {
			const result = await getUserWordsAction({ userId, userLearningLanguage })
			return result.success ? result.data : []
		},`
)

// Replace queryFn for getMaterialWords
useFlashcardSessionContent = useFlashcardSessionContent.replace(
	/queryFn: \(\) => getMaterialWordsAction\(\{ materialId, userId \}\),/g,
	`queryFn: async () => {
			const result = await getMaterialWordsAction({ materialId, userId })
			return result.success ? result.data : []
		},`
)

fs.writeFileSync(useFlashcardSessionPath, useFlashcardSessionContent, 'utf8')
console.log('✅ useFlashcardSession.js updated\n')

console.log('🎉 All hooks updated successfully!')
console.log('\n📋 Summary:')
console.log('  - Fixed data extraction from Server Actions')
console.log('  - Server Actions now return { success, data } format')
console.log('  - Hooks extract the data array from the response')
