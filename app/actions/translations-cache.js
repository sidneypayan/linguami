'use server'

import { supabaseServer } from '@/lib/supabase-server'
import { checkAdminAuth } from '@/lib/admin'
import { logger } from '@/utils/logger'

/**
 * Get translations cache with pagination, search and filters
 */
export async function getTranslationsCacheAction({
	page = 1,
	limit = 50,
	search = '',
	sourceLang = '',
	targetLang = '',
	sortBy = 'usage_count',
	sortOrder = 'desc'
}) {
	const { isAdmin } = await checkAdminAuth()
	if (!isAdmin) {
		return { success: false, error: 'Unauthorized' }
	}

	try {
		let query = supabaseServer
			.from('translations_cache')
			.select('*', { count: 'exact' })

		// Search filter
		if (search) {
			query = query.or(`searched_form.ilike.%${search}%,lemma.ilike.%${search}%`)
		}

		// Language filters
		if (sourceLang) {
			query = query.eq('source_lang', sourceLang)
		}
		if (targetLang) {
			query = query.eq('target_lang', targetLang)
		}

		// Sorting
		query = query.order(sortBy, { ascending: sortOrder === 'asc' })

		// Pagination
		const from = (page - 1) * limit
		const to = from + limit - 1
		query = query.range(from, to)

		const { data, error, count } = await query

		if (error) {
			logger.error('[getTranslationsCacheAction] Error:', error)
			throw error
		}

		return {
			success: true,
			data,
			totalCount: count,
			page,
			totalPages: Math.ceil(count / limit)
		}
	} catch (error) {
		logger.error('[getTranslationsCacheAction] Error:', error)
		return {
			success: false,
			error: error.message || 'Error fetching translations cache'
		}
	}
}

/**
 * Get cache statistics
 */
export async function getTranslationsCacheStatsAction() {
	const { isAdmin } = await checkAdminAuth()
	if (!isAdmin) {
		return { success: false, error: 'Unauthorized' }
	}

	try {
		// Total count
		const { count: totalCount } = await supabaseServer
			.from('translations_cache')
			.select('*', { count: 'exact', head: true })

		// Count by source language
		const { data: bySourceLang } = await supabaseServer
			.from('translations_cache')
			.select('source_lang')

		const sourceLangCounts = bySourceLang?.reduce((acc, row) => {
			acc[row.source_lang] = (acc[row.source_lang] || 0) + 1
			return acc
		}, {}) || {}

		// Count by target language
		const { data: byTargetLang } = await supabaseServer
			.from('translations_cache')
			.select('target_lang')

		const targetLangCounts = byTargetLang?.reduce((acc, row) => {
			acc[row.target_lang] = (acc[row.target_lang] || 0) + 1
			return acc
		}, {}) || {}

		// Total usage (sum of usage_count)
		const { data: usageData } = await supabaseServer
			.from('translations_cache')
			.select('usage_count')

		const totalUsage = usageData?.reduce((acc, row) => acc + (row.usage_count || 0), 0) || 0

		// Top 10 most used
		const { data: topUsed } = await supabaseServer
			.from('translations_cache')
			.select('searched_form, lemma, source_lang, target_lang, usage_count')
			.order('usage_count', { ascending: false })
			.limit(10)

		return {
			success: true,
			stats: {
				totalCount,
				totalUsage,
				bySourceLang: sourceLangCounts,
				byTargetLang: targetLangCounts,
				topUsed: topUsed || []
			}
		}
	} catch (error) {
		logger.error('[getTranslationsCacheStatsAction] Error:', error)
		return {
			success: false,
			error: error.message || 'Error fetching cache stats'
		}
	}
}

/**
 * Update a translation cache entry
 */
export async function updateTranslationCacheAction(id, updates) {
	const { isAdmin } = await checkAdminAuth()
	if (!isAdmin) {
		return { success: false, error: 'Unauthorized' }
	}

	try {
		const { data, error } = await supabaseServer
			.from('translations_cache')
			.update({
				...updates,
				updated_at: new Date().toISOString()
			})
			.eq('id', id)
			.select()
			.single()

		if (error) {
			logger.error('[updateTranslationCacheAction] Error:', error)
			throw error
		}

		return { success: true, data }
	} catch (error) {
		logger.error('[updateTranslationCacheAction] Error:', error)
		return {
			success: false,
			error: error.message || 'Error updating translation'
		}
	}
}

/**
 * Delete a translation cache entry
 */
export async function deleteTranslationCacheAction(id) {
	const { isAdmin } = await checkAdminAuth()
	if (!isAdmin) {
		return { success: false, error: 'Unauthorized' }
	}

	try {
		const { error } = await supabaseServer
			.from('translations_cache')
			.delete()
			.eq('id', id)

		if (error) {
			logger.error('[deleteTranslationCacheAction] Error:', error)
			throw error
		}

		return { success: true }
	} catch (error) {
		logger.error('[deleteTranslationCacheAction] Error:', error)
		return {
			success: false,
			error: error.message || 'Error deleting translation'
		}
	}
}

/**
 * Delete multiple translation cache entries
 */
export async function deleteMultipleTranslationCacheAction(ids) {
	const { isAdmin } = await checkAdminAuth()
	if (!isAdmin) {
		return { success: false, error: 'Unauthorized' }
	}

	try {
		const { error } = await supabaseServer
			.from('translations_cache')
			.delete()
			.in('id', ids)

		if (error) {
			logger.error('[deleteMultipleTranslationCacheAction] Error:', error)
			throw error
		}

		return { success: true, deletedCount: ids.length }
	} catch (error) {
		logger.error('[deleteMultipleTranslationCacheAction] Error:', error)
		return {
			success: false,
			error: error.message || 'Error deleting translations'
		}
	}
}

/**
 * Add a manual translation to the cache
 */
export async function addTranslationCacheAction({
	searchedForm,
	lemma,
	sourceLang,
	targetLang,
	partOfSpeech,
	translations
}) {
	const { isAdmin } = await checkAdminAuth()
	if (!isAdmin) {
		return { success: false, error: 'Unauthorized' }
	}

	try {
		const { data, error } = await supabaseServer
			.from('translations_cache')
			.insert({
				searched_form: searchedForm.toLowerCase().trim(),
				lemma: lemma.toLowerCase().trim(),
				source_lang: sourceLang,
				target_lang: targetLang,
				part_of_speech: partOfSpeech || null,
				translations: translations,
				full_response: null,
				source: 'manual',
				usage_count: 0
			})
			.select()
			.single()

		if (error) {
			if (error.code === '23505') {
				return { success: false, error: 'Cette traduction existe deja' }
			}
			logger.error('[addTranslationCacheAction] Error:', error)
			throw error
		}

		return { success: true, data }
	} catch (error) {
		logger.error('[addTranslationCacheAction] Error:', error)
		return {
			success: false,
			error: error.message || 'Error adding translation'
		}
	}
}
