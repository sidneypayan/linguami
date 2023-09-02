/** @type {import('next').NextConfig} */
// const nextTranslate = require('next-translate')

// module.exports = nextTranslate({
// 	webpack: (config, { isServer, webpack }) => {
// 		return config
// 	},
// })

const nextTranslate = require('next-translate-plugin')

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: [
			'fxadatcycupiinjjdzpe.supabase.co',
			'vcvahpmlsoijvwkanezk.supabase.co',
		],
	},
	pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
}

module.exports = nextTranslate(nextConfig)

// module.exports = nextTranslate({})

// const withMDX = require('@next/mdx')({
// 	extension: /\.mdx?$/,
// 	options: {
// 		// If you use remark-gfm, you'll need to use next.config.mjs
// 		// as the package is ESM only
// 		// https://github.com/remarkjs/remark-gfm#install
// 		remarkPlugins: [],
// 		rehypePlugins: [],
// 		// If you use `MDXProvider`, uncomment the following line.
// 		// providerImportSource: "@mdx-js/react",
// 	},
// })
// module.exports = withMDX({
// 	// Append the default value with md extensions
// 	pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
// })
