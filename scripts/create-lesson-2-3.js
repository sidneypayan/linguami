/**
 * Create lessons 2 and 3 for Russian
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.SUPABASE_COURSES_URL,
	process.env.SUPABASE_COURSES_SERVICE_KEY
)

const lessons = [
	// Lesson 2: Personal Pronouns and БЫТЬ
	{
		slug: 'personal-pronouns-verb-byt',
		target_language: 'ru',
		level: 'A1',
		order: 2,
		difficulty: 'beginner',
		estimated_read_time: 35,
		title_fr: 'Pronoms personnels et le verbe БЫТЬ',
		title_en: 'Personal Pronouns and the Verb БЫТЬ',
		title_ru: 'Личные местоимения и глагол БЫТЬ',
		status: 'published',
		blocks_fr: [
			{
				type: 'mainTitle',
				text: 'Pronoms personnels et le verbe БЫТЬ',
			},
			{
				type: 'subtitle',
				text: 'Les bases de la conjugaison russe',
			},
			{
				type: 'quickSummary',
				title: 'Points clés',
				keyForms: [
					{ form: '7 pronoms', translation: 'я, ты, он/она, мы, вы, они' },
					{ form: 'Pas de verbe être au présent', translation: 'Je suis étudiant = Я студент' },
					{ form: 'ты vs вы', translation: 'Tutoiement vs vouvoiement' },
					{ form: 'Genre', translation: 'он (masculin), она (féminin)' },
				],
			},
			{
				type: 'title',
				text: 'Les pronoms personnels',
			},
			{
				type: 'paragraph',
				text: 'Les pronoms personnels russes sont <strong>essentiels</strong> pour construire des phrases. Contrairement au français, le russe distingue clairement le tutoiement (ты) du vouvoiement (вы).',
			},
			{
				type: 'conjugationTable',
				title: 'Les 7 pronoms personnels',
				rows: [
					{
						pronoun: 'я',
						form: '[ya]',
						translation: 'je',
						pronunciation: '1ère personne du singulier',
					},
					{
						pronoun: 'ты',
						form: '[ty]',
						translation: 'tu',
						pronunciation: '2ème personne du singulier (informel)',
						mnemonic: 'Utilisé avec amis, famille, enfants',
					},
					{
						pronoun: 'он',
						form: '[on]',
						translation: 'il',
						pronunciation: '3ème personne masculin',
					},
					{
						pronoun: 'она',
						form: '[ana]',
						translation: 'elle',
						pronunciation: '3ème personne féminin',
					},
					{
						pronoun: 'мы',
						form: '[my]',
						translation: 'nous',
						pronunciation: '1ère personne du pluriel',
					},
					{
						pronoun: 'вы',
						form: '[vy]',
						translation: 'vous',
						pronunciation: '2ème personne pluriel OU singulier formel',
						mnemonic: 'Utilisé avec inconnus, supérieurs, plusieurs personnes',
					},
					{
						pronoun: 'они',
						form: '[ani]',
						translation: 'ils/elles',
						pronunciation: '3ème personne pluriel (pas de distinction genre)',
					},
				],
			},
			{
				type: 'title',
				text: 'Le verbe БЫТЬ (être) au présent',
			},
			{
				type: 'paragraph',
				text: 'En russe moderne, le verbe БЫТЬ (être) <strong>est omis au présent</strong>. On dit simplement "Я студент" (littéralement "Je étudiant") pour dire "Je suis étudiant".',
			},
			{
				type: 'usageList',
				title: 'Construction des phrases au présent',
				items: [
					{
						usage: 'Avec profession',
						examples: [
							'Я врач = Je suis médecin',
							'Она учительница = Elle est enseignante',
							'Мы студенты = Nous sommes étudiants',
						],
					},
					{
						usage: 'Avec nationalité',
						examples: [
							'Я француз = Je suis français (masculin)',
							'Она русская = Elle est russe (féminin)',
							'Вы американец? = Êtes-vous américain ?',
						],
					},
					{
						usage: 'Avec localisation',
						examples: [
							'Я дома = Je suis à la maison',
							'Он в Москве = Il est à Moscou',
							'Мы здесь = Nous sommes ici',
						],
					},
					{
						usage: 'Avec adjectif',
						examples: [
							'Она красивая = Elle est belle',
							'Он умный = Il est intelligent',
							'Вы правы = Vous avez raison',
						],
						commonMistake: {
							wrong: 'Ajouter le verbe "est"',
							correct: 'Pas de verbe au présent',
						},
					},
				],
			},
			{
				type: 'title',
				text: 'БЫТЬ au passé et au futur',
			},
			{
				type: 'paragraph',
				text: 'Le verbe БЫТЬ <strong>réapparaît</strong> au passé et au futur :',
			},
			{
				type: 'conjugationTable',
				title: 'БЫТЬ au passé',
				rows: [
					{
						pronoun: 'я/ты/он был',
						form: '[byl]',
						translation: "j'étais/tu étais/il était",
						pronunciation: 'masculin',
					},
					{
						pronoun: 'я/ты/она была',
						form: '[byla]',
						translation: "j'étais/tu étais/elle était",
						pronunciation: 'féminin',
					},
					{
						pronoun: 'оно было',
						form: '[bylo]',
						translation: "c'était (neutre)",
						pronunciation: 'neutre',
					},
					{
						pronoun: 'мы/вы/они были',
						form: '[byli]',
						translation: 'nous étions/vous étiez/ils étaient',
						pronunciation: 'pluriel',
					},
				],
			},
			{
				type: 'conjugationTable',
				title: 'БЫТЬ au futur',
				rows: [
					{
						pronoun: 'я буду',
						form: '[boudou]',
						translation: 'je serai',
					},
					{
						pronoun: 'ты будешь',
						form: '[boudich]',
						translation: 'tu seras',
					},
					{
						pronoun: 'он/она будет',
						form: '[boudit]',
						translation: 'il/elle sera',
					},
					{
						pronoun: 'мы будем',
						form: '[boudim]',
						translation: 'nous serons',
					},
					{
						pronoun: 'вы будете',
						form: '[bouditié]',
						translation: 'vous serez',
					},
					{
						pronoun: 'они будут',
						form: '[boudout]',
						translation: 'ils/elles seront',
					},
				],
			},
			{
				type: 'mistakesTable',
				title: 'Erreurs courantes',
				rows: [
					{
						wrong: 'Я есть студент',
						correct: 'Я студент',
						explanation: 'Pas de verbe "être" au présent',
					},
					{
						wrong: 'Utiliser вы pour un ami proche',
						correct: 'Utiliser ты pour amis et famille',
						explanation: 'вы est formel ou pluriel',
					},
					{
						wrong: 'Он был (pour une femme)',
						correct: 'Она была',
						explanation: 'Accord du genre au passé',
					},
					{
						wrong: 'Traduire "ils" et "elles" différemment',
						correct: 'они pour les deux',
						explanation: 'Pas de distinction de genre au pluriel',
					},
				],
			},
			{
				type: 'title',
				text: 'Genre des noms de profession',
			},
			{
				type: 'paragraph',
				text: 'En russe, beaucoup de noms de profession ont des <strong>formes masculine et féminine</strong> :',
			},
			{
				type: 'list',
				items: [
					'<strong>студент</strong> (étudiant) → <strong>студентка</strong> (étudiante)',
					'<strong>учитель</strong> (enseignant) → <strong>учительница</strong> (enseignante)',
					'<strong>актёр</strong> (acteur) → <strong>актриса</strong> (actrice)',
					'Mais : <strong>врач</strong> (médecin) est neutre pour les deux genres',
				],
			},
			{
				type: 'miniDialogue',
				title: 'Première rencontre',
				lines: [
					{
						speaker: 'Андрей',
						text: 'Привет! Я Андрей. Я студент.',
					},
					{
						speaker: 'Мария',
						text: 'Здравствуй! Я Мария. Я тоже студентка.',
					},
					{
						speaker: 'Андрей',
						text: 'Ты русская?',
					},
					{
						speaker: 'Мария',
						text: 'Да, я русская. А ты?',
					},
					{
						speaker: 'Андрей',
						text: 'Я француз.',
					},
				],
				translation: '— Salut ! Je suis Andrey. Je suis étudiant. — Bonjour ! Je suis Maria. Je suis étudiante aussi. — Tu es russe ? — Oui, je suis russe. Et toi ? — Je suis français.',
			},
			{
				type: 'relatedTopics',
			},
		],
		blocks_en: [
			{
				type: 'mainTitle',
				text: 'Personal Pronouns and the Verb БЫТЬ',
			},
			{
				type: 'subtitle',
				text: 'Russian Conjugation Basics',
			},
			{
				type: 'quickSummary',
				title: 'Key Points',
				keyForms: [
					{ form: '7 pronouns', translation: 'я, ты, он/она, мы, вы, они' },
					{ form: 'No verb "to be" in present', translation: 'I am student = Я студент' },
					{ form: 'ты vs вы', translation: 'Informal vs formal you' },
					{ form: 'Gender', translation: 'он (masculine), она (feminine)' },
				],
			},
			{
				type: 'title',
				text: 'Personal Pronouns',
			},
			{
				type: 'paragraph',
				text: 'Russian personal pronouns are <strong>essential</strong> for building sentences. Unlike English, Russian clearly distinguishes informal (ты) from formal (вы) "you".',
			},
			{
				type: 'conjugationTable',
				title: 'The 7 Personal Pronouns',
				rows: [
					{
						pronoun: 'я',
						form: '[ya]',
						translation: 'I',
						pronunciation: '1st person singular',
					},
					{
						pronoun: 'ты',
						form: '[ty]',
						translation: 'you',
						pronunciation: '2nd person singular (informal)',
						mnemonic: 'Used with friends, family, children',
					},
					{
						pronoun: 'он',
						form: '[on]',
						translation: 'he',
						pronunciation: '3rd person masculine',
					},
					{
						pronoun: 'она',
						form: '[ana]',
						translation: 'she',
						pronunciation: '3rd person feminine',
					},
					{
						pronoun: 'мы',
						form: '[my]',
						translation: 'we',
						pronunciation: '1st person plural',
					},
					{
						pronoun: 'вы',
						form: '[vy]',
						translation: 'you',
						pronunciation: '2nd person plural OR singular formal',
						mnemonic: 'Used with strangers, superiors, multiple people',
					},
					{
						pronoun: 'они',
						form: '[ani]',
						translation: 'they',
						pronunciation: '3rd person plural (no gender distinction)',
					},
				],
			},
			{
				type: 'title',
				text: 'The Verb БЫТЬ (to be) in Present',
			},
			{
				type: 'paragraph',
				text: 'In modern Russian, the verb БЫТЬ (to be) <strong>is omitted in the present tense</strong>. You simply say "Я студент" (literally "I student") to mean "I am a student".',
			},
			{
				type: 'usageList',
				title: 'Present Tense Sentence Construction',
				items: [
					{
						usage: 'With profession',
						examples: [
							'Я врач = I am a doctor',
							'Она учительница = She is a teacher',
							'Мы студенты = We are students',
						],
					},
					{
						usage: 'With nationality',
						examples: [
							'Я француз = I am French (masculine)',
							'Она русская = She is Russian (feminine)',
							'Вы американец? = Are you American?',
						],
					},
					{
						usage: 'With location',
						examples: [
							'Я дома = I am at home',
							'Он в Москве = He is in Moscow',
							'Мы здесь = We are here',
						],
					},
					{
						usage: 'With adjective',
						examples: [
							'Она красивая = She is beautiful',
							'Он умный = He is smart',
							'Вы правы = You are right',
						],
						commonMistake: {
							wrong: 'Adding the verb "is"',
							correct: 'No verb in present tense',
						},
					},
				],
			},
			{
				type: 'title',
				text: 'БЫТЬ in Past and Future',
			},
			{
				type: 'paragraph',
				text: 'The verb БЫТЬ <strong>reappears</strong> in past and future tenses:',
			},
			{
				type: 'conjugationTable',
				title: 'БЫТЬ in Past Tense',
				rows: [
					{
						pronoun: 'я/ты/он был',
						form: '[byl]',
						translation: 'I/you/he was',
						pronunciation: 'masculine',
					},
					{
						pronoun: 'я/ты/она была',
						form: '[byla]',
						translation: 'I/you/she was',
						pronunciation: 'feminine',
					},
					{
						pronoun: 'оно было',
						form: '[bylo]',
						translation: 'it was',
						pronunciation: 'neuter',
					},
					{
						pronoun: 'мы/вы/они были',
						form: '[byli]',
						translation: 'we/you/they were',
						pronunciation: 'plural',
					},
				],
			},
			{
				type: 'conjugationTable',
				title: 'БЫТЬ in Future Tense',
				rows: [
					{
						pronoun: 'я буду',
						form: '[boudou]',
						translation: 'I will be',
					},
					{
						pronoun: 'ты будешь',
						form: '[boudich]',
						translation: 'you will be',
					},
					{
						pronoun: 'он/она будет',
						form: '[boudit]',
						translation: 'he/she will be',
					},
					{
						pronoun: 'мы будем',
						form: '[boudim]',
						translation: 'we will be',
					},
					{
						pronoun: 'вы будете',
						form: '[bouditié]',
						translation: 'you will be',
					},
					{
						pronoun: 'они будут',
						form: '[boudout]',
						translation: 'they will be',
					},
				],
			},
			{
				type: 'mistakesTable',
				title: 'Common Mistakes',
				rows: [
					{
						wrong: 'Я есть студент',
						correct: 'Я студент',
						explanation: 'No verb "to be" in present tense',
					},
					{
						wrong: 'Using вы for a close friend',
						correct: 'Use ты for friends and family',
						explanation: 'вы is formal or plural',
					},
					{
						wrong: 'Он был (for a woman)',
						correct: 'Она была',
						explanation: 'Gender agreement in past tense',
					},
					{
						wrong: 'Translating "he" and "she" in plural',
						correct: 'они for both',
						explanation: 'No gender distinction in plural',
					},
				],
			},
			{
				type: 'title',
				text: 'Gender of Profession Nouns',
			},
			{
				type: 'paragraph',
				text: 'In Russian, many profession nouns have <strong>masculine and feminine forms</strong>:',
			},
			{
				type: 'list',
				items: [
					'<strong>студент</strong> (student m) → <strong>студентка</strong> (student f)',
					'<strong>учитель</strong> (teacher m) → <strong>учительница</strong> (teacher f)',
					'<strong>актёр</strong> (actor) → <strong>актриса</strong> (actress)',
					'But: <strong>врач</strong> (doctor) is gender-neutral',
				],
			},
			{
				type: 'miniDialogue',
				title: 'First Meeting',
				lines: [
					{
						speaker: 'Андрей',
						text: 'Привет! Я Андрей. Я студент.',
					},
					{
						speaker: 'Мария',
						text: 'Здравствуй! Я Мария. Я тоже студентка.',
					},
					{
						speaker: 'Андрей',
						text: 'Ты русская?',
					},
					{
						speaker: 'Мария',
						text: 'Да, я русская. А ты?',
					},
					{
						speaker: 'Андрей',
						text: 'Я француз.',
					},
				],
				translation: "— Hi! I'm Andrey. I'm a student. — Hello! I'm Maria. I'm a student too. — Are you Russian? — Yes, I'm Russian. And you? — I'm French.",
			},
			{
				type: 'relatedTopics',
			},
		],
	},
]

async function insertLessons() {
	console.log('Inserting Russian lesson 2...\n')

	for (const lesson of lessons) {
		console.log(`Inserting: ${lesson.title_en}`)
		console.log(`  - ${lesson.blocks_fr.length} blocks in French`)
		console.log(`  - ${lesson.blocks_en.length} blocks in English`)

		const { data, error } = await supabase
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
	}

	console.log('✓ Lesson 2 complete! (18 blocks)')
	console.log('\nCreating lesson 3 next...')
}

insertLessons()
