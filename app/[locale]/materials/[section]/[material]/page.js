import { getTranslations } from 'next-intl/server'
import { createClient } from '@supabase/supabase-js'
import MaterialPageClient from '@/components/material/MaterialPageClient'

// Créer un client Supabase pour les Server Components
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function generateMetadata({ params }) {
	const { locale, section, material: materialId } = await params
	const t = await getTranslations({ locale, namespace: 'materials' })

	// Récupérer les infos du matériel pour les métadonnées
	const { data: material } = await supabase
		.from('materials')
		.select('title, level')
		.eq('id', materialId)
		.single()

	const materialTitle = material?.title || t('material')
	const sectionTitle = t(section) || section

	const baseUrl = 'https://www.linguami.com'
	const path = `/materials/${section}/${materialId}`
	const currentUrl = `${baseUrl}${locale === 'fr' ? '' : `/${locale}`}${path}`
	const frUrl = `${baseUrl}${path}`
	const ruUrl = `${baseUrl}/ru${path}`
	const enUrl = `${baseUrl}/en${path}`

	return {
		title: `${materialTitle} | ${sectionTitle} | Linguami`,
		description: `${materialTitle} - ${t('level')}: ${material?.level || 'beginner'}`,
		keywords: `${materialTitle}, ${sectionTitle}, ${locale === 'fr' ? 'apprendre russe' : locale === 'ru' ? 'изучение французского' : 'learn russian'}`,
		authors: [{ name: 'Linguami' }],
		openGraph: {
			type: 'article',
			url: currentUrl,
			title: `${materialTitle} | ${sectionTitle}`,
			description: `${materialTitle} - ${t('level')}: ${material?.level || 'beginner'}`,
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
			title: `${materialTitle} | ${sectionTitle}`,
			description: `${materialTitle} - ${t('level')}: ${material?.level || 'beginner'}`,
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

export default function MaterialPage({ params }) {
	return <MaterialPageClient params={params} />
}
