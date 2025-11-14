'use client'

import Homepage from '@/components/homepage'
import useTranslation from 'next-translate/useTranslation'
import { useRouterCompat } from '@/hooks/useRouterCompat'
import Head from 'next/head'

export default function Home() {
	const { t, lang } = useTranslation('home')
	const router = useRouterCompat()

	// Configuration des langues et locales
	const localeConfig = {
		fr: { og: 'fr_FR', lang: 'French', keywords: 'apprendre russe, cours russe, langue russe, apprendre langue russe, vocabulaire russe, grammaire russe, russe en ligne, Linguami' },
		ru: { og: 'ru_RU', lang: 'Russian', keywords: 'изучение французского, курсы французского, французский язык, изучать французский язык, словарный запас французского, грамматика французского, французский онлайн, Linguami' },
		en: { og: 'en_US', lang: 'English', keywords: 'learn russian, russian course, russian language, learn russian language, russian vocabulary, russian grammar, russian online, Linguami' }
	}

	const currentLocale = localeConfig[lang] || localeConfig.fr
	const currentUrl = `https://www.linguami.com${lang === 'fr' ? '' : `/${lang}`}`

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
			<Head>
				<title>{`${t('pagetitle')} | Linguami`}</title>
				<meta name='description' content={t('description')} />

				{/* Balises hreflang pour le SEO multilingue */}
				<link rel='alternate' hrefLang='fr' href='https://www.linguami.com/' />
				<link rel='alternate' hrefLang='ru' href='https://www.linguami.com/ru' />
				<link rel='alternate' hrefLang='en' href='https://www.linguami.com/en' />
				<link rel='alternate' hrefLang='x-default' href='https://www.linguami.com/' />

				{/* Open Graph / Facebook */}
				<meta property='og:type' content='website' />
				<meta property='og:url' content={currentUrl} />
				<meta property='og:title' content={`${t('pagetitle')} | Linguami`} />
				<meta property='og:description' content={t('description')} />
				<meta property='og:image' content='https://www.linguami.com/og-image.jpg' />
				<meta property='og:image:width' content='1200' />
				<meta property='og:image:height' content='630' />
				<meta property='og:locale' content={currentLocale.og} />
				<meta property='og:locale:alternate' content='fr_FR' />
				<meta property='og:locale:alternate' content='ru_RU' />
				<meta property='og:locale:alternate' content='en_US' />
				<meta property='og:site_name' content='Linguami' />

				{/* Twitter */}
				<meta name='twitter:card' content='summary_large_image' />
				<meta name='twitter:url' content={currentUrl} />
				<meta name='twitter:title' content={`${t('pagetitle')} | Linguami`} />
				<meta name='twitter:description' content={t('description')} />
				<meta name='twitter:image' content='https://www.linguami.com/og-image.jpg' />

				{/* Métadonnées additionnelles */}
				<meta name='keywords' content={currentLocale.keywords} />
				<meta name='author' content='Linguami' />
				<meta name='language' content={currentLocale.lang} />
				<link rel='canonical' href={currentUrl} />

				{/* Schema JSON-LD pour Google */}
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>

				{/* Métadonnées supplémentaires pour les performances */}
				<meta httpEquiv='x-dns-prefetch-control' content='on' />
				<link rel='dns-prefetch' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.googleapis.com' crossOrigin='anonymous' />
			</Head>

			<Homepage />
		</>
	)
}
