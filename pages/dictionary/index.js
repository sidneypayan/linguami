import useTranslation from 'next-translate/useTranslation'
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '../../context/user'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
	getAllUserWords,
	deleteUserWord,
} from '../../features/words/wordsSlice'
import { toggleFlashcardsContainer } from '../../features/cards/cardsSlice'
import Link from 'next/link'
import Head from 'next/head'
import {
	Box,
	Button,
	Container,
	IconButton,
	Table,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
	Stack,
	Chip,
	Paper,
	Pagination as MuiPagination,
	PaginationItem,
	ToggleButtonGroup,
	ToggleButton,
} from '@mui/material'
import { DeleteOutline, Add, School, ChevronLeft, ChevronRight } from '@mui/icons-material'
import Image from 'next/image'
import AddWordModal from '../../components/dictionary/AddWordModal'

const Dictionary = () => {
	const { t } = useTranslation('common')
	const { t: tWords } = useTranslation('words')
	const dispatch = useDispatch()
	const router = useRouter()
	const { user, isUserLoggedIn, isBootstrapping } = useUserContext()
	const userId = user?.id
	const {
		user_words,
		user_words_loading,
		user_words_pending,
		user_material_words_pending,
	} = useSelector(store => store.words)
	const [checkedWords, setCheckedWords] = useState([])
	const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [wordsPerPage, setWordsPerPage] = useState(20)

	const handleCheck = e => {
		if (e.target.checked) {
			setCheckedWords([...checkedWords, e.target.value])
		} else {
			setCheckedWords(prevCheckedWords =>
				prevCheckedWords.filter(word => word !== e.target.value)
			)
		}
	}

	const handlePageChange = (event, value) => {
		setCurrentPage(value)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handleWordsPerPageChange = (event, newValue) => {
		if (newValue !== null) {
			setWordsPerPage(newValue === 'all' ? user_words.length : newValue)
			setCurrentPage(1)
		}
	}

	// Calculer les mots à afficher
	const indexOfLastWord = currentPage * wordsPerPage
	const indexOfFirstWord = indexOfLastWord - wordsPerPage
	const currentWords = wordsPerPage === user_words.length
		? user_words
		: user_words.slice(indexOfFirstWord, indexOfLastWord)
	const totalPages = Math.ceil(user_words.length / wordsPerPage)

	useEffect(() => {
		// Attendre que le bootstrap soit terminé avant de rediriger
		if (isBootstrapping) return

		if (!isUserLoggedIn) {
			router.push('/')
			return
		}

		dispatch(getAllUserWords(userId))
	}, [
		dispatch,
		isUserLoggedIn,
		isBootstrapping,
		userId,
		user_words_pending,
		user_material_words_pending,
		router,
	])

	if (user_words_loading) {
		return (
			<div className='loader'>
				<Image
					src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/loader.gif`}
					width={200}
					height={200}
					alt='loader'></Image>
			</div>
		)
	}

	return (
		<>
			<Head>
				<title>Linguami | Dictionnaire personnel</title>
			</Head>

			{user_words.length > 0 ? (
				<Container
					sx={{
						marginTop: { xs: '5rem', sm: '5.5rem', md: '6rem' },
						marginBottom: { xs: '2rem', sm: '3rem', md: '4rem' },
						px: { xs: 1, sm: 2, md: 3 },
					}}
					maxWidth='lg'>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							gap: { xs: 2, sm: 3 },
							justifyContent: 'center',
							alignItems: 'stretch',
							margin: { xs: '2rem auto', sm: '3rem auto' },
							maxWidth: '600px',
							px: { xs: 2, sm: 0 },
						}}>
						<Button
							variant='contained'
							size='large'
							startIcon={<School />}
							onClick={() => dispatch(toggleFlashcardsContainer(true))}
							sx={{
								flex: 1,
								minHeight: { xs: '54px', sm: '56px' },
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
								fontSize: { xs: '0.95rem', sm: '1rem' },
								fontWeight: 600,
								textTransform: 'none',
								borderRadius: 2,
								transition: 'all 0.3s ease',
								'&:hover': {
									transform: 'translateY(-2px)',
									boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
									background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
								},
								'&:active': {
									transform: 'scale(0.98)',
								},
							}}>
							<Box component='span' sx={{ display: { xs: 'none', sm: 'inline' } }}>
								{tWords('repeatwords')}
							</Box>
							<Box component='span' sx={{ display: { xs: 'inline', sm: 'none' } }}>
								Réviser
							</Box>
						</Button>
						<Button
							variant='contained'
							size='large'
							startIcon={<Add />}
							onClick={() => setIsAddWordModalOpen(true)}
							sx={{
								flex: 1,
								minHeight: { xs: '54px', sm: '56px' },
								background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
								boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)',
								fontSize: { xs: '0.95rem', sm: '1rem' },
								fontWeight: 600,
								textTransform: 'none',
								borderRadius: 2,
								transition: 'all 0.3s ease',
								'&:hover': {
									transform: 'translateY(-2px)',
									boxShadow: '0 6px 20px rgba(245, 87, 108, 0.6)',
									background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
								},
								'&:active': {
									transform: 'scale(0.98)',
								},
							}}>
							<Box component='span' sx={{ display: { xs: 'none', sm: 'inline' } }}>
								{tWords('add_word_btn')}
							</Box>
							<Box component='span' sx={{ display: { xs: 'inline', sm: 'none' } }}>
								Ajouter
							</Box>
						</Button>
					</Box>

					{/* Contrôles de pagination */}
					<Paper
						elevation={0}
						sx={{
							p: 2,
							mb: 3,
							backgroundColor: 'rgba(102, 126, 234, 0.05)',
							borderRadius: 3,
							border: '2px solid rgba(102, 126, 234, 0.1)',
						}}>
						<Stack
							direction={{ xs: 'column', sm: 'row' }}
							spacing={2}
							alignItems='center'
							justifyContent='space-between'>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
								<Typography
									variant='body2'
									sx={{
										fontWeight: 600,
										color: '#4a5568',
									}}>
									Afficher par page :
								</Typography>
								<ToggleButtonGroup
									value={wordsPerPage === user_words.length ? 'all' : wordsPerPage}
									exclusive
									onChange={handleWordsPerPageChange}
									size='small'
									sx={{
										'& .MuiToggleButton-root': {
											px: { xs: 1.5, sm: 2 },
											py: { xs: 0.75, sm: 0.5 },
											minHeight: { xs: '40px', sm: '36px' },
											border: '2px solid #e0e0e0',
											borderRadius: 2,
											fontWeight: 600,
											fontSize: { xs: '0.8rem', sm: '0.875rem' },
											color: '#4a5568',
											transition: 'all 0.2s ease',
											'&.Mui-selected': {
												background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
												color: 'white',
												borderColor: '#667eea',
												'&:hover': {
													background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
												},
											},
											'&:hover': {
												backgroundColor: 'rgba(102, 126, 234, 0.1)',
												borderColor: '#667eea',
											},
											'&:active': {
												transform: 'scale(0.97)',
											},
										},
									}}>
									<ToggleButton value={20}>20</ToggleButton>
									<ToggleButton value={50}>50</ToggleButton>
									<ToggleButton value={100}>100</ToggleButton>
									<ToggleButton value='all'>Tous</ToggleButton>
								</ToggleButtonGroup>
							</Box>
							<Chip
								label={`${user_words.length} mot${user_words.length > 1 ? 's' : ''} au total`}
								sx={{
									background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
									color: 'white',
									fontWeight: 600,
									px: 1,
								}}
							/>
						</Stack>
					</Paper>

					<TableContainer>
						<Table>
							{currentWords.map((word, index) => (
								<tbody key={index}>
									<TableRow
										sx={{
											'&:hover': {
												backgroundColor: 'rgba(102, 126, 234, 0.05)',
											},
											transition: 'background-color 0.2s ease',
										}}>
										<TableCell
											sx={{
												borderBottom: '1px solid #e0e0e0',
												py: { xs: 2, sm: 1.5 },
											}}>
											<Typography
												sx={{
													fontWeight: 700,
													fontSize: { xs: '1rem', sm: '1.1rem' },
													background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
													WebkitBackgroundClip: 'text',
													WebkitTextFillColor: 'transparent',
													backgroundClip: 'text',
													mb: 0.5,
												}}
												variant='subtitle1'>
												{word.word_ru}
											</Typography>
											<Typography
												variant='subtitle1'
												sx={{
													color: '#718096',
													fontWeight: 500,
													fontSize: '0.95rem',
												}}>
												{word.word_fr}
											</Typography>
										</TableCell>
										<TableCell
											sx={{
												display: { xs: 'none', md: 'table-cell' },
												borderBottom: '1px solid #e0e0e0',
												color: '#4a5568',
												fontStyle: 'italic',
											}}>
											{word.word_sentence}
										</TableCell>
										<TableCell
											sx={{
												borderBottom: '1px solid #e0e0e0',
												py: { xs: 2, sm: 1.5 },
											}}>
											<IconButton
												onClick={() => dispatch(deleteUserWord(word.id))}
												sx={{
													color: '#f5576c',
													width: { xs: '44px', sm: '40px' },
													height: { xs: '44px', sm: '40px' },
													transition: 'all 0.2s ease',
													'&:hover': {
														backgroundColor: 'rgba(245, 87, 108, 0.1)',
														transform: 'scale(1.1)',
													},
													'&:active': {
														transform: 'scale(0.95)',
													},
												}}>
												<DeleteOutline sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem' } }} />
											</IconButton>
										</TableCell>
									</TableRow>
								</tbody>
							))}
						</Table>
					</TableContainer>

					{/* Pagination */}
					{wordsPerPage < user_words.length && (
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								mt: 4,
							}}>
							<MuiPagination
								count={totalPages}
								page={currentPage}
								onChange={handlePageChange}
								renderItem={(item) => (
									<PaginationItem
										slots={{ previous: ChevronLeft, next: ChevronRight }}
										{...item}
										sx={{
											fontWeight: 600,
											fontSize: '0.95rem',
											border: '2px solid',
											borderColor: item.selected ? '#667eea' : '#e0e0e0',
											background: item.selected
												? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
												: 'rgba(255, 255, 255, 0.9)',
											color: item.selected ? 'white' : '#4a5568',
											borderRadius: 2,
											minWidth: '40px',
											height: '40px',
											mx: 0.5,
											transition: 'all 0.2s ease',
											'&:hover': {
												borderColor: '#667eea',
												backgroundColor: item.selected
													? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
													: 'rgba(102, 126, 234, 0.1)',
												transform: 'translateY(-2px)',
												boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
											},
											'&.Mui-disabled': {
												backgroundColor: '#f5f5f5',
												borderColor: '#e0e0e0',
												opacity: 0.5,
											},
										}}
									/>
								)}
								sx={{
									'& .MuiPagination-ul': {
										flexWrap: 'wrap',
										justifyContent: 'center',
									},
								}}
							/>
						</Box>
					)}

					<AddWordModal
						open={isAddWordModalOpen}
						onClose={() => setIsAddWordModalOpen(false)}
					/>
				</Container>
			) : (
				<Container
					maxWidth='md'
					sx={{ textAlign: 'center', marginTop: '6rem', marginBottom: '4rem' }}>
					<Typography variant='h5' mb={2} sx={{ fontWeight: 600, color: 'text.primary' }}>
						{t('nowords')}
					</Typography>
					<Typography variant='body1' mb={5} sx={{ color: 'text.secondary' }}>
						Commencez à construire votre dictionnaire personnel
					</Typography>
					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', sm: 'row' },
							gap: 3,
							justifyContent: 'center',
							maxWidth: '500px',
							margin: '0 auto',
						}}>
						<Link href='/materials' style={{ flex: 1 }}>
							<Button
								variant='contained'
								size='large'
								fullWidth
								sx={{
									minHeight: '56px',
									background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
									boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
									fontSize: '1rem',
									fontWeight: 600,
									textTransform: 'none',
									borderRadius: 2,
									transition: 'all 0.3s ease',
									'&:hover': {
										transform: 'translateY(-2px)',
										boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)',
										background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
									},
								}}>
								{t('start')}
							</Button>
						</Link>
						<Button
							variant='contained'
							size='large'
							startIcon={<Add />}
							onClick={() => setIsAddWordModalOpen(true)}
							sx={{
								flex: 1,
								minHeight: '56px',
								background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
								boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)',
								fontSize: '1rem',
								fontWeight: 600,
								textTransform: 'none',
								borderRadius: 2,
								transition: 'all 0.3s ease',
								'&:hover': {
									transform: 'translateY(-2px)',
									boxShadow: '0 6px 20px rgba(245, 87, 108, 0.6)',
									background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
								},
							}}>
							{tWords('add_word_btn')}
						</Button>
					</Box>
					<AddWordModal
						open={isAddWordModalOpen}
						onClose={() => setIsAddWordModalOpen(false)}
					/>
				</Container>
			)}
		</>
	)
}

export default Dictionary
