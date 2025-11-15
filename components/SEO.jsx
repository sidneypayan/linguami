import Head from 'next/head'
import { useTranslations, useLocale } from 'next-intl'

/**
 * Composant SEO réutilisable pour optimiser le référencement multilingue
 *
 * @param {Object} props
 * @param {string} props.title - Titre de la page
 * @param {string} props.description - Description de la page
 * @param {string} props.path - Chemin de la page (ex: '/blog', '/teacher')
 * @param {string} [props.image] - Image OpenGraph (optionnel, par défaut og-image.jpg)
 * @param {string} [props.keywords] - Mots-clés spécifiques à la page (optionnel)
 * @param {Object} [props.jsonLd] - Données structurées JSON-LD (optionnel)
 * @param {boolean} [props.noindex] - Si true, empêche l'indexation (optionnel)
 */
export default function SEO({
	title,
	description,
	path = '/',
	image = 'https://www.linguami.com/og-image.jpg',
	keywords,
	jsonLd,
	noindex = false
}) {
	const locale = useLocale()

	// Configuration des langues et locales
	const localeConfig = {
		fr: { og: 'fr_FR', lang: 'French' },
		ru: { og: 'ru_RU', lang: 'Russian' },
		en: { og: 'en_US', lang: 'English' }
	}

	const currentLocale = localeConfig[locale] || localeConfig.fr

	// Construction des URLs
	const baseUrl = 'https://www.linguami.com'
	const currentUrl = `${baseUrl}${locale === 'fr' ? '' : `/${locale}`}${path === '/' ? '' : path}`

	// URLs alternatives pour hreflang
	const frUrl = `${baseUrl}${path === '/' ? '' : path}`
	const ruUrl = `${baseUrl}/ru${path === '/' ? '' : path}`
	const enUrl = `${baseUrl}/en${path === '/' ? '' : path}`

	return (
		<Head>
			<title>{title}</title>
			<meta name='description' content={description} />

			{/* Robots */}
			{noindex && <meta name='robots' content='noindex, nofollow' />}

			{/* Balises hreflang pour le SEO multilingue */}
			<link rel='alternate' hrefLang='fr' href={frUrl} />
			<link rel='alternate' hrefLang='ru' href={ruUrl} />
			<link rel='alternate' hrefLang='en' href={enUrl} />
			<link rel='alternate' hrefLang='x-default' href={frUrl} />

			{/* Open Graph / Facebook */}
			<meta property='og:type' content='website' />
			<meta property='og:url' content={currentUrl} />
			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			<meta property='og:image' content={image} />
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
			<meta name='twitter:title' content={title} />
			<meta name='twitter:description' content={description} />
			<meta name='twitter:image' content={image} />

			{/* Métadonnées additionnelles */}
			{keywords && <meta name='keywords' content={keywords} />}
			<meta name='author' content='Linguami' />
			<meta name='language' content={currentLocale.locale} />
			<link rel='canonical' href={currentUrl} />

			{/* Schema JSON-LD si fourni */}
			{jsonLd && (
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			)}

			{/* Métadonnées pour les performances */}
			<meta httpEquiv='x-dns-prefetch-control' content='on' />
			<link rel='dns-prefetch' href='https://fonts.googleapis.com' />
			<link rel='preconnect' href='https://fonts.googleapis.com' crossOrigin='anonymous' />
		</Head>
	)
}
