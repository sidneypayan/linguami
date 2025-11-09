const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Materials that need exercises (from check script)
const materialsToProcess = [120, 130, 155, 157, 158, 161, 168, 169, 172, 311, 312]

async function createExercises() {
	console.log('Creating exercises for missing beautiful-places materials...\n')

	for (const materialId of materialsToProcess) {
		console.log(`\nProcessing material #${materialId}...`)

		// Get material details
		const { data: material, error: materialError } = await supabase
			.from('materials')
			.select('*')
			.eq('id', materialId)
			.single()

		if (materialError || !material) {
			console.error(`  ❌ Error fetching material:`, materialError)
			continue
		}

		console.log(`  Material: "${material.title}"`)

		// Create 3 exercises for each material
		const exercises = [
			{
				type: 'mcq',
				title: 'Понимание текста',
				material_id: materialId,
				level: 'beginner',
				lang: 'ru',
				xp_reward: 15,
				data: {
					questions: [
						{
							id: 1,
							question: `Где находится ${material.title}?`,
							question_en: `Where is ${material.title} located?`,
							question_fr: `Où se trouve ${material.title}?`,
							options: [
								{ key: 'A', text: 'В России', text_en: 'In Russia', text_fr: 'En Russie' },
								{ key: 'B', text: 'В Италии', text_en: 'In Italy', text_fr: 'En Italie' },
								{ key: 'C', text: 'В Германии', text_en: 'In Germany', text_fr: 'En Allemagne' },
								{ key: 'D', text: 'Во Франции', text_en: 'In France', text_fr: 'En France' }
							],
							correctAnswer: 'A',
							explanation: `${material.title} находится в России.`,
							explanation_en: `${material.title} is located in Russia.`,
							explanation_fr: `${material.title} se trouve en Russie.`
						},
						{
							id: 2,
							question: 'Что описывается в тексте?',
							question_en: 'What is described in the text?',
							question_fr: 'Qu\'est-ce qui est décrit dans le texte?',
							options: [
								{ key: 'A', text: 'Красивое место', text_en: 'A beautiful place', text_fr: 'Un bel endroit' },
								{ key: 'B', text: 'Рецепт блюда', text_en: 'A recipe', text_fr: 'Une recette' },
								{ key: 'C', text: 'Спортивное событие', text_en: 'A sports event', text_fr: 'Un événement sportif' },
								{ key: 'D', text: 'Музыкальный фестиваль', text_en: 'A music festival', text_fr: 'Un festival de musique' }
							],
							correctAnswer: 'A',
							explanation: 'В тексте описывается красивое место в России.',
							explanation_en: 'The text describes a beautiful place in Russia.',
							explanation_fr: 'Le texte décrit un bel endroit en Russie.'
						},
						{
							id: 3,
							question: 'Какой тип достопримечательности это?',
							question_en: 'What type of attraction is this?',
							question_fr: 'Quel type d\'attraction est-ce?',
							options: [
								{ key: 'A', text: 'Природная', text_en: 'Natural', text_fr: 'Naturelle' },
								{ key: 'B', text: 'Историческая', text_en: 'Historical', text_fr: 'Historique' },
								{ key: 'C', text: 'Современная', text_en: 'Modern', text_fr: 'Moderne' },
								{ key: 'D', text: 'Зависит от места', text_en: 'Depends on the place', text_fr: 'Dépend du lieu' }
							],
							correctAnswer: 'D',
							explanation: 'Тип достопримечательности зависит от конкретного места.',
							explanation_en: 'The type of attraction depends on the specific place.',
							explanation_fr: 'Le type d\'attraction dépend du lieu spécifique.'
						}
					]
				}
			},
			{
				type: 'fill_in_blank',
				title: 'Понимание на слух',
				material_id: materialId,
				level: 'beginner',
				lang: 'ru',
				xp_reward: 15,
				data: {
					questions: [
						{
							id: 1,
							title: 'Заполните пропуски',
							title_en: 'Fill in the blanks',
							title_fr: 'Remplissez les blancs',
							text: `${material.title} - это ___ место в России.`,
							text_en: `${material.title} is a ___ place in Russia.`,
							text_fr: `${material.title} est un ___ endroit en Russie.`,
							blanks: [
								{
									correctAnswers: ['красивое', 'прекрасное', 'удивительное', 'известное'],
									hint: 'прилагательное'
								}
							],
							explanation: 'Используйте прилагательное, описывающее место.',
							explanation_en: 'Use an adjective describing the place.',
							explanation_fr: 'Utilisez un adjectif décrivant l\'endroit.'
						},
						{
							id: 2,
							title: 'Дополните предложение',
							title_en: 'Complete the sentence',
							title_fr: 'Complétez la phrase',
							text: 'Многие туристы ___ посетить это место.',
							text_en: 'Many tourists ___ to visit this place.',
							text_fr: 'De nombreux touristes ___ visiter cet endroit.',
							blanks: [
								{
									correctAnswers: ['хотят', 'мечтают', 'желают', 'стремятся'],
									hint: 'глагол'
								}
							],
							explanation: 'Используйте глагол, выражающий желание.',
							explanation_en: 'Use a verb expressing desire.',
							explanation_fr: 'Utilisez un verbe exprimant le désir.'
						}
					]
				}
			},
			{
				type: 'drag_and_drop',
				title: 'Упражнение на лексику',
				material_id: materialId,
				level: 'beginner',
				lang: 'ru',
				xp_reward: 15,
				data: {
					questions: [
						{
							id: 1,
							instruction: 'Сопоставьте русские слова с их переводом',
							instruction_en: 'Match the Russian words with their translation',
							instruction_fr: 'Associez les mots russes avec leur traduction',
							pairs: [
								{ id: 'pair-1', left: 'Красивый', right: 'Beautiful (Beau)' },
								{ id: 'pair-2', left: 'Место', right: 'Place (Lieu)' },
								{ id: 'pair-3', left: 'Природа', right: 'Nature (Nature)' },
								{ id: 'pair-4', left: 'Туристы', right: 'Tourists (Touristes)' },
								{ id: 'pair-5', left: 'Достопримечательность', right: 'Attraction (Attraction)' }
							],
							explanation: 'Эти слова часто используются при описании красивых мест.',
							explanation_en: 'These words are often used when describing beautiful places.',
							explanation_fr: 'Ces mots sont souvent utilisés pour décrire de beaux endroits.'
						}
					]
				}
			}
		]

		// Insert exercises
		for (const exercise of exercises) {
			const { data, error } = await supabase
				.from('exercises')
				.insert(exercise)
				.select()

			if (error) {
				console.error(`  ❌ Error creating ${exercise.type} exercise:`, error)
			} else {
				console.log(`  ✅ Created ${exercise.type} exercise: "${exercise.title}"`)
			}
		}
	}

	console.log('\n✅ All exercises created successfully!')
}

createExercises()
	.then(() => {
		console.log('\nProcess completed!')
		process.exit(0)
	})
	.catch(err => {
		console.error('Error:', err)
		process.exit(1)
	})
