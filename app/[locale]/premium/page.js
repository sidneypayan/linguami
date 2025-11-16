import { getTranslations } from 'next-intl/server'
import PremiumClient from '@/components/premium/PremiumClient'
import SEO from '@/components/SEO'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'premium' })

	// Mots-clés SEO par langue
	const keywordsByLang = {
		fr: 'premium linguami, abonnement linguami, dictionnaire illimité, flashcards, traduction russe, apprendre russe premium',
		ru: 'премиум linguami, подписка linguami, неограниченный словарь, флэш-карты, перевод французский',
		en: 'linguami premium, premium subscription, unlimited dictionary, flashcards, language learning premium, russian french premium'
	}

	// JSON-LD pour Product/Offer
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: 'Linguami Premium',
		description: t('description'),
		brand: {
			'@type': 'Brand',
			name: 'Linguami'
		},
		offers: [
			{
				'@type': 'Offer',
				name: '1 Month Premium',
				price: '6.00',
				priceCurrency: 'EUR',
				availability: 'https://schema.org/InStock',
				url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/premium`,
				priceValidUntil: '2026-12-31'
			},
			{
				'@type': 'Offer',
				name: '3 Months Premium',
				price: '15.00',
				priceCurrency: 'EUR',
				availability: 'https://schema.org/InStock',
				url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/premium`,
				priceValidUntil: '2026-12-31'
			}
		]
	}

	return {
		title: `${t('pagetitle')} | Linguami`,
		description: t('description'),
		other: {
			'schema:keywords': keywordsByLang[locale],
		},
	}
}

export default async function Premium({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'premium' })

	// Mots-clés SEO par langue
	const keywordsByLang = {
		fr: 'premium linguami, abonnement linguami, dictionnaire illimité, flashcards, traduction russe, apprendre russe premium',
		ru: 'премиум linguami, подписка linguami, неограниченный словарь, флэш-карты, перевод французский',
		en: 'linguami premium, premium subscription, unlimited dictionary, flashcards, language learning premium, russian french premium'
	}

	// JSON-LD pour Product/Offer
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: 'Linguami Premium',
		description: t('description'),
		brand: {
			'@type': 'Brand',
			name: 'Linguami'
		},
		offers: [
			{
				'@type': 'Offer',
				name: '1 Month Premium',
				price: '6.00',
				priceCurrency: 'EUR',
				availability: 'https://schema.org/InStock',
				url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/premium`,
				priceValidUntil: '2026-12-31'
			},
			{
				'@type': 'Offer',
				name: '3 Months Premium',
				price: '15.00',
				priceCurrency: 'EUR',
				availability: 'https://schema.org/InStock',
				url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/premium`,
				priceValidUntil: '2026-12-31'
			}
		]
	}

	// Get all translations as plain values (not functions)
	const translations = {
		feature_unlimited_translation: t('feature_unlimited_translation'),
		feature_unlimited_dictionary: t('feature_unlimited_dictionary'),
		feature_flashcards: t('feature_flashcards'),
		support_content_creation: t('support_content_creation'),
		support_interactive_activities: t('support_interactive_activities'),
		support_hosting_costs: t('support_hosting_costs'),
		support_appreciation: t('support_appreciation'),
	}

	return (
		<>
			<SEO
				title={`${t('pagetitle')} | Linguami`}
				description={t('description')}
				path='/premium'
				keywords={keywordsByLang[locale]}
				jsonLd={jsonLd}
			/>
			<PremiumClient translations={translations} />
		</>
	)
}
