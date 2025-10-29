import useTranslation from 'next-translate/useTranslation'
import { Box, Button, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { primaryButton } from '../../utils/buttonStyles'

const Hero = () => {
	const { t, lang } = useTranslation('home')

	return (
		<Box
			sx={{
				position: 'relative',
				padding: {
					xs: '6rem 0 4rem 0',
					md: '8rem 0 6rem 0',
				},
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				overflow: 'hidden',
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 40%)',
					pointerEvents: 'none',
				},
			}}>
			<Stack
				direction='row'
				width={1440}
				maxWidth='100%'
				sx={{
					padding: { xs: '2rem', md: '3rem' },
					margin: '0 auto',
					justifyContent: {
						xs: 'center',
						lg: 'space-between',
					},
					textAlign: {
						xs: 'center',
						lg: 'left',
					},
					position: 'relative',
					zIndex: 1,
				}}>
				<Box maxWidth={825}>
					<Typography
						variant='h2'
						component='h1'
						mb={3}
						sx={{
							fontSize: { xs: '2.2rem', md: '3.75rem' },
							fontWeight: 800,
							lineHeight: 1.2,
							background: 'linear-gradient(135deg, #ffffff, #ffd700, #ff6b9d, #c471ed, #12c2e9, #ffffff)',
							backgroundSize: '400% 400%',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							animation: 'fadeInUp 0.6s ease-out, gradientShift 8s ease infinite',
							'@keyframes fadeInUp': {
								from: {
									opacity: 0,
									transform: 'translateY(20px)',
								},
								to: {
									opacity: 1,
									transform: 'translateY(0)',
								},
							},
							'@keyframes gradientShift': {
								'0%': {
									backgroundPosition: '0% 50%',
								},
								'50%': {
									backgroundPosition: '100% 50%',
								},
								'100%': {
									backgroundPosition: '0% 50%',
								},
							},
						}}>
						<span style={{ fontWeight: '500' }}>{t('hero')}</span> <br />
						{t('title')}
					</Typography>
					<Typography
						mb={5}
						variant='h5'
						sx={{
							fontSize: { xs: '1.2rem', md: '1.6rem' },
							fontWeight: 500,
							lineHeight: 1.6,
							color: '#ffffff',
							animation: 'fadeInUp 0.6s ease-out 0.2s both',
						}}>
						<Box component='span' sx={{ display: { xs: 'inline', md: 'none' } }}>
							{t('subtitleMobile')}
						</Box>
						<Box component='span' sx={{ display: { xs: 'none', md: 'inline' } }}>
							{t('subtitle')}
						</Box>
					</Typography>

					<Link href={`/materials`}>
						<Button
							align='center'
							size='large'
							variant='contained'
							sx={{
								background: 'rgba(255, 255, 255, 0.95)',
								color: '#667eea',
								fontWeight: 700,
								fontSize: '1.1rem',
								textTransform: 'none',
								px: 4,
								py: 1.5,
								borderRadius: 3,
								boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
								display: 'block',
								margin: { xs: '0 auto', lg: '0' },
								minWidth: '200px',
								transition: 'all 0.3s ease',
								animation: 'fadeInUp 0.6s ease-out 0.4s both',
								'&:hover': {
									background: 'white',
									transform: 'translateY(-4px)',
									boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
								},
								'&:active': {
									transform: 'translateY(-2px) scale(0.98)',
								},
							}}>
							{t('start')} →
						</Button>
					</Link>
				</Box>

				<Box
					sx={{
						display: {
							xs: 'none',
							lg: 'flex',
						},
						alignItems: 'center',
						justifyContent: 'center',
						position: 'relative',
						width: 280,
						height: 280,
						animation: 'float 3s ease-in-out infinite',
						'@keyframes float': {
							'0%, 100%': {
								transform: 'translateY(0px)',
							},
							'50%': {
								transform: 'translateY(-20px)',
							},
						},
					}}>
					<Box
						sx={{
							position: 'absolute',
							width: '100%',
							height: '100%',
							background: 'rgba(255, 255, 255, 0.1)',
							borderRadius: '50%',
							filter: 'blur(40px)',
						}}
					/>
					<Image
						src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/wizard.png`}
						alt='Linguami wizard mascot'
						fill
						style={{ objectFit: 'contain' }}
						priority
					/>
				</Box>
			</Stack>

			<div className='wave'>
				<svg
					data-name='Layer 1'
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 1200 120'
					preserveAspectRatio='none'>
					<path
						d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
						className='shape-fill'></path>
				</svg>
			</div>
		</Box>
	)
}

export default Hero
