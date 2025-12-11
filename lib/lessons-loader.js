/**
 * Lesson loader - Load lessons from JSON files instead of database
 * This allows for version control, easier editing, and no DB sync needed
 *
 * Two types of lessons:
 * 1. Method lessons: data/method/lessons/[level]/[slug].json
 * 2. Standalone lessons: data/lessons/[lang]/[slug].json
 */

import fs from 'fs'
import path from 'path'

const METHOD_LESSONS_DIR = path.join(process.cwd(), 'data', 'method')
const STANDALONE_LESSONS_DIR = path.join(process.cwd(), 'data', 'lessons')

// ============================================================================
// METHOD LESSONS (data/method/[targetLanguage]/[level]/[slug].json)
// ============================================================================

/**
 * Get Method lesson data from JSON file
 * @param {string} targetLanguage - Target language code (e.g. 'fr', 'ru') - what is being taught
 * @param {string} levelSlug - Level slug (e.g. 'beginner')
 * @param {string} lessonSlug - Lesson slug (e.g. 'privet-saluer-prendre-conge')
 * @returns {Object|null} Lesson data or null if not found
 */
export function getLessonFromJSON(targetLanguage, levelSlug, lessonSlug) {
  try {
    const filePath = path.join(METHOD_LESSONS_DIR, targetLanguage, levelSlug, `${lessonSlug}.json`)

    if (!fs.existsSync(filePath)) {
      console.log(`[LessonLoader] Method lesson JSON file not found: ${filePath}`)
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const lessonData = JSON.parse(fileContent)

    console.log(`[LessonLoader] ✅ Loaded Method lesson from JSON: ${lessonSlug}`)
    return lessonData
  } catch (error) {
    console.error(`[LessonLoader] Error loading Method lesson ${lessonSlug}:`, error)
    return null
  }
}

/**
 * Get all Method lessons for a level and target language from JSON files
 * @param {string} targetLanguage - Target language code (e.g. 'fr', 'ru') - what is being taught
 * @param {string} levelSlug - Level slug (e.g. 'beginner')
 * @returns {Array} Array of lesson data
 */
export function getAllLessonsForLevel(targetLanguage, levelSlug) {
  try {
    const levelDir = path.join(METHOD_LESSONS_DIR, targetLanguage, levelSlug)

    if (!fs.existsSync(levelDir)) {
      console.log(`[LessonLoader] Level directory not found: ${levelDir}`)
      return []
    }

    const files = fs.readdirSync(levelDir)
    const jsonFiles = files.filter(file => file.endsWith('.json'))

    const lessons = jsonFiles.map(file => {
      const filePath = path.join(levelDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(fileContent)
    })

    // Sort by order_index
    lessons.sort((a, b) => a.order_index - b.order_index)

    console.log(`[LessonLoader] ✅ Loaded ${lessons.length} Method lessons for target language ${targetLanguage}, level ${levelSlug}`)
    return lessons
  } catch (error) {
    console.error(`[LessonLoader] Error loading Method lessons for target language ${targetLanguage}, level ${levelSlug}:`, error)
    return []
  }
}

/**
 * Check if Method lesson exists in JSON files
 * @param {string} targetLanguage - Target language code (e.g. 'fr', 'ru') - what is being taught
 * @param {string} levelSlug - Level slug
 * @param {string} lessonSlug - Lesson slug
 * @returns {boolean} True if lesson JSON file exists
 */
export function lessonExistsInJSON(targetLanguage, levelSlug, lessonSlug) {
  const filePath = path.join(METHOD_LESSONS_DIR, targetLanguage, levelSlug, `${lessonSlug}.json`)
  return fs.existsSync(filePath)
}

// ============================================================================
// STANDALONE LESSONS (data/lessons/[target_language]/[level]/[slug].json)
// Where target_language is the language being taught ('fr' or 'ru')
// ============================================================================

/**
 * Get standalone lesson data from JSON file
 * @param {string} targetLanguage - Target language code (e.g. 'fr', 'ru') - what is being taught
 * @param {string} level - Level code (e.g. 'A1', 'A2', 'B1')
 * @param {string} lessonSlug - Lesson slug (e.g. 'les-pronoms-personnels-sujets')
 * @returns {Object|null} Lesson data or null if not found
 */
export function getStandaloneLessonFromJSON(targetLanguage, level, lessonSlug) {
  try {
    const filePath = path.join(STANDALONE_LESSONS_DIR, targetLanguage, level, `${lessonSlug}.json`)

    if (!fs.existsSync(filePath)) {
      console.log(`[LessonLoader] Standalone lesson JSON file not found: ${filePath}`)
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const lessonData = JSON.parse(fileContent)

    console.log(`[LessonLoader] ✅ Loaded standalone lesson from JSON: ${lessonSlug}`)
    return lessonData
  } catch (error) {
    console.error(`[LessonLoader] Error loading standalone lesson ${lessonSlug}:`, error)
    return null
  }
}

/**
 * Get all standalone lessons for a target language and level from JSON files
 * @param {string} targetLanguage - Target language code (e.g. 'fr', 'ru') - what is being taught
 * @param {string} level - Level code (e.g. 'A1', 'A2', 'B1')
 * @returns {Array} Array of lesson data
 */
export function getAllStandaloneLessonsForLang(targetLanguage, level) {
  try {
    const levelDir = path.join(STANDALONE_LESSONS_DIR, targetLanguage, level)

    if (!fs.existsSync(levelDir)) {
      console.log(`[LessonLoader] Target language/level directory not found: ${levelDir}`)
      return []
    }

    const files = fs.readdirSync(levelDir)
    const jsonFiles = files.filter(file => file.endsWith('.json'))

    const lessons = jsonFiles.map(file => {
      const filePath = path.join(levelDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(fileContent)
    })

    // Sort by order (standalone lessons use 'order' field, not 'order_index')
    lessons.sort((a, b) => (a.order || 0) - (b.order || 0))

    console.log(`[LessonLoader] ✅ Loaded ${lessons.length} standalone lessons for target language ${targetLanguage}, level ${level}`)
    return lessons
  } catch (error) {
    console.error(`[LessonLoader] Error loading standalone lessons for target language ${targetLanguage}, level ${level}:`, error)
    return []
  }
}

/**
 * Check if standalone lesson exists in JSON files
 * @param {string} targetLanguage - Target language code (what is being taught)
 * @param {string} level - Level code (e.g. 'A1', 'A2', 'B1')
 * @param {string} lessonSlug - Lesson slug
 * @returns {boolean} True if lesson JSON file exists
 */
export function standaloneLessonExistsInJSON(targetLanguage, level, lessonSlug) {
  const filePath = path.join(STANDALONE_LESSONS_DIR, targetLanguage, level, `${lessonSlug}.json`)
  return fs.existsSync(filePath)
}
