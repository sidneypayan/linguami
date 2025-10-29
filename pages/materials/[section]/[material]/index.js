import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'
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
} from '@mui/material'
import { ArrowBack, MenuBook, Close } from '@mui/icons-material'
import Head from 'next/head'

const Material = ({ material: single_material }) => {
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

		dispatch(getActivities({ id: single_material.id, type: 'materials' }))
	}, [dispatch, single_material])

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
			return (
				<Box
					maxWidth='100%'
					width={450}
					sx={{
						margin: '0 auto',
						marginBottom: '5rem',
						position: 'sticky',
						top: '70px',
						textAlign: 'center',
						zIndex: '2',
					}}>
					<iframe
						style={{ height: '250px', width: '450px', maxWidth: '100%' }}
						src={single_material.video}
						allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen'></iframe>
				</Box>
			)
		}
	}

	const displayh5pActivities = () => {
		if (!activities || activities.length === 0) {
			return (
				<Typography
					variant='subtitle1'
					sx={{ fontWeight: '600', mt: 4 }}
					align='center'>
					{t('h5p')}
				</Typography>
			)
		}

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
						position: 'absolute',
						top: '6rem',
						left: '5%',
						color: 'clrBtn2',
					}}
					aria-label='back'
					onClick={() => router.back()}>
					<ArrowBack fontSize='large' />
				</IconButton>
				<Stack
					sx={{
						flexDirection: {
							sx: 'column',
							md: 'row',
						},
					}}>
					<Container disableGutters maxWidth='100%' sx={{ marginTop: '8rem' }}>
						<Typography
							variant='h1'
							sx={{
								typography: { xs: 'h4', sm: 'h3' },
								width: '750px',
								maxWidth: '100%',
								margin: '2rem auto',
							}}
							align='center'
							mb={5}>
							{single_material.title}
						</Typography>

						{getImageRegardingSection(section)}
						{displayVideo(section)}

						<Container maxWidth='md'>
							<Translation
								coordinates={coordinates}
								materialId={single_material.id}
								userId={user && user.id}
							/>

							{/* Si le matériel est à l'étude ou a déjà été étudié, ne pas
							afficher le bouton proposant de l'ajouter aux matériels en cours
							d'étude */}

							{!is_being_studied && !is_studied && isUserLoggedIn && (
								<Button
									sx={{
										marginBottom: '2rem',
										marginRight: '1rem',
										backgroundColor: 'clrPrimary1',
									}}
									variant='contained'
									onClick={async () => {
										await dispatch(addBeingStudiedMaterial(single_material.id))
										dispatch(getUserMaterialStatus(single_material.id))
										dispatch(getUserMaterialsStatus())
									}}
									type='button'
									id='show-accents'>
									{t('startstudying')}
								</Button>
							)}

							{is_being_studied && isUserLoggedIn && (
								<Button
									sx={{
										marginBottom: '2rem',
										marginRight: '1rem',
										backgroundColor: 'clrPrimary1',
									}}
									variant='contained'
									onClick={async () => {
										await dispatch(
											removeBeingStudiedMaterial(single_material.id)
										)
										dispatch(getUserMaterialStatus(single_material.id))
										dispatch(getUserMaterialsStatus())
									}}
									type='button'
									id='show-accents'>
									{t('stopstudying')}
								</Button>
							)}

							{/* Si la langue russe est sélectionné, montrer le bouton permettant d'afficher les accents */}
							{userLearningLanguage === 'ru' && (
								<Button
									sx={{ marginBottom: '2rem', backgroundColor: 'clrPrimary1' }}
									variant='contained'
									onClick={() => setShowAccents(!showAccents)}
									type='button'
									id='show-accents'>
									{t('showaccents')}
								</Button>
							)}

							{/* Si le matériel a pour section book, afficher le menu des chapitres du livre */}

							{section === 'books' && (
								<BookMenu bookId={single_material.book_id} />
							)}

							{/* Si l'user est admin, afficher le bouton permettant de modifier le matériel */}
							{isUserAdmin && (
								<Button
									sx={{ marginBottom: '2rem', backgroundColor: 'clrPrimary1' }}
									variant='contained'
									onClick={handleEditContent}
									type='button'
									id='show-accents'
									style={{ marginLeft: '1rem' }}>
									Edit material
								</Button>
							)}

							{/* Afficher le texte avec ou sans accents en fonction de l'état de showAccents */}
							{showAccents ? (
								<Typography
									color='clrGrey2'
									sx={{ fontSize: '1.1rem' }}
									variant='subtitle1'
									onClick={e => getCoordinates(e)}>
									<Words
										content={single_material.body_accents}
										materialId={single_material.id}
									/>
								</Typography>
							) : (
								<Typography
									color='clrGrey2'
									sx={{ fontSize: '1.1rem' }}
									variant='subtitle1'
									onClick={e => getCoordinates(e)}>
									<Words
										content={single_material.body}
										materialId={single_material.id}
									/>
								</Typography>
							)}

							{/* Ne pas afficher le bouton permettant de terminer le matériel s'il a déjà été étudié */}
							<br />

							{displayh5pActivities()}

							{!is_studied && (
								<Button
									variant='outlined'
									size='large'
									sx={{
										display: 'block',
										margin: '0 auto',
										marginTop: '2rem',
									}}
									onClick={async () => {
										await dispatch(addMaterialToStudied(single_material.id))
										dispatch(getUserMaterialStatus(single_material.id))
										dispatch(getUserMaterialsStatus())
									}}
									type='button'
									id='checkMaterial'>
									{t('lessonlearnt')} <i className='fas fa-check'></i>
								</Button>
							)}
						</Container>

						<Box
							sx={{
								position: 'sticky',
								bottom: 0,
								boxShadow: '0px -10px 15px -5px rgba(0,0,0,0.1)',
								marginTop: '4rem',
							}}>
							{displayAudioPlayer(section, single_material.audio)}
						</Box>
					</Container>

					{/* Floating button for mobile */}
					<IconButton
						sx={{
							display: { xs: 'flex', md: 'none' },
							position: 'fixed',
							right: '1rem',
							bottom: '6rem',
							backgroundColor: 'clrPrimary1',
							color: 'white',
							width: '56px',
							height: '56px',
							boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
							zIndex: 1000,
							'&:hover': {
								backgroundColor: 'clrPrimary2',
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
									position: 'absolute',
									top: '1rem',
									right: '1rem',
									color: 'clrBtn2',
								}}
								onClick={() => setShowWordsContainer(false)}>
								<Close fontSize='large' />
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

	return {
		props: {
			material,
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
