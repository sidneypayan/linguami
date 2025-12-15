/**
 * Script to create detailed Russian lessons (17-20 blocks each)
 * Following the same structure as French lessons
 * Phase 1: Text content only (NO AUDIO)
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.SUPABASE_COURSES_URL,
	process.env.SUPABASE_COURSES_SERVICE_KEY
)

const lessons = [
	{
		slug: 'cyrillic-alphabet-sounds',
		target_language: 'ru',
		level: 'A1',
		order: 1,
		difficulty: 'beginner',
		estimated_read_time: 30,
		title_fr: 'Alphabet cyrillique et sons',
		title_en: 'Cyrillic Alphabet and Sounds',
		title_ru: 'Кириллица и звуки',
		status: 'published',
		blocks_fr: [
			{
				type: 'mainTitle',
				text: 'Alphabet cyrillique et sons',
			},
			{
				type: 'subtitle',
				text: 'Les fondamentaux de la prononciation russe',
			},
			{
				type: 'quickSummary',
				title: 'Points clés',
				keyForms: [
					{
						form: '33 lettres',
						translation: '10 voyelles, 21 consonnes, 2 signes',
					},
					{
						form: 'Lettres familières',
						translation: 'А, Е, К, М, О, Т ressemblent au latin',
					},
					{
						form: 'Faux-amis',
						translation: 'В = V, Р = R, Н = N',
					},
					{
						form: 'Sons uniques',
						translation: 'Ы, Ж, Ц, Щ',
					},
				],
			},
			{
				type: 'title',
				text: "L'alphabet cyrillique",
			},
			{
				type: 'paragraph',
				text: "L'alphabet russe compte <strong>33 lettres</strong> (contre 26 en français). Il a été créé au IXe siècle par les frères Cyrille et Méthode. Beaucoup de lettres ressemblent au latin, mais attention aux faux-amis !",
			},
			{
				type: 'conjugationTable',
				title: 'Les voyelles russes',
				rows: [
					{
						pronoun: 'А а',
						form: '[a]',
						translation: 'мама (mama) - maman',
						pronunciation: "comme dans 'papa'",
					},
					{
						pronoun: 'Е е',
						form: '[yé]',
						translation: 'это (éta) - ceci',
						pronunciation: "'yé' au début, 'é' après consonne",
					},
					{
						pronoun: 'И и',
						form: '[i]',
						translation: 'мир (mir) - monde',
						pronunciation: "comme 'i' dans 'lit'",
					},
					{
						pronoun: 'О о',
						form: '[o]',
						translation: 'кот (kot) - chat',
						pronunciation: "comme 'o' dans 'vol'",
					},
					{
						pronoun: 'У у',
						form: '[ou]',
						translation: 'ум (oum) - esprit',
						pronunciation: "comme 'ou' dans 'cou'",
					},
					{
						pronoun: 'Ы ы',
						form: '[y]',
						translation: 'ты (ty) - tu',
						pronunciation: "⚠️ Son unique ! Entre 'i' et 'eu'",
						mnemonic: "Dites 'i' en reculant la langue",
					},
					{
						pronoun: 'Э э',
						form: '[è]',
						translation: 'это (èta) - ceci',
						pronunciation: "comme 'è' dans 'mère'",
					},
					{
						pronoun: 'Ю ю',
						form: '[you]',
						translation: 'юг (youg) - sud',
						pronunciation: "comme 'you' en anglais",
					},
					{
						pronoun: 'Я я',
						form: '[ya]',
						translation: 'я (ya) - je',
						pronunciation: "comme 'ya' dans 'yaourt'",
					},
				],
			},
			{
				type: 'title',
				text: 'Les consonnes pièges (faux-amis)',
			},
			{
				type: 'usageList',
				title: 'Consonnes qui ressemblent au latin',
				items: [
					{
						usage: 'В в — se prononce [v]',
						examples: ['вода (voda) - eau', 'вино (vino) - vin', 'Владимир (Vladimir)'],
						commonMistake: {
							wrong: 'Prononcé comme "B"',
							correct: 'Se prononce toujours [v] comme "valise"',
						},
					},
					{
						usage: 'Р р — se prononce [r] roulé',
						examples: ['рыба (ryba) - poisson', 'Россия (Rossiya) - Russie', 'работа (rabota) - travail'],
						commonMistake: {
							wrong: 'Prononcé comme "P"',
							correct: 'C\'est un R roulé [r]',
						},
					},
					{
						usage: 'Н н — se prononce [n]',
						examples: ['нет (niet) - non', 'небо (niebo) - ciel', 'наука (naouka) - science'],
					},
					{
						usage: 'С с — se prononce [s]',
						examples: ['собака (sabaka) - chien', 'стол (stol) - table', 'Москва (Maskva) - Moscou'],
					},
					{
						usage: 'Х х — se prononce [kh]',
						examples: ['хлеб (khleb) - pain', 'хорошо (kharacho) - bien', 'Чехов (Tchekhov)'],
						commonMistake: {
							wrong: 'Prononcé comme "H" anglais',
							correct: 'Comme "J" espagnol (jota) ou "CH" allemand',
						},
					},
				],
			},
			{
				type: 'title',
				text: 'Sons uniques au russe',
			},
			{
				type: 'paragraph',
				text: "Ces sons n'existent pas en français et demandent de la pratique :",
			},
			{
				type: 'conjugationTable',
				title: 'Consonnes spéciales',
				rows: [
					{
						pronoun: 'Ж ж',
						form: '[j]',
						translation: 'жить (jit) - vivre',
						pronunciation: "comme 'j' dans 'jardin'",
					},
					{
						pronoun: 'Ц ц',
						form: '[ts]',
						translation: 'царь (tsar) - tsar',
						pronunciation: "comme 'ts' dans 'tsar'",
					},
					{
						pronoun: 'Ч ч',
						form: '[tch]',
						translation: 'час (tchas) - heure',
						pronunciation: "comme 'tch' dans 'tchèque'",
					},
					{
						pronoun: 'Ш ш',
						form: '[ch]',
						translation: 'школа (chkola) - école',
						pronunciation: "comme 'ch' dans 'chat'",
					},
					{
						pronoun: 'Щ щ',
						form: '[chtch]',
						translation: 'борщ (borchtch) - bortsch',
						pronunciation: "'ch' long et mouillé",
						mnemonic: "Comme 'ch' mais la langue plus en avant",
					},
				],
			},
			{
				type: 'mistakesTable',
				title: 'Erreurs courantes',
				rows: [
					{
						wrong: 'u se prononce [ou]',
						correct: 'u (У) se prononce [ou], mais y (Ы) est différent',
						explanation: "Exemple: ты [ty] n'est PAS [tou]",
					},
					{
						wrong: "Lire В comme 'B'",
						correct: "В se lit toujours [v]",
						explanation: 'Владимир = [Vladimir], pas [Bladimir]',
					},
					{
						wrong: "Lire Р comme 'P'",
						correct: 'Р est un R roulé',
						explanation: 'Россия = [Rossiya], pas [Possiya]',
					},
					{
						wrong: 'Confondre Н et Н latin',
						correct: 'Cyrillique Н = [n], pas [h]',
						explanation: 'нет = [niet], pas [hiet]',
					},
				],
			},
			{
				type: 'title',
				text: 'Signes spéciaux',
			},
			{
				type: 'paragraph',
				text: "L'alphabet cyrillique a deux signes qui ne sont pas des lettres mais modifient la prononciation des consonnes :",
			},
			{
				type: 'list',
				items: [
					"<strong>Ь (signe mou)</strong> — rend la consonne précédente plus douce/mouillée. Ex: мать [mat'] (mère)",
					"<strong>Ъ (signe dur)</strong> — sépare les syllabes. Ex: объект [abyekt] (objet)",
				],
			},
			{
				type: 'miniDialogue',
				title: 'Épeler son nom en russe',
				lines: [
					{
						speaker: 'Анна',
						text: 'Как тебя зовут?',
					},
					{
						speaker: 'Марк',
						text: 'Меня зовут Марк. М-А-Р-К.',
					},
					{
						speaker: 'Анна',
						text: 'А меня зовут Анна. А-Н-Н-А.',
					},
				],
				translation: '— Comment tu t\'appelles ? — Je m\'appelle Mark. M-A-R-K. — Et moi je m\'appelle Anna. A-N-N-A.',
			},
			{
				type: 'relatedTopics',
			},
		],
		blocks_en: [
			{
				type: 'mainTitle',
				text: 'Cyrillic Alphabet and Sounds',
			},
			{
				type: 'subtitle',
				text: 'Russian Pronunciation Fundamentals',
			},
			{
				type: 'quickSummary',
				title: 'Key Points',
				keyForms: [
					{
						form: '33 letters',
						translation: '10 vowels, 21 consonants, 2 signs',
					},
					{
						form: 'Familiar letters',
						translation: 'А, Е, К, М, О, Т look like Latin',
					},
					{
						form: 'False friends',
						translation: 'В = V, Р = R, Н = N',
					},
					{
						form: 'Unique sounds',
						translation: 'Ы, Ж, Ц, Щ',
					},
				],
			},
			{
				type: 'title',
				text: 'The Cyrillic Alphabet',
			},
			{
				type: 'paragraph',
				text: 'The Russian alphabet has <strong>33 letters</strong> (compared to 26 in English). It was created in the 9th century by the brothers Cyril and Methodius. Many letters look like Latin ones, but watch out for false friends!',
			},
			{
				type: 'conjugationTable',
				title: 'Russian Vowels',
				rows: [
					{
						pronoun: 'А а',
						form: '[a]',
						translation: 'мама (mama) - mother',
						pronunciation: 'as in "father"',
					},
					{
						pronoun: 'Е е',
						form: '[ye]',
						translation: 'это (éta) - this',
						pronunciation: "'ye' at start, 'e' after consonant",
					},
					{
						pronoun: 'И и',
						form: '[i]',
						translation: 'мир (mir) - world',
						pronunciation: 'like "ee" in "see"',
					},
					{
						pronoun: 'О о',
						form: '[o]',
						translation: 'кот (kot) - cat',
						pronunciation: 'as in "more"',
					},
					{
						pronoun: 'У у',
						form: '[oo]',
						translation: 'ум (oom) - mind',
						pronunciation: 'like "oo" in "moon"',
					},
					{
						pronoun: 'Ы ы',
						form: '[y]',
						translation: 'ты (ty) - you',
						pronunciation: '⚠️ Unique sound! Between "i" and "u"',
						mnemonic: 'Say "i" while pulling tongue back',
					},
					{
						pronoun: 'Э э',
						form: '[e]',
						translation: 'это (èta) - this',
						pronunciation: 'as in "met"',
					},
					{
						pronoun: 'Ю ю',
						form: '[yu]',
						translation: 'юг (yug) - south',
						pronunciation: 'like "you"',
					},
					{
						pronoun: 'Я я',
						form: '[ya]',
						translation: 'я (ya) - I',
						pronunciation: 'like "ya" in "yard"',
					},
				],
			},
			{
				type: 'title',
				text: 'Tricky Consonants (False Friends)',
			},
			{
				type: 'usageList',
				title: 'Consonants that look like Latin',
				items: [
					{
						usage: 'В в — pronounced [v]',
						examples: ['вода (voda) - water', 'вино (vino) - wine', 'Владимир (Vladimir)'],
						commonMistake: {
							wrong: 'Pronounced like "B"',
							correct: 'Always pronounced [v] like "van"',
						},
					},
					{
						usage: 'Р р — pronounced [r] rolled',
						examples: ['рыба (ryba) - fish', 'Россия (Rossiya) - Russia', 'работа (rabota) - work'],
						commonMistake: {
							wrong: 'Pronounced like "P"',
							correct: 'It\'s a rolled R [r]',
						},
					},
					{
						usage: 'Н н — pronounced [n]',
						examples: ['нет (niet) - no', 'небо (niebo) - sky', 'наука (naouka) - science'],
					},
					{
						usage: 'С с — pronounced [s]',
						examples: ['собака (sabaka) - dog', 'стол (stol) - table', 'Москва (Maskva) - Moscow'],
					},
					{
						usage: 'Х х — pronounced [kh]',
						examples: ['хлеб (khleb) - bread', 'хорошо (kharacho) - good', 'Чехов (Chekhov)'],
						commonMistake: {
							wrong: 'Pronounced like English "H"',
							correct: 'Like Spanish "J" (jota) or German "CH"',
						},
					},
				],
			},
			{
				type: 'title',
				text: 'Unique Russian Sounds',
			},
			{
				type: 'paragraph',
				text: "These sounds don't exist in English and require practice:",
			},
			{
				type: 'conjugationTable',
				title: 'Special Consonants',
				rows: [
					{
						pronoun: 'Ж ж',
						form: '[zh]',
						translation: 'жить (zhit) - to live',
						pronunciation: 'like "s" in "measure"',
					},
					{
						pronoun: 'Ц ц',
						form: '[ts]',
						translation: 'царь (tsar) - tsar',
						pronunciation: 'like "ts" in "cats"',
					},
					{
						pronoun: 'Ч ч',
						form: '[ch]',
						translation: 'час (chas) - hour',
						pronunciation: 'like "ch" in "church"',
					},
					{
						pronoun: 'Ш ш',
						form: '[sh]',
						translation: 'школа (shkola) - school',
						pronunciation: 'like "sh" in "shop"',
					},
					{
						pronoun: 'Щ щ',
						form: '[shch]',
						translation: 'борщ (borshch) - borscht',
						pronunciation: "long soft 'sh'",
						mnemonic: "Like 'sh' but tongue more forward",
					},
				],
			},
			{
				type: 'mistakesTable',
				title: 'Common Mistakes',
				rows: [
					{
						wrong: 'u is pronounced [oo]',
						correct: 'u (У) is [oo], but y (Ы) is different',
						explanation: "Example: ты [ty] is NOT [too]",
					},
					{
						wrong: "Reading В as 'B'",
						correct: "В is always read as [v]",
						explanation: 'Владимир = [Vladimir], not [Bladimir]',
					},
					{
						wrong: "Reading Р as 'P'",
						correct: 'Р is a rolled R',
						explanation: 'Россия = [Rossiya], not [Possiya]',
					},
					{
						wrong: 'Confusing Н with Latin H',
						correct: 'Cyrillic Н = [n], not [h]',
						explanation: 'нет = [niet], not [hyet]',
					},
				],
			},
			{
				type: 'title',
				text: 'Special Signs',
			},
			{
				type: 'paragraph',
				text: 'The Cyrillic alphabet has two signs that are not letters but modify the pronunciation of consonants:',
			},
			{
				type: 'list',
				items: [
					"<strong>Ь (soft sign)</strong> — makes the preceding consonant softer/palatalized. Ex: мать [mat'] (mother)",
					"<strong>Ъ (hard sign)</strong> — separates syllables. Ex: объект [abyekt] (object)",
				],
			},
			{
				type: 'miniDialogue',
				title: 'Spelling your name in Russian',
				lines: [
					{
						speaker: 'Анна',
						text: 'Как тебя зовут?',
					},
					{
						speaker: 'Марк',
						text: 'Меня зовут Марк. М-А-Р-К.',
					},
					{
						speaker: 'Анна',
						text: 'А меня зовут Анна. А-Н-Н-А.',
					},
				],
				translation: "— What's your name? — My name is Mark. M-A-R-K. — And my name is Anna. A-N-N-A.",
			},
			{
				type: 'relatedTopics',
			},
		],
	},
]

async function insertLessons() {
	console.log('Inserting detailed Russian lessons...\n')

	for (const lesson of lessons) {
		console.log(`Inserting: ${lesson.title_en} (${lesson.slug})`)
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
				blocks_ru: null, // Not creating blocks_ru for now
				status: lesson.status,
			})
			.select()

		if (error) {
			console.error(`Error inserting ${lesson.slug}:`, error)
		} else {
			console.log(`✓ Successfully inserted lesson ID ${data[0].id}\n`)
		}
	}

	console.log('✓ First detailed lesson created!')
	console.log('\n⚠️  IMPORTANT: This is PHASE 1 - NO AUDIO')
	console.log('Creating 2 more lessons next...')
}

insertLessons()
