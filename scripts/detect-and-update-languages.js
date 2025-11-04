/**
 * Script pour détecter et mettre à jour automatiquement la langue des materials
 * Basé sur l'analyse du contenu (body)
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('❌ Erreur: Variables d\'environnement manquantes')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Caractères spécifiques pour détecter les langues
const LANGUAGE_PATTERNS = {
	ru: /[а-яёА-ЯЁ]/,  // Cyrillique
	fr: /[àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]/,  // Accents français
	en: /^[a-zA-Z\s\d\.,;:?!'"\-–—()]+$/  // Seulement caractères latins de base
}

function detectLanguage(text) {
	if (!text) return null

	// Enlever ponctuation et espaces pour l'analyse
	const cleanText = text.substring(0, 500) // Analyser les 500 premiers caractères

	// Vérifier russe (cyrillique)
	if (LANGUAGE_PATTERNS.ru.test(cleanText)) {
		return 'ru'
	}

	// Vérifier français (accents spécifiques)
	if (LANGUAGE_PATTERNS.fr.test(cleanText)) {
		return 'fr'
	}

	// Par défaut, considérer comme anglais
	return 'en'
}

async function detectAndUpdateLanguages() {
	try {
		console.log('🔍 Détection automatique des langues...\n')

		// Récupérer tous les materials
		const { data: materials, error } = await supabase
			.from('materials')
			.select('id, title, section, lang, body')

		if (error) throw error

		console.log(`📊 ${materials.length} materials à analyser\n`)

		let needsUpdateCount = 0
		let updates = []

		// Analyser chaque material
		for (const material of materials) {
			const detectedLang = detectLanguage(material.body)
			const currentLang = material.lang

			if (detectedLang !== currentLang) {
				needsUpdateCount++
				updates.push({
					id: material.id,
					title: material.title,
					currentLang: currentLang || 'null',
					detectedLang,
				})
			}
		}

		console.log(`📋 ${needsUpdateCount} materials nécessitent une mise à jour\n`)

		if (needsUpdateCount === 0) {
			console.log('✅ Toutes les langues sont déjà correctement détectées!')
			return
		}

		// Afficher un aperçu
		console.log('📋 Aperçu des changements (premiers 10):\n')
		updates.slice(0, 10).forEach(u => {
			console.log(`   ID ${u.id}: ${u.title}`)
			console.log(`      ${u.currentLang} → ${u.detectedLang}`)
		})

		console.log(`\n📊 Résumé des changements:`)
		const changesSummary = updates.reduce((acc, u) => {
			const key = `${u.currentLang} → ${u.detectedLang}`
			acc[key] = (acc[key] || 0) + 1
			return acc
		}, {})
		Object.entries(changesSummary).forEach(([change, count]) => {
			console.log(`   ${change}: ${count}`)
		})

		console.log('\n🔄 Début de la mise à jour...\n')

		let successCount = 0
		let errorCount = 0

		for (const update of updates) {
			const { error } = await supabase
				.from('materials')
				.update({ lang: update.detectedLang })
				.eq('id', update.id)

			if (error) {
				console.error(`❌ Erreur pour material ID ${update.id}:`, error.message)
				errorCount++
			} else {
				successCount++
			}

			// Progression
			if (successCount % 50 === 0) {
				console.log(`   Progression: ${successCount}/${needsUpdateCount}`)
			}
		}

		console.log('\n✅ Mise à jour terminée!')
		console.log(`   ✅ Succès: ${successCount}`)
		if (errorCount > 0) {
			console.log(`   ❌ Erreurs: ${errorCount}`)
		}

		// Afficher la nouvelle distribution
		console.log('\n📈 Nouvelle distribution par langue:')
		const { data: updatedMaterials, error: fetchError } = await supabase
			.from('materials')
			.select('lang')

		if (!fetchError) {
			const newDistribution = updatedMaterials.reduce((acc, m) => {
				const lang = m.lang || 'null'
				acc[lang] = (acc[lang] || 0) + 1
				return acc
			}, {})
			Object.entries(newDistribution).forEach(([lang, count]) => {
				const percentage = ((count / updatedMaterials.length) * 100).toFixed(1)
				console.log(`   ${lang}: ${count} (${percentage}%)`)
			})
		}

		console.log('\n🎉 Détection terminée!')
		console.log('💡 Rafraîchissez votre page pour voir tous les materials.\n')

	} catch (error) {
		console.error('❌ Erreur:', error.message)
		process.exit(1)
	}
}

detectAndUpdateLanguages()
