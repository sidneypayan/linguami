/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ['https://linguami.s3.eu-west-3.amazonaws.com'],
	},
}

module.exports = nextConfig
