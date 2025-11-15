const fs = require('fs')
const path = require('path')

const navbarPath = path.join(__dirname, '..', 'components', 'layouts', 'Navbar.jsx')

// Read the file
let content = fs.readFileSync(navbarPath, 'utf-8')

// Add null check in isOnLessonPage - using a more flexible regex
content = content.replace(
	/(const isOnLessonPage = \(\) => \{)\s*(const pathSegments)/,
	'$1\n\t\tif (!pathname) return false\n\t\t$2'
)

// Write the file back
fs.writeFileSync(navbarPath, content, 'utf-8')

console.log('✅ Navbar.jsx null check added successfully!')
