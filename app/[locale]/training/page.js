import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { checkVipAuth } from '@/lib/admin'
import TrainingPageClient from '@/components/training/TrainingPageClient'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'training' })

	return {
		title: `${t('pageTitle')} | Linguami`,
		description: t('pageDescription'),
	}
}

export default async function TrainingPage({ params }) {
	const { locale } = await params

	// Check if user is authenticated and is admin or VIP
	const { isAuthenticated, hasAccess } = await checkVipAuth()

	if (!isAuthenticated) {
		// Not logged in - redirect to login
		redirect(`/${locale}/login`)
	}

	if (!hasAccess) {
		// Logged in but not admin or VIP - redirect to home with error
		redirect(`/${locale}?error=vip_only`)
	}

	return <TrainingPageClient />
}
