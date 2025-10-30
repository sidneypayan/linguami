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
	Typography,
	Stack,
	Chip,
	Paper,
	Pagination as MuiPagination,
	PaginationItem,
	ToggleButtonGroup,
	ToggleButton,
	Card,
} from '@mui/material'
import {
	DeleteRounded,
	AddCircleRounded,
	FlashOnRounded,
	ChevronLeft,
	ChevronRight,
	AutoStoriesRounded,
	BookmarkAddRounded,
} from '@mui/icons-material'
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
							startIcon={<FlashOnRounded />}
							onClick={() => dispatch(toggleFlashcardsContainer(true))}
							sx={{
								flex: 1,
								py: 2,
								borderRadius: 3,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								fontWeight: 700,
								fontSize: { xs: '1rem', sm: '1.0625rem' },
								textTransform: 'none',
								boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
								transition: 'all 0.3s ease',
								'&:hover': {
									background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
									transform: 'translateY(-2px)',
									boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
								},
								'&:active': {
									transform: 'translateY(0)',
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
							startIcon={<AddCircleRounded />}
							onClick={() => setIsAddWordModalOpen(true)}
							sx={{
								flex: 1,
								py: 2,
								borderRadius: 3,
								background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
								fontWeight: 700,
								fontSize: { xs: '1rem', sm: '1.0625rem' },
								textTransform: 'none',
								boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
								transition: 'all 0.3s ease',
								'&:hover': {
									background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
									transform: 'translateY(-2px)',
									boxShadow: '0 12px 32px rgba(16, 185, 129, 0.5)',
								},
								'&:active': {
									transform: 'translateY(0)',
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
							p: { xs: 2.5, sm: 3 },
							mb: 4,
							background: 'white',
							borderRadius: 4,
							border: '1px solid rgba(102, 126, 234, 0.15)',
							boxShadow: '0 4px 16px rgba(102, 126, 234, 0.08)',
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
										fontWeight: 700,
										color: '#4a5568',
										fontSize: '0.9375rem',
									}}>
									{tWords('words_per_page')}
								</Typography>
								<ToggleButtonGroup
									value={wordsPerPage === user_words.length ? 'all' : wordsPerPage}
									exclusive
									onChange={handleWordsPerPageChange}
									size='small'
									sx={{
										'& .MuiToggleButton-root': {
											px: { xs: 1.5, sm: 2 },
											py: { xs: 0.75, sm: 0.75 },
											minHeight: { xs: '40px', sm: '40px' },
											border: '1px solid rgba(102, 126, 234, 0.2)',
											borderRadius: 2,
											fontWeight: 700,
											fontSize: { xs: '0.875rem', sm: '0.9375rem' },
											color: '#718096',
											transition: 'all 0.3s ease',
											'&.Mui-selected': {
												background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
												color: 'white',
												borderColor: '#667eea',
												boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
												'&:hover': {
													background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
													boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
												},
											},
											'&:hover': {
												backgroundColor: 'rgba(102, 126, 234, 0.08)',
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
									<ToggleButton value='all'>{tWords('all')}</ToggleButton>
								</ToggleButtonGroup>
							</Box>
							<Chip
								label={`${user_words.length} ${
									user_words.length > 1 ? tWords('words_total_plural') : tWords('words_total')
								}`}
								sx={{
									background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
									color: 'white',
									fontWeight: 700,
									fontSize: '0.9375rem',
									px: 2,
									py: 2.5,
									boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
								}}
							/>
						</Stack>
					</Paper>

					{/* Liste des mots */}
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						{currentWords.map((word, index) => (
							<Card
								key={index}
								sx={{
									p: { xs: 2, sm: 2.5 },
									borderRadius: 3,
									background: 'white',
									border: '1px solid rgba(102, 126, 234, 0.1)',
									boxShadow: '0 2px 8px rgba(102, 126, 234, 0.08)',
									transition: 'all 0.3s ease',
									'&:hover': {
										transform: 'translateY(-2px)',
										boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
										'& .delete-btn': {
											opacity: 1,
										},
									},
								}}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										gap: 2,
									}}>
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 2,
												mb: word.word_sentence ? 1.5 : 0,
												flexWrap: 'wrap',
											}}>
											<Chip
												label={word.word_ru}
												sx={{
													fontWeight: 700,
													fontSize: { xs: '0.9375rem', sm: '1rem' },
													background:
														'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
													color: '#667eea',
													border: '1px solid rgba(102, 126, 234, 0.2)',
													px: 1.5,
												}}
											/>
											<Typography
												sx={{
													fontSize: { xs: '0.875rem', sm: '1rem' },
													color: '#718096',
													fontWeight: 500,
												}}>
												→
											</Typography>
											<Typography
												sx={{
													fontSize: { xs: '0.9375rem', sm: '1rem' },
													color: '#4a5568',
													fontWeight: 600,
												}}>
												{word.word_fr}
											</Typography>
										</Box>
										{word.word_sentence && (
											<Typography
												sx={{
													fontSize: { xs: '0.875rem', sm: '0.9375rem' },
													color: '#718096',
													fontStyle: 'italic',
													lineHeight: 1.6,
													pl: { xs: 0, sm: 1 },
												}}>
												"{word.word_sentence}"
											</Typography>
										)}
									</Box>
									<IconButton
										className='delete-btn'
										onClick={() => dispatch(deleteUserWord(word.id))}
										sx={{
											opacity: { xs: 1, md: 0 },
											transition: 'all 0.3s ease',
											color: '#ef4444',
											'&:hover': {
												background: 'rgba(239, 68, 68, 0.1)',
												transform: 'scale(1.1)',
											},
										}}>
										<DeleteRounded />
									</IconButton>
								</Box>
							</Card>
						))}
					</Box>

					{/* Pagination */}
					{wordsPerPage < user_words.length && (
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								mt: 5,
							}}>
							<MuiPagination
								count={totalPages}
								page={currentPage}
								onChange={handlePageChange}
								size='large'
								renderItem={(item) => (
									<PaginationItem
										slots={{ previous: ChevronLeft, next: ChevronRight }}
										{...item}
										sx={{
											fontWeight: 700,
											fontSize: '1rem',
											border: '1px solid',
											borderColor: item.selected ? '#667eea' : 'rgba(102, 126, 234, 0.2)',
											background: item.selected
												? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
												: 'white',
											color: item.selected ? 'white' : '#4a5568',
											borderRadius: 2,
											minWidth: '44px',
											height: '44px',
											mx: 0.5,
											transition: 'all 0.3s ease',
											boxShadow: item.selected
												? '0 4px 12px rgba(102, 126, 234, 0.3)'
												: '0 2px 6px rgba(102, 126, 234, 0.08)',
											'&:hover': {
												borderColor: '#667eea',
												background: item.selected
													? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
													: 'rgba(102, 126, 234, 0.08)',
												transform: 'translateY(-2px)',
												boxShadow: '0 6px 16px rgba(102, 126, 234, 0.25)',
											},
											'&.Mui-disabled': {
												backgroundColor: '#f5f5f5',
												borderColor: 'rgba(102, 126, 234, 0.1)',
												opacity: 0.4,
											},
										}}
									/>
								)}
								sx={{
									'& .MuiPagination-ul': {
										flexWrap: 'wrap',
										justifyContent: 'center',
										gap: 0.5,
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
					sx={{
						marginTop: { xs: '5rem', sm: '5.5rem', md: '6rem' },
						marginBottom: { xs: '2rem', sm: '3rem', md: '4rem' },
					}}>
					<Card
						sx={{
							p: { xs: 3, sm: 4, md: 5 },
							borderRadius: 4,
							boxShadow: '0 8px 32px rgba(102, 126, 234, 0.12)',
							border: '1px solid rgba(102, 126, 234, 0.1)',
							background: 'white',
						}}>
						<Typography
							variant='h4'
							align='center'
							sx={{
								fontWeight: 800,
								mb: 1,
								fontSize: { xs: '1.5rem', sm: '1.75rem' },
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							{tWords('dictionary_empty_title')}
						</Typography>
						<Typography
							variant='body1'
							align='center'
							sx={{
								color: '#718096',
								fontSize: { xs: '0.9375rem', sm: '1rem' },
								mb: 4,
								fontWeight: 500,
							}}>
							{t('nowords')}
						</Typography>

						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 2.5,
								mb: 4,
							}}>
							{[
								{ icon: AutoStoriesRounded, text: tWords('feature_translate_materials') },
								{ icon: BookmarkAddRounded, text: tWords('feature_save_words') },
								{ icon: FlashOnRounded, text: tWords('feature_flashcards') },
								{ icon: AddCircleRounded, text: tWords('feature_add_manually') },
							].map((item, index) => (
								<Box
									key={index}
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 2,
										p: 2,
										borderRadius: 2,
										background:
											'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
										border: '1px solid rgba(102, 126, 234, 0.1)',
										transition: 'all 0.3s ease',
										'&:hover': {
											transform: 'translateX(8px)',
											background:
												'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
											border: '1px solid rgba(102, 126, 234, 0.2)',
										},
									}}>
									<Box
										sx={{
											width: 44,
											height: 44,
											borderRadius: 2,
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
										}}>
										<item.icon sx={{ color: 'white', fontSize: '1.5rem' }} />
									</Box>
									<Typography
										sx={{
											fontSize: { xs: '0.9375rem', sm: '1rem' },
											color: '#4a5568',
											fontWeight: 600,
										}}>
										{item.text}
									</Typography>
								</Box>
							))}
						</Box>

						<Box
							sx={{
								display: 'flex',
								flexDirection: { xs: 'column', sm: 'row' },
								gap: 2,
								justifyContent: 'center',
							}}>
							<Link href='/materials' style={{ flex: 1, textDecoration: 'none' }}>
								<Button
									variant='contained'
									size='large'
									fullWidth
									sx={{
										py: 2,
										borderRadius: 3,
										background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										fontWeight: 700,
										fontSize: '1.0625rem',
										textTransform: 'none',
										boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
										transition: 'all 0.3s ease',
										'&:hover': {
											background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
											transform: 'translateY(-2px)',
											boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
										},
										'&:active': {
											transform: 'translateY(0)',
										},
									}}>
									{t('start')}
								</Button>
							</Link>
							<Button
								variant='contained'
								size='large'
								startIcon={<AddCircleRounded />}
								onClick={() => setIsAddWordModalOpen(true)}
								sx={{
									flex: 1,
									py: 2,
									borderRadius: 3,
									background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
									fontWeight: 700,
									fontSize: '1.0625rem',
									textTransform: 'none',
									boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
									transition: 'all 0.3s ease',
									'&:hover': {
										background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
										transform: 'translateY(-2px)',
										boxShadow: '0 12px 32px rgba(16, 185, 129, 0.5)',
									},
									'&:active': {
										transform: 'translateY(0)',
									},
								}}>
								{tWords('add_word_btn')}
							</Button>
						</Box>
					</Card>
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
