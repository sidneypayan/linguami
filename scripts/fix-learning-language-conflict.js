/**
 * Script pour corriger les profils où learning_language === spoken_language
 *
 * Ce bug ne devrait jamais arriver, mais peut se produire si :
 * - Anciennes données migrées
 * - Modification manuelle de la DB
 * - Bug dans le code
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

/**
 * Get default learning language based on spoken language
 */
function getDefaultLearningLanguage(spokenLang) {
	if (spokenLang === 'fr') return 'ru'
	if (spokenLang === 'ru') return 'fr'
	if (spokenLang === 'en') return 'fr'
	return 'fr' // Fallback
}

async function fixConflicts() {
	console.log('🔍 Recherche des profils avec learning_language === spoken_language\n')

	try {
		// Récupérer tous les profils
		const { data: profiles, error } = await supabase
			.from('users_profile')
			.select('id, email, learning_language, spoken_language')

		if (error) {
			console.error('❌ Erreur lors de la récupération des profils:', error)
			return
		}

		// Filtrer les profils avec conflit
		const conflicts = profiles.filter(p => {
			const learning = p.learning_language
			const spoken = p.spoken_language

			// Problème si les deux sont identiques
			if (learning && spoken && learning === spoken) {
				return true
			}

			// Problème aussi si learning_language n'est pas défini
			if (!learning) {
				return true
			}

			return false
		})

		if (conflicts.length === 0) {
			console.log('✅ Aucun conflit trouvé !\n')
			return
		}

		console.log(`⚠️  ${conflicts.length} profil(s) avec conflit trouvé(s):\n`)

		conflicts.forEach((profile, index) => {
			const learning = profile.learning_language || 'NON DÉFINI'
			const spoken = profile.spoken_language || 'NON DÉFINI'
			console.log(`${index + 1}. Email: ${profile.email || profile.id}`)
			console.log(`   Learning: ${learning}`)
			console.log(`   Spoken: ${spoken}\n`)
		})

		// Demander confirmation
		const userEmail = process.argv[2]
		const autoFix = process.argv[3] === '--fix'

		if (!autoFix) {
			console.log('\n💡 Pour corriger automatiquement un utilisateur spécifique:')
			console.log('   node scripts/fix-learning-language-conflict.js <email> --fix')
			console.log('\nExemple:')
			console.log('   node scripts/fix-learning-language-conflict.js user@example.com --fix\n')
			return
		}

		if (!userEmail) {
			console.error('❌ Email requis pour --fix')
			console.log('Usage: node scripts/fix-learning-language-conflict.js <email> --fix')
			return
		}

		// Trouver le profil à corriger
		const profileToFix = conflicts.find(p => p.email === userEmail || p.id === userEmail)

		if (!profileToFix) {
			console.error(`❌ Profil non trouvé pour: ${userEmail}`)
			return
		}

		console.log(`\n🔧 Correction du profil: ${profileToFix.email || profileToFix.id}`)

		const spokenLang = profileToFix.spoken_language || 'fr'
		const correctLearningLang = getDefaultLearningLanguage(spokenLang)

		console.log(`   Spoken Language: ${spokenLang}`)
		console.log(`   Nouvelle Learning Language: ${correctLearningLang}`)

		// Mettre à jour le profil
		const { data: updated, error: updateError } = await supabase
			.from('users_profile')
			.update({ learning_language: correctLearningLang })
			.eq('id', profileToFix.id)
			.select()

		if (updateError) {
			console.error('❌ Erreur lors de la mise à jour:', updateError)
			return
		}

		console.log('✅ Profil corrigé avec succès !\n')

		// Vérifier que les mots existent pour cette langue
		console.log('🔍 Vérification des mots dans user_words...')

		const { data: words, error: wordsError } = await supabase
			.from('user_words')
			.select('id, word_lang')
			.eq('user_id', profileToFix.id)

		if (wordsError) {
			console.error('⚠️  Erreur lors de la récupération des mots:', wordsError)
			return
		}

		if (!words || words.length === 0) {
			console.log('   ℹ️  Aucun mot trouvé pour cet utilisateur\n')
			return
		}

		// Compter les mots par langue
		const wordsByLang = {}
		words.forEach(word => {
			const lang = word.word_lang || 'NULL'
			wordsByLang[lang] = (wordsByLang[lang] || 0) + 1
		})

		console.log(`   Total mots: ${words.length}`)
		console.log(`   Répartition:`)
		Object.entries(wordsByLang).forEach(([lang, count]) => {
			const match = lang === correctLearningLang ? '✅' : '⚠️'
			console.log(`      ${match} ${lang}: ${count} mot(s)`)
		})

		const wordsForNewLang = wordsByLang[correctLearningLang] || 0
		if (wordsForNewLang === 0 && words.length > 0) {
			console.log(`\n⚠️  ATTENTION: Aucun mot avec word_lang='${correctLearningLang}'`)
			console.log(`   L'utilisateur verra toujours un dictionnaire vide !`)
			console.log(`\n💡 Solutions possibles:`)
			console.log(`   1. Changer learning_language pour correspondre aux mots existants`)
			console.log(`   2. Ou corriger word_lang des mots existants`)
		} else {
			console.log(`\n✅ ${wordsForNewLang} mot(s) disponible(s) pour la langue ${correctLearningLang}`)
		}

		console.log('\n✅ Correction terminée')

	} catch (error) {
		console.error('❌ Erreur:', error)
	}
}

fixConflicts()
