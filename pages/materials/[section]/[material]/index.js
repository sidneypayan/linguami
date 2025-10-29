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
import { useUserContext } from '../../../../context/user'
import { sections } from '../../../../data/sections'

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
} from '@mui/icons-material'
import Head from 'next/head'
import {
	primaryButton,
	warningButton,
	tertiaryButton,
	successButton,
} from '../../../../utils/buttonStyles'

const Material = ({ material: single_material, activitiesCount }) => {
	const { t } = useTranslation('materials')
	const dispatch = useDispatch()
	const router = useRouter()
	const { user, isUserAdmin, userLearningLanguage, isUserLoggedIn } =
		useUserContext()
	const { material, section } = router.query
	const [showAccents, setShowAccents] = useState(false)
	const [coordinates, setCoordinates] = useState({})
	const [showWordsContainer, setShowWordsContainer] = useState(false)

	const { user_material_status } = useSelector(store => store.materials)
	const { activities } = useSelector(store => store.activities)

	const { is_being_studied, is_studied } = user_material_status

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
		dispatch(editContent({ id: single_material.id, contentType: 'materials' }))
		router.push('/admin/create')
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
						image={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/${single_material.image}`}
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
			return <VideoPlayer videoUrl={single_material.video} />
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
				<IconButton
					sx={{
						position: 'fixed',
						top: '5rem',
						left: { xs: '1rem', sm: '2rem' },
						zIndex: 1000,
						backgroundColor: 'rgba(255, 255, 255, 0.9)',
						backdropFilter: 'blur(8px)',
						boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
						transition: 'all 0.3s ease',
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						color: 'white',
						'&:hover': {
							transform: 'scale(1.1)',
							boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
						},
						'&:active': {
							transform: 'scale(0.95)',
						},
					}}
					aria-label='back'
					onClick={() => router.back()}>
					<ArrowBack fontSize='medium' />
				</IconButton>
				<Stack
					sx={{
						flexDirection: {
							xs: 'column',
							md: 'row',
						},
					}}>
					<Container
						disableGutters
						maxWidth='100%'
						sx={{
							marginTop: { xs: '5rem', sm: '5.5rem', md: '6rem' },
							px: { xs: 2, sm: 3, md: 0 },
						}}>
						<Typography
							variant='h1'
							sx={{
								position: 'relative',
								zIndex: 100,
								typography: { xs: 'h4', sm: 'h3' },
								width: '750px',
								maxWidth: '100%',
								margin: { xs: '1.5rem auto 0.5rem', sm: '2rem auto 0.75rem' },
								px: { xs: 1, sm: 0 },
								backgroundColor: 'white',
								py: 2,
							}}
							align='center'>
							{single_material.title}
						</Typography>

						{getImageRegardingSection(section)}
						{displayVideo(section)}

						<Container
							maxWidth='md'
							sx={{
								marginTop: (sections.music.includes(section) || sections.video.includes(section))
									? { xs: '14rem', sm: '16rem', md: '18rem' }
									: { xs: '2rem', sm: '3rem', md: '4rem' },
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
									backgroundColor: 'white',
									padding: '1rem',
									borderRadius: 3,
									boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
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
												'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											color: 'white',
											fontWeight: 600,
											fontSize: { xs: '0.9rem', sm: '1rem' },
											padding: '0.75rem 1.5rem',
											borderRadius: 3,
											textTransform: 'none',
											transition: 'all 0.3s ease',
											boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
											'&:hover': {
												background:
													'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
												transform: 'translateY(-2px)',
												boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
											},
											'&:active': {
												transform: 'scale(0.98)',
											},
										}}>
										{t('startstudying')}
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
											padding: '0.75rem 1.5rem',
											borderRadius: 3,
											textTransform: 'none',
											transition: 'all 0.3s ease',
											boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
											'&:hover': {
												background:
													'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
												transform: 'translateY(-2px)',
												boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
											},
											'&:active': {
												transform: 'scale(0.98)',
											},
										}}>
										{t('stopstudying')}
									</Button>
								)}

								{/* Si la langue russe est sélectionné, montrer le bouton permettant d'afficher les accents */}
								{userLearningLanguage === 'ru' && (
									<Button
										variant='contained'
										startIcon={<VisibilityRounded />}
										onClick={() => setShowAccents(!showAccents)}
										sx={{
											background: showAccents
												? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
												: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
											color: 'white',
											fontWeight: 600,
											fontSize: { xs: '0.9rem', sm: '1rem' },
											padding: '0.75rem 1.5rem',
											borderRadius: 3,
											textTransform: 'none',
											transition: 'all 0.3s ease',
											boxShadow: showAccents
												? '0 4px 15px rgba(16, 185, 129, 0.3)'
												: '0 4px 15px rgba(100, 116, 139, 0.3)',
											'&:hover': {
												background: showAccents
													? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
													: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
												transform: 'translateY(-2px)',
												boxShadow: showAccents
													? '0 6px 20px rgba(16, 185, 129, 0.4)'
													: '0 6px 20px rgba(100, 116, 139, 0.4)',
											},
											'&:active': {
												transform: 'scale(0.98)',
											},
										}}>
										{t('showaccents')}
									</Button>
								)}

								{/* Si l'user est admin, afficher le bouton permettant de modifier le matériel */}
								{isUserAdmin && (
									<Button
										variant='outlined'
										onClick={handleEditContent}
										sx={{
											borderColor: '#667eea',
											color: '#667eea',
											fontWeight: 600,
											fontSize: { xs: '0.9rem', sm: '1rem' },
											padding: '0.75rem 1.5rem',
											borderRadius: 3,
											textTransform: 'none',
											transition: 'all 0.3s ease',
											borderWidth: '2px',
											'&:hover': {
												borderColor: '#667eea',
												borderWidth: '2px',
												background: 'rgba(102, 126, 234, 0.1)',
												transform: 'translateY(-2px)',
											},
											'&:active': {
												transform: 'scale(0.98)',
											},
										}}>
										Edit material
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
										backgroundColor: 'white',
										padding: '1rem',
										borderRadius: 3,
										boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
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
									padding: { xs: 3, sm: 4 },
									marginBottom: '3rem',
									backgroundColor: 'white',
									borderRadius: 3,
									border: '1px solid rgba(0, 0, 0, 0.08)',
									boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
								}}>
								{showAccents ? (
									<Typography
										sx={{
											fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.2rem' },
											lineHeight: 2,
											letterSpacing: '0.01em',
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
										/>
									</Typography>
								) : (
									<Typography
										sx={{
											fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.2rem' },
											lineHeight: 2,
											letterSpacing: '0.01em',
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
										marginTop: '3rem',
										marginBottom: '3rem',
										backgroundColor: 'white',
										padding: '1rem',
										borderRadius: 3,
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
											fontSize: { xs: '1rem', sm: '1.1rem' },
											padding: { xs: '1rem 2rem', sm: '1.2rem 3rem' },
											borderRadius: 3,
											textTransform: 'none',
											transition: 'all 0.3s ease',
											boxShadow: '0 6px 24px rgba(16, 185, 129, 0.3)',
											'&:hover': {
												background:
													'linear-gradient(135deg, #059669 0%, #047857 100%)',
												transform: 'translateY(-3px)',
												boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
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
									bottom: '1.5rem',
									zIndex: 500,
									marginTop: '3rem',
									marginBottom: '3rem',
								}}>
								{displayAudioPlayer(section, single_material.audio)}
							</Box>
						</Container>
					</Container>

					{/* Floating button for mobile */}
					<IconButton
						sx={{
							display: { xs: 'flex', md: 'none' },
							position: 'fixed',
							right: '1rem',
							bottom: '6rem',
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							color: 'white',
							width: '56px',
							height: '56px',
							boxShadow: '0 4px 15px rgba(102, 126, 234, 0.5)',
							zIndex: 1000,
							transition: 'all 0.3s ease',
							'&:hover': {
								background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
								transform: 'scale(1.1)',
								boxShadow: '0 6px 20px rgba(102, 126, 234, 0.7)',
							},
						}}
						onClick={() => setShowWordsContainer(true)}>
						<MenuBook />
					</IconButton>

					{/* Desktop WordsContainer */}
					<Container
						sx={{
							display: { xs: 'none', md: 'block' },
							maxWidth: {
								md: '35%',
								lg: '25%',
							},
							bgcolor: '#fafafa',
							paddingTop: '8rem',
						}}>
						<WordsContainer />
					</Container>

					{/* Mobile fullscreen WordsContainer */}
					{showWordsContainer && (
						<Box
							sx={{
								display: { xs: 'flex', md: 'none' },
								position: 'fixed',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								backgroundColor: '#fafafa',
								zIndex: 1100,
								flexDirection: 'column',
								overflowY: 'auto',
								paddingTop: '4rem',
								paddingX: '1rem',
							}}>
							<IconButton
								sx={{
									position: 'fixed',
									bottom: '6rem',
									right: '1rem',
									background:
										'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
									color: 'white',
									width: '56px',
									height: '56px',
									boxShadow: '0 4px 15px rgba(245, 87, 108, 0.5)',
									zIndex: 1200,
									transition: 'all 0.3s ease',
									'&:hover': {
										background:
											'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
										transform: 'scale(1.1) rotate(90deg)',
										boxShadow: '0 6px 20px rgba(245, 87, 108, 0.7)',
									},
								}}
								onClick={() => setShowWordsContainer(false)}>
								<Close />
							</IconButton>
							<WordsContainer />
						</Box>
					)}
				</Stack>
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
