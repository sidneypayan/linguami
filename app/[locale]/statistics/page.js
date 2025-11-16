import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getStatistics, getGoals } from '@/lib/statistics'
import StatisticsClient from '@/components/statistics/StatisticsClient'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'stats' })

	const titles = {
		fr: 'Mes Statistiques',
		ru: 'Моя Статистика',
		en: 'My Statistics',
	}

	const descriptions = {
		fr: 'Suivez votre progression, vos objectifs et vos badges. Consultez vos statistiques de vocabulaire et de révision.',
		ru: 'Отслеживайте свой прогресс, цели и значки. Просматривайте статистику по словарному запасу и повторениям.',
		en: 'Track your progress, goals and badges. View your vocabulary and review statistics.',
	}

	return {
		title: `${titles[locale] || titles.fr} | Linguami`,
		description: descriptions[locale] || descriptions.fr,
		robots: {
			index: false,
			follow: false,
		},
	}
}

export default async function StatisticsPage({ params }) {
	const { locale } = await params

	// Create Supabase client with cookies
	const cookieStore = await cookies()
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						cookieStore.set(name, value, options)
					)
				},
			},
		}
	)

	// Get authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (!user || authError) {
		notFound()
	}

	// Fetch user profile for XP data
	const { data: userProfile } = await supabase
		.from('users_profile')
		.select('xp, level, streak, longest_streak, gold, xp_in_current_level')
		.eq('id', user.id)
		.single()

	// Calculate xpProfile format expected by the component
	let xpProfile = null
	if (userProfile && userProfile.xp !== undefined) {
		const currentLevel = userProfile.level || 1
		const xpForNextLevel = Math.ceil(100 * Math.pow(currentLevel, 1.5))
		const xpInLevel = userProfile.xp_in_current_level || 0
		const progressPercent = Math.min(Math.floor((xpInLevel / xpForNextLevel) * 100), 100)

		xpProfile = {
			currentLevel: currentLevel,
			totalXp: userProfile.xp || 0,
			totalGold: userProfile.gold || 0,
			dailyStreak: userProfile.streak || 0,
			longestStreak: userProfile.longest_streak || userProfile.streak || 0,
			xpInCurrentLevel: xpInLevel,
			xpForNextLevel: xpForNextLevel,
			progressPercent: progressPercent,
		}
	}

	// Fetch statistics and goals server-side
	const [stats, goals] = await Promise.all([
		getStatistics(user.id),
		getGoals(user.id),
	])

	// Get translations for the client component
	const t = await getTranslations({ locale, namespace: 'stats' })

	const translations = {
		pageTitle: t('pageTitle'),
		pageDescription: t('pageDescription'),
		wordsReviewedToday: t('wordsReviewedToday'),
		wordsReviewedThisWeek: t('wordsReviewedThisWeek'),
		wordsReviewedThisMonth: t('wordsReviewedThisMonth'),
		totalWordsReviewed: t('totalWordsReviewed'),
		materialsStarted: t('materialsStarted'),
		materialsFinished: t('materialsFinished'),
		level: t('level'),
		dayStreak: t('dayStreak'),
		gold: t('gold'),
		record: t('record'),
		bestStreak: t('bestStreak'),
		goals: t('goals'),
		dailyGoal: t('dailyGoal'),
		weeklyGoal: t('weeklyGoal'),
		monthlyGoal: t('monthlyGoal'),
		badges: t('badges'),
		levelBadges: t('levelBadges'),
		wordsReviewedBadges: t('wordsReviewedBadges'),
		vocabularySection: t('vocabularySection'),
		materialsSection: t('materialsSection'),
	}

	return (
		<StatisticsClient
			stats={stats}
			xpProfile={xpProfile}
			goals={goals}
			t={(key) => translations[key] || key}
		/>
	)
}
