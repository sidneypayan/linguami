/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin')

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,

	// Configuration des images
	images: {
		domains: ['psomseputtsdizmmqugy.supabase.co'],
		unoptimized: true, // Images déjà optimisées en WebP sur Supabase
		formats: ['image/webp'], // Format préféré
	},

	// Extensions de pages supportées
	pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

	// Optimisations de production
	compress: true, // Activer la compression gzip

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
		// Optimiser les imports
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

module.exports = nextTranslate(nextConfig)
