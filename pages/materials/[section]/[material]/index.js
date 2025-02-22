import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import {
	addBeingStudiedMaterial,
	removeBeingStudiedMaterial,
	getUserMaterialStatus,
	addMaterialToStudied,
} from '../../../../features/materials/materialsSlice'
import BookMenu from '../../../../components/material/BookMenu'
import Translation from '../../../../components/material/Translation'
import Words from '../../../../components/material/Words'
import WordsContainer from '../../../../components/material/WordsContainer'
import { useUserContext } from '../../../../context/user'
import { sections } from '../../../../data/sections'

import Player from '../../../../components/Player'
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
import { ArrowBack } from '@mui/icons-material'
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

	const { user_material_status } = useSelector(store => store.materials)

	const { is_being_studied, is_studied } = user_material_status

	useEffect(() => {
		if (single_material) {
			dispatch(getUserMaterialStatus(single_material.id))
		}
	}, [user_material_status])

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

	const getCoordinates = e => {
		const xCoordinate =
			window.innerWidth < 768
				? e.pageX - e.pageX / 2
				: window.innerWidth < 1024
				? e.pageX - e.pageX / 3
				: e.pageX - 100
		setCoordinates({
			x: xCoordinate,
			y: e.pageY - 50,
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
							afficher le bouton proposant de l'aouter aux matériels en cours
							d'étude */}

							{!is_being_studied && !is_studied && isUserLoggedIn && (
								<Button
									sx={{
										marginBottom: '2rem',
										marginRight: '1rem',
										backgroundColor: 'clrPrimary1',
									}}
									variant='contained'
									onClick={() =>
										dispatch(addBeingStudiedMaterial(single_material.id))
									}
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
									onClick={() =>
										dispatch(removeBeingStudiedMaterial(single_material.id))
									}
									type='button'
									id='show-accents'>
									Ne plus étudier ce matériel
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

							{section === 'book' && (
								<BookMenu bookName={single_material.book_name} />
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

							{!is_studied && (
								<Button
									variant='outlined'
									size='large'
									sx={{
										display: 'block',
										margin: '0 auto',
										marginTop: '2rem',
									}}
									onClick={() =>
										dispatch(addMaterialToStudied(single_material.id))
									}
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
					<Container
						sx={{
							maxWidth: {
								xs: '100%',
								md: '35%',
								lg: '25%',
							},
							bgcolor: '#fafafa',
							paddingTop: '8rem',
						}}>
						<WordsContainer />
					</Container>
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
		.neq('section', 'book')

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
