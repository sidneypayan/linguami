import { checkAdminAuth } from '@/lib/admin'
import { redirect } from 'next/navigation'
import TranslationsCacheClient from './TranslationsCacheClient'

export default async function TranslationsCachePage() {
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect('/login')
	}

	if (!isAdmin) {
		redirect('/')
	}

	return <TranslationsCacheClient />
}
