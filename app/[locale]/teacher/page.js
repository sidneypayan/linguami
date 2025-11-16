'use client'

import { useTranslations, useLocale } from 'next-intl'
import { FaEnvelope, FaMicrosoft } from 'react-icons/fa'
import { useUserContext } from '@/context/user'
import { getUIImageUrl } from '@/utils/mediaUrls'
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Stack,
	Typography,
	Avatar,
	IconButton,
	useTheme,
} from '@mui/material'
import { FormatQuote, ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useState, useCallback, useEffect } from 'react'

export default function Teacher() {
	const t = useTranslations('teacher')
	const locale = useLocale()
	const { userLearningLanguage } = useUserContext()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	// Déterminer la langue d'apprentissage (fallback sur lang si pas défini)
	const learningLang = userLearningLanguage || (locale === 'ru' ? 'fr' : 'ru')

	// Si l'utilisateur apprend le russe → Natacha, si français → Sidney
	const isLearningRussian = learningLang === 'ru'
	const teacherName = isLearningRussian ? 'Natacha' : 'Sidney'
	const img = isLearningRussian
		? getUIImageUrl('elf_female.webp')
		: getUIImageUrl('elf_male.webp')

	// Embla Carousel setup
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: false,
			align: 'start',
			skipSnaps: false,
		},
		[Autoplay({ delay: 5000, stopOnInteraction: false })]
	)

	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(true)
	const [selectedIndex, setSelectedIndex] = useState(0)

	const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
	const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
	const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

	const onSelect = useCallback(() => {
		if (!emblaApi) return
		setCanScrollPrev(emblaApi.canScrollPrev())
		setCanScrollNext(emblaApi.canScrollNext())
		setSelectedIndex(emblaApi.selectedScrollSnap())
	}, [emblaApi])

	useEffect(() => {
		if (!emblaApi) return
		onSelect()
		emblaApi.on('select', onSelect)
		emblaApi.on('reInit', onSelect)
	}, [emblaApi, onSelect])

	const reviews = [
		{
			name: 'David',
			text: "Natacha se donne beaucoup de mal pour préparer le cours suivant en fonction du besoin du moment. Les moyens pour apprendre sont sur mesure. Super ambiance. J'attends chaque cours avec impatience",
			color: '#8b5cf6',
		},
		{
			name: 'Carole',
			text: "Je suis très satisfaite du cours. Natalia est attentive aux différents besoins des élèves, gentille et agréable. L'apprentissage est rapide et facile grâce à sa pedagogie. Autres points forts, la flexibilité pour les horaires et le bon matériel didactique (livres, audios) mis à disposition",
			color: '#06b6d4',
		},
		{
			name: 'Daniel',
			text: "Depuis 1 an j'apprends le Russe avec Natacha et je suis très satisfait de ma professeure, je progresse facilement et j'ai pu commencer quelques dialogues lors de 2 voyages à Saint Petersbourg. Sa méthode d'apprentissage est facile et complète",
			color: '#8b5cf6',
		},
	]

	return (
		<>
			{/* Hero Section */}
			<Box
				sx={{
					background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
					pt: { xs: 12, sm: 14, md: 16 },
					pb: { xs: 10, sm: 12, md: 14 },
					position: 'relative',
					overflow: 'hidden',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)',
						pointerEvents: 'none',
					},
				}}>
				<Container
					maxWidth='md'
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						position: 'relative',
						zIndex: 1,
					}}>
					{/* Photo avec effet */}
					<Box
						sx={{
							position: 'relative',
							mb: 4,
						}}>
						<Box
							sx={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								width: { xs: 240, sm: 280 },
								height: { xs: 240, sm: 280 },
								borderRadius: '50%',
								background: 'rgba(255, 255, 255, 0.2)',
								animation: 'pulse 3s ease-in-out infinite',
								'@keyframes pulse': {
									'0%, 100%': {
										transform: 'translate(-50%, -50%) scale(1)',
										opacity: 0.5,
									},
									'50%': {
										transform: 'translate(-50%, -50%) scale(1.1)',
										opacity: 0.3,
									},
								},
							}}
						/>
						<Avatar
							src={img}
							alt='teacher'
							sx={{
								width: { xs: 200, sm: 240 },
								height: { xs: 200, sm: 240 },
								border: '8px solid rgba(255, 255, 255, 0.95)',
								boxShadow: '0 16px 60px rgba(139, 92, 246, 0.4), 0 0 40px rgba(6, 182, 212, 0.3)',
								position: 'relative',
								zIndex: 1,
							}}
						/>
					</Box>

					{/* Titre principal */}
					<Typography
						variant='h3'
						align='center'
						sx={{
							color: 'white',
							fontWeight: 800,
							fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
							mb: 2,
							textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
							px: 2,
						}}>
						{t(isLearningRussian ? 'titleRussian' : 'titleFrench')}
					</Typography>

					{/* Sous-titre */}
						<Typography
							variant='h6'
							align='center'
							sx={{
								color: 'rgba(255, 255, 255, 0.95)',
								fontWeight: 500,
								fontSize: { xs: '1rem', sm: '1.25rem' },
								mb: 4,
								px: 2,
								lineHeight: 1.6,
							}}>
							{t(isLearningRussian ? 'subtitleRussian' : 'subtitleFrench')}
						</Typography>

					{/* Label contact */}
					<Typography
						variant='body1'
						sx={{
							color: 'rgba(255, 255, 255, 0.9)',
							fontWeight: 600,
							mb: 3,
							fontSize: { xs: '1rem', sm: '1.125rem' },
						}}>
						{t(isLearningRussian ? 'contactRussian' : 'contactFrench')}
					</Typography>

					{/* Boutons de contact */}
					<Stack
						direction={{ xs: 'column', sm: 'row' }}
						gap={2}
						sx={{
							width: { xs: '100%', sm: 'auto' },
							px: { xs: 2, sm: 0 },
						}}>
						<Button
							href={t(isLearningRussian ? 'teamsRussian' : 'teamsFrench')}
							variant='contained'
							startIcon={<FaMicrosoft />}
							sx={{
								background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
								color: '#8b5cf6',
								border: '2px solid rgba(139, 92, 246, 0.3)',
								fontWeight: 700,
								fontSize: { xs: '1rem', sm: '1.125rem' },
								padding: { xs: '14px 36px', sm: '16px 44px' },
								borderRadius: 3,
								textTransform: 'none',
								boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
								transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
								'&:hover': {
									background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.98) 100%)',
									transform: 'translateY(-4px)',
									boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
									borderColor: 'rgba(139, 92, 246, 0.5)',
								},
								'&:active': {
									transform: 'translateY(-2px)',
								},
							}}>
							Teams
						</Button>
						<Button
							href={t(isLearningRussian ? 'mailRussian' : 'mailFrench')}
							variant='outlined'
							startIcon={<FaEnvelope />}
							sx={{
								borderColor: 'rgba(255, 255, 255, 0.8)',
								backgroundColor: 'rgba(255, 255, 255, 0.15)',
								backdropFilter: 'blur(10px)',
								color: 'white',
								border: '2px solid rgba(255, 255, 255, 0.8)',
								fontWeight: 700,
								fontSize: { xs: '1rem', sm: '1.125rem' },
								padding: { xs: '14px 36px', sm: '16px 44px' },
								borderRadius: 3,
								textTransform: 'none',
								transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.25)',
									borderColor: 'white',
									borderWidth: '2px',
									transform: 'translateY(-4px)',
									boxShadow: '0 8px 32px rgba(255, 255, 255, 0.3)',
								},
								'&:active': {
									transform: 'translateY(-2px)',
								},
							}}>
							Mail
						</Button>
					</Stack>
				</Container>

				{/* Modern diagonal separator */}
				<Box
					sx={{
						position: 'absolute',
						bottom: -1,
						left: 0,
						right: 0,
						height: { xs: '41px', md: '81px' },
						bgcolor: 'background.default',
						clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)',
					}}
				/>
			</Box>

			{/* Section de présentation */}
			<Container
				maxWidth='md'
				sx={{
					py: { xs: 6, sm: 8, md: 10 },
					px: { xs: 2, sm: 3 },
				}}>
				<Typography
					variant='body1'
					sx={{
						fontSize: { xs: '1.0625rem', sm: '1.125rem' },
						lineHeight: 1.8,
						color: isDark ? '#cbd5e1' : '#4a5568',
						textAlign: 'center',
						mb: 6,
					}}>
					{t(isLearningRussian ? 'textRussian' : 'textFrench')}
				</Typography>

				{/* Section des avis */}
				{isLearningRussian && (
					<Box sx={{ mt: { xs: 6, md: 8 } }}>
						<Typography
							variant='h4'
							align='center'
							sx={{
								fontWeight: 700,
								fontSize: { xs: '1.75rem', md: '2rem' },
								mb: 1,
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							{t('reviewsTitle')}
						</Typography>
						<Typography
							variant='subtitle1'
							align='center'
							sx={{
								color: isDark ? '#94a3b8' : '#718096',
								mb: 5,
							}}>
							{t('reviewsSubtitle')}
						</Typography>

						<Box sx={{ py: { xs: 3, md: 4 }, mt: 2 }}>
							<Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'stretch',
										gap: { xs: 2, sm: 3, md: 4 },
										px: { xs: 0, md: 2 },
										pt: 3,
										'& > *': {
											flex: '0 0 100%',
											minWidth: 0,
											'@media (min-width: 768px)': {
												flex: '0 0 calc(50% - 12px)',
											},
											'@media (min-width: 1024px)': {
												flex: '0 0 calc(33.333% - 21.333px)',
											},
										},
									}}>
									{reviews.map((review, index) => (
										<Box key={review.name}>
											<Card
												sx={{
													width: '100%',
													height: { xs: '380px', sm: '420px', md: '460px' },
													position: 'relative',
													borderRadius: 4,
													overflow: 'visible',
													display: 'flex',
													flexDirection: 'column',
													background: isDark
														? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
														: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
													boxShadow: isDark
														? '0 4px 20px rgba(139, 92, 246, 0.25)'
														: '0 4px 20px rgba(139, 92, 246, 0.15)',
													border: isDark
														? '1px solid rgba(139, 92, 246, 0.3)'
														: '1px solid rgba(139, 92, 246, 0.2)',
													transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
													'&:hover': {
														transform: 'translateY(-8px)',
														boxShadow: isDark
															? '0 12px 40px rgba(139, 92, 246, 0.4)'
															: '0 12px 40px rgba(139, 92, 246, 0.3)',
														borderColor: 'rgba(139, 92, 246, 0.4)',
													},
												}}>
												<Box
													sx={{
														position: 'absolute',
														top: -20,
														left: 24,
														width: 48,
														height: 48,
														borderRadius: '50%',
														background: `linear-gradient(135deg, ${review.color} 0%, ${review.color === '#8b5cf6' ? '#06b6d4' : '#8b5cf6'} 100%)`,
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														boxShadow: `0 4px 12px ${review.color}40`,
														border: '2px solid rgba(255, 255, 255, 0.3)',
													}}>
													<FormatQuote sx={{ color: 'white', fontSize: 28 }} />
												</Box>
												<CardContent sx={{ pt: 5, pb: 4, px: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
													<Typography
														variant='h5'
														align='center'
														sx={{
															fontWeight: 700,
															mb: 2,
															color: isDark ? '#f1f5f9' : '#2d3748',
															fontSize: { xs: '1.25rem', sm: '1.5rem' },
														}}>
														{review.name}
													</Typography>
													<Typography
														variant='body1'
														sx={{
															color: isDark ? '#cbd5e1' : '#718096',
															lineHeight: 1.7,
															fontSize: { xs: '0.9375rem', sm: '1rem' },
															textAlign: 'center',
														}}>
														{review.text}
													</Typography>
												</CardContent>
											</Card>
										</Box>
									))}
								</Box>
							</Box>

							{/* Indicateurs de pagination (dots) */}
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									gap: 1,
									mt: 4,
									mb: 2,
								}}>
								{reviews.map((_, index) => (
									<Box
										key={index}
										onClick={() => scrollTo(index)}
										sx={{
											width: selectedIndex === index ? '24px' : '10px',
											height: '10px',
											borderRadius: selectedIndex === index ? '5px' : '50%',
											background: selectedIndex === index
												? 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'
												: 'rgba(139, 92, 246, 0.3)',
											boxShadow: selectedIndex === index ? '0 2px 8px rgba(139, 92, 246, 0.4)' : 'none',
											cursor: 'pointer',
											transition: 'all 0.3s ease',
											'&:hover': {
												background: selectedIndex === index
													? 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'
													: 'rgba(139, 92, 246, 0.5)',
											},
										}}
									/>
								))}
							</Box>

							{/* Boutons de navigation */}
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									gap: 2,
									mt: 1,
								}}>
								<IconButton
									onClick={scrollPrev}
									disabled={!canScrollPrev}
									sx={{
										width: 48,
										height: 48,
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
										border: '2px solid rgba(139, 92, 246, 0.3)',
										transition: 'all 0.3s ease',
										'&:hover': {
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)',
											transform: 'scale(1.1)',
											boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
										},
										'&.Mui-disabled': {
											opacity: 0.3,
										},
									}}>
									<ArrowBackIosNew sx={{ color: '#8b5cf6', fontSize: '1.2rem' }} />
								</IconButton>
								<IconButton
									onClick={scrollNext}
									disabled={!canScrollNext}
									sx={{
										width: 48,
										height: 48,
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
										border: '2px solid rgba(139, 92, 246, 0.3)',
										transition: 'all 0.3s ease',
										'&:hover': {
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)',
											transform: 'scale(1.1)',
											boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
										},
										'&.Mui-disabled': {
											opacity: 0.3,
										},
									}}>
									<ArrowForwardIos sx={{ color: '#8b5cf6', fontSize: '1.2rem' }} />
								</IconButton>
							</Box>
						</Box>
					</Box>
				)}
			</Container>
		</>
	)
}
