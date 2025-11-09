const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Final improved MCQ exercises for Russian beautiful places (Part 3)
const improvedExercises = {
	157: { // Халактырский пляж
		title: 'Халактырский пляж',
		questions: [
			{
				id: 1,
				question: 'Где находится Халактырский пляж?',
				question_en: 'Where is Khalaktyrsky Beach located?',
				question_fr: 'Où se trouve la plage de Khalaktyrsky?',
				options: [
					{ key: 'A', text: 'На Камчатке', text_en: 'In Kamchatka', text_fr: 'Au Kamtchatka' },
					{ key: 'B', text: 'На Байкале', text_en: 'At Baikal', text_fr: 'Au Baïkal' },
					{ key: 'C', text: 'В Сочи', text_en: 'In Sochi', text_fr: 'À Sotchi' },
					{ key: 'D', text: 'В Крыму', text_en: 'In Crimea', text_fr: 'En Crimée' }
				],
				correctAnswer: 'A',
				explanation: 'Халактырский пляж расположен на восточном побережье Камчатки, недалеко от Петропавловска-Камчатского.',
				explanation_en: 'Khalaktyrsky Beach is located on the eastern coast of Kamchatka, near Petropavlovsk-Kamchatsky.',
				explanation_fr: 'La plage de Khalaktyrsky est située sur la côte est du Kamtchatka, près de Petropavlovsk-Kamtchatski.'
			},
			{
				id: 2,
				question: 'Какого цвета песок на Халактырском пляже?',
				question_en: 'What color is the sand on Khalaktyrsky Beach?',
				question_fr: 'De quelle couleur est le sable de la plage de Khalaktyrsky?',
				options: [
					{ key: 'A', text: 'Чёрный', text_en: 'Black', text_fr: 'Noir' },
					{ key: 'B', text: 'Белый', text_en: 'White', text_fr: 'Blanc' },
					{ key: 'C', text: 'Золотой', text_en: 'Golden', text_fr: 'Doré' },
					{ key: 'D', text: 'Розовый', text_en: 'Pink', text_fr: 'Rose' }
				],
				correctAnswer: 'A',
				explanation: 'Пляж покрыт чёрным вулканическим песком, что делает его уникальным и красивым.',
				explanation_en: 'The beach is covered with black volcanic sand, which makes it unique and beautiful.',
				explanation_fr: 'La plage est couverte de sable volcanique noir, ce qui la rend unique et belle.'
			},
			{
				id: 3,
				question: 'Почему песок на пляже чёрный?',
				question_en: 'Why is the sand on the beach black?',
				question_fr: 'Pourquoi le sable de la plage est-il noir?',
				options: [
					{ key: 'A', text: 'Из-за вулканического происхождения', text_en: 'Due to volcanic origin', text_fr: 'En raison de son origine volcanique' },
					{ key: 'B', text: 'Из-за загрязнения', text_en: 'Due to pollution', text_fr: 'En raison de la pollution' },
					{ key: 'C', text: 'Из-за чёрных камней', text_en: 'Due to black stones', text_fr: 'En raison de pierres noires' },
					{ key: 'D', text: 'Его покрасили', text_en: 'It was painted', text_fr: 'Il a été peint' }
				],
				correctAnswer: 'A',
				explanation: 'Чёрный цвет песка обусловлен вулканическим происхождением - это измельчённая лава и базальт.',
				explanation_en: 'The black color of the sand is due to its volcanic origin - it is crushed lava and basalt.',
				explanation_fr: 'La couleur noire du sable est due à son origine volcanique - c\'est de la lave et du basalte broyés.'
			},
			{
				id: 4,
				question: 'Какой океан омывает Халактырский пляж?',
				question_en: 'Which ocean washes Khalaktyrsky Beach?',
				question_fr: 'Quel océan baigne la plage de Khalaktyrsky?',
				options: [
					{ key: 'A', text: 'Тихий океан', text_en: 'Pacific Ocean', text_fr: 'Océan Pacifique' },
					{ key: 'B', text: 'Атлантический океан', text_en: 'Atlantic Ocean', text_fr: 'Océan Atlantique' },
					{ key: 'C', text: 'Северный Ледовитый океан', text_en: 'Arctic Ocean', text_fr: 'Océan Arctique' },
					{ key: 'D', text: 'Индийский океан', text_en: 'Indian Ocean', text_fr: 'Océan Indien' }
				],
				correctAnswer: 'A',
				explanation: 'Халактырский пляж выходит к Тихому океану, откуда часто приходят большие волны.',
				explanation_en: 'Khalaktyrsky Beach faces the Pacific Ocean, from where big waves often come.',
				explanation_fr: 'La plage de Khalaktyrsky fait face à l\'océan Pacifique, d\'où proviennent souvent de grandes vagues.'
			},
			{
				id: 5,
				question: 'Какой вид спорта популярен на Халактырском пляже?',
				question_en: 'What sport is popular at Khalaktyrsky Beach?',
				question_fr: 'Quel sport est populaire à la plage de Khalaktyrsky?',
				options: [
					{ key: 'A', text: 'Сёрфинг', text_en: 'Surfing', text_fr: 'Surf' },
					{ key: 'B', text: 'Волейбол', text_en: 'Volleyball', text_fr: 'Volley-ball' },
					{ key: 'C', text: 'Футбол', text_en: 'Football', text_fr: 'Football' },
					{ key: 'D', text: 'Баскетбол', text_en: 'Basketball', text_fr: 'Basketball' }
				],
				correctAnswer: 'A',
				explanation: 'Благодаря высоким волнам Тихого океана, Халактырский пляж стал популярным местом для сёрфинга.',
				explanation_en: 'Thanks to the high waves of the Pacific Ocean, Khalaktyrsky Beach has become a popular place for surfing.',
				explanation_fr: 'Grâce aux grandes vagues de l\'océan Pacifique, la plage de Khalaktyrsky est devenue un lieu populaire pour le surf.'
			}
		]
	},
	158: { // Воттоваара
		title: 'Воттоваара',
		questions: [
			{
				id: 1,
				question: 'Где находится гора Воттоваара?',
				question_en: 'Where is Mount Vottovaara located?',
				question_fr: 'Où se trouve le mont Vottovaara?',
				options: [
					{ key: 'A', text: 'В Карелии', text_en: 'In Karelia', text_fr: 'En Carélie' },
					{ key: 'B', text: 'В Сибири', text_en: 'In Siberia', text_fr: 'En Sibérie' },
					{ key: 'C', text: 'На Урале', text_en: 'In the Urals', text_fr: 'Dans l\'Oural' },
					{ key: 'D', text: 'На Кавказе', text_en: 'In the Caucasus', text_fr: 'Dans le Caucase' }
				],
				correctAnswer: 'A',
				explanation: 'Воттоваара находится в Республике Карелия, это одна из самых высоких точек Западно-Карельской возвышенности.',
				explanation_en: 'Vottovaara is located in the Republic of Karelia, it is one of the highest points of the West Karelian Upland.',
				explanation_fr: 'Vottovaara est situé en République de Carélie, c\'est l\'un des points les plus élevés du plateau de Carélie occidentale.'
			},
			{
				id: 2,
				question: 'Какова высота горы Воттоваара?',
				question_en: 'What is the height of Mount Vottovaara?',
				question_fr: 'Quelle est l\'altitude du mont Vottovaara?',
				options: [
					{ key: 'A', text: '417 метров', text_en: '417 meters', text_fr: '417 mètres' },
					{ key: 'B', text: '1000 метров', text_en: '1000 meters', text_fr: '1000 mètres' },
					{ key: 'C', text: '200 метров', text_en: '200 meters', text_fr: '200 mètres' },
					{ key: 'D', text: '2000 метров', text_en: '2000 meters', text_fr: '2000 mètres' }
				],
				correctAnswer: 'A',
				explanation: 'Высота горы Воттоваара составляет 417,3 метра над уровнем моря.',
				explanation_en: 'The height of Mount Vottovaara is 417.3 meters above sea level.',
				explanation_fr: 'L\'altitude du mont Vottovaara est de 417,3 mètres au-dessus du niveau de la mer.'
			},
			{
				id: 3,
				question: 'Чем известна гора Воттоваара?',
				question_en: 'What is Mount Vottovaara famous for?',
				question_fr: 'Pourquoi le mont Vottovaara est-il célèbre?',
				options: [
					{ key: 'A', text: 'Сейдами и мистической атмосферой', text_en: 'Seids and mystical atmosphere', text_fr: 'Ses seids et son atmosphère mystique' },
					{ key: 'B', text: 'Золотыми месторождениями', text_en: 'Gold deposits', text_fr: 'Ses gisements d\'or' },
					{ key: 'C', text: 'Горнолыжным курортом', text_en: 'Ski resort', text_fr: 'Sa station de ski' },
					{ key: 'D', text: 'Пляжами', text_en: 'Beaches', text_fr: 'Ses plages' }
				],
				correctAnswer: 'A',
				explanation: 'Воттоваара известна своими сейдами (священными камнями саамов) и считается местом силы.',
				explanation_en: 'Vottovaara is known for its seids (sacred stones of the Sami) and is considered a place of power.',
				explanation_fr: 'Vottovaara est connu pour ses seids (pierres sacrées des Samis) et est considéré comme un lieu de pouvoir.'
			},
			{
				id: 4,
				question: 'Что такое сейды?',
				question_en: 'What are seids?',
				question_fr: 'Que sont les seids?',
				options: [
					{ key: 'A', text: 'Камни, установленные на подставках', text_en: 'Stones placed on supports', text_fr: 'Pierres placées sur des supports' },
					{ key: 'B', text: 'Деревянные статуи', text_en: 'Wooden statues', text_fr: 'Statues en bois' },
					{ key: 'C', text: 'Металлические столбы', text_en: 'Metal poles', text_fr: 'Poteaux métalliques' },
					{ key: 'D', text: 'Каменные башни', text_en: 'Stone towers', text_fr: 'Tours en pierre' }
				],
				correctAnswer: 'A',
				explanation: 'Сейды - это большие камни, установленные на небольших камнях-подставках. Саамы считали их священными.',
				explanation_en: 'Seids are large stones placed on small support stones. The Sami considered them sacred.',
				explanation_fr: 'Les seids sont de grandes pierres placées sur de petites pierres de support. Les Samis les considéraient comme sacrés.'
			},
			{
				id: 5,
				question: 'Сколько сейдов насчитывается на горе Воттоваара?',
				question_en: 'How many seids are there on Mount Vottovaara?',
				question_fr: 'Combien de seids y a-t-il sur le mont Vottovaara?',
				options: [
					{ key: 'A', text: 'Более 1600', text_en: 'More than 1600', text_fr: 'Plus de 1600' },
					{ key: 'B', text: 'Около 10', text_en: 'About 10', text_fr: 'Environ 10' },
					{ key: 'C', text: 'Около 100', text_en: 'About 100', text_fr: 'Environ 100' },
					{ key: 'D', text: 'Ни одного', text_en: 'None', text_fr: 'Aucun' }
				],
				correctAnswer: 'A',
				explanation: 'На Воттоваара обнаружено более 1600 сейдов, что делает её одним из крупнейших саамских святилищ.',
				explanation_en: 'More than 1600 seids have been discovered on Vottovaara, making it one of the largest Sami sanctuaries.',
				explanation_fr: 'Plus de 1600 seids ont été découverts sur Vottovaara, ce qui en fait l\'un des plus grands sanctuaires samis.'
			},
			{
				id: 6,
				question: 'Какие необычные деревья растут на Воттоваара?',
				question_en: 'What unusual trees grow on Vottovaara?',
				question_fr: 'Quels arbres inhabituels poussent sur Vottovaara?',
				options: [
					{ key: 'A', text: 'Искривлённые и закрученные деревья', text_en: 'Twisted and curved trees', text_fr: 'Arbres tordus et courbés' },
					{ key: 'B', text: 'Пальмы', text_en: 'Palm trees', text_fr: 'Palmiers' },
					{ key: 'C', text: 'Баобабы', text_en: 'Baobabs', text_fr: 'Baobabs' },
					{ key: 'D', text: 'Обычные ели', text_en: 'Regular firs', text_fr: 'Sapins ordinaires' }
				],
				correctAnswer: 'A',
				explanation: 'На Воттоваара растут искривлённые деревья причудливых форм, что добавляет месту мистичности.',
				explanation_en: 'Twisted trees of bizarre shapes grow on Vottovaara, adding to the mystique of the place.',
				explanation_fr: 'Des arbres tordus aux formes bizarres poussent sur Vottovaara, ajoutant au mystère du lieu.'
			}
		]
	},
	168: { // Плато Укок
		title: 'Плато Укок',
		questions: [
			{
				id: 1,
				question: 'Где находится плато Укок?',
				question_en: 'Where is the Ukok Plateau located?',
				question_fr: 'Où se trouve le plateau d\'Ukok?',
				options: [
					{ key: 'A', text: 'На Алтае', text_en: 'In Altai', text_fr: 'Dans l\'Altaï' },
					{ key: 'B', text: 'В Сибири', text_en: 'In Siberia', text_fr: 'En Sibérie' },
					{ key: 'C', text: 'На Кавказе', text_en: 'In the Caucasus', text_fr: 'Dans le Caucase' },
					{ key: 'D', text: 'На Урале', text_en: 'In the Urals', text_fr: 'Dans l\'Oural' }
				],
				correctAnswer: 'A',
				explanation: 'Плато Укок находится на самом юге Республики Алтай, на границе с Казахстаном, Китаем и Монголией.',
				explanation_en: 'The Ukok Plateau is located in the far south of the Altai Republic, on the border with Kazakhstan, China and Mongolia.',
				explanation_fr: 'Le plateau d\'Ukok est situé à l\'extrême sud de la République de l\'Altaï, à la frontière avec le Kazakhstan, la Chine et la Mongolie.'
			},
			{
				id: 2,
				question: 'Какова средняя высота плато Укок?',
				question_en: 'What is the average height of the Ukok Plateau?',
				question_fr: 'Quelle est l\'altitude moyenne du plateau d\'Ukok?',
				options: [
					{ key: 'A', text: 'Около 2500 метров', text_en: 'About 2500 meters', text_fr: 'Environ 2500 mètres' },
					{ key: 'B', text: 'Около 500 метров', text_en: 'About 500 meters', text_fr: 'Environ 500 mètres' },
					{ key: 'C', text: 'Около 1000 метров', text_en: 'About 1000 meters', text_fr: 'Environ 1000 mètres' },
					{ key: 'D', text: 'Около 5000 метров', text_en: 'About 5000 meters', text_fr: 'Environ 5000 mètres' }
				],
				correctAnswer: 'A',
				explanation: 'Плато Укок расположено на высоте около 2200-2500 метров над уровнем моря.',
				explanation_en: 'The Ukok Plateau is located at an altitude of about 2200-2500 meters above sea level.',
				explanation_fr: 'Le plateau d\'Ukok est situé à une altitude d\'environ 2200-2500 mètres au-dessus du niveau de la mer.'
			},
			{
				id: 3,
				question: 'Какая археологическая находка прославила плато Укок?',
				question_en: 'What archaeological find made the Ukok Plateau famous?',
				question_fr: 'Quelle découverte archéologique a rendu célèbre le plateau d\'Ukok?',
				options: [
					{ key: 'A', text: 'Алтайская принцесса (мумия пазырыкской культуры)', text_en: 'Altai Princess (Pazyryk culture mummy)', text_fr: 'Princesse de l\'Altaï (momie de la culture Pazyryk)' },
					{ key: 'B', text: 'Золотая пирамида', text_en: 'Golden pyramid', text_fr: 'Pyramide d\'or' },
					{ key: 'C', text: 'Древний город', text_en: 'Ancient city', text_fr: 'Ville ancienne' },
					{ key: 'D', text: 'Динозавры', text_en: 'Dinosaurs', text_fr: 'Dinosaures' }
				],
				correctAnswer: 'A',
				explanation: 'В 1993 году на плато Укок была найдена мумия женщины пазырыкской культуры, названная "Алтайской принцессой".',
				explanation_en: 'In 1993, a mummy of a woman from the Pazyryk culture, called the "Altai Princess", was found on the Ukok Plateau.',
				explanation_fr: 'En 1993, une momie d\'une femme de la culture Pazyryk, appelée "Princesse de l\'Altaï", a été trouvée sur le plateau d\'Ukok.'
			},
			{
				id: 4,
				question: 'Что означает слово "Укок" в переводе?',
				question_en: 'What does the word "Ukok" mean in translation?',
				question_fr: 'Que signifie le mot "Ukok" en traduction?',
				options: [
					{ key: 'A', text: 'Массивный, крупный', text_en: 'Massive, large', text_fr: 'Massif, grand' },
					{ key: 'B', text: 'Красивый', text_en: 'Beautiful', text_fr: 'Beau' },
					{ key: 'C', text: 'Опасный', text_en: 'Dangerous', text_fr: 'Dangereux' },
					{ key: 'D', text: 'Холодный', text_en: 'Cold', text_fr: 'Froid' }
				],
				correctAnswer: 'A',
				explanation: 'Слово "Укок" переводится с алтайского языка как "массивный" или "крупный".',
				explanation_en: 'The word "Ukok" translates from the Altai language as "massive" or "large".',
				explanation_fr: 'Le mot "Ukok" se traduit de la langue altaï par "massif" ou "grand".'
			},
			{
				id: 5,
				question: 'Какой статус имеет плато Укок?',
				question_en: 'What status does the Ukok Plateau have?',
				question_fr: 'Quel statut a le plateau d\'Ukok?',
				options: [
					{ key: 'A', text: 'Объект Всемирного наследия ЮНЕСКО', text_en: 'UNESCO World Heritage Site', text_fr: 'Site du patrimoine mondial de l\'UNESCO' },
					{ key: 'B', text: 'Заповедная зона', text_en: 'Nature reserve', text_fr: 'Réserve naturelle' },
					{ key: 'C', text: 'Национальный парк', text_en: 'National park', text_fr: 'Parc national' },
					{ key: 'D', text: 'Нет особого статуса', text_en: 'No special status', text_fr: 'Pas de statut spécial' }
				],
				correctAnswer: 'A',
				explanation: 'Плато Укок входит в объект Всемирного наследия ЮНЕСКО "Золотые горы Алтая".',
				explanation_en: 'The Ukok Plateau is part of the UNESCO World Heritage Site "Golden Mountains of Altai".',
				explanation_fr: 'Le plateau d\'Ukok fait partie du site du patrimoine mondial de l\'UNESCO "Montagnes dorées de l\'Altaï".'
			}
		]
	},
	311: { // Куршская коса
		title: 'Куршская коса',
		questions: [
			{
				id: 1,
				question: 'Где находится Куршская коса?',
				question_en: 'Where is the Curonian Spit located?',
				question_fr: 'Où se trouve la flèche de Courlande?',
				options: [
					{ key: 'A', text: 'В Калининградской области', text_en: 'In the Kaliningrad region', text_fr: 'Dans la région de Kaliningrad' },
					{ key: 'B', text: 'В Крыму', text_en: 'In Crimea', text_fr: 'En Crimée' },
					{ key: 'C', text: 'В Сочи', text_en: 'In Sochi', text_fr: 'À Sotchi' },
					{ key: 'D', text: 'На Байкале', text_en: 'At Baikal', text_fr: 'Au Baïkal' }
				],
				correctAnswer: 'A',
				explanation: 'Куршская коса расположена на побережье Балтийского моря в Калининградской области.',
				explanation_en: 'The Curonian Spit is located on the Baltic Sea coast in the Kaliningrad region.',
				explanation_fr: 'La flèche de Courlande est située sur la côte de la mer Baltique dans la région de Kaliningrad.'
			},
			{
				id: 2,
				question: 'Какова длина Куршской косы?',
				question_en: 'What is the length of the Curonian Spit?',
				question_fr: 'Quelle est la longueur de la flèche de Courlande?',
				options: [
					{ key: 'A', text: '98 километров', text_en: '98 kilometers', text_fr: '98 kilomètres' },
					{ key: 'B', text: '20 километров', text_en: '20 kilometers', text_fr: '20 kilomètres' },
					{ key: 'C', text: '150 километров', text_en: '150 kilometers', text_fr: '150 kilomètres' },
					{ key: 'D', text: '5 километров', text_en: '5 kilometers', text_fr: '5 kilomètres' }
				],
				correctAnswer: 'A',
				explanation: 'Куршская коса протянулась на 98 километров, разделяя Балтийское море и Куршский залив.',
				explanation_en: 'The Curonian Spit stretches for 98 kilometers, separating the Baltic Sea and the Curonian Lagoon.',
				explanation_fr: 'La flèche de Courlande s\'étend sur 98 kilomètres, séparant la mer Baltique et le lagon de Courlande.'
			},
			{
				id: 3,
				question: 'Между какими странами поделена Куршская коса?',
				question_en: 'Between which countries is the Curonian Spit divided?',
				question_fr: 'Entre quels pays la flèche de Courlande est-elle divisée?',
				options: [
					{ key: 'A', text: 'Россия и Литва', text_en: 'Russia and Lithuania', text_fr: 'Russie et Lituanie' },
					{ key: 'B', text: 'Россия и Польша', text_en: 'Russia and Poland', text_fr: 'Russie et Pologne' },
					{ key: 'C', text: 'Россия и Германия', text_en: 'Russia and Germany', text_fr: 'Russie et Allemagne' },
					{ key: 'D', text: 'Только Россия', text_en: 'Only Russia', text_fr: 'Seulement la Russie' }
				],
				correctAnswer: 'A',
				explanation: 'Куршская коса разделена между Россией (Калининградская область) и Литвой.',
				explanation_en: 'The Curonian Spit is divided between Russia (Kaliningrad region) and Lithuania.',
				explanation_fr: 'La flèche de Courlande est divisée entre la Russie (région de Kaliningrad) et la Lituanie.'
			},
			{
				id: 4,
				question: 'Когда Куршская коса была включена в список ЮНЕСКО?',
				question_en: 'When was the Curonian Spit included in the UNESCO list?',
				question_fr: 'Quand la flèche de Courlande a-t-elle été inscrite sur la liste de l\'UNESCO?',
				options: [
					{ key: 'A', text: 'В 2000 году', text_en: 'In 2000', text_fr: 'En 2000' },
					{ key: 'B', text: 'В 1990 году', text_en: 'In 1990', text_fr: 'En 1990' },
					{ key: 'C', text: 'В 2010 году', text_en: 'In 2010', text_fr: 'En 2010' },
					{ key: 'D', text: 'В 1980 году', text_en: 'In 1980', text_fr: 'En 1980' }
				],
				correctAnswer: 'A',
				explanation: 'Куршская коса включена в список Всемирного наследия ЮНЕСКО в 2000 году.',
				explanation_en: 'The Curonian Spit was included in the UNESCO World Heritage List in 2000.',
				explanation_fr: 'La flèche de Courlande a été inscrite sur la liste du patrimoine mondial de l\'UNESCO en 2000.'
			},
			{
				id: 5,
				question: 'Чем известна Куршская коса?',
				question_en: 'What is the Curonian Spit famous for?',
				question_fr: 'Pourquoi la flèche de Courlande est-elle célèbre?',
				options: [
					{ key: 'A', text: 'Дюнами и уникальной природой', text_en: 'Dunes and unique nature', text_fr: 'Ses dunes et sa nature unique' },
					{ key: 'B', text: 'Вулканами', text_en: 'Volcanoes', text_fr: 'Ses volcans' },
					{ key: 'C', text: 'Гейзерами', text_en: 'Geysers', text_fr: 'Ses geysers' },
					{ key: 'D', text: 'Замками', text_en: 'Castles', text_fr: 'Ses châteaux' }
				],
				correctAnswer: 'A',
				explanation: 'Куршская коса известна своими песчаными дюнами, некоторые из которых достигают 60 метров в высоту.',
				explanation_en: 'The Curonian Spit is known for its sand dunes, some of which reach 60 meters in height.',
				explanation_fr: 'La flèche de Courlande est connue pour ses dunes de sable, dont certaines atteignent 60 mètres de hauteur.'
			},
			{
				id: 6,
				question: 'Как называется самая высокая дюна Куршской косы?',
				question_en: 'What is the name of the highest dune of the Curonian Spit?',
				question_fr: 'Comment s\'appelle la plus haute dune de la flèche de Courlande?',
				options: [
					{ key: 'A', text: 'Дюна Эфа', text_en: 'Efa Dune', text_fr: 'Dune d\'Efa' },
					{ key: 'B', text: 'Дюна Пила', text_en: 'Pila Dune', text_fr: 'Dune de Pila' },
					{ key: 'C', text: 'Золотая дюна', text_en: 'Golden Dune', text_fr: 'Dune dorée' },
					{ key: 'D', text: 'Белая дюна', text_en: 'White Dune', text_fr: 'Dune blanche' }
				],
				correctAnswer: 'A',
				explanation: 'Дюна Эфа - одна из самых известных и высоких дюн, названная в честь лесничего Франца Эфы.',
				explanation_en: 'The Efa Dune is one of the most famous and highest dunes, named after forester Franz Efa.',
				explanation_fr: 'La dune d\'Efa est l\'une des dunes les plus célèbres et les plus hautes, nommée d\'après le forestier Franz Efa.'
			}
		]
	},
	312: { // Ростов
		title: 'Ростов',
		questions: [
			{
				id: 1,
				question: 'Как официально называется город Ростов из "Золотого кольца"?',
				question_en: 'What is the official name of the city of Rostov from the "Golden Ring"?',
				question_fr: 'Quel est le nom officiel de la ville de Rostov de "l\'Anneau d\'or"?',
				options: [
					{ key: 'A', text: 'Ростов Великий', text_en: 'Rostov Veliky (Rostov the Great)', text_fr: 'Rostov le Grand' },
					{ key: 'B', text: 'Ростов-на-Дону', text_en: 'Rostov-on-Don', text_fr: 'Rostov-sur-le-Don' },
					{ key: 'C', text: 'Ростов Малый', text_en: 'Rostov Maly', text_fr: 'Rostov le Petit' },
					{ key: 'D', text: 'Ростов Старый', text_en: 'Rostov Stary', text_fr: 'Vieux Rostov' }
				],
				correctAnswer: 'A',
				explanation: 'Ростов Великий - один из древнейших городов России, входит в "Золотое кольцо".',
				explanation_en: 'Rostov Veliky (Rostov the Great) is one of the oldest cities in Russia, part of the "Golden Ring".',
				explanation_fr: 'Rostov le Grand est l\'une des plus anciennes villes de Russie, faisant partie de "l\'Anneau d\'or".'
			},
			{
				id: 2,
				question: 'На берегу какого озера стоит Ростов Великий?',
				question_en: 'On the shore of which lake is Rostov Veliky located?',
				question_fr: 'Sur les rives de quel lac se trouve Rostov le Grand?',
				options: [
					{ key: 'A', text: 'Озеро Неро', text_en: 'Lake Nero', text_fr: 'Lac Nero' },
					{ key: 'B', text: 'Байкал', text_en: 'Baikal', text_fr: 'Baïkal' },
					{ key: 'C', text: 'Ладожское озеро', text_en: 'Lake Ladoga', text_fr: 'Lac Ladoga' },
					{ key: 'D', text: 'Онежское озеро', text_en: 'Lake Onega', text_fr: 'Lac Onega' }
				],
				correctAnswer: 'A',
				explanation: 'Ростов Великий расположен на берегу живописного озера Неро.',
				explanation_en: 'Rostov Veliky is located on the shore of the picturesque Lake Nero.',
				explanation_fr: 'Rostov le Grand est situé sur les rives du pittoresque lac Nero.'
			},
			{
				id: 3,
				question: 'Когда был основан Ростов Великий?',
				question_en: 'When was Rostov Veliky founded?',
				question_fr: 'Quand Rostov le Grand a-t-il été fondé?',
				options: [
					{ key: 'A', text: 'В 862 году', text_en: 'In 862', text_fr: 'En 862' },
					{ key: 'B', text: 'В 1500 году', text_en: 'In 1500', text_fr: 'En 1500' },
					{ key: 'C', text: 'В 1000 году', text_en: 'In 1000', text_fr: 'En 1000' },
					{ key: 'D', text: 'В 1800 году', text_en: 'In 1800', text_fr: 'En 1800' }
				],
				correctAnswer: 'A',
				explanation: 'Ростов Великий впервые упоминается в летописи в 862 году, что делает его одним из древнейших городов России.',
				explanation_en: 'Rostov Veliky is first mentioned in chronicles in 862, making it one of the oldest cities in Russia.',
				explanation_fr: 'Rostov le Grand est mentionné pour la première fois dans les chroniques en 862, ce qui en fait l\'une des plus anciennes villes de Russie.'
			},
			{
				id: 4,
				question: 'Какой кремль находится в Ростове Великом?',
				question_en: 'Which kremlin is in Rostov Veliky?',
				question_fr: 'Quel kremlin se trouve à Rostov le Grand?',
				options: [
					{ key: 'A', text: 'Ростовский кремль (Архиерейский двор)', text_en: 'Rostov Kremlin (Archbishop\'s Court)', text_fr: 'Kremlin de Rostov (Cour de l\'archevêque)' },
					{ key: 'B', text: 'Московский кремль', text_en: 'Moscow Kremlin', text_fr: 'Kremlin de Moscou' },
					{ key: 'C', text: 'Казанский кремль', text_en: 'Kazan Kremlin', text_fr: 'Kremlin de Kazan' },
					{ key: 'D', text: 'Новгородский кремль', text_en: 'Novgorod Kremlin', text_fr: 'Kremlin de Novgorod' }
				],
				correctAnswer: 'A',
				explanation: 'Ростовский кремль (также известный как Архиерейский двор) - выдающийся памятник русской архитектуры XVII века.',
				explanation_en: 'The Rostov Kremlin (also known as the Archbishop\'s Court) is an outstanding monument of 17th-century Russian architecture.',
				explanation_fr: 'Le kremlin de Rostov (également connu sous le nom de Cour de l\'archevêque) est un monument remarquable de l\'architecture russe du XVIIe siècle.'
			},
			{
				id: 5,
				question: 'Чем славится Ростов Великий?',
				question_en: 'What is Rostov Veliky famous for?',
				question_fr: 'Pourquoi Rostov le Grand est-il célèbre?',
				options: [
					{ key: 'A', text: 'Ростовской финифтью (эмалью)', text_en: 'Rostov enamel', text_fr: 'Émail de Rostov' },
					{ key: 'B', text: 'Хохломой', text_en: 'Khokhloma', text_fr: 'Khokhloma' },
					{ key: 'C', text: 'Гжелью', text_en: 'Gzhel', text_fr: 'Gjel' },
					{ key: 'D', text: 'Дымковской игрушкой', text_en: 'Dymkovo toy', text_fr: 'Jouet de Dymkovo' }
				],
				correctAnswer: 'A',
				explanation: 'Ростов Великий славится своей финифтью - искусством росписи по эмали, которое развивается здесь с XVIII века.',
				explanation_en: 'Rostov Veliky is famous for its finift - the art of painting on enamel, which has been developing here since the 18th century.',
				explanation_fr: 'Rostov le Grand est célèbre pour son finift - l\'art de peindre sur émail, qui se développe ici depuis le XVIIIe siècle.'
			},
			{
				id: 6,
				question: 'Что особенного в колоколах Ростовского кремля?',
				question_en: 'What is special about the bells of the Rostov Kremlin?',
				question_fr: 'Qu\'est-ce qui est spécial dans les cloches du kremlin de Rostov?',
				options: [
					{ key: 'A', text: 'Они создают знаменитые ростовские звоны', text_en: 'They create the famous Rostov chimes', text_fr: 'Elles créent les célèbres carillons de Rostov' },
					{ key: 'B', text: 'Они сделаны из золота', text_en: 'They are made of gold', text_fr: 'Elles sont en or' },
					{ key: 'C', text: 'Они самые большие в мире', text_en: 'They are the largest in the world', text_fr: 'Elles sont les plus grandes du monde' },
					{ key: 'D', text: 'Они не звонят', text_en: 'They don\'t ring', text_fr: 'Elles ne sonnent pas' }
				],
				correctAnswer: 'A',
				explanation: 'Ростовские звоны - уникальное явление русской культуры, каждый колокол имеет своё имя и особое звучание.',
				explanation_en: 'Rostov chimes are a unique phenomenon of Russian culture, each bell has its own name and special sound.',
				explanation_fr: 'Les carillons de Rostov sont un phénomène unique de la culture russe, chaque cloche a son propre nom et sonorité.'
			}
		]
	}
}

async function updateExercises() {
	console.log('Updating Russian beautiful-places MCQ exercises (Part 3 - Final)...\n')

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

	console.log('\n✅ All MCQ exercises (Part 3 - Final) updated successfully!')
	console.log('\n🎉 ALL BEAUTIFUL-PLACES MCQ EXERCISES ARE NOW COMPLETE!')
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
