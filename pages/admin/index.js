import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { sectionsForAdmin } from '../../utils/constants'
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Typography,
} from '@mui/material'

const Admin = ({
	materialsCountByLang,
	musicCountByLang,
	booksCountByLang,
}) => {
	return (
		<Container sx={{ margin: '5rem auto' }}>
			<Typography mt={3} mb={3} variant='h3'>
				Sections
			</Typography>

			{materialsCountByLang.map(({ lang, counts }) => {
				const music = musicCountByLang.find(m => m.lang === lang)
				const books = booksCountByLang.find(b => b.lang === lang)

				return (
					<Box key={lang} sx={{ marginBottom: '4rem' }}>
						<Typography variant='h4' mb={2}>
							Langue : {lang}
						</Typography>

						<Box
							gap={2}
							sx={{
								display: 'grid',
								gridTemplateColumns: 'repeat(5, 1fr)',
							}}>
							{counts
								.filter(({ count }) => count > 0)
								.map(({ section, count }, index) => (
									<Card key={`${lang}-${section}-${index}`}>
										<CardContent sx={{ textAlign: 'center' }}>
											<Link
												href={`/materials/${section}?lang=${lang}`}
												passHref>
												<Typography sx={{ cursor: 'pointer' }} variant='h5'>
													{section}
												</Typography>
											</Link>
											<Typography variant='h4' sx={{ marginTop: '1rem' }}>
												{count}
											</Typography>
										</CardContent>
									</Card>
								))}

							<Card>
								<CardContent sx={{ textAlign: 'center' }}>
									<Link href={`/materials/music?lang=${lang}`} passHref>
										<Typography sx={{ cursor: 'pointer' }} variant='h5'>
											Musics
										</Typography>
									</Link>
									<Typography variant='h4' sx={{ marginTop: '1rem' }}>
										{music?.count ?? 0}
									</Typography>
								</CardContent>
							</Card>

							<Card>
								<CardContent sx={{ textAlign: 'center' }}>
									<Link href={`/materials/books?lang=${lang}`} passHref>
										<Typography sx={{ cursor: 'pointer' }} variant='h5'>
											Books
										</Typography>
									</Link>
									<Typography variant='h4' sx={{ marginTop: '1rem' }}>
										{books?.count ?? 0}
									</Typography>
								</CardContent>
							</Card>
						</Box>
					</Box>
				)
			})}
			<Link href='/admin/create'>
				<Button variant='contained' sx={{ marginTop: '2rem' }}>
					Create content
				</Button>
			</Link>
		</Container>
	)
}

export const getServerSideProps = async ({ req, res }) => {
	// Créer un client Supabase pour le serveur
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name) {
					return req.cookies[name]
				},
				set(name, value, options) {
					const cookieOptions = []
					if (options?.maxAge) cookieOptions.push(`Max-Age=${options.maxAge}`)
					if (options?.path) cookieOptions.push(`Path=${options.path}`)
					if (options?.domain) cookieOptions.push(`Domain=${options.domain}`)
					if (options?.secure) cookieOptions.push('Secure')
					if (options?.httpOnly) cookieOptions.push('HttpOnly')
					if (options?.sameSite)
						cookieOptions.push(`SameSite=${options.sameSite}`)

					const cookieString = `${name}=${value}${
						cookieOptions.length ? '; ' + cookieOptions.join('; ') : ''
					}`
					res.setHeader('Set-Cookie', cookieString)
				},
				remove(name, options) {
					res.setHeader('Set-Cookie', `${name}=; Path=/; Max-Age=0`)
				},
			},
		}
	)

	// Récupérer l'utilisateur connecté
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (!user || authError) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	// Récupérer le profil utilisateur
	const { data: userProfile, error: userError } = await supabase
		.from('users_profile')
		.select('*')
		.eq('id', user.id)
		.single()

	if (userError || userProfile?.role !== 'admin') {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	const langs = ['fr', 'ru']
	const musicSections = ['kids', 'folk', 'pop', 'rock', 'variety']

	// Fonction générique pour compter les lignes par section et langue
	const getCountBySectionAndLang = async (table, section, lang) => {
		const { count, error } = await supabase
			.from(table)
			.select('id', { count: 'exact', head: true })
			.eq('section', section)
			.eq('lang', lang)

		if (error) {
			console.error(`Erreur dans ${table} (${section}, ${lang}) :`, error)
			return 0
		}

		return count || 0
	}

	// Fonction pour compter les musiques par langue
	const getMusicCountByLang = async lang => {
		const { count, error } = await supabase
			.from('materials')
			.select('id', { count: 'exact', head: true })
			.in('section', musicSections)
			.eq('lang', lang)

		if (error) {
			console.error(`Erreur dans music (${lang}) :`, error)
			return 0
		}

		return count || 0
	}

	// Fonction pour compter les livres par langue
	const getBooksCountByLang = async lang => {
		const { count, error } = await supabase
			.from('books')
			.select('id', { count: 'exact', head: true })
			.eq('lang', lang)

		if (error) {
			console.error(`Erreur dans books (${lang}) :`, error)
			return 0
		}

		return count || 0
	}

	// Comptage des materials par section et langue
	const materialsCountByLang = await Promise.all(
		langs.map(async lang => {
			const counts = await Promise.all(
				sectionsForAdmin.map(async section => {
					const count = await getCountBySectionAndLang(
						'materials',
						section,
						lang
					)
					return { section, count }
				})
			)
			return { lang, counts }
		})
	)

	// Comptage des musiques par langue
	const musicCountByLang = await Promise.all(
		langs.map(async lang => {
			const count = await getMusicCountByLang(lang)
			return { lang, count }
		})
	)

	// Comptage des livres par langue
	const booksCountByLang = await Promise.all(
		langs.map(async lang => {
			const count = await getBooksCountByLang(lang)
			return { lang, count }
		})
	)

	return {
		props: {
			materialsCountByLang,
			musicCountByLang,
			booksCountByLang,
		},
	}
}

export default Admin
