import { redirect, notFound } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin'
import { getLevelCourses, getUserCourseProgress } from '@/lib/method'
import { getStaticMethodLevels, getStaticLevelBySlug } from '@/lib/method-levels'
import LevelPageClient from '@/components/method/LevelPageClient'

export async function generateMetadata({ params }) {
	const { locale, level: levelSlug } = await params

	const currentLevel = getStaticLevelBySlug(levelSlug)

	if (!currentLevel) {
		return {
			title: 'Level not found | Linguami',
		}
	}

	const nameKey = `name_${locale}`
	const descKey = `description_${locale}`
	const levelName = currentLevel[nameKey] || levelSlug

	const baseUrl = 'https://www.linguami.com'
	const path = `/method/${levelSlug}`
	const currentUrl = `${baseUrl}${locale === 'fr' ? '' : `/${locale}`}${path}`

	const frUrl = `${baseUrl}${path}`
	const ruUrl = `${baseUrl}/ru${path}`
	const enUrl = `${baseUrl}/en${path}`

	return {
		title: `${levelName} | Linguami`,
		description: currentLevel[descKey] || '',
		authors: [{ name: 'Linguami' }],
		openGraph: {
			type: 'website',
			url: currentUrl,
			title: `${levelName} | Linguami`,
			description: currentLevel[descKey] || '',
			images: [
				{
					url: 'https://www.linguami.com/og-image.jpg',
					width: 1200,
					height: 630,
				},
			],
			siteName: 'Linguami',
			locale: locale === 'fr' ? 'fr_FR' : locale === 'ru' ? 'ru_RU' : 'en_US',
		},
		twitter: {
			card: 'summary_large_image',
			title: `${levelName} | Linguami`,
			description: currentLevel[descKey] || '',
			images: ['https://www.linguami.com/og-image.jpg'],
		},
		alternates: {
			canonical: currentUrl,
			languages: {
				fr: frUrl,
				ru: ruUrl,
				en: enUrl,
				'x-default': frUrl,
			},
		},
	}
}

export default async function LevelPage({ params, searchParams }) {
	// Get params first
	const { locale, level: levelSlug } = await params
	const resolvedSearchParams = await searchParams

	const { isAuthenticated, isAdmin, user, supabase } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect(`/${locale}/login`)
	}

	if (!isAdmin) {
		redirect(`/${locale}?error=admin_only`)
	}

	// Get learning language from user profile
	let learningLanguage = 'fr' // default
	if (user) {
		const { data: profile } = await supabase
			.from('users_profile')
			.select('learning_language')
			.eq('id', user.id)
			.single()
		if (profile?.learning_language) {
			learningLanguage = profile.learning_language
		}
	}

	// Allow admins to override language with ?lang= parameter
	if (isAdmin && resolvedSearchParams?.lang) {
		learningLanguage = resolvedSearchParams.lang
	}

	// Get current level from static data
	const currentLevel = getStaticLevelBySlug(levelSlug)

	if (!currentLevel) {
		notFound()
	}

	// Fetch courses for this level
	const courses = await getLevelCourses(currentLevel.id)

	console.log('[LevelPage] learningLanguage:', learningLanguage)
	console.log('[LevelPage] courses:', courses?.map(c => ({ id: c.id, target: c.target_language, lessons: c.course_lessons?.length })))

	// Find the course for the learning language
	const currentCourse = courses.find((c) => c.target_language === learningLanguage)

	console.log('[LevelPage] currentCourse:', currentCourse ? { id: currentCourse.id, lessons: currentCourse.course_lessons?.length } : 'NOT FOUND')

	if (!currentCourse) {
		// No course found for this level and learning language
		return (
			<LevelPageClient
				level={currentLevel}
				course={null}
				lessons={[]}
				userProgress={[]}
				isUserLoggedIn={isAuthenticated}
			/>
		)
	}

	// Fetch user progress if authenticated
	const userProgress = isAuthenticated
		? await getUserCourseProgress(currentCourse.id)
		: []

	return (
		<LevelPageClient
			level={currentLevel}
			course={currentCourse}
			lessons={currentCourse.course_lessons || []}
			userProgress={userProgress}
			isUserLoggedIn={isAuthenticated}
		/>
	)
}
