'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUserContext } from '@/context/user'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getUserWords, deleteWord } from '@/lib/words-client'
import { useFlashcards } from '@/context/flashcards'
import { useDispatch } from 'react-redux'
import { getGuestWordsByLanguage, deleteGuestWord, GUEST_DICTIONARY_CONFIG } from '@/utils/guestDictionary'
import toast from '@/utils/toast'
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
	useTheme,
	TextField,
	InputAdornment,
} from '@mui/material'
import {
	DeleteRounded,
	AddCircleRounded,
	FlashOnRounded,
	ChevronLeft,
	ChevronRight,
	AutoStoriesRounded,
	BookmarkAddRounded,
	SearchRounded,
} from '@mui/icons-material'
import AddWordModal from '@/components/dictionary/AddWordModal'
import LoadingSpinner from '@/components/LoadingSpinner'

const DictionaryClient = ({ translations }) => {
	const t = useTranslations('words')
	const locale = useLocale()
	const dispatch = useDispatch()
const { openFlashcards } = useFlashcards()
	const router = useRouter()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { user, isUserLoggedIn, isBootstrapping, userLearningLanguage } = useUserContext()
	const userId = user?.id
	const queryClient = useQueryClient()

	const [checkedWords, setCheckedWords] = useState([])
	const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [wordsPerPage, setWordsPerPage] = useState(20)
	const [guestWords, setGuestWords] = useState([])
	const [searchQuery, setSearchQuery] = useState('')

	// React Query: Fetch user words (only for logged-in users)
	const { data: user_words = [], isLoading: user_words_loading } = useQuery({
		queryKey: ['userWords', userId, userLearningLanguage],
		queryFn: () => getUserWords({ userId, userLearningLanguage }),
		enabled: !!userId && !!userLearningLanguage && isUserLoggedIn && !isBootstrapping,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})

	// Temporary: Sync React Query data with Redux for components still using Redux (Flashcards)
	useEffect(() => {
		if (user_words_loading) {
			dispatch({ type: 'words/getAllUserWords/pending' })
		} else if (user_words && user_words.length >= 0) {
			dispatch({ type: 'words/getAllUserWords/fulfilled', payload: user_words })
		}
	}, [user_words, user_words_loading, dispatch])

	// React Query: Delete word mutation
	const deleteWordMutation = useMutation({
		mutationFn: deleteWord,
		onSuccess: () => {
			// Invalidate cache to refetch data
			queryClient.invalidateQueries({ queryKey: ['userWords', userId, userLearningLanguage] })
			toast.success(t('word_deleted') || 'Mot supprimé')
		},
		onError: () => {
			toast.error(t('delete_error') || 'Erreur lors de la suppression')
		}
	})

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

	const handleDeleteWord = useCallback((wordId) => {
		if (isUserLoggedIn) {
			// Utilisateur connecté : utiliser React Query
			deleteWordMutation.mutate(wordId)
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
	}, [isUserLoggedIn, deleteWordMutation, userLearningLanguage])

	// Filtrer les mots pour n'afficher que ceux traduits dans le contexte actuel
	const filteredUserWords = useMemo(() => {
		// Utiliser guestWords pour les invités, user_words pour les utilisateurs connectés
		const wordsSource = isUserLoggedIn ? user_words : guestWords

		if (!wordsSource || !userLearningLanguage || !locale) return []

		// Ne pas afficher de mots si la langue d'apprentissage est la même que la langue d'interface
		if (userLearningLanguage === locale) return []

		const filtered = wordsSource.filter(word => {
			const sourceWord = word[`word_${userLearningLanguage}`]
			const translation = word[`word_${locale}`]

			// N'afficher que les mots qui ont à la fois le mot source ET la traduction
			if (!sourceWord || !translation) return false

			// Filtrer par recherche si une query est présente
			if (searchQuery.trim()) {
				const query = searchQuery.toLowerCase()
				const sourceMatch = sourceWord.toLowerCase().includes(query)
				const translationMatch = translation.toLowerCase().includes(query)
				return sourceMatch || translationMatch
			}

			return true
		})

		// Trier par date de création, du plus récent au plus ancien
		return filtered.sort((a, b) => {
			const dateA = new Date(a.created_at)
			const dateB = new Date(b.created_at)
			return dateB - dateA // Ordre décroissant (plus récent d'abord)
		})
	}, [user_words, guestWords, userLearningLanguage, locale, isUserLoggedIn, searchQuery])

	// Fonction pour obtenir le mot source et la traduction selon les langues
	const getWordDisplay = (word) => {
		// Mot source : dans la langue qu'ils apprennent (userLearningLanguage)
		const sourceWord = word[`word_${userLearningLanguage}`]
		// Traduction : dans la langue de l'interface (lang)
		const translation = word[`word_${locale}`]

		return { sourceWord, translation }
	}

	// Calculer les mots à afficher
	const indexOfLastWord = currentPage * wordsPerPage
	const indexOfFirstWord = indexOfLastWord - wordsPerPage
	const currentWords = wordsPerPage === filteredUserWords.length
		? filteredUserWords
		: filteredUserWords.slice(indexOfFirstWord, indexOfLastWord)
	const totalPages = Math.ceil(filteredUserWords.length / wordsPerPage)

	// Load guest words from localStorage (React Query handles logged-in users)
	useEffect(() => {
		if (isBootstrapping) return

		if (!isUserLoggedIn && userLearningLanguage) {
			const words = getGuestWordsByLanguage(userLearningLanguage)
			setGuestWords(words)
		}
	}, [isUserLoggedIn, isBootstrapping, userLearningLanguage])

	if (user_words_loading) {
		return <LoadingSpinner />
	}

	// Guest user message - Si invité avec 0 mots
	if (!isUserLoggedIn && !isBootstrapping && guestWords.length === 0) {
		return (
			<>
				<Container
					maxWidth='md'
					sx={{
						pt: { xs: '6.5rem', md: '7rem' },
						pb: { xs: 4, md: 6 },
					}}>
					<Card
						sx={{
							p: { xs: 3, sm: 4, md: 5 },
							borderRadius: 4,
							boxShadow: '0 8px 40px rgba(139, 92, 246, 0.2)',
							border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
							background: isDark
								? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
								: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
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
								color: isDark ? '#94a3b8' : '#718096',
								fontSize: { xs: '0.9375rem', sm: '1rem' },
								mb: 4,
								fontWeight: 500,
							}}>
							{translations.guest_dictionary_message}
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
								{ icon: BookmarkAddRounded, text: translations.feature_save_words },
								{ icon: FlashOnRounded, text: translations.feature_flashcards },
								{ icon: AddCircleRounded, text: translations.feature_add_manually },
								{ icon: AutoStoriesRounded, text: translations.dictionary_disabled_benefit_access },
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
											color: isDark ? '#e2e8f0' : '#4a5568',
											fontWeight: 600,
										}}>
										{item.text}
									</Typography>
								</Box>
							))}
						</Box>

						<Link href='/login' style={{ textDecoration: 'none' }}>
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
								{translations.noaccount}
							</Button>
						</Link>
					</Card>
				</Container>
			</>
		)
	}

	return (
		<>
			{filteredUserWords.length > 0 ? (
				<Container
					sx={{
						pt: { xs: '6.5rem', md: '7rem' },
						pb: { xs: 3, md: 4 },
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
							onClick={() => openFlashcards()}
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
								{translations.repeatwords}
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
								{translations.add_word_btn}
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
							background: isDark
								? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
								: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
							borderRadius: 4,
							border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
							boxShadow: isDark
								? '0 4px 20px rgba(139, 92, 246, 0.25)'
								: '0 4px 20px rgba(139, 92, 246, 0.15)',
						}}>
						<Stack
							direction={{ xs: 'column', sm: 'row' }}
							spacing={2}
							alignItems='center'
							justifyContent='space-between'>
							<TextField
								placeholder={translations.search_words}
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value)
									setCurrentPage(1)
								}}
								size='small'
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<SearchRounded sx={{ color: isDark ? '#8b5cf6' : '#7c3aed' }} />
										</InputAdornment>
									),
								}}
								sx={{
									minWidth: { xs: '100%', sm: 250 },
									'& .MuiOutlinedInput-root': {
										background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'white',
										borderRadius: 2,
										'& fieldset': {
											borderColor: 'rgba(139, 92, 246, 0.2)',
										},
										'&:hover fieldset': {
											borderColor: 'rgba(139, 92, 246, 0.4)',
										},
										'&.Mui-focused fieldset': {
											borderColor: 'rgba(139, 92, 246, 0.6)',
											boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
										},
									},
									'& .MuiInputBase-input': {
										color: isDark ? '#e2e8f0' : '#1e293b',
										fontSize: '0.9375rem',
									},
								}}
							/>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
								<Typography
									variant='body2'
									sx={{
										fontWeight: 700,
										color: isDark ? '#94a3b8' : '#4a5568',
										fontSize: '0.9375rem',
									}}>
									{translations.words_per_page}
								</Typography>
								<ToggleButtonGroup
									value={wordsPerPage === filteredUserWords.length ? 'all' : wordsPerPage}
									exclusive
									onChange={handleWordsPerPageChange}
									size='small'
									sx={{
										gap: 1,
										'& .MuiToggleButton-root': {
											px: { xs: 1.5, sm: 2 },
											py: { xs: 0.75, sm: 0.75 },
											minHeight: { xs: '40px', sm: '40px' },
											border: '1px solid rgba(139, 92, 246, 0.2)',
											borderRadius: 2,
											fontWeight: 700,
											fontSize: { xs: '0.875rem', sm: '0.9375rem' },
											color: isDark ? '#94a3b8' : '#718096',
											background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'white',
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
									<ToggleButton value='all'>{translations.all}</ToggleButton>
								</ToggleButtonGroup>
							</Box>
							<Chip
								label={`${filteredUserWords.length} ${
									filteredUserWords.length > 1 ? translations.words_total_plural : translations.words_total
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
									background: isDark
										? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
										: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
									border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
									boxShadow: isDark
										? '0 4px 20px rgba(139, 92, 246, 0.25)'
										: '0 4px 20px rgba(139, 92, 246, 0.15)',
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
													color: isDark ? '#94a3b8' : '#718096',
													fontWeight: 500,
												}}>
												→
											</Typography>
											<Typography
												sx={{
													fontSize: { xs: '0.9375rem', sm: '1rem' },
													color: isDark ? '#e2e8f0' : '#4a5568',
													fontWeight: 600,
												}}>
												{translation || '—'}
											</Typography>
										</Box>
										{word.word_sentence && (
											<Box
												sx={{
													mt: 1.5,
													pl: 2,
													py: 1,
													borderLeft: '3px solid',
													borderLeftColor: isDark
														? 'rgba(139, 92, 246, 0.4)'
														: 'rgba(139, 92, 246, 0.3)',
													backgroundColor: isDark
														? 'rgba(139, 92, 246, 0.05)'
														: 'rgba(139, 92, 246, 0.03)',
													borderRadius: '0 8px 8px 0',
												}}>
												<Typography
													sx={{
														fontSize: { xs: '0.875rem', sm: '0.9375rem' },
														color: isDark ? '#94a3b8' : '#718096',
														lineHeight: 1.6,
													}}>
													&ldquo;{word.word_sentence}&rdquo;
												</Typography>
											</Box>
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
												: isDark ? 'rgba(30, 41, 59, 0.8)' : 'white',
											color: item.selected ? 'white' : isDark ? '#94a3b8' : '#4a5568',
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
												backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : '#f5f5f5',
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
						pt: { xs: '6.5rem', md: '7rem' },
						pb: { xs: 4, md: 6 },
					}}>
					<Card
						sx={{
							p: { xs: 3, sm: 4, md: 5 },
							borderRadius: 4,
							boxShadow: '0 8px 40px rgba(139, 92, 246, 0.2)',
							border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
							background: isDark
								? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
								: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
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
							{translations.dictionary_empty_title}
						</Typography>
						<Typography
							variant='body1'
							align='center'
							sx={{
								color: isDark ? '#94a3b8' : '#718096',
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
								{ icon: AutoStoriesRounded, text: translations.feature_translate_materials },
								{ icon: BookmarkAddRounded, text: translations.feature_save_words },
								{ icon: FlashOnRounded, text: translations.feature_flashcards },
								{ icon: AddCircleRounded, text: translations.feature_add_manually },
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
											color: isDark ? '#e2e8f0' : '#4a5568',
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
									{translations.start}
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
								{translations.add_word_btn}
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

export default DictionaryClient
