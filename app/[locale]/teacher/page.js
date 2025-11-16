import { getTranslations } from 'next-intl/server'
import TeacherClient from '@/components/teacher/TeacherClient'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'teacher' })

	const titles = {
		fr: 'Votre Professeur Personnel',
		ru: 'Ваш Личный Преподаватель',
		en: 'Your Personal Teacher',
	}

	const descriptions = {
		fr: 'Rencontrez votre professeur personnel pour apprendre le russe ou le français. Cours particuliers personnalisés.',
		ru: 'Познакомьтесь с вашим личным преподавателем для изучения русского или французского языка. Персонализированные частные уроки.',
		en: 'Meet your personal teacher to learn Russian or French. Personalized private lessons.',
	}

	const baseUrl = 'https://www.linguami.com'
	const path = '/teacher'
	const currentUrl = `${baseUrl}${locale === 'fr' ? '' : `/${locale}`}${path}`
	const frUrl = `${baseUrl}${path}`
	const ruUrl = `${baseUrl}/ru${path}`
	const enUrl = `${baseUrl}/en${path}`

	return {
		title: `${titles[locale] || titles.fr} | Linguami`,
		description: descriptions[locale] || descriptions.fr,
		keywords:
			locale === 'fr'
				? 'professeur russe, cours particuliers russe, apprendre russe avec professeur'
				: locale === 'ru'
					? 'преподаватель французского, частные уроки французского'
					: 'russian teacher, french teacher, private lessons',
		authors: [{ name: 'Linguami' }],
		openGraph: {
			type: 'website',
			url: currentUrl,
			title: `${titles[locale] || titles.fr} | Linguami`,
			description: descriptions[locale] || descriptions.fr,
			images: [
				{
					url: 'https://www.linguami.com/og-image.jpg',
					width: 1200,
					height: 630,
				},
			],
			siteName: 'Linguami',
			locale: locale === 'fr' ? 'fr_FR' : locale === 'ru' ? 'ru_RU' : 'en_US',
		},
		twitter: {
			card: 'summary_large_image',
			title: `${titles[locale] || titles.fr} | Linguami`,
			description: descriptions[locale] || descriptions.fr,
			images: ['https://www.linguami.com/og-image.jpg'],
		},
		alternates: {
			canonical: currentUrl,
			languages: {
				fr: frUrl,
				ru: ruUrl,
				en: enUrl,
				'x-default': frUrl,
			},
		},
	}
}

export default function TeacherPage() {
	return <TeacherClient />
}
