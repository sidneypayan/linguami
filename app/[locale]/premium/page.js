import { getTranslations } from 'next-intl/server'
import PremiumClient from '@/components/premium/PremiumClient'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'premium' })

	const keywordsByLang = {
		fr: 'premium linguami, abonnement linguami, methode russe, apprendre russe, cours de russe premium',
		ru: 'премиум linguami, подписка linguami, метод французский, учить французский, курсы французского',
		en: 'linguami premium, premium subscription, russian method, learn russian, premium russian course',
	}

	const baseUrl = 'https://www.linguami.com'
	const path = '/premium'
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

export default async function Premium({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'premium' })

	// JSON-LD for Product/Offers
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: 'Linguami Premium',
		description: t('description'),
		brand: {
			'@type': 'Brand',
			name: 'Linguami',
		},
		offers: [
			{
				'@type': 'Offer',
				name: 'Monthly Subscription',
				price: '8.00',
				priceCurrency: 'EUR',
				availability: 'https://schema.org/InStock',
				url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/premium`,
				priceValidUntil: '2026-12-31',
			},
			{
				'@type': 'Offer',
				name: 'Yearly Subscription',
				price: '59.00',
				priceCurrency: 'EUR',
				availability: 'https://schema.org/InStock',
				url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/premium`,
				priceValidUntil: '2026-12-31',
			},
			{
				'@type': 'Offer',
				name: 'Method Course (per level)',
				price: '29.00',
				priceCurrency: 'EUR',
				availability: 'https://schema.org/InStock',
				url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/premium`,
				priceValidUntil: '2026-12-31',
			},
		],
	}

	return <PremiumClient jsonLd={jsonLd} />
}
