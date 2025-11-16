import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import CreateDragDropClient from './pageClient'

export default async function CreateDragDropPage() {
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	return <CreateDragDropClient />
}
