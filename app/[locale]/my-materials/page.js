import { getTranslations } from 'next-intl/server'
import MyMaterialsClient from '@/components/materials/MyMaterialsClient'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'materials' })

	const titles = {
		fr: 'Mes Matériaux',
		ru: 'Мои Материалы',
		en: 'My Materials',
	}

	const descriptions = {
		fr: 'Gérez vos matériaux sauvegardés. Suivez votre progression et continuez votre apprentissage.',
		ru: 'Управляйте своими сохраненными материалами. Отслеживайте прогресс и продолжайте обучение.',
		en: 'Manage your saved materials. Track your progress and continue your learning.',
	}

	return {
		title: `${titles[locale] || titles.fr} | Linguami`,
		description: descriptions[locale] || descriptions.fr,
		robots: {
			index: false,
			follow: false,
		},
	}
}

export default function MyMaterialsPage() {
	return <MyMaterialsClient />
}
