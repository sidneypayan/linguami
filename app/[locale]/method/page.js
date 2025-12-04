import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin'
import { getMethodLevels, getUserAccess } from '@/lib/method'
import MethodPageClient from '@/components/method/MethodPageClient'

export default async function MethodPage({ params }) {
	const { isAuthenticated } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	// Get locale from params
	const { locale } = await params

	// Fetch levels
	const levels = await getMethodLevels()

	// Fetch user access if authenticated
	const userAccess = isAuthenticated ? await getUserAccess(locale) : []

	return <MethodPageClient levels={levels} userAccess={userAccess} />
}
