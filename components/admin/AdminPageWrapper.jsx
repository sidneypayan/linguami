import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin'

/**
 * Wrapper for admin pages - handles auth check server-side
 * Usage: Wrap your client component with this server component
 */
export default async function AdminPageWrapper({ children }) {
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	return <>{children}</>
}
