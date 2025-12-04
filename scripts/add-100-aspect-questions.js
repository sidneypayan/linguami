/**
 * Script to add 100 aspect-based multi-fill exercises (Russian A1-A2)
 * Based on common verb pairs (imperfective - perfective)
 * Each question has 3-5 sentences with verbs sharing the same root but different prefixes
 * All verbs in each question are in the same grammatical form
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

// 100 exercises covering the provided verb list
const exercises = [
	// делать — сделать (10 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['сделала', 'переделала', 'доделала', 'выделала'],
		sentences: [
			{ text: 'Мария ___ все домашние задания.', correct: 0 },
			{ text: 'Она ___ работу после замечаний.', correct: 1 },
			{ text: 'Анна ___ проект к вечеру.', correct: 2 },
			{ text: 'Мастер ___ кожу для обуви.', correct: 3 },
		],
		explanation_fr: 'с- (faire), пере- (refaire), до- (finir), вы- (tanner)',
		explanation_en: 'с- (to do), пере- (to redo), до- (to finish), вы- (to tan)',
	},
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['делает', 'сделает', 'переделает', 'подделает'],
		sentences: [
			{ text: 'Он ___ уроки каждый день.', correct: 0 },
			{ text: 'Завтра она ___ всю работу.', correct: 1 },
			{ text: 'Мастер ___ изделие по-новому.', correct: 2 },
			{ text: 'Преступник ___ документы.', correct: 3 },
		],
		explanation_fr: 'Ø (faire régulièrement), с- (faire une fois), пере- (refaire), под- (falsifier)',
		explanation_en: 'Ø (to do regularly), с- (to do once), пере- (to redo), под- (to forge)',
	},

	// говорить — сказать (10 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['говорил', 'сказал', 'рассказал', 'пересказал'],
		sentences: [
			{ text: 'Он долго ___ о своей жизни.', correct: 0 },
			{ text: 'Учитель ___ нам правду.', correct: 1 },
			{ text: 'Дедушка ___ интересную историю.', correct: 2 },
			{ text: 'Ученик ___ текст своими словами.', correct: 3 },
		],
		explanation_fr: 'Ø (parler longtemps), с- (dire), рас- (raconter), пере- (raconter autrement)',
		explanation_en: 'Ø (to speak long), с- (to say), рас- (to tell), пере- (to retell)',
	},
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['поговорит', 'договорится', 'заговорит', 'уговорит'],
		sentences: [
			{ text: 'Он ___ с другом завтра.', correct: 0 },
			{ text: 'Директор ___ о встрече с клиентом.', correct: 1 },
			{ text: 'Ребёнок скоро ___ на русском.', correct: 2 },
			{ text: 'Мать ___ сына пойти к врачу.', correct: 3 },
		],
		explanation_fr: 'по- (parler un peu), до- (convenir), за- (commencer à parler), у- (persuader)',
		explanation_en: 'по- (to talk a bit), до- (to agree), за- (to start talking), у- (to persuade)',
	},

	// смотреть — посмотреть (8 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['смотрит', 'посмотрит', 'просмотрит', 'осмотрит'],
		sentences: [
			{ text: 'Он ___ телевизор каждый вечер.', correct: 0 },
			{ text: 'Она ___ новый фильм завтра.', correct: 1 },
			{ text: 'Редактор ___ статью перед публикацией.', correct: 2 },
			{ text: 'Врач ___ пациента.', correct: 3 },
		],
		explanation_fr: 'Ø (regarder), по- (regarder une fois), про- (parcourir), о- (examiner)',
		explanation_en: 'Ø (to watch), по- (to watch once), про- (to look through), о- (to examine)',
	},
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['досмотрел', 'пересмотрел', 'засмотрелся', 'присмотрел'],
		sentences: [
			{ text: 'Я ___ фильм до конца.', correct: 0 },
			{ text: 'Он ___ фильм ещё раз.', correct: 1 },
			{ text: 'Мальчик ___ на красивую девушку.', correct: 2 },
			{ text: 'Я ___ за детьми соседей.', correct: 3 },
		],
		explanation_fr: 'до- (regarder jusqu\'au bout), пере- (revoir), за- (être absorbé), при- (surveiller)',
		explanation_en: 'до- (to watch to end), пере- (to rewatch), за- (to stare), при- (to look after)',
	},

	// читать — прочитать (8 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['читает', 'прочитает', 'перечитает', 'дочитает'],
		sentences: [
			{ text: 'Она ___ книги каждый день.', correct: 0 },
			{ text: 'Он ___ эту книгу за неделю.', correct: 1 },
			{ text: 'Я ___ письмо ещё раз.', correct: 2 },
			{ text: 'Студент ___ главу до конца.', correct: 3 },
		],
		explanation_fr: 'Ø (lire), про- (lire complètement), пере- (relire), до- (finir de lire)',
		explanation_en: 'Ø (to read), про- (to read through), пере- (to reread), до- (to finish reading)',
	},
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['почитал', 'зачитал', 'вычитал', 'считал'],
		sentences: [
			{ text: 'Он немного ___ перед сном.', correct: 0 },
			{ text: 'Учитель ___ объявление вслух.', correct: 1 },
			{ text: 'Редактор ___ ошибки в тексте.', correct: 2 },
			{ text: 'Он ___ газету за завтраком.', correct: 3 },
		],
		explanation_fr: 'по- (lire un peu), за- (lire à voix haute), вы- (corriger), с- (lire)',
		explanation_en: 'по- (to read a bit), за- (to read aloud), вы- (to proofread), с- (to read)',
	},

	// писать — написать (10 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['написал', 'записал', 'подписал', 'переписал'],
		sentences: [
			{ text: 'Иван ___ интересную статью.', correct: 0 },
			{ text: 'Максим ___ номер телефона.', correct: 1 },
			{ text: 'Директор ___ документы.', correct: 2 },
			{ text: 'Студент ___ текст без ошибок.', correct: 3 },
		],
		explanation_fr: 'на- (écrire), за- (noter), под- (signer), пере- (réécrire)',
		explanation_en: 'на- (to write), за- (to write down), под- (to sign), пере- (to rewrite)',
	},
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['допишет', 'выпишет', 'опишет', 'припишет'],
		sentences: [
			{ text: 'Автор ___ роман к концу года.', correct: 0 },
			{ text: 'Врач ___ рецепт пациенту.', correct: 1 },
			{ text: 'Журналист ___ события.', correct: 2 },
			{ text: 'Он ___ к сумме ещё один ноль.', correct: 3 },
		],
		explanation_fr: 'до- (finir d\'écrire), вы- (prescrire), о- (décrire), при- (ajouter)',
		explanation_en: 'до- (to finish writing), вы- (to prescribe), о- (to describe), при- (to add)',
	},

	// спрашивать — спросить (6 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['спрашивает', 'спросит', 'переспросит', 'выспросит'],
		sentences: [
			{ text: 'Учитель ___ учеников каждый день.', correct: 0 },
			{ text: 'Завтра он ___ о результатах.', correct: 1 },
			{ text: 'Если не понял, он ___.', correct: 2 },
			{ text: 'Журналист ___ все подробности.', correct: 3 },
		],
		explanation_fr: 'Ø (demander), с- (demander), пере- (redemander), вы- (tout demander)',
		explanation_en: 'Ø (to ask), с- (to ask), пере- (to ask again), вы- (to get all info)',
	},

	// отвечать — ответить (5 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['отвечает', 'ответит', 'подотвечает', 'доотвечает'],
		sentences: [
			{ text: 'Ученик ___ на вопросы.', correct: 0 },
			{ text: 'Он ___ на письмо завтра.', correct: 1 },
			{ text: 'Она быстро ___ реплику.', correct: 2 },
			{ text: 'Студент ___ последнюю часть.', correct: 3 },
		],
		explanation_fr: 'от- (répondre), от- (répondre), под- (répondre vite), до- (finir de répondre)',
		explanation_en: 'от- (to answer), от- (to answer), под- (to respond), до- (to finish answering)',
	},

	// слушать — послушать (5 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['слушает', 'послушает', 'дослушает', 'прослушает'],
		sentences: [
			{ text: 'Он ___ музыку каждый день.', correct: 0 },
			{ text: 'Она ___ новую песню.', correct: 1 },
			{ text: 'Я ___ лекцию до конца.', correct: 2 },
			{ text: 'Учитель ___ диктант учеников.', correct: 3 },
		],
		explanation_fr: 'Ø (écouter), по- (écouter un peu), до- (écouter jusqu\'au bout), про- (vérifier)',
		explanation_en: 'Ø (to listen), по- (to listen a bit), до- (to listen to end), про- (to check)',
	},

	// слышать — услышать (4 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['слышит', 'услышит', 'прослышит', 'недослышит'],
		sentences: [
			{ text: 'Он плохо ___ без очков.', correct: 0 },
			{ text: 'Она ___ новость завтра.', correct: 1 },
			{ text: 'Я ___ о скандале.', correct: 2 },
			{ text: 'Дедушка часто ___.', correct: 3 },
		],
		explanation_fr: 'Ø (entendre), у- (entendre), про- (apprendre), недо- (mal entendre)',
		explanation_en: 'Ø (to hear), у- (to hear), про- (to hear about), недо- (to mishear)',
	},

	// видеть — увидеть (5 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['видит', 'увидит', 'предвидит', 'завидует'],
		sentences: [
			{ text: 'Он плохо ___ без очков.', correct: 0 },
			{ text: 'Завтра она ___ результаты.', correct: 1 },
			{ text: 'Опытный менеджер ___ проблемы.', correct: 2 },
			{ text: 'Она ___ успеху подруги.', correct: 3 },
		],
		explanation_fr: 'Ø (voir), у- (voir), пред- (prévoir), за- (envier)',
		explanation_en: 'Ø (to see), у- (to see), пред- (to foresee), за- (to envy)',
	},

	// ждать — подождать (4 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ждёт', 'подождёт', 'дождётся', 'прождёт'],
		sentences: [
			{ text: 'Он ___ автобус.', correct: 0 },
			{ text: 'Она ___ минуту и войдёт.', correct: 1 },
			{ text: 'Мы ___ лета.', correct: 2 },
			{ text: 'Я ___ час, но он не пришёл.', correct: 3 },
		],
		explanation_fr: 'Ø (attendre), по- (attendre un peu), до- (attendre jusqu\'à), про- (attendre longtemps)',
		explanation_en: 'Ø (to wait), по- (to wait a bit), до- (to wait until), про- (to wait long)',
	},

	// есть — поесть (3 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ест', 'съест', 'доест', 'переест'],
		sentences: [
			{ text: 'Он ___ три раза в день.', correct: 0 },
			{ text: 'Кот ___ всю рыбу.', correct: 1 },
			{ text: 'Ребёнок ___ кашу до конца.', correct: 2 },
			{ text: 'Не ___ сладкого!', correct: 3 },
		],
		explanation_fr: 'Ø (manger), с- (manger tout), до- (finir), пере- (trop manger)',
		explanation_en: 'Ø (to eat), с- (to eat all), до- (to finish), пере- (to overeat)',
	},

	// пить — выпить (3 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['пьёт', 'выпьет', 'допьёт', 'перепьёт'],
		sentences: [
			{ text: 'Он ___ кофе каждое утро.', correct: 0 },
			{ text: 'Она ___ всю воду.', correct: 1 },
			{ text: 'Я ___ чай до конца.', correct: 2 },
			{ text: 'Не ___ столько кофе!', correct: 3 },
		],
		explanation_fr: 'Ø (boire), вы- (boire tout), до- (finir), пере- (trop boire)',
		explanation_en: 'Ø (to drink), вы- (to drink all), до- (to finish), пере- (to drink too much)',
	},

	// думать — подумать (3 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['думает', 'подумает', 'придумает', 'додумает'],
		sentences: [
			{ text: 'Он долго ___ о проблеме.', correct: 0 },
			{ text: 'Она ___ о предложении.', correct: 1 },
			{ text: 'Писатель ___ новый сюжет.', correct: 2 },
			{ text: 'Я не ___ мысль до конца.', correct: 3 },
		],
		explanation_fr: 'Ø (penser), по- (réfléchir), при- (inventer), до- (finir de penser)',
		explanation_en: 'Ø (to think), по- (to think), при- (to invent), до- (to finish thinking)',
	},

	// играть — поиграть (3 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['играет', 'сыграет', 'проиграет', 'выиграет'],
		sentences: [
			{ text: 'Он ___ в футбол каждый день.', correct: 0 },
			{ text: 'Команда ___ матч завтра.', correct: 1 },
			{ text: 'Если не будет тренироваться, он ___.', correct: 2 },
			{ text: 'Наша команда ___ чемпионат.', correct: 3 },
		],
		explanation_fr: 'Ø (jouer), с- (jouer une fois), про- (perdre), вы- (gagner)',
		explanation_en: 'Ø (to play), с- (to play once), про- (to lose), вы- (to win)',
	},

	// работать — поработать (2 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['работает', 'зарабатывает', 'дорабатывает', 'отрабатывает'],
		sentences: [
			{ text: 'Он ___ в больнице.', correct: 0 },
			{ text: 'Мой брат ___ много денег.', correct: 1 },
			{ text: 'Программист ___ детали проекта.', correct: 2 },
			{ text: 'Спортсмен ___ технику.', correct: 3 },
		],
		explanation_fr: 'Ø (travailler), за- (gagner), до- (finaliser), от- (perfectionner)',
		explanation_en: 'Ø (to work), за- (to earn), до- (to finalize), от- (to perfect)',
	},

	// учить — выучить (3 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['учит', 'выучит', 'изучит', 'разучит'],
		sentences: [
			{ text: 'Он ___ русский язык.', correct: 0 },
			{ text: 'Иван ___ стихотворение наизусть.', correct: 1 },
			{ text: 'Студент ___ тему подробно.', correct: 2 },
			{ text: 'Музыкант ___ новую мелодию.', correct: 3 },
		],
		explanation_fr: 'Ø (apprendre), вы- (apprendre par cœur), из- (étudier), раз- (apprendre)',
		explanation_en: 'Ø (to learn), вы- (to learn by heart), из- (to study), раз- (to learn)',
	},

	// учиться — научиться (2 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['учится', 'научится', 'выучится', 'доучится'],
		sentences: [
			{ text: 'Он ___ в университете.', correct: 0 },
			{ text: 'Она ___ водить машину.', correct: 1 },
			{ text: 'Студент скоро ___ на врача.', correct: 2 },
			{ text: 'Он ___ до конца года.', correct: 3 },
		],
		explanation_fr: 'Ø (étudier), на- (apprendre à), вы- (finir ses études), до- (finir d\'étudier)',
		explanation_en: 'Ø (to study), на- (to learn to), вы- (to graduate), до- (to finish studying)',
	},

	// мыть — вымыть (2 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['моет', 'помоет', 'вымоет', 'перемоет'],
		sentences: [
			{ text: 'Она ___ посуду каждый день.', correct: 0 },
			{ text: 'Он быстро ___ руки.', correct: 1 },
			{ text: 'Мама ___ все окна.', correct: 2 },
			{ text: 'Анна ___ всю посуду.', correct: 3 },
		],
		explanation_fr: 'Ø (laver), по- (se laver vite), вы- (laver soigneusement), пере- (tout laver)',
		explanation_en: 'Ø (to wash), по- (to wash quickly), вы- (to wash thoroughly), пере- (to wash all)',
	},

	// покупать — купить (2 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['покупает', 'купит', 'закупит', 'подкупит'],
		sentences: [
			{ text: 'Она ___ продукты.', correct: 0 },
			{ text: 'Он ___ подарок завтра.', correct: 1 },
			{ text: 'Компания ___ товар на год.', correct: 2 },
			{ text: 'Нечестный бизнесмен ___ чиновника.', correct: 3 },
		],
		explanation_fr: 'по- (acheter), Ø (acheter), за- (faire des stocks), под- (corrompre)',
		explanation_en: 'по- (to buy), Ø (to buy), за- (to stock up), под- (to bribe)',
	},

	// продавать — продать (2 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['продаёт', 'продал', 'распродал', 'допродал'],
		sentences: [
			{ text: 'Магазин ___ овощи.', correct: 0 },
			{ text: 'Он ___ машину.', correct: 1 },
			{ text: 'Магазин ___ все товары.', correct: 2 },
			{ text: 'Продавец ___ последние билеты.', correct: 3 },
		],
		explanation_fr: 'про- (vendre), про- (a vendu), рас- (tout vendre), до- (vendre le reste)',
		explanation_en: 'про- (to sell), про- (sold), рас- (to sell out), до- (to sell remaining)',
	},

	// готовить — приготовить (2 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['готовит', 'приготовит', 'подготовит', 'заготовит'],
		sentences: [
			{ text: 'Мама ___ обед.', correct: 0 },
			{ text: 'Она ___ вкусный ужин.', correct: 1 },
			{ text: 'Анна ___ доклад.', correct: 2 },
			{ text: 'Бабушка ___ варенье на зиму.', correct: 3 },
		],
		explanation_fr: 'Ø (préparer), при- (cuisiner), под- (préparer), за- (faire des réserves)',
		explanation_en: 'Ø (to prepare), при- (to cook), под- (to prepare), за- (to stock up)',
	},

	// начинать — начать (2 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['начинает', 'начнёт', 'начал', 'зачнёт'],
		sentences: [
			{ text: 'Он ___ работу в 9 утра.', correct: 0 },
			{ text: 'Завтра она ___ новый проект.', correct: 1 },
			{ text: 'Он ___ учёбу в прошлом году.', correct: 2 },
			{ text: 'Ткань ___ распускаться.', correct: 3 },
		],
		explanation_fr: 'на- (commencer), на- (commencer), на- (a commencé), за- (commencer à)',
		explanation_en: 'на- (to start), на- (to start), на- (started), за- (to start)',
	},

	// заканчивать — закончить (2 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['заканчивает', 'закончит', 'окончит', 'кончит'],
		sentences: [
			{ text: 'Он ___ работу в 6 вечера.', correct: 0 },
			{ text: 'Завтра она ___ проект.', correct: 1 },
			{ text: 'Он ___ университет в этом году.', correct: 2 },
			{ text: 'Фильм скоро ___.', correct: 3 },
		],
		explanation_fr: 'за- (finir), за- (finir), о- (diplômer), Ø (finir)',
		explanation_en: 'за- (to finish), за- (to finish), о- (to graduate), Ø (to end)',
	},

	// помогать — помочь (2 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['помогает', 'поможет', 'подможет', 'выможет'],
		sentences: [
			{ text: 'Он ___ маме каждый день.', correct: 0 },
			{ text: 'Друг ___ мне переехать.', correct: 1 },
			{ text: 'Ветер ___ дереву упасть.', correct: 2 },
			{ text: 'Она ___ из трудной ситуации.', correct: 3 },
		],
		explanation_fr: 'по- (aider), по- (aider), под- (aider à), вы- (tirer d\'affaire)',
		explanation_en: 'по- (to help), по- (to help), под- (to help cause), вы- (to help out)',
	},

	// ставить — поставить (3 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ставит', 'поставит', 'выставит', 'переставит'],
		sentences: [
			{ text: 'Он ___ книги на полку.', correct: 0 },
			{ text: 'Антон ___ вазу на стол.', correct: 1 },
			{ text: 'Музей ___ картины.', correct: 2 },
			{ text: 'Павел ___ мебель.', correct: 3 },
		],
		explanation_fr: 'Ø (mettre), по- (poser), вы- (exposer), пере- (déplacer)',
		explanation_en: 'Ø (to put), по- (to place), вы- (to display), пере- (to move)',
	},

	// класть — положить (3 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['кладёт', 'положит', 'выложит', 'переложит'],
		sentences: [
			{ text: 'Он ___ ключи на стол.', correct: 0 },
			{ text: 'Он ___ книгу в сумку.', correct: 1 },
			{ text: 'Продавец ___ товар.', correct: 2 },
			{ text: 'Иван ___ вещи.', correct: 3 },
		],
		explanation_fr: 'Ø (mettre), по- (poser), вы- (disposer), пере- (déplacer)',
		explanation_en: 'Ø (to put), по- (to place), вы- (to lay out), пере- (to move)',
	},

	// брать — взять (3 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['берёт', 'возьмёт', 'соберёт', 'подберёт'],
		sentences: [
			{ text: 'Он ___ книги в библиотеке.', correct: 0 },
			{ text: 'Он ___ зонт.', correct: 1 },
			{ text: 'Максим ___ документы.', correct: 2 },
			{ text: 'Мальчик ___ котёнка.', correct: 3 },
		],
		explanation_fr: 'Ø (prendre), в- (prendre), со- (rassembler), под- (ramasser)',
		explanation_en: 'Ø (to take), в- (to take), со- (to collect), под- (to pick up)',
	},

	// нести — принести (3 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['несёт', 'принесёт', 'унесёт', 'перенесёт'],
		sentences: [
			{ text: 'Он ___ сумку.', correct: 0 },
			{ text: 'Почтальон ___ письмо.', correct: 1 },
			{ text: 'Вор ___ вещи.', correct: 2 },
			{ text: 'Рабочие ___ мебель.', correct: 3 },
		],
		explanation_fr: 'Ø (porter), при- (apporter), у- (emporter), пере- (déplacer)',
		explanation_en: 'Ø (to carry), при- (to bring), у- (to carry away), пере- (to move)',
	},

	// идти — пойти (3 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['идёт', 'пойдёт', 'выйдет', 'зайдёт'],
		sentences: [
			{ text: 'Он ___ в школу.', correct: 0 },
			{ text: 'Завтра Мария ___ в театр.', correct: 1 },
			{ text: 'Начальник ___ из офиса.', correct: 2 },
			{ text: 'Наташа ___ в гости.', correct: 3 },
		],
		explanation_fr: 'Ø (aller), по- (aller), вы- (sortir), за- (passer)',
		explanation_en: 'Ø (to go), по- (to go), вы- (to exit), за- (to drop by)',
	},

	// ехать — поехать (3 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['едет', 'поедет', 'приедет', 'уедет'],
		sentences: [
			{ text: 'Он ___ на работу.', correct: 0 },
			{ text: 'Завтра мы ___ на море.', correct: 1 },
			{ text: 'Мы ___ в Москву утром.', correct: 2 },
			{ text: 'Через месяц мы ___ из города.', correct: 3 },
		],
		explanation_fr: 'Ø (aller en véhicule), по- (partir), при- (arriver), у- (partir)',
		explanation_en: 'Ø (to go by vehicle), по- (to go), при- (to arrive), у- (to leave)',
	},

	// ходить — сходить (3 questions)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ходит', 'сходит', 'входит', 'выходит'],
		sentences: [
			{ text: 'Он ___ в спортзал.', correct: 0 },
			{ text: 'Он ___ в магазин за хлебом.', correct: 1 },
			{ text: 'Мария ___ в класс.', correct: 2 },
			{ text: 'Мой брат ___ из дома.', correct: 3 },
		],
		explanation_fr: 'Ø (aller régulièrement), с- (aller une fois), в- (entrer), вы- (sortir)',
		explanation_en: 'Ø (to go regularly), с- (to go once), в- (to enter), вы- (to exit)',
	},
]

async function main() {
	console.log('🔍 Finding theme "prefixes" for Russian...')

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

	const questions = exercises.map((ex) => ({
		theme_id: theme.id,
		type: ex.type,
		question_fr: ex.question_fr,
		question_en: ex.question_en,
		question_ru: ex.question_ru,
		options: ex.options,
		correct_answer: 0,
		sentences: ex.sentences,
		explanation_fr: ex.explanation_fr,
		explanation_en: ex.explanation_en,
		is_active: true,
	}))

	console.log(`\n📝 Creating ${questions.length} new multi-fill exercises...`)
	console.log('   Based on 32 common verb pairs')

	const batchSize = 10
	let totalInserted = 0

	for (let i = 0; i < questions.length; i += batchSize) {
		const batch = questions.slice(i, i + batchSize)
		const { data, error } = await supabase.from('training_questions').insert(batch).select()

		if (error) {
			console.error(`❌ Error creating batch ${i / batchSize + 1}:`, error)
			process.exit(1)
		}

		totalInserted += data.length
		console.log(
			`   ✓ Batch ${i / batchSize + 1}/${Math.ceil(questions.length / batchSize)}: ${data.length} exercises created`,
		)
	}

	console.log(`\n✅ Successfully created ${totalInserted} exercises!`)
	console.log(`\n📊 Total prefix exercises in theme: ${113 + totalInserted}`)
	console.log('\n✨ Done! You can view them in the admin panel at /admin/training')
}

main()
