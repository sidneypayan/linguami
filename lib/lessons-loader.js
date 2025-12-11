/**
 * Lesson loader - Load lessons from JSON files instead of database
 * This allows for version control, easier editing, and no DB sync needed
 */

import fs from 'fs'
import path from 'path'

const LESSONS_DIR = path.join(process.cwd(), 'data', 'method', 'lessons')

/**
 * Get lesson data from JSON file
 * @param {string} levelSlug - Level slug (e.g. 'beginner')
 * @param {string} lessonSlug - Lesson slug (e.g. 'privet-saluer-prendre-conge')
 * @returns {Object|null} Lesson data or null if not found
 */
export function getLessonFromJSON(levelSlug, lessonSlug) {
  try {
    const filePath = path.join(LESSONS_DIR, levelSlug, `${lessonSlug}.json`)

    if (!fs.existsSync(filePath)) {
      console.log(`[LessonLoader] JSON file not found: ${filePath}`)
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const lessonData = JSON.parse(fileContent)

    console.log(`[LessonLoader] ✅ Loaded lesson from JSON: ${lessonSlug}`)
    return lessonData
  } catch (error) {
    console.error(`[LessonLoader] Error loading lesson ${lessonSlug}:`, error)
    return null
  }
}

/**
 * Get all lessons for a level from JSON files
 * @param {string} levelSlug - Level slug (e.g. 'beginner')
 * @returns {Array} Array of lesson data
 */
export function getAllLessonsForLevel(levelSlug) {
  try {
    const levelDir = path.join(LESSONS_DIR, levelSlug)

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

    console.log(`[LessonLoader] ✅ Loaded ${lessons.length} lessons for level ${levelSlug}`)
    return lessons
  } catch (error) {
    console.error(`[LessonLoader] Error loading lessons for level ${levelSlug}:`, error)
    return []
  }
}

/**
 * Check if lesson exists in JSON files
 * @param {string} levelSlug - Level slug
 * @param {string} lessonSlug - Lesson slug
 * @returns {boolean} True if lesson JSON file exists
 */
export function lessonExistsInJSON(levelSlug, lessonSlug) {
  const filePath = path.join(LESSONS_DIR, levelSlug, `${lessonSlug}.json`)
  return fs.existsSync(filePath)
}
