import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import { supabaseServer } from '../../../../lib/supabase-server'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import {
	addBeingStudiedMaterial,
	removeBeingStudiedMaterial,
	getUserMaterialStatus,
	getUserMaterialsStatus,
	addMaterialToStudied,
} from '../../../../features/materials/materialsSlice'
import { getActivities } from '../../../../features/activities/activitiesSlice'
import BookMenu from '../../../../components/material/BookMenu'
import Translation from '../../../../components/material/Translation'
import Words from '../../../../components/material/Words'
import WordsContainer from '../../../../components/material/WordsContainer'
import VideoPlayer from '../../../../components/material/VideoPlayer'
import EditMaterialModal from '../../../../components/admin/EditMaterialModal'
import { useUserContext } from '../../../../context/user'
import { sections } from '../../../../data/sections'
import { getImageUrl } from '../../../../utils/imageUtils'

import Player from '../../../../components/Player'

const H5PViewer = dynamic(() => import('../../../../components/H5PViewer'), {
	ssr: false,
})

import { editContent } from '../../../../features/content/contentSlice'
import {
	Box,
	Button,
	CardMedia,
	Container,
	IconButton,
	Stack,
	Typography,
	Paper,
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
import Head from 'next/head'
import {
	primaryButton,
	warningButton,
	tertiaryButton,
	successButton,
} from '../../../../utils/buttonStyles'

const Material = ({ material: single_material, activitiesCount }) => {
	const { t, lang } = useTranslation('materials')
	const dispatch = useDispatch()
	const router = useRouter()
	const { user, isUserAdmin, userLearningLanguage, isUserLoggedIn } =
		useUserContext()
	const { material, section } = router.query
	const [showAccents, setShowAccents] = useState(false)
	const [coordinates, setCoordinates] = useState({})
	const [showWordsContainer, setShowWordsContainer] = useState(false)
	const [editModalOpen, setEditModalOpen] = useState(false)
	const [currentMaterial, setCurrentMaterial] = useState(single_material)

	const { user_material_status } = useSelector(store => store.materials)
	const { activities } = useSelector(store => store.activities)

	const { is_being_studied, is_studied } = user_material_status

	useEffect(() => {
		if (single_material) {
			setCurrentMaterial(single_material)
		}
	}, [single_material])

	useEffect(() => {
		if (!single_material?.id) return

		dispatch(getUserMaterialStatus(single_material.id))
	}, [dispatch, single_material])

	useEffect(() => {
		if (!single_material?.id) return

		if (isUserLoggedIn) {
			dispatch(getActivities({ id: single_material.id, type: 'materials' }))
		}
	}, [dispatch, single_material, isUserLoggedIn])

	const handleEditContent = () => {
		setEditModalOpen(true)
	}

	const handleEditSuccess = async () => {
		// Recharger les données du matériel après la modification
		const { data, error } = await supabase
			.from('materials')
			.select('*')
			.eq('id', single_material.id)
			.single()

		if (!error && data) {
			setCurrentMaterial(data)
			// Forcer le rafraîchissement de la page pour mettre à jour tous les composants
			router.replace(router.asPath)
		}
	}

	const getImageRegardingSection = section => {
		if (section === 'place') {
			return (
				<Container
					maxWidth='sm'
					sx={{ margin: '0 auto', marginBottom: '5rem' }}>
					<CardMedia
						component='img'
						sx={{ maxWidth: 600, height: 230, borderRadius: '3px' }}
						image={getImageUrl(single_material.image)}
						alt={material.title}
					/>
				</Container>
			)
		}
	}

	const displayAudioPlayer = (section, audio) => {
		if (sections.audio.includes(section)) {
			return <Player src={process.env.NEXT_PUBLIC_SUPABASE_AUDIO + audio} />
		}
	}

	const displayVideo = section => {
		if (sections.music.includes(section) || sections.video.includes(section)) {
			return (
				<Box
					sx={{
						position: 'sticky',
						top: { xs: '5.5rem', sm: '6rem', md: '6.5rem' },
						zIndex: 1000,
						marginBottom: '0.5rem',
					}}>
					<VideoPlayer videoUrl={single_material.video} />
				</Box>
			)
		}
	}

	const displayh5pActivities = () => {
		// Si l'utilisateur n'est pas connecté et qu'il y a des activités en DB
		if (!isUserLoggedIn && activitiesCount > 0) {
			return (
				<Typography
					variant='subtitle1'
					sx={{ fontWeight: '600', mt: 4 }}
					align='center'>
					{t('h5p')}
				</Typography>
			)
		}

		// Si l'utilisateur est connecté et qu'il y a des activités
		if (activities && activities.length > 0) {
			return (
				<div>
					{activities.map(activity => {
						const h5pJsonPath =
							process.env.NEXT_PUBLIC_SUPABASE_H5P +
							'materials/' +
							activity.material_id +
							activity.h5p_url

						return <H5PViewer key={activity.id} h5pJsonPath={h5pJsonPath} />
					})}
				</div>
			)
		}

		// Sinon, ne rien afficher
		return null
	}

	const getCoordinates = e => {
		// Utiliser les coordonnées du viewport (clientX/clientY)
		// car le composant Translation utilise position: fixed
		setCoordinates({
			x: e.clientX,
			y: e.clientY,
		})
	}
	return (
		single_material && (
			<>
				<Head>
					<title>{`${single_material.title} | Linguami`}</title>
					<meta name='description' content={single_material.title} />
				</Head>

				{/* Compact Header */}
				<Box
					sx={{
						pt: { xs: '5.5rem', md: '6rem' },
						pb: 2.5,
						borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
						bgcolor: '#fafafa',
					}}>
					<Container maxWidth="lg">
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
							<IconButton
								sx={{
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
									border: '1px solid rgba(139, 92, 246, 0.3)',
									color: '#8b5cf6',
									transition: 'all 0.3s ease',
									'&:hover': {
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
										transform: 'scale(1.05)',
									},
								}}
								aria-label='back'
								onClick={() => router.back()}>
								<ArrowBack fontSize='medium' />
							</IconButton>
							<Typography
								variant='h4'
								sx={{
									fontWeight: 700,
									fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
									background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									flex: 1,
								}}>
								{single_material.title}
							</Typography>
						</Box>
					</Container>
				</Box>

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
							py: { xs: 4, lg: 6 },
							px: { xs: 1, lg: 3 },
							flex: 1,
							minWidth: 0,
							maxWidth: '100%',
						}}>

						{getImageRegardingSection(section)}
						{displayVideo(section)}

						<Box
							sx={{
								marginTop: { xs: '1rem', sm: '1.5rem' },
								px: { xs: 0, sm: 1 },
							}}>
							<Translation
								coordinates={coordinates}
								materialId={single_material.id}
								userId={user && user.id}
							/>

							{/* Action buttons */}
							<Box
								sx={{
									position: 'relative',
									zIndex: 100,
									display: 'flex',
									flexWrap: 'wrap',
									gap: 2,
									marginBottom: '3rem',
									marginTop: '2rem',
									background: { xs: 'transparent', lg: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)' },
									padding: { xs: '1rem', lg: '2rem' },
									borderRadius: { xs: 0, lg: 4 },
									border: { xs: 'none', lg: '1px solid rgba(139, 92, 246, 0.2)' },
									boxShadow: { xs: 'none', lg: '0 4px 20px rgba(139, 92, 246, 0.15)' },
								}}>
								{/* Si le matériel est à l'étude ou a déjà été étudié, ne pas
								afficher le bouton proposant de l'ajouter aux matériels en cours
								d'étude */}
								{!is_being_studied && !is_studied && isUserLoggedIn && (
									<Button
										variant='contained'
										startIcon={<PlayArrowRounded />}
										onClick={async () => {
											await dispatch(
												addBeingStudiedMaterial(single_material.id)
											)
											dispatch(getUserMaterialStatus(single_material.id))
											dispatch(getUserMaterialsStatus())
										}}
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
										<Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
											{t('startstudying')}
										</Box>
										<Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
											{lang === 'fr' ? 'Commencer à étudier' : 'Начать изучение'}
										</Box>
									</Button>
								)}

								{is_being_studied && isUserLoggedIn && (
									<Button
										variant='contained'
										startIcon={<PauseRounded />}
										onClick={async () => {
											await dispatch(
												removeBeingStudiedMaterial(single_material.id)
											)
											dispatch(getUserMaterialStatus(single_material.id))
											dispatch(getUserMaterialsStatus())
										}}
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
										<Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
											{t('stopstudying')}
										</Box>
										<Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
											{lang === 'fr' ? 'Ne plus étudier' : 'Отказаться от изучения'}
										</Box>
									</Button>
								)}

								{/* Bouton "Montrer les accents" caché */}

								{/* Si l'user est admin, afficher le bouton permettant de modifier le matériel */}
								{isUserAdmin && (
									<Button
										variant='outlined'
										onClick={handleEditContent}
										startIcon={<EditRounded sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />}
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
										<Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
											Edit material
										</Box>
										<EditRounded sx={{ display: { xs: 'block', sm: 'none' }, fontSize: '1.5rem' }} />
									</Button>
								)}
							</Box>

							{/* Si le matériel a pour section book, afficher le menu des chapitres du livre */}
							{section === 'books' && (
								<Box
									sx={{
										position: 'relative',
										zIndex: 100,
										marginBottom: '2rem',
										background: { xs: 'transparent', lg: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)' },
										padding: { xs: '1rem', lg: '2rem' },
										borderRadius: { xs: 0, lg: 4 },
										border: { xs: 'none', lg: '1px solid rgba(139, 92, 246, 0.2)' },
										boxShadow: { xs: 'none', lg: '0 4px 20px rgba(139, 92, 246, 0.15)' },
									}}>
									<BookMenu bookId={single_material.book_id} />
								</Box>
							)}

							{/* Afficher le texte avec ou sans accents en fonction de l'état de showAccents */}
							<Paper
								elevation={0}
								sx={{
									position: 'relative',
									zIndex: 100,
									padding: { xs: 1.5, lg: 5 },
									marginBottom: '3rem',
									background: { xs: 'transparent', lg: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)' },
									borderRadius: { xs: 0, lg: 4 },
									border: { xs: 'none', lg: '1px solid rgba(139, 92, 246, 0.2)' },
									boxShadow: { xs: 'none', lg: '0 4px 20px rgba(139, 92, 246, 0.15)' },
								}}>
								{showAccents ? (
									<Typography
										sx={{
											fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.2rem' },
											lineHeight: 1.5,
											letterSpacing: '0.01em',
											wordSpacing: '-0.05em',
											color: '#1a202c',
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
										onClick={e => getCoordinates(e)}>
										<Words
											content={single_material.body_accents}
											materialId={single_material.id}
											locale={lang}
										/>
									</Typography>
								) : (
									<Typography
										sx={{
											fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.2rem' },
											lineHeight: 1.5,
											letterSpacing: '0.01em',
											wordSpacing: '-0.05em',
											color: '#1a202c',
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
										onClick={e => getCoordinates(e)}>
										<Words
											content={single_material.body}
											materialId={single_material.id}
											locale={lang}
										/>
									</Typography>
								)}
							</Paper>

							{displayh5pActivities()}

							{/* Ne pas afficher le bouton permettant de terminer le matériel s'il a déjà été étudié */}
							{!is_studied && (
								<Box
									sx={{
										position: 'relative',
										zIndex: 100,
										display: 'flex',
										justifyContent: 'center',
										marginTop: '4rem',
										marginBottom: '3rem',
										background: { xs: 'transparent', lg: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)' },
										padding: { xs: '1rem', lg: '2rem' },
										borderRadius: { xs: 0, lg: 4 },
										border: { xs: 'none', lg: '1px solid rgba(16, 185, 129, 0.2)' },
										boxShadow: { xs: 'none', lg: '0 4px 20px rgba(16, 185, 129, 0.15)' },
									}}>
									<Button
										variant='contained'
										size='large'
										startIcon={<CheckCircleRounded />}
										onClick={async () => {
											await dispatch(addMaterialToStudied(single_material.id))
											dispatch(getUserMaterialStatus(single_material.id))
											dispatch(getUserMaterialsStatus())
										}}
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
										{t('lessonlearnt')}
									</Button>
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
								{displayAudioPlayer(section, single_material.audio)}
							</Box>
						</Box>
					</Box>

					{/* Floating button for mobile and tablet */}
					<IconButton
						sx={{
							display: { xs: 'flex', lg: 'none' },
							position: 'fixed',
							right: '1rem',
							bottom: '12.5rem',
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
					<Box
						sx={{
							display: { xs: 'none', lg: 'block' },
							width: {
								lg: '500px',
								xl: '550px',
							},
							flexShrink: 0,
							bgcolor: 'white',
							position: 'sticky',
							top: { lg: 120 },
							alignSelf: 'flex-start',
							maxHeight: 'calc(100vh - 130px)',
							overflowY: 'auto',
							pt: { lg: 10 },
							px: 3,
							'&::-webkit-scrollbar': {
								width: '12px',
							},
							'&::-webkit-scrollbar-track': {
								background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
								borderRadius: '6px',
							},
							'&::-webkit-scrollbar-thumb': {
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								borderRadius: '6px',
								border: '2px solid rgba(255, 255, 255, 0.3)',
								boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
								'&:hover': {
									background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
									borderColor: 'rgba(255, 255, 255, 0.5)',
									boxShadow: '0 4px 12px rgba(139, 92, 246, 0.5)',
								},
							},
						}}>
						<WordsContainer />
					</Box>

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
								backgroundColor: 'white',
								zIndex: 1100,
								flexDirection: 'column',
								overflowY: 'auto',
								paddingTop: { xs: '6rem', sm: '6.5rem' },
								paddingX: '1rem',
							}}>
							<IconButton
								sx={{
									position: 'fixed',
									bottom: '12.5rem',
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
			</>
		)
	)
}

export const getStaticProps = async ({ params }) => {
	const { data: material } = await supabase
		.from('materials')
		.select('*')
		.eq('id', params.material)
		.single()

	// Compter les activités H5P côté serveur avec le client serveur (bypasse RLS)
	const { count: activitiesCount, error: countError } = await supabaseServer
		.from('h5p')
		.select('*', { count: 'exact', head: true })
		.eq('material_id', params.material)
		.eq('type', 'materials')

	return {
		props: {
			material,
			activitiesCount: activitiesCount || 0,
		},
		revalidate: 60,
	}
}

export const getStaticPaths = async () => {
	const { data: materials, error } = await supabase
		.from('materials')
		.select('*')
		.neq('section', 'books')

	if (!materials) {
		return {
			paths: [],
			fallback: false,
		}
	}

	const paths = materials.map(material => ({
		params: { section: material.section, material: material.id.toString() },
	}))

	return {
		paths,
		fallback: 'blocking',
	}
}

export default Material
