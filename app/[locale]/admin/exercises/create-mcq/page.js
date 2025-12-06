import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import CreateMcqClient from './pageClient'

export default async function CreateMcqPage({ params }) {
	const { locale } = await params
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect(`/${locale}/login`)
	}

	if (!isAdmin) {
		redirect(`/${locale}`)
	}

	return <CreateMcqClient />
}
