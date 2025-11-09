const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Improved MCQ exercises for each Russian beautiful place
const improvedExercises = {
	112: { // Республика Алтай
		title: 'Республика Алтай',
		questions: [
			{
				id: 1,
				question: 'Где находится Республика Алтай?',
				question_en: 'Where is the Altai Republic located?',
				question_fr: 'Où se trouve la République de l\'Altaï?',
				options: [
					{ key: 'A', text: 'На юге Сибири', text_en: 'In southern Siberia', text_fr: 'Au sud de la Sibérie' },
					{ key: 'B', text: 'На Дальнем Востоке', text_en: 'In the Far East', text_fr: 'En Extrême-Orient' },
					{ key: 'C', text: 'В европейской части России', text_en: 'In European Russia', text_fr: 'Dans la partie européenne de la Russie' },
					{ key: 'D', text: 'На Урале', text_en: 'In the Urals', text_fr: 'Dans l\'Oural' }
				],
				correctAnswer: 'A',
				explanation: 'Республика Алтай расположена на юге Западной Сибири, на границе с Казахстаном, Монголией и Китаем.',
				explanation_en: 'The Altai Republic is located in southern Western Siberia, on the border with Kazakhstan, Mongolia and China.',
				explanation_fr: 'La République de l\'Altaï est située au sud de la Sibérie occidentale, à la frontière avec le Kazakhstan, la Mongolie et la Chine.'
			},
			{
				id: 2,
				question: 'Какая гора является высочайшей точкой Алтая?',
				question_en: 'Which mountain is the highest point of Altai?',
				question_fr: 'Quelle montagne est le point culminant de l\'Altaï?',
				options: [
					{ key: 'A', text: 'Белуха (4506 м)', text_en: 'Belukha (4506 m)', text_fr: 'Beloukha (4506 m)' },
					{ key: 'B', text: 'Эльбрус', text_en: 'Elbrus', text_fr: 'Elbrouz' },
					{ key: 'C', text: 'Казбек', text_en: 'Kazbek', text_fr: 'Kazbek' },
					{ key: 'D', text: 'Народная', text_en: 'Narodnaya', text_fr: 'Narodnaya' }
				],
				correctAnswer: 'A',
				explanation: 'Белуха - высочайшая вершина Алтая и Сибири, её высота 4506 метров.',
				explanation_en: 'Belukha is the highest peak of Altai and Siberia, with a height of 4506 meters.',
				explanation_fr: 'Beloukha est le plus haut sommet de l\'Altaï et de la Sibérie, avec une altitude de 4506 mètres.'
			},
			{
				id: 3,
				question: 'Как называется основное население Республики Алтай?',
				question_en: 'What is the main population of the Altai Republic called?',
				question_fr: 'Comment s\'appelle la population principale de la République de l\'Altaï?',
				options: [
					{ key: 'A', text: 'Алтайцы', text_en: 'Altaians', text_fr: 'Altaïens' },
					{ key: 'B', text: 'Буряты', text_en: 'Buryats', text_fr: 'Bouriates' },
					{ key: 'C', text: 'Якуты', text_en: 'Yakuts', text_fr: 'Iakoutes' },
					{ key: 'D', text: 'Тувинцы', text_en: 'Tuvans', text_fr: 'Touvas' }
				],
				correctAnswer: 'A',
				explanation: 'Коренное население - алтайцы, тюркский народ с богатой культурой.',
				explanation_en: 'The indigenous people are the Altaians, a Turkic people with a rich culture.',
				explanation_fr: 'Le peuple autochtone est les Altaïens, un peuple turc avec une riche culture.'
			},
			{
				id: 4,
				question: 'Какой объект в Алтае внесён в список ЮНЕСКО?',
				question_en: 'Which object in Altai is listed by UNESCO?',
				question_fr: 'Quel site de l\'Altaï est inscrit au patrimoine de l\'UNESCO?',
				options: [
					{ key: 'A', text: 'Золотые горы Алтая', text_en: 'Golden Mountains of Altai', text_fr: 'Montagnes dorées de l\'Altaï' },
					{ key: 'B', text: 'Телецкое озеро', text_en: 'Lake Teletskoye', text_fr: 'Lac Teletskoïe' },
					{ key: 'C', text: 'Горно-Алтайск', text_en: 'Gorno-Altaysk', text_fr: 'Gorno-Altaïsk' },
					{ key: 'D', text: 'Чуйский тракт', text_en: 'Chuysky Tract', text_fr: 'Tract Tchouïski' }
				],
				correctAnswer: 'A',
				explanation: 'Золотые горы Алтая включены в список Всемирного наследия ЮНЕСКО с 1998 года.',
				explanation_en: 'The Golden Mountains of Altai have been on the UNESCO World Heritage List since 1998.',
				explanation_fr: 'Les Montagnes dorées de l\'Altaï sont inscrites au patrimoine mondial de l\'UNESCO depuis 1998.'
			},
			{
				id: 5,
				question: 'Какое озеро называют "младшим братом Байкала"?',
				question_en: 'Which lake is called the "little brother of Baikal"?',
				question_fr: 'Quel lac est appelé le "petit frère du Baïkal"?',
				options: [
					{ key: 'A', text: 'Телецкое озеро', text_en: 'Lake Teletskoye', text_fr: 'Lac Teletskoïe' },
					{ key: 'B', text: 'Ладожское озеро', text_en: 'Lake Ladoga', text_fr: 'Lac Ladoga' },
					{ key: 'C', text: 'Онежское озеро', text_en: 'Lake Onega', text_fr: 'Lac Onega' },
					{ key: 'D', text: 'Каспийское море', text_en: 'Caspian Sea', text_fr: 'Mer Caspienne' }
				],
				correctAnswer: 'A',
				explanation: 'Телецкое озеро - одно из глубочайших озёр России, его глубина достигает 325 метров.',
				explanation_en: 'Lake Teletskoye is one of the deepest lakes in Russia, reaching a depth of 325 meters.',
				explanation_fr: 'Le lac Teletskoïe est l\'un des lacs les plus profonds de Russie, atteignant 325 mètres de profondeur.'
			}
		]
	},
	114: { // Озеро Байкал
		title: 'Озеро Байкал',
		questions: [
			{
				id: 1,
				question: 'Сколько лет озеру Байкал?',
				question_en: 'How old is Lake Baikal?',
				question_fr: 'Quel âge a le lac Baïkal?',
				options: [
					{ key: 'A', text: 'Около 25-30 миллионов лет', text_en: 'About 25-30 million years', text_fr: 'Environ 25-30 millions d\'années' },
					{ key: 'B', text: 'Около 1000 лет', text_en: 'About 1000 years', text_fr: 'Environ 1000 ans' },
					{ key: 'C', text: 'Около 100 тысяч лет', text_en: 'About 100 thousand years', text_fr: 'Environ 100 mille ans' },
					{ key: 'D', text: 'Около 1 миллиона лет', text_en: 'About 1 million years', text_fr: 'Environ 1 million d\'années' }
				],
				correctAnswer: 'A',
				explanation: 'Байкал - самое древнее озеро на Земле, его возраст оценивается в 25-30 миллионов лет.',
				explanation_en: 'Baikal is the oldest lake on Earth, estimated to be 25-30 million years old.',
				explanation_fr: 'Le Baïkal est le plus ancien lac de la Terre, estimé à 25-30 millions d\'années.'
			},
			{
				id: 2,
				question: 'Какой процент мировых запасов пресной воды содержится в Байкале?',
				question_en: 'What percentage of the world\'s freshwater is in Baikal?',
				question_fr: 'Quel pourcentage des réserves mondiales d\'eau douce se trouve dans le Baïkal?',
				options: [
					{ key: 'A', text: 'Около 20%', text_en: 'About 20%', text_fr: 'Environ 20%' },
					{ key: 'B', text: 'Около 5%', text_en: 'About 5%', text_fr: 'Environ 5%' },
					{ key: 'C', text: 'Около 50%', text_en: 'About 50%', text_fr: 'Environ 50%' },
					{ key: 'D', text: 'Около 2%', text_en: 'About 2%', text_fr: 'Environ 2%' }
				],
				correctAnswer: 'A',
				explanation: 'Байкал содержит около 20% мировых запасов пресной воды - это больше, чем во всех Великих озёрах Америки вместе взятых.',
				explanation_en: 'Baikal contains about 20% of the world\'s freshwater reserves - more than all the Great Lakes of America combined.',
				explanation_fr: 'Le Baïkal contient environ 20% des réserves mondiales d\'eau douce - plus que tous les Grands Lacs d\'Amérique réunis.'
			},
			{
				id: 3,
				question: 'Какова максимальная глубина Байкала?',
				question_en: 'What is the maximum depth of Baikal?',
				question_fr: 'Quelle est la profondeur maximale du Baïkal?',
				options: [
					{ key: 'A', text: '1642 метра', text_en: '1642 meters', text_fr: '1642 mètres' },
					{ key: 'B', text: '500 метров', text_en: '500 meters', text_fr: '500 mètres' },
					{ key: 'C', text: '3000 метров', text_en: '3000 meters', text_fr: '3000 mètres' },
					{ key: 'D', text: '800 метров', text_en: '800 meters', text_fr: '800 mètres' }
				],
				correctAnswer: 'A',
				explanation: 'Байкал - самое глубокое озеро в мире, его максимальная глубина составляет 1642 метра.',
				explanation_en: 'Baikal is the deepest lake in the world, with a maximum depth of 1642 meters.',
				explanation_fr: 'Le Baïkal est le lac le plus profond du monde, avec une profondeur maximale de 1642 mètres.'
			},
			{
				id: 4,
				question: 'Какое уникальное животное обитает только в Байкале?',
				question_en: 'Which unique animal lives only in Baikal?',
				question_fr: 'Quel animal unique vit uniquement dans le Baïkal?',
				options: [
					{ key: 'A', text: 'Байкальская нерпа', text_en: 'Baikal seal', text_fr: 'Phoque du Baïkal' },
					{ key: 'B', text: 'Белый медведь', text_en: 'Polar bear', text_fr: 'Ours polaire' },
					{ key: 'C', text: 'Пингвин', text_en: 'Penguin', text_fr: 'Pingouin' },
					{ key: 'D', text: 'Морж', text_en: 'Walrus', text_fr: 'Morse' }
				],
				correctAnswer: 'A',
				explanation: 'Байкальская нерпа - единственный в мире пресноводный тюлень, эндемик Байкала.',
				explanation_en: 'The Baikal seal is the world\'s only freshwater seal, endemic to Baikal.',
				explanation_fr: 'Le phoque du Baïkal est le seul phoque d\'eau douce au monde, endémique du Baïkal.'
			},
			{
				id: 5,
				question: 'Сколько рек впадает в Байкал?',
				question_en: 'How many rivers flow into Baikal?',
				question_fr: 'Combien de rivières se jettent dans le Baïkal?',
				options: [
					{ key: 'A', text: 'Более 330', text_en: 'More than 330', text_fr: 'Plus de 330' },
					{ key: 'B', text: 'Только одна', text_en: 'Only one', text_fr: 'Une seule' },
					{ key: 'C', text: 'Около 50', text_en: 'About 50', text_fr: 'Environ 50' },
					{ key: 'D', text: 'Ни одной', text_en: 'None', text_fr: 'Aucune' }
				],
				correctAnswer: 'A',
				explanation: 'В Байкал впадает более 330 рек и ручьёв, а вытекает только одна - Ангара.',
				explanation_en: 'More than 330 rivers and streams flow into Baikal, but only one flows out - the Angara.',
				explanation_fr: 'Plus de 330 rivières et ruisseaux se jettent dans le Baïkal, mais une seule en sort - l\'Angara.'
			},
			{
				id: 6,
				question: 'В каком году Байкал был включён в список ЮНЕСКО?',
				question_en: 'In what year was Baikal included in the UNESCO list?',
				question_fr: 'En quelle année le Baïkal a-t-il été inscrit sur la liste de l\'UNESCO?',
				options: [
					{ key: 'A', text: '1996', text_en: '1996', text_fr: '1996' },
					{ key: 'B', text: '1980', text_en: '1980', text_fr: '1980' },
					{ key: 'C', text: '2000', text_en: '2000', text_fr: '2000' },
					{ key: 'D', text: '1950', text_en: '1950', text_fr: '1950' }
				],
				correctAnswer: 'A',
				explanation: 'Озеро Байкал включено в список Всемирного наследия ЮНЕСКО в 1996 году.',
				explanation_en: 'Lake Baikal was included in the UNESCO World Heritage List in 1996.',
				explanation_fr: 'Le lac Baïkal a été inscrit sur la liste du patrimoine mondial de l\'UNESCO en 1996.'
			}
		]
	},
	115: { // Долина Гейзеров
		title: 'Долина Гейзеров',
		questions: [
			{
				id: 1,
				question: 'Где находится Долина Гейзеров?',
				question_en: 'Where is the Valley of Geysers located?',
				question_fr: 'Où se trouve la Vallée des Geysers?',
				options: [
					{ key: 'A', text: 'На Камчатке', text_en: 'In Kamchatka', text_fr: 'Au Kamtchatka' },
					{ key: 'B', text: 'На Урале', text_en: 'In the Urals', text_fr: 'Dans l\'Oural' },
					{ key: 'C', text: 'В Сибири', text_en: 'In Siberia', text_fr: 'En Sibérie' },
					{ key: 'D', text: 'На Кавказе', text_en: 'In the Caucasus', text_fr: 'Dans le Caucase' }
				],
				correctAnswer: 'A',
				explanation: 'Долина Гейзеров расположена на Камчатке, в Кроноцком государственном биосферном заповеднике.',
				explanation_en: 'The Valley of Geysers is located in Kamchatka, in the Kronotsky State Biosphere Reserve.',
				explanation_fr: 'La Vallée des Geysers est située au Kamtchatka, dans la réserve de biosphère d\'État de Kronotsky.'
			},
			{
				id: 2,
				question: 'Сколько действующих гейзеров в долине?',
				question_en: 'How many active geysers are in the valley?',
				question_fr: 'Combien de geysers actifs y a-t-il dans la vallée?',
				options: [
					{ key: 'A', text: 'Около 90', text_en: 'About 90', text_fr: 'Environ 90' },
					{ key: 'B', text: 'Около 10', text_en: 'About 10', text_fr: 'Environ 10' },
					{ key: 'C', text: 'Более 500', text_en: 'More than 500', text_fr: 'Plus de 500' },
					{ key: 'D', text: 'Только один', text_en: 'Only one', text_fr: 'Un seul' }
				],
				correctAnswer: 'A',
				explanation: 'В Долине Гейзеров насчитывается около 90 гейзеров и множество термальных источников.',
				explanation_en: 'The Valley of Geysers has about 90 geysers and many thermal springs.',
				explanation_fr: 'La Vallée des Geysers compte environ 90 geysers et de nombreuses sources thermales.'
			},
			{
				id: 3,
				question: 'Когда была открыта Долина Гейзеров?',
				question_en: 'When was the Valley of Geysers discovered?',
				question_fr: 'Quand la Vallée des Geysers a-t-elle été découverte?',
				options: [
					{ key: 'A', text: 'В 1941 году', text_en: 'In 1941', text_fr: 'En 1941' },
					{ key: 'B', text: 'В 1800 году', text_en: 'In 1800', text_fr: 'En 1800' },
					{ key: 'C', text: 'В 2000 году', text_en: 'In 2000', text_fr: 'En 2000' },
					{ key: 'D', text: 'В 1917 году', text_en: 'In 1917', text_fr: 'En 1917' }
				],
				correctAnswer: 'A',
				explanation: 'Долина Гейзеров была открыта в апреле 1941 года геологом Татьяной Устиновой.',
				explanation_en: 'The Valley of Geysers was discovered in April 1941 by geologist Tatyana Ustinova.',
				explanation_fr: 'La Vallée des Geysers a été découverte en avril 1941 par la géologue Tatiana Oustinova.'
			},
			{
				id: 4,
				question: 'Как называется самый большой гейзер долины?',
				question_en: 'What is the name of the largest geyser in the valley?',
				question_fr: 'Comment s\'appelle le plus grand geyser de la vallée?',
				options: [
					{ key: 'A', text: 'Великан', text_en: 'Velikan (Giant)', text_fr: 'Velikan (Géant)' },
					{ key: 'B', text: 'Богатырь', text_en: 'Bogatyr (Hero)', text_fr: 'Bogatyr (Héros)' },
					{ key: 'C', text: 'Малый', text_en: 'Maly (Small)', text_fr: 'Maly (Petit)' },
					{ key: 'D', text: 'Первенец', text_en: 'Pervenets (Firstborn)', text_fr: 'Pervenets (Premier-né)' }
				],
				correctAnswer: 'A',
				explanation: 'Гейзер Великан выбрасывает струю воды на высоту до 30 метров.',
				explanation_en: 'The Velikan geyser shoots water up to 30 meters high.',
				explanation_fr: 'Le geyser Velikan projette de l\'eau jusqu\'à 30 mètres de hauteur.'
			},
			{
				id: 5,
				question: 'Можно ли свободно посещать Долину Гейзеров?',
				question_en: 'Can you freely visit the Valley of Geysers?',
				question_fr: 'Peut-on visiter librement la Vallée des Geysers?',
				options: [
					{ key: 'A', text: 'Нет, только организованные экскурсии', text_en: 'No, only organized tours', text_fr: 'Non, seulement des visites organisées' },
					{ key: 'B', text: 'Да, в любое время', text_en: 'Yes, anytime', text_fr: 'Oui, à tout moment' },
					{ key: 'C', text: 'Только зимой', text_en: 'Only in winter', text_fr: 'Seulement en hiver' },
					{ key: 'D', text: 'Посещение полностью запрещено', text_en: 'Visits completely prohibited', text_fr: 'Visites totalement interdites' }
				],
				correctAnswer: 'A',
				explanation: 'Долина Гейзеров находится в заповеднике, посещение возможно только в составе организованных групп на вертолёте.',
				explanation_en: 'The Valley of Geysers is in a nature reserve, visits are only possible as part of organized helicopter tours.',
				explanation_fr: 'La Vallée des Geysers se trouve dans une réserve naturelle, les visites ne sont possibles qu\'en groupes organisés en hélicoptère.'
			}
		]
	},
	120: { // Столбы выветривания
		title: 'Столбы выветривания',
		questions: [
			{
				id: 1,
				question: 'Где находятся Столбы выветривания?',
				question_en: 'Where are the Weathering Pillars located?',
				question_fr: 'Où se trouvent les Piliers de l\'érosion?',
				options: [
					{ key: 'A', text: 'На плато Маньпупунёр', text_en: 'On the Manpupuner plateau', text_fr: 'Sur le plateau Manpupuner' },
					{ key: 'B', text: 'На Кавказе', text_en: 'In the Caucasus', text_fr: 'Dans le Caucase' },
					{ key: 'C', text: 'В Сибири', text_en: 'In Siberia', text_fr: 'En Sibérie' },
					{ key: 'D', text: 'На Урале', text_en: 'In the Urals', text_fr: 'Dans l\'Oural' }
				],
				correctAnswer: 'A',
				explanation: 'Столбы выветривания находятся на плато Маньпупунёр в Республике Коми, на Северном Урале.',
				explanation_en: 'The Weathering Pillars are located on the Manpupuner plateau in the Komi Republic, in the Northern Urals.',
				explanation_fr: 'Les Piliers de l\'érosion se trouvent sur le plateau Manpupuner dans la République des Komis, dans l\'Oural du Nord.'
			},
			{
				id: 2,
				question: 'Сколько каменных столбов находится на плато?',
				question_en: 'How many stone pillars are on the plateau?',
				question_fr: 'Combien de piliers de pierre se trouvent sur le plateau?',
				options: [
					{ key: 'A', text: '7 столбов', text_en: '7 pillars', text_fr: '7 piliers' },
					{ key: 'B', text: '15 столбов', text_en: '15 pillars', text_fr: '15 piliers' },
					{ key: 'C', text: '3 столба', text_en: '3 pillars', text_fr: '3 piliers' },
					{ key: 'D', text: '20 столбов', text_en: '20 pillars', text_fr: '20 piliers' }
				],
				correctAnswer: 'A',
				explanation: 'На плато Маньпупунёр находятся 7 каменных столбов высотой от 30 до 42 метров.',
				explanation_en: 'There are 7 stone pillars on the Manpupuner plateau, ranging from 30 to 42 meters in height.',
				explanation_fr: 'Il y a 7 piliers de pierre sur le plateau Manpupuner, d\'une hauteur de 30 à 42 mètres.'
			},
			{
				id: 3,
				question: 'Как образовались эти столбы?',
				question_en: 'How were these pillars formed?',
				question_fr: 'Comment ces piliers se sont-ils formés?',
				options: [
					{ key: 'A', text: 'В результате выветривания гор', text_en: 'As a result of mountain weathering', text_fr: 'Par l\'érosion des montagnes' },
					{ key: 'B', text: 'Их построили люди', text_en: 'They were built by people', text_fr: 'Ils ont été construits par des humains' },
					{ key: 'C', text: 'Из-за вулканической активности', text_en: 'Due to volcanic activity', text_fr: 'En raison de l\'activité volcanique' },
					{ key: 'D', text: 'Упали метеориты', text_en: 'Meteorites fell', text_fr: 'Des météorites sont tombées' }
				],
				correctAnswer: 'A',
				explanation: 'Столбы образовались около 200 миллионов лет назад в результате выветривания древних гор.',
				explanation_en: 'The pillars were formed about 200 million years ago as a result of the weathering of ancient mountains.',
				explanation_fr: 'Les piliers se sont formés il y a environ 200 millions d\'années par l\'érosion d\'anciennes montagnes.'
			},
			{
				id: 4,
				question: 'Что означает название "Маньпупунёр" на языке манси?',
				question_en: 'What does "Manpupuner" mean in the Mansi language?',
				question_fr: 'Que signifie "Manpupuner" en langue mansi?',
				options: [
					{ key: 'A', text: 'Малая гора идолов', text_en: 'Small mountain of idols', text_fr: 'Petite montagne des idoles' },
					{ key: 'B', text: 'Большой камень', text_en: 'Big stone', text_fr: 'Grande pierre' },
					{ key: 'C', text: 'Семь братьев', text_en: 'Seven brothers', text_fr: 'Sept frères' },
					{ key: 'D', text: 'Священное место', text_en: 'Sacred place', text_fr: 'Lieu sacré' }
				],
				correctAnswer: 'A',
				explanation: 'Маньпупунёр переводится как "Малая гора идолов" - манси считали эти столбы священными.',
				explanation_en: 'Manpupuner translates as "Small mountain of idols" - the Mansi considered these pillars sacred.',
				explanation_fr: 'Manpupuner se traduit par "Petite montagne des idoles" - les Mansis considéraient ces piliers comme sacrés.'
			},
			{
				id: 5,
				question: 'Почему столбы выветривания называют "чудом России"?',
				question_en: 'Why are the weathering pillars called a "wonder of Russia"?',
				question_fr: 'Pourquoi les piliers de l\'érosion sont-ils appelés une "merveille de Russie"?',
				options: [
					{ key: 'A', text: 'Они победили в конкурсе "7 чудес России"', text_en: 'They won the "7 Wonders of Russia" competition', text_fr: 'Ils ont gagné le concours "7 merveilles de Russie"' },
					{ key: 'B', text: 'Это самые высокие горы', text_en: 'They are the highest mountains', text_fr: 'Ce sont les plus hautes montagnes' },
					{ key: 'C', text: 'Они светятся ночью', text_en: 'They glow at night', text_fr: 'Ils brillent la nuit' },
					{ key: 'D', text: 'Там живут редкие животные', text_en: 'Rare animals live there', text_fr: 'Des animaux rares y vivent' }
				],
				correctAnswer: 'A',
				explanation: 'В 2008 году Столбы выветривания победили в конкурсе "7 чудес России".',
				explanation_en: 'In 2008, the Weathering Pillars won the "7 Wonders of Russia" competition.',
				explanation_fr: 'En 2008, les Piliers de l\'érosion ont gagné le concours "7 merveilles de Russie".'
			}
		]
	},
	121: { // Эльбрус
		title: 'Эльбрус',
		questions: [
			{
				id: 1,
				question: 'Какова высота Эльбруса?',
				question_en: 'What is the height of Elbrus?',
				question_fr: 'Quelle est l\'altitude de l\'Elbrouz?',
				options: [
					{ key: 'A', text: '5642 метра', text_en: '5642 meters', text_fr: '5642 mètres' },
					{ key: 'B', text: '4000 метров', text_en: '4000 meters', text_fr: '4000 mètres' },
					{ key: 'C', text: '8848 метров', text_en: '8848 meters', text_fr: '8848 mètres' },
					{ key: 'D', text: '3000 метров', text_en: '3000 meters', text_fr: '3000 mètres' }
				],
				correctAnswer: 'A',
				explanation: 'Эльбрус - высочайшая вершина России и Европы, её высота составляет 5642 метра.',
				explanation_en: 'Elbrus is the highest peak in Russia and Europe, with a height of 5642 meters.',
				explanation_fr: 'L\'Elbrouz est le plus haut sommet de Russie et d\'Europe, avec une altitude de 5642 mètres.'
			},
			{
				id: 2,
				question: 'Сколько вершин у Эльбруса?',
				question_en: 'How many peaks does Elbrus have?',
				question_fr: 'Combien de sommets l\'Elbrouz a-t-il?',
				options: [
					{ key: 'A', text: 'Две вершины', text_en: 'Two peaks', text_fr: 'Deux sommets' },
					{ key: 'B', text: 'Одна вершина', text_en: 'One peak', text_fr: 'Un sommet' },
					{ key: 'C', text: 'Три вершины', text_en: 'Three peaks', text_fr: 'Trois sommets' },
					{ key: 'D', text: 'Пять вершин', text_en: 'Five peaks', text_fr: 'Cinq sommets' }
				],
				correctAnswer: 'A',
				explanation: 'Эльбрус - двуглавая гора. Западная вершина - 5642 м, восточная - 5621 м.',
				explanation_en: 'Elbrus is a two-peaked mountain. The western peak is 5642 m, the eastern is 5621 m.',
				explanation_fr: 'L\'Elbrouz est une montagne à deux sommets. Le sommet ouest est à 5642 m, l\'est à 5621 m.'
			},
			{
				id: 3,
				question: 'Что представляет собой Эльбрус?',
				question_en: 'What is Elbrus?',
				question_fr: 'Qu\'est-ce que l\'Elbrouz?',
				options: [
					{ key: 'A', text: 'Потухший вулкан', text_en: 'Extinct volcano', text_fr: 'Volcan éteint' },
					{ key: 'B', text: 'Действующий вулкан', text_en: 'Active volcano', text_fr: 'Volcan actif' },
					{ key: 'C', text: 'Обычная гора', text_en: 'Regular mountain', text_fr: 'Montagne ordinaire' },
					{ key: 'D', text: 'Ледник', text_en: 'Glacier', text_fr: 'Glacier' }
				],
				correctAnswer: 'A',
				explanation: 'Эльбрус - это потухший вулкан, последнее извержение было около 2000 лет назад.',
				explanation_en: 'Elbrus is an extinct volcano, the last eruption was about 2000 years ago.',
				explanation_fr: 'L\'Elbrouz est un volcan éteint, la dernière éruption a eu lieu il y a environ 2000 ans.'
			},
			{
				id: 4,
				question: 'Где находится Эльбрус?',
				question_en: 'Where is Elbrus located?',
				question_fr: 'Où se trouve l\'Elbrouz?',
				options: [
					{ key: 'A', text: 'На Кавказе', text_en: 'In the Caucasus', text_fr: 'Dans le Caucase' },
					{ key: 'B', text: 'На Урале', text_en: 'In the Urals', text_fr: 'Dans l\'Oural' },
					{ key: 'C', text: 'В Сибири', text_en: 'In Siberia', text_fr: 'En Sibérie' },
					{ key: 'D', text: 'На Алтае', text_en: 'In Altai', text_fr: 'Dans l\'Altaï' }
				],
				correctAnswer: 'A',
				explanation: 'Эльбрус расположен на Кавказе, на границе Кабардино-Балкарии и Карачаево-Черкесии.',
				explanation_en: 'Elbrus is located in the Caucasus, on the border of Kabardino-Balkaria and Karachay-Cherkessia.',
				explanation_fr: 'L\'Elbrouz est situé dans le Caucase, à la frontière entre la Kabardino-Balkarie et la Karatchaïévo-Tcherkessie.'
			},
			{
				id: 5,
				question: 'Сколько ледников на Эльбрусе?',
				question_en: 'How many glaciers are on Elbrus?',
				question_fr: 'Combien de glaciers y a-t-il sur l\'Elbrouz?',
				options: [
					{ key: 'A', text: 'Более 70', text_en: 'More than 70', text_fr: 'Plus de 70' },
					{ key: 'B', text: 'Нет ледников', text_en: 'No glaciers', text_fr: 'Pas de glaciers' },
					{ key: 'C', text: 'Около 10', text_en: 'About 10', text_fr: 'Environ 10' },
					{ key: 'D', text: 'Только один', text_en: 'Only one', text_fr: 'Un seul' }
				],
				correctAnswer: 'A',
				explanation: 'На склонах Эльбруса расположено более 70 ледников общей площадью около 145 км².',
				explanation_en: 'There are more than 70 glaciers on the slopes of Elbrus with a total area of about 145 km².',
				explanation_fr: 'Il y a plus de 70 glaciers sur les pentes de l\'Elbrouz avec une superficie totale d\'environ 145 km².'
			}
		]
	}
}

async function updateExercises() {
	console.log('Updating Russian beautiful-places MCQ exercises with better questions...\n')

	for (const [materialId, exerciseData] of Object.entries(improvedExercises)) {
		console.log(`\nProcessing ${exerciseData.title} (material #${materialId})...`)

		// Find existing MCQ exercise
		const { data: existingExercise, error: findError } = await supabase
			.from('exercises')
			.select('*')
			.eq('material_id', materialId)
			.eq('type', 'mcq')
			.single()

		if (findError || !existingExercise) {
			console.log(`  ❌ MCQ exercise not found`)
			continue
		}

		// Update with new questions
		const { error: updateError } = await supabase
			.from('exercises')
			.update({
				data: { questions: exerciseData.questions }
			})
			.eq('id', existingExercise.id)

		if (updateError) {
			console.log(`  ❌ Error updating: ${updateError.message}`)
		} else {
			console.log(`  ✅ Updated with ${exerciseData.questions.length} questions`)
		}
	}

	console.log('\n✅ All MCQ exercises updated successfully!')
}

updateExercises()
	.then(() => {
		console.log('\nProcess completed!')
		process.exit(0)
	})
	.catch(err => {
		console.error('Error:', err)
		process.exit(1)
	})
