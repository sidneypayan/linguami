const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Improved MCQ exercises for each French beautiful place
const improvedExercises = {
	479: { // Le Mont-Saint-Michel
		title: 'Le Mont-Saint-Michel',
		questions: [
			{
				id: 1,
				question: 'Dans quelle région française se trouve le Mont-Saint-Michel ?',
				question_en: 'In which French region is Mont-Saint-Michel located?',
				question_ru: 'В каком французском регионе находится Мон-Сен-Мишель?',
				options: [
					{ key: 'A', text: 'En Normandie', text_en: 'In Normandy', text_ru: 'В Нормандии' },
					{ key: 'B', text: 'En Bretagne', text_en: 'In Brittany', text_ru: 'В Бретани' },
					{ key: 'C', text: 'En Provence', text_en: 'In Provence', text_ru: 'В Провансе' },
					{ key: 'D', text: 'En Alsace', text_en: 'In Alsace', text_ru: 'В Эльзасе' }
				],
				correctAnswer: 'A',
				explanation: 'Le Mont-Saint-Michel se situe en Normandie, à la limite de la Bretagne.',
				explanation_en: 'Mont-Saint-Michel is located in Normandy, at the border with Brittany.',
				explanation_ru: 'Мон-Сен-Мишель расположен в Нормандии, на границе с Бретанью.'
			},
			{
				id: 2,
				question: 'Quelle est la particularité géographique du Mont-Saint-Michel ?',
				question_en: 'What is the geographical feature of Mont-Saint-Michel?',
				question_ru: 'Какова географическая особенность Мон-Сен-Мишель?',
				options: [
					{ key: 'A', text: 'C\'est une île rocheuse', text_en: 'It\'s a rocky island', text_ru: 'Это скалистый остров' },
					{ key: 'B', text: 'C\'est une montagne', text_en: 'It\'s a mountain', text_ru: 'Это гора' },
					{ key: 'C', text: 'C\'est une falaise', text_en: 'It\'s a cliff', text_ru: 'Это утес' },
					{ key: 'D', text: 'C\'est un volcan', text_en: 'It\'s a volcano', text_ru: 'Это вулкан' }
				],
				correctAnswer: 'A',
				explanation: 'Le Mont-Saint-Michel est une île rocheuse granitique située dans une baie.',
				explanation_en: 'Mont-Saint-Michel is a rocky granite island located in a bay.',
				explanation_ru: 'Мон-Сен-Мишель - это скалистый гранитный остров в бухте.'
			},
			{
				id: 3,
				question: 'Quel type de monument se trouve au sommet du Mont-Saint-Michel ?',
				question_en: 'What type of monument is at the top of Mont-Saint-Michel?',
				question_ru: 'Какой тип памятника находится на вершине Мон-Сен-Мишель?',
				options: [
					{ key: 'A', text: 'Une abbaye', text_en: 'An abbey', text_ru: 'Аббатство' },
					{ key: 'B', text: 'Un château fort', text_en: 'A fortress', text_ru: 'Крепость' },
					{ key: 'C', text: 'Un phare', text_en: 'A lighthouse', text_ru: 'Маяк' },
					{ key: 'D', text: 'Un palais', text_en: 'A palace', text_ru: 'Дворец' }
				],
				correctAnswer: 'A',
				explanation: 'L\'abbaye du Mont-Saint-Michel, construite à partir du Xe siècle, domine l\'île.',
				explanation_en: 'The Abbey of Mont-Saint-Michel, built from the 10th century, dominates the island.',
				explanation_ru: 'Аббатство Мон-Сен-Мишель, построенное с X века, возвышается над островом.'
			},
			{
				id: 4,
				question: 'Quel phénomène naturel est remarquable au Mont-Saint-Michel ?',
				question_en: 'What natural phenomenon is remarkable at Mont-Saint-Michel?',
				question_ru: 'Какое природное явление примечательно в Мон-Сен-Мишель?',
				options: [
					{ key: 'A', text: 'Les grandes marées', text_en: 'The great tides', text_ru: 'Большие приливы' },
					{ key: 'B', text: 'Les aurores boréales', text_en: 'The northern lights', text_ru: 'Северное сияние' },
					{ key: 'C', text: 'Les geysers', text_en: 'The geysers', text_ru: 'Гейзеры' },
					{ key: 'D', text: 'Les tremblements de terre', text_en: 'The earthquakes', text_ru: 'Землетрясения' }
				],
				correctAnswer: 'A',
				explanation: 'La baie du Mont-Saint-Michel connaît les plus grandes marées d\'Europe continentale.',
				explanation_en: 'The bay of Mont-Saint-Michel experiences the greatest tides in continental Europe.',
				explanation_ru: 'Бухта Мон-Сен-Мишель известна самыми большими приливами в континентальной Европе.'
			},
			{
				id: 5,
				question: 'Depuis quand le Mont-Saint-Michel est-il classé au patrimoine mondial de l\'UNESCO ?',
				question_en: 'Since when has Mont-Saint-Michel been a UNESCO World Heritage site?',
				question_ru: 'С какого года Мон-Сен-Мишель включен в список всемирного наследия ЮНЕСКО?',
				options: [
					{ key: 'A', text: '1979', text_en: '1979', text_ru: '1979' },
					{ key: 'B', text: '1995', text_en: '1995', text_ru: '1995' },
					{ key: 'C', text: '2000', text_en: '2000', text_ru: '2000' },
					{ key: 'D', text: '1850', text_en: '1850', text_ru: '1850' }
				],
				correctAnswer: 'A',
				explanation: 'Le Mont-Saint-Michel et sa baie sont inscrits au patrimoine mondial de l\'UNESCO depuis 1979.',
				explanation_en: 'Mont-Saint-Michel and its bay have been a UNESCO World Heritage site since 1979.',
				explanation_ru: 'Мон-Сен-Мишель и его бухта внесены в список ЮНЕСКО с 1979 года.'
			}
		]
	},
	480: { // Étretat
		title: 'Étretat',
		questions: [
			{
				id: 1,
				question: 'Où se trouve Étretat ?',
				question_en: 'Where is Étretat located?',
				question_ru: 'Где находится Этрета?',
				options: [
					{ key: 'A', text: 'En Normandie, sur la côte d\'Albâtre', text_en: 'In Normandy, on the Alabaster Coast', text_ru: 'В Нормандии, на Алебастровом побережье' },
					{ key: 'B', text: 'Sur la Côte d\'Azur', text_en: 'On the French Riviera', text_ru: 'На Лазурном берегу' },
					{ key: 'C', text: 'En Bretagne', text_en: 'In Brittany', text_ru: 'В Бретани' },
					{ key: 'D', text: 'En Corse', text_en: 'In Corsica', text_ru: 'На Корсике' }
				],
				correctAnswer: 'A',
				explanation: 'Étretat est une commune située en Normandie, célèbre pour ses falaises de craie blanche.',
				explanation_en: 'Étretat is a commune in Normandy, famous for its white chalk cliffs.',
				explanation_ru: 'Этрета - коммуна в Нормандии, известная своими белыми меловыми скалами.'
			},
			{
				id: 2,
				question: 'Quelle est la principale caractéristique naturelle d\'Étretat ?',
				question_en: 'What is the main natural feature of Étretat?',
				question_ru: 'Какова главная природная особенность Этрета?',
				options: [
					{ key: 'A', text: 'Ses falaises et arches de craie', text_en: 'Its chalk cliffs and arches', text_ru: 'Меловые скалы и арки' },
					{ key: 'B', text: 'Ses volcans', text_en: 'Its volcanoes', text_ru: 'Вулканы' },
					{ key: 'C', text: 'Ses forêts tropicales', text_en: 'Its tropical forests', text_ru: 'Тропические леса' },
					{ key: 'D', text: 'Ses dunes de sable', text_en: 'Its sand dunes', text_ru: 'Песчаные дюны' }
				],
				correctAnswer: 'A',
				explanation: 'Étretat est célèbre pour ses spectaculaires falaises de craie blanche et ses arches naturelles.',
				explanation_en: 'Étretat is famous for its spectacular white chalk cliffs and natural arches.',
				explanation_ru: 'Этрета знаменит своими впечатляющими белыми меловыми скалами и природными арками.'
			},
			{
				id: 3,
				question: 'Comment s\'appellent les trois arches naturelles d\'Étretat ?',
				question_en: 'What are the names of the three natural arches of Étretat?',
				question_ru: 'Как называются три природные арки Этрета?',
				options: [
					{ key: 'A', text: 'Porte d\'Aval, Porte d\'Amont et Manneporte', text_en: 'Porte d\'Aval, Porte d\'Amont and Manneporte', text_ru: 'Порт д\'Аваль, Порт д\'Амон и Маннпорт' },
					{ key: 'B', text: 'Arc de Triomphe, Arc-en-ciel et Grande Arche', text_en: 'Arc de Triomphe, Rainbow Arch and Grande Arche', text_ru: 'Триумфальная арка, Радужная арка и Большая арка' },
					{ key: 'C', text: 'Première, Deuxième et Troisième Porte', text_en: 'First, Second and Third Gate', text_ru: 'Первые, Вторые и Третьи ворота' },
					{ key: 'D', text: 'Arche Nord, Sud et Centrale', text_en: 'North, South and Central Arch', text_ru: 'Северная, Южная и Центральная арка' }
				],
				correctAnswer: 'A',
				explanation: 'Les trois arches emblématiques d\'Étretat sont la Porte d\'Aval, la Porte d\'Amont et la Manneporte.',
				explanation_en: 'The three iconic arches of Étretat are Porte d\'Aval, Porte d\'Amont and Manneporte.',
				explanation_ru: 'Три знаковые арки Этрета - это Порт д\'Аваль, Порт д\'Амон и Маннпорт.'
			},
			{
				id: 4,
				question: 'Quel célèbre peintre impressionniste a immortalisé les falaises d\'Étretat ?',
				question_en: 'Which famous Impressionist painter immortalized the cliffs of Étretat?',
				question_ru: 'Какой знаменитый художник-импрессионист запечатлел скалы Этрета?',
				options: [
					{ key: 'A', text: 'Claude Monet', text_en: 'Claude Monet', text_ru: 'Клод Моне' },
					{ key: 'B', text: 'Pablo Picasso', text_en: 'Pablo Picasso', text_ru: 'Пабло Пикассо' },
					{ key: 'C', text: 'Vincent van Gogh', text_en: 'Vincent van Gogh', text_ru: 'Винсент ван Гог' },
					{ key: 'D', text: 'Auguste Renoir', text_en: 'Auguste Renoir', text_ru: 'Огюст Ренуар' }
				],
				correctAnswer: 'A',
				explanation: 'Claude Monet a réalisé plus de 50 tableaux des falaises d\'Étretat entre 1883 et 1886.',
				explanation_en: 'Claude Monet painted more than 50 canvases of the Étretat cliffs between 1883 and 1886.',
				explanation_ru: 'Клод Моне создал более 50 картин со скалами Этрета между 1883 и 1886 годами.'
			},
			{
				id: 5,
				question: 'Qu\'est-ce que l\'Aiguille d\'Étretat ?',
				question_en: 'What is the Aiguille d\'Étretat?',
				question_ru: 'Что такое Игла Этрета?',
				options: [
					{ key: 'A', text: 'Un rocher en forme d\'aiguille de 70m de haut', text_en: 'A needle-shaped rock 70m high', text_ru: 'Скала в форме иглы высотой 70м' },
					{ key: 'B', text: 'Un phare', text_en: 'A lighthouse', text_ru: 'Маяк' },
					{ key: 'C', text: 'Une église gothique', text_en: 'A Gothic church', text_ru: 'Готическая церковь' },
					{ key: 'D', text: 'Un monument commémoratif', text_en: 'A memorial monument', text_ru: 'Мемориальный памятник' }
				],
				correctAnswer: 'A',
				explanation: 'L\'Aiguille est un rocher en forme d\'obélisque de 70 mètres de haut qui se dresse devant la Porte d\'Aval.',
				explanation_en: 'The Aiguille is an obelisk-shaped rock 70 meters high that stands in front of Porte d\'Aval.',
				explanation_ru: 'Игла - это скала в форме обелиска высотой 70 метров перед воротами Порт д\'Аваль.'
			},
			{
				id: 6,
				question: 'Quelle activité historique était importante à Étretat ?',
				question_en: 'What historical activity was important in Étretat?',
				question_ru: 'Какая историческая деятельность была важна в Этрета?',
				options: [
					{ key: 'A', text: 'La pêche', text_en: 'Fishing', text_ru: 'Рыболовство' },
					{ key: 'B', text: 'L\'extraction du sel', text_en: 'Salt extraction', text_ru: 'Добыча соли' },
					{ key: 'C', text: 'La fabrication de fromage', text_en: 'Cheese making', text_ru: 'Производство сыра' },
					{ key: 'D', text: 'La production de vin', text_en: 'Wine production', text_ru: 'Виноделие' }
				],
				correctAnswer: 'A',
				explanation: 'Étretat était traditionnellement un village de pêcheurs avant de devenir une station balnéaire.',
				explanation_en: 'Étretat was traditionally a fishing village before becoming a seaside resort.',
				explanation_ru: 'Этрета традиционно была рыбацкой деревней до того, как стала морским курортом.'
			}
		]
	},
	481: { // Le plateau de Valensole
		title: 'Le plateau de valensole',
		questions: [
			{
				id: 1,
				question: 'Dans quelle région se trouve le plateau de Valensole ?',
				question_en: 'In which region is the Valensole plateau located?',
				question_ru: 'В каком регионе находится плато Валансоль?',
				options: [
					{ key: 'A', text: 'En Provence-Alpes-Côte d\'Azur', text_en: 'In Provence-Alpes-Côte d\'Azur', text_ru: 'В Провансе-Альпах-Лазурном берегу' },
					{ key: 'B', text: 'En Normandie', text_en: 'In Normandy', text_ru: 'В Нормандии' },
					{ key: 'C', text: 'En Bretagne', text_en: 'In Brittany', text_ru: 'В Бретани' },
					{ key: 'D', text: 'En Alsace', text_en: 'In Alsace', text_ru: 'В Эльзасе' }
				],
				correctAnswer: 'A',
				explanation: 'Le plateau de Valensole se trouve en Provence, dans le département des Alpes-de-Haute-Provence.',
				explanation_en: 'The Valensole plateau is located in Provence, in the Alpes-de-Haute-Provence department.',
				explanation_ru: 'Плато Валансоль расположено в Провансе, в департаменте Альпы Верхнего Прованса.'
			},
			{
				id: 2,
				question: 'Pour quelle culture le plateau de Valensole est-il particulièrement célèbre ?',
				question_en: 'For which crop is the Valensole plateau particularly famous?',
				question_ru: 'Какой культурой особенно известно плато Валансоль?',
				options: [
					{ key: 'A', text: 'La lavande', text_en: 'Lavender', text_ru: 'Лаванда' },
					{ key: 'B', text: 'Le blé', text_en: 'Wheat', text_ru: 'Пшеница' },
					{ key: 'C', text: 'Les tulipes', text_en: 'Tulips', text_ru: 'Тюльпаны' },
					{ key: 'D', text: 'Les oliviers', text_en: 'Olive trees', text_ru: 'Оливковые деревья' }
				],
				correctAnswer: 'A',
				explanation: 'Le plateau de Valensole est célèbre pour ses immenses champs de lavande qui fleurissent en été.',
				explanation_en: 'The Valensole plateau is famous for its vast lavender fields that bloom in summer.',
				explanation_ru: 'Плато Валансоль знаменито своими огромными лавандовыми полями, цветущими летом.'
			},
			{
				id: 3,
				question: 'À quelle période de l\'année les champs de lavande sont-ils en fleurs ?',
				question_en: 'At what time of year are the lavender fields in bloom?',
				question_ru: 'В какое время года цветут лавандовые поля?',
				options: [
					{ key: 'A', text: 'De juin à août', text_en: 'From June to August', text_ru: 'С июня по август' },
					{ key: 'B', text: 'De janvier à mars', text_en: 'From January to March', text_ru: 'С января по март' },
					{ key: 'C', text: 'De septembre à novembre', text_en: 'From September to November', text_ru: 'С сентября по ноябрь' },
					{ key: 'D', text: 'Toute l\'année', text_en: 'All year round', text_ru: 'Круглый год' }
				],
				correctAnswer: 'A',
				explanation: 'La lavande fleurit principalement de mi-juin à mi-août, créant un spectacle violet magnifique.',
				explanation_en: 'Lavender blooms mainly from mid-June to mid-August, creating a magnificent purple spectacle.',
				explanation_ru: 'Лаванда цветет в основном с середины июня до середины августа, создавая великолепное фиолетовое зрелище.'
			},
			{
				id: 4,
				question: 'Quelle est la superficie approximative du plateau de Valensole ?',
				question_en: 'What is the approximate area of the Valensole plateau?',
				question_ru: 'Какова примерная площадь плато Валансоль?',
				options: [
					{ key: 'A', text: 'Environ 800 km²', text_en: 'About 800 km²', text_ru: 'Около 800 км²' },
					{ key: 'B', text: 'Environ 50 km²', text_en: 'About 50 km²', text_ru: 'Около 50 км²' },
					{ key: 'C', text: 'Environ 2000 km²', text_en: 'About 2000 km²', text_ru: 'Около 2000 км²' },
					{ key: 'D', text: 'Environ 100 km²', text_en: 'About 100 km²', text_ru: 'Около 100 км²' }
				],
				correctAnswer: 'A',
				explanation: 'Le plateau de Valensole s\'étend sur environ 800 km², ce qui en fait l\'un des plus vastes de France.',
				explanation_en: 'The Valensole plateau extends over about 800 km², making it one of the largest in France.',
				explanation_ru: 'Плато Валансоль простирается примерно на 800 км², что делает его одним из крупнейших во Франции.'
			},
			{
				id: 5,
				question: 'Outre la lavande, quelle autre culture est importante sur le plateau ?',
				question_en: 'Besides lavender, what other crop is important on the plateau?',
				question_ru: 'Помимо лаванды, какая еще культура важна на плато?',
				options: [
					{ key: 'A', text: 'Le blé et les céréales', text_en: 'Wheat and cereals', text_ru: 'Пшеница и злаки' },
					{ key: 'B', text: 'Le riz', text_en: 'Rice', text_ru: 'Рис' },
					{ key: 'C', text: 'Le café', text_en: 'Coffee', text_ru: 'Кофе' },
					{ key: 'D', text: 'Le cacao', text_en: 'Cocoa', text_ru: 'Какао' }
				],
				correctAnswer: 'A',
				explanation: 'En plus de la lavande, le plateau de Valensole produit beaucoup de céréales, notamment du blé.',
				explanation_en: 'In addition to lavender, the Valensole plateau produces many cereals, especially wheat.',
				explanation_ru: 'Помимо лаванды, плато Валансоль производит много злаков, особенно пшеницу.'
			}
		]
	}
}

async function updateExercises() {
	console.log('Updating French beautiful-places MCQ exercises with better questions...\n')

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
