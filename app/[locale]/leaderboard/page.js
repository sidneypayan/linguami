import dynamic from 'next/dynamic'

import { getTranslations } from 'next-intl/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getLeaderboardData } from '@/lib/leaderboard'
// Lazy load LeaderboardClient for better performance
const LeaderboardClient = dynamic(() => import('@/components/leaderboard/LeaderboardClient'), {
	loading: () => (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			minHeight: '60vh',
			padding: '2rem'
		}}>
			<div style={{
				width: '40px',
				height: '40px',
				border: '4px solid #e2e8f0',
				borderTop: '4px solid #8b5cf6',
				borderRadius: '50%',
				animation: 'spin 1s linear infinite'
			}} />
		</div>
	),
	ssr: true // Keep SSR for SEO
})

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
	} = await supabase.auth.getUser()

	// Fetch leaderboard data server-side - NO API route needed!
	// Pass null for guests (they can view but won't have their own position)
	const leaderboardData = await getLeaderboardData(user?.id || null)

	// Pass everything to client component
	return <LeaderboardClient leaderboardData={leaderboardData} isGuest={!user} />
}
