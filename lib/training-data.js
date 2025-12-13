import fs from 'fs'
import path from 'path'

// Cache for loaded questions
const questionsCache = new Map()

/**
 * Load training questions from JSON file
 * @param {string} lang - Language code (fr, ru)
 * @param {string} level - Level (beginner, intermediate, advanced)
 * @param {string} themeKey - Theme key (greetings, numbers, etc.)
 * @returns {Array} Array of questions
 */
export function loadTrainingQuestions(lang, level, themeKey) {
	const cacheKey = `${lang}/${level}/${themeKey}`

	// Check cache first
	if (questionsCache.has(cacheKey)) {
		return questionsCache.get(cacheKey)
	}

	// Build file path
	const filePath = path.join(process.cwd(), 'data', 'training', lang, level, `${themeKey}.json`)

	try {
		// Check if file exists
		if (!fs.existsSync(filePath)) {
			console.warn(`Training questions file not found: ${filePath}`)
			return []
		}

		// Read and parse JSON
		const fileContent = fs.readFileSync(filePath, 'utf-8')
		const questions = JSON.parse(fileContent)

		// Cache the result
		questionsCache.set(cacheKey, questions)

		return questions
	} catch (error) {
		console.error(`Error loading training questions from ${filePath}:`, error)
		return []
	}
}

/**
 * Transform questions from JSON format to frontend expected format
 * @param {Array} questions - Raw questions from JSON
 * @param {number} themeId - Theme ID from database (for progress tracking)
 * @returns {Array} Transformed questions
 */
export function transformQuestionsForFrontend(questions, themeId) {
	return questions.map((q) => {
		const transformed = {
			...q,
			theme_id: themeId, // Add theme_id for progress tracking
		}

		// Convert question_fr, question_en, question_ru to question object
		if (q.question_fr || q.question_en || q.question_ru) {
			transformed.question = {
				fr: q.question_fr || '',
				en: q.question_en || '',
				ru: q.question_ru || '',
			}
		}

		// Convert explanation_fr, explanation_en, explanation_ru to explanation object
		if (q.explanation_fr || q.explanation_en || q.explanation_ru) {
			transformed.explanation = {
				fr: q.explanation_fr || '',
				en: q.explanation_en || '',
				ru: q.explanation_ru || '',
			}
		}

		// Convert correct_answer to correctAnswer (camelCase)
		if (q.correct_answer !== undefined) {
			transformed.correctAnswer = q.correct_answer
		}

		return transformed
	})
}

/**
 * Get all available themes from JSON files
 * @param {string} lang - Language code
 * @returns {Object} Themes grouped by level
 */
export function getAvailableThemesFromFiles(lang) {
	const basePath = path.join(process.cwd(), 'data', 'training', lang)
	const levels = ['beginner', 'intermediate', 'advanced']
	const result = {}

	for (const level of levels) {
		const levelPath = path.join(basePath, level)
		result[level] = []

		try {
			if (fs.existsSync(levelPath)) {
				const files = fs.readdirSync(levelPath)
				for (const file of files) {
					if (file.endsWith('.json')) {
						const themeKey = file.replace('.json', '')
						result[level].push(themeKey)
					}
				}
			}
		} catch (error) {
			console.error(`Error reading themes for ${lang}/${level}:`, error)
		}
	}

	return result
}

/**
 * Clear the questions cache (useful for development)
 */
export function clearQuestionsCache() {
	questionsCache.clear()
}

/**
 * Update a question in the JSON file
 * @param {string} lang - Language code (fr, ru)
 * @param {string} level - Level (beginner, intermediate, advanced)
 * @param {string} themeKey - Theme key (greetings, numbers, etc.)
 * @param {number} questionId - Question ID to update
 * @param {Object} updates - Updates to apply
 * @returns {boolean} Success status
 */
export function updateQuestionInFile(lang, level, themeKey, questionId, updates) {
	const filePath = path.join(process.cwd(), 'data', 'training', lang, level, `${themeKey}.json`)

	try {
		// Check if file exists
		if (!fs.existsSync(filePath)) {
			console.error(`Training questions file not found: ${filePath}`)
			return false
		}

		// Read current questions
		const fileContent = fs.readFileSync(filePath, 'utf-8')
		const questions = JSON.parse(fileContent)

		// Find question by ID
		const questionIndex = questions.findIndex((q) => q.id === questionId)
		if (questionIndex === -1) {
			console.error(`Question with ID ${questionId} not found in ${filePath}`)
			return false
		}

		// Update the question
		questions[questionIndex] = {
			...questions[questionIndex],
			...updates,
			// Preserve ID and theme_id
			id: questionId,
			theme_id: questions[questionIndex].theme_id,
		}

		// Write back to file
		fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf-8')

		// Clear cache for this theme
		const cacheKey = `${lang}/${level}/${themeKey}`
		questionsCache.delete(cacheKey)

		return true
	} catch (error) {
		console.error(`Error updating question in ${filePath}:`, error)
		return false
	}
}

/**
 * Delete a question from the JSON file (soft delete by setting is_active to false)
 * @param {string} lang - Language code (fr, ru)
 * @param {string} level - Level (beginner, intermediate, advanced)
 * @param {string} themeKey - Theme key (greetings, numbers, etc.)
 * @param {number} questionId - Question ID to delete
 * @returns {boolean} Success status
 */
export function deleteQuestionInFile(lang, level, themeKey, questionId) {
	return updateQuestionInFile(lang, level, themeKey, questionId, { is_active: false })
}
