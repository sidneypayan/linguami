/**
 * Create Russian lessons 4 and 5 for standalone lessons page
 * Lesson 4: Numbers 0-20 and age
 * Lesson 5: Family and possessive pronouns
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
				type: 'title',
				level: 1,
				text: 'Les nombres de 0 à 20'
			},
			{
				type: 'paragraph',
				text: 'Les nombres en russe sont essentiels pour la vie quotidienne : demander l\'âge, compter, donner un numéro de téléphone...'
			},
			{
				type: 'vocabulary',
				title: 'Les nombres de 0 à 10',
				categories: [
					{
						name: 'Nombres 0-10',
						words: [
							{ word: 'ноль', translation: 'zéro', pronunciation: '[nol\']' },
							{ word: 'один', translation: 'un', pronunciation: '[adin]' },
							{ word: 'два', translation: 'deux', pronunciation: '[dva]' },
							{ word: 'три', translation: 'trois', pronunciation: '[tri]' },
							{ word: 'четыре', translation: 'quatre', pronunciation: '[tchityré]' },
							{ word: 'пять', translation: 'cinq', pronunciation: '[piat\']' },
							{ word: 'шесть', translation: 'six', pronunciation: '[chèst\']' },
							{ word: 'семь', translation: 'sept', pronunciation: '[sièm\']' },
							{ word: 'восемь', translation: 'huit', pronunciation: '[vossièm\']' },
							{ word: 'девять', translation: 'neuf', pronunciation: '[dièviat\']' },
							{ word: 'десять', translation: 'dix', pronunciation: '[dièciat\']' }
						]
					}
				]
			},
			{
				type: 'tip',
				content: 'Notez que "один" (un) change selon le genre : один (masculin), одна (féminin), одно (neutre).'
			},
			{
				type: 'vocabulary',
				title: 'Les nombres de 11 à 20',
				categories: [
					{
						name: 'Nombres 11-20',
						words: [
							{ word: 'одиннадцать', translation: 'onze', pronunciation: '[adinnatsat\']' },
							{ word: 'двенадцать', translation: 'douze', pronunciation: '[dvènatsat\']' },
							{ word: 'тринадцать', translation: 'treize', pronunciation: '[trinatsat\']' },
							{ word: 'четырнадцать', translation: 'quatorze', pronunciation: '[tchityrnatsat\']' },
							{ word: 'пятнадцать', translation: 'quinze', pronunciation: '[piatnatsat\']' },
							{ word: 'шестнадцать', translation: 'seize', pronunciation: '[chèstnatsat\']' },
							{ word: 'семнадцать', translation: 'dix-sept', pronunciation: '[siemnatsat\']' },
							{ word: 'восемнадцать', translation: 'dix-huit', pronunciation: '[vossiemnatsat\']' },
							{ word: 'девятнадцать', translation: 'dix-neuf', pronunciation: '[diviatnatsat\']' },
							{ word: 'двадцать', translation: 'vingt', pronunciation: '[dvatsat\']' }
						]
					}
				]
			},
			{
				type: 'grammar',
				title: 'Structure des nombres 11-19',
				explanation: 'Les nombres de 11 à 19 se forment en ajoutant "-надцать" (-natsat\') au nombre de base. Par exemple : один (un) + надцать = одиннадцать (onze).'
			},
			{
				type: 'title',
				level: 2,
				text: 'Demander et donner son âge'
			},
			{
				type: 'paragraph',
				text: 'Pour demander l\'âge en russe, on utilise deux structures principales selon le niveau de politesse.'
			},
			{
				type: 'dialogue',
				title: 'Conversation : Demander l\'âge',
				lines: [
					{
						speaker: 'Анна',
						speakerGender: 'female',
						text: 'Сколько тебе лет?',
						translation: 'Quel âge as-tu ?'
					},
					{
						speaker: 'Иван',
						speakerGender: 'male',
						text: 'Мне двадцать лет. А тебе?',
						translation: 'J\'ai vingt ans. Et toi ?'
					},
					{
						speaker: 'Анна',
						speakerGender: 'female',
						text: 'Мне восемнадцать.',
						translation: 'J\'ai dix-huit ans.'
					}
				]
			},
			{
				type: 'grammar',
				title: 'Structure : Мне ... лет',
				explanation: 'Pour dire son âge, on utilise la structure "Мне + nombre + лет" (littéralement : "À moi ... années"). Le mot "лет" est le génitif pluriel de "год" (année).'
			},
			{
				type: 'vocabulary',
				title: 'Expressions avec l\'âge',
				categories: [
					{
						name: 'Questions d\'âge',
						words: [
							{ word: 'Сколько тебе лет?', translation: 'Quel âge as-tu ? (informel)' },
							{ word: 'Сколько вам лет?', translation: 'Quel âge avez-vous ? (formel)' },
							{ word: 'Мне ... лет', translation: 'J\'ai ... ans' },
							{ word: 'Ему/Ей ... лет', translation: 'Il/Elle a ... ans' }
						]
					}
				]
			},
			{
				type: 'tip',
				content: 'Attention : après les nombres 1, on utilise "год" (мне один год - j\'ai un an), après 2-4 on utilise "года" (два года), et après 5+ on utilise "лет" (пять лет).'
			},
			{
				type: 'exerciseInline',
				exerciseType: 'fillblank',
				title: 'Exercice : Complétez les phrases',
				instructions: 'Traduisez les nombres en russe',
				questions: [
					{
						question: 'J\'ai ___ ans. (15)',
						correctAnswer: 'пятнадцать',
						acceptedAnswers: ['пятнадцать', '15']
					},
					{
						question: 'Elle a ___ ans. (7)',
						correctAnswer: 'семь',
						acceptedAnswers: ['семь', '7']
					},
					{
						question: 'Nous avons ___ ans. (20)',
						correctAnswer: 'двадцать',
						acceptedAnswers: ['двадцать', '20']
					}
				]
			},
			{
				type: 'summary',
				title: 'Points clés de la leçon',
				points: [
					'Les nombres de 0 à 10 : ноль, один, два, три...',
					'Les nombres 11-19 se forment avec "-надцать"',
					'Pour demander l\'âge : "Сколько тебе/вам лет?"',
					'Pour donner son âge : "Мне ... лет"',
					'Le mot "лет" change selon le nombre (год/года/лет)'
				]
			}
		],

		// English explanations
		blocks_en: [
			{
				type: 'title',
				level: 1,
				text: 'Numbers from 0 to 20'
			},
			{
				type: 'paragraph',
				text: 'Numbers in Russian are essential for daily life: asking age, counting, giving a phone number...'
			},
			{
				type: 'vocabulary',
				title: 'Numbers 0 to 10',
				categories: [
					{
						name: 'Numbers 0-10',
						words: [
							{ word: 'ноль', translation: 'zero', pronunciation: '[nol\']' },
							{ word: 'один', translation: 'one', pronunciation: '[adin]' },
							{ word: 'два', translation: 'two', pronunciation: '[dva]' },
							{ word: 'три', translation: 'three', pronunciation: '[tri]' },
							{ word: 'четыре', translation: 'four', pronunciation: '[tchityré]' },
							{ word: 'пять', translation: 'five', pronunciation: '[piat\']' },
							{ word: 'шесть', translation: 'six', pronunciation: '[chèst\']' },
							{ word: 'семь', translation: 'seven', pronunciation: '[sièm\']' },
							{ word: 'восемь', translation: 'eight', pronunciation: '[vossièm\']' },
							{ word: 'девять', translation: 'nine', pronunciation: '[dièviat\']' },
							{ word: 'десять', translation: 'ten', pronunciation: '[dièciat\']' }
						]
					}
				]
			},
			{
				type: 'tip',
				content: 'Note that "один" (one) changes by gender: один (masculine), одна (feminine), одно (neuter).'
			},
			{
				type: 'vocabulary',
				title: 'Numbers 11 to 20',
				categories: [
					{
						name: 'Numbers 11-20',
						words: [
							{ word: 'одиннадцать', translation: 'eleven', pronunciation: '[adinnatsat\']' },
							{ word: 'двенадцать', translation: 'twelve', pronunciation: '[dvènatsat\']' },
							{ word: 'тринадцать', translation: 'thirteen', pronunciation: '[trinatsat\']' },
							{ word: 'четырнадцать', translation: 'fourteen', pronunciation: '[tchityrnatsat\']' },
							{ word: 'пятнадцать', translation: 'fifteen', pronunciation: '[piatnatsat\']' },
							{ word: 'шестнадцать', translation: 'sixteen', pronunciation: '[chèstnatsat\']' },
							{ word: 'семнадцать', translation: 'seventeen', pronunciation: '[siemnatsat\']' },
							{ word: 'восемнадцать', translation: 'eighteen', pronunciation: '[vossiemnatsat\']' },
							{ word: 'девятнадцать', translation: 'nineteen', pronunciation: '[diviatnatsat\']' },
							{ word: 'двадцать', translation: 'twenty', pronunciation: '[dvatsat\']' }
						]
					}
				]
			},
			{
				type: 'grammar',
				title: 'Structure of numbers 11-19',
				explanation: 'Numbers from 11 to 19 are formed by adding "-надцать" (-natsat\') to the base number. For example: один (one) + надцать = одиннадцать (eleven).'
			},
			{
				type: 'title',
				level: 2,
				text: 'Asking and giving your age'
			},
			{
				type: 'paragraph',
				text: 'To ask about age in Russian, we use two main structures depending on the level of politeness.'
			},
			{
				type: 'dialogue',
				title: 'Conversation: Asking age',
				lines: [
					{
						speaker: 'Анна',
						speakerGender: 'female',
						text: 'Сколько тебе лет?',
						translation: 'How old are you?'
					},
					{
						speaker: 'Иван',
						speakerGender: 'male',
						text: 'Мне двадцать лет. А тебе?',
						translation: 'I am twenty years old. And you?'
					},
					{
						speaker: 'Анна',
						speakerGender: 'female',
						text: 'Мне восемнадцать.',
						translation: 'I am eighteen.'
					}
				]
			},
			{
				type: 'grammar',
				title: 'Structure: Мне ... лет',
				explanation: 'To state your age, use the structure "Мне + number + лет" (literally: "To me ... years"). The word "лет" is the genitive plural of "год" (year).'
			},
			{
				type: 'vocabulary',
				title: 'Age expressions',
				categories: [
					{
						name: 'Age questions',
						words: [
							{ word: 'Сколько тебе лет?', translation: 'How old are you? (informal)' },
							{ word: 'Сколько вам лет?', translation: 'How old are you? (formal)' },
							{ word: 'Мне ... лет', translation: 'I am ... years old' },
							{ word: 'Ему/Ей ... лет', translation: 'He/She is ... years old' }
						]
					}
				]
			},
			{
				type: 'tip',
				content: 'Careful: after number 1, use "год" (мне один год - I am one year old), after 2-4 use "года" (два года), and after 5+ use "лет" (пять лет).'
			},
			{
				type: 'exerciseInline',
				exerciseType: 'fillblank',
				title: 'Exercise: Complete the sentences',
				instructions: 'Translate the numbers into Russian',
				questions: [
					{
						question: 'I am ___ years old. (15)',
						correctAnswer: 'пятнадцать',
						acceptedAnswers: ['пятнадцать', '15']
					},
					{
						question: 'She is ___ years old. (7)',
						correctAnswer: 'семь',
						acceptedAnswers: ['семь', '7']
					},
					{
						question: 'We are ___ years old. (20)',
						correctAnswer: 'двадцать',
						acceptedAnswers: ['двадцать', '20']
					}
				]
			},
			{
				type: 'summary',
				title: 'Key points of the lesson',
				points: [
					'Numbers 0 to 10: ноль, один, два, три...',
					'Numbers 11-19 are formed with "-надцать"',
					'To ask age: "Сколько тебе/вам лет?"',
					'To give your age: "Мне ... лет"',
					'The word "лет" changes depending on the number (год/года/лет)'
				]
			}
		],

		// Russian explanations
		blocks_ru: [
			{
				type: 'title',
				level: 1,
				text: 'Числа от 0 до 20'
			},
			{
				type: 'paragraph',
				text: 'Числа в русском языке необходимы для повседневной жизни: спрашивать возраст, считать, давать номер телефона...'
			},
			{
				type: 'vocabulary',
				title: 'Числа от 0 до 10',
				categories: [
					{
						name: 'Числа 0-10',
						words: [
							{ word: 'ноль', translation: 'ноль', pronunciation: '[nol\']' },
							{ word: 'один', translation: 'один', pronunciation: '[adin]' },
							{ word: 'два', translation: 'два', pronunciation: '[dva]' },
							{ word: 'три', translation: 'три', pronunciation: '[tri]' },
							{ word: 'четыре', translation: 'четыре', pronunciation: '[tchityré]' },
							{ word: 'пять', translation: 'пять', pronunciation: '[piat\']' },
							{ word: 'шесть', translation: 'шесть', pronunciation: '[chèst\']' },
							{ word: 'семь', translation: 'семь', pronunciation: '[sièm\']' },
							{ word: 'восемь', translation: 'восемь', pronunciation: '[vossièm\']' },
							{ word: 'девять', translation: 'девять', pronunciation: '[dièviat\']' },
							{ word: 'десять', translation: 'десять', pronunciation: '[dièciat\']' }
						]
					}
				]
			},
			{
				type: 'tip',
				content: 'Обратите внимание, что "один" изменяется по роду: один (мужской), одна (женский), одно (средний).'
			},
			{
				type: 'vocabulary',
				title: 'Числа от 11 до 20',
				categories: [
					{
						name: 'Числа 11-20',
						words: [
							{ word: 'одиннадцать', translation: 'одиннадцать', pronunciation: '[adinnatsat\']' },
							{ word: 'двенадцать', translation: 'двенадцать', pronunciation: '[dvènatsat\']' },
							{ word: 'тринадцать', translation: 'тринадцать', pronunciation: '[trinatsat\']' },
							{ word: 'четырнадцать', translation: 'четырнадцать', pronunciation: '[tchityrnatsat\']' },
							{ word: 'пятнадцать', translation: 'пятнадцать', pronunciation: '[piatnatsat\']' },
							{ word: 'шестнадцать', translation: 'шестнадцать', pronunciation: '[chèstnatsat\']' },
							{ word: 'семнадцать', translation: 'семнадцать', pronunciation: '[siemnatsat\']' },
							{ word: 'восемнадцать', translation: 'восемнадцать', pronunciation: '[vossiemnatsat\']' },
							{ word: 'девятнадцать', translation: 'девятнадцать', pronunciation: '[diviatnatsat\']' },
							{ word: 'двадцать', translation: 'двадцать', pronunciation: '[dvatsat\']' }
						]
					}
				]
			},
			{
				type: 'grammar',
				title: 'Структура чисел 11-19',
				explanation: 'Числа от 11 до 19 образуются добавлением "-надцать" к базовому числу. Например: один + надцать = одиннадцать.'
			},
			{
				type: 'title',
				level: 2,
				text: 'Спрашивать и говорить свой возраст'
			},
			{
				type: 'paragraph',
				text: 'Чтобы спросить о возрасте по-русски, используются две основные структуры в зависимости от уровня вежливости.'
			},
			{
				type: 'dialogue',
				title: 'Разговор: Спрашивать возраст',
				lines: [
					{
						speaker: 'Анна',
						speakerGender: 'female',
						text: 'Сколько тебе лет?',
						translation: 'Сколько тебе лет?'
					},
					{
						speaker: 'Иван',
						speakerGender: 'male',
						text: 'Мне двадцать лет. А тебе?',
						translation: 'Мне двадцать лет. А тебе?'
					},
					{
						speaker: 'Анна',
						speakerGender: 'female',
						text: 'Мне восемнадцать.',
						translation: 'Мне восемнадцать.'
					}
				]
			},
			{
				type: 'grammar',
				title: 'Структура: Мне ... лет',
				explanation: 'Чтобы указать свой возраст, используется структура "Мне + число + лет". Слово "лет" - это родительный падеж множественного числа от "год".'
			},
			{
				type: 'vocabulary',
				title: 'Выражения с возрастом',
				categories: [
					{
						name: 'Вопросы о возрасте',
						words: [
							{ word: 'Сколько тебе лет?', translation: 'Сколько тебе лет? (неформально)' },
							{ word: 'Сколько вам лет?', translation: 'Сколько вам лет? (формально)' },
							{ word: 'Мне ... лет', translation: 'Мне ... лет' },
							{ word: 'Ему/Ей ... лет', translation: 'Ему/Ей ... лет' }
						]
					}
				]
			},
			{
				type: 'tip',
				content: 'Внимание: после числа 1 используется "год" (мне один год), после 2-4 используется "года" (два года), а после 5+ используется "лет" (пять лет).'
			},
			{
				type: 'exerciseInline',
				exerciseType: 'fillblank',
				title: 'Упражнение: Заполните предложения',
				instructions: 'Переведите числа на русский',
				questions: [
					{
						question: 'Мне ___ лет. (15)',
						correctAnswer: 'пятнадцать',
						acceptedAnswers: ['пятнадцать', '15']
					},
					{
						question: 'Ей ___ лет. (7)',
						correctAnswer: 'семь',
						acceptedAnswers: ['семь', '7']
					},
					{
						question: 'Нам ___ лет. (20)',
						correctAnswer: 'двадцать',
						acceptedAnswers: ['двадцать', '20']
					}
				]
			},
			{
				type: 'summary',
				title: 'Ключевые моменты урока',
				points: [
					'Числа от 0 до 10: ноль, один, два, три...',
					'Числа 11-19 образуются с "-надцать"',
					'Спросить возраст: "Сколько тебе/вам лет?"',
					'Сказать свой возраст: "Мне ... лет"',
					'Слово "лет" изменяется в зависимости от числа (год/года/лет)'
				]
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
				type: 'title',
				level: 1,
				text: 'La famille en russe'
			},
			{
				type: 'paragraph',
				text: 'La famille (семья) est un thème fondamental pour parler de soi. Nous allons apprendre les mots de base et comment utiliser les pronoms possessifs.'
			},
			{
				type: 'vocabulary',
				title: 'Les membres de la famille',
				categories: [
					{
						name: 'Famille proche',
						words: [
							{ word: 'семья', translation: 'famille', pronunciation: '[simia]' },
							{ word: 'мама', translation: 'maman', pronunciation: '[mama]' },
							{ word: 'папа', translation: 'papa', pronunciation: '[papa]' },
							{ word: 'родители', translation: 'parents', pronunciation: '[raditièli]' },
							{ word: 'брат', translation: 'frère', pronunciation: '[brat]' },
							{ word: 'сестра', translation: 'sœur', pronunciation: '[siestra]' },
							{ word: 'сын', translation: 'fils', pronunciation: '[syn]' },
							{ word: 'дочь', translation: 'fille', pronunciation: '[dotch\']' },
							{ word: 'муж', translation: 'mari', pronunciation: '[mouj]' },
							{ word: 'жена', translation: 'épouse', pronunciation: '[jèna]' }
						]
					},
					{
						name: 'Famille élargie',
						words: [
							{ word: 'дедушка', translation: 'grand-père', pronunciation: '[dièdouchka]' },
							{ word: 'бабушка', translation: 'grand-mère', pronunciation: '[babouchka]' },
							{ word: 'дядя', translation: 'oncle', pronunciation: '[diadia]' },
							{ word: 'тётя', translation: 'tante', pronunciation: '[tiotia]' },
							{ word: 'племянник', translation: 'neveu', pronunciation: '[plièmiannik]' },
							{ word: 'племянница', translation: 'nièce', pronunciation: '[plièmiannitsa]' }
						]
					}
				]
			},
			{
				type: 'tip',
				content: 'Remarquez que "бабушка" (grand-mère) et "дедушка" (grand-père) utilisent le suffixe diminutif "-ушка/-ушк a" qui exprime l\'affection.'
			},
			{
				type: 'title',
				level: 2,
				text: 'Les pronoms possessifs'
			},
			{
				type: 'paragraph',
				text: 'Les pronoms possessifs en russe s\'accordent en genre et en nombre avec le nom qu\'ils qualifient, pas avec le possesseur (contrairement au français).'
			},
			{
				type: 'grammar',
				title: 'Tableau des pronoms possessifs',
				explanation: 'Voici les formes de base au nominatif masculin/féminin/neutre :',
				table: {
					headers: ['Personne', 'Masculin', 'Féminin', 'Neutre', 'Exemple'],
					rows: [
						['мой', 'мой', 'моя', 'моё', 'мой брат (mon frère)'],
						['твой', 'твой', 'твоя', 'твоё', 'твоя сестра (ta sœur)'],
						['его', 'его', 'его', 'его', 'его мама (sa mère à lui)'],
						['её', 'её', 'её', 'её', 'её папа (son père à elle)'],
						['наш', 'наш', 'наша', 'наше', 'наша семья (notre famille)'],
						['ваш', 'ваш', 'ваша', 'ваше', 'ваш дом (votre maison)'],
						['их', 'их', 'их', 'их', 'их дети (leurs enfants)']
					]
				}
			},
			{
				type: 'tip',
				content: 'Attention : "его", "её" et "их" ne changent JAMAIS (invariables), tandis que "мой", "твой", "наш" et "ваш" s\'accordent.'
			},
			{
				type: 'dialogue',
				title: 'Conversation : Parler de sa famille',
				lines: [
					{
						speaker: 'Мария',
						speakerGender: 'female',
						text: 'У тебя есть брат или сестра?',
						translation: 'As-tu un frère ou une sœur ?'
					},
					{
						speaker: 'Павел',
						speakerGender: 'male',
						text: 'Да, у меня есть младший брат и старшая сестра.',
						translation: 'Oui, j\'ai un petit frère et une grande sœur.'
					},
					{
						speaker: 'Мария',
						speakerGender: 'female',
						text: 'А как зовут твоего брата?',
						translation: 'Et comment s\'appelle ton frère ?'
					},
					{
						speaker: 'Павел',
						speakerGender: 'male',
						text: 'Моего брата зовут Алексей. Ему пятнадцать лет.',
						translation: 'Mon frère s\'appelle Alexeï. Il a quinze ans.'
					}
				]
			},
			{
				type: 'vocabulary',
				title: 'Expressions utiles',
				categories: [
					{
						name: 'Parler de la famille',
						words: [
							{ word: 'У меня есть...', translation: 'J\'ai... (littéralement : Chez moi il y a...)' },
							{ word: 'У тебя есть...?', translation: 'As-tu... ?' },
							{ word: 'младший', translation: 'plus jeune, cadet' },
							{ word: 'старший', translation: 'plus âgé, aîné' },
							{ word: 'единственный ребёнок', translation: 'enfant unique' },
							{ word: 'близнецы', translation: 'jumeaux' }
						]
					}
				]
			},
			{
				type: 'grammar',
				title: 'La construction "У меня есть..."',
				explanation: 'Pour dire "j\'ai", on utilise la construction "У + personne (génitif) + есть + objet (nominatif)". Par exemple : У меня есть брат (J\'ai un frère) - littéralement "Chez moi il y a un frère".'
			},
			{
				type: 'exerciseInline',
				exerciseType: 'mcq',
				title: 'Exercice : Choisissez le pronom possessif correct',
				questions: [
					{
						question: '___ мама (ma maman)',
						options: ['мой', 'моя', 'моё', 'мои'],
						correctAnswer: 'моя'
					},
					{
						question: '___ папа (ton papa)',
						options: ['твой', 'твоя', 'твоё', 'твои'],
						correctAnswer: 'твой'
					},
					{
						question: '___ семья (notre famille)',
						options: ['наш', 'наша', 'наше', 'наши'],
						correctAnswer: 'наша'
					}
				]
			},
			{
				type: 'culture',
				title: 'Note culturelle : La famille russe',
				content: 'En Russie, les liens familiaux sont très importants. Il est courant de vivre avec ses grands-parents ou d\'avoir des relations très proches avec la famille élargie. Le dimanche en famille reste une tradition ancrée dans la culture russe.'
			},
			{
				type: 'summary',
				title: 'Points clés de la leçon',
				points: [
					'Vocabulaire de base de la famille : мама, папа, брат, сестра...',
					'Les pronoms possessifs s\'accordent avec l\'objet possédé, pas le possesseur',
					'Formes variables : мой/моя/моё, твой/твоя/твоё, наш/наша/наше, ваш/ваша/ваше',
					'Formes invariables : его, её, их',
					'Construction "У меня есть..." pour exprimer la possession'
				]
			}
		],

		// English explanations
		blocks_en: [
			{
				type: 'title',
				level: 1,
				text: 'Family in Russian'
			},
			{
				type: 'paragraph',
				text: 'Family (семья) is a fundamental topic for talking about yourself. We will learn the basic words and how to use possessive pronouns.'
			},
			{
				type: 'vocabulary',
				title: 'Family members',
				categories: [
					{
						name: 'Immediate family',
						words: [
							{ word: 'семья', translation: 'family', pronunciation: '[simia]' },
							{ word: 'мама', translation: 'mom', pronunciation: '[mama]' },
							{ word: 'папа', translation: 'dad', pronunciation: '[papa]' },
							{ word: 'родители', translation: 'parents', pronunciation: '[raditièli]' },
							{ word: 'брат', translation: 'brother', pronunciation: '[brat]' },
							{ word: 'сестра', translation: 'sister', pronunciation: '[siestra]' },
							{ word: 'сын', translation: 'son', pronunciation: '[syn]' },
							{ word: 'дочь', translation: 'daughter', pronunciation: '[dotch\']' },
							{ word: 'муж', translation: 'husband', pronunciation: '[mouj]' },
							{ word: 'жена', translation: 'wife', pronunciation: '[jèna]' }
						]
					},
					{
						name: 'Extended family',
						words: [
							{ word: 'дедушка', translation: 'grandfather', pronunciation: '[dièdouchka]' },
							{ word: 'бабушка', translation: 'grandmother', pronunciation: '[babouchka]' },
							{ word: 'дядя', translation: 'uncle', pronunciation: '[diadia]' },
							{ word: 'тётя', translation: 'aunt', pronunciation: '[tiotia]' },
							{ word: 'племянник', translation: 'nephew', pronunciation: '[plièmiannik]' },
							{ word: 'племянница', translation: 'niece', pronunciation: '[plièmiannitsa]' }
						]
					}
				]
			},
			{
				type: 'tip',
				content: 'Notice that "бабушка" (grandmother) and "дедушка" (grandfather) use the diminutive suffix "-ушка/-ушка" which expresses affection.'
			},
			{
				type: 'title',
				level: 2,
				text: 'Possessive pronouns'
			},
			{
				type: 'paragraph',
				text: 'Possessive pronouns in Russian agree in gender and number with the noun they modify, not with the possessor (unlike English).'
			},
			{
				type: 'grammar',
				title: 'Table of possessive pronouns',
				explanation: 'Here are the basic forms in the nominative masculine/feminine/neuter:',
				table: {
					headers: ['Person', 'Masculine', 'Feminine', 'Neuter', 'Example'],
					rows: [
						['my', 'мой', 'моя', 'моё', 'мой брат (my brother)'],
						['your', 'твой', 'твоя', 'твоё', 'твоя сестра (your sister)'],
						['his', 'его', 'его', 'его', 'его мама (his mother)'],
						['her', 'её', 'её', 'её', 'её папа (her father)'],
						['our', 'наш', 'наша', 'наше', 'наша семья (our family)'],
						['your', 'ваш', 'ваша', 'ваше', 'ваш дом (your house)'],
						['their', 'их', 'их', 'их', 'их дети (their children)']
					]
				}
			},
			{
				type: 'tip',
				content: 'Careful: "его", "её" and "их" NEVER change (invariable), while "мой", "твой", "наш" and "ваш" agree.'
			},
			{
				type: 'dialogue',
				title: 'Conversation: Talking about family',
				lines: [
					{
						speaker: 'Мария',
						speakerGender: 'female',
						text: 'У тебя есть брат или сестра?',
						translation: 'Do you have a brother or sister?'
					},
					{
						speaker: 'Павел',
						speakerGender: 'male',
						text: 'Да, у меня есть младший брат и старшая сестра.',
						translation: 'Yes, I have a younger brother and an older sister.'
					},
					{
						speaker: 'Мария',
						speakerGender: 'female',
						text: 'А как зовут твоего брата?',
						translation: 'And what is your brother\'s name?'
					},
					{
						speaker: 'Павел',
						speakerGender: 'male',
						text: 'Моего брата зовут Алексей. Ему пятнадцать лет.',
						translation: 'My brother\'s name is Alexei. He is fifteen years old.'
					}
				]
			},
			{
				type: 'vocabulary',
				title: 'Useful expressions',
				categories: [
					{
						name: 'Talking about family',
						words: [
							{ word: 'У меня есть...', translation: 'I have... (literally: At me there is...)' },
							{ word: 'У тебя есть...?', translation: 'Do you have...?' },
							{ word: 'младший', translation: 'younger' },
							{ word: 'старший', translation: 'older, elder' },
							{ word: 'единственный ребёнок', translation: 'only child' },
							{ word: 'близнецы', translation: 'twins' }
						]
					}
				]
			},
			{
				type: 'grammar',
				title: 'The construction "У меня есть..."',
				explanation: 'To say "I have", we use the construction "У + person (genitive) + есть + object (nominative)". For example: У меня есть брат (I have a brother) - literally "At me there is a brother".'
			},
			{
				type: 'exerciseInline',
				exerciseType: 'mcq',
				title: 'Exercise: Choose the correct possessive pronoun',
				questions: [
					{
						question: '___ мама (my mom)',
						options: ['мой', 'моя', 'моё', 'мои'],
						correctAnswer: 'моя'
					},
					{
						question: '___ папа (your dad)',
						options: ['твой', 'твоя', 'твоё', 'твои'],
						correctAnswer: 'твой'
					},
					{
						question: '___ семья (our family)',
						options: ['наш', 'наша', 'наше', 'наши'],
						correctAnswer: 'наша'
					}
				]
			},
			{
				type: 'culture',
				title: 'Cultural note: The Russian family',
				content: 'In Russia, family ties are very important. It is common to live with grandparents or to have very close relationships with extended family. Sunday family gatherings remain a deeply rooted tradition in Russian culture.'
			},
			{
				type: 'summary',
				title: 'Key points of the lesson',
				points: [
					'Basic family vocabulary: мама, папа, брат, сестра...',
					'Possessive pronouns agree with the possessed object, not the possessor',
					'Variable forms: мой/моя/моё, твой/твоя/твоё, наш/наша/наше, ваш/ваша/ваше',
					'Invariable forms: его, её, их',
					'Construction "У меня есть..." to express possession'
				]
			}
		],

		// Russian explanations
		blocks_ru: [
			{
				type: 'title',
				level: 1,
				text: 'Семья на русском языке'
			},
			{
				type: 'paragraph',
				text: 'Семья - это основная тема для разговора о себе. Мы изучим основные слова и как использовать притяжательные местоимения.'
			},
			{
				type: 'vocabulary',
				title: 'Члены семьи',
				categories: [
					{
						name: 'Ближайшая семья',
						words: [
							{ word: 'семья', translation: 'семья', pronunciation: '[simia]' },
							{ word: 'мама', translation: 'мама', pronunciation: '[mama]' },
							{ word: 'папа', translation: 'папа', pronunciation: '[papa]' },
							{ word: 'родители', translation: 'родители', pronunciation: '[raditièli]' },
							{ word: 'брат', translation: 'брат', pronunciation: '[brat]' },
							{ word: 'сестра', translation: 'сестра', pronunciation: '[siestra]' },
							{ word: 'сын', translation: 'сын', pronunciation: '[syn]' },
							{ word: 'дочь', translation: 'дочь', pronunciation: '[dotch\']' },
							{ word: 'муж', translation: 'муж', pronunciation: '[mouj]' },
							{ word: 'жена', translation: 'жена', pronunciation: '[jèna]' }
						]
					},
					{
						name: 'Расширенная семья',
						words: [
							{ word: 'дедушка', translation: 'дедушка', pronunciation: '[dièdouchka]' },
							{ word: 'бабушка', translation: 'бабушка', pronunciation: '[babouchka]' },
							{ word: 'дядя', translation: 'дядя', pronunciation: '[diadia]' },
							{ word: 'тётя', translation: 'тётя', pronunciation: '[tiotia]' },
							{ word: 'племянник', translation: 'племянник', pronunciation: '[plièmiannik]' },
							{ word: 'племянница', translation: 'племянница', pronunciation: '[plièmiannitsa]' }
						]
					}
				]
			},
			{
				type: 'tip',
				content: 'Обратите внимание, что "бабушка" и "дедушка" используют уменьшительный суффикс "-ушка/-ушка", который выражает ласку.'
			},
			{
				type: 'title',
				level: 2,
				text: 'Притяжательные местоимения'
			},
			{
				type: 'paragraph',
				text: 'Притяжательные местоимения в русском языке согласуются по роду и числу с существительным, которое они определяют, а не с обладателем.'
			},
			{
				type: 'grammar',
				title: 'Таблица притяжательных местоимений',
				explanation: 'Вот основные формы в именительном падеже мужской/женский/средний род:',
				table: {
					headers: ['Лицо', 'Мужской', 'Женский', 'Средний', 'Пример'],
					rows: [
						['мой', 'мой', 'моя', 'моё', 'мой брат'],
						['твой', 'твой', 'твоя', 'твоё', 'твоя сестра'],
						['его', 'его', 'его', 'его', 'его мама'],
						['её', 'её', 'её', 'её', 'её папа'],
						['наш', 'наш', 'наша', 'наше', 'наша семья'],
						['ваш', 'ваш', 'ваша', 'ваше', 'ваш дом'],
						['их', 'их', 'их', 'их', 'их дети']
					]
				}
			},
			{
				type: 'tip',
				content: 'Внимание: "его", "её" и "их" НИКОГДА не изменяются (неизменяемые), в то время как "мой", "твой", "наш" и "ваш" согласуются.'
			},
			{
				type: 'dialogue',
				title: 'Разговор: Говорить о семье',
				lines: [
					{
						speaker: 'Мария',
						speakerGender: 'female',
						text: 'У тебя есть брат или сестра?',
						translation: 'У тебя есть брат или сестра?'
					},
					{
						speaker: 'Павел',
						speakerGender: 'male',
						text: 'Да, у меня есть младший брат и старшая сестра.',
						translation: 'Да, у меня есть младший брат и старшая сестра.'
					},
					{
						speaker: 'Мария',
						speakerGender: 'female',
						text: 'А как зовут твоего брата?',
						translation: 'А как зовут твоего брата?'
					},
					{
						speaker: 'Павел',
						speakerGender: 'male',
						text: 'Моего брата зовут Алексей. Ему пятнадцать лет.',
						translation: 'Моего брата зовут Алексей. Ему пятнадцать лет.'
					}
				]
			},
			{
				type: 'vocabulary',
				title: 'Полезные выражения',
				categories: [
					{
						name: 'Говорить о семье',
						words: [
							{ word: 'У меня есть...', translation: 'У меня есть...' },
							{ word: 'У тебя есть...?', translation: 'У тебя есть...?' },
							{ word: 'младший', translation: 'младший' },
							{ word: 'старший', translation: 'старший' },
							{ word: 'единственный ребёнок', translation: 'единственный ребёнок' },
							{ word: 'близнецы', translation: 'близнецы' }
						]
					}
				]
			},
			{
				type: 'grammar',
				title: 'Конструкция "У меня есть..."',
				explanation: 'Чтобы сказать "у меня есть", используется конструкция "У + лицо (родительный падеж) + есть + объект (именительный падеж)". Например: У меня есть брат.'
			},
			{
				type: 'exerciseInline',
				exerciseType: 'mcq',
				title: 'Упражнение: Выберите правильное притяжательное местоимение',
				questions: [
					{
						question: '___ мама (моя мама)',
						options: ['мой', 'моя', 'моё', 'мои'],
						correctAnswer: 'моя'
					},
					{
						question: '___ папа (твой папа)',
						options: ['твой', 'твоя', 'твоё', 'твои'],
						correctAnswer: 'твой'
					},
					{
						question: '___ семья (наша семья)',
						options: ['наш', 'наша', 'наше', 'наши'],
						correctAnswer: 'наша'
					}
				]
			},
			{
				type: 'culture',
				title: 'Культурная заметка: Русская семья',
				content: 'В России семейные связи очень важны. Часто живут с бабушками и дедушками или имеют очень близкие отношения с расширенной семьей. Воскресные семейные встречи остаются глубоко укоренившейся традицией в русской культуре.'
			},
			{
				type: 'summary',
				title: 'Ключевые моменты урока',
				points: [
					'Основная семейная лексика: мама, папа, брат, сестра...',
					'Притяжательные местоимения согласуются с объектом обладания, а не с обладателем',
					'Изменяемые формы: мой/моя/моё, твой/твоя/твоё, наш/наша/наше, ваш/ваша/ваше',
					'Неизменяемые формы: его, её, их',
					'Конструкция "У меня есть..." для выражения обладания'
				]
			}
		]
	}
]

async function insertLessons() {
	console.log('🚀 Creating Russian lessons 4 and 5...\n')

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
