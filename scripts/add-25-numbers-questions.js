/**
 * Script to add 25 numbers questions for Russian A1-A2 level
 * Types:
 * 1. Math operations (addition/subtraction)
 * 2. General knowledge questions with number answers
 * 3. Numbers written in words → digit answers
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.production') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing Supabase credentials')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const exercises = [
	// TYPE 1: Math operations (8 questions)
	{
		question_fr: '7 + 3 = ?',
		question_en: '7 + 3 = ?',
		question_ru: '7 + 3 = ?',
		type: 'mcq',
		options: ['два', 'пять', 'десять', 'четыре'],
		correct_answer: 2, // десять
		explanation_fr: '7 + 3 = 10 (dix)',
		explanation_en: '7 + 3 = 10 (ten)',
	},
	{
		question_fr: '15 - 8 = ?',
		question_en: '15 - 8 = ?',
		question_ru: '15 - 8 = ?',
		type: 'mcq',
		options: ['шесть', 'семь', 'восемь', 'девять'],
		correct_answer: 1, // семь
		explanation_fr: '15 - 8 = 7 (sept)',
		explanation_en: '15 - 8 = 7 (seven)',
	},
	{
		question_fr: '12 + 5 = ?',
		question_en: '12 + 5 = ?',
		question_ru: '12 + 5 = ?',
		type: 'mcq',
		options: ['пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать'],
		correct_answer: 2, // семнадцать
		explanation_fr: '12 + 5 = 17 (dix-sept)',
		explanation_en: '12 + 5 = 17 (seventeen)',
	},
	{
		question_fr: '20 - 4 = ?',
		question_en: '20 - 4 = ?',
		question_ru: '20 - 4 = ?',
		type: 'mcq',
		options: ['четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать'],
		correct_answer: 2, // шестнадцать
		explanation_fr: '20 - 4 = 16 (seize)',
		explanation_en: '20 - 4 = 16 (sixteen)',
	},
	{
		question_fr: '6 + 9 = ?',
		question_en: '6 + 9 = ?',
		question_ru: '6 + 9 = ?',
		type: 'mcq',
		options: ['тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать'],
		correct_answer: 2, // пятнадцать
		explanation_fr: '6 + 9 = 15 (quinze)',
		explanation_en: '6 + 9 = 15 (fifteen)',
	},
	{
		question_fr: '25 - 10 = ?',
		question_en: '25 - 10 = ?',
		question_ru: '25 - 10 = ?',
		type: 'mcq',
		options: ['двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать'],
		correct_answer: 3, // пятнадцать
		explanation_fr: '25 - 10 = 15 (quinze)',
		explanation_en: '25 - 10 = 15 (fifteen)',
	},
	{
		question_fr: '8 + 8 = ?',
		question_en: '8 + 8 = ?',
		question_ru: '8 + 8 = ?',
		type: 'mcq',
		options: ['четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать'],
		correct_answer: 2, // шестнадцать
		explanation_fr: '8 + 8 = 16 (seize)',
		explanation_en: '8 + 8 = 16 (sixteen)',
	},
	{
		question_fr: '30 - 12 = ?',
		question_en: '30 - 12 = ?',
		question_ru: '30 - 12 = ?',
		type: 'mcq',
		options: ['шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'],
		correct_answer: 2, // восемнадцать
		explanation_fr: '30 - 12 = 18 (dix-huit)',
		explanation_en: '30 - 12 = 18 (eighteen)',
	},

	// TYPE 2: General knowledge with number answers (8 questions)
	{
		question_fr: 'Combien de jours dans une semaine ?',
		question_en: 'How many days in a week?',
		question_ru: 'Сколько дней в неделе?',
		type: 'mcq',
		options: ['пять', 'шесть', 'семь', 'восемь'],
		correct_answer: 2, // семь
		explanation_fr: 'Il y a 7 jours dans une semaine',
		explanation_en: 'There are 7 days in a week',
	},
	{
		question_fr: 'Combien de doigts sur une main ?',
		question_en: 'How many fingers on one hand?',
		question_ru: 'Сколько пальцев на одной руке?',
		type: 'mcq',
		options: ['три', 'четыре', 'пять', 'шесть'],
		correct_answer: 2, // пять
		explanation_fr: 'Il y a 5 doigts sur une main',
		explanation_en: 'There are 5 fingers on one hand',
	},
	{
		question_fr: 'Combien de mois dans une année ?',
		question_en: 'How many months in a year?',
		question_ru: 'Сколько месяцев в году?',
		type: 'mcq',
		options: ['десять', 'одиннадцать', 'двенадцать', 'тринадцать'],
		correct_answer: 2, // двенадцать
		explanation_fr: 'Il y a 12 mois dans une année',
		explanation_en: 'There are 12 months in a year',
	},
	{
		question_fr: 'Combien de saisons dans une année ?',
		question_en: 'How many seasons in a year?',
		question_ru: 'Сколько времён года?',
		type: 'mcq',
		options: ['два', 'три', 'четыре', 'пять'],
		correct_answer: 2, // четыре
		explanation_fr: 'Il y a 4 saisons dans une année',
		explanation_en: 'There are 4 seasons in a year',
	},
	{
		question_fr: 'Combien de roues a une voiture ?',
		question_en: 'How many wheels does a car have?',
		question_ru: 'Сколько колёс у машины?',
		type: 'mcq',
		options: ['два', 'три', 'четыре', 'пять'],
		correct_answer: 2, // четыре
		explanation_fr: 'Une voiture a 4 roues',
		explanation_en: 'A car has 4 wheels',
	},
	{
		question_fr: 'Combien de pattes a un chat ?',
		question_en: 'How many legs does a cat have?',
		question_ru: 'Сколько лап у кошки?',
		type: 'mcq',
		options: ['два', 'три', 'четыре', 'пять'],
		correct_answer: 2, // четыре
		explanation_fr: 'Un chat a 4 pattes',
		explanation_en: 'A cat has 4 legs',
	},
	{
		question_fr: 'Combien de minutes dans une heure ?',
		question_en: 'How many minutes in an hour?',
		question_ru: 'Сколько минут в часе?',
		type: 'mcq',
		options: ['сорок', 'пятьдесят', 'шестьдесят', 'семьдесят'],
		correct_answer: 2, // шестьдесят
		explanation_fr: 'Il y a 60 minutes dans une heure',
		explanation_en: 'There are 60 minutes in an hour',
	},
	{
		question_fr: 'Combien de secondes dans une minute ?',
		question_en: 'How many seconds in a minute?',
		question_ru: 'Сколько секунд в минуте?',
		type: 'mcq',
		options: ['сорок', 'пятьдесят', 'шестьдесят', 'семьдесят'],
		correct_answer: 2, // шестьдесят
		explanation_fr: 'Il y a 60 secondes dans une minute',
		explanation_en: 'There are 60 seconds in a minute',
	},

	// TYPE 3: Numbers in words → digits (9 questions)
	{
		question_fr: 'Quel nombre est écrit ?',
		question_en: 'Which number is written?',
		question_ru: 'Двести тридцать пять',
		type: 'mcq',
		options: ['235', '253', '325', '352'],
		correct_answer: 0, // 235
		explanation_fr: 'Двести тридцать пять = 235',
		explanation_en: 'Двести тридцать пять = 235',
	},
	{
		question_fr: 'Quel nombre est écrit ?',
		question_en: 'Which number is written?',
		question_ru: 'Сто сорок восемь',
		type: 'mcq',
		options: ['148', '184', '418', '481'],
		correct_answer: 0, // 148
		explanation_fr: 'Сто сорок восемь = 148',
		explanation_en: 'Сто сорок восемь = 148',
	},
	{
		question_fr: 'Quel nombre est écrit ?',
		question_en: 'Which number is written?',
		question_ru: 'Триста шестьдесят два',
		type: 'mcq',
		options: ['362', '326', '632', '623'],
		correct_answer: 0, // 362
		explanation_fr: 'Триста шестьдесят два = 362',
		explanation_en: 'Триста шестьдесят два = 362',
	},
	{
		question_fr: 'Quel nombre est écrit ?',
		question_en: 'Which number is written?',
		question_ru: 'Четыреста семьдесят девять',
		type: 'mcq',
		options: ['479', '497', '749', '794'],
		correct_answer: 0, // 479
		explanation_fr: 'Четыреста семьдесят девять = 479',
		explanation_en: 'Четыреста семьдесят девять = 479',
	},
	{
		question_fr: 'Quel nombre est écrit ?',
		question_en: 'Which number is written?',
		question_ru: 'Пятьсот двадцать один',
		type: 'mcq',
		options: ['521', '512', '215', '251'],
		correct_answer: 0, // 521
		explanation_fr: 'Пятьсот двадцать один = 521',
		explanation_en: 'Пятьсот двадцать один = 521',
	},
	{
		question_fr: 'Quel nombre est écrit ?',
		question_en: 'Which number is written?',
		question_ru: 'Шестьсот девяносто три',
		type: 'mcq',
		options: ['693', '639', '936', '963'],
		correct_answer: 0, // 693
		explanation_fr: 'Шестьсот девяносто три = 693',
		explanation_en: 'Шестьсот девяносто три = 693',
	},
	{
		question_fr: 'Quel nombre est écrit ?',
		question_en: 'Which number is written?',
		question_ru: 'Семьсот пятьдесят шесть',
		type: 'mcq',
		options: ['756', '765', '576', '567'],
		correct_answer: 0, // 756
		explanation_fr: 'Семьсот пятьдесят шесть = 756',
		explanation_en: 'Семьсот пятьдесят шесть = 756',
	},
	{
		question_fr: 'Quel nombre est écrit ?',
		question_en: 'Which number is written?',
		question_ru: 'Восемьсот тридцать четыре',
		type: 'mcq',
		options: ['834', '843', '384', '348'],
		correct_answer: 0, // 834
		explanation_fr: 'Восемьсот тридцать четыре = 834',
		explanation_en: 'Восемьсот тридцать четыре = 834',
	},
	{
		question_fr: 'Quel nombre est écrit ?',
		question_en: 'Which number is written?',
		question_ru: 'Девятьсот двенадцать',
		type: 'mcq',
		options: ['912', '921', '192', '219'],
		correct_answer: 0, // 912
		explanation_fr: 'Девятьсот двенадцать = 912',
		explanation_en: 'Девятьсот двенадцать = 912',
	},
]

async function main() {
	console.log('🔍 Finding theme "numbers" for Russian...')

	const { data: theme, error: themeError } = await supabase
		.from('training_themes')
		.select('id, key, label_fr, level')
		.eq('key', 'numbers')
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
		correct_answer: ex.correct_answer,
		explanation_fr: ex.explanation_fr,
		explanation_en: ex.explanation_en,
		is_active: true,
	}))

	console.log(`\n📝 Creating ${questions.length} questions...`)
	console.log(`   - Type 1 (Math): 8 questions`)
	console.log(`   - Type 2 (General knowledge): 8 questions`)
	console.log(`   - Type 3 (Words → Digits): 9 questions`)

	const { data, error } = await supabase.from('training_questions').insert(questions).select()

	if (error) {
		console.error('❌ Error creating questions:', error)
		process.exit(1)
	}

	console.log(`\n✅ Successfully created ${data.length} questions!`)
	console.log('\n📊 Question IDs:')
	data.forEach((q, i) => {
		const type = i < 8 ? 'Math' : i < 16 ? 'Knowledge' : 'Words→Digits'
		console.log(`   ${i + 1}. ID ${q.id} (${type})`)
	})

	console.log('\n✨ Done! You can now view these exercises in the admin panel.')
}

main()
