import Image from 'next/image'
import Head from 'next/head'
import Hero from '../components/homepage/Hero'
import Material from '../components/homepage/Material'
import Teacher from '../components/homepage/Teacher'
import Translate from '../components/homepage/Translate'

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
			<Hero />
			<Material />
			<Teacher />
			<Translate />
		</div>
	)
}
