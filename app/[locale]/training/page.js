import { getTranslations } from 'next-intl/server'
import TrainingPageClient from '@/components/training/TrainingPageClient'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'training' })

	return {
		title: `${t('pageTitle')} | Linguami`,
		description: t('pageDescription'),
	}
}

export default async function TrainingPage() {
	return <TrainingPageClient />
}
