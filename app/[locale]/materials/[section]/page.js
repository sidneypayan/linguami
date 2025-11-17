import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { getMaterialsBySection, getBooksByLanguage, getUserMaterialsStatus } from '@/app/data/materials'
import SectionPageClient from '@/components/materials/SectionPageClient'

// Helper: determine default learning language based on interface locale
function getDefaultLearningLanguage(locale) {
	if (locale === 'fr') return 'ru'
	if (locale === 'ru') return 'fr'
	if (locale === 'en') return 'fr'
	return 'fr'
}

export async function generateMetadata({ params }) {
	const { locale, section } = await params
	const t = await getTranslations({ locale, namespace: 'materials' })

	// SEO keywords by section and language
	const sectionName = t(section || 'materials')
	let keywords
	if (locale === 'fr') {
		keywords = `${sectionName} russe, matériel ${sectionName}, apprendre russe avec ${sectionName}`
	} else if (locale === 'ru') {
		keywords = `${sectionName} французский, материалы ${sectionName}, учить французский`
	} else {
		keywords = `${sectionName} russian, ${sectionName} french, language learning ${sectionName}`
	}

	const baseUrl = 'https://www.linguami.com'
	const path = `/materials/${section || ''}`
	const currentUrl = `${baseUrl}${locale === 'fr' ? '' : `/${locale}`}${path}`
	const frUrl = `${baseUrl}${path}`
	const ruUrl = `${baseUrl}/ru${path}`
	const enUrl = `${baseUrl}/en${path}`

	return {
		title: `${t(section || 'pagetitle')} | Linguami`,
		description: t('description'),
		keywords: keywords,
		authors: [{ name: 'Linguami' }],
		openGraph: {
			type: 'website',
			url: currentUrl,
			title: `${t(section || 'pagetitle')} | Linguami`,
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
			title: `${t(section || 'pagetitle')} | Linguami`,
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

export default async function SectionPage({ params }) {
	const { locale, section } = await params
	const t = await getTranslations({ locale, namespace: 'materials' })

	// Get user and determine learning language
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)
	const { data: { user } } = await supabase.auth.getUser()

	let learningLanguage = getDefaultLearningLanguage(locale)
	let userMaterialsStatus = []

	// If authenticated, fetch user profile and materials status
	if (user) {
		const { data: profile } = await supabase
			.from('users_profile')
			.select('learning_language')
			.eq('id', user.id)
			.maybeSingle()

		if (profile?.learning_language) {
			learningLanguage = profile.learning_language
		}

		// Fetch user materials status for filtering
		userMaterialsStatus = await getUserMaterialsStatus(user.id)
	}

	// Fetch materials or books based on section
	let materials = []
	if (section === 'books') {
		materials = await getBooksByLanguage(learningLanguage)
	} else {
		materials = await getMaterialsBySection(learningLanguage, section)
	}

	// JSON-LD for CollectionPage
	const jsonLd = section
		? {
				'@context': 'https://schema.org',
				'@type': 'CollectionPage',
				name: `${t(section)} | ${t('pagetitle')}`,
				description: t('description'),
				url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/materials/${section}`,
				inLanguage: locale === 'fr' ? 'fr-FR' : locale === 'ru' ? 'ru-RU' : 'en-US',
				about: {
					'@type': 'Thing',
					name: t(section),
				},
			}
		: null

	return (
		<>
			{jsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			)}
			<SectionPageClient
				initialMaterials={materials}
				initialUserMaterialsStatus={userMaterialsStatus}
				section={section}
				learningLanguage={learningLanguage}
			/>
		</>
	)
}
