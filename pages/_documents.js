import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang='fr'>
			<Head>
				<link rel='icon' type='image/svg+xml' href='/favicon.svg' />
				<link rel='alternate icon' href='/favicon.ico' />
				<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.svg' />
				<link rel='manifest' href='/site.webmanifest' />
				<meta name='theme-color' content='#667eea' />
			</Head>
			<body>
				<noscript
					dangerouslySetInnerHTML={{
						__html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
					}}
				/>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
