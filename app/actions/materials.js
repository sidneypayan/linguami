'use server'

import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { logger } from '@/utils/logger'
import { addXP } from '@/lib/xp-service' // Only used for material completion
import { z } from 'zod'

/**
 * Server Actions for materials
 * These functions can be called from Client Components
 */

// Validation schemas
const LanguageSchema = z.enum(['fr', 'ru', 'en'])
const MaterialIdSchema = z.number().int().positive('Material ID must be a positive integer')
const BookIdSchema = z.number().int().positive('Book ID must be a positive integer')
const SectionSchema = z.string().min(1, 'Section must be a non-empty string')

/**
 * Fetch all materials by language (for client-side use with React Query)
 * @param {string} lang - Learning language (fr, ru, en)
 * @returns {Promise<Array>} Materials array
 */
export async function getMaterialsByLanguageAction(lang) {
  // Validate language
  const validLang = LanguageSchema.parse(lang)

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

  const videoSections = validLang === 'ru' ? videoSectionsRu : videoSectionsFr
  const validSections = [...audioTextSections, ...videoSections]

  const { data: materials, error } = await supabase
    .from('materials')
    .select('*')
    .eq('lang', validLang)
    .in('section', validSections)
    .order('chapter_number', { ascending: true, nullsLast: true })
    .order('created_at', { ascending: false })

  if (error) {
    logger.error('Error fetching materials:', error)
    return []
  }

  return materials || []
}

/**
 * Fetch all books by language (for client-side use with React Query)
 * @param {string} lang - Learning language (fr, ru, en)
 * @returns {Promise<Array>} Books array
 */
export async function getBooksByLanguageAction(lang) {
  // Validate language
  const validLang = LanguageSchema.parse(lang)

  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('lang', validLang)
    .order('id', { ascending: false })

  if (error) {
    logger.error('Error fetching books:', error)
    return []
  }

  return books || []
}

/**
 * Fetch materials by section and language (for client-side use with React Query)
 * @param {string} lang - Learning language (fr, ru, en)
 * @param {string} section - Section name
 * @returns {Promise<Array>} Materials array or books array
 */
export async function getMaterialsBySectionAction(lang, section) {
  // Validate inputs
  const validLang = LanguageSchema.parse(lang)
  const validSection = SectionSchema.parse(section)

  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  // If section is 'books', fetch from books table
  if (validSection === 'books') {
    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .eq('lang', validLang)
      .order('id', { ascending: false })

    if (error) {
      logger.error('Error fetching books:', error)
      return []
    }

    return books || []
  }

  // Otherwise, fetch materials from materials table
  const { data: materials, error } = await supabase
    .from('materials')
    .select('*')
    .eq('lang', validLang)
    .eq('section', validSection)
    .order('created_at', { ascending: false })

  if (error) {
    logger.error('Error fetching materials by section:', error)
    return []
  }

  return materials || []
}

/**
 * Add material to "being studied" status
 * @param {number} materialId - Material ID
 * @returns {Promise<Object>} Result with success status and message
 */
export async function addBeingStudiedMaterial(materialId) {
  // Validate materialId
  const validMaterialId = MaterialIdSchema.parse(materialId)

  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Insert user_material with is_being_studied flag
  const { error: insertError } = await supabase
    .from('user_materials')
    .insert([{
      user_id: user.id,
      material_id: validMaterialId,
      is_being_studied: true,
      is_studied: false,
    }])

  if (insertError) {
    logger.error('Error adding material to studying:', insertError)
    return { success: false, error: insertError.message }
  }

  // No XP awarded for starting a material (only for completion)

  // Revalidate paths to refresh data
  revalidatePath('/[locale]/my-materials', 'page')
  revalidatePath('/[locale]/materials/[section]', 'page')

  return { success: true }
}

/**
 * Remove material from "being studied" status
 * @param {number} materialId - Material ID
 * @returns {Promise<Object>} Result with success status and message
 */
export async function removeBeingStudiedMaterial(materialId) {
  // Validate materialId
  const validMaterialId = MaterialIdSchema.parse(materialId)

  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Delete user_material
  const { error: deleteError } = await supabase
    .from('user_materials')
    .delete()
    .match({ user_id: user.id, material_id: validMaterialId })

  if (deleteError) {
    logger.error('Error removing material from studying:', deleteError)
    return { success: false, error: deleteError.message }
  }

  // Revalidate paths to refresh data
  revalidatePath('/[locale]/my-materials', 'page')
  revalidatePath('/[locale]/materials/[section]', 'page')

  return { success: true }
}

/**
 * Mark material as studied (completed)
 * @param {number} materialId - Material ID
 * @returns {Promise<Object>} Result with success status and message
 */
export async function addMaterialToStudied(materialId) {
  // Validate materialId
  const validMaterialId = MaterialIdSchema.parse(materialId)

  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Check if user_material already exists
  const { data: existing, error: checkError } = await supabase
    .from('user_materials')
    .select('material_id')
    .match({ user_id: user.id, material_id: validMaterialId })
    .maybeSingle()

  if (checkError) {
    logger.error('Error checking material:', checkError)
    return { success: false, error: checkError.message }
  }

  if (!existing) {
    // Insert new entry with is_studied = true
    const { error: insertError } = await supabase
      .from('user_materials')
      .insert([{
        user_id: user.id,
        material_id: validMaterialId,
        is_being_studied: false,
        is_studied: true,
      }])

    if (insertError) {
      logger.error('Error inserting studied material:', insertError)
      return { success: false, error: insertError.message }
    }
  } else {
    // Update existing entry
    const { error: updateError } = await supabase
      .from('user_materials')
      .update({ is_being_studied: false, is_studied: true })
      .match({ user_id: user.id, material_id: validMaterialId })

    if (updateError) {
      logger.error('Error updating material to studied:', updateError)
      return { success: false, error: updateError.message }
    }
  }

  // Add XP for completing a material
  try {
    await addXP({
      actionType: 'material_completed',
      sourceId: validMaterialId.toString(),
      description: 'Completed material'
    })
  } catch (err) {
    logger.error('Error adding XP:', err)
  }

  // Revalidate paths to refresh data
  revalidatePath('/[locale]/my-materials', 'page')
  revalidatePath('/[locale]/materials/[section]', 'page')

  return { success: true }
}

/**
 * Get first chapter of a book
 * @param {Object} params
 * @param {string} params.lang - Learning language
 * @param {number} params.bookId - Book ID
 * @returns {Promise<Object|null>} First chapter or null
 */
export async function getFirstChapterOfBook({ lang, bookId }) {
  // Validate inputs
  const validLang = LanguageSchema.parse(lang)
  const validBookId = BookIdSchema.parse(bookId)

  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: chapters, error } = await supabase
    .from('materials')
    .select('*')
    .eq('lang', validLang)
    .eq('book_id', validBookId)
    .order('chapter_number', { ascending: true })
    .limit(1)

  if (error) {
    logger.error('Error fetching first chapter:', error)
    return null
  }

  return chapters?.[0] || null
}

/**
 * Get all chapters of a book
 * @param {number} bookId - Book ID
 * @returns {Promise<Array>} Chapters array
 */
export async function getBookChapters(bookId) {
  // Validate bookId
  const validBookId = BookIdSchema.parse(bookId)

  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: chapters, error } = await supabase
    .from('materials')
    .select('id, title')
    .eq('section', 'book-chapters')
    .eq('book_id', validBookId)
    .order('id')

  if (error) {
    logger.error('Error fetching chapters:', error)
    return []
  }

  return chapters || []
}

/**
 * Get user materials status (being studied, completed)
 * @returns {Promise<Array>} User materials status
 */
export async function getUserMaterialsStatus() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return []
  }

  const { data, error } = await supabase
    .from('user_materials')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    logger.error('Error fetching user materials status:', error)
    return []
  }

  return data || []
}

/**
 * Get user materials by language with full material data
 * @param {string} lang - Learning language
 * @returns {Promise<Array>} User materials with merged data
 */
export async function getUserMaterialsByLanguageAction(lang) {
  // Validate language
  const validLang = LanguageSchema.parse(lang)

  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    logger.error('Auth error or no user:', authError)
    return []
  }

  logger.info(`Fetching user materials for user ${user.id}, lang: ${validLang}`)

  const { data: userMaterials, error } = await supabase
    .from('user_materials')
    .select('*, materials!inner(title, image_filename, level, section, lang, title_fr, title_en, title_ru)')
    .eq('user_id', user.id)
    .eq('materials.lang', validLang)

  if (error) {
    logger.error('Error fetching user materials:', error)
    return []
  }

  logger.info(`Found ${userMaterials?.length || 0} user materials`)

  if (userMaterials && userMaterials.length > 0) {
    logger.info('Sample material:', JSON.stringify(userMaterials[0]))
  }

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
 * Save reading progress (current page) for a book chapter
 * @param {number} materialId - Material ID
 * @param {number} page - Current page number
 * @returns {Promise<Object>} Result with success status
 */
export async function saveReadingProgress(materialId, page) {
  try {
    // Validate inputs
    const validMaterialId = MaterialIdSchema.parse(materialId)
    const PageSchema = z.number().int().min(1, 'Page must be at least 1')
    const validPage = PageSchema.parse(page)

    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if user_material already exists
    const { data: existing, error: checkError } = await supabase
      .from('user_materials')
      .select('id')
      .match({ user_id: user.id, material_id: validMaterialId })
      .maybeSingle()

    if (checkError) {
      logger.error('Error checking user_material:', checkError)
      return { success: false, error: checkError.message }
    }

    if (existing) {
      // Update existing entry
      const { error: updateError } = await supabase
        .from('user_materials')
        .update({ reading_page: validPage })
        .match({ user_id: user.id, material_id: validMaterialId })

      if (updateError) {
        logger.error('Error updating reading progress:', updateError)
        return { success: false, error: updateError.message }
      }
    } else {
      // Insert new entry with reading page
      const { error: insertError } = await supabase
        .from('user_materials')
        .insert([{
          user_id: user.id,
          material_id: validMaterialId,
          is_being_studied: true,
          is_studied: false,
          reading_page: validPage,
        }])

      if (insertError) {
        logger.error('Error inserting reading progress:', insertError)
        return { success: false, error: insertError.message }
      }
    }

    return { success: true }
  } catch (error) {
    logger.error('Error in saveReadingProgress:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Report a material issue (broken link, inappropriate content, etc.)
 * @param {number} materialId - Material ID
 * @param {string} reportType - Type of report (broken_video, broken_link, etc.)
 * @param {string|null} comment - Optional comment from user
 * @returns {Promise<Object>} Result object
 */
export async function reportMaterialIssue(materialId, reportType, comment = null) {
  try {
    // Validate inputs
    const validMaterialId = MaterialIdSchema.parse(materialId)
    const ReportTypeSchema = z.enum([
      'broken_video',
      'broken_link',
      'broken_audio',
      'inappropriate_content',
      'translation_error',
      'other'
    ])
    const validReportType = ReportTypeSchema.parse(reportType)
    const validComment = comment ? z.string().max(1000).parse(comment) : null

    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)

    // Get user (can be null for guest users)
    const { data: { user } } = await supabase.auth.getUser()

    // Insert report
    const { data, error } = await supabase
      .from('material_reports')
      .insert({
        material_id: validMaterialId,
        user_id: user?.id || null,
        report_type: validReportType,
        comment: validComment,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      logger.error('Error creating material report:', error)
      return { success: false, error: error.message }
    }

    logger.info(`Material report created: ${data.id} for material ${validMaterialId}`)
    return { success: true, data }

  } catch (error) {
    logger.error('Error in reportMaterialIssue:', error)
    return { success: false, error: error.message }
  }
}
