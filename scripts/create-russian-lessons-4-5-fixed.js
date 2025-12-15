/**
 * Create Russian lessons 4 and 5 - FIXED VERSION
 * Using ONLY block types that are supported by Lesson.jsx component
 */

require('dotenv').config({ path: '.env.production' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
	process.env.SUPABASE_COURSES_URL,
	process.env.SUPABASE_COURSES_SERVICE_KEY
)

const lessons = [
	// ============================================================================
	// LESSON 4: Numbers 0-20 and Age
	// ============================================================================
	{
		slug: 'numbers-0-20-age',
		target_language: 'ru',
		level: 'A1',
		order: 4,
		difficulty: 'beginner',
		estimated_read_time: 25,
		status: 'published',
		keywords: ['numbers', 'age', 'counting', 'цифры', 'возраст'],

		title_fr: 'Les nombres (0-20) et l\'âge',
		title_en: 'Numbers (0-20) and Age',
		title_ru: 'Числа (0-20) и возраст',

		// French explanations
		blocks_fr: [
			{
				type: 'mainTitle',
				text: 'Les nombres de 0 à 20'
			},
			{
				type: 'subtitle',
				text: 'Apprendre à compter et à dire son âge en russe'
			},
			{
				type: 'quickSummary',
				title: 'Points clés',
				keyForms: [
					{ form: '0-10', translation: 'ноль, один, два, три, четыре, пять...' },
					{ form: '11-19', translation: 'Formation avec -надцать' },
					{ form: 'Âge', translation: 'Мне ... лет (J\'ai ... ans)' },
					{ form: 'Question', translation: 'Сколько тебе/вам лет?' }
				]
			},
			{
				type: 'title',
				text: 'Les nombres de 0 à 10'
			},
			{
				type: 'paragraph',
				text: 'Les nombres en russe sont essentiels pour la vie quotidienne. Commençons par les nombres de base de 0 à 10.'
			},
			{
				type: 'conjugationTable',
				title: 'Nombres 0-10',
				rows: [
					{ pronoun: '0', form: 'ноль', translation: 'zéro', pronunciation: '[nol\']' },
					{ pronoun: '1', form: 'один', translation: 'un', pronunciation: '[adin]', mnemonic: 'Один change selon le genre : один (m), одна (f), одно (n)' },
					{ pronoun: '2', form: 'два', translation: 'deux', pronunciation: '[dva]' },
					{ pronoun: '3', form: 'три', translation: 'trois', pronunciation: '[tri]' },
					{ pronoun: '4', form: 'четыре', translation: 'quatre', pronunciation: '[tchityré]' },
					{ pronoun: '5', form: 'пять', translation: 'cinq', pronunciation: '[piat\']' },
					{ pronoun: '6', form: 'шесть', translation: 'six', pronunciation: '[chèst\']' },
					{ pronoun: '7', form: 'семь', translation: 'sept', pronunciation: '[sièm\']' },
					{ pronoun: '8', form: 'восемь', translation: 'huit', pronunciation: '[vossièm\']' },
					{ pronoun: '9', form: 'девять', translation: 'neuf', pronunciation: '[dièviat\']' },
					{ pronoun: '10', form: 'десять', translation: 'dix', pronunciation: '[dièciat\']' }
				]
			},
			{
				type: 'title',
				text: 'Les nombres de 11 à 20'
			},
			{
				type: 'paragraph',
				text: 'Les nombres de 11 à 19 se forment en ajoutant le suffixe <strong>-надцать</strong> au nombre de base.'
			},
			{
				type: 'conjugationTable',
				title: 'Nombres 11-20',
				rows: [
					{ pronoun: '11', form: 'одиннадцать', translation: 'onze', pronunciation: '[adinnatsat\']' },
					{ pronoun: '12', form: 'двенадцать', translation: 'douze', pronunciation: '[dvènatsat\']' },
					{ pronoun: '13', form: 'тринадцать', translation: 'treize', pronunciation: '[trinatsat\']' },
					{ pronoun: '14', form: 'четырнадцать', translation: 'quatorze', pronunciation: '[tchityrnatsat\']' },
					{ pronoun: '15', form: 'пятнадцать', translation: 'quinze', pronunciation: '[piatnatsat\']' },
					{ pronoun: '16', form: 'шестнадцать', translation: 'seize', pronunciation: '[chèstnatsat\']' },
					{ pronoun: '17', form: 'семнадцать', translation: 'dix-sept', pronunciation: '[siemnatsat\']' },
					{ pronoun: '18', form: 'восемнадцать', translation: 'dix-huit', pronunciation: '[vossiemnatsat\']' },
					{ pronoun: '19', form: 'девятнадцать', translation: 'dix-neuf', pronunciation: '[diviatnatsat\']' },
					{ pronoun: '20', form: 'двадцать', translation: 'vingt', pronunciation: '[dvatsat\']' }
				]
			},
			{
				type: 'title',
				text: 'Demander et donner son âge'
			},
			{
				type: 'paragraph',
				text: 'Pour demander l\'âge en russe, on utilise la structure <strong>Сколько тебе/вам лет?</strong> (Quel âge as-tu/avez-vous ?). Pour répondre, on utilise <strong>Мне ... лет</strong> (J\'ai ... ans).'
			},
			{
				type: 'usageList',
				title: 'Expressions pour parler de l\'âge',
				items: [
					{
						usage: 'Demander l\'âge (informel)',
						examples: [
							'Сколько тебе лет? - Quel âge as-tu ?',
							'Тебе восемнадцать? - Tu as dix-huit ans ?'
						]
					},
					{
						usage: 'Demander l\'âge (formel)',
						examples: [
							'Сколько вам лет? - Quel âge avez-vous ?',
							'Вам двадцать? - Vous avez vingt ans ?'
						]
					},
					{
						usage: 'Donner son âge',
						examples: [
							'Мне пятнадцать лет - J\'ai quinze ans',
							'Ему/Ей десять лет - Il/Elle a dix ans',
							'Нам двадцать лет - Nous avons vingt ans'
						]
					}
				]
			},
			{
				type: 'miniDialogue',
				title: 'Conversation : Demander l\'âge',
				lines: [
					{ speaker: 'Анна', text: 'Сколько тебе лет?' },
					{ speaker: 'Иван', text: 'Мне двадцать лет. А тебе?' },
					{ speaker: 'Анна', text: 'Мне восемнадцать.' }
				],
				translation: 'Anna : Quel âge as-tu ? - Ivan : J\'ai vingt ans. Et toi ? - Anna : J\'ai dix-huit ans.'
			},
			{
				type: 'mistakesTable',
				title: 'Erreurs courantes',
				rows: [
					{
						wrong: 'Я восемнадцать лет',
						correct: 'Мне восемнадцать лет',
						explanation: 'On utilise le datif "мне" (à moi) et non le nominatif "я" (je)'
					},
					{
						wrong: 'Сколько ты лет?',
						correct: 'Сколько тебе лет?',
						explanation: 'Il faut utiliser le datif "тебе" dans cette construction'
					}
				]
			},
			{
				type: 'list',
				items: [
					'<strong>лет</strong> s\'utilise après 5 et plus (пять лет, десять лет)',
					'<strong>года</strong> s\'utilise après 2, 3, 4 (два года, три года)',
					'<strong>год</strong> s\'utilise après 1 (один год, двадцать один год)'
				]
			},
			{
				type: 'relatedTopics',
				topics: []
			}
		],

		// English explanations
		blocks_en: [
			{
				type: 'mainTitle',
				text: 'Numbers from 0 to 20'
			},
			{
				type: 'subtitle',
				text: 'Learning to count and state your age in Russian'
			},
			{
				type: 'quickSummary',
				title: 'Key Points',
				keyForms: [
					{ form: '0-10', translation: 'ноль, один, два, три, четыре, пять...' },
					{ form: '11-19', translation: 'Formation with -надцать' },
					{ form: 'Age', translation: 'Мне ... лет (I am ... years old)' },
					{ form: 'Question', translation: 'Сколько тебе/вам лет?' }
				]
			},
			{
				type: 'title',
				text: 'Numbers 0 to 10'
			},
			{
				type: 'paragraph',
				text: 'Numbers in Russian are essential for daily life. Let\'s start with the basic numbers from 0 to 10.'
			},
			{
				type: 'conjugationTable',
				title: 'Numbers 0-10',
				rows: [
					{ pronoun: '0', form: 'ноль', translation: 'zero', pronunciation: '[nol\']' },
					{ pronoun: '1', form: 'один', translation: 'one', pronunciation: '[adin]', mnemonic: 'Один changes by gender: один (m), одна (f), одно (n)' },
					{ pronoun: '2', form: 'два', translation: 'two', pronunciation: '[dva]' },
					{ pronoun: '3', form: 'три', translation: 'three', pronunciation: '[tri]' },
					{ pronoun: '4', form: 'четыре', translation: 'four', pronunciation: '[tchityré]' },
					{ pronoun: '5', form: 'пять', translation: 'five', pronunciation: '[piat\']' },
					{ pronoun: '6', form: 'шесть', translation: 'six', pronunciation: '[chèst\']' },
					{ pronoun: '7', form: 'семь', translation: 'seven', pronunciation: '[sièm\']' },
					{ pronoun: '8', form: 'восемь', translation: 'eight', pronunciation: '[vossièm\']' },
					{ pronoun: '9', form: 'девять', translation: 'nine', pronunciation: '[dièviat\']' },
					{ pronoun: '10', form: 'десять', translation: 'ten', pronunciation: '[dièciat\']' }
				]
			},
			{
				type: 'title',
				text: 'Numbers 11 to 20'
			},
			{
				type: 'paragraph',
				text: 'Numbers from 11 to 19 are formed by adding the suffix <strong>-надцать</strong> to the base number.'
			},
			{
				type: 'conjugationTable',
				title: 'Numbers 11-20',
				rows: [
					{ pronoun: '11', form: 'одиннадцать', translation: 'eleven', pronunciation: '[adinnatsat\']' },
					{ pronoun: '12', form: 'двенадцать', translation: 'twelve', pronunciation: '[dvènatsat\']' },
					{ pronoun: '13', form: 'тринадцать', translation: 'thirteen', pronunciation: '[trinatsat\']' },
					{ pronoun: '14', form: 'четырнадцать', translation: 'fourteen', pronunciation: '[tchityrnatsat\']' },
					{ pronoun: '15', form: 'пятнадцать', translation: 'fifteen', pronunciation: '[piatnatsat\']' },
					{ pronoun: '16', form: 'шестнадцать', translation: 'sixteen', pronunciation: '[chèstnatsat\']' },
					{ pronoun: '17', form: 'семнадцать', translation: 'seventeen', pronunciation: '[siemnatsat\']' },
					{ pronoun: '18', form: 'восемнадцать', translation: 'eighteen', pronunciation: '[vossiemnatsat\']' },
					{ pronoun: '19', form: 'девятнадцать', translation: 'nineteen', pronunciation: '[diviatnatsat\']' },
					{ pronoun: '20', form: 'двадцать', translation: 'twenty', pronunciation: '[dvatsat\']' }
				]
			},
			{
				type: 'title',
				text: 'Asking and giving your age'
			},
			{
				type: 'paragraph',
				text: 'To ask about age in Russian, use the structure <strong>Сколько тебе/вам лет?</strong> (How old are you?). To answer, use <strong>Мне ... лет</strong> (I am ... years old).'
			},
			{
				type: 'usageList',
				title: 'Expressions for talking about age',
				items: [
					{
						usage: 'Asking age (informal)',
						examples: [
							'Сколько тебе лет? - How old are you?',
							'Тебе восемнадцать? - Are you eighteen?'
						]
					},
					{
						usage: 'Asking age (formal)',
						examples: [
							'Сколько вам лет? - How old are you?',
							'Вам двадцать? - Are you twenty?'
						]
					},
					{
						usage: 'Giving your age',
						examples: [
							'Мне пятнадцать лет - I am fifteen years old',
							'Ему/Ей десять лет - He/She is ten years old',
							'Нам двадцать лет - We are twenty years old'
						]
					}
				]
			},
			{
				type: 'miniDialogue',
				title: 'Conversation: Asking age',
				lines: [
					{ speaker: 'Анна', text: 'Сколько тебе лет?' },
					{ speaker: 'Иван', text: 'Мне двадцать лет. А тебе?' },
					{ speaker: 'Анна', text: 'Мне восемнадцать.' }
				],
				translation: 'Anna: How old are you? - Ivan: I am twenty years old. And you? - Anna: I am eighteen.'
			},
			{
				type: 'mistakesTable',
				title: 'Common mistakes',
				rows: [
					{
						wrong: 'Я восемнадцать лет',
						correct: 'Мне восемнадцать лет',
						explanation: 'Use the dative "мне" (to me) not the nominative "я" (I)'
					},
					{
						wrong: 'Сколько ты лет?',
						correct: 'Сколько тебе лет?',
						explanation: 'You must use the dative "тебе" in this construction'
					}
				]
			},
			{
				type: 'list',
				items: [
					'<strong>лет</strong> is used after 5 and more (пять лет, десять лет)',
					'<strong>года</strong> is used after 2, 3, 4 (два года, три года)',
					'<strong>год</strong> is used after 1 (один год, двадцать один год)'
				]
			},
			{
				type: 'relatedTopics',
				topics: []
			}
		],

		// Russian explanations
		blocks_ru: [
			{
				type: 'mainTitle',
				text: 'Числа от 0 до 20'
			},
			{
				type: 'subtitle',
				text: 'Учимся считать и говорить свой возраст по-русски'
			},
			{
				type: 'quickSummary',
				title: 'Ключевые моменты',
				keyForms: [
					{ form: '0-10', translation: 'ноль, один, два, три, четыре, пять...' },
					{ form: '11-19', translation: 'Образование с -надцать' },
					{ form: 'Возраст', translation: 'Мне ... лет' },
					{ form: 'Вопрос', translation: 'Сколько тебе/вам лет?' }
				]
			},
			{
				type: 'title',
				text: 'Числа от 0 до 10'
			},
			{
				type: 'paragraph',
				text: 'Числа в русском языке необходимы для повседневной жизни. Начнем с базовых чисел от 0 до 10.'
			},
			{
				type: 'conjugationTable',
				title: 'Числа 0-10',
				rows: [
					{ pronoun: '0', form: 'ноль', translation: 'ноль', pronunciation: '[nol\']' },
					{ pronoun: '1', form: 'один', translation: 'один', pronunciation: '[adin]', mnemonic: 'Один изменяется по роду: один (м), одна (ж), одно (ср)' },
					{ pronoun: '2', form: 'два', translation: 'два', pronunciation: '[dva]' },
					{ pronoun: '3', form: 'три', translation: 'три', pronunciation: '[tri]' },
					{ pronoun: '4', form: 'четыре', translation: 'четыре', pronunciation: '[tchityré]' },
					{ pronoun: '5', form: 'пять', translation: 'пять', pronunciation: '[piat\']' },
					{ pronoun: '6', form: 'шесть', translation: 'шесть', pronunciation: '[chèst\']' },
					{ pronoun: '7', form: 'семь', translation: 'семь', pronunciation: '[sièm\']' },
					{ pronoun: '8', form: 'восемь', translation: 'восемь', pronunciation: '[vossièm\']' },
					{ pronoun: '9', form: 'девять', translation: 'девять', pronunciation: '[dièviat\']' },
					{ pronoun: '10', form: 'десять', translation: 'десять', pronunciation: '[dièciat\']' }
				]
			},
			{
				type: 'title',
				text: 'Числа от 11 до 20'
			},
			{
				type: 'paragraph',
				text: 'Числа от 11 до 19 образуются добавлением суффикса <strong>-надцать</strong> к базовому числу.'
			},
			{
				type: 'conjugationTable',
				title: 'Числа 11-20',
				rows: [
					{ pronoun: '11', form: 'одиннадцать', translation: 'одиннадцать', pronunciation: '[adinnatsat\']' },
					{ pronoun: '12', form: 'двенадцать', translation: 'двенадцать', pronunciation: '[dvènatsat\']' },
					{ pronoun: '13', form: 'тринадцать', translation: 'тринадцать', pronunciation: '[trinatsat\']' },
					{ pronoun: '14', form: 'четырнадцать', translation: 'четырнадцать', pronunciation: '[tchityrnatsat\']' },
					{ pronoun: '15', form: 'пятнадцать', translation: 'пятнадцать', pronunciation: '[piatnatsat\']' },
					{ pronoun: '16', form: 'шестнадцать', translation: 'шестнадцать', pronunciation: '[chèstnatsat\']' },
					{ pronoun: '17', form: 'семнадцать', translation: 'семнадцать', pronunciation: '[siemnatsat\']' },
					{ pronoun: '18', form: 'восемнадцать', translation: 'восемнадцать', pronunciation: '[vossiemnatsat\']' },
					{ pronoun: '19', form: 'девятнадцать', translation: 'девятнадцать', pronunciation: '[diviatnatsat\']' },
					{ pronoun: '20', form: 'двадцать', translation: 'двадцать', pronunciation: '[dvatsat\']' }
				]
			},
			{
				type: 'title',
				text: 'Спрашивать и говорить свой возраст'
			},
			{
				type: 'paragraph',
				text: 'Чтобы спросить о возрасте по-русски, используется структура <strong>Сколько тебе/вам лет?</strong>. Чтобы ответить, используется <strong>Мне ... лет</strong>.'
			},
			{
				type: 'usageList',
				title: 'Выражения для разговора о возрасте',
				items: [
					{
						usage: 'Спросить возраст (неформально)',
						examples: [
							'Сколько тебе лет?',
							'Тебе восемнадцать?'
						]
					},
					{
						usage: 'Спросить возраст (формально)',
						examples: [
							'Сколько вам лет?',
							'Вам двадцать?'
						]
					},
					{
						usage: 'Сказать свой возраст',
						examples: [
							'Мне пятнадцать лет',
							'Ему/Ей десять лет',
							'Нам двадцать лет'
						]
					}
				]
			},
			{
				type: 'miniDialogue',
				title: 'Разговор: Спрашивать возраст',
				lines: [
					{ speaker: 'Анна', text: 'Сколько тебе лет?' },
					{ speaker: 'Иван', text: 'Мне двадцать лет. А тебе?' },
					{ speaker: 'Анна', text: 'Мне восемнадцать.' }
				],
				translation: 'Анна: Сколько тебе лет? - Иван: Мне двадцать лет. А тебе? - Анна: Мне восемнадцать.'
			},
			{
				type: 'mistakesTable',
				title: 'Частые ошибки',
				rows: [
					{
						wrong: 'Я восемнадцать лет',
						correct: 'Мне восемнадцать лет',
						explanation: 'Используется дательный падеж "мне" (мне), а не именительный "я"'
					},
					{
						wrong: 'Сколько ты лет?',
						correct: 'Сколько тебе лет?',
						explanation: 'Нужно использовать дательный падеж "тебе" в этой конструкции'
					}
				]
			},
			{
				type: 'list',
				items: [
					'<strong>лет</strong> используется после 5 и более (пять лет, десять лет)',
					'<strong>года</strong> используется после 2, 3, 4 (два года, три года)',
					'<strong>год</strong> используется после 1 (один год, двадцать один год)'
				]
			},
			{
				type: 'relatedTopics',
				topics: []
			}
		]
	},

	// ============================================================================
	// LESSON 5: Family and Possessive Pronouns
	// ============================================================================
	{
		slug: 'family-possessive-pronouns',
		target_language: 'ru',
		level: 'A1',
		order: 5,
		difficulty: 'beginner',
		estimated_read_time: 30,
		status: 'published',
		keywords: ['family', 'possessive', 'pronouns', 'семья', 'притяжательные местоимения'],

		title_fr: 'La famille et les pronoms possessifs',
		title_en: 'Family and Possessive Pronouns',
		title_ru: 'Семья и притяжательные местоимения',

		// French explanations
		blocks_fr: [
			{
				type: 'mainTitle',
				text: 'La famille et les pronoms possessifs'
			},
			{
				type: 'subtitle',
				text: 'Vocabulaire de la famille et utilisation des possessifs'
			},
			{
				type: 'quickSummary',
				title: 'Points clés',
				keyForms: [
					{ form: 'мой/моя/моё', translation: 'mon/ma (masculin/féminin/neutre)' },
					{ form: 'твой/твоя/твоё', translation: 'ton/ta (masculin/féminin/neutre)' },
					{ form: 'его/её/их', translation: 'son, sa (invariables)' },
					{ form: 'У меня есть...', translation: 'J\'ai... (construction de possession)' }
				]
			},
			{
				type: 'title',
				text: 'Les membres de la famille'
			},
			{
				type: 'paragraph',
				text: 'La famille (семья) est un thème essentiel pour parler de soi. Voici le vocabulaire de base pour désigner les membres de la famille.'
			},
			{
				type: 'conjugationTable',
				title: 'Famille proche',
				rows: [
					{ pronoun: 'семья', form: '[simia]', translation: 'famille' },
					{ pronoun: 'мама', form: '[mama]', translation: 'maman' },
					{ pronoun: 'папа', form: '[papa]', translation: 'papa' },
					{ pronoun: 'родители', form: '[raditièli]', translation: 'parents' },
					{ pronoun: 'брат', form: '[brat]', translation: 'frère' },
					{ pronoun: 'сестра', form: '[siestra]', translation: 'sœur' },
					{ pronoun: 'сын', form: '[syn]', translation: 'fils' },
					{ pronoun: 'дочь', form: '[dotch\']', translation: 'fille' },
					{ pronoun: 'муж', form: '[mouj]', translation: 'mari' },
					{ pronoun: 'жена', form: '[jèna]', translation: 'épouse' }
				]
			},
			{
				type: 'conjugationTable',
				title: 'Famille élargie',
				rows: [
					{ pronoun: 'дедушка', form: '[dièdouchka]', translation: 'grand-père', mnemonic: 'Diminutif affectueux avec -ушка' },
					{ pronoun: 'бабушка', form: '[babouchka]', translation: 'grand-mère', mnemonic: 'Diminutif affectueux avec -ушка' },
					{ pronoun: 'дядя', form: '[diadia]', translation: 'oncle' },
					{ pronoun: 'тётя', form: '[tiotia]', translation: 'tante' },
					{ pronoun: 'племянник', form: '[plièmiannik]', translation: 'neveu' },
					{ pronoun: 'племянница', form: '[plièmiannitsa]', translation: 'nièce' }
				]
			},
			{
				type: 'title',
				text: 'Les pronoms possessifs'
			},
			{
				type: 'paragraph',
				text: 'Les pronoms possessifs en russe s\'accordent en <strong>genre et en nombre avec l\'objet possédé</strong>, pas avec le possesseur (contrairement au français).'
			},
			{
				type: 'conjugationTable',
				title: 'Pronoms possessifs - Formes variables',
				rows: [
					{ pronoun: 'мой (m)', form: 'моя (f) / моё (n)', translation: 'mon / ma', pronunciation: 'Ex: мой брат, моя сестра' },
					{ pronoun: 'твой (m)', form: 'твоя (f) / твоё (n)', translation: 'ton / ta', pronunciation: 'Ex: твой папа, твоя мама' },
					{ pronoun: 'наш (m)', form: 'наша (f) / наше (n)', translation: 'notre', pronunciation: 'Ex: наш дом, наша семья' },
					{ pronoun: 'ваш (m)', form: 'ваша (f) / ваше (n)', translation: 'votre', pronunciation: 'Ex: ваш сын, ваша дочь' }
				]
			},
			{
				type: 'conjugationTable',
				title: 'Pronoms possessifs - Formes invariables',
				rows: [
					{ pronoun: 'его', form: 'его', translation: 'son/sa (à lui)', pronunciation: 'Ex: его мама (sa mère à lui)', mnemonic: 'NE CHANGE JAMAIS' },
					{ pronoun: 'её', form: 'её', translation: 'son/sa (à elle)', pronunciation: 'Ex: её папа (son père à elle)', mnemonic: 'NE CHANGE JAMAIS' },
					{ pronoun: 'их', form: 'их', translation: 'leur', pronunciation: 'Ex: их дети (leurs enfants)', mnemonic: 'NE CHANGE JAMAIS' }
				]
			},
			{
				type: 'title',
				text: 'La construction "У меня есть..."'
			},
			{
				type: 'paragraph',
				text: 'Pour exprimer la possession en russe, on utilise la construction <strong>У + personne (datif) + есть + objet (nominatif)</strong>. Littéralement : "Chez moi il y a..."'
			},
			{
				type: 'usageList',
				title: 'Parler de sa famille avec "У меня есть..."',
				items: [
					{
						usage: 'Parler de ses frères et sœurs',
						examples: [
							'У меня есть брат - J\'ai un frère',
							'У меня есть старшая сестра - J\'ai une grande sœur',
							'У тебя есть брат или сестра? - As-tu un frère ou une sœur?'
						]
					},
					{
						usage: 'Parler de ses parents',
						examples: [
							'У меня есть мама и папа - J\'ai une maman et un papa',
							'У него есть родители - Il a des parents',
							'У неё нет брата - Elle n\'a pas de frère'
						]
					},
					{
						usage: 'Parler des autres membres',
						examples: [
							'У нас большая семья - Nous avons une grande famille',
							'У вас есть дети? - Avez-vous des enfants?',
							'У них есть бабушка - Ils ont une grand-mère'
						]
					}
				]
			},
			{
				type: 'miniDialogue',
				title: 'Conversation : Parler de sa famille',
				lines: [
					{ speaker: 'Мария', text: 'У тебя есть брат или сестра?' },
					{ speaker: 'Павел', text: 'Да, у меня есть младший брат и старшая сестра.' },
					{ speaker: 'Мария', text: 'А как зовут твоего брата?' },
					{ speaker: 'Павел', text: 'Моего брата зовут Алексей. Ему пятнадцать лет.' }
				],
				translation: 'Maria : As-tu un frère ou une sœur ? - Pavel : Oui, j\'ai un petit frère et une grande sœur. - Maria : Et comment s\'appelle ton frère ? - Pavel : Mon frère s\'appelle Alexeï. Il a quinze ans.'
			},
			{
				type: 'mistakesTable',
				title: 'Erreurs courantes avec les possessifs',
				rows: [
					{
						wrong: 'его семья (à propos d\'une femme)',
						correct: 'её семья',
						explanation: 'Utilisez её pour "sa" (à elle) et его pour "son" (à lui)'
					},
					{
						wrong: 'моё брат',
						correct: 'мой брат',
						explanation: 'Le possessif s\'accorde avec le genre du nom possédé (брат est masculin)'
					},
					{
						wrong: 'Я есть брат',
						correct: 'У меня есть брат',
						explanation: 'En russe, on dit "Chez moi il y a un frère" et non "Je suis un frère"'
					}
				]
			},
			{
				type: 'list',
				items: [
					'<strong>младший</strong> = plus jeune, cadet',
					'<strong>старший</strong> = plus âgé, aîné',
					'<strong>единственный ребёнок</strong> = enfant unique',
					'<strong>близнецы</strong> = jumeaux'
				]
			},
			{
				type: 'relatedTopics',
				topics: []
			}
		],

		// English explanations
		blocks_en: [
			{
				type: 'mainTitle',
				text: 'Family and Possessive Pronouns'
			},
			{
				type: 'subtitle',
				text: 'Family vocabulary and use of possessives'
			},
			{
				type: 'quickSummary',
				title: 'Key Points',
				keyForms: [
					{ form: 'мой/моя/моё', translation: 'my (masculine/feminine/neuter)' },
					{ form: 'твой/твоя/твоё', translation: 'your (masculine/feminine/neuter)' },
					{ form: 'его/её/их', translation: 'his/her/their (invariable)' },
					{ form: 'У меня есть...', translation: 'I have... (possession construction)' }
				]
			},
			{
				type: 'title',
				text: 'Family members'
			},
			{
				type: 'paragraph',
				text: 'Family (семья) is an essential topic for talking about yourself. Here is the basic vocabulary to refer to family members.'
			},
			{
				type: 'conjugationTable',
				title: 'Immediate family',
				rows: [
					{ pronoun: 'семья', form: '[simia]', translation: 'family' },
					{ pronoun: 'мама', form: '[mama]', translation: 'mom' },
					{ pronoun: 'папа', form: '[papa]', translation: 'dad' },
					{ pronoun: 'родители', form: '[raditièli]', translation: 'parents' },
					{ pronoun: 'брат', form: '[brat]', translation: 'brother' },
					{ pronoun: 'сестра', form: '[siestra]', translation: 'sister' },
					{ pronoun: 'сын', form: '[syn]', translation: 'son' },
					{ pronoun: 'дочь', form: '[dotch\']', translation: 'daughter' },
					{ pronoun: 'муж', form: '[mouj]', translation: 'husband' },
					{ pronoun: 'жена', form: '[jèna]', translation: 'wife' }
				]
			},
			{
				type: 'conjugationTable',
				title: 'Extended family',
				rows: [
					{ pronoun: 'дедушка', form: '[dièdouchka]', translation: 'grandfather', mnemonic: 'Affectionate diminutive with -ушка' },
					{ pronoun: 'бабушка', form: '[babouchka]', translation: 'grandmother', mnemonic: 'Affectionate diminutive with -ушка' },
					{ pronoun: 'дядя', form: '[diadia]', translation: 'uncle' },
					{ pronoun: 'тётя', form: '[tiotia]', translation: 'aunt' },
					{ pronoun: 'племянник', form: '[plièmiannik]', translation: 'nephew' },
					{ pronoun: 'племянница', form: '[plièmiannitsa]', translation: 'niece' }
				]
			},
			{
				type: 'title',
				text: 'Possessive pronouns'
			},
			{
				type: 'paragraph',
				text: 'Possessive pronouns in Russian agree in <strong>gender and number with the possessed object</strong>, not with the possessor (unlike English).'
			},
			{
				type: 'conjugationTable',
				title: 'Possessive pronouns - Variable forms',
				rows: [
					{ pronoun: 'мой (m)', form: 'моя (f) / моё (n)', translation: 'my', pronunciation: 'Ex: мой брат, моя сестра' },
					{ pronoun: 'твой (m)', form: 'твоя (f) / твоё (n)', translation: 'your', pronunciation: 'Ex: твой папа, твоя мама' },
					{ pronoun: 'наш (m)', form: 'наша (f) / наше (n)', translation: 'our', pronunciation: 'Ex: наш дом, наша семья' },
					{ pronoun: 'ваш (m)', form: 'ваша (f) / ваше (n)', translation: 'your', pronunciation: 'Ex: ваш сын, ваша дочь' }
				]
			},
			{
				type: 'conjugationTable',
				title: 'Possessive pronouns - Invariable forms',
				rows: [
					{ pronoun: 'его', form: 'его', translation: 'his', pronunciation: 'Ex: его мама (his mother)', mnemonic: 'NEVER CHANGES' },
					{ pronoun: 'её', form: 'её', translation: 'her', pronunciation: 'Ex: её папа (her father)', mnemonic: 'NEVER CHANGES' },
					{ pronoun: 'их', form: 'их', translation: 'their', pronunciation: 'Ex: их дети (their children)', mnemonic: 'NEVER CHANGES' }
				]
			},
			{
				type: 'title',
				text: 'The construction "У меня есть..."'
			},
			{
				type: 'paragraph',
				text: 'To express possession in Russian, we use the construction <strong>У + person (dative) + есть + object (nominative)</strong>. Literally: "At me there is..."'
			},
			{
				type: 'usageList',
				title: 'Talking about family with "У меня есть..."',
				items: [
					{
						usage: 'Talking about siblings',
						examples: [
							'У меня есть брат - I have a brother',
							'У меня есть старшая сестра - I have an older sister',
							'У тебя есть брат или сестра? - Do you have a brother or sister?'
						]
					},
					{
						usage: 'Talking about parents',
						examples: [
							'У меня есть мама и папа - I have a mom and dad',
							'У него есть родители - He has parents',
							'У неё нет брата - She doesn\'t have a brother'
						]
					},
					{
						usage: 'Talking about other members',
						examples: [
							'У нас большая семья - We have a big family',
							'У вас есть дети? - Do you have children?',
							'У них есть бабушка - They have a grandmother'
						]
					}
				]
			},
			{
				type: 'miniDialogue',
				title: 'Conversation: Talking about family',
				lines: [
					{ speaker: 'Мария', text: 'У тебя есть брат или сестра?' },
					{ speaker: 'Павел', text: 'Да, у меня есть младший брат и старшая сестра.' },
					{ speaker: 'Мария', text: 'А как зовут твоего брата?' },
					{ speaker: 'Павел', text: 'Моего брата зовут Алексей. Ему пятнадцать лет.' }
				],
				translation: 'Maria: Do you have a brother or sister? - Pavel: Yes, I have a younger brother and an older sister. - Maria: And what\'s your brother\'s name? - Pavel: My brother\'s name is Alexei. He is fifteen years old.'
			},
			{
				type: 'mistakesTable',
				title: 'Common mistakes with possessives',
				rows: [
					{
						wrong: 'его семья (about a woman)',
						correct: 'её семья',
						explanation: 'Use её for "her" and его for "his"'
					},
					{
						wrong: 'моё брат',
						correct: 'мой брат',
						explanation: 'The possessive agrees with the gender of the possessed noun (брат is masculine)'
					},
					{
						wrong: 'Я есть брат',
						correct: 'У меня есть брат',
						explanation: 'In Russian, you say "At me there is a brother" not "I am a brother"'
					}
				]
			},
			{
				type: 'list',
				items: [
					'<strong>младший</strong> = younger',
					'<strong>старший</strong> = older, elder',
					'<strong>единственный ребёнок</strong> = only child',
					'<strong>близнецы</strong> = twins'
				]
			},
			{
				type: 'relatedTopics',
				topics: []
			}
		],

		// Russian explanations
		blocks_ru: [
			{
				type: 'mainTitle',
				text: 'Семья и притяжательные местоимения'
			},
			{
				type: 'subtitle',
				text: 'Семейная лексика и использование притяжательных местоимений'
			},
			{
				type: 'quickSummary',
				title: 'Ключевые моменты',
				keyForms: [
					{ form: 'мой/моя/моё', translation: 'мой/моя (мужской/женский/средний)' },
					{ form: 'твой/твоя/твоё', translation: 'твой/твоя (мужской/женский/средний)' },
					{ form: 'его/её/их', translation: 'его/её/их (неизменяемые)' },
					{ form: 'У меня есть...', translation: 'У меня есть... (конструкция обладания)' }
				]
			},
			{
				type: 'title',
				text: 'Члены семьи'
			},
			{
				type: 'paragraph',
				text: 'Семья - это важная тема для разговора о себе. Вот основная лексика для обозначения членов семьи.'
			},
			{
				type: 'conjugationTable',
				title: 'Ближайшая семья',
				rows: [
					{ pronoun: 'семья', form: '[simia]', translation: 'семья' },
					{ pronoun: 'мама', form: '[mama]', translation: 'мама' },
					{ pronoun: 'папа', form: '[papa]', translation: 'папа' },
					{ pronoun: 'родители', form: '[raditièli]', translation: 'родители' },
					{ pronoun: 'брат', form: '[brat]', translation: 'брат' },
					{ pronoun: 'сестра', form: '[siestra]', translation: 'сестра' },
					{ pronoun: 'сын', form: '[syn]', translation: 'сын' },
					{ pronoun: 'дочь', form: '[dotch\']', translation: 'дочь' },
					{ pronoun: 'муж', form: '[mouj]', translation: 'муж' },
					{ pronoun: 'жена', form: '[jèna]', translation: 'жена' }
				]
			},
			{
				type: 'conjugationTable',
				title: 'Расширенная семья',
				rows: [
					{ pronoun: 'дедушка', form: '[dièdouchka]', translation: 'дедушка', mnemonic: 'Ласкательная форма с -ушка' },
					{ pronoun: 'бабушка', form: '[babouchka]', translation: 'бабушка', mnemonic: 'Ласкательная форма с -ушка' },
					{ pronoun: 'дядя', form: '[diadia]', translation: 'дядя' },
					{ pronoun: 'тётя', form: '[tiotia]', translation: 'тётя' },
					{ pronoun: 'племянник', form: '[plièmiannik]', translation: 'племянник' },
					{ pronoun: 'племянница', form: '[plièmiannitsa]', translation: 'племянница' }
				]
			},
			{
				type: 'title',
				text: 'Притяжательные местоимения'
			},
			{
				type: 'paragraph',
				text: 'Притяжательные местоимения в русском языке согласуются <strong>по роду и числу с объектом обладания</strong>, а не с обладателем.'
			},
			{
				type: 'conjugationTable',
				title: 'Притяжательные местоимения - Изменяемые формы',
				rows: [
					{ pronoun: 'мой (м)', form: 'моя (ж) / моё (ср)', translation: 'мой/моя', pronunciation: 'Пр: мой брат, моя сестра' },
					{ pronoun: 'твой (м)', form: 'твоя (ж) / твоё (ср)', translation: 'твой/твоя', pronunciation: 'Пр: твой папа, твоя мама' },
					{ pronoun: 'наш (м)', form: 'наша (ж) / наше (ср)', translation: 'наш/наша', pronunciation: 'Пр: наш дом, наша семья' },
					{ pronoun: 'ваш (м)', form: 'ваша (ж) / ваше (ср)', translation: 'ваш/ваша', pronunciation: 'Пр: ваш сын, ваша дочь' }
				]
			},
			{
				type: 'conjugationTable',
				title: 'Притяжательные местоимения - Неизменяемые формы',
				rows: [
					{ pronoun: 'его', form: 'его', translation: 'его', pronunciation: 'Пр: его мама', mnemonic: 'НИКОГДА НЕ ИЗМЕНЯЕТСЯ' },
					{ pronoun: 'её', form: 'её', translation: 'её', pronunciation: 'Пр: её папа', mnemonic: 'НИКОГДА НЕ ИЗМЕНЯЕТСЯ' },
					{ pronoun: 'их', form: 'их', translation: 'их', pronunciation: 'Пр: их дети', mnemonic: 'НИКОГДА НЕ ИЗМЕНЯЕТСЯ' }
				]
			},
			{
				type: 'title',
				text: 'Конструкция "У меня есть..."'
			},
			{
				type: 'paragraph',
				text: 'Для выражения обладания в русском языке используется конструкция <strong>У + лицо (дательный падеж) + есть + объект (именительный падеж)</strong>.'
			},
			{
				type: 'usageList',
				title: 'Разговор о семье с "У меня есть..."',
				items: [
					{
						usage: 'Говорить о братьях и сестрах',
						examples: [
							'У меня есть брат',
							'У меня есть старшая сестра',
							'У тебя есть брат или сестра?'
						]
					},
					{
						usage: 'Говорить о родителях',
						examples: [
							'У меня есть мама и папа',
							'У него есть родители',
							'У неё нет брата'
						]
					},
					{
						usage: 'Говорить о других членах',
						examples: [
							'У нас большая семья',
							'У вас есть дети?',
							'У них есть бабушка'
						]
					}
				]
			},
			{
				type: 'miniDialogue',
				title: 'Разговор: Говорить о семье',
				lines: [
					{ speaker: 'Мария', text: 'У тебя есть брат или сестра?' },
					{ speaker: 'Павел', text: 'Да, у меня есть младший брат и старшая сестра.' },
					{ speaker: 'Мария', text: 'А как зовут твоего брата?' },
					{ speaker: 'Павел', text: 'Моего брата зовут Алексей. Ему пятнадцать лет.' }
				],
				translation: 'Мария: У тебя есть брат или сестра? - Павел: Да, у меня есть младший брат и старшая сестра. - Мария: А как зовут твоего брата? - Павел: Моего брата зовут Алексей. Ему пятнадцать лет.'
			},
			{
				type: 'mistakesTable',
				title: 'Частые ошибки с притяжательными местоимениями',
				rows: [
					{
						wrong: 'его семья (о женщине)',
						correct: 'её семья',
						explanation: 'Используйте её для "её" и его для "его"'
					},
					{
						wrong: 'моё брат',
						correct: 'мой брат',
						explanation: 'Притяжательное местоимение согласуется с родом существительного (брат - мужской род)'
					},
					{
						wrong: 'Я есть брат',
						correct: 'У меня есть брат',
						explanation: 'В русском языке говорят "У меня есть брат", а не "Я есть брат"'
					}
				]
			},
			{
				type: 'list',
				items: [
					'<strong>младший</strong> = младший',
					'<strong>старший</strong> = старший',
					'<strong>единственный ребёнок</strong> = единственный ребёнок',
					'<strong>близнецы</strong> = близнецы'
				]
			},
			{
				type: 'relatedTopics',
				topics: []
			}
		]
	}
]

async function insertLessons() {
	console.log('🚀 Creating Russian lessons 4 and 5 (FIXED)...\n')

	for (const lesson of lessons) {
		console.log(`📝 Inserting lesson ${lesson.order}: ${lesson.title_fr}`)

		const { data, error } = await supabase
			.from('lessons')
			.insert({
				slug: lesson.slug,
				target_language: lesson.target_language,
				level: lesson.level,
				order: lesson.order,
				difficulty: lesson.difficulty,
				estimated_read_time: lesson.estimated_read_time,
				status: lesson.status,
				keywords: lesson.keywords,
				title_fr: lesson.title_fr,
				title_en: lesson.title_en,
				title_ru: lesson.title_ru,
				blocks_fr: lesson.blocks_fr,
				blocks_en: lesson.blocks_en,
				blocks_ru: lesson.blocks_ru
			})
			.select()

		if (error) {
			console.error(`   ❌ Error:`, error.message)
		} else {
			console.log(`   ✅ Inserted with ID: ${data[0].id}`)
			console.log(`   📊 Blocks: FR=${lesson.blocks_fr.length}, EN=${lesson.blocks_en.length}, RU=${lesson.blocks_ru.length}`)
		}

		console.log('')
	}

	console.log('✅ All lessons created successfully!')
}

insertLessons().catch(console.error)
