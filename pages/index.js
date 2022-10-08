import Head from 'next/head'
import Homepage from '../components/homepage'
import { supabase } from '../lib/supabase'
import jwtDecode from 'jwt-decode'

export default function Home({ user }) {
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

export const getServerSideProps = async ({ req }) => {
	// if (req.cookies['sb-access-token']) {
	// 	const decodedToken = jwtDecode(req.cookies['sb-access-token'])

	// 	const { data: user, error } = await supabase
	// 		.from('users')
	// 		.select('*')
	// 		.eq('id', decodedToken.sub)
	// 		.single()

	// 	console.log(decodedToken)

	// 	return {
	// 		props: {
	// 			user,
	// 		},
	// 	}
	// } else {
	// 	return {
	// 		props: {
	// 			user: null,
	// 		},
	// 	}
	// }

	return {
		props: {
			user: null,
		},
	}
}
