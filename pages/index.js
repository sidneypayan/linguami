import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import Homepage from '../components/homepage'

export default function Home() {
	const { t } = useTranslation('home')

	return (
		<>
			<Head>
				<title>{`${t('pagetitle')} | Linguami`}</title>
				<meta name='description' content={t('description')} />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Homepage />
		</>
	)
}
