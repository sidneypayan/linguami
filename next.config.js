/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
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

// Apply next-intl plugin for App Router i18n
const configWithIntl = withNextIntl(nextConfig)

// Sentry configuration options
const sentryWebpackPluginOptions = {
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options

	// Only print logs for uploading source maps in CI
	silent: !process.env.CI,

	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

	// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
	// This can increase your server load as well as your hosting bill.
	// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
	// side errors will fail.
	tunnelRoute: "/api/_health",

	// Hides source maps from generated client bundles
	hideSourceMaps: true,

	// Automatically tree-shake Sentry logger statements to reduce bundle size
	disableLogger: true,

	// Disable telemetry
	telemetry: false,
}

// Make sure adding Sentry options is the last code to run before exporting
module.exports = withSentryConfig(configWithIntl, sentryWebpackPluginOptions)
