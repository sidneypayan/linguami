'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { logger } from '@/utils/logger'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schemas
const LanguageSchema = z.enum(['fr', 'ru', 'en'])
const BlogPostIdSchema = z.number().int().positive('Blog post ID must be a positive integer')

const BlogPostSchema = z.object({
	title: z.string().min(1, 'Title is required').max(200),
	slug: z.string()
		.min(1, 'Slug is required')
		.max(200)
		.regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
	excerpt: z.string().min(1, 'Excerpt is required').max(500),
	content: z.string().min(1, 'Content is required'),
	lang: LanguageSchema,
	img: z.string().optional(),
	meta_description: z.string().max(160).optional(),
	meta_keywords: z.array(z.string()).optional(),
	is_published: z.boolean().default(false),
	published_at: z.string().optional(), // ISO date string
})

/**
 * Get all blog posts (admin view)
 * @param {Object} params
 * @param {string} params.lang - Language filter (optional)
 * @returns {Promise<Object>} { success, data, error }
 */
export async function getAllBlogPostsAction({ lang } = {}) {
	try {
		const supabase = createServerClient(await cookies())

		// Check admin auth
		const { data: { user }, error: authError } = await supabase.auth.getUser()
		if (authError || !user) {
			return { success: false, error: 'Unauthorized' }
		}

		const { data: profile } = await supabase
			.from('users_profile')
			.select('role')
			.eq('id', user.id)
			.single()

		if (!profile || profile.role !== 'admin') {
			return { success: false, error: 'Admin access required' }
		}

		let query = supabase
			.from('blog_posts')
			.select('*')
			.order('published_at', { ascending: false })

		if (lang) {
			const validLang = LanguageSchema.parse(lang)
			query = query.eq('lang', validLang)
		}

		const { data, error } = await query

		if (error) throw error

		return { success: true, data: data || [] }
	} catch (error) {
		logger.error('Error fetching blog posts:', error)
		return { success: false, error: error.message }
	}
}

/**
 * Get published blog posts for public display
 * @param {string} lang - Language
 * @returns {Promise<Array>} Published blog posts
 */
export async function getPublishedBlogPostsAction(lang) {
	try {
		const validLang = LanguageSchema.parse(lang)
		const supabase = createServerClient(await cookies())

		const { data, error } = await supabase
			.from('blog_posts')
			.select('id, title, slug, excerpt, img, published_at, lang')
			.eq('lang', validLang)
			.eq('is_published', true)
			.order('published_at', { ascending: false })

		if (error) throw error

		return data || []
	} catch (error) {
		logger.error('Error fetching published blog posts:', error)
		return []
	}
}

/**
 * Get a single blog post by slug
 * @param {Object} params
 * @param {string} params.slug - Post slug
 * @param {string} params.lang - Language
 * @returns {Promise<Object|null>} Blog post or null
 */
export async function getBlogPostBySlugAction({ slug, lang }) {
	try {
		const validLang = LanguageSchema.parse(lang)
		const supabase = createServerClient(await cookies())

		const { data, error } = await supabase
			.from('blog_posts')
			.select('*')
			.eq('slug', slug)
			.eq('lang', validLang)
			.eq('is_published', true)
			.single()

		if (error) {
			if (error.code === 'PGRST116') return null // Not found
			throw error
		}

		return data
	} catch (error) {
		logger.error('Error fetching blog post by slug:', error)
		return null
	}
}

/**
 * Get a blog post by ID (admin)
 * @param {number} id - Post ID
 * @returns {Promise<Object>} { success, data, error }
 */
export async function getBlogPostByIdAction(id) {
	try {
		const validId = BlogPostIdSchema.parse(id)
		const supabase = createServerClient(await cookies())

		// Check admin auth
		const { data: { user }, error: authError } = await supabase.auth.getUser()
		if (authError || !user) {
			return { success: false, error: 'Unauthorized' }
		}

		const { data: profile } = await supabase
			.from('users_profile')
			.select('role')
			.eq('id', user.id)
			.single()

		if (!profile || profile.role !== 'admin') {
			return { success: false, error: 'Admin access required' }
		}

		const { data, error } = await supabase
			.from('blog_posts')
			.select('*')
			.eq('id', validId)
			.single()

		if (error) throw error

		return { success: true, data }
	} catch (error) {
		logger.error('Error fetching blog post by ID:', error)
		return { success: false, error: error.message }
	}
}

/**
 * Create a new blog post
 * @param {Object} postData - Blog post data
 * @returns {Promise<Object>} { success, data, error }
 */
export async function createBlogPostAction(postData) {
	try {
		const supabase = createServerClient(await cookies())

		// Check admin auth
		const { data: { user }, error: authError } = await supabase.auth.getUser()
		if (authError || !user) {
			return { success: false, error: 'Unauthorized' }
		}

		const { data: profile } = await supabase
			.from('users_profile')
			.select('role')
			.eq('id', user.id)
			.single()

		if (!profile || profile.role !== 'admin') {
			return { success: false, error: 'Admin access required' }
		}

		// Validate input
		const validatedData = BlogPostSchema.parse(postData)

		// Add author
		const insertData = {
			...validatedData,
			author_id: user.id,
			published_at: validatedData.is_published
				? validatedData.published_at || new Date().toISOString()
				: null,
		}

		const { data, error } = await supabase
			.from('blog_posts')
			.insert([insertData])
			.select()
			.single()

		if (error) throw error

		// Revalidate blog pages
		revalidatePath(`/[locale]/blog`)
		revalidatePath(`/[locale]/blog/${data.slug}`)

		return { success: true, data }
	} catch (error) {
		logger.error('Error creating blog post:', error)
		return { success: false, error: error.message }
	}
}

/**
 * Update a blog post
 * @param {number} id - Post ID
 * @param {Object} postData - Updated data
 * @returns {Promise<Object>} { success, data, error }
 */
export async function updateBlogPostAction(id, postData) {
	try {
		const validId = BlogPostIdSchema.parse(id)
		const supabase = createServerClient(await cookies())

		// Check admin auth
		const { data: { user }, error: authError } = await supabase.auth.getUser()
		if (authError || !user) {
			return { success: false, error: 'Unauthorized' }
		}

		const { data: profile } = await supabase
			.from('users_profile')
			.select('role')
			.eq('id', user.id)
			.single()

		if (!profile || profile.role !== 'admin') {
			return { success: false, error: 'Admin access required' }
		}

		// Validate input
		const validatedData = BlogPostSchema.partial().parse(postData)

		// Handle published_at
		const updateData = { ...validatedData }
		if (validatedData.is_published && !validatedData.published_at) {
			updateData.published_at = new Date().toISOString()
		} else if (!validatedData.is_published) {
			updateData.published_at = null
		}

		const { data, error } = await supabase
			.from('blog_posts')
			.update(updateData)
			.eq('id', validId)
			.select()
			.single()

		if (error) throw error

		// Revalidate blog pages
		revalidatePath(`/[locale]/blog`)
		revalidatePath(`/[locale]/blog/${data.slug}`)

		return { success: true, data }
	} catch (error) {
		logger.error('Error updating blog post:', error)
		return { success: false, error: error.message }
	}
}

/**
 * Delete a blog post
 * @param {number} id - Post ID
 * @returns {Promise<Object>} { success, error }
 */
export async function deleteBlogPostAction(id) {
	try {
		const validId = BlogPostIdSchema.parse(id)
		const supabase = createServerClient(await cookies())

		// Check admin auth
		const { data: { user }, error: authError } = await supabase.auth.getUser()
		if (authError || !user) {
			return { success: false, error: 'Unauthorized' }
		}

		const { data: profile } = await supabase
			.from('users_profile')
			.select('role')
			.eq('id', user.id)
			.single()

		if (!profile || profile.role !== 'admin') {
			return { success: false, error: 'Admin access required' }
		}

		const { error } = await supabase
			.from('blog_posts')
			.delete()
			.eq('id', validId)

		if (error) throw error

		// Revalidate blog pages
		revalidatePath(`/[locale]/blog`)

		return { success: true }
	} catch (error) {
		logger.error('Error deleting blog post:', error)
		return { success: false, error: error.message }
	}
}
