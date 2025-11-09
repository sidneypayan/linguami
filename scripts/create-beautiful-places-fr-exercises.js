const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Materials that need exercises
const materialsToProcess = [479, 480, 481]

async function createExercises() {
	console.log('Creating exercises for French beautiful-places materials...\n')

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
				title: 'Compréhension du texte',
				material_id: materialId,
				level: 'beginner',
				lang: 'fr',
				xp_reward: 15,
				data: {
					questions: [
						{
							id: 1,
							question: `Où se trouve ${material.title} ?`,
							question_en: `Where is ${material.title} located?`,
							question_ru: `Где находится ${material.title}?`,
							options: [
								{ key: 'A', text: 'En France', text_en: 'In France', text_ru: 'Во Франции' },
								{ key: 'B', text: 'En Italie', text_en: 'In Italy', text_ru: 'В Италии' },
								{ key: 'C', text: 'En Allemagne', text_en: 'In Germany', text_ru: 'В Германии' },
								{ key: 'D', text: 'En Russie', text_en: 'In Russia', text_ru: 'В России' }
							],
							correctAnswer: 'A',
							explanation: `${material.title} se trouve en France.`,
							explanation_en: `${material.title} is located in France.`,
							explanation_ru: `${material.title} находится во Франции.`
						},
						{
							id: 2,
							question: 'De quel type de lieu s\'agit-il ?',
							question_en: 'What type of place is it?',
							question_ru: 'Какой это тип места?',
							options: [
								{ key: 'A', text: 'Un lieu naturel', text_en: 'A natural place', text_ru: 'Природное место' },
								{ key: 'B', text: 'Un lieu historique', text_en: 'A historical place', text_ru: 'Историческое место' },
								{ key: 'C', text: 'Un lieu moderne', text_en: 'A modern place', text_ru: 'Современное место' },
								{ key: 'D', text: 'Cela dépend', text_en: 'It depends', text_ru: 'Зависит от места' }
							],
							correctAnswer: 'D',
							explanation: 'Le type de lieu dépend de l\'endroit spécifique.',
							explanation_en: 'The type of place depends on the specific location.',
							explanation_ru: 'Тип места зависит от конкретного расположения.'
						},
						{
							id: 3,
							question: 'Qu\'est-ce qui est décrit dans le texte ?',
							question_en: 'What is described in the text?',
							question_ru: 'Что описывается в тексте?',
							options: [
								{ key: 'A', text: 'Un bel endroit', text_en: 'A beautiful place', text_ru: 'Красивое место' },
								{ key: 'B', text: 'Une recette', text_en: 'A recipe', text_ru: 'Рецепт' },
								{ key: 'C', text: 'Un événement sportif', text_en: 'A sports event', text_ru: 'Спортивное событие' },
								{ key: 'D', text: 'Un festival', text_en: 'A festival', text_ru: 'Фестиваль' }
							],
							correctAnswer: 'A',
							explanation: 'Le texte décrit un bel endroit en France.',
							explanation_en: 'The text describes a beautiful place in France.',
							explanation_ru: 'Текст описывает красивое место во Франции.'
						}
					]
				}
			},
			{
				type: 'fill_in_blank',
				title: 'Compréhension de l\'audio',
				material_id: materialId,
				level: 'beginner',
				lang: 'fr',
				xp_reward: 15,
				data: {
					questions: [
						{
							id: 1,
							title: 'Complétez les phrases',
							title_en: 'Complete the sentences',
							title_ru: 'Дополните предложения',
							text: `${material.title} est un ___ endroit en France.`,
							text_en: `${material.title} is a ___ place in France.`,
							text_ru: `${material.title} - это ___ место во Франции.`,
							blanks: [
								{
									correctAnswers: ['bel', 'magnifique', 'superbe', 'merveilleux', 'célèbre'],
									hint: 'adjectif'
								}
							],
							explanation: 'Utilisez un adjectif qui décrit la beauté du lieu.',
							explanation_en: 'Use an adjective that describes the beauty of the place.',
							explanation_ru: 'Используйте прилагательное, описывающее красоту места.'
						},
						{
							id: 2,
							title: 'Remplissez le blanc',
							title_en: 'Fill in the blank',
							title_ru: 'Заполните пропуск',
							text: 'De nombreux touristes ___ visiter ce lieu chaque année.',
							text_en: 'Many tourists ___ to visit this place every year.',
							text_ru: 'Многие туристы ___ посетить это место каждый год.',
							blanks: [
								{
									correctAnswers: ['viennent', 'aiment', 'souhaitent', 'désirent', 'veulent'],
									hint: 'verbe'
								}
							],
							explanation: 'Utilisez un verbe exprimant le désir ou l\'action de visiter.',
							explanation_en: 'Use a verb expressing the desire or action to visit.',
							explanation_ru: 'Используйте глагол, выражающий желание или действие посетить.'
						}
					]
				}
			},
			{
				type: 'drag_and_drop',
				title: 'Association de vocabulaire',
				material_id: materialId,
				level: 'beginner',
				lang: 'fr',
				xp_reward: 15,
				data: {
					questions: [
						{
							id: 1,
							instruction: 'Associez les mots français avec leur traduction',
							instruction_en: 'Match the French words with their translation',
							instruction_ru: 'Сопоставьте французские слова с их переводом',
							pairs: [
								{ id: 'pair-1', left: 'Beau', right: 'Beautiful (Красивый)' },
								{ id: 'pair-2', left: 'Lieu', right: 'Place (Место)' },
								{ id: 'pair-3', left: 'Nature', right: 'Nature (Природа)' },
								{ id: 'pair-4', left: 'Touristes', right: 'Tourists (Туристы)' },
								{ id: 'pair-5', left: 'Paysage', right: 'Landscape (Пейзаж)' }
							],
							explanation: 'Ces mots sont fréquemment utilisés pour décrire de beaux endroits.',
							explanation_en: 'These words are frequently used to describe beautiful places.',
							explanation_ru: 'Эти слова часто используются для описания красивых мест.'
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

	console.log('\n✅ All French exercises created successfully!')
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
