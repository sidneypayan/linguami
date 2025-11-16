import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import EditExerciseClient from './pageClient'

export default async function EditExercisePage(props) {
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	return <EditExerciseClient {...props} />
}
