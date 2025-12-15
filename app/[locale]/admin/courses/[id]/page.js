import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import EditCoursePageClient from './pageClient'

export default async function EditCoursePage({ params }) {
	const { locale, id } = await params
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect(`/${locale}/login`)
	}

	if (!isAdmin) {
		redirect(`/${locale}`)
	}

	return <EditCoursePageClient courseId={parseInt(id)} />
}
