const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'components', 'SEO.jsx')

let content = fs.readFileSync(filePath, 'utf-8')

// Remplacer const { locale } = useTranslation() par const locale = useLocale()
content = content.replace(
	/const\s*\{\s*locale\s*\}\s*=\s*useTranslation\(\)/g,
	'const locale = useLocale()'
)

fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ SEO.jsx fixed!')
