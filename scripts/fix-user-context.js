const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../context/user.js')
let content = fs.readFileSync(filePath, 'utf8')

// Remplacer l'import de useRouter
content = content.replace(
	"import { useRouter } from 'next/router'",
	"import { useRouterCompat } from '@/hooks/useRouterCompat'"
)

// Remplacer l'utilisation de useRouter
content = content.replace(
	'const router = useRouter()',
	'const router = useRouterCompat()'
)

fs.writeFileSync(filePath, content, 'utf8')
console.log('✅ UserContext updated successfully')
