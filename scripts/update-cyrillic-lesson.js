/**
 * Script to update the cyrillic-alphabet-sounds lesson
 * - Add alphabetGrid with 33 letters and audio
 * - Remove IPA transcriptions
 * Usage: node scripts/update-cyrillic-lesson.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// Base URL for audio files
const AUDIO_BASE = 'https://linguami-cdn.etreailleurs.workers.dev/audios/ru/lessons/beginner/lesson-1'

// 33 Russian letters with examples
const cyrillicAlphabet = [
	{ letter: 'А', word: 'Арбуз', emoji: '🍉', wordEn: 'Watermelon', wordFr: 'Pastèque' },
	{ letter: 'Б', word: 'Банан', emoji: '🍌', wordEn: 'Banana', wordFr: 'Banane' },
	{ letter: 'В', word: 'Волк', emoji: '🐺', wordEn: 'Wolf', wordFr: 'Loup' },
	{ letter: 'Г', word: 'Гриб', emoji: '🍄', wordEn: 'Mushroom', wordFr: 'Champignon' },
	{ letter: 'Д', word: 'Дом', emoji: '🏠', wordEn: 'House', wordFr: 'Maison' },
	{ letter: 'Е', word: 'Ель', emoji: '🌲', wordEn: 'Fir tree', wordFr: 'Sapin' },
	{ letter: 'Ё', word: 'Ёжик', emoji: '🦔', wordEn: 'Hedgehog', wordFr: 'Hérisson' },
	{ letter: 'Ж', word: 'Жук', emoji: '🪲', wordEn: 'Beetle', wordFr: 'Scarabée' },
	{ letter: 'З', word: 'Звезда', emoji: '⭐', wordEn: 'Star', wordFr: 'Étoile' },
	{ letter: 'И', word: 'Игла', emoji: '🪡', wordEn: 'Needle', wordFr: 'Aiguille' },
	{ letter: 'Й', word: 'Йогурт', emoji: '🥛', wordEn: 'Yogurt', wordFr: 'Yaourt' },
	{ letter: 'К', word: 'Кот', emoji: '🐱', wordEn: 'Cat', wordFr: 'Chat' },
	{ letter: 'Л', word: 'Лев', emoji: '🦁', wordEn: 'Lion', wordFr: 'Lion' },
	{ letter: 'М', word: 'Мама', emoji: '👩', wordEn: 'Mom', wordFr: 'Maman' },
	{ letter: 'Н', word: 'Нос', emoji: '👃', wordEn: 'Nose', wordFr: 'Nez' },
	{ letter: 'О', word: 'Облако', emoji: '☁️', wordEn: 'Cloud', wordFr: 'Nuage' },
	{ letter: 'П', word: 'Пингвин', emoji: '🐧', wordEn: 'Penguin', wordFr: 'Pingouin' },
	{ letter: 'Р', word: 'Рыба', emoji: '🐟', wordEn: 'Fish', wordFr: 'Poisson' },
	{ letter: 'С', word: 'Солнце', emoji: '☀️', wordEn: 'Sun', wordFr: 'Soleil' },
	{ letter: 'Т', word: 'Тигр', emoji: '🐯', wordEn: 'Tiger', wordFr: 'Tigre' },
	{ letter: 'У', word: 'Утка', emoji: '🦆', wordEn: 'Duck', wordFr: 'Canard' },
	{ letter: 'Ф', word: 'Флаг', emoji: '🚩', wordEn: 'Flag', wordFr: 'Drapeau' },
	{ letter: 'Х', word: 'Хлеб', emoji: '🍞', wordEn: 'Bread', wordFr: 'Pain' },
	{ letter: 'Ц', word: 'Цветок', emoji: '🌸', wordEn: 'Flower', wordFr: 'Fleur' },
	{ letter: 'Ч', word: 'Часы', emoji: '⏰', wordEn: 'Clock', wordFr: 'Horloge' },
	{ letter: 'Ш', word: 'Шапка', emoji: '🧢', wordEn: 'Hat', wordFr: 'Chapeau' },
	{ letter: 'Щ', word: 'Щенок', emoji: '🐶', wordEn: 'Puppy', wordFr: 'Chiot' },
	{ letter: 'Ъ', word: 'Объект', emoji: '📦', wordEn: 'Object', wordFr: 'Objet', isSign: true },
	{ letter: 'Ы', word: 'Рыба', emoji: '🐟', wordEn: 'Fish', wordFr: 'Poisson' },
	{ letter: 'Ь', word: 'Мать', emoji: '👩‍👧', wordEn: 'Mother', wordFr: 'Mère', isSign: true },
	{ letter: 'Э', word: 'Эхо', emoji: '🔊', wordEn: 'Echo', wordFr: 'Écho' },
	{ letter: 'Ю', word: 'Юла', emoji: '🪀', wordEn: 'Spinning top', wordFr: 'Toupie' },
	{ letter: 'Я', word: 'Яблоко', emoji: '🍎', wordEn: 'Apple', wordFr: 'Pomme' },
]

// New blocks for French speakers
const blocks_fr = [
	{
		type: 'mainTitle',
		text: 'Alphabet cyrillique et sons'
	},
	{
		type: 'subtitle',
		text: 'Les fondamentaux de la prononciation russe'
	},
	{
		type: 'quickSummary',
		title: 'Points clés',
		keyForms: [
			{ form: '33 lettres', translation: '10 voyelles, 21 consonnes, 2 signes' },
			{ form: 'Lettres familières', translation: 'А, Е, К, М, О, Т ressemblent au latin' },
			{ form: 'Faux-amis', translation: 'В = V, Р = R, Н = N, С = S' },
			{ form: 'Sons uniques', translation: 'Ы, Ж, Ц, Щ, Х' }
		]
	},
	{
		type: 'title',
		text: "L'alphabet cyrillique"
	},
	{
		type: 'paragraph',
		text: "L'alphabet russe compte <strong>33 lettres</strong> (contre 26 en français). Il a été créé au IXe siècle par les frères Cyrille et Méthode. Beaucoup de lettres ressemblent au latin, mais attention aux faux-amis !"
	},
	{
		type: 'alphabetGrid',
		title: "L'alphabet russe illustré",
		letters: cyrillicAlphabet.map(l => ({
			letter: l.letter,
			word: l.word,
			emoji: l.emoji,
			audioUrl: `${AUDIO_BASE}/${l.letter.toLowerCase()}.mp3`
		}))
	},
	{
		type: 'conjugationTable',
		title: 'Voyelles et consonnes',
		rows: [
			{ pronoun: 'Voyelles (10)', form: 'А, Е, Ё, И, О, У, Ы, Э, Ю, Я' },
			{ pronoun: 'Consonnes (21)', form: 'Б, В, Г, Д, Ж, З, Й, К, Л, М, Н, П, Р, С, Т, Ф, Х, Ц, Ч, Ш, Щ' },
			{ pronoun: 'Signes (2)', form: 'Ъ (signe dur), Ь (signe mou)' }
		]
	},
	{
		type: 'title',
		text: 'Les voyelles russes'
	},
	{
		type: 'paragraph',
		text: 'Le russe a <strong>10 voyelles</strong>, dont 5 "dures" et 5 "molles" (qui adoucissent la consonne précédente).'
	},
	{
		type: 'conjugationTable',
		title: 'Voyelles dures et molles',
		rows: [
			{ pronoun: 'А а', form: 'comme "a" dans papa', translation: 'мама - maman' },
			{ pronoun: 'О о', form: 'comme "o" dans vol', translation: 'кот - chat' },
			{ pronoun: 'У у', form: 'comme "ou" dans cou', translation: 'ум - esprit' },
			{ pronoun: 'Э э', form: 'comme "è" dans mère', translation: 'это - ceci' },
			{ pronoun: 'Ы ы', form: '⚠️ Son unique ! Entre "i" et "eu"', translation: 'ты - tu' },
			{ pronoun: 'Я я', form: 'comme "ya" dans yaourt', translation: 'я - je' },
			{ pronoun: 'Е е', form: '"yé" au début, "é" après consonne', translation: 'ель - sapin' },
			{ pronoun: 'Ё ё', form: 'comme "yo" dans yoga', translation: 'ёжик - hérisson' },
			{ pronoun: 'Ю ю', form: 'comme "you" en anglais', translation: 'юг - sud' },
			{ pronoun: 'И и', form: 'comme "i" dans lit', translation: 'мир - monde' }
		]
	},
	{
		type: 'importantNote',
		title: 'Le son Ы - le plus difficile !',
		content: 'Ce son n\'existe pas en français. Pour le prononcer :',
		examples: [
			'Dites "i" mais reculez la langue vers l\'arrière',
			'Gardez les lèvres non arrondies (contrairement au "ou")',
			'Imaginez qu\'on vous donne un coup dans le ventre en disant "i"'
		],
		note: '🎯 Mots pour pratiquer : ты (tu), мы (nous), вы (vous), рыба (poisson)'
	},
	{
		type: 'title',
		text: 'Les consonnes pièges (faux-amis)'
	},
	{
		type: 'paragraph',
		text: 'Ces lettres ressemblent au latin mais se prononcent différemment !'
	},
	{
		type: 'usageList',
		title: 'Attention aux faux-amis !',
		items: [
			{
				usage: 'В в → se prononce "V"',
				examples: ['вода (vada) - eau', 'вино (vino) - vin', 'Владимир (Vladimir)'],
				commonMistake: { wrong: 'Lire comme "B"', correct: 'Toujours "V" comme "valise"' }
			},
			{
				usage: 'Р р → se prononce "R" roulé',
				examples: ['рыба (ryba) - poisson', 'Россия (Rassiya) - Russie', 'работа (rabota) - travail'],
				commonMistake: { wrong: 'Lire comme "P"', correct: 'C\'est un R roulé !' }
			},
			{
				usage: 'Н н → se prononce "N"',
				examples: ['нет (niet) - non', 'небо (niéba) - ciel', 'нос (nos) - nez'],
				commonMistake: { wrong: 'Lire comme "H"', correct: 'Toujours "N" comme "non"' }
			},
			{
				usage: 'С с → se prononce "S"',
				examples: ['собака (sabaka) - chien', 'стол (stol) - table', 'Москва (Maskva) - Moscou'],
				commonMistake: { wrong: 'Lire comme "C"', correct: 'Toujours "S" comme "soleil"' }
			},
			{
				usage: 'Х х → son guttural',
				examples: ['хлеб (khlieb) - pain', 'хорошо (kharacho) - bien', 'Чехов (Tchékhov)'],
				commonMistake: { wrong: 'Lire comme "X" ou "H"', correct: 'Comme la "jota" espagnole ou le "ch" allemand' }
			}
		]
	},
	{
		type: 'title',
		text: 'Sons uniques au russe'
	},
	{
		type: 'conjugationTable',
		title: 'Consonnes spéciales',
		rows: [
			{ pronoun: 'Ж ж', form: 'comme "j" dans jardin', translation: 'жить (jit\') - vivre' },
			{ pronoun: 'Ц ц', form: 'comme "ts" dans tsar', translation: 'царь (tsar\') - tsar' },
			{ pronoun: 'Ч ч', form: 'comme "tch" dans tchèque', translation: 'час (tchas) - heure' },
			{ pronoun: 'Ш ш', form: 'comme "ch" dans chat', translation: 'школа (chkola) - école' },
			{ pronoun: 'Щ щ', form: '"ch" long et mouillé', translation: 'борщ (borchtch) - bortsch' }
		]
	},
	{
		type: 'title',
		text: 'Les signes spéciaux'
	},
	{
		type: 'paragraph',
		text: 'Ces deux signes ne se prononcent pas seuls, mais modifient la consonne qui précède :'
	},
	{
		type: 'list',
		items: [
			'<strong>Ь (signe mou)</strong> — rend la consonne plus douce/mouillée. Ex: мать (mat\') - mère',
			'<strong>Ъ (signe dur)</strong> — sépare les syllabes, empêche l\'adoucissement. Ex: объект (abyékt) - objet'
		]
	},
	{
		type: 'mistakesTable',
		title: 'Erreurs courantes',
		rows: [
			{ wrong: 'Lire В comme "B"', correct: 'В = toujours "V"', explanation: 'Владимир = Vladimir, pas Bladimir' },
			{ wrong: 'Lire Р comme "P"', correct: 'Р = R roulé', explanation: 'Россия = Rassiya, pas Passiya' },
			{ wrong: 'Lire Н comme "H"', correct: 'Н = toujours "N"', explanation: 'нет = niet, pas hiet' },
			{ wrong: 'Lire С comme "C"', correct: 'С = toujours "S"', explanation: 'Москва = Maskva, pas Mackva' },
			{ wrong: 'Confondre И et Ы', correct: 'И = "i", Ы = son unique', explanation: 'мир (mir) ≠ мыр' }
		]
	},
	{
		type: 'miniDialogue',
		title: 'Épeler son nom en russe',
		lines: [
			{ speaker: 'Анна', text: 'Как тебя зовут?' },
			{ speaker: 'Марк', text: 'Меня зовут Марк. М-А-Р-К.' },
			{ speaker: 'Анна', text: 'А меня зовут Анна. А-Н-Н-А.' }
		],
		translation: '— Comment tu t\'appelles ? — Je m\'appelle Mark. M-A-R-K. — Et moi je m\'appelle Anna. A-N-N-A.'
	},
	{
		type: 'relatedTopics'
	},
	{
		type: 'exercise_inline',
		exerciseType: 'fillInBlank',
		title: 'Exercice 1 : Reconnaissance des lettres',
		xpReward: 15,
		questions: [
			{
				question: 'Quelle lettre cyrillique ressemble à "P" mais se prononce "R" ?',
				answer: 'Р',
				acceptableAnswers: ['Р', 'р'],
				hint: 'Faux-ami du latin'
			},
			{
				question: 'Comment se prononce la lettre "В" en russe ?',
				answer: 'V',
				acceptableAnswers: ['V', 'v'],
				hint: 'Comme dans "valise"'
			},
			{
				question: 'Combien de lettres compte l\'alphabet russe ?',
				answer: '33',
				acceptableAnswers: ['33', 'trente-trois', 'trente trois'],
				hint: 'Plus que le latin'
			},
			{
				question: 'Quelle lettre cyrillique se prononce comme "N" ?',
				answer: 'Н',
				acceptableAnswers: ['Н', 'н'],
				hint: 'Ressemble à H'
			},
			{
				question: 'Combien de voyelles compte l\'alphabet russe ?',
				answer: '10',
				acceptableAnswers: ['10', 'dix'],
				hint: 'Plus qu\'en français'
			}
		]
	},
	{
		type: 'exercise_inline',
		exerciseType: 'dragAndDrop',
		title: 'Exercice 2 : Association voyelles-sons',
		xpReward: 20,
		pairs: [
			{ id: 1, left: { fr: 'А а', en: 'А а', ru: 'А а' }, right: { fr: 'a (comme papa)', en: 'a (as in father)', ru: 'а (как папа)' } },
			{ id: 2, left: { fr: 'О о', en: 'О о', ru: 'О о' }, right: { fr: 'o (comme vol)', en: 'o (as in more)', ru: 'о (как дом)' } },
			{ id: 3, left: { fr: 'У у', en: 'У у', ru: 'У у' }, right: { fr: 'ou (comme cou)', en: 'oo (as in moon)', ru: 'у (как ум)' } },
			{ id: 4, left: { fr: 'И и', en: 'И и', ru: 'И и' }, right: { fr: 'i (comme lit)', en: 'ee (as in meet)', ru: 'и (как мир)' } },
			{ id: 5, left: { fr: 'Ы ы', en: 'Ы ы', ru: 'Ы ы' }, right: { fr: 'son unique (entre i et eu)', en: 'unique sound', ru: 'ы (как ты)' } }
		]
	},
	{
		type: 'exercise_inline',
		exerciseType: 'fillInBlank',
		title: 'Exercice 3 : Premiers mots',
		xpReward: 15,
		questions: [
			{
				question: 'Comment dit-on "oui" en russe ?',
				answer: 'да',
				acceptableAnswers: ['да'],
				hint: 'Deux lettres'
			},
			{
				question: 'Comment dit-on "non" en russe ?',
				answer: 'нет',
				acceptableAnswers: ['нет'],
				hint: 'Trois lettres'
			},
			{
				question: 'Comment dit-on "maman" en russe ?',
				answer: 'мама',
				acceptableAnswers: ['мама'],
				hint: 'Même racine qu\'en français'
			},
			{
				question: 'Comment dit-on "papa" en russe ?',
				answer: 'папа',
				acceptableAnswers: ['папа'],
				hint: 'Similaire au français'
			}
		]
	}
]

// New blocks for English speakers
const blocks_en = [
	{
		type: 'mainTitle',
		text: 'Cyrillic Alphabet and Sounds'
	},
	{
		type: 'subtitle',
		text: 'Russian Pronunciation Fundamentals'
	},
	{
		type: 'quickSummary',
		title: 'Key Points',
		keyForms: [
			{ form: '33 letters', translation: '10 vowels, 21 consonants, 2 signs' },
			{ form: 'Familiar letters', translation: 'А, Е, К, М, О, Т look like Latin' },
			{ form: 'False friends', translation: 'В = V, Р = R, Н = N, С = S' },
			{ form: 'Unique sounds', translation: 'Ы, Ж, Ц, Щ, Х' }
		]
	},
	{
		type: 'title',
		text: 'The Cyrillic Alphabet'
	},
	{
		type: 'paragraph',
		text: 'The Russian alphabet has <strong>33 letters</strong> (compared to 26 in English). It was created in the 9th century by brothers Cyril and Methodius. Many letters look like Latin ones, but watch out for false friends!'
	},
	{
		type: 'alphabetGrid',
		title: 'The Russian Alphabet Illustrated',
		letters: cyrillicAlphabet.map(l => ({
			letter: l.letter,
			word: l.word,  // Always show Russian word since we're teaching Russian
			emoji: l.emoji,
			audioUrl: `${AUDIO_BASE}/${l.letter.toLowerCase()}.mp3`
		}))
	},
	{
		type: 'conjugationTable',
		title: 'Vowels and Consonants',
		rows: [
			{ pronoun: 'Vowels (10)', form: 'А, Е, Ё, И, О, У, Ы, Э, Ю, Я' },
			{ pronoun: 'Consonants (21)', form: 'Б, В, Г, Д, Ж, З, Й, К, Л, М, Н, П, Р, С, Т, Ф, Х, Ц, Ч, Ш, Щ' },
			{ pronoun: 'Signs (2)', form: 'Ъ (hard sign), Ь (soft sign)' }
		]
	},
	{
		type: 'title',
		text: 'Russian Vowels'
	},
	{
		type: 'paragraph',
		text: 'Russian has <strong>10 vowels</strong>, including 5 "hard" and 5 "soft" ones (which soften the preceding consonant).'
	},
	{
		type: 'conjugationTable',
		title: 'Hard and Soft Vowels',
		rows: [
			{ pronoun: 'А а', form: 'like "a" in father', translation: 'мама - mom' },
			{ pronoun: 'О о', form: 'like "o" in more', translation: 'кот - cat' },
			{ pronoun: 'У у', form: 'like "oo" in moon', translation: 'ум - mind' },
			{ pronoun: 'Э э', form: 'like "e" in met', translation: 'это - this' },
			{ pronoun: 'Ы ы', form: '⚠️ Unique sound! Between "i" and "u"', translation: 'ты - you' },
			{ pronoun: 'Я я', form: 'like "ya" in yard', translation: 'я - I' },
			{ pronoun: 'Е е', form: '"ye" at start, "e" after consonant', translation: 'ель - fir tree' },
			{ pronoun: 'Ё ё', form: 'like "yo" in yoga', translation: 'ёжик - hedgehog' },
			{ pronoun: 'Ю ю', form: 'like "you"', translation: 'юг - south' },
			{ pronoun: 'И и', form: 'like "ee" in see', translation: 'мир - world' }
		]
	},
	{
		type: 'importantNote',
		title: 'The Ы sound - the trickiest one!',
		content: 'This sound doesn\'t exist in English. To pronounce it:',
		examples: [
			'Say "ee" but pull your tongue back toward your throat',
			'Keep your lips unrounded (unlike "oo")',
			'Imagine someone punched you in the stomach while saying "ee"'
		],
		note: '🎯 Words to practice: ты (you), мы (we), вы (you formal), рыба (fish)'
	},
	{
		type: 'title',
		text: 'Tricky Consonants (False Friends)'
	},
	{
		type: 'paragraph',
		text: 'These letters look like Latin but are pronounced differently!'
	},
	{
		type: 'usageList',
		title: 'Watch out for false friends!',
		items: [
			{
				usage: 'В в → pronounced "V"',
				examples: ['вода (vada) - water', 'вино (vino) - wine', 'Владимир (Vladimir)'],
				commonMistake: { wrong: 'Reading as "B"', correct: 'Always "V" as in "van"' }
			},
			{
				usage: 'Р р → pronounced rolled "R"',
				examples: ['рыба (ryba) - fish', 'Россия (Rassiya) - Russia', 'работа (rabota) - work'],
				commonMistake: { wrong: 'Reading as "P"', correct: 'It\'s a rolled R!' }
			},
			{
				usage: 'Н н → pronounced "N"',
				examples: ['нет (nyet) - no', 'небо (nyeba) - sky', 'нос (nos) - nose'],
				commonMistake: { wrong: 'Reading as "H"', correct: 'Always "N" as in "no"' }
			},
			{
				usage: 'С с → pronounced "S"',
				examples: ['собака (sabaka) - dog', 'стол (stol) - table', 'Москва (Maskva) - Moscow'],
				commonMistake: { wrong: 'Reading as "C"', correct: 'Always "S" as in "sun"' }
			},
			{
				usage: 'Х х → guttural sound',
				examples: ['хлеб (khlyeb) - bread', 'хорошо (kharasho) - good', 'Чехов (Chekhov)'],
				commonMistake: { wrong: 'Reading as "X" or "H"', correct: 'Like Scottish "loch" or German "Bach"' }
			}
		]
	},
	{
		type: 'title',
		text: 'Unique Russian Sounds'
	},
	{
		type: 'conjugationTable',
		title: 'Special Consonants',
		rows: [
			{ pronoun: 'Ж ж', form: 'like "s" in measure', translation: 'жить (zhit\') - to live' },
			{ pronoun: 'Ц ц', form: 'like "ts" in cats', translation: 'царь (tsar\') - tsar' },
			{ pronoun: 'Ч ч', form: 'like "ch" in church', translation: 'час (chas) - hour' },
			{ pronoun: 'Ш ш', form: 'like "sh" in shop', translation: 'школа (shkola) - school' },
			{ pronoun: 'Щ щ', form: 'long soft "sh"', translation: 'борщ (borshch) - borscht' }
		]
	},
	{
		type: 'title',
		text: 'Special Signs'
	},
	{
		type: 'paragraph',
		text: 'These two signs are not pronounced alone, but modify the consonant before them:'
	},
	{
		type: 'list',
		items: [
			'<strong>Ь (soft sign)</strong> — makes the consonant softer/palatalized. Ex: мать (mat\') - mother',
			'<strong>Ъ (hard sign)</strong> — separates syllables, prevents softening. Ex: объект (abyekt) - object'
		]
	},
	{
		type: 'mistakesTable',
		title: 'Common Mistakes',
		rows: [
			{ wrong: 'Reading В as "B"', correct: 'В = always "V"', explanation: 'Владимир = Vladimir, not Bladimir' },
			{ wrong: 'Reading Р as "P"', correct: 'Р = rolled R', explanation: 'Россия = Rassiya, not Passiya' },
			{ wrong: 'Reading Н as "H"', correct: 'Н = always "N"', explanation: 'нет = nyet, not hyet' },
			{ wrong: 'Reading С as "C"', correct: 'С = always "S"', explanation: 'Москва = Maskva, not Mackva' },
			{ wrong: 'Confusing И and Ы', correct: 'И = "ee", Ы = unique sound', explanation: 'мир (mir) ≠ мыр' }
		]
	},
	{
		type: 'miniDialogue',
		title: 'Spelling Your Name in Russian',
		lines: [
			{ speaker: 'Анна', text: 'Как тебя зовут?' },
			{ speaker: 'Марк', text: 'Меня зовут Марк. М-А-Р-К.' },
			{ speaker: 'Анна', text: 'А меня зовут Анна. А-Н-Н-А.' }
		],
		translation: '— What\'s your name? — My name is Mark. M-A-R-K. — And my name is Anna. A-N-N-A.'
	},
	{
		type: 'relatedTopics'
	},
	{
		type: 'exercise_inline',
		exerciseType: 'fillInBlank',
		title: 'Exercise 1: Letter Recognition',
		xpReward: 15,
		questions: [
			{
				question: 'Which Cyrillic letter looks like "P" but is pronounced "R"?',
				answer: 'Р',
				acceptableAnswers: ['Р', 'р'],
				hint: 'False friend from Latin'
			},
			{
				question: 'How is the letter "В" pronounced in Russian?',
				answer: 'V',
				acceptableAnswers: ['V', 'v'],
				hint: 'Like "van"'
			},
			{
				question: 'How many letters does the Russian alphabet have?',
				answer: '33',
				acceptableAnswers: ['33', 'thirty-three', 'thirty three'],
				hint: 'More than Latin'
			},
			{
				question: 'Which Cyrillic letter is pronounced like "N"?',
				answer: 'Н',
				acceptableAnswers: ['Н', 'н'],
				hint: 'Looks like H'
			},
			{
				question: 'How many vowels does the Russian alphabet have?',
				answer: '10',
				acceptableAnswers: ['10', 'ten'],
				hint: 'More than English'
			}
		]
	},
	{
		type: 'exercise_inline',
		exerciseType: 'dragAndDrop',
		title: 'Exercise 2: Vowel-Sound Matching',
		xpReward: 20,
		pairs: [
			{ id: 1, left: { fr: 'А а', en: 'А а', ru: 'А а' }, right: { fr: 'a (comme papa)', en: 'a (as in father)', ru: 'а (как папа)' } },
			{ id: 2, left: { fr: 'О о', en: 'О о', ru: 'О о' }, right: { fr: 'o (comme vol)', en: 'o (as in more)', ru: 'о (как дом)' } },
			{ id: 3, left: { fr: 'У у', en: 'У у', ru: 'У у' }, right: { fr: 'ou (comme cou)', en: 'oo (as in moon)', ru: 'у (как ум)' } },
			{ id: 4, left: { fr: 'И и', en: 'И и', ru: 'И и' }, right: { fr: 'i (comme lit)', en: 'ee (as in meet)', ru: 'и (как мир)' } },
			{ id: 5, left: { fr: 'Ы ы', en: 'Ы ы', ru: 'Ы ы' }, right: { fr: 'son unique (entre i et eu)', en: 'unique sound', ru: 'ы (как ты)' } }
		]
	},
	{
		type: 'exercise_inline',
		exerciseType: 'fillInBlank',
		title: 'Exercise 3: First Words',
		xpReward: 15,
		questions: [
			{
				question: 'How do you say "yes" in Russian?',
				answer: 'да',
				acceptableAnswers: ['да'],
				hint: 'Two letters'
			},
			{
				question: 'How do you say "no" in Russian?',
				answer: 'нет',
				acceptableAnswers: ['нет'],
				hint: 'Three letters'
			},
			{
				question: 'How do you say "mom" in Russian?',
				answer: 'мама',
				acceptableAnswers: ['мама'],
				hint: 'Same root as English'
			},
			{
				question: 'How do you say "dad" in Russian?',
				answer: 'папа',
				acceptableAnswers: ['папа'],
				hint: 'Similar to English'
			}
		]
	}
]

async function updateLesson() {
	console.log('Updating cyrillic-alphabet-sounds lesson...\n')

	const { data, error } = await supabase
		.from('lessons')
		.update({
			blocks_fr,
			blocks_en
		})
		.eq('slug', 'cyrillic-alphabet-sounds')
		.select('id, slug, title_fr')

	if (error) {
		console.error('Error updating lesson:', error)
		return
	}

	console.log('✅ Lesson updated successfully!')
	console.log('Updated:', data)
	console.log('\nChanges made:')
	console.log('- Added alphabetGrid with 33 Cyrillic letters')
	console.log('- Removed IPA transcriptions')
	console.log('- Improved vowel and consonant tables')
	console.log('- Added importantNote for Ы sound')
	console.log('- Reorganized content structure')
}

updateLesson().catch(console.error)
