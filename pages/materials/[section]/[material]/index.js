import { useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import styles from '../../../../styles/materials/Material.module.css'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import BookMenu from '../../../../components/material/BookMenu'
import Translation from '../../../../components/material/Translation'
import Words from '../../../../components/material/Words'
import WordsContainer from '../../../../components/material/WordsContainer'
import { useUserContext } from '../../../../context/user'
import { sections } from '../../../../data/sections'
import { addMaterialToStudied } from '../../../../features/materials/materialsSlice'
import Player from '../../../../components/Player'
import { editContent } from '../../../../features/content/contentSlice'
import {
	Box,
	Button,
	Container,
	IconButton,
	Stack,
	Typography,
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

const Material = ({ material: single_material }) => {
	const dispatch = useDispatch()
	const router = useRouter()
	const { user, isUserAdmin } = useUserContext()
	const { material, section } = router.query

	const [showAccents, setShowAccents] = useState(false)
	const [coordinates, setCoordinates] = useState({})

	const handleEditContent = () => {
		dispatch(editContent({ id: single_material.id, contentType: 'materials' }))
		router.push('/admin/create')
	}

	const getImageRegardingSection = section => {
		if (section === 'place') {
			return (
				<div
					className={styles.imgPlace}
					style={{
						backgroundImage: `url(${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${single_material.img})`,
					}}></div>
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
				<iframe
					className={styles.iframe}
					src={single_material.video}
					frameBorder='0'
					allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen'></iframe>
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
			<Stack
				sx={{
					flexDirection: {
						sx: 'column',
						md: 'row',
					},
				}}>
				<Container
					disableGutters
					maxWidth='100%'
					sx={{ margin: '0 auto', marginTop: '5rem' }}>
					<IconButton
						sx={{ marginLeft: '2rem' }}
						aria-label='back'
						onClick={() => router.back()}>
						<ArrowBack fontSize='large' />
					</IconButton>

					<Typography variant='h3' align='center'>
						{single_material.title}
					</Typography>

					<Container
						maxWidth='md'
						sx={{
							margin: '5rem auto',
							position: 'sticky',
							top: '70px',
							textAlign: 'center',
							zIndex: '2',
						}}>
						{getImageRegardingSection(section)}
						{displayVideo(section)}
					</Container>

					<Container maxWidth='md'>
						<Translation
							coordinates={coordinates}
							materialId={single_material.id}
							userId={user && user.id}
						/>

						<Button
							sx={{ marginBottom: '2rem', backgroundColor: 'clrPrimary1' }}
							variant='contained'
							onClick={() => setShowAccents(!showAccents)}
							type='button'
							id='show-accents'>
							Montrer les accents
						</Button>
						{/* CHAPTER MENU */}
						{section === 'book' && (
							<BookMenu bookName={single_material.book_name} />
						)}
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

						<Button
							variant='outlined'
							size='large'
							sx={{
								display: 'block',
								margin: '0 auto',
							}}
							onClick={() => dispatch(addMaterialToStudied(single_material.id))}
							type='button'
							id='checkMaterial'>
							J&apos;ai terminé cette leçon <i className='fas fa-check'></i>
						</Button>
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
							sm: '35%',
							md: '30%',
							lg: '25%',
						},
						bgcolor: '#fafafa',
						paddingTop: '4rem',
					}}>
					<WordsContainer />
				</Container>
			</Stack>
		)
	)
}

export const getStaticProps = async ({ params }) => {
	const { data: material, error } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'ru')
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
		.eq('lang', 'ru')
		.neq('section', 'book')

	const paths = materials.map(material => ({
		params: { section: material.section, material: material.id.toString() },
	}))

	return {
		paths,
		fallback: 'blocking',
	}
}

export default Material
