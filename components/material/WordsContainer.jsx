import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '../../context/user'
import {
	getUserMaterialWords,
	deleteUserWord,
} from '../../features/words/wordsSlice'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { toggleFlashcardsContainer } from '../../features/cards/cardsSlice'
import { getGuestWords, deleteGuestWord } from '../../utils/guestDictionary'
import toast from '../../utils/toast'
import {
	Box,
	Button,
	IconButton,
	Card,
	Typography,
	Chip,
	useTheme,
} from '@mui/material'
import {
	FavoriteBorderRounded,
	DeleteRounded,
	AutoStoriesRounded,
	BookmarkAddRounded,
	FlashOnRounded,
	VolunteerActivismRounded,
} from '@mui/icons-material'
import Link from 'next/link'

const WordsContainer = ({ sx = {} }) => {
	const { t, lang } = useTranslation('words')
	const router = useRouter()
	const dispatch = useDispatch()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { user, isUserLoggedIn, userLearningLanguage } = useUserContext()
	const { user_material_words, user_material_words_pending } = useSelector(
		store => store.words
	)
	const [guestWords, setGuestWords] = useState([])

	const materialId = router.query.material
	const userId = user?.id

	// Fonction pour charger les mots invités (mémorisée)
	const loadGuestWords = useCallback(() => {
		if (!isUserLoggedIn && typeof window !== 'undefined' && materialId) {
			const words = getGuestWords()
			// Filtrer les mots par matériel (comparer en string pour éviter les problèmes de type)
			const materialWords = words.filter(word => String(word.material_id) === String(materialId))
			setGuestWords(materialWords)
		}
	}, [isUserLoggedIn, materialId])

	// Charger les mots des invités depuis localStorage
	useEffect(() => {
		loadGuestWords()
	}, [loadGuestWords])

	// Écouter l'événement d'ajout de mot invité
	useEffect(() => {
		if (!isUserLoggedIn && typeof window !== 'undefined') {
			window.addEventListener('guestWordAdded', loadGuestWords)

			return () => {
				window.removeEventListener('guestWordAdded', loadGuestWords)
			}
		}
	}, [isUserLoggedIn, loadGuestWords])

	const handleDelete = id => {
		if (isUserLoggedIn) {
			dispatch(deleteUserWord(id))
		} else {
			// Supprimer le mot invité
			const success = deleteGuestWord(id)
			if (success) {
				// Recharger les mots
				loadGuestWords()
				toast.success(t('word_deleted') || 'Mot supprimé')

				// Émettre un événement pour notifier les autres composants
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new Event('guestWordDeleted'))
				}
			} else {
				toast.error(t('delete_error') || 'Erreur lors de la suppression')
			}
		}
	}

	// Filtrer les mots pour n'afficher que ceux traduits dans le contexte actuel
	const filteredWords = useMemo(() => {
		// Pour les invités, utiliser guestWords
		if (!isUserLoggedIn) {
			if (!guestWords || !userLearningLanguage || !lang) {
				return []
			}

			// Ne pas afficher de mots si la langue d'apprentissage est la même que la langue d'interface
			if (userLearningLanguage === lang) {
				return []
			}

			return guestWords.filter(word => {
				const sourceWord = word[`word_${userLearningLanguage}`]
				const translation = word[`word_${lang}`]

				// N'afficher que les mots qui ont à la fois le mot source ET la traduction
				return sourceWord && translation
			})
		}

		// Pour les utilisateurs connectés
		if (!user_material_words || !userLearningLanguage || !lang) return []

		// Ne pas afficher de mots si la langue d'apprentissage est la même que la langue d'interface
		if (userLearningLanguage === lang) return []

		return user_material_words.filter(word => {
			const sourceWord = word[`word_${userLearningLanguage}`]
			const translation = word[`word_${lang}`]

			// N'afficher que les mots qui ont à la fois le mot source ET la traduction
			return sourceWord && translation
		})
	}, [isUserLoggedIn, guestWords, user_material_words, userLearningLanguage, lang])

	// Fonction pour obtenir le mot source et la traduction selon les langues
	const getWordDisplay = (word) => {
		// Mot source : dans la langue qu'ils apprennent (userLearningLanguage)
		const sourceWord = word[`word_${userLearningLanguage}`]
		// Traduction : dans la langue de l'interface (lang)
		const translation = word[`word_${lang}`]

		return { sourceWord, translation }
	}

	useEffect(() => {
		if (isUserLoggedIn) dispatch(getUserMaterialWords({ materialId, userId }))
	}, [
		dispatch,
		isUserLoggedIn,
		materialId,
		userId,
		user_material_words_pending,
	])

	return (
		<Box sx={sx}>
			{filteredWords && filteredWords.length > 0 ? (
				<Box>
					{/* Bouton de révision */}
					<Button
						fullWidth
						variant='contained'
						size='large'
						startIcon={<FlashOnRounded />}
						onClick={() => dispatch(toggleFlashcardsContainer(true))}
						sx={{
							py: 2.5,
							borderRadius: 3,
							background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
							border: '1px solid rgba(139, 92, 246, 0.3)',
							fontWeight: 700,
							fontSize: { xs: '1rem', sm: '1.0625rem' },
							textTransform: 'none',
							boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
							transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
							mb: 3,
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
						{t('repeatwords')}
					</Button>

					{/* Liste des mots */}
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
						{filteredWords.map((words, index) => {
							const { sourceWord, translation } = getWordDisplay(words)
							return (
							<Card
								key={index}
								sx={{
									p: { xs: 2, sm: 2.5 },
									borderRadius: 4,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									gap: { xs: 1.5, sm: 2 },
									background: isDark
										? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
										: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
									border: '1px solid rgba(139, 92, 246, 0.2)',
									boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
									transition: 'opacity 0.2s ease',
									'&:hover': {
										'& .delete-btn': {
											opacity: 1,
										},
									},
								}}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										flexWrap: 'wrap',
										gap: { xs: 1, sm: 1.5 },
										flex: 1,
										minWidth: 0,
									}}>
									<Chip
										label={sourceWord || '—'}
										sx={{
											fontWeight: 700,
											fontSize: { xs: '0.875rem', sm: '0.9375rem' },
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
											color: '#8b5cf6',
											border: '1px solid rgba(139, 92, 246, 0.3)',
											px: { xs: 1.25, sm: 1.5 },
											backdropFilter: 'blur(10px)',
											height: 'auto',
											'& .MuiChip-label': {
												whiteSpace: 'nowrap',
												padding: '8px 0',
											},
										}}
									/>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: { xs: 1, sm: 1.5 },
										}}>
										<Typography
											sx={{
												fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
												color: isDark ? '#94a3b8' : '#718096',
												fontWeight: 500,
												flexShrink: 0,
											}}>
											→
										</Typography>
										<Typography
											sx={{
												fontSize: { xs: '0.875rem', sm: '0.9375rem' },
												color: isDark ? '#f1f5f9' : '#4a5568',
												fontWeight: 500,
												whiteSpace: 'nowrap',
											}}>
											{translation || '—'}
										</Typography>
									</Box>
								</Box>

								<IconButton
									className='delete-btn'
									onClick={() => handleDelete(words.id)}
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
							</Card>
						)})}
					</Box>
				</Box>
			) : !isUserLoggedIn ? (
				<Card
					sx={{
						p: { xs: 3, sm: 4, md: 5 },
						borderRadius: 4,
						boxShadow: '0 8px 40px rgba(139, 92, 246, 0.2)',
						border: '1px solid rgba(139, 92, 246, 0.2)',
						background: isDark
							? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
							: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
						mt: { xs: 2, md: 3 },
					}}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 3,
						}}>
						<Box
							sx={{
								width: 80,
								height: 80,
								borderRadius: 4,
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
								border: '2px solid rgba(255, 255, 255, 0.5)',
							}}>
							<BookmarkAddRounded sx={{ fontSize: '2.5rem', color: 'white' }} />
						</Box>

						<Typography
							variant='h4'
							align='center'
							sx={{
								fontWeight: 800,
								fontSize: { xs: '1.5rem', sm: '1.75rem' },
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							{t('guest_no_words_yet_title')}
						</Typography>

						<Typography
							variant='body1'
							align='center'
							sx={{
								color: isDark ? '#cbd5e1' : '#718096',
								fontSize: { xs: '1rem', sm: '1.0625rem' },
								lineHeight: 1.7,
								maxWidth: '500px',
							}}>
							{t('guest_no_words_yet_description')}
						</Typography>

						<Box
							sx={{
								width: '100%',
								maxWidth: '400px',
								p: 3,
								borderRadius: 3,
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
								border: '1px solid rgba(139, 92, 246, 0.2)',
								backdropFilter: 'blur(10px)',
							}}>
							<Typography
								sx={{
									fontSize: { xs: '0.875rem', sm: '0.9375rem' },
									color: isDark ? '#cbd5e1' : '#4a5568',
									fontWeight: 600,
									textAlign: 'center',
									lineHeight: 1.6,
								}}>
								{t('guest_no_words_yet_tip')}
							</Typography>
						</Box>
					</Box>
				</Card>
			) : (
				<Card
					sx={{
						p: { xs: 3, sm: 4, md: 5 },
						borderRadius: 4,
						boxShadow: '0 8px 40px rgba(139, 92, 246, 0.2)',
						border: '1px solid rgba(139, 92, 246, 0.2)',
						background: isDark
							? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
							: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
						mt: { xs: 2, md: 3 },
					}}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 3,
						}}>
						<Box
							sx={{
								width: 80,
								height: 80,
								borderRadius: 4,
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
								border: '2px solid rgba(255, 255, 255, 0.5)',
							}}>
							<BookmarkAddRounded sx={{ fontSize: '2.5rem', color: 'white' }} />
						</Box>

						<Typography
							variant='h4'
							align='center'
							sx={{
								fontWeight: 800,
								fontSize: { xs: '1.5rem', sm: '1.75rem' },
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							{t('no_words_yet_title')}
						</Typography>

						<Typography
							variant='body1'
							align='center'
							sx={{
								color: isDark ? '#cbd5e1' : '#718096',
								fontSize: { xs: '1rem', sm: '1.0625rem' },
								lineHeight: 1.7,
								maxWidth: '500px',
							}}>
							{t('no_words_yet_description')}
						</Typography>

						<Box
							sx={{
								width: '100%',
								maxWidth: '400px',
								p: 3,
								borderRadius: 3,
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
								border: '1px solid rgba(139, 92, 246, 0.2)',
								backdropFilter: 'blur(10px)',
							}}>
							<Typography
								sx={{
									fontSize: { xs: '0.875rem', sm: '0.9375rem' },
									color: isDark ? '#cbd5e1' : '#4a5568',
									fontWeight: 600,
									textAlign: 'center',
									lineHeight: 1.6,
								}}>
								💡 {t('no_words_yet_tip')}
							</Typography>
						</Box>
					</Box>
				</Card>
			)}
		</Box>
	)
}

// Mémoïser le composant pour éviter re-renders
export default React.memo(WordsContainer)
