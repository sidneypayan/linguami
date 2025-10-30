import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { sectionsForAdmin } from '../../utils/constants'
import { useState } from 'react'
import {
	Box,
	Container,
	Typography,
	Tabs,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Chip,
	Stack,
	Avatar,
	IconButton,
	Tooltip,
	alpha,
} from '@mui/material'
import {
	Add,
	Edit,
	Visibility,
	TrendingUp,
	Language,
	LibraryBooks,
	MusicNote,
	MenuBook,
} from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'

const Admin = ({
	materialsCountByLang,
	musicCountByLang,
	booksCountByLang,
}) => {
	const { t } = useTranslation('admin')
	const [selectedLang, setSelectedLang] = useState('fr')

	const getLanguageInfo = (lang) => {
		const info = {
			fr: { name: 'Français', color: '#3B82F6', flag: '🇫🇷' },
			ru: { name: 'Русский', color: '#EF4444', flag: '🇷🇺' },
			en: { name: 'English', color: '#10B981', flag: '🇬🇧' },
		}
		return info[lang] || info.fr
	}

	const currentLangData = materialsCountByLang.find(m => m.lang === selectedLang)
	const currentMusic = musicCountByLang.find(m => m.lang === selectedLang)
	const currentBooks = booksCountByLang.find(b => b.lang === selectedLang)

	// Calculate totals
	const totalMaterials = currentLangData?.counts.reduce((acc, { count }) => acc + count, 0) || 0
	const totalMusic = currentMusic?.count || 0
	const totalBooks = currentBooks?.count || 0
	const grandTotal = totalMaterials + totalMusic + totalBooks

	// Prepare table data
	const tableData = [
		...(currentLangData?.counts.filter(({ count }) => count > 0).map(({ section, count }) => ({
			type: 'material',
			section,
			count,
			icon: <LibraryBooks />,
		})) || []),
		{
			type: 'music',
			section: t('music'),
			count: totalMusic,
			icon: <MusicNote />,
		},
		{
			type: 'books',
			section: t('books'),
			count: totalBooks,
			icon: <MenuBook />,
		},
	].filter(item => item.count > 0)

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: '#F8FAFC',
			}}>
			{/* Top Bar */}
			<Box
				sx={{
					bgcolor: 'white',
					borderBottom: '1px solid',
					borderColor: 'divider',
					position: 'sticky',
					top: 0,
					zIndex: 1100,
					boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
				}}>
				<Container maxWidth="xl">
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							py: 2,
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: 2,
									background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: 'white',
									fontWeight: 800,
									fontSize: '1.5rem',
								}}>
								L
							</Box>
							<Box>
								<Typography
									variant='h5'
									sx={{
										fontWeight: 700,
										color: '#1E293B',
										letterSpacing: '-0.5px',
									}}>
									{t('adminDashboard')}
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: '#64748B',
									}}>
									{t('manageContent')}
								</Typography>
							</Box>
						</Box>

						<Link href='/admin/create' passHref style={{ textDecoration: 'none' }}>
							<Button
								variant='contained'
								startIcon={<Add />}
								sx={{
									bgcolor: '#667eea',
									color: 'white',
									px: 3,
									py: 1.2,
									borderRadius: 2,
									textTransform: 'none',
									fontWeight: 600,
									boxShadow: 'none',
									'&:hover': {
										bgcolor: '#5568d3',
										boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
									},
								}}>
								{t('newContent')}
							</Button>
						</Link>
					</Box>
				</Container>
			</Box>

			<Container maxWidth="xl" sx={{ py: 4 }}>
				{/* Stats Cards */}
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: {
							xs: '1fr',
							sm: 'repeat(2, 1fr)',
							md: 'repeat(4, 1fr)',
						},
						gap: 3,
						mb: 4,
					}}>
					<Paper
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 3,
							border: '1px solid',
							borderColor: 'divider',
							background: 'white',
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: 2,
									bgcolor: alpha('#667eea', 0.1),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#667eea',
								}}>
								<TrendingUp />
							</Box>
							<Box>
								<Typography variant='h4' sx={{ fontWeight: 700, color: '#1E293B' }}>
									{grandTotal}
								</Typography>
							</Box>
						</Box>
						<Typography variant='body2' sx={{ color: '#64748B', fontWeight: 500 }}>
							{t('totalContent')}
						</Typography>
					</Paper>

					<Paper
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 3,
							border: '1px solid',
							borderColor: 'divider',
							background: 'white',
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: 2,
									bgcolor: alpha('#3B82F6', 0.1),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#3B82F6',
								}}>
								<LibraryBooks />
							</Box>
							<Box>
								<Typography variant='h4' sx={{ fontWeight: 700, color: '#1E293B' }}>
									{totalMaterials}
								</Typography>
							</Box>
						</Box>
						<Typography variant='body2' sx={{ color: '#64748B', fontWeight: 500 }}>
							{t('materials')}
						</Typography>
					</Paper>

					<Paper
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 3,
							border: '1px solid',
							borderColor: 'divider',
							background: 'white',
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: 2,
									bgcolor: alpha('#10B981', 0.1),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#10B981',
								}}>
								<MusicNote />
							</Box>
							<Box>
								<Typography variant='h4' sx={{ fontWeight: 700, color: '#1E293B' }}>
									{totalMusic}
								</Typography>
							</Box>
						</Box>
						<Typography variant='body2' sx={{ color: '#64748B', fontWeight: 500 }}>
							{t('music')}
						</Typography>
					</Paper>

					<Paper
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 3,
							border: '1px solid',
							borderColor: 'divider',
							background: 'white',
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: 2,
									bgcolor: alpha('#F59E0B', 0.1),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#F59E0B',
								}}>
								<MenuBook />
							</Box>
							<Box>
								<Typography variant='h4' sx={{ fontWeight: 700, color: '#1E293B' }}>
									{totalBooks}
								</Typography>
							</Box>
						</Box>
						<Typography variant='body2' sx={{ color: '#64748B', fontWeight: 500 }}>
							{t('books')}
						</Typography>
					</Paper>
				</Box>

				{/* Language Tabs */}
				<Paper
					elevation={0}
					sx={{
						borderRadius: 3,
						border: '1px solid',
						borderColor: 'divider',
						overflow: 'hidden',
					}}>
					<Box
						sx={{
							borderBottom: '1px solid',
							borderColor: 'divider',
							px: 3,
							py: 2,
							bgcolor: 'white',
						}}>
						<Tabs
							value={selectedLang}
							onChange={(e, newValue) => setSelectedLang(newValue)}
							sx={{
								'& .MuiTab-root': {
									textTransform: 'none',
									fontWeight: 600,
									fontSize: '1rem',
									minHeight: 48,
									px: 3,
									color: '#64748B',
									'&.Mui-selected': {
										color: '#667eea',
									},
								},
								'& .MuiTabs-indicator': {
									backgroundColor: '#667eea',
									height: 3,
									borderRadius: '3px 3px 0 0',
								},
							}}>
							{materialsCountByLang.map(({ lang }) => {
								const langInfo = getLanguageInfo(lang)
								return (
									<Tab
										key={lang}
										value={lang}
										label={
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<span style={{ fontSize: '1.2rem' }}>{langInfo.flag}</span>
												<span>{langInfo.name}</span>
											</Box>
										}
									/>
								)
							})}
						</Tabs>
					</Box>

					{/* Content Table */}
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow
									sx={{
										bgcolor: '#F8FAFC',
										'& th': {
											fontWeight: 700,
											color: '#475569',
											fontSize: '0.875rem',
											textTransform: 'uppercase',
											letterSpacing: '0.5px',
											py: 2,
										},
									}}>
									<TableCell>{t('type')}</TableCell>
									<TableCell>{t('section')}</TableCell>
									<TableCell align='center'>{t('content')}</TableCell>
									<TableCell align='right'>{t('actions')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{tableData.length === 0 ? (
									<TableRow>
										<TableCell colSpan={4} align='center' sx={{ py: 8 }}>
											<Typography variant='body1' color='text.secondary'>
												{t('noContentAvailable')}
											</Typography>
										</TableCell>
									</TableRow>
								) : (
									tableData.map((item, index) => (
										<TableRow
											key={`${item.type}-${item.section}-${index}`}
											sx={{
												'&:hover': {
													bgcolor: '#F8FAFC',
												},
												'& td': {
													py: 2.5,
													borderBottom: '1px solid',
													borderColor: 'divider',
												},
											}}>
											<TableCell>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
													<Box
														sx={{
															width: 40,
															height: 40,
															borderRadius: 2,
															bgcolor: alpha(getLanguageInfo(selectedLang).color, 0.1),
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															color: getLanguageInfo(selectedLang).color,
														}}>
														{item.icon}
													</Box>
												</Box>
											</TableCell>
											<TableCell>
												<Typography
													sx={{
														fontWeight: 600,
														color: '#1E293B',
														textTransform: 'capitalize',
													}}>
													{item.section}
												</Typography>
											</TableCell>
											<TableCell align='center'>
												<Chip
													label={item.count}
													sx={{
														bgcolor: alpha(getLanguageInfo(selectedLang).color, 0.1),
														color: getLanguageInfo(selectedLang).color,
														fontWeight: 700,
														fontSize: '0.875rem',
														minWidth: 48,
													}}
												/>
											</TableCell>
											<TableCell align='right'>
												<Stack direction='row' spacing={1} justifyContent='flex-end'>
													<Tooltip title={t('view')}>
														<IconButton
															size='small'
															component={Link}
															href={`/materials/${item.section}?lang=${selectedLang}`}
															sx={{
																color: '#64748B',
																'&:hover': {
																	bgcolor: alpha('#667eea', 0.1),
																	color: '#667eea',
																},
															}}>
															<Visibility fontSize='small' />
														</IconButton>
													</Tooltip>
												</Stack>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			</Container>
		</Box>
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
