import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
	const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

	return (
		<Html>
			<Head>
				<link rel='icon' type='image/svg+xml' href='/favicon.svg' />
				<link rel='alternate icon' href='/favicon.ico' />
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href='/apple-touch-icon.svg'
				/>
				<link rel='manifest' href='/site.webmanifest' />
				<meta name='theme-color' content='#667eea' />

				{/* Métadonnées pour les moteurs de recherche */}
				<meta
					name='robots'
					content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
				/>
				<meta name='googlebot' content='index, follow' />
				<meta name='bingbot' content='index, follow' />

				{/* Google Site Verification */}
				<meta
					name='google-site-verification'
					content='oGTQDmJBuYy3iZHwHZO0Ri42PA6fdKSVvf_JgPNShg8'
				/>

				{/* Yandex Site Verification */}
				<meta name='yandex-verification' content='c0eca412e0863312' />

				{/* Bing Site Verification */}
				<meta name='msvalidate.01' content='62BF48559C7FAA4B1AEBC63E61284ACB' />

				{/* Google Tag Manager - Script Head */}
				{GTM_ID && (
					<script
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
			</Head>
			<body>
				{/* Google Tag Manager - NoScript Body */}
				{GTM_ID && (
					<noscript
						dangerouslySetInnerHTML={{
							__html: `
								<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
								height="0" width="0" style="display:none;visibility:hidden"></iframe>
							`,
						}}
					/>
				)}
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
