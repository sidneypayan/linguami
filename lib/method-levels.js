/**
 * Static course levels data
 * No database fetch needed - these are hardcoded
 */

export const COURSE_LEVELS = [
	{
		id: 1,
		slug: 'beginner',
		name_fr: 'Débutant',
		name_ru: 'Начинающий',
		name_en: 'Beginner',
		description_fr: 'Commencez votre voyage dans l\'apprentissage des langues',
		description_ru: 'Начните свой путь в изучении языков',
		description_en: 'Start your language learning journey',
		order_index: 1,
		is_free: false,
	},
	{
		id: 2,
		slug: 'intermediate',
		name_fr: 'Intermédiaire',
		name_ru: 'Средний',
		name_en: 'Intermediate',
		description_fr: 'Développez vos compétences linguistiques',
		description_ru: 'Развивайте свои языковые навыки',
		description_en: 'Develop your language skills',
		order_index: 2,
		is_free: false,
	},
	{
		id: 3,
		slug: 'advanced',
		name_fr: 'Avancé',
		name_ru: 'Продвинутый',
		name_en: 'Advanced',
		description_fr: 'Maîtrisez la langue comme un expert',
		description_ru: 'Овладейте языком как эксперт',
		description_en: 'Master the language like an expert',
		order_index: 3,
		is_free: false,
	},
]

/**
 * Get all course levels (static data)
 */
export function getStaticMethodLevels() {
	return COURSE_LEVELS
}

/**
 * Get a level by slug
 * @param {string} slug - Level slug (beginner, intermediate, advanced)
 * @returns {object|null} Level object or null if not found
 */
export function getStaticLevelBySlug(slug) {
	return COURSE_LEVELS.find((level) => level.slug === slug) || null
}

/**
 * Get a level by ID
 * @param {number} id - Level ID
 * @returns {object|null} Level object or null if not found
 */
export function getStaticLevelById(id) {
	return COURSE_LEVELS.find((level) => level.id === id) || null
}
