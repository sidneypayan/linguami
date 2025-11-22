/**
 * Script de diagnostic pour le problème de dictionnaire vide en prod
 *
 * Ce script vérifie :
 * 1. L'utilisateur et son profil (avec learning_language)
 * 2. Les mots dans user_words et leur word_lang
 * 3. Le filtrage qui s'applique dans DictionaryClient
 */

require('dotenv').config({ path: '.env.production' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('❌ Missing Supabase credentials in .env.production')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function diagnose() {
	console.log('🔍 Diagnostic du dictionnaire en production\n')

	// Demander l'email de l'utilisateur (vous pouvez le changer)
	const userEmail = process.argv[2]
	if (!userEmail) {
		console.log('Usage: node scripts/diagnose-dictionary-prod.js <email>')
		console.log('Exemple: node scripts/diagnose-dictionary-prod.js user@example.com')
		process.exit(1)
	}

	try {
		// 1. Trouver l'utilisateur par email
		console.log(`📧 Recherche de l'utilisateur: ${userEmail}`)
		const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

		if (authError) {
			console.error('❌ Erreur lors de la récupération des utilisateurs:', authError)
			return
		}

		const user = authUsers.users.find(u => u.email === userEmail)
		if (!user) {
			console.error(`❌ Utilisateur non trouvé: ${userEmail}`)
			return
		}

		console.log(`✅ Utilisateur trouvé:`)
		console.log(`   ID: ${user.id}`)
		console.log(`   Email: ${user.email}`)
		console.log(`   Created: ${user.created_at}\n`)

		// 2. Récupérer le profil utilisateur
		console.log('👤 Profil utilisateur:')
		const { data: profile, error: profileError } = await supabase
			.from('users_profile')
			.select('*')
			.eq('id', user.id)
			.maybeSingle()

		if (profileError) {
			console.error('❌ Erreur profil:', profileError)
			return
		}

		if (!profile) {
			console.log('⚠️  Aucun profil trouvé dans users_profile')
		} else {
			console.log(`   Learning Language: ${profile.learning_language || 'NON DÉFINI'}`)
			console.log(`   Spoken Language: ${profile.spoken_language || 'NON DÉFINI'}`)
			console.log(`   Role: ${profile.role || 'user'}`)
			console.log(`   Premium: ${profile.is_premium ? 'Oui' : 'Non'}\n`)
		}

		// 3. Récupérer TOUS les mots de l'utilisateur
		console.log('📚 Mots dans user_words:')
		const { data: allWords, error: wordsError } = await supabase
			.from('user_words')
			.select('id, word_ru, word_fr, word_en, word_lang, word_sentence, created_at')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false })

		if (wordsError) {
			console.error('❌ Erreur lors de la récupération des mots:', wordsError)
			return
		}

		if (!allWords || allWords.length === 0) {
			console.log('⚠️  Aucun mot trouvé dans user_words pour cet utilisateur\n')
			console.log('🔍 Suggestions:')
			console.log('   1. Vérifier que les mots ont bien été ajoutés en production')
			console.log('   2. Vérifier que le user_id correspond bien')
			return
		}

		console.log(`   Total de mots: ${allWords.length}`)
		console.log(`\n   Répartition par word_lang:`)

		const langCount = {}
		allWords.forEach(word => {
			const lang = word.word_lang || 'NULL'
			langCount[lang] = (langCount[lang] || 0) + 1
		})

		Object.entries(langCount).forEach(([lang, count]) => {
			console.log(`   - ${lang}: ${count} mot(s)`)
		})

		// 4. Afficher les premiers mots pour chaque langue
		console.log(`\n   Exemple de mots:`)
		const languages = ['ru', 'fr', 'en']
		languages.forEach(lang => {
			const wordsForLang = allWords.filter(w => w.word_lang === lang).slice(0, 3)
			if (wordsForLang.length > 0) {
				console.log(`\n   📖 Langue: ${lang}`)
				wordsForLang.forEach(word => {
					console.log(`      - RU: ${word.word_ru || '—'}`)
					console.log(`        FR: ${word.word_fr || '—'}`)
					console.log(`        EN: ${word.word_en || '—'}`)
					console.log(`        Sentence: ${word.word_sentence || '—'}`)
					console.log(`        Created: ${new Date(word.created_at).toLocaleString()}\n`)
				})
			}
		})

		// 5. Simuler le filtrage du DictionaryClient
		console.log('\n🔬 Simulation du filtrage DictionaryClient:')
		const learningLang = profile?.learning_language || 'fr'
		console.log(`   Learning Language (userLearningLanguage): ${learningLang}`)

		// Tester pour chaque locale
		const locales = ['fr', 'ru', 'en']
		locales.forEach(locale => {
			console.log(`\n   📍 Locale: ${locale}`)

			// Même filtrage que dans DictionaryClient (ligne 144-160)
			const filtered = allWords.filter(word => {
				// Ne pas afficher si learning === locale
				if (learningLang === locale) return false

				const sourceWord = word[`word_${learningLang}`]
				const translation = word[`word_${locale}`]

				// N'afficher que les mots qui ont à la fois le mot source ET la traduction
				return sourceWord && translation
			})

			console.log(`      Mots filtrés affichés: ${filtered.length}`)
			if (filtered.length > 0) {
				console.log(`      Exemple:`)
				const example = filtered[0]
				console.log(`      - Source (${learningLang}): ${example[`word_${learningLang}`]}`)
				console.log(`      - Traduction (${locale}): ${example[`word_${locale}`]}`)
			} else if (learningLang === locale) {
				console.log(`      ⚠️  Pas de mots affichés car learning_language === locale`)
			} else {
				console.log(`      ⚠️  Pas de mots avec source ET traduction valides`)
			}
		})

		// 6. Diagnostic et recommandations
		console.log('\n\n📋 DIAGNOSTIC:')
		console.log('─'.repeat(60))

		if (!profile?.learning_language) {
			console.log('⚠️  PROBLÈME TROUVÉ: learning_language n\'est pas défini dans users_profile')
			console.log('   → Le système utilisera getDefaultLearningLanguage(locale)')
			console.log('   → Cela peut causer des problèmes de filtrage')
			console.log('\n💡 SOLUTION:')
			console.log('   Définir explicitement learning_language dans le profil utilisateur')
		}

		const currentLearningLang = profile?.learning_language || 'NON DÉFINI'
		const wordsForLearningLang = allWords.filter(w => w.word_lang === currentLearningLang)

		if (wordsForLearningLang.length === 0 && allWords.length > 0) {
			console.log(`⚠️  PROBLÈME TROUVÉ: Aucun mot avec word_lang='${currentLearningLang}'`)
			console.log(`   Mais ${allWords.length} mot(s) existent avec d'autres word_lang`)
			console.log('\n💡 SOLUTIONS POSSIBLES:')
			console.log('   1. Changer learning_language dans le profil pour correspondre aux mots existants')
			console.log('   2. Ou corriger word_lang des mots existants')
			console.log(`\n   Langues disponibles dans les mots: ${Object.keys(langCount).join(', ')}`)
		}

		// Vérifier si des mots manquent de traductions
		const missingTranslations = allWords.filter(word => {
			const hasRu = !!word.word_ru
			const hasFr = !!word.word_fr
			const hasEn = !!word.word_en
			const count = [hasRu, hasFr, hasEn].filter(Boolean).length
			return count < 2 // Au moins 2 langues nécessaires pour afficher
		})

		if (missingTranslations.length > 0) {
			console.log(`\n⚠️  PROBLÈME TROUVÉ: ${missingTranslations.length} mot(s) avec moins de 2 traductions`)
			console.log('   Ces mots ne seront PAS affichés dans le dictionnaire')
			console.log('\n💡 SOLUTION:')
			console.log('   Ajouter les traductions manquantes pour ces mots')
		}

		console.log('\n✅ Diagnostic terminé')

	} catch (error) {
		console.error('❌ Erreur:', error)
	}
}

diagnose()
