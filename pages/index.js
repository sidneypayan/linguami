import Head from 'next/head'
import Homepage from '../components/homepage'
import Script from 'next/script'

export default function Home() {
	return (
		<div>
			<Head>
				<title>Linguami | Page d&apos;accueil</title>
				<meta
					name='description'
					content="Linguami est une site de langue dédié à l'apprentissage du russe pour les francophones. Sur notre site vous trouverez une grande variété de supports vidéos, audio, textes pour étudier tous les aspects de la langue russe."
				/>
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
		</div>
	)
}
