/**
 * Client-side data fetching functions for materials
 * These functions use Supabase client and can be called from Client Components
 */

import { supabase } from '@/lib/supabase'
import { logger } from '@/utils/logger'

/**
 * Fetch first chapter of a book (Client-side)
 * @param {string} lang - Learning language
 * @param {number} bookId - Book ID
 * @returns {Promise<Object|null>} First chapter
 */
export async function getFirstChapterOfBook(lang, bookId) {
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
 * Fetch all chapters of a book (Client-side)
 * @param {number} bookId - Book ID
 * @returns {Promise<Array>} Chapters array
 */
export async function getBookChapters(bookId) {
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
 * Fetch user materials status (Client-side)
 * @returns {Promise<Array>} User materials status
 */
export async function getUserMaterialsStatus() {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('user_materials_status')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    logger.error('Error fetching user materials status:', error)
    return []
  }

  return data || []
}
