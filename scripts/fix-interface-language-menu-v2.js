const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'components', 'layouts', 'InterfaceLanguageMenu.jsx')

let content = fs.readFileSync(filePath, 'utf-8')

// Use regex to find and replace the router.push line
content = content.replace(
	/router\.push\(router\.asPath,\s*router\.asPath,\s*\{\s*locale:\s*newLocale\s*\}\)/,
	`// Replace current locale in pathname with new locale
		const currentLocale = params.locale || lang
		const newPath = pathname.replace(\`/\${currentLocale}\`, \`/\${newLocale}\`)
		router.push(newPath || \`/\${newLocale}\`)`
)

fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ InterfaceLanguageMenu.jsx fixed for App Router!')
