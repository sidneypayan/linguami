'use client'

import Homepage from '@/components/homepage'
import { useTranslations, useLocale } from 'next-intl'
import { useRouterCompat } from '@/hooks/useRouterCompat'
// Head removed - use metadata in App Router


export default function Home() {
	const t = useTranslations('home')
	const locale = useLocale()
	const router = useRouterCompat()

	// Configuration des langues et locales
	const localeConfig = {
		fr: { og: 'fr_FR', locale: 'French', keywords: 'apprendre russe, cours russe, langue russe, apprendre langue russe, vocabulaire russe, grammaire russe, russe en ligne, Linguami' },
		ru: { og: 'ru_RU', locale: 'Russian', keywords: 'изучение французского, курсы французского, французский язык, изучать французский язык, словарный запас французского, грамматика французского, французский онлайн, Linguami' },
		en: { og: 'en_US', locale: 'English', keywords: 'learn russian, russian course, russian language, learn russian language, russian vocabulary, russian grammar, russian online, Linguami' }
	}

	const currentLocale = localeConfig[locale] || localeConfig.fr
	const currentUrl = `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}`

	// Schema JSON-LD pour les données structurées
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'EducationalOrganization',
		name: 'Linguami',
		description: t('description'),
		url: 'https://www.linguami.com',
		logo: 'https://www.linguami.com/logo.png',
		sameAs: [
			'https://www.facebook.com/linguami',
			'https://twitter.com/linguami',
			'https://www.instagram.com/linguami'
		],
		contactPoint: {
			'@type': 'ContactPoint',
			contactType: 'Customer Service',
			availableLanguage: ['French', 'Russian', 'English']
		},
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: '4.8',
			reviewCount: '150'
		}
	}

	return (
		<>
			<Homepage />
		</>
	)
}
