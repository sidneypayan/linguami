/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin')
const withNextIntl = require('next-intl/plugin')('./i18n/request.ts')

const nextConfig = {
	reactStrictMode: true,

	// Configuration des images
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'psomseputtsdizmmqugy.supabase.co',
				pathname: '**',
			},
		],
		unoptimized: true,
		formats: ['image/webp'],
	},

	// Extensions de pages supportées
	pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

	// Optimisations de production
	compress: true,

	// Headers de sécurité et cache
	async headers() {
		return [
			{
				source: '/:all*(svg|jpg|jpeg|png|webp|gif|ico)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
		]
	},

	// Configuration webpack pour optimiser le bundle
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
			}
		}
		return config
	},
}

// Apply both plugins: next-translate for Pages Router, next-intl for App Router
// Apply next-intl only (next-translate disabled for now)
module.exports = withNextIntl(nextConfig)
