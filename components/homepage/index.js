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
import { primaryButton } from '../../utils/buttonStyles'

const StyledGridItem = styled(Grid)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: '1rem',
	textAlign: 'center',
	marginBottom: '2rem',
	[theme.breakpoints.down('sm')]: {
		marginBottom: '1rem',
	},
}))

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
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/video.png`,
			title: t('video'),
			subtitle: t('videosubtitle'),
		},
		{
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/audio.png`,
			title: t('audio'),
			subtitle: t('audiosubtitle'),
		},
		{
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/text.png`,
			title: t('text'),
			subtitle: t('textsubtitle'),
		},
		{
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/dictionary.png`,
			title: t('dictionary'),
			subtitle: t('dictionarysubtitle'),
		},
		{
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/flashcards.png`,
			title: t('flashcards'),
			subtitle: t('flashcardssubtitle'),
		},
	]

	return (
		<>
			<Hero />
			<Container
				width={1440}
				sx={{
					margin: { xs: '3rem auto', md: '5rem auto' },
					padding: { xs: '0 1rem', md: '0 1.5rem' },
				}}>
				<Typography
					variant='h3'
					align='center'
					sx={{
						fontSize: { xs: '2rem', md: '3rem' },
					}}>
					{t('multimedia')}
				</Typography>

				<div className='hr-custom'></div>

				<Grid
					container
					justifyContent='space-between'
					sx={{
						margin: { xs: '2rem auto', md: '4rem auto' },
					}}>
					{multimedia.map((icon, index) => (
						<StyledGridItem key={index} item xs={6} sm={4} lg={2}>
							<Box
								sx={{
									width: { xs: 60, md: 75 },
									height: { xs: 60, md: 75 },
									position: 'relative',
								}}>
								<Image
									src={icon.img}
									alt='video'
									fill
									style={{ objectFit: 'contain' }}
								/>
							</Box>
							<Typography
								variant='h5'
								sx={{
									fontSize: { xs: '1.25rem', md: '1.5rem' },
									fontWeight: 600,
									color: '#667eea',
								}}>
								{icon.title}
							</Typography>
							<Typography
								variant='subtitle2'
								sx={{
									color: '#718096',
									fontWeight: 500,
								}}>
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
						flexDirection: { xs: 'column', sm: 'row' },
						justifyContent: 'space-between',
						boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
						padding: { xs: '2rem', md: '4rem' },
						borderRadius: '3px',
						gap: '1.5rem',
						margin: '0 auto',
						marginTop: { xs: '3rem', md: '5rem' },
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
							src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/translator.png`}
							alt='translator'
							width={175}
							height={175}
						/>
					</Box>

					<Stack gap='1rem'>
						<Typography
							variant='h4'
							align='center'
							sx={{
								fontSize: { xs: '1.75rem', md: '2.125rem' },
								fontWeight: 600,
								color: '#4a5568',
							}}>
							{t('translator')}
						</Typography>
						<Typography
							variant='subtitle1'
							align='center'
							sx={{
								color: '#718096',
								fontWeight: 500,
								lineHeight: 1.7,
							}}>
							{t('translatorsubtitle')}
						</Typography>

						<Button
							onClick={() => handleOpen('translator.mp4')}
							variant='contained'
							size='large'
							sx={{
								...primaryButton,
								minWidth: '200px',
								display: 'block',
								margin: '0 auto',
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
						flexDirection: { xs: 'column', sm: 'row' },
						justifyContent: 'space-between',
						boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
						padding: { xs: '2rem', md: '4rem' },
						borderRadius: '3px',
						gap: '1.5rem',
						margin: '0 auto',
						marginTop: { xs: '3rem', md: '5rem' },
					}}>
					<Stack gap='1rem'>
						<Typography
							variant='h4'
							align='center'
							sx={{
								fontSize: { xs: '1.75rem', md: '2.125rem' },
								fontWeight: 600,
								color: '#4a5568',
							}}>
							{t('dictionary')}
						</Typography>
						<Typography
							variant='subtitle1'
							align='center'
							sx={{
								color: '#718096',
								fontWeight: 500,
								lineHeight: 1.7,
							}}>
							{t('giftranslatorsubtitle')}
						</Typography>

						<Button
							onClick={() => handleOpen('dictionary.mp4')}
							variant='contained'
							size='large'
							sx={{
								...primaryButton,
								width: '200px',
								display: 'block',
								margin: '0 auto',
								marginTop: '1rem',
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
							src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/dictionary.png`}
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
						flexDirection: { xs: 'column', sm: 'row' },
						justifyContent: 'space-between',
						boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
						padding: { xs: '2rem', md: '4rem' },
						borderRadius: '3px',
						gap: '1.5rem',
						margin: '0 auto',
						marginTop: { xs: '3rem', md: '5rem' },
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
							src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/flashcards.png`}
							alt='flashcards'
							width={175}
							height={175}
						/>
					</Box>

					<Stack gap='1rem'>
						<Typography
							variant='h4'
							align='center'
							sx={{
								fontSize: { xs: '1.75rem', md: '2.125rem' },
								fontWeight: 600,
								color: '#4a5568',
							}}>
							{t('flashcards')}
						</Typography>
						<Typography
							variant='subtitle1'
							align='center'
							sx={{
								color: '#718096',
								fontWeight: 500,
								lineHeight: 1.7,
							}}>
							{t('gifflashcardssubtitle')}
						</Typography>

						<Button
							onClick={() => handleOpen('flashcards.mp4')}
							variant='contained'
							size='large'
							sx={{
								...primaryButton,
								width: '200px',
								display: 'block',
								margin: '0 auto',
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
						flexDirection: { xs: 'column', sm: 'row' },
						justifyContent: 'space-between',
						boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
						padding: { xs: '2rem', md: '4rem' },
						borderRadius: '3px',
						gap: '1.5rem',
						margin: '0 auto',
						marginTop: { xs: '3rem', md: '5rem' },
					}}>
					<Stack gap='1rem'>
						<Typography
							variant='h4'
							align='center'
							sx={{
								fontSize: { xs: '1.75rem', md: '2.125rem' },
								fontWeight: 600,
								color: '#4a5568',
							}}>
							{t('teacher')}
						</Typography>
						<Typography
							variant='subtitle1'
							align='center'
							sx={{
								color: '#718096',
								fontWeight: 500,
								lineHeight: 1.7,
							}}>
							{t('teachersubtitle')}
						</Typography>
						<Link href='/teacher'>
							<Button
								variant='contained'
								size='large'
								sx={{
									...primaryButton,
									width: '200px',
									display: 'block',
									margin: '0 auto',
									marginTop: '1rem',
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
							src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/teacher.png`}
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
