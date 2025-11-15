const fs = require('fs')
const path = require('path')

// List of layout components that need migration
const layoutComponents = [
	'components/Layout.jsx',
	'components/layouts/BottomNav.jsx',
	'components/layouts/InterfaceLanguageMenu.jsx',
	'components/layouts/LevelBar.jsx',
]

function migrateComponent(filePath) {
	const fullPath = path.join(__dirname, '..', filePath)

	if (!fs.existsSync(fullPath)) {
		console.log(`⏭️  Skipping ${filePath} (not found)`)
		return
	}

	let content = fs.readFileSync(fullPath, 'utf-8')

	// Check if already migrated
	if (content.includes("from 'next/navigation'")) {
		console.log(`⏭️  Skipping ${filePath} (already migrated)`)
		return
	}

	// Add 'use client' at the top if not already there
	if (!content.startsWith("'use client'") && !content.startsWith('"use client"')) {
		content = `'use client'\n\n${content}`
	}

	// Replace imports
	content = content.replace(
		"import { useRouter } from 'next/router'",
		"import { useRouter as useNextRouter, usePathname, useParams } from 'next/navigation'"
	)

	// For components that only need router.push, keep using useRouter from next/navigation
	// For components that use router.pathname or router.query, we need to adapt

	// Check what router methods are used
	const usesPathname = content.includes('router.pathname')
	const usesQuery = content.includes('router.query')
	const usesAsPath = content.includes('router.asPath')
	const usesLocale = content.includes('router.locale')
	const usesPush = content.includes('router.push')
	const usesReplace = content.includes('router.replace')

	if (usesPathname || usesQuery || usesAsPath || usesLocale) {
		// This component needs more complex migration
		console.log(`⚠️  ${filePath} uses router.pathname, router.query, router.asPath, or router.locale`)
		console.log(`   Manual migration may be required. Creating backup...`)

		// Create backup
		fs.writeFileSync(fullPath + '.backup', content, 'utf-8')

		// Replace router declaration with multiple hooks
		content = content.replace(
			'const router = useRouter()',
			'const router = useNextRouter() // For navigation\n\tconst pathname = usePathname()\n\tconst params = useParams()'
		)

		// Replace router.pathname
		content = content.replace(/router\.pathname/g, 'pathname')

		// Replace router.query with params
		content = content.replace(/router\.query/g, 'params')

		// Add null safety for pathname
		content = content.replace(/pathname\.startsWith\(/g, 'pathname?.startsWith(')
		content = content.replace(/pathname === /g, 'pathname === ')
	} else if (usesPush || usesReplace) {
		// Component only uses navigation methods, simpler migration
		content = content.replace(
			"import { useRouter as useNextRouter, usePathname, useParams } from 'next/navigation'",
			"import { useRouter } from 'next/navigation'"
		)
	}

	// Write the file back
	fs.writeFileSync(fullPath, content, 'utf-8')
	console.log(`✅ Migrated ${filePath}`)
}

console.log('🚀 Migrating layout components to App Router...\n')

layoutComponents.forEach(component => {
	migrateComponent(component)
})

console.log('\n✨ Migration complete!')
