import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { getUserMaterialStatus } from '@/app/data/materials'
import MaterialPageClient from '@/components/material/MaterialPageClient'

export async function generateMetadata({ params }) {
	const { locale, section, material: materialId } = await params
	const t = await getTranslations({ locale, namespace: 'materials' })

	// Récupérer les infos du matériel pour les métadonnées
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)
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

export default async function MaterialPage({ params }) {
	const { material: materialId } = await params

	// Fetch material data server-side
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const { data: material } = await supabase
		.from('materials')
		.select('*')
		.eq('id', materialId)
		.single()

	// Get user and fetch material status if authenticated
	const { data: { user } } = await supabase.auth.getUser()
	let userMaterialStatus = { is_being_studied: false, is_studied: false }

	if (user && material) {
		userMaterialStatus = await getUserMaterialStatus(material.id, user.id)
	}

	// Encode text fields to base64 to preserve UTF-8 encoding through Next.js serialization
	const materialWithEncodedText = material ? {
		...material,
		content: material.content ? Buffer.from(material.content).toString('base64') : null,
		content_accented: material.content_accented ? Buffer.from(material.content_accented).toString('base64') : null,
		_encoded: true, // Flag to indicate fields are encoded
	} : null

	return (
		<MaterialPageClient
			params={params}
			initialMaterial={materialWithEncodedText}
			initialUserMaterialStatus={userMaterialStatus}
		/>
	)
}
