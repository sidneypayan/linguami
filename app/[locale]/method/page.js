import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin'
import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { getUserAccess } from '@/lib/method'
import { getStaticMethodLevels } from '@/lib/method-levels'
import MethodPageClient from '@/components/method/MethodPageClient'

export default async function MethodPage({ params }) {
	// Get locale from params first
	const { locale } = await params

	// Check if user is authenticated and is admin
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		// Not logged in - redirect to login
		redirect(`/${locale}/login`)
	}

	if (!isAdmin) {
		// Logged in but not admin - redirect to home with error
		redirect(`/${locale}?error=admin_only`)
	}

	// Get static levels (no DB fetch)
	const levels = getStaticMethodLevels()

	// Fetch user access if authenticated
	const userAccess = await getUserAccess(locale)

	return <MethodPageClient levels={levels} userAccess={userAccess} />
}
