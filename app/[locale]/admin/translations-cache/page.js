import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import TranslationsCacheClient from './TranslationsCacheClient'

export default async function TranslationsCachePage({ params }) {
	const { locale } = await params
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect(`/${locale}/login`)
	}

	if (!isAdmin) {
		redirect(`/${locale}`)
	}

	return <TranslationsCacheClient />
}
