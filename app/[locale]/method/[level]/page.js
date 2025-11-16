import { redirect, notFound } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin'
import { getMethodLevels, getLevelCourses, getUserCourseProgress } from '@/lib/method'
import LevelPageClient from '@/components/method/LevelPageClient'

export async function generateMetadata({ params }) {
	const { locale, level: levelSlug } = await params

	const levels = await getMethodLevels()
	const currentLevel = levels.find((l) => l.slug === levelSlug)

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

export default async function LevelPage({ params }) {
	// TEMPORARY: Admin-only access until courses are finalized
	const { isAuthenticated, isAdmin, user } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	// Get params
	const { locale, level: levelSlug } = await params

	// Get learning language from user profile or default
	// For now, default to 'fr' (will be replaced with user's learning language from context)
	const learningLanguage = 'fr' // TODO: Get from user context

	// Fetch levels to find current level
	const levels = await getMethodLevels()
	const currentLevel = levels.find((l) => l.slug === levelSlug)

	if (!currentLevel) {
		notFound()
	}

	// Fetch courses for this level
	const courses = await getLevelCourses(currentLevel.id)

	// Find the course for the learning language
	const currentCourse = courses.find((c) => c.target_language === learningLanguage)

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
