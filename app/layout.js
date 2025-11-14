import 'normalize.css'
import '../styles/globals.css'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import Providers from './providers'

const poppins = Poppins({
	weight: ['300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
	display: 'swap',
})

export const metadata = {
	metadataBase: new URL('https://linguami.com'),
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
	themeColor: '#667eea',
}

export default function RootLayout({ children }) {
	const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

	return (
		<html lang="fr" className={poppins.className} suppressHydrationWarning>
			<head>
				{/* Google Tag Manager */}
				{GTM_ID && (
					<Script
						id="gtm-script"
						strategy="afterInteractive"
						dangerouslySetInnerHTML={{
							__html: `
								(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
								new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
								j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
								'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
								})(window,document,'script','dataLayer','${GTM_ID}');
							`,
						}}
					/>
				)}
			</head>
			<body suppressHydrationWarning>
				{/* Google Tag Manager (noscript) */}
				{GTM_ID && (
					<noscript>
						<iframe
							src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
							height="0"
							width="0"
							style={{ display: 'none', visibility: 'hidden' }}
						/>
					</noscript>
				)}

				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
