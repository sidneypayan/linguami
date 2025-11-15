/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n/request.ts')

const nextConfig = {
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	experimental: {
		missingSuspenseWithCSRBailout: false,
	},

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

// Apply next-intl plugin for App Router i18n
module.exports = withNextIntl(nextConfig)
