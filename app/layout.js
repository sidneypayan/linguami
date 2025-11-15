import 'normalize.css'
import '../styles/globals.css'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
	weight: ['300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
	display: 'swap',
})

export const viewport = {
	themeColor: '#667eea',
}

export const metadata = {
	metadataBase: new URL('https://linguami.com'),
	title: 'Linguami',
	description: 'Apprenez le français et le russe avec des méthodes interactives',
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1,
		},
	},
	verification: {
		google: 'oGTQDmJBuYy3iZHwHZO0Ri42PA6fdKSVvf_JgPNShg8',
		yandex: 'c0eca412e0863312',
		other: {
			'msvalidate.01': '62BF48559C7FAA4B1AEBC63E61284ACB',
		},
	},
	icons: {
		icon: [
			{ url: '/favicon.ico' },
			{ url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
		],
		apple: '/apple-touch-icon.png',
	},
	manifest: '/site.webmanifest',
}

export default function RootLayout({ children }) {
	return (
		<html lang="fr" className={poppins.className} suppressHydrationWarning>
			<body suppressHydrationWarning>{children}</body>
		</html>
	)
}
