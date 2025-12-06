import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import EditExerciseClient from './pageClient'

export default async function EditExercisePage(props) {
	const { params } = props
	const { locale } = await params
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect(`/${locale}/login`)
	}

	if (!isAdmin) {
		redirect(`/${locale}`)
	}

	return <EditExerciseClient {...props} />
}
