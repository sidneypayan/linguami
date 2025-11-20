const fs = require('fs')
const path = require('path')

console.log('🔧 Fixing hook imports...\n')

// Fix useMaterialWords.js
const useMaterialWordsPath = path.join(__dirname, '..', 'hooks', 'words', 'useMaterialWords.js')
console.log('📝 Updating useMaterialWords.js...')

let useMaterialWordsContent = fs.readFileSync(useMaterialWordsPath, 'utf8')
useMaterialWordsContent = useMaterialWordsContent.replace(
	"import { getMaterialWords } from '@/lib/words-client'",
	"import { getMaterialWordsAction } from '@/app/actions/words'"
)
useMaterialWordsContent = useMaterialWordsContent.replace(/getMaterialWords\(/g, 'getMaterialWordsAction(')

fs.writeFileSync(useMaterialWordsPath, useMaterialWordsContent, 'utf8')
console.log('✅ useMaterialWords.js updated\n')

// Fix useFlashcardSession.js
const useFlashcardSessionPath = path.join(__dirname, '..', 'hooks', 'flashcards', 'useFlashcardSession.js')
console.log('📝 Updating useFlashcardSession.js...')

let useFlashcardSessionContent = fs.readFileSync(useFlashcardSessionPath, 'utf8')
useFlashcardSessionContent = useFlashcardSessionContent.replace(
	"import { getUserWords, getMaterialWords } from '@/lib/words-client'",
	"import { getUserWordsAction, getMaterialWordsAction } from '@/app/actions/words'"
)
useFlashcardSessionContent = useFlashcardSessionContent.replace(/getUserWords\(/g, 'getUserWordsAction(')
useFlashcardSessionContent = useFlashcardSessionContent.replace(/getMaterialWords\(/g, 'getMaterialWordsAction(')

fs.writeFileSync(useFlashcardSessionPath, useFlashcardSessionContent, 'utf8')
console.log('✅ useFlashcardSession.js updated\n')

console.log('🎉 All hook files updated successfully!')
