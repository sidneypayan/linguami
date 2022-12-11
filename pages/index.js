import Head from 'next/head'
import Homepage from '../components/homepage'
import Script from 'next/script'
import useTranslation from 'next-translate/useTranslation'

export default function Home() {
	const { t, lang } = useTranslation()

	return (
		<>
			<Head>
				<title>{`${t('home:pagetitle')} | Linguami`}</title>
				<meta name='description' content={t('home:description')} />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Script
				strategy='afterInteractive'
				src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
			/>
			<Script
				id='google-analytics'
				strategy='afterInteractive'
				dangerouslySetInnerHTML={{
					__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
  `,
				}}
			/>
			<Homepage />
		</>
	)
}
