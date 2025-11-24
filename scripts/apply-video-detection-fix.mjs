// Script pour appliquer le fix de détection des vidéos avec embedding désactivé

import fs from 'fs'

const filePath = 'D:/linguami/app/actions/admin.js'

console.log('🔧 Applying video detection fix...\n')

// Read the file
let content = fs.readFileSync(filePath, 'utf8')

// Find the section to replace (after playabilityStatus check, before "Indicateurs de vidéo indisponible")
const oldCode = `\t\t\t}
\t\t}

\t\t\t// Indicateurs de vidéo indisponible`

const newCode = `\t\t\t}
\t\t}

\t\t\t// AMÉLIORATION: Détecter les vidéos avec embedding désactivé
\t\t\t// previewPlayabilityStatus est présent UNIQUEMENT quand il y a une erreur d'embedding
\t\t\tif (html.includes('"previewPlayabilityStatus"') && html.includes('"status":"ERROR"')) {
\t\t\t\treturn 'broken'
\t\t\t}

\t\t\t// Indicateurs de vidéo indisponible`

if (content.includes(oldCode)) {
	content = content.replace(oldCode, newCode)
	console.log('✅ Added previewPlayabilityStatus check')
} else {
	console.log('⚠️  Could not find exact match for insertion point')
	console.log('Searching for alternative pattern...')

	// Try alternative pattern
	const altOld = `\t\t}

\t\t// Indicateurs de vidéo indisponible`
	const altNew = `\t\t}

\t\t// AMÉLIORATION: Détecter les vidéos avec embedding désactivé
\t\t// previewPlayabilityStatus est présent UNIQUEMENT quand il y a une erreur d'embedding
\t\tif (html.includes('"previewPlayabilityStatus"') && html.includes('"status":"ERROR"')) {
\t\t\treturn 'broken'
\t\t}

\t\t// Indicateurs de vidéo indisponible`

	if (content.includes(altOld)) {
		content = content.replace(altOld, altNew)
		console.log('✅ Added previewPlayabilityStatus check (alternative pattern)')
	} else {
		console.log('❌ Could not apply fix automatically')
		process.exit(1)
	}
}

// Remove the errorScreen check that causes false positives
// (errorScreen is present even in working videos)
const errorScreenLine = `\t\t\t\thtml.includes('errorScreen') || // Détecte l'erreur 153 (embedding désactivé)\n`

if (content.includes(errorScreenLine)) {
	content = content.replace(errorScreenLine, '')
	console.log('✅ Removed errorScreen check (causes false positives)')
} else {
	console.log('⚠️  errorScreen check not found (may have been already removed)')
}

// Write back
fs.writeFileSync(filePath, content, 'utf8')
console.log('\n💾 File updated successfully!')

console.log('\n📋 Summary of changes:')
console.log('  1. Added check for "previewPlayabilityStatus" with "status":"ERROR"')
console.log('  2. This detects videos with embedding disabled by owner')
console.log('  3. Removed errorScreen check that caused false positives')

console.log('\n✅ Done! The script now correctly detects:')
console.log('  - Videos with embedding disabled (Error 153)')
console.log('  - Private/unavailable videos')
console.log('  - Region-blocked videos')
console.log('  - etc.')
