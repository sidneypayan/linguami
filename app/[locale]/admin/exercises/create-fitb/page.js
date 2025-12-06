import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import CreateFitbClient from './pageClient'

export default async function CreateFitbPage({ params }) {
	const { locale } = await params
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect(`/${locale}/login`)
	}

	if (!isAdmin) {
		redirect(`/${locale}`)
	}

	return <CreateFitbClient />
}
