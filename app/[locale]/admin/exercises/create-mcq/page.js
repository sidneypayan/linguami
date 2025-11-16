import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import CreateMcqClient from './pageClient'

export default async function CreateMcqPage() {
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	return <CreateMcqClient />
}
