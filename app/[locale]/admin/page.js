import { redirect } from 'next/navigation'
import { getAdminStats, checkAdminAuth } from '@/lib/admin'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

export default async function AdminPage() {
	// Check auth on server
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	// Fetch data on server
	const { materialsCountByLang, booksCountByLang } = await getAdminStats()

	// Pass data to client component
	return (
		<AdminDashboardClient
			initialMaterialsData={materialsCountByLang}
			initialBooksData={booksCountByLang}
		/>
	)
}
