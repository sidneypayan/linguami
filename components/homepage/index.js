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
						mb: 2,
						background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 50%, #06b6d4 100%)',
						backgroundSize: '200% 200%',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
					}}>
					{t('multimedia')}
				</Typography>

				<Typography
					variant='subtitle1'
					align='center'
					sx={{
						color: '#64748b',
						fontSize: { xs: '1rem', md: '1.125rem' },
						mb: 6,
						maxWidth: '600px',
						mx: 'auto',
						fontWeight: 500,
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
										background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
										border: '1px solid rgba(139, 92, 246, 0.2)',
										boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
										transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
										cursor: 'pointer',
										position: 'relative',
										overflow: 'hidden',
										'&::before': {
											content: '""',
											position: 'absolute',
											top: 0,
											left: '-100%',
											width: '100%',
											height: '100%',
											background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
											transition: 'left 0.5s ease',
										},
										'&:hover': {
											transform: 'translateY(-8px) scale(1.02)',
											boxShadow: '0 12px 40px rgba(139, 92, 246, 0.25), 0 0 20px rgba(6, 182, 212, 0.15)',
											borderColor: 'rgba(139, 92, 246, 0.4)',
											'&::before': {
												left: '100%',
											},
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
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
											border: '1px solid rgba(139, 92, 246, 0.25)',
											boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)',
											p: 2,
											transition: 'all 0.3s ease',
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
												color: '#1e1b4b',
												mb: 0.5,
											}}>
											{icon.title}
										</Typography>
										<Typography
											variant='body2'
											sx={{
												color: '#64748b',
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
						boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
						padding: { xs: '2.5rem', md: '4rem' },
						borderRadius: 5,
						gap: '2rem',
						margin: '0 auto',
						marginTop: { xs: '3rem', md: '5rem' },
						background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
						border: '1px solid rgba(139, 92, 246, 0.2)',
						position: 'relative',
						overflow: 'hidden',
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: '-100%',
							width: '100%',
							height: '100%',
							background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.08), transparent)',
							transition: 'left 0.5s ease',
						},
						'&:hover': {
							boxShadow: '0 12px 40px rgba(139, 92, 246, 0.25), 0 0 20px rgba(6, 182, 212, 0.15)',
							transform: 'translateY(-4px) scale(1.01)',
							'&::before': {
								left: '100%',
							},
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
							position: 'relative',
							zIndex: 1,
						}}>
						<Box
							component='img'
							src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/translator.png`}
							alt='translator'
							width={175}
							height={175}
							sx={{
								filter: 'drop-shadow(0 4px 12px rgba(139, 92, 246, 0.2))',
							}}
						/>
					</Box>

					<Stack gap='1rem' sx={{ position: 'relative', zIndex: 1 }}>
						<Typography
							variant='h4'
							align='center'
							sx={{
								fontSize: { xs: '1.75rem', md: '2.125rem' },
								fontWeight: 700,
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							{t('translator')}
						</Typography>
						<Typography
							variant='subtitle1'
							align='center'
							sx={{
								color: '#64748b',
								fontWeight: 500,
								lineHeight: 1.7,
								fontSize: { xs: '0.95rem', md: '1rem' },
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
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3), 0 0 15px rgba(6, 182, 212, 0.2)',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								position: 'relative',
								overflow: 'hidden',
								'&::before': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: '-100%',
									width: '100%',
									height: '100%',
									background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
									transition: 'left 0.5s ease',
								},
								'&:hover': {
									background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
									transform: 'translateY(-4px) scale(1.05)',
									boxShadow: '0 8px 40px rgba(139, 92, 246, 0.5), 0 0 30px rgba(6, 182, 212, 0.4)',
									'&::before': {
										left: '100%',
									},
								},
								'&:active': {
									transform: 'translateY(-2px) scale(1.02)',
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
						boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
						padding: { xs: '2.5rem', md: '4rem' },
						borderRadius: 5,
						gap: '2rem',
						margin: '0 auto',
						marginTop: { xs: '3rem', md: '5rem' },
						background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
						border: '1px solid rgba(139, 92, 246, 0.2)',
						position: 'relative',
						overflow: 'hidden',
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: '-100%',
							width: '100%',
							height: '100%',
							background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.08), transparent)',
							transition: 'left 0.5s ease',
						},
						'&:hover': {
							boxShadow: '0 12px 40px rgba(139, 92, 246, 0.25), 0 0 20px rgba(6, 182, 212, 0.15)',
							transform: 'translateY(-4px) scale(1.01)',
							'&::before': {
								left: '100%',
							},
						},
					}}>
					<Stack gap='1rem' sx={{ position: 'relative', zIndex: 1 }}>
						<Typography
							variant='h4'
							align='center'
							sx={{
								fontSize: { xs: '1.75rem', md: '2.125rem' },
								fontWeight: 700,
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							{t('dictionary')}
						</Typography>
						<Typography
							variant='subtitle1'
							align='center'
							sx={{
								color: '#64748b',
								fontWeight: 500,
								lineHeight: 1.7,
								fontSize: { xs: '0.95rem', md: '1rem' },
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
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3), 0 0 15px rgba(6, 182, 212, 0.2)',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								position: 'relative',
								overflow: 'hidden',
								'&::before': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: '-100%',
									width: '100%',
									height: '100%',
									background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
									transition: 'left 0.5s ease',
								},
								'&:hover': {
									background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
									transform: 'translateY(-4px) scale(1.05)',
									boxShadow: '0 8px 40px rgba(139, 92, 246, 0.5), 0 0 30px rgba(6, 182, 212, 0.4)',
									'&::before': {
										left: '100%',
									},
								},
								'&:active': {
									transform: 'translateY(-2px) scale(1.02)',
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
							position: 'relative',
							zIndex: 1,
						}}>
						<Box
							component='img'
							src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/dictionary.png`}
							alt='dictionary'
							width={175}
							height={175}
							sx={{
								filter: 'drop-shadow(0 4px 12px rgba(139, 92, 246, 0.2))',
							}}
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
						boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
						padding: { xs: '2.5rem', md: '4rem' },
						borderRadius: 5,
						gap: '2rem',
						margin: '0 auto',
						marginTop: { xs: '3rem', md: '5rem' },
						background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
						border: '1px solid rgba(139, 92, 246, 0.2)',
						position: 'relative',
						overflow: 'hidden',
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: '-100%',
							width: '100%',
							height: '100%',
							background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.08), transparent)',
							transition: 'left 0.5s ease',
						},
						'&:hover': {
							boxShadow: '0 12px 40px rgba(139, 92, 246, 0.25), 0 0 20px rgba(6, 182, 212, 0.15)',
							transform: 'translateY(-4px) scale(1.01)',
							'&::before': {
								left: '100%',
							},
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
							position: 'relative',
							zIndex: 1,
						}}>
						<Box
							component='img'
							src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/flashcards.png`}
							alt='flashcards'
							width={175}
							height={175}
							sx={{
								filter: 'drop-shadow(0 4px 12px rgba(139, 92, 246, 0.2))',
							}}
						/>
					</Box>

					<Stack gap='1rem' sx={{ position: 'relative', zIndex: 1 }}>
						<Typography
							variant='h4'
							align='center'
							sx={{
								fontSize: { xs: '1.75rem', md: '2.125rem' },
								fontWeight: 700,
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							{t('flashcards')}
						</Typography>
						<Typography
							variant='subtitle1'
							align='center'
							sx={{
								color: '#64748b',
								fontWeight: 500,
								lineHeight: 1.7,
								fontSize: { xs: '0.95rem', md: '1rem' },
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
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3), 0 0 15px rgba(6, 182, 212, 0.2)',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								position: 'relative',
								overflow: 'hidden',
								'&::before': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: '-100%',
									width: '100%',
									height: '100%',
									background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
									transition: 'left 0.5s ease',
								},
								'&:hover': {
									background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
									transform: 'translateY(-4px) scale(1.05)',
									boxShadow: '0 8px 40px rgba(139, 92, 246, 0.5), 0 0 30px rgba(6, 182, 212, 0.4)',
									'&::before': {
										left: '100%',
									},
								},
								'&:active': {
									transform: 'translateY(-2px) scale(1.02)',
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
						boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
						padding: { xs: '2.5rem', md: '4rem' },
						borderRadius: 5,
						gap: '2rem',
						margin: '0 auto',
						marginTop: { xs: '3rem', md: '5rem' },
						background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
						border: '1px solid rgba(139, 92, 246, 0.2)',
						position: 'relative',
						overflow: 'hidden',
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: '-100%',
							width: '100%',
							height: '100%',
							background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.08), transparent)',
							transition: 'left 0.5s ease',
						},
						'&:hover': {
							boxShadow: '0 12px 40px rgba(139, 92, 246, 0.25), 0 0 20px rgba(6, 182, 212, 0.15)',
							transform: 'translateY(-4px) scale(1.01)',
							'&::before': {
								left: '100%',
							},
						},
					}}>
					<Stack gap='1rem' sx={{ position: 'relative', zIndex: 1 }}>
						<Typography
							variant='h4'
							align='center'
							sx={{
								fontSize: { xs: '1.75rem', md: '2.125rem' },
								fontWeight: 700,
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							{t('teacher')}
						</Typography>
						<Typography
							variant='subtitle1'
							align='center'
							sx={{
								color: '#64748b',
								fontWeight: 500,
								lineHeight: 1.7,
								fontSize: { xs: '0.95rem', md: '1rem' },
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
									background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
									boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3), 0 0 15px rgba(6, 182, 212, 0.2)',
									transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
									position: 'relative',
									overflow: 'hidden',
									'&::before': {
										content: '""',
										position: 'absolute',
										top: 0,
										left: '-100%',
										width: '100%',
										height: '100%',
										background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
										transition: 'left 0.5s ease',
									},
									'&:hover': {
										background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
										transform: 'translateY(-4px) scale(1.05)',
										boxShadow: '0 8px 40px rgba(139, 92, 246, 0.5), 0 0 30px rgba(6, 182, 212, 0.4)',
										'&::before': {
											left: '100%',
										},
									},
									'&:active': {
										transform: 'translateY(-2px) scale(1.02)',
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
							position: 'relative',
							zIndex: 1,
						}}>
						<Box
							component='img'
							src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/teacher.png`}
							alt='teacher'
							width={175}
							height={175}
							sx={{
								filter: 'drop-shadow(0 4px 12px rgba(139, 92, 246, 0.2))',
							}}
						/>
					</Box>
				</Stack>
			</Container>
		</>
	)
}

export default Homepage
