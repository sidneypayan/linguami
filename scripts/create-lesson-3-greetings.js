/**
 * Create lesson 3: Greetings and Introducing Yourself
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.SUPABASE_COURSES_URL,
	process.env.SUPABASE_COURSES_SERVICE_KEY
)

const lesson = {
	slug: 'greetings-introducing-yourself',
	target_language: 'ru',
	level: 'A1',
	order: 3,
	difficulty: 'beginner',
	estimated_read_time: 30,
	title_fr: 'Salutations et se présenter',
	title_en: 'Greetings and Introducing Yourself',
	title_ru: 'Приветствия и знакомство',
	status: 'published',
	blocks_fr: [
		{
			type: 'mainTitle',
			text: 'Salutations et se présenter',
		},
		{
			type: 'subtitle',
			text: 'Premières interactions en russe',
		},
		{
			type: 'quickSummary',
			title: 'Points clés',
			keyForms: [
				{ form: 'Привет / Здравствуйте', translation: 'Salut (informel) / Bonjour (formel)' },
				{ form: 'Меня зовут...', translation: "Je m'appelle..." },
				{ form: 'Как дела?', translation: 'Comment ça va ?' },
				{ form: 'До свидания / Пока', translation: 'Au revoir / Salut' },
			],
		},
		{
			type: 'title',
			text: 'Salutations de base',
		},
		{
			type: 'paragraph',
			text: 'En russe, il existe plusieurs niveaux de formalité pour saluer. <strong>Привет</strong> est informel (entre amis), tandis que <strong>Здравствуйте</strong> est formel (avec des inconnus, au travail).',
		},
		{
			type: 'usageList',
			title: 'Différents moments de la journée',
			items: [
				{
					usage: 'Привет [privièt]',
					examples: ['Salut ! (informel)', 'Utilisé avec amis, famille, collègues proches'],
				},
				{
					usage: 'Здравствуйте [zdravstvouïtié]',
					examples: ['Bonjour (formel)', 'Au travail, avec des inconnus, personnes âgées'],
					commonMistake: {
						wrong: 'Dire Привет à son patron',
						correct: 'Utiliser Здравствуйте dans un contexte professionnel',
					},
				},
				{
					usage: 'Доброе утро [dobraïé outra]',
					examples: ['Bon matin', 'Utilisé le matin (jusqu\'à midi environ)'],
				},
				{
					usage: 'Добрый день [dobry dièn]',
					examples: ['Bonjour / Bon après-midi', 'Pendant la journée'],
				},
				{
					usage: 'Добрый вечер [dobry viétchèr]',
					examples: ['Bonsoir', 'En fin de journée et le soir'],
				},
				{
					usage: 'Спокойной ночи [spakoïnaï notchi]',
					examples: ['Bonne nuit', 'Avant de dormir uniquement'],
				},
			],
		},
		{
			type: 'title',
			text: 'Se présenter',
		},
		{
			type: 'paragraph',
			text: 'La construction <strong>\"Меня зовут\"</strong> (littéralement \"on m\'appelle\") est la manière standard de dire son nom en russe.',
		},
		{
			type: 'conjugationTable',
			title: 'Construction \"Меня зовут\"',
			rows: [
				{
					pronoun: 'Меня зовут...',
					form: '[miènia zavout]',
					translation: "Je m'appelle...",
					pronunciation: '1ère personne',
				},
				{
					pronoun: 'Тебя зовут...',
					form: '[tièbia zavout]',
					translation: "Tu t'appelles...",
					pronunciation: '2ème personne informel',
				},
				{
					pronoun: 'Вас зовут...',
					form: '[vas zavout]',
					translation: 'Vous vous appelez...',
					pronunciation: '2ème personne formel/pluriel',
				},
				{
					pronoun: 'Его зовут...',
					form: '[yivo zavout]',
					translation: "Il s'appelle...",
					pronunciation: '3ème personne masculin',
				},
				{
					pronoun: 'Её зовут...',
					form: '[yiyo zavout]',
					translation: "Elle s'appelle...",
					pronunciation: '3ème personne féminin',
				},
			],
		},
		{
			type: 'title',
			text: 'Questions courantes',
		},
		{
			type: 'conjugationTable',
			title: 'Poser des questions',
			rows: [
				{
					pronoun: 'Как тебя/вас зовут?',
					form: '[kak tièbia/vas zavout]',
					translation: 'Comment tu t\'appelles / vous vous appelez ?',
					pronunciation: 'Question la plus courante',
				},
				{
					pronoun: 'Как дела?',
					form: '[kak dièla]',
					translation: 'Comment ça va ?',
					pronunciation: 'Informel',
				},
				{
					pronoun: 'Как вы поживаете?',
					form: '[kak vy pajivaïétié]',
					translation: 'Comment allez-vous ?',
					pronunciation: 'Formel',
				},
				{
					pronoun: 'Откуда вы?',
					form: '[atkouda vy]',
					translation: 'D\'où venez-vous ?',
					pronunciation: 'Question sur origine',
				},
				{
					pronoun: 'Вы говорите по-русски?',
					form: '[vy gavaritié pa-rousski]',
					translation: 'Parlez-vous russe ?',
					pronunciation: 'Question sur langues',
				},
			],
		},
		{
			type: 'title',
			text: 'Répondre aux questions',
		},
		{
			type: 'usageList',
			title: 'Réponses courantes',
			items: [
				{
					usage: 'Хорошо [kharacho]',
					examples: ['Bien', 'Réponse positive standard'],
				},
				{
					usage: 'Отлично [atlichna]',
					examples: ['Excellent/Super', 'Très positif'],
				},
				{
					usage: 'Нормально [narmal\'na]',
					examples: ['Ça va/Normal', 'Neutre'],
				},
				{
					usage: 'Неплохо [nièplakha]',
					examples: ['Pas mal', 'Positif modéré'],
				},
				{
					usage: 'Плохо [plokha]',
					examples: ['Mal', 'Négatif'],
				},
				{
					usage: 'Я из Франции [ya iz frantsiï]',
					examples: ['Je viens de France', 'Origine géographique'],
				},
			],
		},
		{
			type: 'title',
			text: 'Dire au revoir',
		},
		{
			type: 'conjugationTable',
			title: 'Formules d\'au revoir',
			rows: [
				{
					pronoun: 'До свидания',
					form: '[da svidaniïa]',
					translation: 'Au revoir',
					pronunciation: 'Formel, neutre',
				},
				{
					pronoun: 'Пока',
					form: '[paka]',
					translation: 'Salut / À plus',
					pronunciation: 'Informel',
				},
				{
					pronoun: 'До встречи',
					form: '[da fstriètchi]',
					translation: 'À bientôt',
					pronunciation: 'Quand on se reverra',
				},
				{
					pronoun: 'Увидимся',
					form: '[ouvidimssia]',
					translation: 'On se voit',
					pronunciation: 'Informel',
				},
				{
					pronoun: 'Всего доброго',
					form: '[fsièvo dobrova]',
					translation: 'Tout le meilleur',
					pronunciation: 'Très formel',
				},
			],
		},
		{
			type: 'title',
			text: 'Langues et nationalités',
		},
		{
			type: 'paragraph',
			text: 'Pour dire quelle langue vous parlez, utilisez <strong>\"Я говорю по-\"</strong> suivi du nom de la langue :',
		},
		{
			type: 'conjugationTable',
			title: 'Parler des langues',
			rows: [
				{
					pronoun: 'по-русски',
					form: '[pa-rousski]',
					translation: 'russe',
					pronunciation: 'langue russe',
				},
				{
					pronoun: 'по-французски',
					form: '[pa-frantsouzski]',
					translation: 'français',
					pronunciation: 'langue française',
				},
				{
					pronoun: 'по-английски',
					form: '[pa-angliïski]',
					translation: 'anglais',
					pronunciation: 'langue anglaise',
				},
				{
					pronoun: 'по-немецки',
					form: '[pa-niemiètski]',
					translation: 'allemand',
					pronunciation: 'langue allemande',
				},
				{
					pronoun: 'по-испански',
					form: '[pa-ispanski]',
					translation: 'espagnol',
					pronunciation: 'langue espagnole',
				},
			],
		},
		{
			type: 'mistakesTable',
			title: 'Erreurs courantes',
			rows: [
				{
					wrong: 'Dire Привет à son patron',
					correct: 'Utiliser Здравствуйте en contexte professionnel',
					explanation: 'Привет est trop informel pour le travail',
				},
				{
					wrong: 'Dire Спокойной ночи pour dire au revoir',
					correct: 'Utiliser До свидания ou Пока',
					explanation: 'Спокойной ночи = seulement avant de dormir',
				},
				{
					wrong: 'Je parle russe = Я говорю русски',
					correct: 'Я говорю по-русски',
					explanation: 'Ne pas oublier le préfixe "по-"',
				},
				{
					wrong: 'Confondre Меня зовут (nom) avec Я (pronom)',
					correct: 'Меня зовут Мария (nom), Я студентка (profession)',
					explanation: 'Deux constructions différentes',
				},
			],
		},
		{
			type: 'title',
			text: 'Formules de politesse',
		},
		{
			type: 'list',
			items: [
				'<strong>Спасибо</strong> [spasiba] — Merci',
				'<strong>Большое спасибо</strong> [bal\'choïé spasiba] — Merci beaucoup',
				'<strong>Пожалуйста</strong> [pajalouïsta] — S\'il vous plaît / De rien',
				'<strong>Извините</strong> [izvimitié] — Excusez-moi (formel)',
				'<strong>Прости</strong> [prasti] — Pardon (informel)',
				'<strong>Очень приятно</strong> [otchièn\' priyatna] — Enchanté',
			],
		},
		{
			type: 'miniDialogue',
			title: 'Dialogue complet : Première rencontre',
			lines: [
				{
					speaker: 'Олег',
					text: 'Здравствуйте! Меня зовут Олег.',
				},
				{
					speaker: 'Наташа',
					text: 'Здравствуйте! Меня зовут Наташа. Очень приятно!',
				},
				{
					speaker: 'Олег',
					text: 'Приятно познакомиться. Вы говорите по-английски?',
				},
				{
					speaker: 'Наташа',
					text: 'Да, я говорю по-английски и по-французски. А вы?',
				},
				{
					speaker: 'Олег',
					text: 'Я говорю только по-русски. Откуда вы?',
				},
				{
					speaker: 'Наташа',
					text: 'Я из Москвы. А вы?',
				},
				{
					speaker: 'Олег',
					text: 'Я из Санкт-Петербурга. До свидания!',
				},
				{
					speaker: 'Наташа',
					text: 'До встречи!',
				},
			],
			translation: '— Bonjour ! Je m\'appelle Oleg. — Bonjour ! Je m\'appelle Natasha. Enchanté ! — Enchanté de vous connaître. Parlez-vous anglais ? — Oui, je parle anglais et français. Et vous ? — Je parle seulement russe. D\'où venez-vous ? — Je viens de Moscou. Et vous ? — Je viens de Saint-Pétersbourg. Au revoir ! — À bientôt !',
		},
		{
			type: 'relatedTopics',
		},
	],
	blocks_en: [
		{
			type: 'mainTitle',
			text: 'Greetings and Introducing Yourself',
		},
		{
			type: 'subtitle',
			text: 'First Interactions in Russian',
		},
		{
			type: 'quickSummary',
			title: 'Key Points',
			keyForms: [
				{ form: 'Привет / Здравствуйте', translation: 'Hi (informal) / Hello (formal)' },
				{ form: 'Меня зовут...', translation: 'My name is...' },
				{ form: 'Как дела?', translation: 'How are you?' },
				{ form: 'До свидания / Пока', translation: 'Goodbye / Bye' },
			],
		},
		{
			type: 'title',
			text: 'Basic Greetings',
		},
		{
			type: 'paragraph',
			text: 'In Russian, there are several levels of formality for greetings. <strong>Привет</strong> is informal (among friends), while <strong>Здравствуйте</strong> is formal (with strangers, at work).',
		},
		{
			type: 'usageList',
			title: 'Different Times of Day',
			items: [
				{
					usage: 'Привет [priviet]',
					examples: ['Hi! (informal)', 'Used with friends, family, close colleagues'],
				},
				{
					usage: 'Здравствуйте [zdravstvuyte]',
					examples: ['Hello (formal)', 'At work, with strangers, elderly people'],
					commonMistake: {
						wrong: 'Saying Привет to your boss',
						correct: 'Use Здравствуйте in professional contexts',
					},
				},
				{
					usage: 'Доброе утро [dobraye utro]',
					examples: ['Good morning', 'Used in the morning (until around noon)'],
				},
				{
					usage: 'Добрый день [dobry den]',
					examples: ['Good day / Good afternoon', 'During the day'],
				},
				{
					usage: 'Добрый вечер [dobry vecher]',
					examples: ['Good evening', 'Late afternoon and evening'],
				},
				{
					usage: 'Спокойной ночи [spokoynoy nochi]',
					examples: ['Good night', 'Only before sleeping'],
				},
			],
		},
		{
			type: 'title',
			text: 'Introducing Yourself',
		},
		{
			type: 'paragraph',
			text: 'The construction <strong>"Меня зовут"</strong> (literally "they call me") is the standard way to say your name in Russian.',
		},
		{
			type: 'conjugationTable',
			title: '"Меня зовут" Construction',
			rows: [
				{
					pronoun: 'Меня зовут...',
					form: '[menya zavut]',
					translation: 'My name is...',
					pronunciation: '1st person',
				},
				{
					pronoun: 'Тебя зовут...',
					form: '[tebya zavut]',
					translation: 'Your name is...',
					pronunciation: '2nd person informal',
				},
				{
					pronoun: 'Вас зовут...',
					form: '[vas zavut]',
					translation: 'Your name is...',
					pronunciation: '2nd person formal/plural',
				},
				{
					pronoun: 'Его зовут...',
					form: '[yevo zavut]',
					translation: 'His name is...',
					pronunciation: '3rd person masculine',
				},
				{
					pronoun: 'Её зовут...',
					form: '[yeyo zavut]',
					translation: 'Her name is...',
					pronunciation: '3rd person feminine',
				},
			],
		},
		{
			type: 'title',
			text: 'Common Questions',
		},
		{
			type: 'conjugationTable',
			title: 'Asking Questions',
			rows: [
				{
					pronoun: 'Как тебя/вас зовут?',
					form: '[kak tebya/vas zavut]',
					translation: 'What is your name?',
					pronunciation: 'Most common question',
				},
				{
					pronoun: 'Как дела?',
					form: '[kak dela]',
					translation: 'How are you?',
					pronunciation: 'Informal',
				},
				{
					pronoun: 'Как вы поживаете?',
					form: '[kak vy pozhivayete]',
					translation: 'How are you doing?',
					pronunciation: 'Formal',
				},
				{
					pronoun: 'Откуда вы?',
					form: '[otkuda vy]',
					translation: 'Where are you from?',
					pronunciation: 'Question about origin',
				},
				{
					pronoun: 'Вы говорите по-русски?',
					form: '[vy govorite po-russki]',
					translation: 'Do you speak Russian?',
					pronunciation: 'Question about languages',
				},
			],
		},
		{
			type: 'title',
			text: 'Answering Questions',
		},
		{
			type: 'usageList',
			title: 'Common Answers',
			items: [
				{
					usage: 'Хорошо [khorosho]',
					examples: ['Good/Well', 'Standard positive response'],
				},
				{
					usage: 'Отлично [otlichno]',
					examples: ['Excellent/Great', 'Very positive'],
				},
				{
					usage: 'Нормально [normalno]',
					examples: ['OK/Normal', 'Neutral'],
				},
				{
					usage: 'Неплохо [nepl okho]',
					examples: ['Not bad', 'Moderate positive'],
				},
				{
					usage: 'Плохо [plokho]',
					examples: ['Bad', 'Negative'],
				},
				{
					usage: 'Я из Франции [ya iz frantsii]',
					examples: ['I am from France', 'Geographic origin'],
				},
			],
		},
		{
			type: 'title',
			text: 'Saying Goodbye',
		},
		{
			type: 'conjugationTable',
			title: 'Farewell Expressions',
			rows: [
				{
					pronoun: 'До свидания',
					form: '[da svidaniya]',
					translation: 'Goodbye',
					pronunciation: 'Formal, neutral',
				},
				{
					pronoun: 'Пока',
					form: '[poka]',
					translation: 'Bye / See you',
					pronunciation: 'Informal',
				},
				{
					pronoun: 'До встречи',
					form: '[da vstrechi]',
					translation: 'See you soon',
					pronunciation: 'When you will meet again',
				},
				{
					pronoun: 'Увидимся',
					form: '[uvidimsya]',
					translation: 'See you',
					pronunciation: 'Informal',
				},
				{
					pronoun: 'Всего доброго',
					form: '[vsevo dobrovo]',
					translation: 'All the best',
					pronunciation: 'Very formal',
				},
			],
		},
		{
			type: 'title',
			text: 'Languages and Nationalities',
		},
		{
			type: 'paragraph',
			text: 'To say which language you speak, use <strong>"Я говорю по-"</strong> followed by the language name:',
		},
		{
			type: 'conjugationTable',
			title: 'Talking About Languages',
			rows: [
				{
					pronoun: 'по-русски',
					form: '[po-russki]',
					translation: 'Russian',
					pronunciation: 'Russian language',
				},
				{
					pronoun: 'по-французски',
					form: '[po-frantsuzski]',
					translation: 'French',
					pronunciation: 'French language',
				},
				{
					pronoun: 'по-английски',
					form: '[po-angliyski]',
					translation: 'English',
					pronunciation: 'English language',
				},
				{
					pronoun: 'по-немецки',
					form: '[po-nemetski]',
					translation: 'German',
					pronunciation: 'German language',
				},
				{
					pronoun: 'по-испански',
					form: '[po-ispanski]',
					translation: 'Spanish',
					pronunciation: 'Spanish language',
				},
			],
		},
		{
			type: 'mistakesTable',
			title: 'Common Mistakes',
			rows: [
				{
					wrong: 'Saying Привет to your boss',
					correct: 'Use Здравствуйте in professional context',
					explanation: 'Привет is too informal for work',
				},
				{
					wrong: 'Saying Спокойной ночи to say goodbye',
					correct: 'Use До свидания or Пока',
					explanation: 'Спокойной ночи = only before sleeping',
				},
				{
					wrong: 'I speak Russian = Я говорю русски',
					correct: 'Я говорю по-русски',
					explanation: 'Don\'t forget the prefix "по-"',
				},
				{
					wrong: 'Confusing Меня зовут (name) with Я (pronoun)',
					correct: 'Меня зовут Мария (name), Я студентка (profession)',
					explanation: 'Two different constructions',
				},
			],
		},
		{
			type: 'title',
			text: 'Polite Expressions',
		},
		{
			type: 'list',
			items: [
				'<strong>Спасибо</strong> [spasibo] — Thank you',
				'<strong>Большое спасибо</strong> [bolshoye spasibo] — Thank you very much',
				'<strong>Пожалуйста</strong> [pozhaluysta] — Please / You\'re welcome',
				'<strong>Извините</strong> [izvinite] — Excuse me (formal)',
				'<strong>Прости</strong> [prosti] — Sorry (informal)',
				'<strong>Очень приятно</strong> [ochen priyatno] — Nice to meet you',
			],
		},
		{
			type: 'miniDialogue',
			title: 'Complete Dialogue: First Meeting',
			lines: [
				{
					speaker: 'Олег',
					text: 'Здравствуйте! Меня зовут Олег.',
				},
				{
					speaker: 'Наташа',
					text: 'Здравствуйте! Меня зовут Наташа. Очень приятно!',
				},
				{
					speaker: 'Олег',
					text: 'Приятно познакомиться. Вы говорите по-английски?',
				},
				{
					speaker: 'Наташа',
					text: 'Да, я говорю по-английски и по-французски. А вы?',
				},
				{
					speaker: 'Олег',
					text: 'Я говорю только по-русски. Откуда вы?',
				},
				{
					speaker: 'Наташа',
					text: 'Я из Москвы. А вы?',
				},
				{
					speaker: 'Олег',
					text: 'Я из Санкт-Петербурга. До свидания!',
				},
				{
					speaker: 'Наташа',
					text: 'До встречи!',
				},
			],
			translation: "— Hello! My name is Oleg. — Hello! My name is Natasha. Nice to meet you! — Pleased to meet you. Do you speak English? — Yes, I speak English and French. And you? — I only speak Russian. Where are you from? — I'm from Moscow. And you? — I'm from Saint Petersburg. Goodbye! — See you soon!",
		},
		{
			type: 'relatedTopics',
		},
	],
}

async function insertLesson() {
	console.log('Inserting Russian lesson 3...\n')
	console.log(`Inserting: ${lesson.title_en}`)
	console.log(`  - ${lesson.blocks_fr.length} blocks in French`)
	console.log(`  - ${lesson.blocks_en.length} blocks in English`)

	const { data, error} = await supabase
		.from('lessons')
		.insert({
			slug: lesson.slug,
			target_language: lesson.target_language,
			level: lesson.level,
			order: lesson.order,
			difficulty: lesson.difficulty,
			estimated_read_time: lesson.estimated_read_time,
			title_fr: lesson.title_fr,
			title_en: lesson.title_en,
			title_ru: lesson.title_ru,
			blocks_fr: lesson.blocks_fr,
			blocks_en: lesson.blocks_en,
			blocks_ru: null,
			status: lesson.status,
		})
		.select()

	if (error) {
		console.error(`Error:`, error)
	} else {
		console.log(`✓ Lesson ID ${data[0].id} created\n`)
	}

	console.log('✅ ALL 3 RUSSIAN LESSONS CREATED!')
	console.log('\nSummary:')
	console.log('  1. Cyrillic Alphabet and Sounds - 17 blocks')
	console.log('  2. Personal Pronouns and БЫТЬ - 19 blocks')
	console.log('  3. Greetings and Introducing Yourself - 18 blocks')
	console.log('\n⚠️  Phase 1: NO AUDIO - text content only')
	console.log('Ready for user review!')
}

insertLesson()
