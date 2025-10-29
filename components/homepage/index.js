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
			subtitleMobile: t('videosubtitleMobile'),
			link: '/materials#videos',
		},
		{
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/audio.png`,
			title: t('audio'),
			subtitle: t('audiosubtitle'),
			subtitleMobile: t('audiosubtitleMobile'),
			link: '/materials#audio',
		},
		{
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/text.png`,
			title: t('text'),
			subtitle: t('textsubtitle'),
			subtitleMobile: t('textsubtitleMobile'),
			link: '/materials#texts',
		},
		{
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/dictionary.png`,
			title: t('dictionary'),
			subtitle: t('dictionarysubtitle'),
			subtitleMobile: t('dictionarysubtitleMobile'),
			link: '/dictionary',
		},
		{
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/flashcards.png`,
			title: t('flashcards'),
			subtitle: t('flashcardssubtitle'),
			subtitleMobile: t('flashcardssubtitleMobile'),
			link: '/dictionary',
		},
	]

	return (
		<>
			<Hero />
			<Container
				width={1440}
				sx={{
					margin: { xs: '3rem auto', md: '5rem auto' },
					padding: { xs: '0 0.75rem', md: '0 1.5rem' },
				}}>
				<Typography
					variant='h3'
					align='center'
					sx={{
						fontSize: { xs: '2rem', md: '3rem' },
						fontWeight: 800,
						mb: 1,
					}}>
					{t('multimedia')}
				</Typography>

				<Typography
					variant='subtitle1'
					align='center'
					sx={{
						color: '#718096',
						fontSize: { xs: '1rem', md: '1.125rem' },
						mb: 5,
						maxWidth: '600px',
						mx: 'auto',
					}}>
					Découvrez toutes nos ressources pour apprendre efficacement
				</Typography>

				<Grid
					container
					spacing={{ xs: 2, sm: 3 }}
					justifyContent='center'
					sx={{
						margin: { xs: '2rem auto', md: '4rem auto' },
						maxWidth: { xs: '100%', sm: '100%' },
					}}>
					{multimedia.map((icon, index) => (
						<Grid
							key={index}
							item
							xs={6}
							sm={4}
							lg={2.4}
							sx={{
								display: 'flex',
								justifyContent: 'center',
							}}>
							<Link href={icon.link} style={{ textDecoration: 'none', width: '100%', maxWidth: '280px' }}>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										gap: 2,
										textAlign: 'center',
										p: { xs: 2.5, md: 3 },
										height: '100%',
										width: '100%',
										minHeight: { xs: '260px', sm: '280px' },
										borderRadius: 4,
										background: 'rgba(255, 255, 255, 0.8)',
										border: '1px solid rgba(102, 126, 234, 0.1)',
										boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
										transition: 'all 0.3s ease',
										cursor: 'pointer',
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: '0 8px 30px rgba(102, 126, 234, 0.15)',
											background: 'white',
											borderColor: 'rgba(102, 126, 234, 0.3)',
										},
									}}>
									<Box
										sx={{
											width: { xs: 60, md: 70 },
											height: { xs: 60, md: 70 },
											position: 'relative',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											borderRadius: 3,
											background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
											p: 2,
										}}>
										<Image
											src={icon.img}
											alt={icon.title}
											fill
											style={{ objectFit: 'contain', padding: '12px' }}
										/>
									</Box>
									<Box>
										<Typography
											variant='h6'
											sx={{
												fontSize: { xs: '1rem', md: '1.125rem' },
												fontWeight: 700,
												color: '#667eea',
												mb: 0.5,
											}}>
											{icon.title}
										</Typography>
										<Typography
											variant='body2'
											sx={{
												color: '#718096',
												fontWeight: 500,
												fontSize: { xs: '0.875rem', md: '0.95rem' },
												lineHeight: 1.5,
											}}>
											<Box component='span' sx={{ display: { xs: 'inline', sm: 'none' } }}>
												{icon.subtitleMobile}
											</Box>
											<Box component='span' sx={{ display: { xs: 'none', sm: 'inline' } }}>
												{icon.subtitle}
											</Box>
										</Typography>
									</Box>
								</Box>
							</Link>
						</Grid>
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
						alignItems: 'center',
						boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
						padding: { xs: '2.5rem', md: '4rem' },
						borderRadius: 5,
						gap: '2rem',
						margin: '0 auto',
						marginTop: { xs: '3rem', md: '5rem' },
						background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
						border: '1px solid rgba(102, 126, 234, 0.1)',
						transition: 'all 0.3s ease',
						'&:hover': {
							boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
							transform: 'translateY(-4px)',
						},
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
								minWidth: { xs: '160px', sm: '200px' },
								minHeight: '48px',
								display: 'block',
								margin: '0 auto',
								marginTop: '1rem',
								fontSize: { xs: '0.9rem', sm: '1rem' },
								'&:active': {
									transform: 'scale(0.97)',
								},
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
						alignItems: 'center',
						boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
						padding: { xs: '2.5rem', md: '4rem' },
						borderRadius: 5,
						gap: '2rem',
						margin: '0 auto',
						marginTop: { xs: '3rem', md: '5rem' },
						background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
						border: '1px solid rgba(102, 126, 234, 0.1)',
						transition: 'all 0.3s ease',
						'&:hover': {
							boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
							transform: 'translateY(-4px)',
						},
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
								minWidth: { xs: '160px', sm: '200px' },
								minHeight: '48px',
								display: 'block',
								margin: '0 auto',
								marginTop: '1rem',
								fontSize: { xs: '0.9rem', sm: '1rem' },
								'&:active': {
									transform: 'scale(0.97)',
								},
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
						alignItems: 'center',
						boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
						padding: { xs: '2.5rem', md: '4rem' },
						borderRadius: 5,
						gap: '2rem',
						margin: '0 auto',
						marginTop: { xs: '3rem', md: '5rem' },
						background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
						border: '1px solid rgba(102, 126, 234, 0.1)',
						transition: 'all 0.3s ease',
						'&:hover': {
							boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
							transform: 'translateY(-4px)',
						},
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
								minWidth: { xs: '160px', sm: '200px' },
								minHeight: '48px',
								display: 'block',
								margin: '0 auto',
								marginTop: '1rem',
								fontSize: { xs: '0.9rem', sm: '1rem' },
								'&:active': {
									transform: 'scale(0.97)',
								},
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
						alignItems: 'center',
						boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
						padding: { xs: '2.5rem', md: '4rem' },
						borderRadius: 5,
						gap: '2rem',
						margin: '0 auto',
						marginTop: { xs: '3rem', md: '5rem' },
						background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
						border: '1px solid rgba(102, 126, 234, 0.1)',
						transition: 'all 0.3s ease',
						'&:hover': {
							boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
							transform: 'translateY(-4px)',
						},
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
									minWidth: { xs: '160px', sm: '200px' },
									minHeight: '48px',
									display: 'block',
									margin: '0 auto',
									marginTop: '1rem',
									fontSize: { xs: '0.9rem', sm: '1rem' },
									'&:active': {
										transform: 'scale(0.97)',
									},
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
