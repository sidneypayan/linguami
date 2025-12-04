/**
 * Script to add 3 new multi-fill exercises for verb prefixes (Russian A1-A2 level)
 * - Exercise 1: -нес (to carry) - Past tense, 3rd person singular masculine
 * - Exercise 2: -йд/ход (to go) - Future tense, 3rd person singular
 * - Exercise 3: -ста(в) (to put/place) - Past tense, 3rd person singular masculine
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env.production (prod database)
dotenv.config({ path: path.resolve(__dirname, '../.env.production') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing Supabase credentials in .env.production')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// 3 new multi-fill exercises for verb prefixes
const exercises = [
	{
		// Exercise 1: -нес (to carry) - Past tense, 3rd person singular masculine
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['принёс', 'унёс', 'перенёс', 'донёс'],
		sentences: [
			{ text: 'Почтальон ___ письмо утром.', correct: 0 }, // принёс (brought)
			{ text: 'Вор ___ все ценные вещи из дома.', correct: 1 }, // унёс (carried away)
			{ text: 'Рабочие ___ мебель в другую комнату.', correct: 2 }, // перенёс (moved/transferred)
			{ text: 'Информатор ___ на преступников в полицию.', correct: 3 }, // донёс (reported/informed on)
		],
		explanation_fr: 'при- (apporter), у- (emporter), пере- (déplacer/transférer), до- (rapporter/dénoncer).',
		explanation_en: 'при- (to bring), у- (to carry away), пере- (to move/transfer), до- (to report/inform on).',
	},
	{
		// Exercise 2: -йд/ход (to go) - Future tense, 3rd person singular
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['пойдёт', 'выйдет', 'зайдёт', 'перейдёт'],
		sentences: [
			{ text: 'Завтра Мария ___ в театр с подругами.', correct: 0 }, // пойдёт (will go)
			{ text: 'Начальник ___ из офиса через десять минут.', correct: 1 }, // выйдет (will exit)
			{ text: 'Наташа ___ к нам в гости вечером.', correct: 2 }, // зайдёт (will drop by/visit)
			{ text: 'Пешеход ___ улицу на зелёный свет.', correct: 3 }, // перейдёт (will cross)
		],
		explanation_fr: 'по- (aller/partir), вы- (sortir), за- (passer voir/entrer), пере- (traverser).',
		explanation_en: 'по- (to go/leave), вы- (to exit), за- (to drop by/enter), пере- (to cross).',
	},
	{
		// Exercise 3: -ста(в) (to put/place) - Past tense, 3rd person singular masculine
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['поставил', 'выставил', 'переставил', 'заставил'],
		sentences: [
			{ text: 'Антон ___ книги на полку.', correct: 0 }, // поставил (put/placed)
			{ text: 'Музей ___ новую коллекцию картин.', correct: 1 }, // выставил (displayed/exhibited)
			{ text: 'Павел ___ стол ближе к окну.', correct: 2 }, // переставил (moved/rearranged)
			{ text: 'Отец ___ сына убрать комнату.', correct: 3 }, // заставил (forced/made)
		],
		explanation_fr: 'по- (poser/mettre), вы- (exposer), пере- (déplacer), за- (forcer/obliger).',
		explanation_en: 'по- (to put/place), вы- (to display/exhibit), пере- (to move/rearrange), за- (to force/make).',
	},
]

async function main() {
	console.log('🔍 Finding theme "prefixes" for Russian...')

	// Find the theme
	const { data: theme, error: themeError } = await supabase
		.from('training_themes')
		.select('id, key, label_fr, level')
		.eq('key', 'prefixes')
		.eq('lang', 'ru')
		.single()

	if (themeError || !theme) {
		console.error('❌ Theme not found:', themeError?.message || 'No theme returned')
		process.exit(1)
	}

	console.log(`✅ Found theme: ${theme.label_fr} (ID: ${theme.id}, Level: ${theme.level})`)

	// Prepare questions for insertion
	const questions = exercises.map((ex) => ({
		theme_id: theme.id,
		type: ex.type,
		question_fr: ex.question_fr,
		question_en: ex.question_en,
		question_ru: ex.question_ru,
		options: ex.options,
		correct_answer: 0, // Placeholder for multi_fill (not used, but column is NOT NULL)
		sentences: ex.sentences,
		explanation_fr: ex.explanation_fr,
		explanation_en: ex.explanation_en,
		is_active: true,
	}))

	console.log(`\n📝 Creating ${questions.length} new multi-fill exercises...`)

	const { data, error } = await supabase.from('training_questions').insert(questions).select()

	if (error) {
		console.error('❌ Error creating questions:', error)
		process.exit(1)
	}

	console.log(`✅ Successfully created ${data.length} exercises!`)
	console.log('\n📊 Summary:')
	data.forEach((q, i) => {
		console.log(
			`   ${i + 1}. ID ${q.id}: ${exercises[i].sentences.length} sentences (Root: ${exercises[i].options[0].replace(/^.*([а-я]+)$/i, '$1')})`,
		)
	})

	console.log('\n✨ Done! You can now view these exercises in the admin panel.')
}

main()
