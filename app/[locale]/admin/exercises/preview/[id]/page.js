import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import PreviewExerciseClient from './pageClient'

export default async function PreviewExercisePage(props) {
	const { params } = props
	const { locale } = await params
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect(`/${locale}/login`)
	}

	if (!isAdmin) {
		redirect(`/${locale}`)
	}

	return <PreviewExerciseClient {...props} />
}
