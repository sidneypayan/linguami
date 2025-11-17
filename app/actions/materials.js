'use server'

import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { logger } from '@/utils/logger'

/**
 * Server Actions for materials mutations
 * These functions modify data and use 'use server' directive
 * They can be called from Client Components
 */

/**
 * Add material to "being studied" status
 * @param {number} materialId - Material ID
 * @returns {Promise<Object>} Result with success status and message
 */
export async function addBeingStudiedMaterial(materialId) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Insert user_material
  const { error: insertError } = await supabase
    .from('user_materials')
    .insert([{
      user_id: user.id,
      material_id: materialId,
    }])

  if (insertError) {
    logger.error('Error adding material to studying:', insertError)
    return { success: false, error: insertError.message }
  }

  // Add XP for starting a material
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/xp/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionType: 'material_started',
        sourceId: materialId.toString(),
        description: 'Started new material'
      })
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
 * Remove material from "being studied" status
 * @param {number} materialId - Material ID
 * @returns {Promise<Object>} Result with success status and message
 */
export async function removeBeingStudiedMaterial(materialId) {
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
    .match({ user_id: user.id, material_id: materialId })

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
    .match({ user_id: user.id, material_id: materialId })
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
        material_id: materialId,
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
      .match({ user_id: user.id, material_id: materialId })

    if (updateError) {
      logger.error('Error updating material to studied:', updateError)
      return { success: false, error: updateError.message }
    }
  }

  // Add XP for completing a material
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/xp/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionType: 'material_completed',
        sourceId: materialId.toString(),
        description: 'Completed material'
      })
    })
  } catch (err) {
    logger.error('Error adding XP:', err)
  }

  // Revalidate paths to refresh data
  revalidatePath('/[locale]/my-materials', 'page')
  revalidatePath('/[locale]/materials/[section]', 'page')

  return { success: true }
}
