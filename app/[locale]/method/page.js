import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { getUserAccess } from '@/lib/method'
import { getStaticMethodLevels } from '@/lib/method-levels'
import MethodPageClient from '@/components/method/MethodPageClient'

export default async function MethodPage({ params }) {
	// Get locale from params first
	const { locale } = await params

	// Check if user is authenticated (not admin, just logged in)
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		// Preserve locale when redirecting to login
		redirect(`/${locale}/login`)
	}

	// Get static levels (no DB fetch)
	const levels = getStaticMethodLevels()

	// Fetch user access if authenticated
	const userAccess = await getUserAccess(locale)

	return <MethodPageClient levels={levels} userAccess={userAccess} />
}
