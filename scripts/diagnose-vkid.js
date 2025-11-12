/**
 * Script de diagnostic pour VK ID
 * Vérifie la configuration et identifie les problèmes potentiels
 *
 * Usage: node scripts/diagnose-vkid.js
 */

require('dotenv').config({ path: '.env.local' })

const REQUIRED_VARS = {
	'NEXT_PUBLIC_VK_APP_ID': 'App ID VK (côté client)',
	'VK_CLIENT_SECRET': 'Client Secret VK (côté serveur)',
	'NEXT_PUBLIC_SUPABASE_URL': 'URL Supabase',
	'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Clé publique Supabase',
	'SUPABASE_SERVICE_ROLE_KEY': 'Clé service Supabase (pour créer des users)'
}

const OPTIONAL_VARS = {
	'NEXT_PUBLIC_SITE_URL': 'URL du site (par défaut: http://localhost:3000)'
}

console.log('\n🔍 Diagnostic de la configuration VK ID\n')
console.log('=' .repeat(60))

// Check required environment variables
console.log('\n✅ Variables d\'environnement requises:\n')

let hasErrors = false

for (const [varName, description] of Object.entries(REQUIRED_VARS)) {
	const value = process.env[varName]
	const status = value ? '✅' : '❌'
	const display = value
		? `${value.substring(0, 10)}...`
		: 'NON DÉFINIE'

	console.log(`${status} ${varName}`)
	console.log(`   Description: ${description}`)
	console.log(`   Valeur: ${display}`)

	if (!value) {
		hasErrors = true
		console.log(`   ⚠️  ERREUR: Cette variable doit être définie dans .env.local`)
	}

	console.log()
}

// Check optional variables
console.log('\n📋 Variables optionnelles:\n')

for (const [varName, description] of Object.entries(OPTIONAL_VARS)) {
	const value = process.env[varName]
	const status = value ? '✅' : 'ℹ️ '
	const display = value || 'Non définie (utilise la valeur par défaut)'

	console.log(`${status} ${varName}`)
	console.log(`   Description: ${description}`)
	console.log(`   Valeur: ${display}`)
	console.log()
}

// Check VK App ID format
console.log('=' .repeat(60))
console.log('\n🔧 Validation du format:\n')

const appId = process.env.NEXT_PUBLIC_VK_APP_ID
if (appId) {
	const isNumeric = /^\d+$/.test(appId)
	if (isNumeric) {
		console.log('✅ NEXT_PUBLIC_VK_APP_ID: Format valide (numérique)')
	} else {
		console.log('❌ NEXT_PUBLIC_VK_APP_ID: Format invalide (doit être numérique)')
		console.log(`   Valeur actuelle: ${appId}`)
		console.log(`   Exemple valide: 54311927`)
		hasErrors = true
	}
} else {
	console.log('⚠️  NEXT_PUBLIC_VK_APP_ID non défini')
}

console.log()

// Generate redirect URLs
console.log('=' .repeat(60))
console.log('\n🔗 URLs de redirection à configurer dans VK ID Console:\n')

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const productionUrl = 'https://www.linguami.com'

console.log('Pour le développement local:')
console.log(`  - ${siteUrl}/auth/callback`)
console.log(`  - http://localhost:3000/auth/callback`)
console.log(`  - http://127.0.0.1:3000/auth/callback`)
console.log()

console.log('Pour la production:')
console.log(`  - ${productionUrl}/auth/callback`)
console.log()

console.log('⚠️  Assurez-vous que TOUTES ces URLs sont ajoutées dans:')
console.log('   VK ID Console > Votre App > Settings > Redirect URIs')
console.log()

// Test VK API connectivity (optional)
console.log('=' .repeat(60))
console.log('\n🌐 Test de connectivité VK API:\n')

async function testVKAPI() {
	try {
		const response = await fetch('https://id.vk.com/oauth2/auth', {
			method: 'HEAD'
		})

		if (response.ok || response.status === 405) {
			// 405 Method Not Allowed is expected for HEAD request
			console.log('✅ VK ID API accessible')
		} else {
			console.log(`⚠️  VK ID API répond avec status: ${response.status}`)
		}
	} catch (error) {
		console.log('❌ Impossible de contacter VK ID API')
		console.log(`   Erreur: ${error.message}`)
		console.log('   Vérifiez votre connexion internet ou firewall')
		hasErrors = true
	}
}

// Check Supabase connectivity
async function testSupabase() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

	if (!supabaseUrl) {
		console.log('⚠️  NEXT_PUBLIC_SUPABASE_URL non défini, skip test')
		return
	}

	try {
		const response = await fetch(`${supabaseUrl}/rest/v1/`, {
			method: 'HEAD',
			headers: {
				'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
			}
		})

		if (response.ok) {
			console.log('✅ Supabase API accessible')
		} else {
			console.log(`⚠️  Supabase API répond avec status: ${response.status}`)
			console.log('   Vérifiez vos clés Supabase')
		}
	} catch (error) {
		console.log('❌ Impossible de contacter Supabase API')
		console.log(`   Erreur: ${error.message}`)
		hasErrors = true
	}
}

// Run connectivity tests
async function runTests() {
	await testVKAPI()
	console.log()

	console.log('🗃️  Test de connectivité Supabase:\n')
	await testSupabase()
	console.log()

	// Summary
	console.log('=' .repeat(60))
	console.log('\n📊 Résumé du diagnostic:\n')

	if (hasErrors) {
		console.log('❌ Des problèmes ont été détectés.')
		console.log('   Veuillez corriger les erreurs ci-dessus avant de tester VK ID.')
		console.log()
		console.log('💡 Actions recommandées:')
		console.log('   1. Vérifiez que toutes les variables sont dans .env.local')
		console.log('   2. Redémarrez le serveur de développement (npm run dev)')
		console.log('   3. Ajoutez les URLs de redirection dans VK ID Console')
		console.log('   4. Relancez ce script: node scripts/diagnose-vkid.js')
		console.log()
		process.exit(1)
	} else {
		console.log('✅ Configuration VK ID valide !')
		console.log()
		console.log('🚀 Prochaines étapes:')
		console.log('   1. Lancez le serveur: npm run dev')
		console.log('   2. Ouvrez: http://localhost:3000/ru/login')
		console.log('   3. Ouvrez la console navigateur (F12)')
		console.log('   4. Cliquez sur le bouton VK ID et observez les logs')
		console.log()
		console.log('📚 Pour plus d\'aide: docs/VKID_LOCAL_TESTING.md')
		console.log()
		process.exit(0)
	}
}

runTests().catch(error => {
	console.error('\n❌ Erreur lors du diagnostic:', error)
	process.exit(1)
})
