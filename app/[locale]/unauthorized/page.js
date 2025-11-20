import UnauthorizedView from '@/components/shared/UnauthorizedView'

export async function generateMetadata({ params }) {
	const { locale } = await params

	const titles = {
		fr: 'Accès refusé',
		ru: 'Доступ запрещён',
		en: 'Access Denied',
	}

	return {
		title: `${titles[locale] || titles.fr} | Linguami`,
		robots: {
			index: false,
			follow: false,
		},
	}
}

export default function UnauthorizedPage() {
	return <UnauthorizedView />
}
