import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import PreviewExerciseClient from './pageClient'

export default async function PreviewExercisePage(props) {
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	return <PreviewExerciseClient {...props} />
}
