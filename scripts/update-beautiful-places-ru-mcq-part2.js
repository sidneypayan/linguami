const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Continued improved MCQ exercises for Russian beautiful places (Part 2)
const improvedExercises = {
	130: { // Казанский Кремль
		title: 'Казанский Кремль',
		questions: [
			{
				id: 1,
				question: 'В каком городе находится Казанский Кремль?',
				question_en: 'In which city is the Kazan Kremlin located?',
				question_fr: 'Dans quelle ville se trouve le Kremlin de Kazan?',
				options: [
					{ key: 'A', text: 'В Казани', text_en: 'In Kazan', text_fr: 'À Kazan' },
					{ key: 'B', text: 'В Москве', text_en: 'In Moscow', text_fr: 'À Moscou' },
					{ key: 'C', text: 'В Санкт-Петербурге', text_en: 'In St. Petersburg', text_fr: 'À Saint-Pétersbourg' },
					{ key: 'D', text: 'В Нижнем Новгороде', text_en: 'In Nizhny Novgorod', text_fr: 'À Nijni Novgorod' }
				],
				correctAnswer: 'A',
				explanation: 'Казанский Кремль - главная достопримечательность столицы Татарстана, города Казани.',
				explanation_en: 'The Kazan Kremlin is the main attraction of Kazan, the capital of Tatarstan.',
				explanation_fr: 'Le Kremlin de Kazan est la principale attraction de Kazan, capitale du Tatarstan.'
			},
			{
				id: 2,
				question: 'Как называется знаменитая мечеть Казанского Кремля?',
				question_en: 'What is the name of the famous mosque in the Kazan Kremlin?',
				question_fr: 'Comment s\'appelle la mosquée célèbre du Kremlin de Kazan?',
				options: [
					{ key: 'A', text: 'Кул-Шариф', text_en: 'Kul Sharif', text_fr: 'Koul-Charif' },
					{ key: 'B', text: 'Голубая мечеть', text_en: 'Blue Mosque', text_fr: 'Mosquée bleue' },
					{ key: 'C', text: 'Султан Ахмед', text_en: 'Sultan Ahmed', text_fr: 'Sultan Ahmed' },
					{ key: 'D', text: 'Аль-Акса', text_en: 'Al-Aqsa', text_fr: 'Al-Aqsa' }
				],
				correctAnswer: 'A',
				explanation: 'Мечеть Кул-Шариф - главная соборная мечеть Республики Татарстан, восстановлена в 2005 году.',
				explanation_en: 'The Kul Sharif Mosque is the main cathedral mosque of the Republic of Tatarstan, restored in 2005.',
				explanation_fr: 'La mosquée Koul-Charif est la principale mosquée cathédrale de la République du Tatarstan, restaurée en 2005.'
			},
			{
				id: 3,
				question: 'Когда Казанский Кремль был включён в список ЮНЕСКО?',
				question_en: 'When was the Kazan Kremlin included in the UNESCO list?',
				question_fr: 'Quand le Kremlin de Kazan a-t-il été inscrit sur la liste de l\'UNESCO?',
				options: [
					{ key: 'A', text: 'В 2000 году', text_en: 'In 2000', text_fr: 'En 2000' },
					{ key: 'B', text: 'В 1990 году', text_en: 'In 1990', text_fr: 'En 1990' },
					{ key: 'C', text: 'В 2010 году', text_en: 'In 2010', text_fr: 'En 2010' },
					{ key: 'D', text: 'В 1980 году', text_en: 'In 1980', text_fr: 'En 1980' }
				],
				correctAnswer: 'A',
				explanation: 'Казанский Кремль внесён в список Всемирного наследия ЮНЕСКО в 2000 году.',
				explanation_en: 'The Kazan Kremlin was added to the UNESCO World Heritage List in 2000.',
				explanation_fr: 'Le Kremlin de Kazan a été inscrit sur la liste du patrimoine mondial de l\'UNESCO en 2000.'
			},
			{
				id: 4,
				question: 'Что уникального в Казанском Кремле?',
				question_en: 'What is unique about the Kazan Kremlin?',
				question_fr: 'Qu\'est-ce qui est unique dans le Kremlin de Kazan?',
				options: [
					{ key: 'A', text: 'Сочетание православных и мусульманских памятников', text_en: 'Combination of Orthodox and Muslim monuments', text_fr: 'Combinaison de monuments orthodoxes et musulmans' },
					{ key: 'B', text: 'Самый большой кремль в мире', text_en: 'Largest kremlin in the world', text_fr: 'Le plus grand kremlin du monde' },
					{ key: 'C', text: 'Построен из золота', text_en: 'Built of gold', text_fr: 'Construit en or' },
					{ key: 'D', text: 'Самый древний кремль', text_en: 'The oldest kremlin', text_fr: 'Le kremlin le plus ancien' }
				],
				correctAnswer: 'A',
				explanation: 'Казанский Кремль уникален сочетанием православных церквей и мусульманских мечетей на одной территории.',
				explanation_en: 'The Kazan Kremlin is unique in combining Orthodox churches and Muslim mosques in one territory.',
				explanation_fr: 'Le Kremlin de Kazan est unique en combinant des églises orthodoxes et des mosquées musulmanes sur un même territoire.'
			},
			{
				id: 5,
				question: 'Какая падающая башня находится в Казанском Кремле?',
				question_en: 'Which leaning tower is in the Kazan Kremlin?',
				question_fr: 'Quelle tour penchée se trouve dans le Kremlin de Kazan?',
				options: [
					{ key: 'A', text: 'Башня Сююмбике', text_en: 'Suyumbike Tower', text_fr: 'Tour Söyembikä' },
					{ key: 'B', text: 'Пизанская башня', text_en: 'Tower of Pisa', text_fr: 'Tour de Pise' },
					{ key: 'C', text: 'Спасская башня', text_en: 'Spasskaya Tower', text_fr: 'Tour du Sauveur' },
					{ key: 'D', text: 'Кремлёвская башня', text_en: 'Kremlin Tower', text_fr: 'Tour du Kremlin' }
				],
				correctAnswer: 'A',
				explanation: 'Башня Сююмбике наклонена на 1,98 метра и является символом Казани.',
				explanation_en: 'The Suyumbike Tower leans 1.98 meters and is a symbol of Kazan.',
				explanation_fr: 'La tour Söyembikä penche de 1,98 mètre et est un symbole de Kazan.'
			}
		]
	},
	155: { // Ленские столбы
		title: 'Ленские столбы',
		questions: [
			{
				id: 1,
				question: 'На какой реке находятся Ленские столбы?',
				question_en: 'On which river are the Lena Pillars located?',
				question_fr: 'Sur quelle rivière se trouvent les Piliers de la Léna?',
				options: [
					{ key: 'A', text: 'На реке Лена', text_en: 'On the Lena River', text_fr: 'Sur la rivière Léna' },
					{ key: 'B', text: 'На реке Волга', text_en: 'On the Volga River', text_fr: 'Sur la Volga' },
					{ key: 'C', text: 'На реке Енисей', text_en: 'On the Yenisei River', text_fr: 'Sur l\'Ienisseï' },
					{ key: 'D', text: 'На реке Обь', text_en: 'On the Ob River', text_fr: 'Sur l\'Ob' }
				],
				correctAnswer: 'A',
				explanation: 'Ленские столбы - это вертикальные скалы, которые тянутся вдоль берега реки Лены в Якутии.',
				explanation_en: 'The Lena Pillars are vertical rock formations that stretch along the banks of the Lena River in Yakutia.',
				explanation_fr: 'Les Piliers de la Léna sont des formations rocheuses verticales qui s\'étendent le long des rives de la rivière Léna en Iakoutie.'
			},
			{
				id: 2,
				question: 'Какова примерная высота Ленских столбов?',
				question_en: 'What is the approximate height of the Lena Pillars?',
				question_fr: 'Quelle est la hauteur approximative des Piliers de la Léna?',
				options: [
					{ key: 'A', text: 'До 100-220 метров', text_en: 'Up to 100-220 meters', text_fr: 'Jusqu\'à 100-220 mètres' },
					{ key: 'B', text: 'До 30 метров', text_en: 'Up to 30 meters', text_fr: 'Jusqu\'à 30 mètres' },
					{ key: 'C', text: 'До 500 метров', text_en: 'Up to 500 meters', text_fr: 'Jusqu\'à 500 mètres' },
					{ key: 'D', text: 'До 10 метров', text_en: 'Up to 10 meters', text_fr: 'Jusqu\'à 10 mètres' }
				],
				correctAnswer: 'A',
				explanation: 'Скалы Ленских столбов возвышаются над рекой на высоту от 100 до 220 метров.',
				explanation_en: 'The Lena Pillars rise above the river to a height of 100 to 220 meters.',
				explanation_fr: 'Les Piliers de la Léna s\'élèvent au-dessus de la rivière jusqu\'à 100 à 220 mètres.'
			},
			{
				id: 3,
				question: 'Когда Ленские столбы были включены в список ЮНЕСКО?',
				question_en: 'When were the Lena Pillars included in the UNESCO list?',
				question_fr: 'Quand les Piliers de la Léna ont-ils été inscrits sur la liste de l\'UNESCO?',
				options: [
					{ key: 'A', text: 'В 2012 году', text_en: 'In 2012', text_fr: 'En 2012' },
					{ key: 'B', text: 'В 2000 году', text_en: 'In 2000', text_fr: 'En 2000' },
					{ key: 'C', text: 'В 1990 году', text_en: 'In 1990', text_fr: 'En 1990' },
					{ key: 'D', text: 'В 2020 году', text_en: 'In 2020', text_fr: 'En 2020' }
				],
				correctAnswer: 'A',
				explanation: 'Природный парк "Ленские столбы" включён в список Всемирного наследия ЮНЕСКО в 2012 году.',
				explanation_en: 'The Lena Pillars Nature Park was added to the UNESCO World Heritage List in 2012.',
				explanation_fr: 'Le parc naturel des Piliers de la Léna a été inscrit sur la liste du patrimoine mondial de l\'UNESCO en 2012.'
			},
			{
				id: 4,
				question: 'Сколько лет Ленским столбам?',
				question_en: 'How old are the Lena Pillars?',
				question_fr: 'Quel âge ont les Piliers de la Léna?',
				options: [
					{ key: 'A', text: 'Около 400-540 миллионов лет', text_en: 'About 400-540 million years', text_fr: 'Environ 400-540 millions d\'années' },
					{ key: 'B', text: 'Около 1000 лет', text_en: 'About 1000 years', text_fr: 'Environ 1000 ans' },
					{ key: 'C', text: 'Около 1 миллиона лет', text_en: 'About 1 million years', text_fr: 'Environ 1 million d\'années' },
					{ key: 'D', text: 'Около 100 тысяч лет', text_en: 'About 100 thousand years', text_fr: 'Environ 100 mille ans' }
				],
				correctAnswer: 'A',
				explanation: 'Формирование Ленских столбов началось в кембрийском периоде, около 400-540 миллионов лет назад.',
				explanation_en: 'The formation of the Lena Pillars began in the Cambrian period, about 400-540 million years ago.',
				explanation_fr: 'La formation des Piliers de la Léna a commencé à la période cambrienne, il y a environ 400-540 millions d\'années.'
			},
			{
				id: 5,
				question: 'Что интересного находили учёные у Ленских столбов?',
				question_en: 'What interesting things have scientists found at the Lena Pillars?',
				question_fr: 'Qu\'est-ce que les scientifiques ont trouvé d\'intéressant aux Piliers de la Léna?',
				options: [
					{ key: 'A', text: 'Останки древних животных', text_en: 'Remains of ancient animals', text_fr: 'Restes d\'animaux anciens' },
					{ key: 'B', text: 'Золото', text_en: 'Gold', text_fr: 'De l\'or' },
					{ key: 'C', text: 'Алмазы', text_en: 'Diamonds', text_fr: 'Des diamants' },
					{ key: 'D', text: 'Нефть', text_en: 'Oil', text_fr: 'Du pétrole' }
				],
				correctAnswer: 'A',
				explanation: 'В районе Ленских столбов найдены многочисленные останки мамонтов и других древних животных.',
				explanation_en: 'Numerous remains of mammoths and other ancient animals have been found in the area of the Lena Pillars.',
				explanation_fr: 'De nombreux restes de mammouths et d\'autres animaux anciens ont été trouvés dans la zone des Piliers de la Léna.'
			}
		]
	},
	161: { // Мамаев курган
		title: 'Мамаев курган',
		questions: [
			{
				id: 1,
				question: 'В каком городе находится Мамаев курган?',
				question_en: 'In which city is Mamayev Kurgan located?',
				question_fr: 'Dans quelle ville se trouve le Mamayev Kurgan?',
				options: [
					{ key: 'A', text: 'В Волгограде', text_en: 'In Volgograd', text_fr: 'À Volgograd' },
					{ key: 'B', text: 'В Москве', text_en: 'In Moscow', text_fr: 'À Moscou' },
					{ key: 'C', text: 'В Санкт-Петербурге', text_en: 'In St. Petersburg', text_fr: 'À Saint-Pétersbourg' },
					{ key: 'D', text: 'В Казани', text_en: 'In Kazan', text_fr: 'À Kazan' }
				],
				correctAnswer: 'A',
				explanation: 'Мамаев курган находится в Волгограде (бывший Сталинград).',
				explanation_en: 'Mamayev Kurgan is located in Volgograd (formerly Stalingrad).',
				explanation_fr: 'Le Mamayev Kurgan se trouve à Volgograd (anciennement Stalingrad).'
			},
			{
				id: 2,
				question: 'Какая скульптура венчает Мамаев курган?',
				question_en: 'Which sculpture crowns Mamayev Kurgan?',
				question_fr: 'Quelle sculpture couronne le Mamayev Kurgan?',
				options: [
					{ key: 'A', text: 'Родина-мать зовёт!', text_en: 'The Motherland Calls!', text_fr: 'La Mère-Patrie appelle!' },
					{ key: 'B', text: 'Рабочий и колхозница', text_en: 'Worker and Kolkhoz Woman', text_fr: 'L\'Ouvrier et la Kolkhozienne' },
					{ key: 'C', text: 'Медный всадник', text_en: 'The Bronze Horseman', text_fr: 'Le Cavalier de bronze' },
					{ key: 'D', text: 'Памятник Петру I', text_en: 'Monument to Peter I', text_fr: 'Monument à Pierre Ier' }
				],
				correctAnswer: 'A',
				explanation: 'Скульптура "Родина-мать зовёт!" - центральная часть памятника-ансамбля "Героям Сталинградской битвы".',
				explanation_en: 'The sculpture "The Motherland Calls!" is the central part of the memorial complex "To the Heroes of the Battle of Stalingrad".',
				explanation_fr: 'La sculpture "La Mère-Patrie appelle!" est la partie centrale du complexe commémoratif "Aux héros de la bataille de Stalingrad".'
			},
			{
				id: 3,
				question: 'Какова высота скульптуры "Родина-мать зовёт!"?',
				question_en: 'What is the height of the sculpture "The Motherland Calls!"?',
				question_fr: 'Quelle est la hauteur de la sculpture "La Mère-Patrie appelle!"?',
				options: [
					{ key: 'A', text: '85 метров (с мечом)', text_en: '85 meters (with sword)', text_fr: '85 mètres (avec l\'épée)' },
					{ key: 'B', text: '50 метров', text_en: '50 meters', text_fr: '50 mètres' },
					{ key: 'C', text: '100 метров', text_en: '100 meters', text_fr: '100 mètres' },
					{ key: 'D', text: '30 метров', text_en: '30 meters', text_fr: '30 mètres' }
				],
				correctAnswer: 'A',
				explanation: 'Общая высота скульптуры составляет 85 метров, из которых 33 метра - сама статуя, а 52 метра - меч.',
				explanation_en: 'The total height of the sculpture is 85 meters, of which 33 meters is the statue itself, and 52 meters is the sword.',
				explanation_fr: 'La hauteur totale de la sculpture est de 85 mètres, dont 33 mètres pour la statue elle-même et 52 mètres pour l\'épée.'
			},
			{
				id: 4,
				question: 'Какому событию посвящён мемориал на Мамаевом кургане?',
				question_en: 'To which event is the memorial on Mamayev Kurgan dedicated?',
				question_fr: 'À quel événement le mémorial du Mamayev Kurgan est-il dédié?',
				options: [
					{ key: 'A', text: 'Сталинградской битве', text_en: 'The Battle of Stalingrad', text_fr: 'La bataille de Stalingrad' },
					{ key: 'B', text: 'Взятию Берлина', text_en: 'The capture of Berlin', text_fr: 'La prise de Berlin' },
					{ key: 'C', text: 'Обороне Москвы', text_en: 'The defense of Moscow', text_fr: 'La défense de Moscou' },
					{ key: 'D', text: 'Блокаде Ленинграда', text_en: 'The Siege of Leningrad', text_fr: 'Le siège de Léningrad' }
				],
				correctAnswer: 'A',
				explanation: 'Мемориальный комплекс посвящён героям Сталинградской битвы - одной из крупнейших битв Второй мировой войны.',
				explanation_en: 'The memorial complex is dedicated to the heroes of the Battle of Stalingrad - one of the largest battles of World War II.',
				explanation_fr: 'Le complexe commémoratif est dédié aux héros de la bataille de Stalingrad - l\'une des plus grandes batailles de la Seconde Guerre mondiale.'
			},
			{
				id: 5,
				question: 'Кто автор скульптуры "Родина-мать зовёт!"?',
				question_en: 'Who is the author of the sculpture "The Motherland Calls!"?',
				question_fr: 'Qui est l\'auteur de la sculpture "La Mère-Patrie appelle!"?',
				options: [
					{ key: 'A', text: 'Евгений Вучетич', text_en: 'Yevgeny Vuchetich', text_fr: 'Evgueni Voutchetitch' },
					{ key: 'B', text: 'Вера Мухина', text_en: 'Vera Mukhina', text_fr: 'Vera Moukhina' },
					{ key: 'C', text: 'Зураб Церетели', text_en: 'Zurab Tsereteli', text_fr: 'Zourab Tsereteli' },
					{ key: 'D', text: 'Александр Опекушин', text_en: 'Alexander Opekushin', text_fr: 'Alexandre Opekouchine' }
				],
				correctAnswer: 'A',
				explanation: 'Автор монумента - выдающийся советский скульптор Евгений Викторович Вучетич.',
				explanation_en: 'The author of the monument is the outstanding Soviet sculptor Yevgeny Viktorovich Vuchetich.',
				explanation_fr: 'L\'auteur du monument est l\'éminent sculpteur soviétique Evgueni Viktorovitch Voutchetitch.'
			}
		]
	},
	169: { // Красная площадь
		title: 'Красная площадь',
		questions: [
			{
				id: 1,
				question: 'В каком городе находится Красная площадь?',
				question_en: 'In which city is Red Square located?',
				question_fr: 'Dans quelle ville se trouve la Place Rouge?',
				options: [
					{ key: 'A', text: 'В Москве', text_en: 'In Moscow', text_fr: 'À Moscou' },
					{ key: 'B', text: 'В Санкт-Петербурге', text_en: 'In St. Petersburg', text_fr: 'À Saint-Pétersbourg' },
					{ key: 'C', text: 'В Казани', text_en: 'In Kazan', text_fr: 'À Kazan' },
					{ key: 'D', text: 'В Новгороде', text_en: 'In Novgorod', text_fr: 'À Novgorod' }
				],
				correctAnswer: 'A',
				explanation: 'Красная площадь - главная площадь Москвы и один из символов России.',
				explanation_en: 'Red Square is the main square of Moscow and one of the symbols of Russia.',
				explanation_fr: 'La Place Rouge est la place principale de Moscou et l\'un des symboles de la Russie.'
			},
			{
				id: 2,
				question: 'Какой собор находится на Красной площади?',
				question_en: 'Which cathedral is on Red Square?',
				question_fr: 'Quelle cathédrale se trouve sur la Place Rouge?',
				options: [
					{ key: 'A', text: 'Собор Василия Блаженного', text_en: 'St. Basil\'s Cathedral', text_fr: 'Cathédrale Saint-Basile' },
					{ key: 'B', text: 'Исаакиевский собор', text_en: 'St. Isaac\'s Cathedral', text_fr: 'Cathédrale Saint-Isaac' },
					{ key: 'C', text: 'Казанский собор', text_en: 'Kazan Cathedral', text_fr: 'Cathédrale de Kazan' },
					{ key: 'D', text: 'Храм Христа Спасителя', text_en: 'Cathedral of Christ the Saviour', text_fr: 'Cathédrale du Christ-Sauveur' }
				],
				correctAnswer: 'A',
				explanation: 'Собор Василия Блаженного (Покровский собор) - самый узнаваемый символ Москвы с разноцветными куполами.',
				explanation_en: 'St. Basil\'s Cathedral (Cathedral of the Intercession) is the most recognizable symbol of Moscow with its colorful domes.',
				explanation_fr: 'La cathédrale Saint-Basile (Cathédrale de l\'Intercession) est le symbole le plus reconnaissable de Moscou avec ses dômes colorés.'
			},
			{
				id: 3,
				question: 'Какова площадь Красной площади?',
				question_en: 'What is the area of Red Square?',
				question_fr: 'Quelle est la superficie de la Place Rouge?',
				options: [
					{ key: 'A', text: 'Около 24 750 м²', text_en: 'About 24,750 m²', text_fr: 'Environ 24 750 m²' },
					{ key: 'B', text: 'Около 50 000 м²', text_en: 'About 50,000 m²', text_fr: 'Environ 50 000 m²' },
					{ key: 'C', text: 'Около 10 000 м²', text_en: 'About 10,000 m²', text_fr: 'Environ 10 000 m²' },
					{ key: 'D', text: 'Около 5 000 м²', text_en: 'About 5,000 m²', text_fr: 'Environ 5 000 m²' }
				],
				correctAnswer: 'A',
				explanation: 'Площадь Красной площади составляет 24 750 квадратных метров.',
				explanation_en: 'The area of Red Square is 24,750 square meters.',
				explanation_fr: 'La superficie de la Place Rouge est de 24 750 mètres carrés.'
			},
			{
				id: 4,
				question: 'Почему площадь называется "Красная"?',
				question_en: 'Why is the square called "Red"?',
				question_fr: 'Pourquoi la place s\'appelle-t-elle "Rouge"?',
				options: [
					{ key: 'A', text: 'В древнерусском языке "красная" означала "красивая"', text_en: 'In Old Russian "krasnaya" meant "beautiful"', text_fr: 'En vieux russe "krasnaïa" signifiait "belle"' },
					{ key: 'B', text: 'Из-за цвета кремлёвских стен', text_en: 'Because of the color of the Kremlin walls', text_fr: 'À cause de la couleur des murs du Kremlin' },
					{ key: 'C', text: 'В честь коммунистической революции', text_en: 'In honor of the communist revolution', text_fr: 'En l\'honneur de la révolution communiste' },
					{ key: 'D', text: 'Из-за красного гранита на мостовой', text_en: 'Because of the red granite on the pavement', text_fr: 'À cause du granit rouge sur le pavé' }
				],
				correctAnswer: 'A',
				explanation: 'Название происходит от древнерусского значения слова "красный" - "красивый, главный".',
				explanation_en: 'The name comes from the Old Russian meaning of "krasny" - "beautiful, main".',
				explanation_fr: 'Le nom vient de la signification en vieux russe de "krasny" - "beau, principal".'
			},
			{
				id: 5,
				question: 'Когда Красная площадь была включена в список ЮНЕСКО?',
				question_en: 'When was Red Square included in the UNESCO list?',
				question_fr: 'Quand la Place Rouge a-t-elle été inscrite sur la liste de l\'UNESCO?',
				options: [
					{ key: 'A', text: 'В 1990 году', text_en: 'In 1990', text_fr: 'En 1990' },
					{ key: 'B', text: 'В 2000 году', text_en: 'In 2000', text_fr: 'En 2000' },
					{ key: 'C', text: 'В 1980 году', text_en: 'In 1980', text_fr: 'En 1980' },
					{ key: 'D', text: 'В 2010 году', text_en: 'In 2010', text_fr: 'En 2010' }
				],
				correctAnswer: 'A',
				explanation: 'Красная площадь и Московский Кремль включены в список Всемирного наследия ЮНЕСКО в 1990 году.',
				explanation_en: 'Red Square and the Moscow Kremlin were added to the UNESCO World Heritage List in 1990.',
				explanation_fr: 'La Place Rouge et le Kremlin de Moscou ont été inscrits sur la liste du patrimoine mondial de l\'UNESCO en 1990.'
			},
			{
				id: 6,
				question: 'Какой известный универмаг находится на Красной площади?',
				question_en: 'Which famous department store is on Red Square?',
				question_fr: 'Quel grand magasin célèbre se trouve sur la Place Rouge?',
				options: [
					{ key: 'A', text: 'ГУМ', text_en: 'GUM', text_fr: 'GOUM' },
					{ key: 'B', text: 'ЦУМ', text_en: 'TsUM', text_fr: 'TSOUM' },
					{ key: 'C', text: 'Елисеевский', text_en: 'Eliseevsky', text_fr: 'Eliseevski' },
					{ key: 'D', text: 'Петровский пассаж', text_en: 'Petrovsky Passage', text_fr: 'Passage Petrovski' }
				],
				correctAnswer: 'A',
				explanation: 'ГУМ (Государственный универсальный магазин) - исторический торговый центр на Красной площади.',
				explanation_en: 'GUM (State Universal Store) is a historic shopping center on Red Square.',
				explanation_fr: 'GOUM (Magasin Universel d\'État) est un centre commercial historique sur la Place Rouge.'
			}
		]
	},
	172: { // Петергоф
		title: 'Петергоф',
		questions: [
			{
				id: 1,
				question: 'Недалеко от какого города находится Петергоф?',
				question_en: 'Near which city is Peterhof located?',
				question_fr: 'Près de quelle ville se trouve Peterhof?',
				options: [
					{ key: 'A', text: 'Санкт-Петербурга', text_en: 'St. Petersburg', text_fr: 'Saint-Pétersbourg' },
					{ key: 'B', text: 'Москвы', text_en: 'Moscow', text_fr: 'Moscou' },
					{ key: 'C', text: 'Казани', text_en: 'Kazan', text_fr: 'Kazan' },
					{ key: 'D', text: 'Новгорода', text_en: 'Novgorod', text_fr: 'Novgorod' }
				],
				correctAnswer: 'A',
				explanation: 'Петергоф находится на южном берегу Финского залива, в 29 км от Санкт-Петербурга.',
				explanation_en: 'Peterhof is located on the southern shore of the Gulf of Finland, 29 km from St. Petersburg.',
				explanation_fr: 'Peterhof est situé sur la rive sud du golfe de Finlande, à 29 km de Saint-Pétersbourg.'
			},
			{
				id: 2,
				question: 'Кто основал Петергоф?',
				question_en: 'Who founded Peterhof?',
				question_fr: 'Qui a fondé Peterhof?',
				options: [
					{ key: 'A', text: 'Пётр I', text_en: 'Peter I', text_fr: 'Pierre Ier' },
					{ key: 'B', text: 'Екатерина II', text_en: 'Catherine II', text_fr: 'Catherine II' },
					{ key: 'C', text: 'Александр I', text_en: 'Alexander I', text_fr: 'Alexandre Ier' },
					{ key: 'D', text: 'Николай II', text_en: 'Nicholas II', text_fr: 'Nicolas II' }
				],
				correctAnswer: 'A',
				explanation: 'Петергоф был основан императором Петром I в начале XVIII века как парадная летняя резиденция.',
				explanation_en: 'Peterhof was founded by Emperor Peter I in the early 18th century as a ceremonial summer residence.',
				explanation_fr: 'Peterhof a été fondé par l\'empereur Pierre Ier au début du XVIIIe siècle comme résidence d\'été d\'apparat.'
			},
			{
				id: 3,
				question: 'Сколько фонтанов насчитывается в Петергофе?',
				question_en: 'How many fountains are there in Peterhof?',
				question_fr: 'Combien de fontaines y a-t-il à Peterhof?',
				options: [
					{ key: 'A', text: 'Более 150', text_en: 'More than 150', text_fr: 'Plus de 150' },
					{ key: 'B', text: 'Около 20', text_en: 'About 20', text_fr: 'Environ 20' },
					{ key: 'C', text: 'Около 50', text_en: 'About 50', text_fr: 'Environ 50' },
					{ key: 'D', text: 'Менее 10', text_en: 'Less than 10', text_fr: 'Moins de 10' }
				],
				correctAnswer: 'A',
				explanation: 'В Петергофе работает более 150 фонтанов и 4 каскада.',
				explanation_en: 'Peterhof has more than 150 fountains and 4 cascades in operation.',
				explanation_fr: 'Peterhof compte plus de 150 fontaines et 4 cascades en fonctionnement.'
			},
			{
				id: 4,
				question: 'Как называется самый известный фонтан Петергофа?',
				question_en: 'What is the name of the most famous fountain in Peterhof?',
				question_fr: 'Comment s\'appelle la fontaine la plus célèbre de Peterhof?',
				options: [
					{ key: 'A', text: 'Большой каскад с фонтаном "Самсон"', text_en: 'Grand Cascade with "Samson" fountain', text_fr: 'Grande Cascade avec la fontaine "Samson"' },
					{ key: 'B', text: 'Фонтан "Дружбы народов"', text_en: '"Friendship of Peoples" fountain', text_fr: 'Fontaine de "l\'Amitié des peuples"' },
					{ key: 'C', text: 'Фонтан Треви', text_en: 'Trevi Fountain', text_fr: 'Fontaine de Trevi' },
					{ key: 'D', text: 'Фонтан "Нептун"', text_en: '"Neptune" fountain', text_fr: 'Fontaine "Neptune"' }
				],
				correctAnswer: 'A',
				explanation: 'Большой каскад с центральным фонтаном "Самсон, разрывающий пасть льва" - символ Петергофа.',
				explanation_en: 'The Grand Cascade with the central fountain "Samson Tearing the Lion\'s Jaws" is the symbol of Peterhof.',
				explanation_fr: 'La Grande Cascade avec la fontaine centrale "Samson déchirant la gueule du lion" est le symbole de Peterhof.'
			},
			{
				id: 5,
				question: 'За что Петергоф называют "русским Версалем"?',
				question_en: 'Why is Peterhof called the "Russian Versailles"?',
				question_fr: 'Pourquoi Peterhof est-il appelé le "Versailles russe"?',
				options: [
					{ key: 'A', text: 'За роскошь дворцов и фонтанов', text_en: 'For the luxury of palaces and fountains', text_fr: 'Pour le luxe des palais et des fontaines' },
					{ key: 'B', text: 'За размер территории', text_en: 'For the size of the territory', text_fr: 'Pour la taille du territoire' },
					{ key: 'C', text: 'За количество туристов', text_en: 'For the number of tourists', text_fr: 'Pour le nombre de touristes' },
					{ key: 'D', text: 'За климат', text_en: 'For the climate', text_fr: 'Pour le climat' }
				],
				correctAnswer: 'A',
				explanation: 'Петергоф называют "русским Версалем" за роскошь и великолепие дворцово-паркового ансамбля, не уступающего французскому оригиналу.',
				explanation_en: 'Peterhof is called the "Russian Versailles" for the luxury and magnificence of the palace and park ensemble, not inferior to the French original.',
				explanation_fr: 'Peterhof est appelé le "Versailles russe" pour le luxe et la magnificence de l\'ensemble palais-parc, non inférieur à l\'original français.'
			}
		]
	}
}

async function updateExercises() {
	console.log('Updating Russian beautiful-places MCQ exercises (Part 2)...\n')

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

	console.log('\n✅ All MCQ exercises (Part 2) updated successfully!')
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
