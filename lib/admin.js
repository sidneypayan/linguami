import 'server-only'
import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

/**
 * Get admin dashboard statistics
 * Fetches materials, videos, and books count by language
 */
export async function getAdminStats() {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const langs = ['fr', 'ru']

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

	// Fetch materials count by language
	const materialsData = await Promise.all(
		langs.map(async (lang) => {
			const videoSections = lang === 'ru' ? videoSectionsRu : videoSectionsFr
			const allSections = [...audioTextSections, ...videoSections, 'book-chapters']

			// Count audio/text materials
			const { count: audioTextCount } = await supabase
				.from('materials')
				.select('id', { count: 'exact', head: true })
				.in('section', audioTextSections)
				.eq('lang', lang)

			// Count video materials
			const { count: videoCount } = await supabase
				.from('materials')
				.select('id', { count: 'exact', head: true })
				.in('section', videoSections)
				.eq('lang', lang)

			// Count each section individually
			const sectionCounts = await Promise.all(
				allSections.map(async (section) => {
					const { count } = await supabase
						.from('materials')
						.select('id', { count: 'exact', head: true })
						.eq('section', section)
						.eq('lang', lang)

					return { section, count: count || 0 }
				})
			)

			return {
				lang,
				audioTextCount: audioTextCount || 0,
				videoCount: videoCount || 0,
				sections: sectionCounts.filter((s) => s.count > 0),
			}
		})
	)

	// Fetch books count by language
	const booksData = await Promise.all(
		langs.map(async (lang) => {
			const { count } = await supabase
				.from('books')
				.select('id', { count: 'exact', head: true })
				.eq('lang', lang)

			return { lang, count: count || 0 }
		})
	)

	return {
		materialsCountByLang: materialsData,
		booksCountByLang: booksData,
	}
}

/**
 * Check if user is admin
 * Returns user profile with admin status
 */
export async function checkAdminAuth() {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()

	if (error || !user) {
		return { isAuthenticated: false, isAdmin: false, user: null }
	}

	// Get user profile to check admin status
	const { data: profile } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	return {
		isAuthenticated: true,
		isAdmin: profile?.role === 'admin',
		user,
	}
}
