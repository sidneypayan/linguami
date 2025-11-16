import { getTranslations } from 'next-intl/server'
import PrivacyClient from '@/components/privacy/PrivacyClient'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'privacy' })

	return {
		title: `${t('title')} | Linguami`,
		description: t('subtitle'),
	}
}

export default async function PrivacyPolicy({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'privacy' })

	// Format date server-side (no hydration mismatch)
	const formattedDate = new Date().toLocaleDateString('fr-FR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})

	// Sections from translations
	const sections = [
		{ title: t('section_1_title'), content: t('section_1_content') },
		{ title: t('section_2_title'), content: t('section_2_content') },
		{ title: t('section_3_title'), content: t('section_3_content') },
		{ title: t('section_4_title'), content: t('section_4_content') },
		{ title: t('section_5_title'), content: t('section_5_content') },
		{ title: t('section_6_title'), content: t('section_6_content') },
		{ title: t('section_7_title'), content: t('section_7_content') },
		{ title: t('section_8_title'), content: t('section_8_content') },
		{ title: t('section_9_title'), content: t('section_9_content') },
		{ title: t('section_10_title'), content: t('section_10_content') },
	]

	// Get all translations as plain objects (not functions)
	// Use .raw for HTML content to avoid formatting errors
	const translations = {
		title: t('title'),
		subtitle: t('subtitle'),
		last_updated: t('last_updated'),
		intro: t.raw('intro'),
		cta_title: t('cta_title'),
		cta_subtitle: t('cta_subtitle'),
		footer_link: t('footer_link'),
	}

	return (
		<PrivacyClient
			translations={translations}
			formattedDate={formattedDate}
			sections={sections}
		/>
	)
}
