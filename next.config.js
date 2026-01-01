/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n/request.ts')

const nextConfig = {
	reactStrictMode: true,

	// Increase Server Actions body size limit for file uploads (images, audio)
	experimental: {
		serverActions: {
			bodySizeLimit: '100mb',
		},
	},

	// Include data folder in serverless functions (for training JSON files)
	// This ensures JSON files are available in Vercel serverless functions
	outputFileTracingIncludes: {
		'/*': ['./data/**/*'],
	},

	// Configuration des images
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'psomseputtsdizmmqugy.supabase.co',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'linguami-cdn.etreailleurs.workers.dev',
				pathname: '**',
			},
		],
		unoptimized: false,
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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

// Apply next-intl plugin for App Router i18n and export
module.exports = withNextIntl(nextConfig)
