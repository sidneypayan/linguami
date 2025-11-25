import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { logger } from '@/utils/logger'

/**
 * Data fetching functions for materials (Server Components)
 * These functions are called directly in Server Components (page.js)
 * NO 'use server' needed - they run on the server by default
 */

/**
 * Fetch materials by language and section
 * @param {string} lang - Learning language (fr, ru, en)
 * @param {string} section - Section slug
 * @returns {Promise<Array>} Materials array
 */
export async function getMaterialsBySection(lang, section) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: materials, error } = await supabase
    .from('materials')
    .select('*')
    .eq('lang', lang)
    .eq('section', section)
    .order('created_at', { ascending: false })

  if (error) {
    logger.error('Error fetching materials:', error)
    return []
  }

  return materials
}

/**
 * Fetch all materials by language (all sections except books and book-chapters)
 * @param {string} lang - Learning language (fr, ru, en)
 * @returns {Promise<Array>} Materials array
 */
export async function getAllMaterialsByLanguage(lang) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  // Define valid sections (excluding books and book-chapters)
  const audioTextSections = [
    'dialogues',
    'culture',
    'legends',
    'slices-of-life',
    'beautiful-places',
    'podcasts',
    'short-stories',
  ]

  const videoSectionsFr = [
    'movie-trailers',
    'movie-clips',
    'cartoons',
    'various-materials',
    'rock',
    'pop',
    'folk',
    'variety',
    'kids',
  ]

  const videoSectionsRu = [...videoSectionsFr, 'eralash', 'galileo']

  const videoSections = lang === 'ru' ? videoSectionsRu : videoSectionsFr
  const validSections = [...audioTextSections, ...videoSections]

  const { data: materials, error } = await supabase
    .from('materials')
    .select('*')
    .eq('lang', lang)
    .in('section', validSections)
    .order('created_at', { ascending: false })

  if (error) {
    logger.error('Error fetching all materials:', error)
    return []
  }

  return materials
}

/**
 * Fetch all books by language
 * @param {string} lang - Learning language
 * @returns {Promise<Array>} Books array
 */
export async function getBooksByLanguage(lang) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('lang', lang)
    .order('id', { ascending: false })

  if (error) {
    logger.error('Error fetching books:', error)
    return []
  }

  return books
}

/**
 * Fetch user materials (what user is studying)
 * @param {string} lang - Learning language
 * @param {string} userId - User ID
 * @returns {Promise<Array>} User materials with merged data
 */
export async function getUserMaterialsByLanguage(lang, userId) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  logger.info(`Fetching user materials for userId: ${userId}, lang: ${lang}`)

  const { data: userMaterials, error } = await supabase
    .from('user_materials')
    .select('*, materials!inner(title, image_filename, level, section, title_fr, title_en, title_ru)')
    .eq('user_id', userId)
    .eq('materials.lang', lang)

  if (error) {
    logger.error('Error fetching user materials:', error)
    return []
  }

  logger.info(`Found ${userMaterials?.length || 0} user materials`)

  // Merge user_material data with material data
  return userMaterials.map(um => ({
    is_being_studied: um.is_being_studied,
    is_studied: um.is_studied,
    id: um.material_id,
    title: um.materials.title,
    title_fr: um.materials.title_fr,
    title_en: um.materials.title_en,
    title_ru: um.materials.title_ru,
    image_filename: um.materials.image_filename,
    level: um.materials.level,
    section: um.materials.section,
  }))
}

/**
 * Fetch all user materials status (for filtering)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of material statuses
 */
export async function getUserMaterialsStatus(userId) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: statuses, error } = await supabase
    .from('user_materials')
    .select('material_id, is_being_studied, is_studied')
    .eq('user_id', userId)

  if (error) {
    logger.error('Error fetching user materials status:', error)
    return []
  }

  return statuses
}

/**
 * Fetch status of a specific material for a user
 * @param {number} materialId - Material ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Material status
 */
export async function getUserMaterialStatus(materialId, userId) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: status } = await supabase
    .from('user_materials')
    .select('is_being_studied, is_studied, reading_page')
    .match({ user_id: userId, material_id: materialId })
    .maybeSingle()

  // maybeSingle() is designed to return null without error when no rows found
  // No need to check for errors
  return status || { is_being_studied: false, is_studied: false, reading_page: 1 }
}

/**
 * Fetch first chapter of a book
 * @param {string} lang - Learning language
 * @param {number} bookId - Book ID
 * @returns {Promise<Object|null>} First chapter
 */
export async function getFirstChapterOfBook(lang, bookId) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: chapters, error } = await supabase
    .from('materials')
    .select('*')
    .eq('lang', lang)
    .eq('book_id', bookId)
    .order('chapter_number', { ascending: true })
    .limit(1)

  if (error) {
    logger.error('Error fetching first chapter:', error)
    return null
  }

  return chapters?.[0] || null
}

/**
 * Fetch all chapters of a book
 * @param {number} bookId - Book ID
 * @returns {Promise<Array>} Chapters array
 */
export async function getBookChapters(bookId) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: chapters, error } = await supabase
    .from('materials')
    .select('id, title')
    .eq('section', 'book-chapters')
    .eq('book_id', bookId)
    .order('id')

  if (error) {
    logger.error('Error fetching chapters:', error)
    return []
  }

  return chapters
}

/**
 * Fetch previous and next chapters for a given chapter
 * @param {number} currentChapterId - Current chapter ID
 * @param {number} bookId - Book ID
 * @returns {Promise<Object>} Object with previousChapter and nextChapter
 */
export async function getSiblingChapters(currentChapterId, bookId) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  // Get all chapters for this book
  const { data: chapters, error } = await supabase
    .from('materials')
    .select('id, title')
    .eq('section', 'book-chapters')
    .eq('book_id', bookId)
    .order('id')

  if (error) {
    logger.error('Error fetching sibling chapters:', error)
    return { previousChapter: null, nextChapter: null }
  }

  // Find current chapter index
  const currentIndex = chapters.findIndex(ch => ch.id === currentChapterId)

  if (currentIndex === -1) {
    return { previousChapter: null, nextChapter: null }
  }

  return {
    previousChapter: currentIndex > 0 ? chapters[currentIndex - 1] : null,
    nextChapter: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null,
  }
}
