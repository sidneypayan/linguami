import { redirect } from 'next/navigation'
import { getAdminStats, checkAdminAuth } from '@/lib/admin'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

export default async function AdminPage({ params }) {
	const { locale } = await params
	// Check auth on server
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect(`/${locale}/login`)
	}

	if (!isAdmin) {
		redirect(`/${locale}`)
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
