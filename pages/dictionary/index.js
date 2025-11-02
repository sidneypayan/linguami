import useTranslation from 'next-translate/useTranslation'
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '../../context/user'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import {
	getAllUserWords,
	deleteUserWord,
} from '../../features/words/wordsSlice'
import { toggleFlashcardsContainer } from '../../features/cards/cardsSlice'
import Link from 'next/link'
import SEO from '../../components/SEO'
import { getGuestWordsByLanguage, deleteGuestWord, GUEST_DICTIONARY_CONFIG } from '../../utils/guestDictionary'
import { toast } from 'react-toastify'
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
import AddWordModal from '../../components/dictionary/AddWordModal'
import LoadingSpinner from '../../components/LoadingSpinner'

const Dictionary = () => {
	const { t, lang } = useTranslation('common')
	const { t: tWords } = useTranslation('words')
	const dispatch = useDispatch()
	const router = useRouter()
	const { user, isUserLoggedIn, isBootstrapping, userLearningLanguage } = useUserContext()
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
	const [guestWords, setGuestWords] = useState([])

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
			setWordsPerPage(newValue === 'all' ? filteredUserWords.length : newValue)
			setCurrentPage(1)
		}
	}

	const handleDeleteWord = (wordId) => {
		if (isUserLoggedIn) {
			// Utilisateur connecté : utiliser Redux/Supabase
			dispatch(deleteUserWord(wordId))
		} else {
			// Invité : supprimer de localStorage
			const success = deleteGuestWord(wordId)
			if (success) {
				// Recharger les mots
				const updatedWords = getGuestWordsByLanguage(userLearningLanguage)
				setGuestWords(updatedWords)
				toast.success('Mot supprimé')
			} else {
				toast.error('Erreur lors de la suppression')
			}
		}
	}

	// Filtrer les mots pour n'afficher que ceux traduits dans le contexte actuel
	const filteredUserWords = useMemo(() => {
		// Utiliser guestWords pour les invités, user_words pour les utilisateurs connectés
		const wordsSource = isUserLoggedIn ? user_words : guestWords

		if (!wordsSource || !userLearningLanguage || !lang) return []

		// Ne pas afficher de mots si la langue d'apprentissage est la même que la langue d'interface
		if (userLearningLanguage === lang) return []

		const filtered = wordsSource.filter(word => {
			const sourceWord = word[`word_${userLearningLanguage}`]
			const translation = word[`word_${lang}`]

			// N'afficher que les mots qui ont à la fois le mot source ET la traduction
			return sourceWord && translation
		})

		// Trier par date de création, du plus récent au plus ancien
		return filtered.sort((a, b) => {
			const dateA = new Date(a.created_at)
			const dateB = new Date(b.created_at)
			return dateB - dateA // Ordre décroissant (plus récent d'abord)
		})
	}, [user_words, guestWords, userLearningLanguage, lang, isUserLoggedIn])

	// Fonction pour obtenir le mot source et la traduction selon les langues
	const getWordDisplay = (word) => {
		// Mot source : dans la langue qu'ils apprennent (userLearningLanguage)
		const sourceWord = word[`word_${userLearningLanguage}`]
		// Traduction : dans la langue de l'interface (lang)
		const translation = word[`word_${lang}`]

		return { sourceWord, translation }
	}

	// Calculer les mots à afficher
	const indexOfLastWord = currentPage * wordsPerPage
	const indexOfFirstWord = indexOfLastWord - wordsPerPage
	const currentWords = wordsPerPage === filteredUserWords.length
		? filteredUserWords
		: filteredUserWords.slice(indexOfFirstWord, indexOfLastWord)
	const totalPages = Math.ceil(filteredUserWords.length / wordsPerPage)

	useEffect(() => {
		// Attendre que le bootstrap soit terminé
		if (isBootstrapping) return

		// Charger les mots seulement si l'utilisateur est connecté
		if (isUserLoggedIn && userId && userLearningLanguage) {
			dispatch(getAllUserWords({ userId, userLearningLanguage }))
		} else if (!isUserLoggedIn && userLearningLanguage) {
			// Charger les mots depuis localStorage pour les invités
			const words = getGuestWordsByLanguage(userLearningLanguage)
			setGuestWords(words)
		}
	}, [
		dispatch,
		isUserLoggedIn,
		isBootstrapping,
		userId,
		userLearningLanguage,
		user_words_pending,
		user_material_words_pending,
	])

	if (user_words_loading) {
		return <LoadingSpinner />
	}

	// Descriptions par langue pour la page
	const descriptions = {
		fr: 'Votre dictionnaire personnel avec tous vos mots sauvegardés. Révisez votre vocabulaire avec les flashcards et suivez votre progression.',
		ru: 'Ваш личный словарь со всеми сохраненными словами. Повторяйте словарный запас с помощью флеш-карт и отслеживайте свой прогресс.',
		en: 'Your personal dictionary with all your saved words. Review your vocabulary with flashcards and track your progress.'
	}

	const titles = {
		fr: 'Mon Dictionnaire Personnel',
		ru: 'Мой Личный Словарь',
		en: 'My Personal Dictionary'
	}

	// Guest user message - Si invité avec 0 mots
	if (!isUserLoggedIn && !isBootstrapping && guestWords.length === 0) {
		return (
			<>
				<SEO
					title={`${titles[router.locale] || titles.fr} | Linguami`}
					description={descriptions[router.locale] || descriptions.fr}
					path='/dictionary'
					noindex={true}
				/>

				{/* Header Section */}
				<Box
					sx={{
						pt: { xs: '5.5rem', md: '6rem' },
						pb: 3,
						borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
						bgcolor: '#fafafa',
					}}>
					<Container maxWidth='lg'>
						<Typography
							variant='h4'
							sx={{
								fontWeight: 700,
								fontSize: { xs: '1.75rem', sm: '2rem' },
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								mb: 1,
							}}>
							{titles[router.locale] || titles.fr}
						</Typography>
						<Typography
							variant='body2'
							sx={{
								color: '#667eea',
								fontWeight: 600,
								fontSize: '0.875rem',
							}}>
							✨ Mode gratuit : jusqu'à {GUEST_DICTIONARY_CONFIG.MAX_WORDS} mots
						</Typography>
					</Container>
				</Box>

				{/* Guest message */}
				<Container
					maxWidth='md'
					sx={{
						py: { xs: 4, md: 6 },
					}}>
					<Card
						sx={{
							p: { xs: 3, sm: 4, md: 5 },
							borderRadius: 4,
							boxShadow: '0 8px 40px rgba(139, 92, 246, 0.2)',
							border: '1px solid rgba(139, 92, 246, 0.2)',
							background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
						}}>
						<Typography
							variant='h5'
							align='center'
							sx={{
								fontWeight: 800,
								mb: 2,
								fontSize: { xs: '1.5rem', sm: '1.75rem' },
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							Testez gratuitement avec 20 mots !
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
							Vous pouvez sauvegarder jusqu'à 20 mots gratuitement et les réviser avec les flashcards. Créez un compte pour un accès illimité !
						</Typography>

						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 2.5,
								mb: 4,
								position: 'relative',
								zIndex: 1,
							}}>
							{[
								{ icon: BookmarkAddRounded, text: tWords('feature_save_words') },
								{ icon: FlashOnRounded, text: tWords('feature_flashcards') },
								{ icon: AddCircleRounded, text: tWords('feature_add_manually') },
								{ icon: AutoStoriesRounded, text: tWords('dictionary_disabled_benefit_access') },
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
											'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
										border: '1px solid rgba(139, 92, 246, 0.2)',
										transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
										position: 'relative',
										overflow: 'hidden',
										'&::before': {
											content: '""',
											position: 'absolute',
											top: 0,
											left: '-100%',
											width: '100%',
											height: '100%',
											background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent)',
											transition: 'left 0.5s ease',
										},
										'&:hover': {
											transform: 'translateX(8px)',
											background:
												'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)',
											border: '1px solid rgba(139, 92, 246, 0.4)',
											boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
											'&::before': {
												left: '100%',
											},
										},
									}}>
									<Box
										sx={{
											width: 44,
											height: 44,
											borderRadius: 2,
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)',
											border: '1px solid rgba(139, 92, 246, 0.4)',
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

						<Link href='/signin' style={{ textDecoration: 'none' }}>
							<Button
								variant='contained'
								size='large'
								fullWidth
								sx={{
									py: 2.5,
									borderRadius: 3,
									background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
									border: '1px solid rgba(139, 92, 246, 0.3)',
									fontWeight: 700,
									fontSize: '1.0625rem',
									textTransform: 'none',
									boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
									transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
									'&:hover': {
										background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
										transform: 'translateY(-3px)',
										boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
										borderColor: 'rgba(139, 92, 246, 0.5)',
									},
									'&:active': {
										transform: 'translateY(0)',
									},
								}}>
								{tWords('noaccount')}
							</Button>
						</Link>
					</Card>
				</Container>
			</>
		)
	}

	return (
		<>
			<SEO
				title={`${titles[router.locale] || titles.fr} | Linguami`}
				description={descriptions[router.locale] || descriptions.fr}
				path='/dictionary'
				noindex={true}  // Page privée, ne pas indexer
			/>

			{/* Header Section - App Style */}
			<Box
				sx={{
					pt: { xs: '5.5rem', md: '6rem' },
					pb: 3,
					borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
					bgcolor: '#fafafa',
				}}>
				<Container maxWidth='lg'>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
						<Box>
							<Typography
								variant='h4'
								sx={{
									fontWeight: 700,
									fontSize: { xs: '1.75rem', sm: '2rem' },
									background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									mb: 1,
								}}>
								{titles[router.locale] || titles.fr}
							</Typography>
							<Typography
								variant='body1'
								sx={{
									color: '#64748b',
									fontSize: { xs: '0.9375rem', sm: '1rem' },
								}}>
								{descriptions[router.locale] || descriptions.fr}
							</Typography>
						</Box>
						{!isUserLoggedIn && (
							<Chip
								label={`${guestWords.length}/${GUEST_DICTIONARY_CONFIG.MAX_WORDS} mots gratuits`}
								sx={{
									background: guestWords.length >= GUEST_DICTIONARY_CONFIG.MAX_WORDS
										? 'linear-gradient(135deg, rgba(245, 87, 108, 0.9) 0%, rgba(239, 68, 68, 0.8) 100%)'
										: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
									border: '1px solid rgba(139, 92, 246, 0.4)',
									color: 'white',
									fontWeight: 700,
									fontSize: '0.9375rem',
									px: 2,
									py: 2.5,
									boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4), 0 0 15px rgba(6, 182, 212, 0.2)',
								}}
							/>
						)}
					</Box>
				</Container>
			</Box>

			{filteredUserWords.length > 0 ? (
				<Container
					sx={{
						py: { xs: 3, md: 4 },
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
								py: 2.5,
								borderRadius: 3,
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								fontWeight: 700,
								fontSize: { xs: '1rem', sm: '1.0625rem' },
								textTransform: 'none',
								boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
								transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
								'&:hover': {
									background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
									transform: 'translateY(-3px)',
									boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
									borderColor: 'rgba(139, 92, 246, 0.5)',
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
								py: 2.5,
								borderRadius: 3,
								background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
								border: '1px solid rgba(16, 185, 129, 0.3)',
								fontWeight: 700,
								fontSize: { xs: '1rem', sm: '1.0625rem' },
								textTransform: 'none',
								boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
								transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
								'&:hover': {
									background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
									transform: 'translateY(-3px)',
									boxShadow: '0 12px 40px rgba(16, 185, 129, 0.5)',
									borderColor: 'rgba(16, 185, 129, 0.5)',
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
							background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
							borderRadius: 4,
							border: '1px solid rgba(139, 92, 246, 0.2)',
							boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
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
									value={wordsPerPage === filteredUserWords.length ? 'all' : wordsPerPage}
									exclusive
									onChange={handleWordsPerPageChange}
									size='small'
									sx={{
										'& .MuiToggleButton-root': {
											px: { xs: 1.5, sm: 2 },
											py: { xs: 0.75, sm: 0.75 },
											minHeight: { xs: '40px', sm: '40px' },
											border: '1px solid rgba(139, 92, 246, 0.2)',
											borderRadius: 2,
											fontWeight: 700,
											fontSize: { xs: '0.875rem', sm: '0.9375rem' },
											color: '#718096',
											background: 'white',
											transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
											position: 'relative',
											overflow: 'hidden',
											'&::before': {
												content: '""',
												position: 'absolute',
												top: 0,
												left: '-100%',
												width: '100%',
												height: '100%',
												background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
												transition: 'left 0.5s ease',
											},
											'&.Mui-selected': {
												background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
												color: 'white',
												borderColor: 'rgba(139, 92, 246, 0.6)',
												boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4), 0 0 15px rgba(6, 182, 212, 0.2)',
												'&:hover': {
													background: 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(6, 182, 212, 0.9) 100%)',
													boxShadow: '0 4px 12px rgba(139, 92, 246, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)',
													'&::before': {
														left: '100%',
													},
												},
											},
											'&:hover': {
												backgroundColor: 'rgba(139, 92, 246, 0.08)',
												borderColor: 'rgba(139, 92, 246, 0.4)',
												'&::before': {
													left: '100%',
												},
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
								label={`${filteredUserWords.length} ${
									filteredUserWords.length > 1 ? tWords('words_total_plural') : tWords('words_total')
								}`}
								sx={{
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
									border: '1px solid rgba(139, 92, 246, 0.4)',
									color: 'white',
									fontWeight: 700,
									fontSize: '0.9375rem',
									px: 2,
									py: 2.5,
									boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4), 0 0 15px rgba(6, 182, 212, 0.2)',
								}}
							/>
						</Stack>
					</Paper>

					{/* Liste des mots */}
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						{currentWords.map((word, index) => {
							const { sourceWord, translation } = getWordDisplay(word)
							return (
							<Card
								key={index}
								sx={{
									p: { xs: 2, sm: 2.5 },
									borderRadius: 4,
									background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
									border: '1px solid rgba(139, 92, 246, 0.2)',
									boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
									transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
									position: 'relative',
									overflow: 'hidden',
									'&::before': {
										content: '""',
										position: 'absolute',
										top: 0,
										left: '-100%',
										width: '100%',
										height: '100%',
										background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
										transition: 'left 0.5s ease',
									},
									'&:hover': {
										transform: 'translateY(-4px)',
										boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3)',
										borderColor: 'rgba(139, 92, 246, 0.4)',
										'&::before': {
											left: '100%',
										},
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
												label={sourceWord || '—'}
												sx={{
													fontWeight: 700,
													fontSize: { xs: '0.9375rem', sm: '1rem' },
													background:
														'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
													color: '#8b5cf6',
													border: '1px solid rgba(139, 92, 246, 0.3)',
													px: 1.5,
													backdropFilter: 'blur(10px)',
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
												{translation || '—'}
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
												&ldquo;{word.word_sentence}&rdquo;
											</Typography>
										)}
									</Box>
									<IconButton
										className='delete-btn'
										onClick={() => handleDeleteWord(word.id)}
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
						)})}
					</Box>

					{/* Pagination */}
					{wordsPerPage < filteredUserWords.length && (
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
											borderColor: item.selected ? 'rgba(139, 92, 246, 0.6)' : 'rgba(139, 92, 246, 0.2)',
											background: item.selected
												? 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)'
												: 'white',
											color: item.selected ? 'white' : '#4a5568',
											borderRadius: 2,
											minWidth: '44px',
											height: '44px',
											mx: 0.5,
											transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
											position: 'relative',
											overflow: 'hidden',
											boxShadow: item.selected
												? '0 4px 12px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)'
												: '0 2px 6px rgba(139, 92, 246, 0.08)',
											'&::before': {
												content: '""',
												position: 'absolute',
												top: 0,
												left: '-100%',
												width: '100%',
												height: '100%',
												background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
												transition: 'left 0.5s ease',
											},
											'&:hover': {
												borderColor: 'rgba(139, 92, 246, 0.8)',
												background: item.selected
													? 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(6, 182, 212, 0.9) 100%)'
													: 'rgba(139, 92, 246, 0.08)',
												transform: 'translateY(-2px) scale(1.05)',
												boxShadow: item.selected
													? '0 6px 16px rgba(139, 92, 246, 0.5), 0 0 25px rgba(6, 182, 212, 0.3)'
													: '0 4px 12px rgba(139, 92, 246, 0.25)',
												'&::before': {
													left: '100%',
												},
											},
											'&.Mui-disabled': {
												backgroundColor: '#f5f5f5',
												borderColor: 'rgba(139, 92, 246, 0.1)',
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
						py: { xs: 4, md: 6 },
					}}>
					<Card
						sx={{
							p: { xs: 3, sm: 4, md: 5 },
							borderRadius: 4,
							boxShadow: '0 8px 40px rgba(139, 92, 246, 0.2)',
							border: '1px solid rgba(139, 92, 246, 0.2)',
							background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
						}}>
						<Typography
							variant='h4'
							align='center'
							sx={{
								fontWeight: 800,
								mb: 1,
								fontSize: { xs: '1.5rem', sm: '1.75rem' },
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
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
								position: 'relative',
								zIndex: 1,
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
											'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
										border: '1px solid rgba(139, 92, 246, 0.2)',
										transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
										position: 'relative',
										overflow: 'hidden',
										'&::before': {
											content: '""',
											position: 'absolute',
											top: 0,
											left: '-100%',
											width: '100%',
											height: '100%',
											background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent)',
											transition: 'left 0.5s ease',
										},
										'&:hover': {
											transform: 'translateX(8px)',
											background:
												'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)',
											border: '1px solid rgba(139, 92, 246, 0.4)',
											boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
											'&::before': {
												left: '100%',
											},
										},
									}}>
									<Box
										sx={{
											width: 44,
											height: 44,
											borderRadius: 2,
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)',
											border: '1px solid rgba(139, 92, 246, 0.4)',
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
								position: 'relative',
								zIndex: 1,
							}}>
							<Link href='/materials' style={{ flex: 1, textDecoration: 'none' }}>
								<Button
									variant='contained'
									size='large'
									fullWidth
									sx={{
										py: 2.5,
										borderRadius: 3,
										background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
										border: '1px solid rgba(139, 92, 246, 0.3)',
										fontWeight: 700,
										fontSize: '1.0625rem',
										textTransform: 'none',
										boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
										transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
										'&:hover': {
											background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
											transform: 'translateY(-3px)',
											boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
											borderColor: 'rgba(139, 92, 246, 0.5)',
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
									py: 2.5,
									borderRadius: 3,
									background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
									border: '1px solid rgba(16, 185, 129, 0.3)',
									fontWeight: 700,
									fontSize: '1.0625rem',
									textTransform: 'none',
									boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
									transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
									'&:hover': {
										background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
										transform: 'translateY(-3px)',
										boxShadow: '0 12px 40px rgba(16, 185, 129, 0.5)',
										borderColor: 'rgba(16, 185, 129, 0.5)',
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
