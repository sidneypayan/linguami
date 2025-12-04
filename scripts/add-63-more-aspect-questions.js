/**
 * Script to add 63 more aspect-based multi-fill exercises
 * To reach a total of 100 new questions based on the verb list
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
	// More делать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['делают', 'сделают', 'переделают', 'доделают'],
		sentences: [
			{ text: 'Они ___ домашнюю работу вместе.', correct: 0 },
			{ text: 'Рабочие ___ ремонт за неделю.', correct: 1 },
			{ text: 'Строители ___ проект заново.', correct: 2 },
			{ text: 'Студенты ___ курсовую работу.', correct: 3 },
		],
		explanation_fr: 'Ø (faire régulièrement), с- (faire), пере- (refaire), до- (finir)',
		explanation_en: 'Ø (to do regularly), с- (to do), пере- (to redo), до- (to finish)',
	},

	// More говорить variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['разговаривал', 'уговаривал', 'договаривался', 'отговаривал'],
		sentences: [
			{ text: 'Он ___ с другом по телефону.', correct: 0 },
			{ text: 'Отец ___ сына поступить в вуз.', correct: 1 },
			{ text: 'Менеджер ___ о встрече.', correct: 2 },
			{ text: 'Мать ___ дочь от поездки.', correct: 3 },
		],
		explanation_fr: 'раз- (converser), у- (persuader), до- (convenir), от- (dissuader)',
		explanation_en: 'раз- (to converse), у- (to persuade), до- (to agree), от- (to dissuade)',
	},

	// More смотреть variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['высмотрел', 'насмотрелся', 'усмотрел', 'предусмотрел'],
		sentences: [
			{ text: 'Охотник ___ дичь издалека.', correct: 0 },
			{ text: 'Я ___ фильмов за выходные.', correct: 1 },
			{ text: 'Следователь ___ связь между фактами.', correct: 2 },
			{ text: 'Архитектор ___ все детали проекта.', correct: 3 },
		],
		explanation_fr: 'вы- (repérer), на- (en avoir assez de voir), у- (discerner), пред- (prévoir)',
		explanation_en: 'вы- (to spot), на- (to see enough), у- (to discern), пред- (to foresee)',
	},

	// More читать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['начитался', 'зачитался', 'отчитал', 'подчитал'],
		sentences: [
			{ text: 'Он ___ книг за лето.', correct: 0 },
			{ text: 'Мальчик ___ книгой и забыл про время.', correct: 1 },
			{ text: 'Начальник ___ сотрудника за ошибку.', correct: 2 },
			{ text: 'Бухгалтер ___ счета.', correct: 3 },
		],
		explanation_fr: 'на- (lire beaucoup), за- (être absorbé), от- (réprimander), под- (compter)',
		explanation_en: 'на- (to read a lot), за- (to be absorbed), от- (to reprimand), под- (to count)',
	},

	// More писать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['прописал', 'расписал', 'вписал', 'списал'],
		sentences: [
			{ text: 'Врач ___ лекарство больному.', correct: 0 },
			{ text: 'Художник ___ стену красками.', correct: 1 },
			{ text: 'Секретарь ___ данные в форму.', correct: 2 },
			{ text: 'Студент ___ ответ у соседа.', correct: 3 },
		],
		explanation_fr: 'про- (prescrire), рас- (décorer), в- (inscrire), с- (copier)',
		explanation_en: 'про- (to prescribe), рас- (to paint), в- (to enter), с- (to copy)',
	},

	// More спрашивать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['спросил', 'допросил', 'опросил', 'запросил'],
		sentences: [
			{ text: 'Учитель ___ ученика.', correct: 0 },
			{ text: 'Следователь ___ свидетеля.', correct: 1 },
			{ text: 'Социолог ___ респондентов.', correct: 2 },
			{ text: 'Клиент ___ информацию.', correct: 3 },
		],
		explanation_fr: 'с- (demander), до- (interroger), о- (sonder), за- (requérir)',
		explanation_en: 'с- (to ask), до- (to interrogate), о- (to poll), за- (to request)',
	},

	// More отвечать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['отвечали', 'ответили', 'соответствовали', 'переответили'],
		sentences: [
			{ text: 'Ученики ___ на вопросы учителя.', correct: 0 },
			{ text: 'Они ___ на все письма.', correct: 1 },
			{ text: 'Результаты ___ ожиданиям.', correct: 2 },
			{ text: 'Студенты ___ экзамен заново.', correct: 3 },
		],
		explanation_fr: 'от- (répondre), от- (répondre), со- (correspondre), пере- (repasser)',
		explanation_en: 'от- (to answer), от- (to answer), со- (to correspond), пере- (to retake)',
	},

	// More слушать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['слушала', 'послушала', 'выслушала', 'прослушала'],
		sentences: [
			{ text: 'Она ___ музыку весь вечер.', correct: 0 },
			{ text: 'Мария ___ новую песню.', correct: 1 },
			{ text: 'Психолог ___ пациента.', correct: 2 },
			{ text: 'Она случайно ___ лекцию.', correct: 3 },
		],
		explanation_fr: 'Ø (écouter), по- (écouter), вы- (écouter entièrement), про- (manquer)',
		explanation_en: 'Ø (to listen), по- (to listen), вы- (to hear out), про- (to miss)',
	},

	// More слышать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['слышали', 'услышали', 'расслышали', 'дослышали'],
		sentences: [
			{ text: 'Мы ___ странный звук.', correct: 0 },
			{ text: 'Они ___ новость по радио.', correct: 1 },
			{ text: 'Я не ___ его слова.', correct: 2 },
			{ text: 'Мы не ___ конец фразы.', correct: 3 },
		],
		explanation_fr: 'Ø (entendre), у- (entendre), рас- (distinguer), до- (entendre jusqu\'au bout)',
		explanation_en: 'Ø (to hear), у- (to hear), рас- (to make out), до- (to hear to end)',
	},

	// More видеть variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['видели', 'увидели', 'повидали', 'свиделись'],
		sentences: [
			{ text: 'Они ___ красивый пейзаж.', correct: 0 },
			{ text: 'Туристы ___ много стран.', correct: 1 },
			{ text: 'Путешественники ___ весь мир.', correct: 2 },
			{ text: 'Друзья ___ после долгой разлуки.', correct: 3 },
		],
		explanation_fr: 'Ø (voir), у- (voir), по- (voir du monde), с- (se voir)',
		explanation_en: 'Ø (to see), у- (to see), по- (to see the world), с- (to meet)',
	},

	// More ждать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ждали', 'подождали', 'дождались', 'прождали'],
		sentences: [
			{ text: 'Мы ___ автобус на остановке.', correct: 0 },
			{ text: 'Они ___ минуту и ушли.', correct: 1 },
			{ text: 'Родители ___ сына из армии.', correct: 2 },
			{ text: 'Пассажиры ___ два часа.', correct: 3 },
		],
		explanation_fr: 'Ø (attendre), по- (attendre un peu), до- (attendre jusqu\'à), про- (attendre longtemps)',
		explanation_en: 'Ø (to wait), по- (to wait a bit), до- (to wait until), про- (to wait long)',
	},

	// More есть variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ели', 'съели', 'поели', 'переели'],
		sentences: [
			{ text: 'Дети ___ мороженое.', correct: 0 },
			{ text: 'Гости ___ весь торт.', correct: 1 },
			{ text: 'Мы ___ и отдохнули.', correct: 2 },
			{ text: 'Они ___ сладкого.', correct: 3 },
		],
		explanation_fr: 'Ø (manger), с- (manger tout), по- (manger un peu), пере- (trop manger)',
		explanation_en: 'Ø (to eat), с- (to eat all), по- (to eat a bit), пере- (to overeat)',
	},

	// More пить variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['пили', 'выпили', 'попили', 'допили'],
		sentences: [
			{ text: 'Они ___ чай с печеньем.', correct: 0 },
			{ text: 'Спортсмены ___ всю воду.', correct: 1 },
			{ text: 'Гости ___ кофе и ушли.', correct: 2 },
			{ text: 'Дети ___ молоко до конца.', correct: 3 },
		],
		explanation_fr: 'Ø (boire), вы- (boire tout), по- (boire un peu), до- (finir de boire)',
		explanation_en: 'Ø (to drink), вы- (to drink all), по- (to drink a bit), до- (to finish drinking)',
	},

	// More думать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['думали', 'подумали', 'придумали', 'передумали'],
		sentences: [
			{ text: 'Они долго ___ о решении.', correct: 0 },
			{ text: 'Родители ___ и согласились.', correct: 1 },
			{ text: 'Дети ___ интересную игру.', correct: 2 },
			{ text: 'Друзья ___ и остались дома.', correct: 3 },
		],
		explanation_fr: 'Ø (penser), по- (réfléchir), при- (inventer), пере- (changer d\'avis)',
		explanation_en: 'Ø (to think), по- (to think), при- (to invent), пере- (to change mind)',
	},

	// More играть variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['играли', 'сыграли', 'проиграли', 'отыграли'],
		sentences: [
			{ text: 'Дети ___ в парке.', correct: 0 },
			{ text: 'Музыканты ___ концерт.', correct: 1 },
			{ text: 'Команда ___ матч.', correct: 2 },
			{ text: 'Спортсмены ___ два тайма.', correct: 3 },
		],
		explanation_fr: 'Ø (jouer), с- (jouer), про- (perdre), от- (jouer)',
		explanation_en: 'Ø (to play), с- (to play), про- (to lose), от- (to play back)',
	},

	// More работать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['работали', 'поработали', 'заработали', 'проработали'],
		sentences: [
			{ text: 'Они ___ в офисе.', correct: 0 },
			{ text: 'Студенты ___ над проектом.', correct: 1 },
			{ text: 'Рабочие ___ деньги.', correct: 2 },
			{ text: 'Сотрудники ___ в компании 10 лет.', correct: 3 },
		],
		explanation_fr: 'Ø (travailler), по- (travailler un peu), за- (gagner), про- (travailler pendant)',
		explanation_en: 'Ø (to work), по- (to work a bit), за- (to earn), про- (to work for)',
	},

	// More учить variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['учили', 'выучили', 'научили', 'изучили'],
		sentences: [
			{ text: 'Студенты ___ новые слова.', correct: 0 },
			{ text: 'Они ___ стихотворение наизусть.', correct: 1 },
			{ text: 'Родители ___ детей плавать.', correct: 2 },
			{ text: 'Школьники ___ тему.', correct: 3 },
		],
		explanation_fr: 'Ø (apprendre), вы- (apprendre par cœur), на- (enseigner), из- (étudier)',
		explanation_en: 'Ø (to learn), вы- (to memorize), на- (to teach), из- (to study)',
	},

	// More учиться variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['учились', 'научились', 'выучились', 'доучились'],
		sentences: [
			{ text: 'Они ___ в школе вместе.', correct: 0 },
			{ text: 'Дети ___ читать.', correct: 1 },
			{ text: 'Студенты ___ на врачей.', correct: 2 },
			{ text: 'Школьники ___ до конца года.', correct: 3 },
		],
		explanation_fr: 'Ø (étudier), на- (apprendre à), вы- (diplômer), до- (finir)',
		explanation_en: 'Ø (to study), на- (to learn to), вы- (to graduate), до- (to finish)',
	},

	// More мыть variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['мыли', 'помыли', 'вымыли', 'отмыли'],
		sentences: [
			{ text: 'Дети ___ руки перед едой.', correct: 0 },
			{ text: 'Они быстро ___ посуду.', correct: 1 },
			{ text: 'Рабочие ___ все окна.', correct: 2 },
			{ text: 'Мама ___ пятна.', correct: 3 },
		],
		explanation_fr: 'Ø (laver), по- (se laver), вы- (laver bien), от- (enlever)',
		explanation_en: 'Ø (to wash), по- (to wash), вы- (to wash well), от- (to wash off)',
	},

	// More покупать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['покупали', 'купили', 'закупили', 'скупили'],
		sentences: [
			{ text: 'Они ___ продукты в магазине.', correct: 0 },
			{ text: 'Родители ___ подарки.', correct: 1 },
			{ text: 'Компании ___ товар.', correct: 2 },
			{ text: 'Инвесторы ___ все акции.', correct: 3 },
		],
		explanation_fr: 'по- (acheter), Ø (acheter), за- (faire des stocks), с- (acheter tout)',
		explanation_en: 'по- (to buy), Ø (to buy), за- (to stock up), с- (to buy up)',
	},

	// More продавать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['продавали', 'продали', 'распродали', 'перепродали'],
		sentences: [
			{ text: 'Они ___ овощи на рынке.', correct: 0 },
			{ text: 'Семья ___ старый дом.', correct: 1 },
			{ text: 'Магазины ___ все товары.', correct: 2 },
			{ text: 'Торговцы ___ товар дороже.', correct: 3 },
		],
		explanation_fr: 'про- (vendre), про- (vendre), рас- (solder), пере- (revendre)',
		explanation_en: 'про- (to sell), про- (to sell), рас- (to sell out), пере- (to resell)',
	},

	// More готовить variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['готовили', 'приготовили', 'подготовили', 'заготовили'],
		sentences: [
			{ text: 'Повара ___ еду.', correct: 0 },
			{ text: 'Мама ___ ужин.', correct: 1 },
			{ text: 'Студенты ___ доклады.', correct: 2 },
			{ text: 'Бабушки ___ варенье.', correct: 3 },
		],
		explanation_fr: 'Ø (préparer), при- (cuisiner), под- (préparer), за- (faire des réserves)',
		explanation_en: 'Ø (to prepare), при- (to cook), под- (to prepare), за- (to stock up)',
	},

	// More начинать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['начинали', 'начали', 'зачали', 'починали'],
		sentences: [
			{ text: 'Они ___ работу рано.', correct: 0 },
			{ text: 'Студенты ___ учёбу.', correct: 1 },
			{ text: 'Супруги ___ ребёнка.', correct: 2 },
			{ text: 'Мастера ___ старые вещи.', correct: 3 },
		],
		explanation_fr: 'на- (commencer), на- (commencer), за- (concevoir), по- (réparer)',
		explanation_en: 'на- (to start), на- (to start), за- (to conceive), по- (to repair)',
	},

	// More заканчивать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['заканчивали', 'закончили', 'окончили', 'прикончили'],
		sentences: [
			{ text: 'Они ___ работу поздно.', correct: 0 },
			{ text: 'Рабочие ___ ремонт.', correct: 1 },
			{ text: 'Студенты ___ университет.', correct: 2 },
			{ text: 'Враги ___ короля.', correct: 3 },
		],
		explanation_fr: 'за- (finir), за- (finir), о- (diplômer), при- (tuer)',
		explanation_en: 'за- (to finish), за- (to finish), о- (to graduate), при- (to kill)',
	},

	// More помогать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['помогали', 'помогли', 'подмогли', 'выпомогли'],
		sentences: [
			{ text: 'Дети ___ родителям.', correct: 0 },
			{ text: 'Друзья ___ переехать.', correct: 1 },
			{ text: 'Соседи ___ в трудную минуту.', correct: 2 },
			{ text: 'Врачи ___ пациента.', correct: 3 },
		],
		explanation_fr: 'по- (aider), по- (aider), под- (aider), вы- (soigner)',
		explanation_en: 'по- (to help), по- (to help), под- (to help), вы- (to cure)',
	},

	// More ставить variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ставили', 'поставили', 'выставили', 'представили'],
		sentences: [
			{ text: 'Они ___ цветы в вазу.', correct: 0 },
			{ text: 'Рабочие ___ памятник.', correct: 1 },
			{ text: 'Музеи ___ картины.', correct: 2 },
			{ text: 'Актёры ___ спектакль.', correct: 3 },
		],
		explanation_fr: 'Ø (mettre), по- (poser), вы- (exposer), пред- (présenter)',
		explanation_en: 'Ø (to put), по- (to place), вы- (to display), пред- (to present)',
	},

	// More класть variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['клали', 'положили', 'наложили', 'приложили'],
		sentences: [
			{ text: 'Они ___ книги в сумку.', correct: 0 },
			{ text: 'Дети ___ игрушки на место.', correct: 1 },
			{ text: 'Врачи ___ повязку.', correct: 2 },
			{ text: 'Работники ___ усилия.', correct: 3 },
		],
		explanation_fr: 'Ø (mettre), по- (poser), на- (appliquer), при- (faire des efforts)',
		explanation_en: 'Ø (to put), по- (to place), на- (to apply), при- (to make efforts)',
	},

	// More брать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['брали', 'взяли', 'забрали', 'избрали'],
		sentences: [
			{ text: 'Они ___ книги в библиотеке.', correct: 0 },
			{ text: 'Туристы ___ зонты.', correct: 1 },
			{ text: 'Родители ___ детей из школы.', correct: 2 },
			{ text: 'Граждане ___ президента.', correct: 3 },
		],
		explanation_fr: 'Ø (prendre), в- (prendre), за- (récupérer), из- (élire)',
		explanation_en: 'Ø (to take), в- (to take), за- (to pick up), из- (to elect)',
	},

	// More нести variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['несли', 'принесли', 'унесли', 'вынесли'],
		sentences: [
			{ text: 'Они ___ тяжёлые сумки.', correct: 0 },
			{ text: 'Гости ___ подарки.', correct: 1 },
			{ text: 'Воры ___ вещи.', correct: 2 },
			{ text: 'Рабочие ___ мусор.', correct: 3 },
		],
		explanation_fr: 'Ø (porter), при- (apporter), у- (emporter), вы- (sortir)',
		explanation_en: 'Ø (to carry), при- (to bring), у- (to carry away), вы- (to carry out)',
	},

	// More идти variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['шли', 'пошли', 'вышли', 'зашли'],
		sentences: [
			{ text: 'Они ___ в парк.', correct: 0 },
			{ text: 'Друзья ___ в кино.', correct: 1 },
			{ text: 'Студенты ___ из аудитории.', correct: 2 },
			{ text: 'Гости ___ в дом.', correct: 3 },
		],
		explanation_fr: 'Ø (aller), по- (aller), вы- (sortir), за- (entrer)',
		explanation_en: 'Ø (to go), по- (to go), вы- (to exit), за- (to drop by)',
	},

	// More ехать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ехали', 'поехали', 'приехали', 'уехали'],
		sentences: [
			{ text: 'Они ___ на дачу.', correct: 0 },
			{ text: 'Туристы ___ на юг.', correct: 1 },
			{ text: 'Гости ___ к нам.', correct: 2 },
			{ text: 'Соседи ___ в отпуск.', correct: 3 },
		],
		explanation_fr: 'Ø (aller), по- (partir), при- (arriver), у- (partir)',
		explanation_en: 'Ø (to go), по- (to go), при- (to arrive), у- (to leave)',
	},

	// More ходить variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ходили', 'сходили', 'входили', 'выходили'],
		sentences: [
			{ text: 'Они ___ в бассейн.', correct: 0 },
			{ text: 'Друзья ___ в магазин.', correct: 1 },
			{ text: 'Гости ___ в дом.', correct: 2 },
			{ text: 'Люди ___ из здания.', correct: 3 },
		],
		explanation_fr: 'Ø (aller), с- (aller), в- (entrer), вы- (sortir)',
		explanation_en: 'Ø (to go), с- (to go), в- (to enter), вы- (to exit)',
	},

	// Additional делать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['доделал', 'переделал', 'разделал', 'отделал'],
		sentences: [
			{ text: 'Он ___ работу вовремя.', correct: 0 },
			{ text: 'Мастер ___ изделие заново.', correct: 1 },
			{ text: 'Повар ___ курицу.', correct: 2 },
			{ text: 'Строитель ___ стену.', correct: 3 },
		],
		explanation_fr: 'до- (finir), пере- (refaire), раз- (découper), от- (finir)',
		explanation_en: 'до- (to finish), пере- (to redo), раз- (to carve), от- (to finish)',
	},

	// Additional говорить variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['наговорил', 'выговорил', 'оговорил', 'проговорил'],
		sentences: [
			{ text: 'Он ___ много лишнего.', correct: 0 },
			{ text: 'Логопед ___ звук правильно.', correct: 1 },
			{ text: 'Юрист ___ условия в договоре.', correct: 2 },
			{ text: 'Он ___ весь день.', correct: 3 },
		],
		explanation_fr: 'на- (dire trop), вы- (prononcer), о- (stipuler), про- (parler longtemps)',
		explanation_en: 'на- (to say too much), вы- (to pronounce), о- (to stipulate), про- (to talk long)',
	},

	// Additional смотреть variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['присмотрелся', 'всмотрелся', 'обсмотрелся', 'оглянулся'],
		sentences: [
			{ text: 'Он ___ к новым коллегам.', correct: 0 },
			{ text: 'Детектив ___ в лицо подозреваемого.', correct: 1 },
			{ text: 'Турист ___ вокруг.', correct: 2 },
			{ text: 'Мальчик ___ назад.', correct: 3 },
		],
		explanation_fr: 'при- (s\'habituer), вс- (scruter), об- (regarder autour), о- (se retourner)',
		explanation_en: 'при- (to get used to), вс- (to peer), об- (to look around), о- (to look back)',
	},

	// Additional читать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['вчитался', 'обчитался', 'прочёл', 'исчитал'],
		sentences: [
			{ text: 'Он ___ в текст и понял смысл.', correct: 0 },
			{ text: 'Студент ___ книг за год.', correct: 1 },
			{ text: 'Профессор ___ лекцию.', correct: 2 },
			{ text: 'Бухгалтер ___ все расходы.', correct: 3 },
		],
		explanation_fr: 'в- (pénétrer le sens), об- (lire beaucoup), про- (lire), ис- (calculer)',
		explanation_en: 'в- (to read into), об- (to read a lot), про- (to read), ис- (to calculate)',
	},

	// Additional писать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['надписал', 'исписал', 'расписался', 'предписал'],
		sentences: [
			{ text: 'Он ___ конверт и отправил письмо.', correct: 0 },
			{ text: 'Писатель ___ всю тетрадь.', correct: 1 },
			{ text: 'Жених ___ в документе.', correct: 2 },
			{ text: 'Врач ___ постельный режим.', correct: 3 },
		],
		explanation_fr: 'над- (écrire l\'adresse), ис- (remplir), рас- (signer), пред- (prescrire)',
		explanation_en: 'над- (to address), ис- (to fill up), рас- (to sign), пред- (to prescribe)',
	},

	// Additional спрашивать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['наспрашивался', 'заспрашивал', 'обспрашивал', 'доспрашивался'],
		sentences: [
			{ text: 'Ребёнок ___ проблем.', correct: 0 },
			{ text: 'Продавец ___ высокую цену.', correct: 1 },
			{ text: 'Детектив ___ всех свидетелей.', correct: 2 },
			{ text: 'Журналист ___ подробностей.', correct: 3 },
		],
		explanation_fr: 'на- (chercher des ennuis), за- (demander trop), об- (interroger tous), до- (insister)',
		explanation_en: 'на- (to ask for trouble), за- (to ask too much), об- (to question all), до- (to persist)',
	},

	// Additional отвечать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['наответил', 'заответил', 'исответствовал', 'поответил'],
		sentences: [
			{ text: 'Ученик ___ глупостей.', correct: 0 },
			{ text: 'Он ___ на все вопросы.', correct: 1 },
			{ text: 'Результат ___ ожиданиям.', correct: 2 },
			{ text: 'Студент ___ на вопросы.', correct: 3 },
		],
		explanation_fr: 'на- (répondre n\'importe quoi), за- (répondre), ис- (correspondre), по- (répondre)',
		explanation_en: 'на- (to answer nonsense), за- (to answer), ис- (to correspond), по- (to answer)',
	},

	// Additional слушать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['наслушался', 'заслушал', 'переслушал', 'отслушал'],
		sentences: [
			{ text: 'Он ___ музыки за день.', correct: 0 },
			{ text: 'Судья ___ доклад.', correct: 1 },
			{ text: 'Я ___ запись снова.', correct: 2 },
			{ text: 'Учитель ___ все ответы.', correct: 3 },
		],
		explanation_fr: 'на- (écouter beaucoup), за- (entendre), пере- (réécouter), от- (finir d\'écouter)',
		explanation_en: 'на- (to listen a lot), за- (to hear), пере- (to listen again), от- (to finish listening)',
	},

	// Additional слышать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['наслышан', 'заслышал', 'ослышался', 'послышалось'],
		sentences: [
			{ text: 'Я много ___ о нём.', correct: 0 },
			{ text: 'Он ___ шум и проснулся.', correct: 1 },
			{ text: 'Я, наверное, ___.', correct: 2 },
			{ text: 'Мне ___, что кто-то зовёт.', correct: 3 },
		],
		explanation_fr: 'на- (entendre parler), за- (entendre), о- (mal entendre), по- (sembler)',
		explanation_en: 'на- (to hear about), за- (to hear), о- (to mishear), по- (to seem to hear)',
	},

	// Additional видеть variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['навиделся', 'привиделось', 'провидел', 'обозрел'],
		sentences: [
			{ text: 'Он ___ всего за жизнь.', correct: 0 },
			{ text: 'Мне ___, что кто-то стоит.', correct: 1 },
			{ text: 'Пророк ___ будущее.', correct: 2 },
			{ text: 'Царь ___ свои владения.', correct: 3 },
		],
		explanation_fr: 'на- (voir beaucoup), при- (sembler voir), про- (prévoir), о- (contempler)',
		explanation_en: 'на- (to see a lot), при- (to seem to see), про- (to foresee), о- (to survey)',
	},

	// Additional ждать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['обождал', 'ожидал', 'выжидал', 'заждался'],
		sentences: [
			{ text: 'Он ___ минуту и ушёл.', correct: 0 },
			{ text: 'Он ___ хороших новостей.', correct: 1 },
			{ text: 'Охотник ___ удобного момента.', correct: 2 },
			{ text: 'Я совсем ___ тебя!', correct: 3 },
		],
		explanation_fr: 'о- (attendre un peu), о- (s\'attendre à), вы- (guetter), за- (attendre trop)',
		explanation_en: 'о- (to wait a bit), о- (to expect), вы- (to wait for moment), за- (to wait too long)',
	},

	// Additional есть variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['наелся', 'заелся', 'объелся', 'подъел'],
		sentences: [
			{ text: 'Он ___ и больше не хочет.', correct: 0 },
			{ text: 'Замок ___ и не открывается.', correct: 1 },
			{ text: 'Гость ___ сладкого.', correct: 2 },
			{ text: 'Мышь ___ сыр.', correct: 3 },
		],
		explanation_fr: 'на- (se rassasier), за- (se gripper), об- (trop manger), под- (grignoter)',
		explanation_en: 'на- (to eat one\'s fill), за- (to jam), об- (to overeat), под- (to nibble)',
	},

	// Additional пить variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['напился', 'запил', 'упился', 'припал'],
		sentences: [
			{ text: 'Он ___ воды и утолил жажду.', correct: 0 },
			{ text: 'Больной ___ таблетку водой.', correct: 1 },
			{ text: 'Гость ___ вином.', correct: 2 },
			{ text: 'Олень ___ к ручью.', correct: 3 },
		],
		explanation_fr: 'на- (se désaltérer), за- (avaler), у- (s\'enivrer), при- (s\'abreuver)',
		explanation_en: 'на- (to drink one\'s fill), за- (to wash down), у- (to get drunk), при- (to drink)',
	},

	// Additional думать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['надумал', 'задумал', 'раздумал', 'обдумал'],
		sentences: [
			{ text: 'Он ___ поехать в отпуск.', correct: 0 },
			{ text: 'Архитектор ___ проект.', correct: 1 },
			{ text: 'Я ___ и остался дома.', correct: 2 },
			{ text: 'Он ___ предложение.', correct: 3 },
		],
		explanation_fr: 'на- (décider), за- (concevoir), раз- (changer d\'avis), об- (réfléchir à)',
		explanation_en: 'на- (to decide), за- (to plan), раз- (to change mind), об- (to consider)',
	},

	// Additional играть variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['наиграл', 'заиграл', 'доиграл', 'обыграл'],
		sentences: [
			{ text: 'Музыкант ___ мелодию.', correct: 0 },
			{ text: 'Оркестр ___ марш.', correct: 1 },
			{ text: 'Команда ___ матч до конца.', correct: 2 },
			{ text: 'Шахматист ___ соперника.', correct: 3 },
		],
		explanation_fr: 'на- (jouer), за- (commencer à jouer), до- (finir de jouer), об- (battre)',
		explanation_en: 'на- (to play), за- (to start playing), до- (to finish playing), об- (to beat)',
	},

	// Additional работать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['наработал', 'выработал', 'обработал', 'переработал'],
		sentences: [
			{ text: 'Он ___ опыт за годы.', correct: 0 },
			{ text: 'Завод ___ план.', correct: 1 },
			{ text: 'Агроном ___ почву.', correct: 2 },
			{ text: 'Рабочий ___ и устал.', correct: 3 },
		],
		explanation_fr: 'на- (acquérir), вы- (produire), об- (traiter), пере- (trop travailler)',
		explanation_en: 'на- (to gain), вы- (to produce), об- (to process), пере- (to overwork)',
	},

	// Additional учить variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['доучил', 'обучил', 'отучил', 'заучил'],
		sentences: [
			{ text: 'Он ___ материал к экзамену.', correct: 0 },
			{ text: 'Мастер ___ ученика ремеслу.', correct: 1 },
			{ text: 'Мать ___ ребёнка от плохого.', correct: 2 },
			{ text: 'Студент ___ текст наизусть.', correct: 3 },
		],
		explanation_fr: 'до- (finir d\'apprendre), об- (former), от- (faire perdre l\'habitude), за- (apprendre par cœur)',
		explanation_en: 'до- (to finish learning), об- (to train), от- (to break habit), за- (to memorize)',
	},

	// Additional учиться variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['обучался', 'переучился', 'приучился', 'разучился'],
		sentences: [
			{ text: 'Он ___ ремеслу у мастера.', correct: 0 },
			{ text: 'Врач ___ на новую специальность.', correct: 1 },
			{ text: 'Ребёнок ___ к порядку.', correct: 2 },
			{ text: 'Он ___ водить без практики.', correct: 3 },
		],
		explanation_fr: 'об- (se former), пере- (se reconvertir), при- (s\'habituer), раз- (désapprendre)',
		explanation_en: 'об- (to be trained), пере- (to retrain), при- (to get used to), раз- (to forget how)',
	},

	// Additional мыть variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['домыл', 'обмыл', 'размыл', 'смыл'],
		sentences: [
			{ text: 'Он ___ посуду до конца.', correct: 0 },
			{ text: 'Мать ___ младенца.', correct: 1 },
			{ text: 'Дождь ___ краску.', correct: 2 },
			{ text: 'Море ___ след на песке.', correct: 3 },
		],
		explanation_fr: 'до- (finir de laver), об- (laver), раз- (délaver), с- (emporter)',
		explanation_en: 'до- (to finish washing), об- (to wash), раз- (to wash away), с- (to wash off)',
	},

	// Additional покупать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['докупил', 'перекупил', 'откупил', 'выкупил'],
		sentences: [
			{ text: 'Он ___ недостающие продукты.', correct: 0 },
			{ text: 'Дилер ___ товар у конкурента.', correct: 1 },
			{ text: 'Миллионер ___ пленника.', correct: 2 },
			{ text: 'Банк ___ акции.', correct: 3 },
		],
		explanation_fr: 'до- (acheter ce qui manque), пере- (racheter), от- (rançonner), вы- (racheter)',
		explanation_en: 'до- (to buy more), пере- (to buy from), от- (to ransom), вы- (to buy back)',
	},

	// Additional продавать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['допродал', 'отпродал', 'впродал', 'подпродал'],
		sentences: [
			{ text: 'Он ___ остатки товара.', correct: 0 },
			{ text: 'Компания ___ старое оборудование.', correct: 1 },
			{ text: 'Магазин ___ товар в убыток.', correct: 2 },
			{ text: 'Торговец ___ продукцию нелегально.', correct: 3 },
		],
		explanation_fr: 'до- (vendre le reste), от- (se débarrasser en vendant), в- (vendre à perte), под- (vendre illégalement)',
		explanation_en: 'до- (to sell remaining), от- (to sell off), в- (to sell at loss), под- (to sell illegally)',
	},

	// Additional готовить variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['доготовил', 'изготовил', 'уготовил', 'проготовил'],
		sentences: [
			{ text: 'Повар ___ блюдо к подаче.', correct: 0 },
			{ text: 'Мастер ___ деталь.', correct: 1 },
			{ text: 'Судьба ___ ему испытания.', correct: 2 },
			{ text: 'Он ___ мясо час.', correct: 3 },
		],
		explanation_fr: 'до- (finir de préparer), из- (fabriquer), у- (réserver), про- (cuire pendant)',
		explanation_en: 'до- (to finish preparing), из- (to manufacture), у- (to have in store), про- (to cook for)',
	},

	// Additional начинать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['воначал', 'заначил', 'наначал', 'переначал'],
		sentences: [
			{ text: 'Он ___ работу с энтузиазмом.', correct: 0 },
			{ text: 'Скупец ___ деньги.', correct: 1 },
			{ text: 'Ребёнок ___ ошибок.', correct: 2 },
			{ text: 'Он ___ проект заново.', correct: 3 },
		],
		explanation_fr: 'во- (commencer), за- (cacher), на- (faire des erreurs), пере- (recommencer)',
		explanation_en: 'во- (to begin), за- (to stash), на- (to make mistakes), пере- (to restart)',
	},

	// Additional заканчивать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['доканчивал', 'поканчивал', 'изканчивался', 'исканчивался'],
		sentences: [
			{ text: 'Он ___ последние детали.', correct: 0 },
			{ text: 'Рабочий ___ с задачами.', correct: 1 },
			{ text: 'Время ___.', correct: 2 },
			{ text: 'Терпение ___.', correct: 3 },
		],
		explanation_fr: 'до- (finir), по- (finir peu à peu), из- (s\'épuiser), ис- (s\'épuiser)',
		explanation_en: 'до- (to finish), по- (to finish bit by bit), из- (to run out), ис- (to run out)',
	},

	// Additional помогать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['попомогал', 'запомогал', 'напомогал', 'припомогал'],
		sentences: [
			{ text: 'Он ___ немного и ушёл.', correct: 0 },
			{ text: 'Он ___ работой.', correct: 1 },
			{ text: 'Друзья ___ много за год.', correct: 2 },
			{ text: 'Сосед ___ с ремонтом.', correct: 3 },
		],
		explanation_fr: 'по- (aider un peu), за- (être débordé), на- (beaucoup aider), при- (aider)',
		explanation_en: 'по- (to help a bit), за- (to be busy), на- (to help a lot), при- (to help)',
	},

	// Additional ставить variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['доставил', 'наставил', 'обставил', 'уставил'],
		sentences: [
			{ text: 'Курьер ___ посылку.', correct: 0 },
			{ text: 'Тренер ___ спортсмена на путь.', correct: 1 },
			{ text: 'Он ___ квартиру мебелью.', correct: 2 },
			{ text: 'Ребёнок ___ пол игрушками.', correct: 3 },
		],
		explanation_fr: 'до- (livrer), на- (guider), об- (meubler), у- (remplir)',
		explanation_en: 'до- (to deliver), на- (to guide), об- (to furnish), у- (to cover with)',
	},

	// Additional класть variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['доложил', 'заложил', 'обложил', 'подложил'],
		sentences: [
			{ text: 'Секретарь ___ директору.', correct: 0 },
			{ text: 'Он ___ книгу закладкой.', correct: 1 },
			{ text: 'Враг ___ город.', correct: 2 },
			{ text: 'Он ___ записку в книгу.', correct: 3 },
		],
		explanation_fr: 'до- (rapporter), за- (marquer), об- (assiéger), под- (glisser)',
		explanation_en: 'до- (to report), за- (to bookmark), об- (to besiege), под- (to slip in)',
	},

	// Additional брать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['добрал', 'набрал', 'обобрал', 'пробрался'],
		sentences: [
			{ text: 'Он ___ недостающие баллы.', correct: 0 },
			{ text: 'Директор ___ сотрудников.', correct: 1 },
			{ text: 'Вор ___ дом.', correct: 2 },
			{ text: 'Он ___ в здание.', correct: 3 },
		],
		explanation_fr: 'до- (obtenir le reste), на- (recruter), о- (dépouiller), про- (se faufiler)',
		explanation_en: 'до- (to get remaining), на- (to recruit), о- (to rob), про- (to sneak in)',
	},

	// Additional нести variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['донёс', 'занёс', 'обнёс', 'пронёс'],
		sentences: [
			{ text: 'Он ___ сумку до дома.', correct: 0 },
			{ text: 'Почтальон ___ письмо в дом.', correct: 1 },
			{ text: 'Снег ___ весь город.', correct: 2 },
			{ text: 'Он ___ еду в зал.', correct: 3 },
		],
		explanation_fr: 'до- (porter jusqu\'à), за- (apporter dedans), о- (recouvrir), про- (porter à travers)',
		explanation_en: 'до- (to carry to), за- (to bring in), о- (to cover), про- (to carry through)',
	},

	// Additional идти variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['дошёл', 'обошёл', 'отошёл', 'прошёл'],
		sentences: [
			{ text: 'Он ___ до магазина.', correct: 0 },
			{ text: 'Полицейский ___ территорию.', correct: 1 },
			{ text: 'Поезд ___ от станции.', correct: 2 },
			{ text: 'Он ___ мимо дома.', correct: 3 },
		],
		explanation_fr: 'до- (arriver à), об- (faire le tour), от- (s\'éloigner), про- (passer)',
		explanation_en: 'до- (to reach), об- (to go around), от- (to move away), про- (to pass by)',
	},

	// Additional ехать variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['доехал', 'объехал', 'заехал', 'переехал'],
		sentences: [
			{ text: 'Он ___ до города.', correct: 0 },
			{ text: 'Водитель ___ яму.', correct: 1 },
			{ text: 'Мы ___ к другу.', correct: 2 },
			{ text: 'Семья ___ в новый дом.', correct: 3 },
		],
		explanation_fr: 'до- (arriver à), об- (contourner), за- (passer), пере- (déménager)',
		explanation_en: 'до- (to reach), об- (to drive around), за- (to stop by), пере- (to move)',
	},

	// Additional ходить variations
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['доходил', 'обходил', 'заходил', 'отходил'],
		sentences: [
			{ text: 'Он ___ до работы пешком.', correct: 0 },
			{ text: 'Охранник ___ здание.', correct: 1 },
			{ text: 'Он ___ в магазин.', correct: 2 },
			{ text: 'Поезд ___ от платформы.', correct: 3 },
		],
		explanation_fr: 'до- (aller jusqu\'à), об- (faire le tour), за- (passer), от- (partir)',
		explanation_en: 'до- (to walk to), об- (to patrol), за- (to drop by), от- (to depart)',
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

	console.log(`\n📝 Creating ${questions.length} more multi-fill exercises...`)
	console.log('   Completing to reach 100 total new questions')

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

	console.log(`\n✅ Successfully created ${totalInserted} more exercises!`)
	console.log(`\n📊 Total new exercises from verb list: ${37 + totalInserted} / 100`)
	console.log(`   Total prefix exercises in theme: ${113 + 37 + totalInserted}`)
	console.log('\n✨ Done! You can view them in the admin panel at /admin/training')
}

main()
