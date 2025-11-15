const fs = require('fs')
const path = require('path')

const navbarPath = path.join(__dirname, '..', 'components', 'layouts', 'Navbar.jsx')

// Read the file
let content = fs.readFileSync(navbarPath, 'utf-8')

// Fix missing quote on line with "if (href === '/') return pathname === '/"
content = content.replace(
	"if (href === '/') return pathname === '/",
	"if (href === '/') return pathname === '/'"
)

// Add null check in isOnLessonPage
content = content.replace(
	'const isOnLessonPage = () => {\n\t\tconst pathSegments = pathname.split',
	'const isOnLessonPage = () => {\n\t\tif (!pathname) return false\n\t\tconst pathSegments = pathname.split'
)

// Write the file back
fs.writeFileSync(navbarPath, content, 'utf-8')

console.log('✅ Navbar.jsx final fixes applied successfully!')
