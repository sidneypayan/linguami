const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'components', 'layouts', 'InterfaceLanguageMenu.jsx')

let content = fs.readFileSync(filePath, 'utf-8')

// Replace router.push with App Router compatible code
// The old code: router.push(router.asPath, router.asPath, { locale: newLocale })
// The new code should construct the new URL with the new locale

const oldCode = `\t\t// Changer la locale de Next.js
\t\trouter.push(router.asPath, router.asPath, { locale: newLocale })`

const newCode = `\t\t// Changer la locale de Next.js (App Router)
\t\t// Replace current locale in pathname with new locale
\t\tconst currentLocale = params.locale || lang
\t\tconst newPath = pathname.replace(\`/\${currentLocale}\`, \`/\${newLocale}\`)
\t\trouter.push(newPath || \`/\${newLocale}\`)`

content = content.replace(oldCode, newCode)

fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ InterfaceLanguageMenu.jsx fixed for App Router!')
