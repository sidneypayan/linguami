import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '../../context/user'
import {
	getUserMaterialWords,
	deleteUserWord,
} from '../../features/words/wordsSlice'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
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
	const { t } = useTranslation('words')
	const router = useRouter()
	const dispatch = useDispatch()
	const { user, isUserLoggedIn } = useUserContext()
	const { user_material_words, user_material_words_pending } = useSelector(
		store => store.words
	)

	const materialId = router.query.material
	const userId = user?.id

	const handleDelete = id => {
		dispatch(deleteUserWord(id))
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
			{isUserLoggedIn && user_material_words && user_material_words.length > 0 ? (
				<Box>
					{/* Bouton de révision */}
					<Button
						fullWidth
						variant='contained'
						size='large'
						startIcon={<FlashOnRounded />}
						onClick={() => dispatch(toggleFlashcardsContainer(true))}
						sx={{
							py: 2,
							borderRadius: 3,
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							fontWeight: 700,
							fontSize: { xs: '1rem', sm: '1.0625rem' },
							textTransform: 'none',
							boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
							transition: 'all 0.3s ease',
							mb: 3,
							'&:hover': {
								background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
								transform: 'translateY(-2px)',
								boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
							},
							'&:active': {
								transform: 'translateY(0)',
							},
						}}>
						{t('repeatwords')}
					</Button>

					{/* Liste des mots */}
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
						{user_material_words.map((words, index) => (
							<Card
								key={index}
								sx={{
									p: 2,
									borderRadius: 3,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									gap: 2,
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
										gap: 2,
										flex: 1,
										flexWrap: 'wrap',
									}}>
									<Chip
										label={words.word_ru}
										sx={{
											fontWeight: 700,
											fontSize: { xs: '0.9375rem', sm: '1rem' },
											background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
											color: '#667eea',
											border: '1px solid rgba(102, 126, 234, 0.2)',
											px: 1,
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
										{words.word_fr}
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
						))}
					</Box>
				</Box>
			) : isUserLoggedIn && user_material_words && user_material_words.length === 0 ? (
				<Card
					sx={{
						p: { xs: 3, sm: 4, md: 5 },
						borderRadius: 4,
						boxShadow: '0 8px 32px rgba(102, 126, 234, 0.12)',
						border: '1px solid rgba(102, 126, 234, 0.1)',
						background: 'white',
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
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
							}}>
							<BookmarkAddRounded sx={{ fontSize: '2.5rem', color: 'white' }} />
						</Box>

						<Typography
							variant='h4'
							align='center'
							sx={{
								fontWeight: 800,
								fontSize: { xs: '1.5rem', sm: '1.75rem' },
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
								background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
								border: '1px solid rgba(102, 126, 234, 0.15)',
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
						boxShadow: '0 8px 32px rgba(102, 126, 234, 0.12)',
						border: '1px solid rgba(102, 126, 234, 0.1)',
						background: 'white',
						mt: { xs: 2, md: 5 },
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
									p: 2,
									borderRadius: 2,
									background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
									border: '1px solid rgba(102, 126, 234, 0.1)',
									transition: 'all 0.3s ease',
									'&:hover': {
										transform: 'translateX(8px)',
										background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
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

					<Link href='/signin' style={{ textDecoration: 'none' }}>
						<Button
							fullWidth
							variant='contained'
							size='large'
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
