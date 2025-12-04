/**
 * Script to create 10 multi-fill exercises for verb prefixes (Russian A1-A2 level)
 * Each exercise has 3-5 sentences with verbs that share the same root but different prefixes
 * All verbs in each exercise are in the same grammatical form
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env.local (dev database)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing Supabase credentials in .env.production')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// 10 multi-fill exercises for verb prefixes
const exercises = [
	{
		// Exercise 1: -писать (to write) - Past tense, 3rd person singular masculine
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['написал', 'записал', 'подписал', 'переписал'],
		sentences: [
			{ text: 'Иван ___ интересную статью для журнала.', correct: 0 }, // написал (wrote)
			{ text: 'Максим ___ номер телефона в блокнот.', correct: 1 }, // записал (wrote down)
			{ text: 'Директор ___ документы после обеда.', correct: 2 }, // подписал (signed)
			{ text: 'Студент ___ текст без ошибок.', correct: 3 }, // переписал (rewrote)
		],
		explanation_fr: 'Chaque préfixe change le sens du verbe: на- (écrire/composer), за- (noter), под- (signer), пере- (réécrire).',
		explanation_en: 'Each prefix changes the verb meaning: на- (to write/compose), за- (to write down), под- (to sign), пере- (to rewrite).',
	},
	{
		// Exercise 2: -читать (to read) - Future tense, 1st person singular
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['прочитаю', 'перечитаю', 'дочитаю'],
		sentences: [
			{ text: 'Завтра я ___ эту книгу до конца.', correct: 0 }, // прочитаю (will read completely)
			{ text: 'Я обязательно ___ это письмо ещё раз.', correct: 1 }, // перечитаю (will reread)
			{ text: 'Сегодня вечером я ___ последнюю главу.', correct: 2 }, // дочитаю (will finish reading)
		],
		explanation_fr: 'про- (lire complètement), пере- (relire), до- (finir de lire).',
		explanation_en: 'про- (to read completely), пере- (to reread), до- (to finish reading).',
	},
	{
		// Exercise 3: -ходить (to go/walk) - Present tense, 3rd person singular
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['входит', 'выходит', 'проходит', 'переходит'],
		sentences: [
			{ text: 'Мария ___ в класс ровно в 8 часов.', correct: 0 }, // входит (enters)
			{ text: 'Мой брат ___ из дома в 7 утра.', correct: 1 }, // выходит (exits)
			{ text: 'Автобус ___ через центр города.', correct: 2 }, // проходит (passes through)
			{ text: 'Старик медленно ___ через дорогу.', correct: 3 }, // переходит (crosses)
		],
		explanation_fr: 'в- (entrer), вы- (sortir), про- (passer à travers), пере- (traverser).',
		explanation_en: 'в- (to enter), вы- (to exit), про- (to pass through), пере- (to cross).',
	},
	{
		// Exercise 4: -нести (to carry) - Past tense, 3rd person plural
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['принесли', 'унесли', 'вынесли', 'перенесли'],
		sentences: [
			{ text: 'Гости ___ подарки на день рождения.', correct: 0 }, // принесли (brought)
			{ text: 'Воры ___ все ценные вещи из квартиры.', correct: 1 }, // унесли (carried away)
			{ text: 'Рабочие ___ старую мебель на улицу.', correct: 2 }, // вынесли (carried out)
			{ text: 'Мы ___ встречу на следующую неделю.', correct: 3 }, // перенесли (postponed/moved)
		],
		explanation_fr: 'при- (apporter), у- (emporter), вы- (sortir en portant), пере- (reporter/déplacer).',
		explanation_en: 'при- (to bring), у- (to carry away), вы- (to carry out), пере- (to postpone/move).',
	},
	{
		// Exercise 5: -ехать (to go by vehicle) - Future tense, 1st person plural
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['приедем', 'уедем', 'переедем', 'подъедем'],
		sentences: [
			{ text: 'Мы ___ в Москву завтра утром.', correct: 0 }, // приедем (will arrive)
			{ text: 'Через месяц мы ___ из этого города навсегда.', correct: 1 }, // уедем (will leave)
			{ text: 'В следующем году мы ___ в новую квартиру.', correct: 2 }, // переедем (will move/relocate)
			{ text: 'Мы ___ к театру на такси.', correct: 3 }, // подъедем (will drive up to)
		],
		explanation_fr: 'при- (arriver), у- (partir), пере- (déménager), под- (s\'approcher en véhicule).',
		explanation_en: 'при- (to arrive), у- (to leave), пере- (to move/relocate), под- (to drive up to).',
	},
	{
		// Exercise 6: -дать (to give) - Past tense, 3rd person singular masculine
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['отдал', 'передал', 'продал', 'выдал'],
		sentences: [
			{ text: 'Андрей ___ мне книгу, которую я ему давал.', correct: 0 }, // отдал (gave back)
			{ text: 'Курьер ___ посылку соседу.', correct: 1 }, // передал (handed over)
			{ text: 'Сергей ___ старую машину за 100 тысяч рублей.', correct: 2 }, // продал (sold)
			{ text: 'Библиотекарь ___ студентам новые учебники.', correct: 3 }, // выдал (issued)
		],
		explanation_fr: 'от- (rendre), пере- (transmettre), про- (vendre), вы- (délivrer).',
		explanation_en: 'от- (to give back), пере- (to hand over), про- (to sell), вы- (to issue).',
	},
	{
		// Exercise 7: -бежать (to run) - Present tense, 3rd person singular
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['убегает', 'прибегает', 'перебегает', 'выбегает'],
		sentences: [
			{ text: 'Кошка ___ от собаки.', correct: 0 }, // убегает (runs away)
			{ text: 'Мой сын всегда ___ первым к обеденному столу.', correct: 1 }, // прибегает (runs up to/arrives running)
			{ text: 'Олень быстро ___ через дорогу.', correct: 2 }, // перебегает (runs across)
			{ text: 'Ребёнок радостно ___ из школы.', correct: 3 }, // выбегает (runs out)
		],
		explanation_fr: 'у- (s\'enfuir), при- (accourir), пере- (traverser en courant), вы- (sortir en courant).',
		explanation_en: 'у- (to run away), при- (to run up to), пере- (to run across), вы- (to run out).',
	},
	{
		// Exercise 8: -звонить (to call/ring) - Future tense, 1st person singular
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['позвоню', 'перезвоню', 'дозвонюсь'],
		sentences: [
			{ text: 'Я ___ тебе сегодня вечером.', correct: 0 }, // позвоню (will call)
			{ text: 'Извини, я сейчас занят, я тебе ___ через 10 минут.', correct: 1 }, // перезвоню (will call back)
			{ text: 'Я обязательно ___ до него завтра.', correct: 2 }, // дозвонюсь (will manage to reach by phone)
		],
		explanation_fr: 'по- (appeler), пере- (rappeler), до- (réussir à joindre).',
		explanation_en: 'по- (to call), пере- (to call back), до- (to manage to reach).',
	},
	{
		// Exercise 9: -готовить (to prepare) - Past tense, 3rd person singular feminine
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['приготовила', 'подготовила', 'заготовила'],
		sentences: [
			{ text: 'Мама ___ вкусный обед для всей семьи.', correct: 0 }, // приготовила (cooked/prepared food)
			{ text: 'Анна хорошо ___ доклад к конференции.', correct: 1 }, // подготовила (prepared/got ready)
			{ text: 'Бабушка ___ варенье на зиму.', correct: 2 }, // заготовила (stocked up/prepared in advance)
		],
		explanation_fr: 'при- (cuisiner), под- (préparer), за- (faire des réserves).',
		explanation_en: 'при- (to cook), под- (to prepare), за- (to stock up).',
	},
	{
		// Exercise 10: -смотреть (to look/watch) - Present tense, 2nd person plural
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['смотрите', 'просматриваете', 'осматриваете', 'пересматриваете'],
		sentences: [
			{ text: 'Вы сейчас ___ новый фильм?', correct: 0 }, // смотрите (are watching)
			{ text: 'Вы ___ документы перед подписанием?', correct: 1 }, // просматриваете (are looking through)
			{ text: 'Вы ___ город перед покупкой дома?', correct: 2 }, // осматриваете (are examining/inspecting)
			{ text: 'Вы часто ___ старые фотографии?', correct: 3 }, // пересматриваете (are reviewing/looking again)
		],
		explanation_fr: 'Ø (regarder), про- (parcourir), о- (examiner), пере- (revoir).',
		explanation_en: 'Ø (to watch), про- (to look through), о- (to examine), пере- (to review).',
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

	console.log(`\n📝 Creating ${questions.length} multi-fill exercises...`)

	const { data, error } = await supabase.from('training_questions').insert(questions).select()

	if (error) {
		console.error('❌ Error creating questions:', error)
		process.exit(1)
	}

	console.log(`✅ Successfully created ${data.length} exercises!`)
	console.log('\n📊 Summary:')
	data.forEach((q, i) => {
		console.log(`   ${i + 1}. ID ${q.id}: ${exercises[i].sentences.length} sentences`)
	})

	console.log('\n✨ Done! You can now view these exercises in the admin panel.')
}

main()
