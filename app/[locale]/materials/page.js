import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { getAllMaterialsByLanguage, getUserMaterialsStatus } from '@/app/data/materials'
import MaterialsPageClient from '@/components/materials/MaterialsPageClient'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'materials' })

	// SEO keywords by language
	const keywordsByLang = {
		fr: 'matériel russe, apprendre russe, vidéos russes, textes russes, audio russe, dialogues russes, chansons russes, cours russe',
		ru: 'материалы французский, изучение французского, французские видео, французские тексты, французское аудио, французские диалоги',
		en: 'russian materials, learn russian, russian videos, french materials, learn french, language learning materials, russian audio, french audio',
	}

	const baseUrl = 'https://www.linguami.com'
	const path = '/materials'
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

export default async function MaterialsPage({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'materials' })

	// Get user and learning language
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)
	const { data: { user } } = await supabase.auth.getUser()

	let learningLanguage = 'fr' // Default
	let userMaterialsStatus = []

	if (user) {
		// Get learning language from profile
		const { data: profile } = await supabase
			.from('users_profile')
			.select('learning_language')
			.eq('id', user.id)
			.single()

		learningLanguage = profile?.learning_language || 'fr'

		// Fetch user materials status for filtering
		userMaterialsStatus = await getUserMaterialsStatus(user.id)
	} else {
		// For guests, try to read learning language from cookie
		const learningLangCookie = (await cookieStore).get('learning_language')
		if (learningLangCookie?.value) {
			learningLanguage = learningLangCookie.value
		}
	}

	// Fetch all materials for this language
	const allMaterials = await getAllMaterialsByLanguage(learningLanguage)

	// JSON-LD for ItemList
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name:
			locale === 'fr'
				? 'Matériel pédagogique'
				: locale === 'ru'
					? 'Учебные материалы'
					: 'Learning Materials',
		description: t('description'),
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: t('practiceCategory'),
				url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/materials#practice`,
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: t('cultureCategory'),
				url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/materials#culture`,
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: t('literatureCategory'),
				url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/materials#literature`,
			},
		],
	}

	return (
		<>
			{jsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			)}
			<MaterialsPageClient
				initialMaterials={allMaterials}
				initialUserMaterialsStatus={userMaterialsStatus}
				learningLanguage={learningLanguage}
			/>
		</>
	)
}
