import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin'
import { getLessons } from '@/lib/lessons'
import LessonsPageClient from '@/components/lessons/LessonsPageClient'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params, searchParams }) {
	const { locale } = await params
	const resolvedSearchParams = await searchParams
	const slug = resolvedSearchParams?.slug

	const t = await getTranslations({ locale, namespace: 'lessons' })

	// SEO keywords by language
	const keywordsByLang = {
		fr: 'leçons russe, cours russe, exercices russe, grammaire russe, apprendre russe en ligne, leçons interactives',
		ru: 'уроки французского, курсы французского, упражнения французский, грамматика французского, учить французский онлайн',
		en: 'russian lessons, french lessons, language courses, interactive lessons, learn russian online, learn french online',
	}

	const baseUrl = 'https://www.linguami.com'
	const path = '/lessons'

	// If a specific lesson is selected, generate metadata for that lesson
	if (slug) {
		const targetLanguage = 'fr' // Hardcoded for now (teaching French)
		const lessons = await getLessons(targetLanguage, locale)
		const lesson = lessons.find((l) => l.slug === slug)

		if (lesson) {
			const lessonTitle =
				locale === 'fr'
					? lesson.title_fr
					: locale === 'ru'
						? lesson.title_ru
						: lesson.title_fr

			const currentUrl = `${baseUrl}${locale === 'fr' ? '' : `/${locale}`}${path}?slug=${slug}`
			const frUrl = `${baseUrl}${path}?slug=${slug}`
			const ruUrl = `${baseUrl}/ru${path}?slug=${slug}`
			const enUrl = `${baseUrl}/en${path}?slug=${slug}`

			return {
				title: `${lessonTitle} | ${t('pagetitle')}`,
				description: `${t('pagetitle')} - ${lessonTitle}`,
				keywords: keywordsByLang[locale] || keywordsByLang.fr,
				authors: [{ name: 'Linguami' }],
				openGraph: {
					type: 'article',
					url: currentUrl,
					title: `${lessonTitle} | ${t('pagetitle')}`,
					description: `${t('pagetitle')} - ${lessonTitle}`,
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
					title: `${lessonTitle} | ${t('pagetitle')}`,
					description: `${t('pagetitle')} - ${lessonTitle}`,
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
	}

	// Default metadata for lessons index page
	const currentUrl = `${baseUrl}${locale === 'fr' ? '' : `/${locale}`}${path}`
	const frUrl = `${baseUrl}${path}`
	const ruUrl = `${baseUrl}/ru${path}`
	const enUrl = `${baseUrl}/en${path}`

	return {
		title: `${t('pagetitle')} | Linguami`,
		description: t('description'),
		keywords: keywordsByLang[locale] || keywordsByLang.fr,
		authors: [{ name: 'Linguami' }],
		openGraph: {
			type: 'website',
			url: currentUrl,
			title: `${t('pagetitle')} | Linguami`,
			description: t('description'),
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
			title: `${t('pagetitle')} | Linguami`,
			description: t('description'),
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

export default async function LessonsPage({ params }) {
	// Get locale from params
	const { locale } = await params

	// Check if user is authenticated and is admin
	const { isAuthenticated, isAdmin, spokenLanguage: userSpokenLanguage } = await checkAdminAuth()

	if (!isAuthenticated) {
		// Not logged in - redirect to login
		redirect(`/${locale}/login`)
	}

	if (!isAdmin) {
		// Logged in but not admin - redirect to home with error
		redirect(`/${locale}?error=admin_only`)
	}

	// Determine target language and spoken language
	// For now, hardcode: teaching French to Russian/English speakers
	// TODO: Get userLearningLanguage from user context
	const targetLanguage = 'fr' // Teaching French
	const spokenLanguage = userSpokenLanguage || locale // Use user's spoken language, fallback to interface language

	// Fetch lessons from server
	const lessons = await getLessons(targetLanguage, spokenLanguage)

	return <LessonsPageClient initialLessons={lessons} />
}
