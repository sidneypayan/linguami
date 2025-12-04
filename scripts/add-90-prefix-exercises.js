/**
 * Script to add 90 new multi-fill exercises for verb prefixes (Russian A1-A2 level)
 * Covers a wide variety of verb roots with different prefixes
 * Total: 100 questions (10 existing + 90 new)
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

// 90 new multi-fill exercises for verb prefixes
const exercises = [
	// 1. -говорить (to speak)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['говорит', 'разговаривает', 'уговаривает', 'договаривается'],
		sentences: [
			{ text: 'Он громко ___ по телефону.', correct: 0 },
			{ text: 'Мария ___ с подругой о планах на лето.', correct: 1 },
			{ text: 'Мама ___ дочь пойти к врачу.', correct: 2 },
			{ text: 'Директор ___ о встрече с партнёрами.', correct: 3 },
		],
		explanation_fr: 'Ø (parler), раз- (converser), у- (persuader), до- (convenir de)',
		explanation_en: 'Ø (to speak), раз- (to converse), у- (to persuade), до- (to agree on)',
	},

	// 2. -играть (to play)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['сыграет', 'проиграет', 'выиграет', 'переиграет'],
		sentences: [
			{ text: 'Команда ___ завтра важный матч.', correct: 0 },
			{ text: 'Если он не будет тренироваться, он ___.', correct: 1 },
			{ text: 'Наша команда ___ чемпионат в этом году.', correct: 2 },
			{ text: 'Актёр ___ эту роль по-новому.', correct: 3 },
		],
		explanation_fr: 'с- (jouer une fois), про- (perdre), вы- (gagner), пере- (rejouer)',
		explanation_en: 'с- (to play once), про- (to lose), вы- (to win), пере- (to replay)',
	},

	// 3. -учить (to learn/teach)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['выучил', 'научил', 'изучил', 'разучил'],
		sentences: [
			{ text: 'Иван ___ все стихотворение наизусть.', correct: 0 },
			{ text: 'Отец ___ сына кататься на велосипеде.', correct: 1 },
			{ text: 'Студент ___ эту тему очень подробно.', correct: 2 },
			{ text: 'Музыкант ___ новую мелодию за неделю.', correct: 3 },
		],
		explanation_fr: 'вы- (apprendre par cœur), на- (enseigner), из- (étudier), раз- (apprendre par répétition)',
		explanation_en: 'вы- (to learn by heart), на- (to teach), из- (to study), раз- (to learn by repetition)',
	},

	// 4. -делать (to do/make)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['сделала', 'переделала', 'доделала', 'выделала'],
		sentences: [
			{ text: 'Мария ___ все домашние задания вчера.', correct: 0 },
			{ text: 'Она ___ работу, потому что нашла ошибку.', correct: 1 },
			{ text: 'Анна наконец ___ проект к сроку.', correct: 2 },
			{ text: 'Мастер ___ кожу для сумки.', correct: 3 },
		],
		explanation_fr: 'с- (faire/accomplir), пере- (refaire), до- (finir de faire), вы- (tanner/préparer)',
		explanation_en: 'с- (to do/complete), пере- (to redo), до- (to finish doing), вы- (to tan/prepare)',
	},

	// 5. -брать (to take)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['взял', 'собрал', 'подобрал', 'отобрал'],
		sentences: [
			{ text: 'Он ___ книгу со стола.', correct: 0 },
			{ text: 'Максим ___ все документы в папку.', correct: 1 },
			{ text: 'Мальчик ___ котёнка на улице.', correct: 2 },
			{ text: 'Полиция ___ оружие у преступника.', correct: 3 },
		],
		explanation_fr: 'в- (prendre), со- (rassembler), под- (ramasser), от- (confisquer)',
		explanation_en: 'в- (to take), со- (to collect), под- (to pick up), от- (to confiscate)',
	},

	// 6. -класть/-ложить (to put/place)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['положил', 'выложил', 'переложил', 'доложил'],
		sentences: [
			{ text: 'Он ___ ключи на стол.', correct: 0 },
			{ text: 'Продавец ___ товар на витрину.', correct: 1 },
			{ text: 'Иван ___ вещи из одного шкафа в другой.', correct: 2 },
			{ text: 'Секретарь ___ информацию директору.', correct: 3 },
		],
		explanation_fr: 'по- (poser), вы- (disposer), пере- (déplacer), до- (rapporter)',
		explanation_en: 'по- (to put), вы- (to lay out), пере- (to move), до- (to report)',
	},

	// 7. -лить (to pour)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['налила', 'вылила', 'пролила', 'перелила'],
		sentences: [
			{ text: 'Мама ___ чай в чашку.', correct: 0 },
			{ text: 'Она ___ старую воду из вазы.', correct: 1 },
			{ text: 'Девочка случайно ___ сок на стол.', correct: 2 },
			{ text: 'Анна ___ суп в другую кастрюлю.', correct: 3 },
		],
		explanation_fr: 'на- (verser dans), вы- (vider), про- (renverser), пере- (transvaser)',
		explanation_en: 'на- (to pour into), вы- (to pour out), про- (to spill), пере- (to pour over)',
	},

	// 8. -падать (to fall)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['упал', 'попал', 'выпал', 'пропал'],
		sentences: [
			{ text: 'Ребёнок ___ и ушиб колено.', correct: 0 },
			{ text: 'Мяч ___ точно в ворота.', correct: 1 },
			{ text: 'Снег ___ в декабре.', correct: 2 },
			{ text: 'Кот ___ на неделю, потом вернулся.', correct: 3 },
		],
		explanation_fr: 'у- (tomber), по- (atteindre), вы- (tomber de), про- (disparaître)',
		explanation_en: 'у- (to fall), по- (to hit/reach), вы- (to fall out), про- (to disappear)',
	},

	// 9. -строить (to build)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['построят', 'перестроят', 'выстроят', 'достроят'],
		sentences: [
			{ text: 'Рабочие ___ новый дом за год.', correct: 0 },
			{ text: 'Они ___ старое здание в современный офис.', correct: 1 },
			{ text: 'Солдаты ___ ряд перед командиром.', correct: 2 },
			{ text: 'Строители скоро ___ второй этаж.', correct: 3 },
		],
		explanation_fr: 'по- (construire), пере- (reconstruire), вы- (aligner), до- (finir de construire)',
		explanation_en: 'по- (to build), пере- (to rebuild), вы- (to line up), до- (to finish building)',
	},

	// 10. -пить (to drink)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['выпью', 'попью', 'допью', 'перепью'],
		sentences: [
			{ text: 'Я ___ всю бутылку воды, потому что жарко.', correct: 0 },
			{ text: 'Можно я ___ немного твоего сока?', correct: 1 },
			{ text: 'Я обязательно ___ чай до конца.', correct: 2 },
			{ text: 'Не надо ___ столько кофе за раз!', correct: 3 },
		],
		explanation_fr: 'вы- (boire entièrement), по- (boire un peu), до- (finir de boire), пере- (boire trop)',
		explanation_en: 'вы- (to drink all), по- (to drink a bit), до- (to finish drinking), пере- (to drink too much)',
	},

	// 11. -работать (to work)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['работает', 'зарабатывает', 'дорабатывает', 'отрабатывает'],
		sentences: [
			{ text: 'Он ___ в больнице врачом.', correct: 0 },
			{ text: 'Мой брат ___ много денег.', correct: 1 },
			{ text: 'Программист ___ последние детали проекта.', correct: 2 },
			{ text: 'Спортсмен ___ новую технику на тренировке.', correct: 3 },
		],
		explanation_fr: 'Ø (travailler), за- (gagner), до- (finaliser), от- (perfectionner)',
		explanation_en: 'Ø (to work), за- (to earn), до- (to finalize), от- (to perfect)',
	},

	// 12. -жить (to live)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['жил', 'прожил', 'пережил', 'дожил'],
		sentences: [
			{ text: 'Он ___ в Москве пять лет.', correct: 0 },
			{ text: 'Дедушка ___ долгую и интересную жизнь.', correct: 1 },
			{ text: 'Ветеран ___ войну и вернулся домой.', correct: 2 },
			{ text: 'Старик ___ до ста лет.', correct: 3 },
		],
		explanation_fr: 'Ø (vivre), про- (vivre pendant), пере- (survivre à), до- (vivre jusqu\'à)',
		explanation_en: 'Ø (to live), про- (to live through), пере- (to survive), до- (to live up to)',
	},

	// 13. -любить (to love)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['любит', 'полюбит', 'разлюбит', 'влюбится'],
		sentences: [
			{ text: 'Она ___ читать книги.', correct: 0 },
			{ text: 'Со временем он ___ этот город.', correct: 1 },
			{ text: 'Если он узнает правду, он её ___.', correct: 2 },
			{ text: 'Мария ___ в нового одноклассника.', correct: 3 },
		],
		explanation_fr: 'Ø (aimer), по- (se mettre à aimer), раз- (cesser d\'aimer), в- (tomber amoureux)',
		explanation_en: 'Ø (to love), по- (to come to love), раз- (to stop loving), в- (to fall in love)',
	},

	// 14. -открывать (to open)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['открыла', 'раскрыла', 'прикрыла', 'закрыла'],
		sentences: [
			{ text: 'Она ___ дверь и вошла в комнату.', correct: 0 },
			{ text: 'Полиция ___ преступление за неделю.', correct: 1 },
			{ text: 'Мама ___ окно, потому что стало прохладно.', correct: 2 },
			{ text: 'Анна ___ книгу и пошла спать.', correct: 3 },
		],
		explanation_fr: 'от- (ouvrir), рас- (découvrir/résoudre), при- (entrouvrir), за- (fermer)',
		explanation_en: 'от- (to open), рас- (to uncover/solve), при- (to half-close), за- (to close)',
	},

	// 15. -крывать (to cover)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['покрыл', 'накрыл', 'прикрыл', 'раскрыл'],
		sentences: [
			{ text: 'Снег ___ всю землю.', correct: 0 },
			{ text: 'Он ___ стол скатертью.', correct: 1 },
			{ text: 'Отец ___ спящего ребёнка одеялом.', correct: 2 },
			{ text: 'Журналист ___ скандал в правительстве.', correct: 3 },
		],
		explanation_fr: 'по- (couvrir), на- (mettre une nappe), при- (couvrir légèrement), рас- (révéler)',
		explanation_en: 'по- (to cover), на- (to set a table), при- (to cover slightly), рас- (to reveal)',
	},

	// 16. -резать (to cut)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['порезал', 'нарезал', 'вырезал', 'отрезал'],
		sentences: [
			{ text: 'Он ___ палец ножом.', correct: 0 },
			{ text: 'Повар ___ овощи для салата.', correct: 1 },
			{ text: 'Художник ___ фигуру из бумаги.', correct: 2 },
			{ text: 'Мама ___ кусок хлеба.', correct: 3 },
		],
		explanation_fr: 'по- (se couper), на- (couper en morceaux), вы- (découper), от- (couper un morceau)',
		explanation_en: 'по- (to cut oneself), на- (to slice), вы- (to cut out), от- (to cut off)',
	},

	// 17. -мыть (to wash)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['помыла', 'вымыла', 'перемыла', 'отмыла'],
		sentences: [
			{ text: 'Она быстро ___ руки перед едой.', correct: 0 },
			{ text: 'Мама тщательно ___ все окна.', correct: 1 },
			{ text: 'Анна ___ всю посуду после праздника.', correct: 2 },
			{ text: 'Наконец она ___ пятно с рубашки.', correct: 3 },
		],
		explanation_fr: 'по- (se laver vite), вы- (laver soigneusement), пере- (tout laver), от- (enlever en lavant)',
		explanation_en: 'по- (to wash quickly), вы- (to wash thoroughly), пере- (to wash all), от- (to wash off)',
	},

	// 18. -варить (to cook/boil)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['сварит', 'доварит', 'переварит', 'проварит'],
		sentences: [
			{ text: 'Мама ___ суп к обеду.', correct: 0 },
			{ text: 'Она ___ кашу ещё десять минут.', correct: 1 },
			{ text: 'Не ___ мясо, оно станет жёстким!', correct: 2 },
			{ text: 'Повар ___ овощи двадцать минут.', correct: 3 },
		],
		explanation_fr: 's- (cuire/faire cuire), до- (finir de cuire), пере- (trop cuire), про- (cuire pendant)',
		explanation_en: 's- (to cook), до- (to finish cooking), пере- (to overcook), про- (to boil for)',
	},

	// 19. -жарить (to fry)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['пожарил', 'дожарил', 'пережарил', 'прожарил'],
		sentences: [
			{ text: 'Он ___ яйца на завтрак.', correct: 0 },
			{ text: 'Повар ___ мясо ещё пять минут.', correct: 1 },
			{ text: 'К сожалению, я ___ котлеты.', correct: 2 },
			{ text: 'Хорошо ___ стейк с двух сторон.', correct: 3 },
		],
		explanation_fr: 'по- (faire frire), до- (finir de frire), пере- (trop frire), про- (bien frire)',
		explanation_en: 'по- (to fry), до- (to finish frying), пере- (to overfry), про- (to fry well)',
	},

	// 20. -печь (to bake)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['испекла', 'выпекла', 'допекла', 'перепекла'],
		sentences: [
			{ text: 'Бабушка ___ вкусный пирог к празднику.', correct: 0 },
			{ text: 'Она ___ хлеб в духовке.', correct: 1 },
			{ text: 'Анна ___ торт ещё десять минут.', correct: 2 },
			{ text: 'Мама случайно ___ печенье.', correct: 3 },
		],
		explanation_fr: 'ис- (faire cuire au four), вы- (cuire/sortir du four), до- (finir de cuire), пере- (trop cuire)',
		explanation_en: 'ис- (to bake), вы- (to bake/take out), до- (to finish baking), пере- (to overbake)',
	},

	// 21. -солить (to salt)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['посолил', 'досолил', 'пересолил', 'засолил'],
		sentences: [
			{ text: 'Он ___ суп по вкусу.', correct: 0 },
			{ text: 'Повар ___ блюдо перед подачей.', correct: 1 },
			{ text: 'Я случайно ___ салат.', correct: 2 },
			{ text: 'Дедушка ___ огурцы на зиму.', correct: 3 },
		],
		explanation_fr: 'по- (saler), до- (ajouter du sel), пере- (trop saler), за- (saler pour conserver)',
		explanation_en: 'по- (to salt), до- (to add salt), пере- (to oversalt), за- (to pickle)',
	},

	// 22. -резать (to slice) - different context
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['разрежет', 'разрезал', 'прорежет', 'надрежет'],
		sentences: [
			{ text: 'Он ___ торт на восемь частей.', correct: 0 },
			{ text: 'Хирург ___ ткань очень аккуратно.', correct: 1 },
			{ text: 'Мастер ___ отверстие в стене.', correct: 2 },
			{ text: 'Повар ___ мясо, чтобы оно лучше приготовилось.', correct: 3 },
		],
		explanation_fr: 'раз- (couper en parties), раз- (couper), про- (faire une ouverture), над- (inciser)',
		explanation_en: 'раз- (to cut into parts), раз- (to cut), про- (to cut through), над- (to make an incision)',
	},

	// 23. -таять (to melt)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['тает', 'растает', 'стает', 'подтает'],
		sentences: [
			{ text: 'Снег ___ на солнце.', correct: 0 },
			{ text: 'Лёд полностью ___ к вечеру.', correct: 1 },
			{ text: 'Весной снег ___ повсюду.', correct: 2 },
			{ text: 'Масло немного ___ в холодильнике.', correct: 3 },
		],
		explanation_fr: 'Ø (fondre), рас- (fondre complètement), с- (fondre partout), под- (fondre légèrement)',
		explanation_en: 'Ø (to melt), рас- (to melt completely), с- (to melt everywhere), под- (to melt slightly)',
	},

	// 24. -мерзать (to freeze)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['мёрзну', 'замёрзну', 'промёрзну', 'отмёрзну'],
		sentences: [
			{ text: 'Я сильно ___ без шапки.', correct: 0 },
			{ text: 'Если не надену куртку, я ___.', correct: 1 },
			{ text: 'Я ___ до костей под дождём.', correct: 2 },
			{ text: 'Мои пальцы скоро ___ на морозе.', correct: 3 },
		],
		explanation_fr: 'Ø (avoir froid), за- (geler), про- (geler complètement), от- (dégeler)',
		explanation_en: 'Ø (to be cold), за- (to freeze), про- (to freeze through), от- (to thaw)',
	},

	// 25. -греть (to warm)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['греет', 'согреет', 'разогреет', 'подогреет'],
		sentences: [
			{ text: 'Солнце ___ землю весной.', correct: 0 },
			{ text: 'Чай ___ меня после прогулки.', correct: 1 },
			{ text: 'Мама ___ обед в микроволновке.', correct: 2 },
			{ text: 'Я ___ молоко для кофе.', correct: 3 },
		],
		explanation_fr: 'Ø (chauffer), со- (réchauffer), раз- (réchauffer), под- (faire tiédir)',
		explanation_en: 'Ø (to heat), со- (to warm up), раз- (to heat up), под- (to warm slightly)',
	},

	// 26. -жигать (to burn)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['поджёг', 'сжёг', 'выжег', 'обжёг'],
		sentences: [
			{ text: 'Он ___ костёр в лесу.', correct: 0 },
			{ text: 'Пожар ___ весь дом.', correct: 1 },
			{ text: 'Мастер ___ рисунок на дереве.', correct: 2 },
			{ text: 'Повар ___ руку об горячую сковороду.', correct: 3 },
		],
		explanation_fr: 'под- (allumer), с- (brûler entièrement), вы- (graver), об- (se brûler)',
		explanation_en: 'под- (to set fire), с- (to burn down), вы- (to burn in), об- (to burn oneself)',
	},

	// 27. -тушить (to extinguish/stew)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['потушил', 'затушил', 'дотушил', 'протушил'],
		sentences: [
			{ text: 'Он быстро ___ свечу.', correct: 0 },
			{ text: 'Пожарные ___ огонь за час.', correct: 1 },
			{ text: 'Повар ___ мясо ещё десять минут.', correct: 2 },
			{ text: 'Мама ___ овощи полчаса.', correct: 3 },
		],
		explanation_fr: 'по- (éteindre vite), за- (éteindre complètement), до- (finir de mijoter), про- (mijoter pendant)',
		explanation_en: 'по- (to put out quickly), за- (to extinguish), до- (to finish stewing), про- (to stew for)',
	},

	// 28. -курить (to smoke)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['курит', 'покурит', 'докурит', 'выкурит'],
		sentences: [
			{ text: 'Он ___ на балконе каждый день.', correct: 0 },
			{ text: 'Можно я ___ здесь минуту?', correct: 1 },
			{ text: 'Он ___ сигарету и войдёт.', correct: 2 },
			{ text: 'За день он ___ целую пачку.', correct: 3 },
		],
		explanation_fr: 'Ø (fumer régulièrement), по- (fumer un peu), до- (finir de fumer), вы- (fumer tout)',
		explanation_en: 'Ø (to smoke regularly), по- (to have a smoke), до- (to finish smoking), вы- (to smoke all)',
	},

	// 29. -копать (to dig)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['копает', 'выкопает', 'вскопает', 'перекопает'],
		sentences: [
			{ text: 'Собака ___ яму в саду.', correct: 0 },
			{ text: 'Дедушка ___ картофель осенью.', correct: 1 },
			{ text: 'Садовник ___ землю перед посадкой.', correct: 2 },
			{ text: 'Фермер ___ весь огород за день.', correct: 3 },
		],
		explanation_fr: 'Ø (creuser), вы- (déterrer), вс- (retourner la terre), пере- (tout bêcher)',
		explanation_en: 'Ø (to dig), вы- (to dig up), вс- (to dig over), пере- (to dig all)',
	},

	// 30. -сажать (to plant/seat)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['посадила', 'высадила', 'рассадила', 'пересадила'],
		sentences: [
			{ text: 'Бабушка ___ цветы в саду.', correct: 0 },
			{ text: 'Она ___ рассаду в открытый грунт.', correct: 1 },
			{ text: 'Мама ___ гостей за большим столом.', correct: 2 },
			{ text: 'Садовник ___ розу в другое место.', correct: 3 },
		],
		explanation_fr: 'по- (planter), вы- (repiquer), рас- (disposer), пере- (transplanter)',
		explanation_en: 'по- (to plant), вы- (to transplant out), рас- (to seat), пере- (to replant)',
	},

	// 31. -расти (to grow)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['растёт', 'вырастет', 'подрастёт', 'зарастёт'],
		sentences: [
			{ text: 'Ребёнок быстро ___.', correct: 0 },
			{ text: 'Из семени ___ большое дерево.', correct: 1 },
			{ text: 'Мальчик ___ за лето на пять сантиметров.', correct: 2 },
			{ text: 'Дорога ___ травой, если её не чистить.', correct: 3 },
		],
		explanation_fr: 'Ø (grandir), вы- (pousser complètement), под- (grandir un peu), за- (envahir)',
		explanation_en: 'Ø (to grow), вы- (to grow fully), под- (to grow a bit), за- (to overgrow)',
	},

	// 32. -цвести (to bloom)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['цветёт', 'зацветёт', 'отцветёт', 'процветёт'],
		sentences: [
			{ text: 'Роза красиво ___ в саду.', correct: 0 },
			{ text: 'Яблоня ___ в мае.', correct: 1 },
			{ text: 'Сирень скоро ___.', correct: 2 },
			{ text: 'Бизнес ___ при хорошем управлении.', correct: 3 },
		],
		explanation_fr: 'Ø (fleurir), за- (commencer à fleurir), от- (finir de fleurir), про- (prospérer)',
		explanation_en: 'Ø (to bloom), за- (to start blooming), от- (to finish blooming), про- (to flourish)',
	},

	// 33. -вянуть (to wilt)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['вянет', 'завянет', 'увянет', 'подвянет'],
		sentences: [
			{ text: 'Цветок ___ без воды.', correct: 0 },
			{ text: 'Роза ___, если её не полить.', correct: 1 },
			{ text: 'Растение совсем ___ от жары.', correct: 2 },
			{ text: 'Салат немного ___ в холодильнике.', correct: 3 },
		],
		explanation_fr: 'Ø (se faner), за- (commencer à se faner), у- (se faner complètement), под- (se faner un peu)',
		explanation_en: 'Ø (to wilt), за- (to start wilting), у- (to wilt completely), под- (to wilt slightly)',
	},

	// 34. -поливать (to water)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['поливает', 'поливает', 'доливает', 'заливает'],
		sentences: [
			{ text: 'Она ___ цветы каждый день.', correct: 0 },
			{ text: 'Садовник ___ растения утром.', correct: 1 },
			{ text: 'Он ___ воду в лейку.', correct: 2 },
			{ text: 'Не ___ растение, оно погибнет!', correct: 3 },
		],
		explanation_fr: 'по- (arroser), по- (arroser), до- (ajouter de l\'eau), за- (noyer)',
		explanation_en: 'по- (to water), по- (to water), до- (to add water), за- (to overwater)',
	},

	// 35. -собирать (to collect/gather)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['собрала', 'насобирала', 'разобрала', 'отобрала'],
		sentences: [
			{ text: 'Она ___ вещи в чемодан.', correct: 0 },
			{ text: 'Дети ___ много грибов в лесу.', correct: 1 },
			{ text: 'Мастер ___ мотор на части.', correct: 2 },
			{ text: 'Учитель ___ лучшие работы для выставки.', correct: 3 },
		],
		explanation_fr: 'со- (rassembler), на- (ramasser beaucoup), раз- (démonter), от- (sélectionner)',
		explanation_en: 'со- (to gather), на- (to collect a lot), раз- (to disassemble), от- (to select)',
	},

	// 36. -бирать (to pick/choose)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['выбирает', 'перебирает', 'подбирает', 'прибирает'],
		sentences: [
			{ text: 'Она долго ___ платье для праздника.', correct: 0 },
			{ text: 'Бабушка ___ крупу перед варкой.', correct: 1 },
			{ text: 'Дизайнер ___ цвета для интерьера.', correct: 2 },
			{ text: 'Мама ___ в комнате каждый день.', correct: 3 },
		],
		explanation_fr: 'вы- (choisir), пере- (trier), под- (assortir), при- (ranger)',
		explanation_en: 'вы- (to choose), пере- (to sort through), под- (to match), при- (to tidy up)',
	},

	// 37. -кидать (to throw)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['кидает', 'бросает', 'выкидывает', 'закидывает'],
		sentences: [
			{ text: 'Мальчик ___ камни в воду.', correct: 0 },
			{ text: 'Он ___ мяч другу.', correct: 1 },
			{ text: 'Не ___ старые фотографии!', correct: 2 },
			{ text: 'Рыбак ___ удочку далеко в озеро.', correct: 3 },
		],
		explanation_fr: 'Ø (jeter), Ø (lancer), вы- (jeter à la poubelle), за- (lancer loin)',
		explanation_en: 'Ø (to throw), Ø (to throw), вы- (to throw away), за- (to cast far)',
	},

	// 38. -ловить (to catch)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ловит', 'поймает', 'выловит', 'переловит'],
		sentences: [
			{ text: 'Кот ___ мышей каждую ночь.', correct: 0 },
			{ text: 'Он обязательно ___ эту рыбу.', correct: 1 },
			{ text: 'Рыбак ___ всю рыбу из пруда.', correct: 2 },
			{ text: 'Дети ___ всех бабочек в саду.', correct: 3 },
		],
		explanation_fr: 'Ø (attraper), по- (attraper une fois), вы- (tout attraper), пере- (attraper tous)',
		explanation_en: 'Ø (to catch), по- (to catch once), вы- (to catch all out), пере- (to catch all)',
	},

	// 39. -держать (to hold)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['держит', 'придержит', 'задержит', 'поддержит'],
		sentences: [
			{ text: 'Он ___ книгу в руках.', correct: 0 },
			{ text: 'Можешь ___ дверь на минуту?', correct: 1 },
			{ text: 'Полиция ___ подозреваемого.', correct: 2 },
			{ text: 'Друг всегда ___ меня в трудную минуту.', correct: 3 },
		],
		explanation_fr: 'Ø (tenir), при- (retenir), за- (détenir), под- (soutenir)',
		explanation_en: 'Ø (to hold), при- (to hold for a moment), за- (to detain), под- (to support)',
	},

	// 40. -жать (to press)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['жмёт', 'нажмёт', 'сожмёт', 'разожмёт'],
		sentences: [
			{ text: 'Обувь сильно ___ ногу.', correct: 0 },
			{ text: 'Он ___ на кнопку звонка.', correct: 1 },
			{ text: 'Она ___ руку в кулак.', correct: 2 },
			{ text: 'Ребёнок не может ___ кулак.', correct: 3 },
		],
		explanation_fr: 'Ø (serrer), на- (appuyer), со- (serrer), раз- (desserrer)',
		explanation_en: 'Ø (to squeeze), на- (to press), со- (to clench), раз- (to unclench)',
	},

	// 41. -тянуть (to pull)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['тянет', 'вытянет', 'протянет', 'растянет'],
		sentences: [
			{ text: 'Собака ___ поводок на прогулке.', correct: 0 },
			{ text: 'Он ___ билет и посмотрит номер.', correct: 1 },
			{ text: 'Она ___ руку для рукопожатия.', correct: 2 },
			{ text: 'Спортсмен ___ мышцу, если не разомнётся.', correct: 3 },
		],
		explanation_fr: 'Ø (tirer), вы- (tirer dehors), про- (tendre), рас- (étirer)',
		explanation_en: 'Ø (to pull), вы- (to pull out), про- (to extend), рас- (to stretch)',
	},

	// 42. -толкать (to push)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['толкает', 'вытолкает', 'оттолкнёт', 'подтолкнёт'],
		sentences: [
			{ text: 'Он сильно ___ дверь.', correct: 0 },
			{ text: 'Охранник ___ хулигана из клуба.', correct: 1 },
			{ text: 'Лодка ___ от берега.', correct: 2 },
			{ text: 'Друг ___ меня к действию.', correct: 3 },
		],
		explanation_fr: 'Ø (pousser), вы- (expulser), от- (repousser), под- (encourager)',
		explanation_en: 'Ø (to push), вы- (to push out), от- (to push away), под- (to nudge)',
	},

	// 43. -двигать (to move)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['двигает', 'передвигает', 'продвигает', 'сдвигает'],
		sentences: [
			{ text: 'Он медленно ___ руку.', correct: 0 },
			{ text: 'Она ___ стул ближе к столу.', correct: 1 },
			{ text: 'Компания ___ товар на рынке.', correct: 2 },
			{ text: 'Рабочий ___ коробки в сторону.', correct: 3 },
		],
		explanation_fr: 'Ø (bouger), пере- (déplacer), про- (promouvoir), с- (pousser de côté)',
		explanation_en: 'Ø (to move), пере- (to move over), про- (to promote), с- (to shift)',
	},

	// 44. -бросать (to throw/quit)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['бросит', 'выбросит', 'забросит', 'перебросит'],
		sentences: [
			{ text: 'Он ___ курить в новом году.', correct: 0 },
			{ text: 'Не ___ эту книгу, она ещё нужна!', correct: 1 },
			{ text: 'Спортсмен ___ мяч в корзину.', correct: 2 },
			{ text: 'Игрок ___ мяч партнёру.', correct: 3 },
		],
		explanation_fr: 'Ø (arrêter), вы- (jeter), за- (lancer dans), пере- (lancer à)',
		explanation_en: 'Ø (to quit), вы- (to throw away), за- (to throw into), пере- (to throw across)',
	},

	// 45. -вешать (to hang)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['вешает', 'повесит', 'развешает', 'навешает'],
		sentences: [
			{ text: 'Она ___ бельё на балконе.', correct: 0 },
			{ text: 'Он ___ картину на стену.', correct: 1 },
			{ text: 'Хозяйка ___ бельё по всей квартире.', correct: 2 },
			{ text: 'Мама ___ много полок в кладовке.', correct: 3 },
		],
		explanation_fr: 'Ø (pendre), по- (accrocher), раз- (étendre partout), на- (accrocher beaucoup)',
		explanation_en: 'Ø (to hang), по- (to hang up), раз- (to hang around), на- (to hang many)',
	},

	// 46. -снимать (to take off/photograph)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['снимает', 'снял', 'переснял', 'отснял'],
		sentences: [
			{ text: 'Он ___ куртку в помещении.', correct: 0 },
			{ text: 'Фотограф ___ красивый пейзаж.', correct: 1 },
			{ text: 'Режиссёр ___ сцену из-за ошибки.', correct: 2 },
			{ text: 'Оператор ___ весь материал за день.', correct: 3 },
		],
		explanation_fr: 'Ø (enlever), Ø (photographier), пере- (refaire), от- (filmer tout)',
		explanation_en: 'Ø (to take off), Ø (to photograph), пере- (to reshoot), от- (to shoot all)',
	},

	// 47. -надевать (to put on)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['надевает', 'поднадевает', 'переоденется', 'оденется'],
		sentences: [
			{ text: 'Она ___ пальто перед выходом.', correct: 0 },
			{ text: 'Он ___ ещё один свитер, холодно.', correct: 1 },
			{ text: 'Актриса ___ для следующей сцены.', correct: 2 },
			{ text: 'Ребёнок учится ___ самостоятельно.', correct: 3 },
		],
		explanation_fr: 'на- (mettre), под- (ajouter un vêtement), пере- (se changer), о- (s\'habiller)',
		explanation_en: 'на- (to put on), под- (to put on more), пере- (to change clothes), о- (to dress)',
	},

	// 48. -рвать (to tear)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['рвёт', 'порвёт', 'разорвёт', 'оторвёт'],
		sentences: [
			{ text: 'Собака ___ игрушку зубами.', correct: 0 },
			{ text: 'Он случайно ___ штаны на гвозде.', correct: 1 },
			{ text: 'Она ___ письмо на мелкие кусочки.', correct: 2 },
			{ text: 'Мальчик ___ страницу из тетради.', correct: 3 },
		],
		explanation_fr: 'Ø (déchirer), по- (déchirer accidentellement), раз- (déchirer en morceaux), от- (arracher)',
		explanation_en: 'Ø (to tear), по- (to tear accidentally), раз- (to tear apart), от- (to tear off)',
	},

	// 49. -шить (to sew)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['шьёт', 'сшила', 'зашила', 'дошила'],
		sentences: [
			{ text: 'Бабушка ___ платье для внучки.', correct: 0 },
			{ text: 'Она ___ красивое платье к празднику.', correct: 1 },
			{ text: 'Мама ___ дырку на рубашке.', correct: 2 },
			{ text: 'Портниха ___ костюм к вечеру.', correct: 3 },
		],
		explanation_fr: 'Ø (coudre), с- (confectionner), за- (recoudre), до- (finir de coudre)',
		explanation_en: 'Ø (to sew), с- (to sew up), за- (to sew up a hole), до- (to finish sewing)',
	},

	// 50. -чесать (to scratch/comb)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['чешет', 'почешет', 'расчешет', 'причешет'],
		sentences: [
			{ text: 'Он ___ спину, потому что зудит.', correct: 0 },
			{ text: 'Можно я ___ голову?', correct: 1 },
			{ text: 'Она ___ волосы расчёской.', correct: 2 },
			{ text: 'Мама ___ дочку перед школой.', correct: 3 },
		],
		explanation_fr: 'Ø (gratter), по- (gratter un peu), рас- (peigner), при- (coiffer)',
		explanation_en: 'Ø (to scratch), по- (to scratch a bit), рас- (to comb out), при- (to do hair)',
	},

	// 51. -красить (to paint/color)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['красит', 'покрасит', 'выкрасит', 'перекрасит'],
		sentences: [
			{ text: 'Художник ___ картину маслом.', correct: 0 },
			{ text: 'Он ___ забор в синий цвет.', correct: 1 },
			{ text: 'Она ___ волосы в рыжий цвет.', correct: 2 },
			{ text: 'Они ___ стены в другой цвет.', correct: 3 },
		],
		explanation_fr: 'Ø (peindre), по- (peindre une fois), вы- (teindre), пере- (repeindre)',
		explanation_en: 'Ø (to paint), по- (to paint once), вы- (to dye), пере- (to repaint)',
	},

	// 52. -рисовать (to draw)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['рисует', 'нарисует', 'дорисует', 'перерисует'],
		sentences: [
			{ text: 'Ребёнок ___ красками каждый день.', correct: 0 },
			{ text: 'Художник ___ портрет за три часа.', correct: 1 },
			{ text: 'Он ___ последние детали картины.', correct: 2 },
			{ text: 'Ученик ___ рисунок, потому что допустил ошибку.', correct: 3 },
		],
		explanation_fr: 'Ø (dessiner), на- (dessiner complètement), до- (finir de dessiner), пере- (redessiner)',
		explanation_en: 'Ø (to draw), на- (to draw completely), до- (to finish drawing), пере- (to redraw)',
	},

	// 53. -видеть (to see)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['видит', 'увидит', 'завидует', 'предвидит'],
		sentences: [
			{ text: 'Он плохо ___ без очков.', correct: 0 },
			{ text: 'Завтра она ___ результаты экзамена.', correct: 1 },
			{ text: 'Она ___ успеху подруги.', correct: 2 },
			{ text: 'Опытный менеджер ___ проблемы заранее.', correct: 3 },
		],
		explanation_fr: 'Ø (voir), у- (apercevoir), за- (envier), пред- (prévoir)',
		explanation_en: 'Ø (to see), у- (to catch sight of), за- (to envy), пред- (to foresee)',
	},

	// 54. -слышать (to hear)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['слышит', 'услышит', 'дослышит', 'прослышит'],
		sentences: [
			{ text: 'Он ___ музыку из соседней комнаты.', correct: 0 },
			{ text: 'Она обязательно ___ эту новость.', correct: 1 },
			{ text: 'Я не ___ конец фразы, повтори, пожалуйста.', correct: 2 },
			{ text: 'Он ___ о скандале в компании.', correct: 3 },
		],
		explanation_fr: 'Ø (entendre), у- (entendre une fois), до- (entendre jusqu\'au bout), про- (apprendre par ouï-dire)',
		explanation_en: 'Ø (to hear), у- (to hear once), до- (to hear to the end), про- (to hear about)',
	},

	// 55. -смотреть (to look/watch) - different forms
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['посмотрел', 'осмотрел', 'рассмотрел', 'досмотрел'],
		sentences: [
			{ text: 'Он ___ фильм вчера вечером.', correct: 0 },
			{ text: 'Врач ___ пациента и назначил лечение.', correct: 1 },
			{ text: 'Я внимательно ___ документы.', correct: 2 },
			{ text: 'Мы ___ сериал до конца.', correct: 3 },
		],
		explanation_fr: 'по- (regarder), о- (examiner), рас- (examiner attentivement), до- (regarder jusqu\'au bout)',
		explanation_en: 'по- (to watch), о- (to examine), рас- (to examine closely), до- (to watch to the end)',
	},

	// 56. -думать (to think)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['думает', 'подумает', 'придумает', 'додумает'],
		sentences: [
			{ text: 'Он долго ___ о проблеме.', correct: 0 },
			{ text: 'Она ___ о предложении до завтра.', correct: 1 },
			{ text: 'Писатель ___ новый сюжет.', correct: 2 },
			{ text: 'Я не ___ мысль до конца.', correct: 3 },
		],
		explanation_fr: 'Ø (réfléchir), по- (réfléchir un peu), при- (inventer), до- (finir de penser)',
		explanation_en: 'Ø (to think), по- (to think for a while), при- (to invent), до- (to finish thinking)',
	},

	// 57. -знать (to know)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['знает', 'узнает', 'признает', 'опознает'],
		sentences: [
			{ text: 'Он хорошо ___ математику.', correct: 0 },
			{ text: 'Завтра она ___ результаты анализов.', correct: 1 },
			{ text: 'Преступник ___ вину на суде.', correct: 2 },
			{ text: 'Свидетель ___ подозреваемого.', correct: 3 },
		],
		explanation_fr: 'Ø (savoir), у- (apprendre), при- (reconnaître/avouer), о- (identifier)',
		explanation_en: 'Ø (to know), у- (to find out), при- (to admit), о- (to identify)',
	},

	// 58. -помнить (to remember)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['помнит', 'вспомнит', 'запомнит', 'припомнит'],
		sentences: [
			{ text: 'Он хорошо ___ детство.', correct: 0 },
			{ text: 'Она обязательно ___ эту встречу.', correct: 1 },
			{ text: 'Ученик ___ правило навсегда.', correct: 2 },
			{ text: 'Дай мне время, я ___ его имя.', correct: 3 },
		],
		explanation_fr: 'Ø (se souvenir), вс- (se rappeler), за- (mémoriser), при- (se remémorer)',
		explanation_en: 'Ø (to remember), вс- (to recall), за- (to memorize), при- (to recollect)',
	},

	// 59. -забыть (to forget)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['забывает', 'забудет', 'позабудет', 'подзабудет'],
		sentences: [
			{ text: 'Дедушка часто ___ имена.', correct: 0 },
			{ text: 'Не ___ позвонить маме!', correct: 1 },
			{ text: 'Со временем он ___ эту обиду.', correct: 2 },
			{ text: 'Я ___ английский без практики.', correct: 3 },
		],
		explanation_fr: 'за- (oublier régulièrement), за- (oublier), по- (oublier avec le temps), под- (oublier partiellement)',
		explanation_en: 'за- (to forget regularly), за- (to forget), по- (to forget over time), под- (to partially forget)',
	},

	// 60. -терять (to lose)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['теряет', 'потеряет', 'утеряет', 'растеряет'],
		sentences: [
			{ text: 'Он часто ___ ключи.', correct: 0 },
			{ text: 'Не ___ это письмо, оно важное!', correct: 1 },
			{ text: 'Компания ___ документы при переезде.', correct: 2 },
			{ text: 'Он ___ все деньги за день.', correct: 3 },
		],
		explanation_fr: 'Ø (perdre régulièrement), по- (perdre), у- (égarer), рас- (perdre tout)',
		explanation_en: 'Ø (to lose regularly), по- (to lose), у- (to misplace), рас- (to lose everything)',
	},

	// 61. -находить (to find)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['находит', 'найдёт', 'подходит', 'доходит'],
		sentences: [
			{ text: 'Он всегда ___ решение проблемы.', correct: 0 },
			{ text: 'Она обязательно ___ свои ключи.', correct: 1 },
			{ text: 'Этот цвет не ___ к платью.', correct: 2 },
			{ text: 'Автобус ___ до центра города.', correct: 3 },
		],
		explanation_fr: 'Ø (trouver), Ø (trouver), под- (convenir), до- (arriver jusqu\'à)',
		explanation_en: 'Ø (to find), Ø (to find), под- (to suit), до- (to reach)',
	},

	// 62. -искать (to search)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ищет', 'поищет', 'отыщет', 'разыщет'],
		sentences: [
			{ text: 'Он ___ работу уже месяц.', correct: 0 },
			{ text: 'Я ___ информацию в интернете.', correct: 1 },
			{ text: 'Археолог ___ древний клад.', correct: 2 },
			{ text: 'Полиция ___ преступника.', correct: 3 },
		],
		explanation_fr: 'Ø (chercher), по- (chercher un peu), от- (trouver après recherche), раз- (retrouver)',
		explanation_en: 'Ø (to search), по- (to search for a bit), от- (to find), раз- (to track down)',
	},

	// 63. -ждать (to wait)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ждёт', 'подождёт', 'дождётся', 'прождёт'],
		sentences: [
			{ text: 'Он ___ автобус на остановке.', correct: 0 },
			{ text: 'Она ___ минуту и войдёт.', correct: 1 },
			{ text: 'Мы ___ лета и поедем на море.', correct: 2 },
			{ text: 'Я ___ два часа, но он не пришёл.', correct: 3 },
		],
		explanation_fr: 'Ø (attendre), по- (attendre un peu), до- (attendre jusqu\'à), про- (attendre longtemps)',
		explanation_en: 'Ø (to wait), по- (to wait a bit), до- (to wait until), про- (to wait for long)',
	},

	// 64. -встречать (to meet)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['встречает', 'встретит', 'повстречает', 'перевстречает'],
		sentences: [
			{ text: 'Она ___ друзей в кафе каждую неделю.', correct: 0 },
			{ text: 'Он ___ родителей на вокзале.', correct: 1 },
			{ text: 'В лесу он ___ медведя.', correct: 2 },
			{ text: 'За день он ___ всех старых друзей.', correct: 3 },
		],
		explanation_fr: 'Ø (rencontrer régulièrement), Ø (rencontrer), по- (rencontrer par hasard), пере- (rencontrer tous)',
		explanation_en: 'Ø (to meet regularly), Ø (to meet), по- (to encounter), пере- (to meet all)',
	},

	// 65. -провожать (to see off)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['провожает', 'проводит', 'отпровожает', 'допроводит'],
		sentences: [
			{ text: 'Он ___ дочь в школу каждый день.', correct: 0 },
			{ text: 'Она ___ гостей до двери.', correct: 1 },
			{ text: 'Семья ___ сына в армию.', correct: 2 },
			{ text: 'Я ___ тебя до угла.', correct: 3 },
		],
		explanation_fr: 'про- (accompagner régulièrement), про- (accompagner), от- (accompagner pour un départ), до- (accompagner jusqu\'à)',
		explanation_en: 'про- (to see off regularly), про- (to see off), от- (to see off for departure), до- (to accompany to)',
	},

	// 66. -приходить (to come/arrive)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['приходит', 'придёт', 'приходил', 'прийдёт'],
		sentences: [
			{ text: 'Он ___ на работу в 9 утра.', correct: 0 },
			{ text: 'Завтра она ___ в гости.', correct: 1 },
			{ text: 'Вчера он ___ поздно домой.', correct: 2 },
			{ text: 'Скоро ___ весна.', correct: 3 },
		],
		explanation_fr: 'при- (venir régulièrement), при- (venir), при- (est venu), при- (viendra)',
		explanation_en: 'при- (to come regularly), при- (to come), при- (came), при- (will come)',
	},

	// 67. -уходить (to leave/go away)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['уходит', 'уйдёт', 'заходит', 'отходит'],
		sentences: [
			{ text: 'Он ___ с работы в 6 вечера.', correct: 0 },
			{ text: 'Она ___ через десять минут.', correct: 1 },
			{ text: 'Почтальон ___ к нам каждый день.', correct: 2 },
			{ text: 'Поезд ___ от станции через минуту.', correct: 3 },
		],
		explanation_fr: 'у- (partir), у- (partir), за- (passer), от- (s\'éloigner)',
		explanation_en: 'у- (to leave), у- (to leave), за- (to drop by), от- (to depart)',
	},

	// 68. -садиться (to sit down)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['садится', 'сядет', 'пересядет', 'подсядет'],
		sentences: [
			{ text: 'Он ___ на стул у окна.', correct: 0 },
			{ text: 'Она ___ на диван и откроет книгу.', correct: 1 },
			{ text: 'Пассажир ___ на другое место.', correct: 2 },
			{ text: 'Незнакомец ___ к нам за столик.', correct: 3 },
		],
		explanation_fr: 'Ø (s\'asseoir), Ø (s\'asseoir), пере- (changer de place), под- (s\'asseoir près)',
		explanation_en: 'Ø (to sit down), Ø (to sit down), пере- (to change seats), под- (to sit nearby)',
	},

	// 69. -вставать (to get up/stand up)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['встаёт', 'встанет', 'подстанет', 'привстанет'],
		sentences: [
			{ text: 'Он ___ в 7 утра каждый день.', correct: 0 },
			{ text: 'Она ___ с постели через минуту.', correct: 1 },
			{ text: 'Солдат ___ в строй.', correct: 2 },
			{ text: 'Зритель ___, чтобы лучше видеть.', correct: 3 },
		],
		explanation_fr: 'вс- (se lever), вс- (se lever), под- (prendre position), при- (se lever à demi)',
		explanation_en: 'вс- (to get up), вс- (to get up), под- (to take position), при- (to half rise)',
	},

	// 70. -ложиться (to lie down)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ложится', 'ляжет', 'приляжет', 'переляжет'],
		sentences: [
			{ text: 'Он ___ спать в 11 вечера.', correct: 0 },
			{ text: 'Она ___ на диван и закроет глаза.', correct: 1 },
			{ text: 'Больной ___ отдохнуть на часок.', correct: 2 },
			{ text: 'Пациент ___ на другой бок.', correct: 3 },
		],
		explanation_fr: 'Ø (se coucher), Ø (se coucher), при- (s\'allonger un peu), пере- (se retourner)',
		explanation_en: 'Ø (to lie down), Ø (to lie down), при- (to lie down briefly), пере- (to turn over)',
	},

	// 71. -будить (to wake)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['будит', 'разбудит', 'пробудит', 'подбудит'],
		sentences: [
			{ text: 'Мама ___ детей в школу.', correct: 0 },
			{ text: 'Будильник ___ меня в 7 утра.', correct: 1 },
			{ text: 'Весна ___ природу от сна.', correct: 2 },
			{ text: 'Я тихо ___ спящего, чтобы не испугать.', correct: 3 },
		],
		explanation_fr: 'Ø (réveiller), раз- (réveiller complètement), про- (éveiller), под- (réveiller doucement)',
		explanation_en: 'Ø (to wake), раз- (to wake up completely), про- (to awaken), под- (to wake gently)',
	},

	// 72. -спать (to sleep)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['спит', 'поспит', 'выспится', 'проспит'],
		sentences: [
			{ text: 'Ребёнок ___ днём два часа.', correct: 0 },
			{ text: 'Он ___ немного и пойдёт гулять.', correct: 1 },
			{ text: 'Наконец я ___ после ночной смены.', correct: 2 },
			{ text: 'Он ___ будильник и опоздает.', correct: 3 },
		],
		explanation_fr: 'Ø (dormir), по- (dormir un peu), вы- (bien dormir), про- (dormir trop longtemps)',
		explanation_en: 'Ø (to sleep), по- (to sleep a bit), вы- (to get enough sleep), про- (to oversleep)',
	},

	// 73. -есть (to eat)
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
			{ text: 'Не ___ сладкого, заболит живот!', correct: 3 },
		],
		explanation_fr: 'Ø (manger), с- (manger tout), до- (finir de manger), пере- (trop manger)',
		explanation_en: 'Ø (to eat), с- (to eat all), до- (to finish eating), пере- (to overeat)',
	},

	// 74. -кормить (to feed)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['кормит', 'покормит', 'докормит', 'перекормит'],
		sentences: [
			{ text: 'Мама ___ ребёнка три раза в день.', correct: 0 },
			{ text: 'Она ___ кота и пойдёт гулять.', correct: 1 },
			{ text: 'Медсестра ___ больного до конца.', correct: 2 },
			{ text: 'Не ___ собаку, ей будет плохо!', correct: 3 },
		],
		explanation_fr: 'Ø (nourrir), по- (nourrir une fois), до- (finir de nourrir), пере- (trop nourrir)',
		explanation_en: 'Ø (to feed), по- (to feed once), до- (to finish feeding), пере- (to overfeed)',
	},

	// 75. -покупать (to buy)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['покупает', 'купит', 'закупит', 'подкупит'],
		sentences: [
			{ text: 'Она ___ продукты в магазине.', correct: 0 },
			{ text: 'Он ___ подарок завтра.', correct: 1 },
			{ text: 'Компания ___ товар на год вперёд.', correct: 2 },
			{ text: 'Нечестный бизнесмен ___ чиновника.', correct: 3 },
		],
		explanation_fr: 'по- (acheter régulièrement), Ø (acheter), за- (faire des stocks), под- (corrompre)',
		explanation_en: 'по- (to buy regularly), Ø (to buy), за- (to stock up), под- (to bribe)',
	},

	// 76. -продавать (to sell)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['продаёт', 'продал', 'распродал', 'допродал'],
		sentences: [
			{ text: 'Магазин ___ свежие овощи.', correct: 0 },
			{ text: 'Он ___ машину за хорошую цену.', correct: 1 },
			{ text: 'Магазин ___ все товары на распродаже.', correct: 2 },
			{ text: 'Продавец ___ последние билеты.', correct: 3 },
		],
		explanation_fr: 'про- (vendre), про- (a vendu), рас- (tout vendre), до- (vendre le reste)',
		explanation_en: 'про- (to sell), про- (sold), рас- (to sell out), до- (to sell remaining)',
	},

	// 77. -платить (to pay)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['платит', 'заплатит', 'доплатит', 'переплатит'],
		sentences: [
			{ text: 'Он ___ за квартиру каждый месяц.', correct: 0 },
			{ text: 'Она ___ за покупки картой.', correct: 1 },
			{ text: 'Мне нужно ___ 500 рублей за товар.', correct: 2 },
			{ text: 'Он ___ за срочность заказа.', correct: 3 },
		],
		explanation_fr: 'Ø (payer), за- (payer pour), до- (payer le complément), пере- (surpayer)',
		explanation_en: 'Ø (to pay), за- (to pay for), до- (to pay extra), пере- (to overpay)',
	},

	// 78. -считать (to count/consider)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['считает', 'посчитает', 'пересчитает', 'досчитает'],
		sentences: [
			{ text: 'Он ___ меня своим другом.', correct: 0 },
			{ text: 'Кассир ___ деньги и даст сдачу.', correct: 1 },
			{ text: 'Она ___ монеты ещё раз.', correct: 2 },
			{ text: 'Ребёнок ___ до ста и найдёт нас.', correct: 3 },
		],
		explanation_fr: 'Ø (considérer), по- (compter), пере- (recompter), до- (compter jusqu\'à)',
		explanation_en: 'Ø (to consider), по- (to count), пере- (to recount), до- (to count up to)',
	},

	// 79. -менять (to change)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['меняет', 'поменяет', 'обменяет', 'разменяет'],
		sentences: [
			{ text: 'Он часто ___ мнение.', correct: 0 },
			{ text: 'Она ___ причёску к празднику.', correct: 1 },
			{ text: 'Я ___ эту книгу на другую.', correct: 2 },
			{ text: 'Кассир ___ крупную купюру.', correct: 3 },
		],
		explanation_fr: 'Ø (changer), по- (changer), об- (échanger), раз- (donner la monnaie)',
		explanation_en: 'Ø (to change), по- (to change), об- (to exchange), раз- (to break money)',
	},

	// 80. -чинить (to repair)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['чинит', 'починит', 'подчинит', 'причинит'],
		sentences: [
			{ text: 'Мастер ___ телефоны.', correct: 0 },
			{ text: 'Он ___ машину за день.', correct: 1 },
			{ text: 'Начальник ___ сотрудников своей воле.', correct: 2 },
			{ text: 'Его действия ___ вред компании.', correct: 3 },
		],
		explanation_fr: 'Ø (réparer), по- (réparer), под- (soumettre), при- (causer)',
		explanation_en: 'Ø (to repair), по- (to fix), под- (to subordinate), при- (to cause harm)',
	},

	// 81. -ломать (to break)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['ломает', 'сломает', 'взломает', 'подломится'],
		sentences: [
			{ text: 'Ребёнок ___ игрушки.', correct: 0 },
			{ text: 'Он случайно ___ стул.', correct: 1 },
			{ text: 'Хакер ___ систему безопасности.', correct: 2 },
			{ text: 'Ветка ___ под тяжестью снега.', correct: 3 },
		],
		explanation_fr: 'Ø (casser), с- (casser), вз- (pirater), под- (céder)',
		explanation_en: 'Ø (to break), с- (to break), вз- (to hack), под- (to give way)',
	},

	// 82. -мочь (can/be able)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['может', 'сможет', 'поможет', 'подможет'],
		sentences: [
			{ text: 'Он ___ говорить по-английски.', correct: 0 },
			{ text: 'Она обязательно ___ решить эту задачу.', correct: 1 },
			{ text: 'Друг ___ мне переехать.', correct: 2 },
			{ text: 'Ветер ___ дереву упасть.', correct: 3 },
		],
		explanation_fr: 'Ø (pouvoir), с- (pouvoir/réussir), по- (aider), под- (aider à)',
		explanation_en: 'Ø (can), с- (will be able), по- (to help), под- (to help cause)',
	},

	// 83. -хотеть (to want)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['хочет', 'захочет', 'расхочет', 'похочет'],
		sentences: [
			{ text: 'Он ___ поехать в отпуск.', correct: 0 },
			{ text: 'Когда она увидит цену, она ___ купить.', correct: 1 },
			{ text: 'Может быть, он ___ идти на вечеринку.', correct: 2 },
			{ text: 'Может, ему ___ есть.', correct: 3 },
		],
		explanation_fr: 'Ø (vouloir), за- (avoir envie), рас- (ne plus vouloir), по- (avoir envie)',
		explanation_en: 'Ø (to want), за- (to want to), рас- (to stop wanting), по- (to want a bit)',
	},

	// 84. -нуждаться (to need)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['нуждается', 'принуждает', 'вынуждает', 'понуждает'],
		sentences: [
			{ text: 'Он ___ в помощи врача.', correct: 0 },
			{ text: 'Закон ___ граждан платить налоги.', correct: 1 },
			{ text: 'Ситуация ___ нас действовать быстро.', correct: 2 },
			{ text: 'Начальник ___ сотрудников работать сверхурочно.', correct: 3 },
		],
		explanation_fr: 'Ø (avoir besoin), при- (contraindre), вы- (forcer), по- (inciter)',
		explanation_en: 'Ø (to need), при- (to coerce), вы- (to force), по- (to urge)',
	},

	// 85. -давать (to give)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['даёт', 'отдаёт', 'раздаёт', 'поддаёт'],
		sentences: [
			{ text: 'Учитель ___ задание ученикам.', correct: 0 },
			{ text: 'Он ___ книгу в библиотеку.', correct: 1 },
			{ text: 'Волонтёр ___ еду бездомным.', correct: 2 },
			{ text: 'Он ___ жару в печь.', correct: 3 },
		],
		explanation_fr: 'Ø (donner), от- (rendre), раз- (distribuer), под- (ajouter)',
		explanation_en: 'Ø (to give), от- (to give back), раз- (to distribute), под- (to add more)',
	},

	// 86. -просить (to ask)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['просит', 'попросит', 'спросит', 'допросит'],
		sentences: [
			{ text: 'Он ___ маму купить игрушку.', correct: 0 },
			{ text: 'Она ___ друга помочь с переездом.', correct: 1 },
			{ text: 'Учитель ___ ученика о домашнем задании.', correct: 2 },
			{ text: 'Следователь ___ свидетеля два часа.', correct: 3 },
		],
		explanation_fr: 'Ø (demander), по- (demander), с- (poser une question), до- (interroger)',
		explanation_en: 'Ø (to ask for), по- (to ask), с- (to ask question), до- (to interrogate)',
	},

	// 87. -отвечать (to answer)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['отвечает', 'ответит', 'подотвечает', 'доотвечает'],
		sentences: [
			{ text: 'Ученик ___ на вопрос учителя.', correct: 0 },
			{ text: 'Он обязательно ___ на письмо.', correct: 1 },
			{ text: 'Она быстро ___ реплику в диалоге.', correct: 2 },
			{ text: 'Студент ___ последнюю часть ответа.', correct: 3 },
		],
		explanation_fr: 'от- (répondre), от- (répondre), под- (répondre rapidement), до- (finir de répondre)',
		explanation_en: 'от- (to answer), от- (to answer), под- (to respond quickly), до- (to finish answering)',
	},

	// 88. -звать (to call)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['зовут', 'позовёт', 'призовёт', 'назовёт'],
		sentences: [
			{ text: 'Его ___ Иван.', correct: 0 },
			{ text: 'Мама ___ детей обедать.', correct: 1 },
			{ text: 'Президент ___ граждан к порядку.', correct: 2 },
			{ text: 'Она ___ ребёнка Александром.', correct: 3 },
		],
		explanation_fr: 'Ø (s\'appeler), по- (appeler), при- (appeler à), на- (nommer)',
		explanation_en: 'Ø (to be called), по- (to call), при- (to call upon), на- (to name)',
	},

	// 89. -кричать (to shout)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['кричит', 'закричит', 'вскрикнет', 'прокричит'],
		sentences: [
			{ text: 'Ребёнок громко ___ в парке.', correct: 0 },
			{ text: 'Она ___ от испуга.', correct: 1 },
			{ text: 'Девушка ___ от неожиданности.', correct: 2 },
			{ text: 'Он ___ весь день на рабочих.', correct: 3 },
		],
		explanation_fr: 'Ø (crier), за- (se mettre à crier), вс- (pousser un cri), про- (crier longtemps)',
		explanation_en: 'Ø (to shout), за- (to start shouting), вс- (to cry out), про- (to shout for long)',
	},

	// 90. -молчать (to be silent)
	{
		question_fr: 'Choisissez le verbe avec le bon préfixe',
		question_en: 'Choose the verb with the correct prefix',
		question_ru: 'Выберите глагол с правильной приставкой',
		type: 'multi_fill',
		options: ['молчит', 'помолчит', 'замолчит', 'промолчит'],
		sentences: [
			{ text: 'Он ___ и не отвечает на вопросы.', correct: 0 },
			{ text: 'Она ___ минуту и подумает.', correct: 1 },
			{ text: 'Когда учитель вошёл, класс ___.', correct: 2 },
			{ text: 'Лучше он ___ об этой истории.', correct: 3 },
		],
		explanation_fr: 'Ø (se taire), по- (se taire un moment), за- (se taire soudainement), про- (garder le silence)',
		explanation_en: 'Ø (to be silent), по- (to be silent briefly), за- (to fall silent), про- (to keep silent)',
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

	// Insert in batches of 10 to avoid timeout
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
	console.log('\n📊 Summary of roots covered:')
	console.log('   говорить, играть, учить, делать, брать, класть, лить, падать, строить, пить')
	console.log('   работать, жить, любить, открывать, крывать, резать, мыть, варить, жарить, печь')
	console.log('   солить, таять, мерзать, греть, жигать, тушить, курить, копать, сажать, расти')
	console.log('   цвести, вянуть, поливать, собирать, бирать, кидать, ловить, держать, жать, тянуть')
	console.log('   толкать, двигать, бросать, вешать, снимать, надевать, рвать, шить, чесать, красить')
	console.log('   рисовать, видеть, слышать, смотреть, думать, знать, помнить, забыть, терять, находить')
	console.log('   искать, ждать, встречать, провожать, приходить, уходить, садиться, вставать, ложиться, будить')
	console.log('   спать, есть, кормить, покупать, продавать, платить, считать, менять, чинить, ломать')
	console.log('   мочь, хотеть, нуждаться, давать, просить, отвечать, звать, кричать, молчать')

	console.log('\n✨ Done! You now have 100 prefix exercises total in the database.')
	console.log('   You can view them in the admin panel at /admin/training')
}

main()
