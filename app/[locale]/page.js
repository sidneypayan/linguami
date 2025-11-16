import Homepage from '@/components/homepage'
import { getTranslations } from 'next-intl/server'
import SEO from '@/components/SEO'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'home' })

	// Configuration des langues et locales
	const localeConfig = {
		fr: { og: 'fr_FR', locale: 'French', keywords: 'apprendre russe, cours russe, langue russe, apprendre langue russe, vocabulaire russe, grammaire russe, russe en ligne, Linguami' },
		ru: { og: 'ru_RU', locale: 'Russian', keywords: 'изучение французского, курсы французского, французский язык, изучать французский язык, словарный запас французского, грамматика французского, французский онлайн, Linguami' },
		en: { og: 'en_US', locale: 'English', keywords: 'learn russian, russian course, russian language, learn russian language, russian vocabulary, russian grammar, russian online, Linguami' }
	}

	const currentLocale = localeConfig[locale] || localeConfig.fr

	return {
		title: `${t('pagetitle')} | Linguami`,
		description: t('description'),
		other: {
			'schema:keywords': currentLocale.keywords,
		},
	}
}

export default async function Home({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'home' })

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

	// Get all translations as plain objects (not functions)
	const translations = {
		description: t('description'),
		multimedia: t('multimedia'),
		discoverResources: t('discoverResources'),
		video: t('video'),
		videosubtitle: t('videosubtitle'),
		videosubtitleMobile: t('videosubtitleMobile'),
		audio: t('audio'),
		audiosubtitle: t('audiosubtitle'),
		audiosubtitleMobile: t('audiosubtitleMobile'),
		text: t('text'),
		textsubtitle: t('textsubtitle'),
		textsubtitleMobile: t('textsubtitleMobile'),
		dictionary: t('dictionary'),
		dictionarysubtitle: t('dictionarysubtitle'),
		dictionarysubtitleMobile: t('dictionarysubtitleMobile'),
		flashcards: t('flashcards'),
		flashcardssubtitle: t('flashcardssubtitle'),
		flashcardssubtitleMobile: t('flashcardssubtitleMobile'),
		learning_tools_title: t('learning_tools_title'),
		learning_tools_subtitle: t('learning_tools_subtitle'),
		translator: t('translator'),
		translatorsubtitle: t('translatorsubtitle'),
		teacher: t('teacher'),
		teachersubtitle: t('teachersubtitle'),
		giftranslatorsubtitle: t('giftranslatorsubtitle'),
		gifflashcardssubtitle: t('gifflashcardssubtitle'),
		badgeNew: t('badgeNew'),
		badgePopular: t('badgePopular'),
		badgePremium: t('badgePremium'),
		badgeEssential: t('badgeEssential'),
		viewDemo: t('viewDemo'),
	}

	return (
		<>
			<SEO
				title={`${t('pagetitle')} | Linguami`}
				description={t('description')}
				path="/"
				keywords={currentLocale.keywords}
				jsonLd={jsonLd}
			/>
			<Homepage translations={translations} />
		</>
	)
}
