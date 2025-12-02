import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import { getUsers } from '@/app/actions/admin'
import UsersPageClient from './UsersPageClient'

export default async function UsersPage() {
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	// Fetch users server-side
	const result = await getUsers()
	const users = result.success ? result.users : []

	return <UsersPageClient initialUsers={users} />
}
