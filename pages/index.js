import Head from 'next/head'
import Homepage from '../components/homepage'

export default function Home() {
	return (
		<div>
			<Head>
				<title>Linguami</title>
				<meta
					name='description'
					content='Site de langue pour apprendre le russe'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Homepage />
		</div>
	)
}
