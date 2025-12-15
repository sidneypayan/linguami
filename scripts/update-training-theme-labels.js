/**
 * Script to update training_themes table with missing labels (ru/en)
 * Uses the defaultThemes from TrainingAdminClient as reference
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') })

// Default themes with all labels (from TrainingAdminClient.jsx)
const defaultThemes = {
	ru: {
		beginner: [
			{ key: 'greetings', icon: '👋', label_fr: 'Salutations', label_en: 'Greetings', label_ru: 'Приветствия' },
			{ key: 'numbers', icon: '🔢', label_fr: 'Nombres', label_en: 'Numbers', label_ru: 'Числа' },
			{ key: 'family', icon: '👨‍👩‍👧‍👦', label_fr: 'Famille', label_en: 'Family', label_ru: 'Семья' },
			{ key: 'food', icon: '🍎', label_fr: 'Nourriture', label_en: 'Food', label_ru: 'Еда' },
			{ key: 'colors', icon: '🎨', label_fr: 'Couleurs', label_en: 'Colors', label_ru: 'Цвета' },
			{ key: 'animals', icon: '🐾', label_fr: 'Animaux', label_en: 'Animals', label_ru: 'Животные' },
			{ key: 'body', icon: '🫀', label_fr: 'Corps humain', label_en: 'Body parts', label_ru: 'Части тела' },
			{ key: 'clothes', icon: '👕', label_fr: 'Vetements', label_en: 'Clothes', label_ru: 'Одежда' },
			{ key: 'time', icon: '🕐', label_fr: 'Temps', label_en: 'Time', label_ru: 'Время' },
			{ key: 'days', icon: '📅', label_fr: 'Jours et mois', label_en: 'Days & months', label_ru: 'Дни и месяцы' },
			{ key: 'places', icon: '🏪', label_fr: 'Lieux', label_en: 'Places', label_ru: 'Места' },
			{ key: 'professions', icon: '👨‍⚕️', label_fr: 'Metiers', label_en: 'Professions', label_ru: 'Профессии' },
			{ key: 'house', icon: '🛋️', label_fr: 'Maison', label_en: 'House', label_ru: 'Дом' },
			{ key: 'transport', icon: '🚌', label_fr: 'Transports', label_en: 'Transport', label_ru: 'Транспорт' },
			{ key: 'verbs', icon: '🏃', label_fr: 'Verbes courants', label_en: 'Common verbs', label_ru: 'Общие глаголы' },
			{ key: 'adjectives', icon: '✨', label_fr: 'Adjectifs', label_en: 'Adjectives', label_ru: 'Прилагательные' },
			{ key: 'weather', icon: '☀️', label_fr: 'Meteo', label_en: 'Weather', label_ru: 'Погода' },
			{ key: 'emotions', icon: '😊', label_fr: 'Emotions', label_en: 'Emotions', label_ru: 'Эмоции' },
			{ key: 'hobbies', icon: '⚽', label_fr: 'Loisirs', label_en: 'Hobbies', label_ru: 'Хобби' },
			{ key: 'school', icon: '📚', label_fr: 'Ecole', label_en: 'School', label_ru: 'Школа' },
			{ key: 'nature', icon: '🌳', label_fr: 'Nature', label_en: 'Nature', label_ru: 'Природа' },
			{ key: 'drinks', icon: '🥤', label_fr: 'Boissons', label_en: 'Drinks', label_ru: 'Напитки' },
		],
		intermediate: [
			{ key: 'travel', icon: '✈️', label_fr: 'Voyages', label_en: 'Travel', label_ru: 'Путешествия' },
			{ key: 'work', icon: '💼', label_fr: 'Travail', label_en: 'Work', label_ru: 'Работа' },
			{ key: 'health', icon: '🏥', label_fr: 'Sante', label_en: 'Health', label_ru: 'Здоровье' },
			{ key: 'hobbies', icon: '🎸', label_fr: 'Loisirs', label_en: 'Hobbies', label_ru: 'Хобби' },
			{ key: 'home', icon: '🏠', label_fr: 'Maison', label_en: 'Home', label_ru: 'Дом' },
			{ key: 'weather', icon: '🌤️', label_fr: 'Meteo', label_en: 'Weather', label_ru: 'Погода' },
		],
		advanced: [
			{ key: 'politics', icon: '🏛️', label_fr: 'Politique', label_en: 'Politics', label_ru: 'Политика' },
			{ key: 'business', icon: '📊', label_fr: 'Affaires', label_en: 'Business', label_ru: 'Бизнес' },
			{ key: 'science', icon: '🔬', label_fr: 'Sciences', label_en: 'Science', label_ru: 'Наука' },
			{ key: 'culture', icon: '🎭', label_fr: 'Culture', label_en: 'Culture', label_ru: 'Культура' },
			{ key: 'emotions', icon: '💭', label_fr: 'Emotions', label_en: 'Emotions', label_ru: 'Эмоции' },
			{ key: 'idioms', icon: '📚', label_fr: 'Expressions', label_en: 'Idioms', label_ru: 'Идиомы' },
		],
	},
}

// Create Supabase client for PROD DB
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL
const supabaseKey = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('❌ Missing PROD credentials in .env.local:')
	console.error('   - NEXT_PUBLIC_SUPABASE_PROD_URL')
	console.error('   - SUPABASE_PROD_SERVICE_ROLE_KEY')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: { persistSession: false }
})

console.log('🔗 Connected to PROD DB:', supabaseUrl)

// Build lookup map from defaultThemes
const themesLookup = {}
Object.entries(defaultThemes).forEach(([lang, levels]) => {
	Object.entries(levels).forEach(([level, themes]) => {
		themes.forEach(theme => {
			const key = `${lang}-${level}-${theme.key}`
			themesLookup[key] = theme
		})
	})
})

async function updateThemeLabels() {
	console.log('\n📚 Fetching all themes from training_themes...\n')

	// Get all themes from DB
	const { data: dbThemes, error } = await supabase
		.from('training_themes')
		.select('*')
		.order('lang')
		.order('level')
		.order('key')

	if (error) {
		console.error('❌ Error fetching themes:', error)
		process.exit(1)
	}

	console.log(`Found ${dbThemes.length} themes in database\n`)

	let updatedCount = 0
	let skippedCount = 0

	for (const dbTheme of dbThemes) {
		const lookupKey = `${dbTheme.lang}-${dbTheme.level}-${dbTheme.key}`
		const defaultTheme = themesLookup[lookupKey]

		if (!defaultTheme) {
			console.log(`⚠️  No default found for: ${lookupKey}`)
			skippedCount++
			continue
		}

		// Check if labels are missing
		const needsUpdate =
			!dbTheme.label_ru ||
			!dbTheme.label_en ||
			dbTheme.label_ru.trim() === '' ||
			dbTheme.label_en.trim() === ''

		if (needsUpdate) {
			console.log(`\n📝 Updating: ${dbTheme.key} (${dbTheme.level})`)
			console.log(`   Current - FR: "${dbTheme.label_fr || ''}" | EN: "${dbTheme.label_en || ''}" | RU: "${dbTheme.label_ru || ''}"`)
			console.log(`   New     - FR: "${defaultTheme.label_fr}" | EN: "${defaultTheme.label_en}" | RU: "${defaultTheme.label_ru}"`)

			// Update the theme
			const { error: updateError } = await supabase
				.from('training_themes')
				.update({
					label_fr: defaultTheme.label_fr,
					label_en: defaultTheme.label_en,
					label_ru: defaultTheme.label_ru,
					icon: defaultTheme.icon, // Also update icon in case it changed
				})
				.eq('id', dbTheme.id)

			if (updateError) {
				console.error(`   ❌ Error updating: ${updateError.message}`)
			} else {
				console.log(`   ✅ Updated successfully`)
				updatedCount++
			}
		} else {
			console.log(`✓ ${dbTheme.key} (${dbTheme.level}) - Already complete`)
			skippedCount++
		}
	}

	console.log('\n' + '='.repeat(60))
	console.log(`\n📊 Summary:`)
	console.log(`   ✅ Updated: ${updatedCount}`)
	console.log(`   ✓  Already complete: ${skippedCount}`)
	console.log(`   📚 Total themes: ${dbThemes.length}`)
	console.log('\n' + '='.repeat(60))
}

// Run the script
updateThemeLabels()
	.then(() => {
		console.log('\n✨ Script completed successfully!\n')
		process.exit(0)
	})
	.catch((error) => {
		console.error('\n❌ Script failed:', error)
		process.exit(1)
	})
