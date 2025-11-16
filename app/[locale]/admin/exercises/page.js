import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import ExercisesPageClient from './pageClient'

export default async function ExercisesPage() {
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	return <ExercisesPageClient />
}
