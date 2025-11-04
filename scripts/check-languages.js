/**
 * Script pour vérifier la distribution des langues dans les materials
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

async function checkLanguages() {
	try {
		console.log('🔍 Analyse des langues dans les materials...\n')

		// Récupérer tous les materials
		const { data: materials, error } = await supabase
			.from('materials')
			.select('id, title, section, lang')

		if (error) throw error

		console.log(`📊 Total de materials: ${materials.length}\n`)

		// Compter par langue
		const byLang = materials.reduce((acc, m) => {
			const lang = m.lang || 'null'
			acc[lang] = (acc[lang] || 0) + 1
			return acc
		}, {})

		console.log('📈 Distribution par langue:')
		Object.entries(byLang).forEach(([lang, count]) => {
			const percentage = ((count / materials.length) * 100).toFixed(1)
			console.log(`   ${lang}: ${count} (${percentage}%)`)
		})

		// Compter par section et langue
		console.log('\n📊 Distribution par section:')
		const sections = [...new Set(materials.map(m => m.section))]
		sections.forEach(section => {
			const sectionMaterials = materials.filter(m => m.section === section)
			const sectionByLang = sectionMaterials.reduce((acc, m) => {
				const lang = m.lang || 'null'
				acc[lang] = (acc[lang] || 0) + 1
				return acc
			}, {})

			console.log(`\n   ${section}: ${sectionMaterials.length} total`)
			Object.entries(sectionByLang).forEach(([lang, count]) => {
				console.log(`      - ${lang}: ${count}`)
			})
		})

		// Exemples de materials en anglais
		const enMaterials = materials.filter(m => m.lang === 'en')
		if (enMaterials.length > 0) {
			console.log('\n📝 Exemples de materials en anglais:')
			enMaterials.slice(0, 5).forEach(m => {
				console.log(`   - ID ${m.id}: ${m.title} (${m.section})`)
			})
		} else {
			console.log('\n⚠️  Aucun material en anglais trouvé!')
		}

		// Exemples de materials dialogues
		const dialogues = materials.filter(m => m.section === 'dialogues')
		console.log(`\n📝 Dialogues (${dialogues.length} total):`)
		const dialoguesByLang = dialogues.reduce((acc, m) => {
			const lang = m.lang || 'null'
			acc[lang] = (acc[lang] || 0) + 1
			return acc
		}, {})
		Object.entries(dialoguesByLang).forEach(([lang, count]) => {
			console.log(`   - ${lang}: ${count}`)
		})

	} catch (error) {
		console.error('❌ Erreur:', error.message)
		process.exit(1)
	}
}

checkLanguages()
