/**
 * Script to fix the cyrillic-alphabet-sounds lesson
 * - Remove exercise_inline blocks from lesson
 * - Create proper exercises in exercises table with lesson_id
 * Usage: node scripts/fix-cyrillic-lesson-exercises.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const LESSON_ID = 34 // cyrillic-alphabet-sounds

// Exercises to create in the exercises table
const exercisesToCreate = [
	{
		lesson_id: LESSON_ID,
		parent_type: 'lesson',
		parent_id: LESSON_ID,
		type: 'mcq',
		title: 'Compréhension de la leçon',
		level: 'A1',
		lang: 'ru',
		xp_reward: 15,
		data: {
			questions: [
				{
					id: 1,
					question: 'Сколько букв в русском алфавите?',
					question_fr: 'Combien de lettres compte l\'alphabet russe ?',
					question_en: 'How many letters are in the Russian alphabet?',
					question_ru: 'Сколько букв в русском алфавите?',
					options: ['26', '33', '30'],
					correctAnswer: '33',
					explanation: 'L\'alphabet russe compte 33 lettres : 10 voyelles, 21 consonnes et 2 signes.',
					explanation_en: 'The Russian alphabet has 33 letters: 10 vowels, 21 consonants and 2 signs.',
					explanation_ru: 'В русском алфавите 33 буквы: 10 гласных, 21 согласная и 2 знака.'
				},
				{
					id: 2,
					question: 'Comment se prononce la lettre В en russe ?',
					question_fr: 'Comment se prononce la lettre В en russe ?',
					question_en: 'How is the letter В pronounced in Russian?',
					question_ru: 'Как произносится буква В по-русски?',
					options: ['Comme "B"', 'Comme "V"', 'Comme "W"'],
					correctAnswer: 'Comme "V"',
					explanation: 'В est un faux-ami ! Il ressemble au B latin mais se prononce toujours "V" comme dans "valise".',
					explanation_en: 'В is a false friend! It looks like Latin B but is always pronounced "V" as in "van".',
					explanation_ru: 'В — это ложный друг! Она похожа на латинскую B, но произносится как "В" в слове "вода".'
				},
				{
					id: 3,
					question: 'Quelle lettre cyrillique ressemble à "P" mais se prononce "R" ?',
					question_fr: 'Quelle lettre cyrillique ressemble à "P" mais se prononce "R" ?',
					question_en: 'Which Cyrillic letter looks like "P" but is pronounced "R"?',
					question_ru: 'Какая кириллическая буква похожа на "P", но произносится как "Р"?',
					options: ['П', 'Р', 'Н'],
					correctAnswer: 'Р',
					explanation: 'Р ressemble au P latin mais c\'est un R roulé ! Exemple : Россия (Rassiya) = Russie.',
					explanation_en: 'Р looks like Latin P but it\'s a rolled R! Example: Россия (Rassiya) = Russia.',
					explanation_ru: 'Р похожа на латинскую P, но это русская буква Р! Пример: Россия.'
				},
				{
					id: 4,
					question: 'Combien de voyelles compte l\'alphabet russe ?',
					question_fr: 'Combien de voyelles compte l\'alphabet russe ?',
					question_en: 'How many vowels does the Russian alphabet have?',
					question_ru: 'Сколько гласных в русском алфавите?',
					options: ['6', '10', '8'],
					correctAnswer: '10',
					explanation: 'Le russe a 10 voyelles : А, Е, Ё, И, О, У, Ы, Э, Ю, Я.',
					explanation_en: 'Russian has 10 vowels: А, Е, Ё, И, О, У, Ы, Э, Ю, Я.',
					explanation_ru: 'В русском языке 10 гласных: А, Е, Ё, И, О, У, Ы, Э, Ю, Я.'
				},
				{
					id: 5,
					question: 'Quel son est unique au russe et n\'existe pas en français ?',
					question_fr: 'Quel son est unique au russe et n\'existe pas en français ?',
					question_en: 'Which sound is unique to Russian and doesn\'t exist in French/English?',
					question_ru: 'Какой звук уникален для русского языка?',
					options: ['А', 'Ы', 'О'],
					correctAnswer: 'Ы',
					explanation: 'Le son Ы est unique au russe. C\'est un son entre "i" et "eu", prononcé avec la langue reculée.',
					explanation_en: 'The Ы sound is unique to Russian. It\'s a sound between "i" and "u", pronounced with the tongue pulled back.',
					explanation_ru: 'Звук Ы уникален для русского языка. Это звук между "и" и "у".'
				}
			]
		}
	},
	{
		lesson_id: LESSON_ID,
		parent_type: 'lesson',
		parent_id: LESSON_ID,
		type: 'drag_and_drop',
		title: 'Association des faux-amis',
		level: 'A1',
		lang: 'ru',
		xp_reward: 15,
		data: {
			pairs: [
				{
					id: 1,
					left: { fr: 'В в', en: 'В в', ru: 'В в' },
					right: { fr: 'Se prononce "V"', en: 'Pronounced "V"', ru: 'Произносится как "В"' }
				},
				{
					id: 2,
					left: { fr: 'Р р', en: 'Р р', ru: 'Р р' },
					right: { fr: 'Se prononce "R" roulé', en: 'Pronounced rolled "R"', ru: 'Произносится как "Р"' }
				},
				{
					id: 3,
					left: { fr: 'Н н', en: 'Н н', ru: 'Н н' },
					right: { fr: 'Se prononce "N"', en: 'Pronounced "N"', ru: 'Произносится как "Н"' }
				},
				{
					id: 4,
					left: { fr: 'С с', en: 'С с', ru: 'С с' },
					right: { fr: 'Se prononce "S"', en: 'Pronounced "S"', ru: 'Произносится как "С"' }
				},
				{
					id: 5,
					left: { fr: 'Х х', en: 'Х х', ru: 'Х х' },
					right: { fr: 'Son guttural (comme jota espagnole)', en: 'Guttural sound (like Scottish loch)', ru: 'Гортанный звук' }
				}
			]
		}
	},
	{
		lesson_id: LESSON_ID,
		parent_type: 'lesson',
		parent_id: LESSON_ID,
		type: 'fill_in_blank',
		title: 'Premiers mots en russe',
		level: 'A1',
		lang: 'ru',
		xp_reward: 20,
		data: {
			sentences: [
				{
					question: 'Comment dit-on "oui" en russe ? ___',
					question_fr: 'Comment dit-on "oui" en russe ? ___',
					question_en: 'How do you say "yes" in Russian? ___',
					question_ru: 'Как сказать "да" по-русски? ___',
					answer: 'да',
					acceptableAnswers: ['да'],
					hint: 'Deux lettres, commence par Д'
				},
				{
					question: 'Comment dit-on "non" en russe ? ___',
					question_fr: 'Comment dit-on "non" en russe ? ___',
					question_en: 'How do you say "no" in Russian? ___',
					question_ru: 'Как сказать "нет" по-русски? ___',
					answer: 'нет',
					acceptableAnswers: ['нет'],
					hint: 'Trois lettres'
				},
				{
					question: 'Comment dit-on "maman" en russe ? ___',
					question_fr: 'Comment dit-on "maman" en russe ? ___',
					question_en: 'How do you say "mom" in Russian? ___',
					question_ru: 'Как сказать "мама" по-русски? ___',
					answer: 'мама',
					acceptableAnswers: ['мама'],
					hint: 'Même racine qu\'en français'
				},
				{
					question: 'Comment dit-on "papa" en russe ? ___',
					question_fr: 'Comment dit-on "papa" en russe ? ___',
					question_en: 'How do you say "dad" in Russian? ___',
					question_ru: 'Как сказать "папа" по-русски? ___',
					answer: 'папа',
					acceptableAnswers: ['папа'],
					hint: 'Similaire au français'
				}
			]
		}
	}
]

async function fixLesson() {
	console.log('Fixing cyrillic-alphabet-sounds lesson...\n')

	// Step 1: Get current lesson blocks
	const { data: lesson, error: fetchError } = await supabase
		.from('lessons')
		.select('blocks_fr, blocks_en')
		.eq('id', LESSON_ID)
		.single()

	if (fetchError) {
		console.error('Error fetching lesson:', fetchError)
		return
	}

	// Step 2: Remove exercise_inline blocks
	const blocks_fr_clean = lesson.blocks_fr.filter(b => b.type !== 'exercise_inline')
	const blocks_en_clean = lesson.blocks_en.filter(b => b.type !== 'exercise_inline')

	console.log(`Blocks FR: ${lesson.blocks_fr.length} -> ${blocks_fr_clean.length} (removed ${lesson.blocks_fr.length - blocks_fr_clean.length} exercise blocks)`)
	console.log(`Blocks EN: ${lesson.blocks_en.length} -> ${blocks_en_clean.length} (removed ${lesson.blocks_en.length - blocks_en_clean.length} exercise blocks)`)

	// Step 3: Update lesson
	const { error: updateError } = await supabase
		.from('lessons')
		.update({
			blocks_fr: blocks_fr_clean,
			blocks_en: blocks_en_clean
		})
		.eq('id', LESSON_ID)

	if (updateError) {
		console.error('Error updating lesson:', updateError)
		return
	}

	console.log('✅ Lesson blocks updated (exercise_inline removed)\n')

	// Step 4: Delete existing exercises for this lesson
	const { error: deleteError } = await supabase
		.from('exercises')
		.delete()
		.eq('lesson_id', LESSON_ID)

	if (deleteError) {
		console.error('Error deleting old exercises:', deleteError)
	} else {
		console.log('✅ Old exercises deleted\n')
	}

	// Step 5: Create new exercises in exercises table
	console.log('Creating exercises in exercises table...')

	for (const exercise of exercisesToCreate) {
		const { data, error } = await supabase
			.from('exercises')
			.insert(exercise)
			.select('id, title, type')

		if (error) {
			console.error(`Error creating exercise "${exercise.title}":`, error)
		} else {
			console.log(`  ✅ Created: [${data[0].id}] ${data[0].title} (${data[0].type})`)
		}
	}

	console.log('\n✅ All done!')
}

fixLesson().catch(console.error)
