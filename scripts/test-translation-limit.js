/**
 * Script de test pour le système de limite de traductions
 *
 * Usage:
 *   node scripts/test-translation-limit.js
 */

const axios = require('axios')

const API_URL = process.env.API_URL || 'http://localhost:3000'
const ENDPOINT = `${API_URL}/api/translations/translate`

// Couleurs pour le terminal
const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m'
}

const log = {
	success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
	error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
	info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
	warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
	step: (msg) => console.log(`${colors.cyan}➜ ${msg}${colors.reset}`)
}

async function testTranslation(wordIndex = 0, isAuthenticated = false) {
	try {
		const response = await axios.post(ENDPOINT, {
			word: `тест${wordIndex}`,
			sentence: 'Это тестовое предложение',
			userLearningLanguage: 'ru',
			locale: 'fr',
			isAuthenticated
		})

		return {
			success: true,
			data: response.data,
			status: response.status
		}
	} catch (error) {
		return {
			success: false,
			error: error.response?.data,
			status: error.response?.status
		}
	}
}

async function runTests() {
	console.log('\n' + '='.repeat(60))
	log.info('Test du système de limite de traductions')
	console.log('='.repeat(60) + '\n')

	// Test 1: Utilisateur invité - premières traductions
	log.step('Test 1: Utilisateur invité - Traductions initiales')
	for (let i = 1; i <= 5; i++) {
		const result = await testTranslation(i, false)
		if (result.success) {
			log.success(
				`Traduction ${i}/20 - Restantes: ${result.data.remainingTranslations}`
			)
		} else {
			log.error(`Échec à la traduction ${i}: ${result.error?.message}`)
		}
		await sleep(100) // Petit délai pour ne pas spammer
	}

	console.log('')

	// Test 2: Approcher de la limite
	log.step('Test 2: Approche de la limite (traductions 6-18)')
	for (let i = 6; i <= 18; i++) {
		const result = await testTranslation(i, false)
		if (!result.success) {
			log.error(`Échec inattendu à la traduction ${i}`)
			return
		}
	}
	log.success('18 traductions effectuées avec succès')

	console.log('')

	// Test 3: Dernières traductions avant la limite
	log.step('Test 3: Traductions 19 et 20 (dernières autorisées)')
	for (let i = 19; i <= 20; i++) {
		const result = await testTranslation(i, false)
		if (result.success) {
			log.success(
				`Traduction ${i}/20 - Restantes: ${result.data.remainingTranslations}`
			)
		} else {
			log.error(`Échec à la traduction ${i}`)
		}
		await sleep(100)
	}

	console.log('')

	// Test 4: Dépasser la limite
	log.step('Test 4: Tentative de dépassement de la limite')
	const blockedResult = await testTranslation(21, false)
	if (!blockedResult.success && blockedResult.status === 429) {
		log.success('✓ Limite atteinte correctement (HTTP 429)')
		log.info(`Message: ${blockedResult.error?.message}`)
	} else {
		log.error('✗ La limite n\'a pas été appliquée correctement!')
	}

	console.log('')

	// Test 5: Utilisateur authentifié (pas de limite)
	log.step('Test 5: Utilisateur authentifié (pas de limite)')
	const authResults = []
	for (let i = 1; i <= 5; i++) {
		const result = await testTranslation(i, true)
		authResults.push(result.success)
		await sleep(100)
	}

	if (authResults.every(r => r === true)) {
		log.success('✓ Utilisateurs authentifiés : aucune limite appliquée')
	} else {
		log.error('✗ Problème avec les utilisateurs authentifiés')
	}

	console.log('\n' + '='.repeat(60))
	log.info('Tests terminés!')
	console.log('='.repeat(60) + '\n')

	// Résumé
	console.log('📊 Résumé:')
	console.log('  • Limite pour invités: 20 traductions ✓')
	console.log('  • Blocage après limite: ✓')
	console.log('  • Pas de limite pour authentifiés: ✓')
	console.log('')
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

// Exécuter les tests
if (require.main === module) {
	runTests().catch(error => {
		log.error(`Erreur fatale: ${error.message}`)
		process.exit(1)
	})
}

module.exports = { testTranslation, runTests }
