/**
 * Script to migrate training questions from TrainingPageClient.jsx to database
 *
 * Usage: node scripts/migrate-training-to-db.js
 *
 * This script:
 * 1. Creates training themes in the database
 * 2. Migrates all existing questions to the database
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Vocabulary themes by level (from TrainingPageClient.jsx)
const vocabularyThemes = {
	ru: {
		beginner: [
			{ key: 'greetings', icon: '👋', label: { fr: 'Salutations', en: 'Greetings' } },
			{ key: 'numbers', icon: '🔢', label: { fr: 'Nombres', en: 'Numbers' } },
			{ key: 'family', icon: '👨‍👩‍👧‍👦', label: { fr: 'Famille', en: 'Family' } },
			{ key: 'food', icon: '🍎', label: { fr: 'Nourriture', en: 'Food' } },
			{ key: 'colors', icon: '🎨', label: { fr: 'Couleurs', en: 'Colors' } },
			{ key: 'animals', icon: '🐾', label: { fr: 'Animaux', en: 'Animals' } },
			{ key: 'body', icon: '🫀', label: { fr: 'Corps humain', en: 'Body parts' } },
			{ key: 'clothes', icon: '👕', label: { fr: 'Vetements', en: 'Clothes' } },
			{ key: 'time', icon: '🕐', label: { fr: 'Temps', en: 'Time' } },
			{ key: 'days', icon: '📅', label: { fr: 'Jours et mois', en: 'Days & months' } },
			{ key: 'places', icon: '🏪', label: { fr: 'Lieux', en: 'Places' } },
			{ key: 'professions', icon: '👨‍⚕️', label: { fr: 'Metiers', en: 'Professions' } },
			{ key: 'house', icon: '🛋️', label: { fr: 'Maison', en: 'House' } },
			{ key: 'transport', icon: '🚌', label: { fr: 'Transports', en: 'Transport' } },
			{ key: 'verbs', icon: '🏃', label: { fr: 'Verbes courants', en: 'Common verbs' } },
			{ key: 'adjectives', icon: '✨', label: { fr: 'Adjectifs', en: 'Adjectives' } },
			{ key: 'weather', icon: '☀️', label: { fr: 'Meteo', en: 'Weather' } },
			{ key: 'emotions', icon: '😊', label: { fr: 'Emotions', en: 'Emotions' } },
			{ key: 'hobbies', icon: '⚽', label: { fr: 'Loisirs', en: 'Hobbies' } },
			{ key: 'school', icon: '📚', label: { fr: 'Ecole', en: 'School' } },
			{ key: 'nature', icon: '🌳', label: { fr: 'Nature', en: 'Nature' } },
			{ key: 'drinks', icon: '🥤', label: { fr: 'Boissons', en: 'Drinks' } },
		],
		intermediate: [
			{ key: 'travel', icon: '✈️', label: { fr: 'Voyages', en: 'Travel' } },
			{ key: 'work', icon: '💼', label: { fr: 'Travail', en: 'Work' } },
			{ key: 'health', icon: '🏥', label: { fr: 'Sante', en: 'Health' } },
			{ key: 'hobbies', icon: '🎸', label: { fr: 'Loisirs', en: 'Hobbies' } },
			{ key: 'home', icon: '🏠', label: { fr: 'Maison', en: 'Home' } },
			{ key: 'weather', icon: '🌤️', label: { fr: 'Meteo', en: 'Weather' } },
		],
		advanced: [
			{ key: 'politics', icon: '🏛️', label: { fr: 'Politique', en: 'Politics' } },
			{ key: 'business', icon: '📊', label: { fr: 'Affaires', en: 'Business' } },
			{ key: 'science', icon: '🔬', label: { fr: 'Sciences', en: 'Science' } },
			{ key: 'culture', icon: '🎭', label: { fr: 'Culture', en: 'Culture' } },
			{ key: 'emotions', icon: '💭', label: { fr: 'Emotions', en: 'Emotions' } },
			{ key: 'idioms', icon: '📚', label: { fr: 'Expressions', en: 'Idioms' } },
		],
	},
}

// Training questions data (from TrainingPageClient.jsx)
// This is a subset - in production, copy the full trainingQuestions object
const trainingQuestions = {
	ru: {
		beginner: {
			vocabulary: {
				greetings: [
					{
						id: 'v1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "bonjour" en russe ?',
							en: 'How do you say "hello" in Russian?',
						},
						options: ['Привет', 'Пока', 'Спасибо', 'Пожалуйста'],
						correctAnswer: 0,
						explanation: {
							fr: 'Привет (Privet) signifie "Salut" ou "Bonjour" de maniere informelle.',
							en: 'Привет (Privet) means "Hi" or "Hello" in an informal way.',
						},
					},
					{
						id: 'v2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "Спасибо" ?',
							en: 'What does "Спасибо" mean?',
						},
						options: {
							fr: ['Au revoir', 'Bonjour', 'Merci', 'Pardon'],
							en: ['Goodbye', 'Hello', 'Thank you', 'Sorry'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Спасибо (Spasibo) signifie "Merci".',
							en: 'Спасибо (Spasibo) means "Thank you".',
						},
					},
					{
						id: 'v3',
						type: 'dropdown',
						sentence: 'Меня ___ Анна.',
						blank: 'зовут',
						options: ['зовут', 'есть', 'люблю', 'хочу'],
						correctAnswer: 0,
						explanation: {
							fr: 'Меня зовут = Je m\'appelle. "Зовут" est le verbe utilise pour dire son prenom.',
							en: 'Меня зовут = My name is. "Зовут" is the verb used to say your name.',
						},
					},
					{
						id: 'v4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "oui" en russe ?',
							en: 'How do you say "yes" in Russian?',
						},
						options: ['Нет', 'Да', 'Может', 'Хорошо'],
						correctAnswer: 1,
						explanation: {
							fr: 'Да signifie "oui" en russe.',
							en: 'Да means "yes" in Russian.',
						},
					},
					{
						id: 'v5',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "au revoir" en russe ?',
							en: 'How do you say "goodbye" in Russian?',
						},
						options: ['Привет', 'Пока', 'Спасибо', 'Здравствуйте'],
						correctAnswer: 1,
						explanation: {
							fr: 'Пока (Poka) signifie "Au revoir" de maniere informelle.',
							en: 'Пока (Poka) means "Bye" in an informal way.',
						},
					},
				],
				// Add more themes here...
			},
		},
	},
}

async function migrateThemes() {
	console.log('📚 Migrating themes...')

	const themesToInsert = []

	for (const [lang, levels] of Object.entries(vocabularyThemes)) {
		for (const [level, themes] of Object.entries(levels)) {
			themes.forEach((theme, index) => {
				themesToInsert.push({
					lang,
					level,
					key: theme.key,
					icon: theme.icon,
					label_fr: theme.label.fr,
					label_en: theme.label.en,
					label_ru: theme.label.ru || null,
					display_order: index,
					is_active: true,
				})
			})
		}
	}

	const { data, error } = await supabase
		.from('training_themes')
		.upsert(themesToInsert, {
			onConflict: 'lang,level,key',
			ignoreDuplicates: false,
		})
		.select()

	if (error) {
		console.error('Error inserting themes:', error)
		return null
	}

	console.log(`✅ Inserted ${themesToInsert.length} themes`)
	return data
}

async function getThemeId(lang, level, key) {
	const { data } = await supabase
		.from('training_themes')
		.select('id')
		.eq('lang', lang)
		.eq('level', level)
		.eq('key', key)
		.single()

	return data?.id
}

async function migrateQuestions() {
	console.log('❓ Migrating questions...')

	let totalQuestions = 0

	for (const [lang, levels] of Object.entries(trainingQuestions)) {
		for (const [level, categories] of Object.entries(levels)) {
			for (const [category, themes] of Object.entries(categories)) {
				for (const [themeKey, questions] of Object.entries(themes)) {
					const themeId = await getThemeId(lang, level, themeKey)

					if (!themeId) {
						console.warn(`⚠️ Theme not found: ${lang}/${level}/${themeKey}`)
						continue
					}

					const questionsToInsert = questions.map((q) => ({
						theme_id: themeId,
						type: q.type,
						question_fr: q.question?.fr || null,
						question_en: q.question?.en || null,
						question_ru: q.question?.ru || null,
						sentence: q.sentence || null,
						blank: q.blank || null,
						options: q.options,
						correct_answer: q.correctAnswer,
						explanation_fr: q.explanation?.fr || null,
						explanation_en: q.explanation?.en || null,
						explanation_ru: q.explanation?.ru || null,
						is_active: true,
					}))

					const { error } = await supabase
						.from('training_questions')
						.insert(questionsToInsert)

					if (error) {
						console.error(`Error inserting questions for ${themeKey}:`, error)
					} else {
						totalQuestions += questionsToInsert.length
						console.log(`  ✅ ${themeKey}: ${questionsToInsert.length} questions`)
					}
				}
			}
		}
	}

	console.log(`\n✅ Total questions migrated: ${totalQuestions}`)
}

async function main() {
	console.log('🚀 Starting training data migration...\n')

	// Check connection
	const { data: test, error: testError } = await supabase
		.from('training_themes')
		.select('count')
		.limit(1)

	if (testError && !testError.message.includes('does not exist')) {
		console.error('❌ Database connection failed:', testError.message)
		console.log('\n⚠️ Make sure to run the migration SQL first:')
		console.log('   supabase/migrations/20251127_create_training_system.sql')
		process.exit(1)
	}

	// Migrate themes first
	await migrateThemes()

	// Then migrate questions
	await migrateQuestions()

	console.log('\n🎉 Migration complete!')
	console.log('\nNote: This script only migrated a sample of questions.')
	console.log('For full migration, copy the complete trainingQuestions object')
	console.log('from TrainingPageClient.jsx into this script.')
}

main().catch(console.error)
