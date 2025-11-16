import { redirect, notFound } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin'
import { getLessonData, getUserCourseProgress } from '@/lib/method'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import LessonPageClient from '@/components/method/LessonPageClient'

export default async function LessonPage({ params }) {
	// TEMPORARY: Admin-only access until courses are finalized
	const { isAuthenticated, isAdmin, user } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	// Get params
	const { locale, level: levelSlug, lessonSlug } = await params

	// Get learning language from user profile or default
	// For now, default to 'fr' (will be replaced with user's learning language)
	const learningLanguage = 'fr' // TODO: Get from user context

	// Get spoken language from user profile
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	let spokenLanguage = locale // Default to interface language

	if (user) {
		const { data: profile } = await supabase
			.from('users_profile')
			.select('spoken_language, is_premium')
			.eq('id', user.id)
			.single()

		spokenLanguage = profile?.spoken_language || locale
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
