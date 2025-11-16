import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import UsersPageClient from './UsersPageClient'

export default async function UsersPage() {
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	return <UsersPageClient />
}
