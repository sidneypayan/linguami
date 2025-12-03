import { redirect, notFound } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin'
import { getLessonData, getUserCourseProgress } from '@/lib/method'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import LessonPageClient from '@/components/method/LessonPageClient'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }) {
	const { locale, level: levelSlug, lessonSlug } = await params

	// Try to get learning language from user profile, fallback to trying both ru and fr
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	let learningLanguage = 'ru' // Default to Russian since most lessons are Russian
	const { data: { user } } = await supabase.auth.getUser()
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

	const lessonData = await getLessonData(levelSlug, lessonSlug, learningLanguage)

	if (!lessonData) {
		return {
			title: 'Lesson not found | Linguami',
		}
	}

	const { level, lesson } = lessonData
	const t = await getTranslations({ locale, namespace: 'common' })

	const titleKey = `title_${locale}`
	const objectivesKey = `objectives_${locale}`
	const objectives = lesson[objectivesKey] || lesson.objectives || lesson.objectives_fr || []

	const baseUrl = 'https://www.linguami.com'
	const path = `/method/${levelSlug}/${lessonSlug}`
	const currentUrl = `${baseUrl}${locale === 'fr' ? '' : `/${locale}`}${path}`

	const frUrl = `${baseUrl}${path}`
	const ruUrl = `${baseUrl}/ru${path}`
	const enUrl = `${baseUrl}/en${path}`

	return {
		title: `${lesson[titleKey]} | ${t('methode_title')}`,
		description: `${t('methode_lesson')} ${lesson[titleKey]} - ${objectives.join(', ')}`,
		authors: [{ name: 'Linguami' }],
		openGraph: {
			type: 'website',
			url: currentUrl,
			title: `${lesson[titleKey]} | ${t('methode_title')}`,
			description: `${t('methode_lesson')} ${lesson[titleKey]} - ${objectives.join(', ')}`,
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
			title: `${lesson[titleKey]} | ${t('methode_title')}`,
			description: `${t('methode_lesson')} ${lesson[titleKey]} - ${objectives.join(', ')}`,
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

export default async function LessonPage({ params }) {
	const { isAuthenticated, user } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	// Get params
	const { locale, level: levelSlug, lessonSlug } = await params

	// Get spoken language and learning language from user profile
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	let spokenLanguage = locale // Default to interface language
	let learningLanguage = 'ru' // Default to Russian

	if (user) {
		const { data: profile } = await supabase
			.from('users_profile')
			.select('spoken_language, learning_language, is_premium')
			.eq('id', user.id)
			.single()

		spokenLanguage = profile?.spoken_language || locale
		learningLanguage = profile?.learning_language || 'ru'
	}

	// Fetch lesson data
	const lessonData = await getLessonData(levelSlug, lessonSlug, learningLanguage)

	if (!lessonData) {
		notFound()
	}

	const { level, course, lesson } = lessonData

	// Fetch user progress
	const userProgress = isAuthenticated
		? await getUserCourseProgress(course.id)
		: []

	// Check if user has access to this lesson
	const isFreeLesson = lesson.is_free === true
	const userHasAccess = isFreeLesson || isAuthenticated // TODO: Add proper premium check

	// Get user's premium status
	let isPremium = false
	if (user) {
		const { data: profile } = await supabase
			.from('users_profile')
			.select('is_premium')
			.eq('id', user.id)
			.single()

		isPremium = profile?.is_premium || false
	}

	return (
		<LessonPageClient
			level={level}
			course={course}
			lesson={lesson}
			spokenLanguage={spokenLanguage}
			userHasAccess={userHasAccess}
			isPremium={isPremium}
			isUserLoggedIn={isAuthenticated}
			initialProgress={userProgress}
		/>
	)
}
