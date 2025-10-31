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
					xs: '7rem 0 5rem 0',
					md: '10rem 0 8rem 0',
				},
				background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
				overflow: 'hidden',
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)',
					pointerEvents: 'none',
				},
				'&::after': {
					content: '""',
					position: 'absolute',
					top: '20%',
					left: '10%',
					width: '500px',
					height: '500px',
					background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
					filter: 'blur(80px)',
					pointerEvents: 'none',
					animation: 'pulse 4s ease-in-out infinite',
				},
				'@keyframes pulse': {
					'0%, 100%': {
						opacity: 0.5,
						transform: 'scale(1)',
					},
					'50%': {
						opacity: 0.8,
						transform: 'scale(1.1)',
					},
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
					{/* Badge */}
					<Box
						sx={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 1,
							px: 3,
							py: 1,
							mb: 3,
							borderRadius: 50,
							background: 'rgba(139, 92, 246, 0.2)',
							border: '1px solid rgba(139, 92, 246, 0.3)',
							backdropFilter: 'blur(10px)',
							animation: 'fadeInUp 0.6s ease-out',
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
						}}>
						<Box
							sx={{
								width: 8,
								height: 8,
								borderRadius: '50%',
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)',
							}}
						/>
						<Typography
							sx={{
								fontSize: '0.9rem',
								fontWeight: 600,
								color: 'rgba(255, 255, 255, 0.95)',
							}}>
							Plateforme d&apos;apprentissage interactive
						</Typography>
					</Box>

					<Typography
						variant='h2'
						component='h1'
						mb={3}
						sx={{
							fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
							fontWeight: 800,
							lineHeight: 1.15,
							background: 'linear-gradient(135deg, #ffffff 0%, #8b5cf6 50%, #06b6d4 100%)',
							backgroundSize: '200% 200%',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							animation: 'fadeInUp 0.6s ease-out 0.1s both, gradientShift 8s ease infinite',
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
						<Box component='span' sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
							{t('hero')}
						</Box>
						{t('title')}
					</Typography>

					<Typography
						mb={5}
						variant='h5'
						sx={{
							fontSize: { xs: '1.125rem', md: '1.5rem' },
							fontWeight: 500,
							lineHeight: 1.7,
							color: 'rgba(255, 255, 255, 0.85)',
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
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								color: 'white',
								fontWeight: 700,
								fontSize: { xs: '1rem', md: '1.125rem' },
								textTransform: 'none',
								px: { xs: 4, md: 5 },
								py: { xs: 1.75, md: 2 },
								borderRadius: 3,
								boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.3)',
								border: '1px solid rgba(139, 92, 246, 0.5)',
								display: 'block',
								margin: { xs: '0 auto', lg: '0' },
								minWidth: { xs: '200px', md: '220px' },
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								animation: 'fadeInUp 0.6s ease-out 0.4s both',
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
									transform: 'translateY(-4px) scale(1.02)',
									boxShadow: '0 12px 40px rgba(139, 92, 246, 0.6), 0 0 30px rgba(6, 182, 212, 0.4)',
									'&::before': {
										left: '100%',
									},
								},
								'&:active': {
									transform: 'translateY(-2px) scale(1)',
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
						width: 320,
						height: 320,
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
					{/* Cercles de fond animés */}
					<Box
						sx={{
							position: 'absolute',
							width: '120%',
							height: '120%',
							background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
							borderRadius: '50%',
							filter: 'blur(60px)',
							animation: 'pulse 3s ease-in-out infinite',
							'@keyframes pulse': {
								'0%, 100%': {
									opacity: 0.5,
									transform: 'scale(1)',
								},
								'50%': {
									opacity: 0.8,
									transform: 'scale(1.1)',
								},
							},
						}}
					/>
					<Box
						sx={{
							position: 'absolute',
							width: '100%',
							height: '100%',
							borderRadius: '50%',
							background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
							border: '2px solid rgba(139, 92, 246, 0.3)',
							boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), inset 0 0 40px rgba(6, 182, 212, 0.2)',
							animation: 'rotate 20s linear infinite',
							'@keyframes rotate': {
								'0%': {
									transform: 'rotate(0deg)',
								},
								'100%': {
									transform: 'rotate(360deg)',
								},
							},
						}}
					/>
					<Image
						src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/wizard.png`}
						alt='Linguami wizard mascot'
						fill
						style={{
							objectFit: 'contain',
							filter: 'drop-shadow(0 10px 30px rgba(139, 92, 246, 0.4))',
						}}
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
