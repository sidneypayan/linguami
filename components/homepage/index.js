import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import Image from 'next/image'
import Hero from './Hero'
import Link from 'next/link'
import {
	Box,
	Button,
	Container,
	Grid,
	styled,
	Typography,
	Modal,
} from '@mui/material'

import { Stack } from '@mui/system'

const StyledGridItem = styled(Grid)({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: '1rem',
	textAlign: 'center',
	marginBottom: '2rem',
})

const Homepage = () => {
	const { t } = useTranslation('home')
	const [open, setOpen] = useState(false)
	const [videoSrc, setVideoSrc] = useState('')
	const [modalName, setModalName] = useState('')

	const handleOpen = src => {
		setVideoSrc(src)
		setOpen(true)
	}
	const handleClose = () => {
		setVideoSrc('')
		setOpen(false)
	}

	const multimedia = [
		{
			img: '/img/video.png',
			title: t('video'),
			subtitle: t('videosubtitle'),
		},
		{
			img: '/img/audio.png',
			title: t('audio'),
			subtitle: t('audiosubtitle'),
		},
		{
			img: '/img/text.png',
			title: t('text'),
			subtitle: t('textsubtitle'),
		},
		{
			img: '/img/dictionary.png',
			title: t('dictionary'),
			subtitle: t('dictionarysubtitle'),
		},
		{
			img: '/img/flashcards.png',
			title: t('flashcards'),
			subtitle: t('flashcardssubtitle'),
		},
	]

	return (
		<>
			<Hero />
			<Container width={1440} sx={{ margin: '5rem auto' }}>
				<Typography variant='h3' align='center'>
					{t('multimedia')}
				</Typography>

				<div className='hr-custom'></div>

				<Grid container justifyContent='space-between' m='4rem auto'>
					{multimedia.map((icon, index) => (
						<StyledGridItem key={index} item xs={6} sm={4} lg={2}>
							<Image src={icon.img} alt='video' width={75} height={75} />
							<Typography variant='h5'>{icon.title}</Typography>
							<Typography variant='subtitle' color='primaryGrey'>
								{icon.subtitle}
							</Typography>
						</StyledGridItem>
					))}
				</Grid>

				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',

							width: {
								xs: '95%', // 95% de largeur sur les petits écrans (xs = téléphone)
								sm: '80%', // 80% sur les écrans moyens
								md: '65%', // 65% sur les grands écrans
							},

							bgcolor: 'background.paper',
							boxShadow: 24,
							p: 4,
							borderRadius: '4px',
						}}>
						<video
							loop
							autoPlay
							style={{ width: '100%' }}
							src={`${process.env.NEXT_PUBLIC_SUPABASE_VIDEO}/${videoSrc}`}></video>
					</Box>
				</Modal>

				<Stack
					sx={{
						width: '1000px',
						maxWidth: '100%',
						flexDirection: 'row',
						justifyContent: 'space-between',
						boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
						padding: '4rem',
						borderRadius: '3px',
						gap: '1.5rem',
						margin: '0 auto',
						marginTop: '5rem',
					}}>
					<Box
						width='50%'
						minWidth={175}
						sx={{
							display: {
								xs: 'none',
								sm: 'block',
							},
						}}>
						<Box
							component='img'
							src='/img/translator.png'
							alt='translator'
							width={175}
							height={175}
						/>
					</Box>

					<Stack gap='1rem'>
						<Typography variant='h4' align='center'>
							{t('translator')}
						</Typography>
						<Typography variant='subtitle' color='primaryGrey' align='center'>
							{t('translatorsubtitle')}
						</Typography>

						<Button
							onClick={() => handleOpen('translator.mp4')}
							variant='contained'
							size='large'
							sx={{
								width: '200px',
								display: 'block',
								margin: '0 auto',
								bgcolor: 'clrBtn1',
								marginTop: '1rem',
							}}>
							{t('show')}
						</Button>
					</Stack>
				</Stack>

				<Stack
					sx={{
						width: '1000px',
						maxWidth: '100%',
						flexDirection: 'row',
						justifyContent: 'space-between',
						boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
						padding: '4rem',
						borderRadius: '3px',
						gap: '1.5rem',
						margin: '0 auto',
						marginTop: '5rem',
					}}>
					<Stack gap='1rem'>
						<Typography variant='h4' align='center'>
							{t('dictionary')}
						</Typography>
						<Typography variant='subtitle' color='primaryGrey' align='center'>
							{t('giftranslatorsubtitle')}
						</Typography>

						<Button
							onClick={() => handleOpen('dictionary.mp4')}
							variant='contained'
							size='large'
							sx={{
								width: '200px',
								display: 'block',
								margin: '0 auto',
								marginTop: '1rem',
								bgcolor: 'clrBtn1',
							}}>
							{t('show')}
						</Button>
					</Stack>
					<Box
						width='50%'
						minWidth={175}
						sx={{
							display: {
								xs: 'none',
								sm: 'block',
							},
						}}>
						<Box
							component='img'
							src='/img/dictionary.png'
							alt='dictionary'
							width={175}
							height={175}
						/>
					</Box>
				</Stack>

				<Stack
					sx={{
						width: '1000px',
						maxWidth: '100%',
						flexDirection: 'row',
						justifyContent: 'space-between',
						boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
						padding: '4rem',
						borderRadius: '3px',
						gap: '1.5rem',
						margin: '0 auto',
						marginTop: '5rem',
					}}>
					<Box
						width='50%'
						minWidth={175}
						sx={{
							display: {
								xs: 'none',
								sm: 'block',
							},
						}}>
						<Box
							component='img'
							src='/img/flashcards.png'
							alt='flashcards'
							width={175}
							height={175}
						/>
					</Box>

					<Stack gap='1rem'>
						<Typography variant='h4' align='center'>
							{t('flashcards')}
						</Typography>
						<Typography variant='subtitle' color='primaryGrey' align='center'>
							{t('gifflashcardssubtitle')}
						</Typography>

						<Button
							onClick={() => handleOpen('flashcards.mp4')}
							variant='contained'
							size='large'
							sx={{
								width: '200px',
								display: 'block',
								margin: '0 auto',
								bgcolor: 'clrBtn1',
								marginTop: '1rem',
							}}>
							{t('show')}
						</Button>
					</Stack>
				</Stack>

				<Stack
					sx={{
						width: '1000px',
						maxWidth: '100%',
						flexDirection: 'row',
						justifyContent: 'space-between',
						boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
						padding: '4rem',
						borderRadius: '3px',
						gap: '1.5rem',
						margin: '0 auto',
						marginTop: '5rem',
					}}>
					<Stack gap='1rem'>
						<Typography variant='h4' align='center'>
							{t('teacher')}
						</Typography>
						<Typography variant='subtitle' color='primaryGrey' align='center'>
							{t('teachersubtitle')}
						</Typography>
						<Link href='/teacher'>
							<Button
								variant='contained'
								size='large'
								sx={{
									width: '200px',
									display: 'block',
									margin: '0 auto',
									marginTop: '1rem',
									bgcolor: 'clrBtn1',
								}}>
								{t('start')}
							</Button>
						</Link>
					</Stack>
					<Box
						width='50%'
						minWidth={175}
						sx={{
							display: {
								xs: 'none',
								sm: 'block',
							},
						}}>
						<Box
							component='img'
							src='/img/teacher.png'
							alt='teacher'
							width={175}
							height={175}
						/>
					</Box>
				</Stack>
			</Container>
		</>
	)
}

export default Homepage
