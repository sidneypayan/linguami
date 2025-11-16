import { redirect, notFound } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin'
import { getMethodLevels, getLevelCourses, getUserCourseProgress } from '@/lib/method'
import LevelPageClient from '@/components/method/LevelPageClient'

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
