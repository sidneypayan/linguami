const fs = require('fs')
const path = require('path')

const navbarPath = path.join(__dirname, '..', 'components', 'layouts', 'Navbar.jsx')

// Read the file
let content = fs.readFileSync(navbarPath, 'utf-8')

// Add 'use client' at the top
if (!content.startsWith("'use client'")) {
	content = `'use client'\n\n${content}`
}

// Replace imports
content = content.replace(
	"import { useRouter } from 'next/router'",
	"import { usePathname, useParams } from 'next/navigation'"
)

// Replace router declaration
content = content.replace(
	'const router = useRouter()',
	'const pathname = usePathname()\n\tconst params = useParams()'
)

// Replace router.pathname
content = content.replace(/router\.pathname/g, 'pathname')

// Replace router.query.material and router.query.slug
content = content.replace(/router\.query\.material/g, 'params?.material')
content = content.replace(/router\.query\.slug/g, 'params?.slug')

// Add null checks for pathname
content = content.replace(
	'if (href === \'/\') return pathname === \'/\'',
	'if (href === \'/\') return pathname === \'/'
)
content = content.replace(
	'return pathname.startsWith(href)',
	'return pathname?.startsWith(href)'
)

// Fix isOnLessonPage function
content = content.replace(
	'const isOnLessonPage = () => {\n\t\tconst pathSegments = pathname.split(\'/\').filter(Boolean)',
	'const isOnLessonPage = () => {\n\t\tif (!pathname) return false\n\t\tconst pathSegments = pathname.split(\'/\').filter(Boolean)'
)

// Write the file back
fs.writeFileSync(navbarPath, content, 'utf-8')

console.log('✅ Navbar.jsx migrated to App Router successfully!')
