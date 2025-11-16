import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import CreateFitbClient from './pageClient'

export default async function CreateFitbPage() {
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	return <CreateFitbClient />
}
