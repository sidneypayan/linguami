import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '../../context/user'
import {
	getUserMaterialWords,
	deleteUserWord,
} from '../../features/words/wordsSlice'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { toggleFlashcardsContainer } from '../../features/cards/cardsSlice'
import {
	Box,
	Button,
	IconButton,
	Card,
	Typography,
	Chip,
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

const WordsContainer = () => {
	const { t, lang } = useTranslation('words')
	const router = useRouter()
	const dispatch = useDispatch()
	const { user, isUserLoggedIn, userLearningLanguage } = useUserContext()
	const { user_material_words, user_material_words_pending } = useSelector(
		store => store.words
	)

	const materialId = router.query.material
	const userId = user?.id

	const handleDelete = id => {
		dispatch(deleteUserWord(id))
	}

	// Filtrer les mots pour n'afficher que ceux traduits dans le contexte actuel
	const filteredWords = useMemo(() => {
		if (!user_material_words || !userLearningLanguage || !lang) return []

		// Ne pas afficher de mots si la langue d'apprentissage est la même que la langue d'interface
		if (userLearningLanguage === lang) return []

		return user_material_words.filter(word => {
			const sourceWord = word[`word_${userLearningLanguage}`]
			const translation = word[`word_${lang}`]

			// N'afficher que les mots qui ont à la fois le mot source ET la traduction
			return sourceWord && translation
		})
	}, [user_material_words, userLearningLanguage, lang])

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
		<Box>
			{isUserLoggedIn && filteredWords && filteredWords.length > 0 ? (
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
									p: 2.5,
									borderRadius: 4,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									gap: 2,
									background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
									border: '1px solid rgba(139, 92, 246, 0.2)',
									boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
									transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
									'&:hover': {
										transform: 'translateY(-4px)',
										boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3)',
										borderColor: 'rgba(139, 92, 246, 0.4)',
										'& .delete-btn': {
											opacity: 1,
										},
									},
								}}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 2,
										flex: 1,
										flexWrap: 'wrap',
									}}>
									<Chip
										label={sourceWord || '—'}
										sx={{
											fontWeight: 700,
											fontSize: { xs: '0.9375rem', sm: '1rem' },
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
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
											fontWeight: 500,
										}}>
										{translation || '—'}
									</Typography>
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
			) : isUserLoggedIn ? (
				<Card
					sx={{
						p: { xs: 3, sm: 4, md: 5 },
						borderRadius: 4,
						boxShadow: '0 8px 40px rgba(139, 92, 246, 0.2)',
						border: '1px solid rgba(139, 92, 246, 0.2)',
						background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
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
								color: '#718096',
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
									color: '#4a5568',
									fontWeight: 600,
									textAlign: 'center',
									lineHeight: 1.6,
								}}>
								💡 {t('no_words_yet_tip')}
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
						background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
						mt: { xs: 2, md: 5 },
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
						{t('createaccount')}
					</Typography>

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: 2.5,
							mt: 4,
							mb: 4,
						}}>
						{[
							{ icon: AutoStoriesRounded, text: t('translatewords') },
							{ icon: BookmarkAddRounded, text: t('savewords') },
							{ icon: FlashOnRounded, text: t('flashcards') },
							{ icon: VolunteerActivismRounded, text: t('supportus') },
						].map((item, index) => (
							<Box
								key={index}
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 2,
									p: 2.5,
									borderRadius: 3,
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
									border: '1px solid rgba(139, 92, 246, 0.15)',
									transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
									'&:hover': {
										transform: 'translateX(8px)',
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
										border: '1px solid rgba(139, 92, 246, 0.3)',
										boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
									},
								}}>
								<Box
									sx={{
										width: 48,
										height: 48,
										borderRadius: 2.5,
										background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
										border: '2px solid rgba(255, 255, 255, 0.3)',
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
							fullWidth
							variant='contained'
							size='large'
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
							{t('noaccount')}
						</Button>
					</Link>
				</Card>
			)}
		</Box>
	)
}

// Mémoïser le composant pour éviter re-renders
export default React.memo(WordsContainer)
