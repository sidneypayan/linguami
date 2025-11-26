'use client'

import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState, use, useMemo, useRef } from 'react'
import { useRouterCompat } from '@/hooks/shared/useRouterCompat'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	addBeingStudiedMaterial,
	removeBeingStudiedMaterial,
	addMaterialToStudied,
	saveReadingProgress,
} from '@/app/actions/materials'
import { useTranslation } from '@/context/translation'
import ChapterBreadcrumb from '@/components/material/ChapterBreadcrumb'
import ChapterNavigation from '@/components/material/ChapterNavigation'
import Translation from '@/components/material/Translation'
import Words from '@/components/material/Words'
import WordsContainer from '@/components/material/WordsContainer'
import VideoPlayer from '@/components/material/VideoPlayer'
import EditMaterialModal from '@/components/admin/EditMaterialModal'
import ExerciseSection from '@/components/exercises/ExerciseSection'
import ReportButton from '@/components/material/ReportButton'
import { useUserContext } from '@/context/user'
import { sections } from '@/data/sections'

import Player from '@/components/shared/Player'
import CelebrationOverlay, { triggerCelebration } from '@/components/shared/CelebrationOverlay'
import ContentPagination from '@/components/material/ContentPagination'
import { usePaginatedContent } from '@/hooks/materials/usePaginatedContent'
import { getAudioUrl, getMaterialImageUrl } from '@/utils/mediaUrls'
import {
	Box,
	Button,
	Container,
	IconButton,
	Stack,
	Typography,
	Paper,
	useTheme,
} from '@mui/material'
import {
	ArrowBack,
	MenuBook,
	Close,
	PlayArrowRounded,
	PauseRounded,
	VisibilityRounded,
	CheckCircleRounded,
	EditRounded,
} from '@mui/icons-material'

import {
	primaryButton,
	warningButton,
	tertiaryButton,
	successButton,
} from '@/utils/buttonStyles'

const Material = ({
	params: paramsPromise,
	initialMaterial,
	initialUserMaterialStatus,
	initialUserMaterialsStatus = [],
	book = null,
	previousChapter = null,
	nextChapter = null,
}) => {
	const params = use(paramsPromise)
	const t = useTranslations('materials')
	const locale = useLocale()
	const { closeTranslation, cleanTranslation } = useTranslation()
	const router = useRouterCompat()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { user, isUserAdmin, userLearningLanguage, isUserLoggedIn } = useUserContext()
	const queryClient = useQueryClient()

	// Local UI state
	const [showAccents, setShowAccents] = useState(false)
	const [showWordsContainer, setShowWordsContainer] = useState(false)
	const [editModalOpen, setEditModalOpen] = useState(false)

	// Check if this is a book chapter (for breadcrumb and chapter navigation)
	const isBookChapter = initialMaterial?.book_id != null

	// Helper function to decode base64 UTF-8
	const decodeBase64UTF8 = (base64String) => {
		if (!base64String) return null
		const binaryString = atob(base64String)
		const bytes = new Uint8Array(binaryString.length)
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i)
		}
		return new TextDecoder('utf-8').decode(bytes)
	}

	// Decode base64-encoded text fields if they were encoded server-side
	const decodedMaterial = initialMaterial && initialMaterial._encoded ? {
		...initialMaterial,
		content: decodeBase64UTF8(initialMaterial.content),
		content_accented: decodeBase64UTF8(initialMaterial.content_accented),
	} : initialMaterial

	// React Query: Hydrate material data with SSR data
	const { data: currentMaterial } = useQuery({
		queryKey: ['material', params?.material],
		queryFn: () => decodedMaterial,
		initialData: decodedMaterial,
		staleTime: Infinity,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		enabled: false, // Never refetch, only use initial data
	})

	// React Query: Hydrate user material status
	const { data: userMaterialStatus } = useQuery({
		queryKey: ['userMaterialStatus', params?.material],
		queryFn: () => initialUserMaterialStatus,
		initialData: initialUserMaterialStatus,
		staleTime: Infinity,
	})

	const { is_being_studied, is_studied, reading_page } = userMaterialStatus || { is_being_studied: false, is_studied: false, reading_page: 1 }

	// Pagination (5 paragraphs per page)
	const contentForPagination = showAccents
		? currentMaterial?.content_accented
		: currentMaterial?.content

	// Use saved reading page directly from server props (not from React Query state)
	// This ensures the value is available at first render before hydration
	const savedPage = initialUserMaterialStatus?.reading_page || 1

	const {
		paginatedContent,
		currentPage,
		totalPages,
		isPaginated,
		nextPage,
		prevPage,
		goToFirst,
		goToLast,
		hasNextPage,
		hasPrevPage,
	} = usePaginatedContent(
		contentForPagination,
		2000, // ~2000 characters per page
		savedPage // Start at saved page
	)

	// Auto-save reading progress when page changes (for logged-in users)
	useEffect(() => {
		if (!isPaginated || !isUserLoggedIn || !currentMaterial?.id) return
		// Don't save on initial load (when currentPage equals savedPage)
		if (currentPage === savedPage) return

		// Debounce the save to avoid too many requests
		const timeoutId = setTimeout(() => {
			saveReadingProgress(currentMaterial.id, currentPage)
		}, 500)

		return () => clearTimeout(timeoutId)
	}, [currentPage, isPaginated, isUserLoggedIn, currentMaterial?.id, savedPage])

	// Determine the finish button text based on context
	// - Regular material: "J'ai terminé ce matériel"
	// - Book chapter (not last): "J'ai terminé cette page"
	// - Last page of last chapter: "J'ai terminé ce livre"
	const getFinishButtonText = () => {
		if (!isBookChapter) {
			return t('finish_material')
		}
		// For book chapters: show "finish book" only on last page of last chapter
		const isLastPageOfContent = !isPaginated || !hasNextPage
		if (!nextChapter && isLastPageOfContent) {
			return t('finish_book')
		}
		return t('finish_page')
	}

	// Mutation: Add material to studying
	const addToStudyingMutation = useMutation({
		mutationFn: addBeingStudiedMaterial,
		onSuccess: () => {
			// Update local cache
			queryClient.setQueryData(['userMaterialStatus', params?.material], {
				is_being_studied: true,
				is_studied: false,
			})
			// Invalidate user materials list so my-materials page updates
			queryClient.invalidateQueries({ queryKey: ['userMaterials'] })
			// XP is now added server-side in addBeingStudiedMaterial action
		},
	})

	// Mutation: Remove material from studying
	const removeFromStudyingMutation = useMutation({
		mutationFn: removeBeingStudiedMaterial,
		onSuccess: () => {
			// Update local cache
			queryClient.setQueryData(['userMaterialStatus', params?.material], {
				is_being_studied: false,
				is_studied: false,
			})
			// Invalidate user materials list so my-materials page updates
			queryClient.invalidateQueries({ queryKey: ['userMaterials'] })
		},
	})

	// Mutation: Mark material as studied
	const markAsStudiedMutation = useMutation({
		mutationFn: addMaterialToStudied,
		onSuccess: () => {
			// Update local cache
			queryClient.setQueryData(['userMaterialStatus', params?.material], {
				is_being_studied: false,
				is_studied: true,
			})
			// Invalidate user materials list so my-materials page updates
			queryClient.invalidateQueries({ queryKey: ['userMaterials'] })
			// XP is now added server-side in addMaterialToStudied action

			// Trigger celebration via custom event (avoids re-render issues)
			let celebrationType = 'material'
			if (isBookChapter) {
				celebrationType = !nextChapter ? 'book' : 'page'
			}
			triggerCelebration({ type: celebrationType, xpGained: 25, goldGained: 5 })
		},
	})

	const handleEditContent = () => {
		setEditModalOpen(true)
	}

	const handleEditSuccess = () => {
		// Invalidate and refetch material data
		queryClient.invalidateQueries(['material', params?.material])
	}

		const getImageRegardingSection = section => {
		if (section === 'place') {
			return (
				<Container
					maxWidth='sm'
					sx={{ margin: '0 auto', marginBottom: '5rem' }}>
					<Box
						sx={{
							position: 'relative',
							width: '100%',
							maxWidth: 600,
							height: 230,
							borderRadius: '3px',
							overflow: 'hidden',
						}}>
						<Image
							src={getMaterialImageUrl(currentMaterial)}
							alt={currentMaterial.title}
							fill
							sizes='(max-width: 600px) 100vw, 600px'
							style={{ objectFit: 'cover', borderRadius: '3px' }}
							quality={85}
							priority={false}
						/>
					</Box>
				</Container>
			)
		}
	}

	const displayAudioPlayer = (section) => {
		if (sections?.audio?.includes(section)) {
			return <Player src={getAudioUrl(currentMaterial)} />
		}
	}

	const displayVideo = section => {
		if (sections?.music?.includes(section) || sections?.video?.includes(section)) {
			return (
				<Box
					sx={{
						position: 'sticky',
						top: { xs: 0, sm: '6rem', md: '6.5rem' },
						zIndex: 1000,
						marginTop: { xs: '1rem', sm: 0 },
						marginBottom: '0.5rem',
					}}>
					<VideoPlayer videoUrl={currentMaterial.video_url} />
				</Box>
			)
		}
	}
	// Vérifier si une vidéo est affichée pour ajuster la position du bouton
	const isVideoDisplayed =
		sections?.music?.includes(params?.section) || sections?.video?.includes(params?.section)

	if (!currentMaterial) {
		return (
			<Container maxWidth="lg" sx={{ pt: '8rem', textAlign: 'center' }}>
				<Typography>Loading...</Typography>
			</Container>
		)
	}

	return (
		<>
			{/* Chapter Breadcrumb Navigation (for book chapters) */}
			{currentMaterial.book_id && book ? (
				<ChapterBreadcrumb
					book={book}
					currentChapter={currentMaterial}
					userMaterialsStatus={initialUserMaterialsStatus}
				/>
			) : (
				/* Compact Header (for regular materials) */
				<Box
					sx={{
						pt: { xs: '30px', md: '6rem' },
						pb: { xs: '20px', md: 2.5 },
						borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
						bgcolor: 'background.paper',
					}}>
					<Container maxWidth='lg'>
						<Box
							sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
							<IconButton
								sx={{
									background:
										'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
									border: '1px solid rgba(139, 92, 246, 0.3)',
									color: '#8b5cf6',
									transition: 'all 0.3s ease',
									'&:hover': {
										background:
											'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
										transform: 'scale(1.05)',
									},
								}}
								aria-label='back'
								onClick={() => typeof window !== 'undefined' && window.history.back()}>
								<ArrowBack fontSize='medium' />
							</IconButton>
							<Typography
								variant='h4'
								sx={{
									fontWeight: 700,
									fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
									background:
										'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									flex: 1,
								}}>
								{currentMaterial.title}
							</Typography>
						</Box>
					</Container>
				</Box>
			)}

			<Stack
				sx={{
					flexDirection: {
						xs: 'column',
						lg: 'row',
					},
					justifyContent: 'center',
					alignItems: 'flex-start',
					gap: { lg: 4 },
					px: { lg: 3 },
					maxWidth: '1600px',
					mx: 'auto',
					width: '100%',
				}}>
				<Box
					sx={{
						py: { xs: 0, lg: 6 },
						px: { xs: 1, lg: 3 },
						flex: 1,
						minWidth: 0,
						maxWidth: '100%',
					}}>
					{getImageRegardingSection(params?.section)}
					{displayVideo(params?.section)}

					<Box
						sx={{
							marginTop: { xs: '0rem', sm: '1.5rem' },
							px: { xs: 0, sm: 1 },
						}}>
						<Translation
							materialId={currentMaterial.id}
							userId={user && user.id}
						/>

						{/* Action buttons */}
						<Box
							sx={{
								position: 'relative',
								zIndex: 100,
								display: 'flex',
								flexWrap: 'wrap',
								alignItems: 'center',
								gap: 2,
								marginBottom: '3rem',
								marginTop: '2rem',
							}}>
							{/* Si le matériel est à l'étude ou a déjà été étudié, ne pas
							afficher le bouton proposant de l'ajouter aux matériels en cours
							d'étude */}
							{!is_being_studied && !is_studied && isUserLoggedIn && (
								<Button
									variant='contained'
									startIcon={<PlayArrowRounded />}
									onClick={() => addToStudyingMutation.mutate(currentMaterial.id)}
									sx={{
										background:
											'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
										color: 'white',
										fontWeight: 600,
										fontSize: { xs: '0.9rem', sm: '1rem' },
										padding: { xs: '0.75rem 1.5rem', sm: '0.875rem 2rem' },
										borderRadius: 3,
										textTransform: 'none',
										transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
										border: '1px solid rgba(139, 92, 246, 0.3)',
										boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
										'&:hover': {
											background:
												'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
											transform: 'translateY(-3px)',
											boxShadow: '0 8px 30px rgba(139, 92, 246, 0.5)',
											borderColor: 'rgba(139, 92, 246, 0.5)',
										},
										'&:active': {
											transform: 'scale(0.98)',
										},
									}}>
									<Box
										component='span'
										sx={{ display: { xs: 'none', sm: 'inline' } }}>
										{t('startstudying')}
									</Box>
									<Box
										component='span'
										sx={{ display: { xs: 'inline', sm: 'none' } }}>
										{locale === 'fr'
											? 'Commencer à étudier'
											: 'Начать изучение'}
									</Box>
								</Button>
							)}

							{is_being_studied && isUserLoggedIn && (
								<Button
									variant='contained'
									startIcon={<PauseRounded />}
									onClick={() => removeFromStudyingMutation.mutate(currentMaterial.id)}
									sx={{
										background:
											'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
										color: 'white',
										fontWeight: 600,
										fontSize: { xs: '0.9rem', sm: '1rem' },
										padding: { xs: '0.75rem 1.5rem', sm: '0.875rem 2rem' },
										borderRadius: 3,
										textTransform: 'none',
										transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
										border: '1px solid rgba(245, 158, 11, 0.3)',
										boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
										'&:hover': {
											background:
												'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
											transform: 'translateY(-3px)',
											boxShadow: '0 8px 30px rgba(245, 158, 11, 0.5)',
											borderColor: 'rgba(245, 158, 11, 0.5)',
										},
										'&:active': {
											transform: 'scale(0.98)',
										},
									}}>
									<Box
										component='span'
										sx={{ display: { xs: 'none', sm: 'inline' } }}>
										{t('stopstudying')}
									</Box>
									<Box
										component='span'
										sx={{ display: { xs: 'inline', sm: 'none' } }}>
										{locale === 'fr'
											? 'Ne plus étudier'
											: 'Отказаться от изучения'}
									</Box>
								</Button>
							)}

							{/* Bouton pour afficher/masquer les accents toniques (russe uniquement) */}
							{currentMaterial.content_accented && (
								<Button
									variant='outlined'
									startIcon={<VisibilityRounded />}
									onClick={() => setShowAccents(!showAccents)}
									sx={{
										borderColor: showAccents ? '#10b981' : '#8b5cf6',
										color: showAccents ? '#10b981' : '#8b5cf6',
										fontWeight: 600,
										fontSize: { xs: '0.9rem', sm: '1rem' },
										padding: { xs: '0.75rem 1.5rem', sm: '0.875rem 2rem' },
										borderRadius: 3,
										textTransform: 'none',
										transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
										borderWidth: '2px',
										'&:hover': {
											borderColor: showAccents ? '#10b981' : '#8b5cf6',
											borderWidth: '2px',
											background: showAccents
												? 'rgba(16, 185, 129, 0.1)'
												: 'rgba(139, 92, 246, 0.1)',
											transform: 'translateY(-3px)',
											boxShadow: showAccents
												? '0 4px 20px rgba(16, 185, 129, 0.3)'
												: '0 4px 20px rgba(139, 92, 246, 0.3)',
										},
										'&:active': {
											transform: 'scale(0.98)',
										},
									}}>
									<Box
										component='span'
										sx={{ display: { xs: 'none', sm: 'inline' } }}>
										{showAccents ? t('hideaccents') : t('showaccents')}
									</Box>
									<Box
										component='span'
										sx={{ display: { xs: 'inline', sm: 'none' } }}>
										{showAccents
											? (locale === 'fr' ? 'Masquer' : locale === 'ru' ? 'Скрыть' : 'Hide')
											: (locale === 'fr' ? 'Montrer' : locale === 'ru' ? 'Показать' : 'Show')}
									</Box>
								</Button>
							)}

							{/* Si l'user est admin, afficher le bouton permettant de modifier le matériel */}
							{isUserAdmin && (
								<Button
									variant='outlined'
									onClick={handleEditContent}
									startIcon={
										<EditRounded
											sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
										/>
									}
									sx={{
										borderColor: '#8b5cf6',
										color: '#8b5cf6',
										fontWeight: 600,
										fontSize: { xs: '0.9rem', sm: '1rem' },
										padding: { xs: '0.75rem', sm: '0.875rem 2rem' },
										borderRadius: 3,
										textTransform: 'none',
										transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
										borderWidth: '2px',
										minWidth: { xs: 'auto', sm: 'auto' },
										'&:hover': {
											borderColor: '#8b5cf6',
											borderWidth: '2px',
											background: 'rgba(139, 92, 246, 0.1)',
											transform: 'translateY(-3px)',
											boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
										},
										'&:active': {
											transform: 'scale(0.98)',
										},
									}}>
									<Box
										component='span'
										sx={{ display: { xs: 'none', sm: 'inline' } }}>
										Edit material
									</Box>
									<EditRounded
										sx={{
											display: { xs: 'block', sm: 'none' },
											fontSize: '1.5rem',
										}}
									/>
								</Button>
							)}

						</Box>


						{/* Afficher le texte avec ou sans accents en fonction de l'état de showAccents */}
						<Paper
							elevation={0}
							sx={{
								position: 'relative',
								zIndex: 100,
								padding: { xs: 1.5, lg: 5 },
								marginBottom: '3rem',
								background: 'transparent',
								borderRadius: { xs: 0, lg: 4 },
								border: {
									xs: 'none',
									lg: '1px solid rgba(139, 92, 246, 0.2)',
								},
								boxShadow: {
									xs: 'none',
									lg: '0 4px 20px rgba(139, 92, 246, 0.15)',
								},
							}}>
							{/* Pagination controls - Top (when content is paginated) */}
							{isPaginated && (
								<Box sx={{ mb: 3 }}>
									<ContentPagination
										currentPage={currentPage}
										totalPages={totalPages}
										onPrevPage={prevPage}
										onNextPage={nextPage}
										onGoToFirst={goToFirst}
										onGoToLast={goToLast}
										hasPrevPage={hasPrevPage}
										hasNextPage={hasNextPage}
									/>
								</Box>
							)}

							{/* Content - use paginated content when pagination is active */}
							<Typography
								sx={{
									fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.2rem' },
									lineHeight: 1.8,
									color: isDark ? '#f1f5f9' : '#1a202c',
									cursor: 'pointer',
									fontWeight: 400,
									'& span': {
										transition: 'background-color 0.2s ease',
									},
									'& p': {
										marginBottom: '1.5rem',
									},
								}}
								variant='body1'
							>
								<Words
									content={
										isPaginated
											? paginatedContent
											: (showAccents ? currentMaterial.content_accented : currentMaterial.content)
									}
									materialId={currentMaterial.id}
									locale={locale}
								/>
							</Typography>

							{/* Pagination controls - Bottom (when content is paginated) */}
							{isPaginated && (
								<Box sx={{ mt: 3 }}>
									<ContentPagination
										currentPage={currentPage}
										totalPages={totalPages}
										onPrevPage={prevPage}
										onNextPage={nextPage}
										onGoToFirst={goToFirst}
										onGoToLast={goToLast}
										hasPrevPage={hasPrevPage}
										hasNextPage={hasNextPage}
									/>
								</Box>
							)}
						</Paper>

						{/* Exercise Section - Visible uniquement pour les admins */}
						{isUserAdmin && <ExerciseSection materialId={currentMaterial.id} />}

						{/* Bouton pour terminer OU badge "Matériel terminé" */}
						{isUserLoggedIn && (
							<Box
								sx={{
									position: 'relative',
									zIndex: 100,
									display: 'flex',
									justifyContent: 'center',
									marginTop: '4rem',
									marginBottom: '3rem',
								}}>
								{!is_studied ? (
									<Button
										variant='contained'
										size='large'
										startIcon={<CheckCircleRounded />}
										onClick={() => markAsStudiedMutation.mutate(currentMaterial.id)}
										sx={{
											background:
												'linear-gradient(135deg, #10b981 0%, #059669 100%)',
											color: 'white',
											fontWeight: 600,
											fontSize: { xs: '1rem', sm: '1.15rem' },
											padding: { xs: '1.125rem 2.5rem', sm: '1.375rem 4rem' },
											borderRadius: 3,
											textTransform: 'none',
											transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
											border: '1px solid rgba(16, 185, 129, 0.3)',
											boxShadow: '0 6px 30px rgba(16, 185, 129, 0.4)',
											'&:hover': {
												background:
													'linear-gradient(135deg, #059669 0%, #047857 100%)',
												transform: 'translateY(-4px)',
												boxShadow: '0 10px 40px rgba(16, 185, 129, 0.5)',
												borderColor: 'rgba(16, 185, 129, 0.5)',
											},
											'&:active': {
												transform: 'scale(0.98)',
											},
										}}>
										{getFinishButtonText()}
									</Button>
								) : (
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 1,
											background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
											color: 'white',
											fontWeight: 600,
											fontSize: { xs: '1rem', sm: '1.15rem' },
											padding: { xs: '1.125rem 2.5rem', sm: '1.375rem 4rem' },
											borderRadius: 3,
											boxShadow: '0 6px 30px rgba(16, 185, 129, 0.4)',
										}}>
										<CheckCircleRounded sx={{ fontSize: '1.5rem' }} />
										{t('material_completed')}
									</Box>
								)}
							</Box>
						)}

						<Box
							sx={{
								position: 'sticky',
								bottom: { xs: '5.5rem', md: '1.5rem' },
								zIndex: 500,
								marginTop: '3rem',
								marginBottom: '3rem',
							}}>
							{displayAudioPlayer(params?.section)}
						</Box>

						{/* Chapter Navigation (Previous/Next buttons) - Only for book chapters */}
						{currentMaterial.book_id && (
							<ChapterNavigation
								previousChapter={previousChapter}
								nextChapter={nextChapter}
								userMaterialsStatus={initialUserMaterialsStatus}
							/>
						)}
					</Box>
				</Box>

				{/* Floating button for mobile and tablet */}
				<IconButton
					sx={{
						display: { xs: 'flex', lg: 'none' },
						position: 'fixed',
						right: '1rem',
						bottom: isVideoDisplayed ? '6rem' : '12.5rem',
						background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
						backdropFilter: 'blur(10px)',
						border: '1px solid rgba(139, 92, 246, 0.3)',
						color: 'white',
						width: '56px',
						height: '56px',
						boxShadow: '0 4px 20px rgba(139, 92, 246, 0.5)',
						zIndex: 1000,
						transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
						'&:hover': {
							background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
							transform: 'scale(1.15)',
							boxShadow: '0 8px 30px rgba(139, 92, 246, 0.7)',
							borderColor: 'rgba(139, 92, 246, 0.5)',
						},
					}}
					onClick={() => setShowWordsContainer(true)}>
					<MenuBook />
				</IconButton>

				{/* Desktop WordsContainer */}
				<WordsContainer
					sx={{
						display: { xs: 'none', lg: 'block' },
						width: {
							lg: '500px',
							xl: '550px',
						},
						flexShrink: 0,
						background: isDark
							? 'background.default'
							: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
						position: 'sticky',
						top: { lg: 120 },
						alignSelf: 'flex-start',
						maxHeight: 'calc(100vh - 130px)',
						overflowY: 'auto',
						pt: { lg: 6 },
						px: 3,
						'&::-webkit-scrollbar': {
							width: '12px',
						},
						'&::-webkit-scrollbar-track': {
							background:
								'linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
							borderRadius: '6px',
						},
						'&::-webkit-scrollbar-thumb': {
							background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
							borderRadius: '6px',
							border: '2px solid rgba(255, 255, 255, 0.3)',
							boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
							'&:hover': {
								background:
									'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
								borderColor: 'rgba(255, 255, 255, 0.5)',
								boxShadow: '0 4px 12px rgba(139, 92, 246, 0.5)',
							},
						},
					}}
				/>

				{/* Mobile and tablet fullscreen WordsContainer */}
				{showWordsContainer && (
					<Box
						sx={{
							display: { xs: 'flex', lg: 'none' },
							position: 'fixed',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: isDark ? '#0f172a' : 'white',
							zIndex: 1100,
							flexDirection: 'column',
							overflowY: 'auto',
							paddingTop: { xs: '6rem', sm: '6.5rem' },
							paddingX: '1rem',
						}}>
						<IconButton
							sx={{
								position: 'fixed',
								bottom: isVideoDisplayed ? '6rem' : '12.5rem',
								right: '1rem',
								background:
									'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(240, 147, 251, 0.3)',
								color: 'white',
								width: '56px',
								height: '56px',
								boxShadow: '0 4px 20px rgba(245, 87, 108, 0.5)',
								zIndex: 1200,
								transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
								'&:hover': {
									background:
										'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
									transform: 'scale(1.15) rotate(90deg)',
									boxShadow: '0 8px 30px rgba(245, 87, 108, 0.7)',
									borderColor: 'rgba(245, 87, 108, 0.5)',
								},
							}}
							onClick={() => setShowWordsContainer(false)}>
							<Close />
						</IconButton>
						<WordsContainer />
					</Box>
				)}
			</Stack>

			{/* Modal d'édition pour les admins */}
			{isUserAdmin && (
				<EditMaterialModal
					open={editModalOpen}
					onClose={() => setEditModalOpen(false)}
					material={currentMaterial}
					onSuccess={handleEditSuccess}
				/>
			)}

			{/* Floating Report Button - Bottom Right */}
			<Box
				sx={{
					position: 'fixed',
					bottom: { xs: 270, sm: 24 },
					right: { xs: 16, sm: 24 },
					zIndex: 1000,
				}}>
				<ReportButton materialId={currentMaterial.id} />
			</Box>

			{/* Celebration overlay when completing material/page/book */}
			<CelebrationOverlay />
		</>
	)
}

export default React.memo(Material)
