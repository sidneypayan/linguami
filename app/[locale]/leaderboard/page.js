import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getLeaderboardData } from '@/lib/leaderboard'
import LeaderboardClient from '@/components/leaderboard/LeaderboardClient'

// Metadata for SEO
export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'common' })

	return {
		title: t('leaderboardTitle'),
		description: t('leaderboardDescription'),
	}
}

export default async function LeaderboardPage({ params }) {
	const { locale } = await params

	// Get authenticated user server-side
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
					cookiesToSet.forEach(({ name, value, options }) => {
						cookieStore.set(name, value, options)
					})
				},
			},
		}
	)

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	// Redirect to login if not authenticated
	if (!user || authError) {
		notFound()
	}

	// Fetch leaderboard data server-side - NO API route needed!
	const leaderboardData = await getLeaderboardData(user.id)

	// Pass everything to client component
	return <LeaderboardClient leaderboardData={leaderboardData} />
}
