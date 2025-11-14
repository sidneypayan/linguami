const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../app/[locale]/privacy/page.js')
let content = fs.readFileSync(filePath, 'utf8')

// Add useState and useEffect imports
content = content.replace(
	"import useTranslation from 'next-translate/useTranslation'",
	"import useTranslation from 'next-translate/useTranslation'\nimport { useState, useEffect } from 'react'"
)

// Add state for formatted date
content = content.replace(
	'const isDark = theme.palette.mode === \'dark\'',
	`const isDark = theme.palette.mode === 'dark'
	const [formattedDate, setFormattedDate] = useState('')

	// Generate date only on client to avoid hydration mismatch
	useEffect(() => {
		setFormattedDate(new Date().toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}))
	}, [])`
)

// Replace the date display
content = content.replace(
	/\{t\('last_updated'\)\} \{new Date\(\)\.toLocaleDateString\('fr-FR', \{[\s\S]*?\}\)\}/,
	"{t('last_updated')} {formattedDate}"
)

fs.writeFileSync(filePath, content, 'utf8')
console.log('✅ Privacy page hydration fixed')
