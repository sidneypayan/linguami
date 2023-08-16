import Link from 'next/link'
import jwtDecode from 'jwt-decode'
import { supabase } from '../../lib/supabase'
import { sectionsForAdmin } from '../../utils/constants'
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Typography,
} from '@mui/material'

const Admin = ({ count }) => {
	return (
		<Container sx={{ margin: '5rem auto' }}>
			<Typography mt={3} mb={3} variant='h3'>
				Sections
			</Typography>
			<Box
				gap={2}
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(5, 1fr)',
				}}>
				{count.map((count, index) => (
					<Card key={index}>
						<CardContent sx={{ textAlign: 'center' }}>
							<Link href={`/materials/${count.section}`}>
								<Typography sx={{ cursor: 'pointer' }} variant='h5'>
									{count.section}
								</Typography>
							</Link>
							<Typography variant='h4' sx={{ marginTop: '1rem' }}>
								{count.count}
							</Typography>
						</CardContent>
					</Card>
				))}
			</Box>
			<Link href='/admin/create'>
				<Button variant='contained' sx={{ marginTop: '2rem' }}>
					Create content
				</Button>
			</Link>
		</Container>
	)
}

export const getServerSideProps = async ({ req }) => {
	if (req.cookies['sb-access-token']) {
		const decodedToken = jwtDecode(req.cookies['sb-access-token'])

		const { data: user, error } = await supabase
			.from('users_profile')
			.select('*')
			.eq('id', decodedToken.sub)
			.single()

		if (user.role !== 'admin') {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			}
		}
	} else {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	const getCount = async section => {
		const { count } = await supabase
			.from('materials')
			.select('*', { count: 'exact' })
			.eq('section', section)

		return count
	}

	const sectionCount = sectionsForAdmin.reduce(
		async (previousPromise, section) => {
			let countArray = await previousPromise
			const count = await getCount(section)

			countArray.push({ section, count })
			return countArray
		},
		[]
	)

	return {
		props: { count: sectionCount },
	}
}

export default Admin
