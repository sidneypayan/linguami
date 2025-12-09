import { getTranslations } from 'next-intl/server'
import PremiumSuccessClient from '@/components/premium/PremiumSuccessClient'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'premium' })

	return {
		title: `${t('success_title')} | Linguami`,
		robots: { index: false, follow: false },
	}
}

export default async function PremiumSuccess({ searchParams }) {
	const { session_id } = await searchParams
	return <PremiumSuccessClient sessionId={session_id} />
}
