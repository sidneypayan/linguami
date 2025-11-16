import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import CreatePageClient from './pageClient'

export default async function CreatePage() {
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	return <CreatePageClient />
}
