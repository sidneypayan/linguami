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
		.select('role, is_premium, spoken_language, learning_language')
		.eq('id', user.id)
		.single()

	return {
		isAuthenticated: true,
		isAdmin: profile?.role === 'admin',
		isPremium: !!profile?.is_premium,
		spokenLanguage: profile?.spoken_language,
		learningLanguage: profile?.learning_language,
		user,
		supabase,
	}
}

/**
 * Check if user is admin OR VIP
 * Returns user profile with admin and VIP status
 */
export async function checkVipAuth() {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()

	if (error || !user) {
		return { isAuthenticated: false, isAdmin: false, isVip: false, user: null }
	}

	// Get user profile to check admin and VIP role
	const { data: profile } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	const isAdmin = profile?.role === 'admin'
	const isVip = profile?.role === 'vip'

	return {
		isAuthenticated: true,
		isAdmin,
		isVip,
		hasAccess: isAdmin || isVip,
		user,
		supabase,
	}
}
