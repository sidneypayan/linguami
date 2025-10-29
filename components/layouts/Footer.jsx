import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { Box, Container, Stack, Typography, IconButton, Divider } from '@mui/material'
import { Facebook, Twitter, YouTube, Favorite, Email } from '@mui/icons-material'

const Footer = () => {
	const { t } = useTranslation('common')

	return (
		<Box
			component='footer'
			sx={{
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				color: 'white',
				mt: 'auto',
				py: { xs: 4, md: 6 },
				position: 'relative',
				overflow: 'hidden',
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
					pointerEvents: 'none',
				},
			}}>
			<Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1 }}>
				<Stack
					direction={{ xs: 'column', md: 'row' }}
					spacing={{ xs: 4, md: 8 }}
					justifyContent='space-between'
					alignItems={{ xs: 'center', md: 'flex-start' }}>

					{/* Section Logo & Description */}
					<Box sx={{ textAlign: { xs: 'center', md: 'left' }, flex: 1 }}>
						<Typography
							variant='h4'
							sx={{
								fontWeight: 800,
								mb: 2,
								background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								letterSpacing: '-0.5px',
							}}>
							Linguami
						</Typography>
						<Typography
							variant='body2'
							sx={{
								color: 'rgba(255, 255, 255, 0.9)',
								maxWidth: '300px',
								lineHeight: 1.7,
								mx: { xs: 'auto', md: 0 },
							}}>
							Apprendre les langues de manière immersive et amusante
						</Typography>
					</Box>

					{/* Section Liens */}
					<Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
						<Typography
							variant='h6'
							sx={{
								fontWeight: 700,
								mb: 2,
								color: 'rgba(255, 255, 255, 0.95)',
							}}>
							Liens utiles
						</Typography>
						<Stack spacing={1.5}>
							<Link
								href='https://paypal.me/linguami'
								target='_blank'
								style={{ textDecoration: 'none' }}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 1,
										color: 'rgba(255, 255, 255, 0.85)',
										transition: 'all 0.2s ease',
										justifyContent: { xs: 'center', md: 'flex-start' },
										'&:hover': {
											color: 'white',
											transform: 'translateX(4px)',
										},
									}}>
									<Favorite sx={{ fontSize: '1rem' }} />
									<Typography variant='body2' sx={{ fontWeight: 500 }}>
										{t('support')}
									</Typography>
								</Box>
							</Link>
							<Link
								href='mailto:contact@linguami.com?Subject=Contact%20from%20linguami'
								style={{ textDecoration: 'none' }}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 1,
										color: 'rgba(255, 255, 255, 0.85)',
										transition: 'all 0.2s ease',
										justifyContent: { xs: 'center', md: 'flex-start' },
										'&:hover': {
											color: 'white',
											transform: 'translateX(4px)',
										},
									}}>
									<Email sx={{ fontSize: '1rem' }} />
									<Typography variant='body2' sx={{ fontWeight: 500 }}>
										{t('contact')}
									</Typography>
								</Box>
							</Link>
						</Stack>
					</Box>

					{/* Section Réseaux Sociaux */}
					<Box sx={{ textAlign: 'center' }}>
						<Typography
							variant='h6'
							sx={{
								fontWeight: 700,
								mb: 2,
								color: 'rgba(255, 255, 255, 0.95)',
							}}>
							Suivez-nous
						</Typography>
						<Stack direction='row' spacing={1} justifyContent='center'>
							<Link href='https://www.facebook.com/linguami/' target='_blank'>
								<IconButton
									sx={{
										backgroundColor: 'rgba(255, 255, 255, 0.15)',
										color: 'white',
										backdropFilter: 'blur(10px)',
										border: '1px solid rgba(255, 255, 255, 0.2)',
										transition: 'all 0.3s ease',
										'&:hover': {
											backgroundColor: 'rgba(255, 255, 255, 0.25)',
											transform: 'translateY(-4px)',
											boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
										},
									}}>
									<Facebook />
								</IconButton>
							</Link>
							<Link href='https://twitter.com/linguami/' target='_blank'>
								<IconButton
									sx={{
										backgroundColor: 'rgba(255, 255, 255, 0.15)',
										color: 'white',
										backdropFilter: 'blur(10px)',
										border: '1px solid rgba(255, 255, 255, 0.2)',
										transition: 'all 0.3s ease',
										'&:hover': {
											backgroundColor: 'rgba(255, 255, 255, 0.25)',
											transform: 'translateY(-4px)',
											boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
										},
									}}>
									<Twitter />
								</IconButton>
							</Link>
							<Link
								href='https://www.youtube.com/channel/UCVtNeYVhksLsMqYmCCAFFIg/'
								target='_blank'>
								<IconButton
									sx={{
										backgroundColor: 'rgba(255, 255, 255, 0.15)',
										color: 'white',
										backdropFilter: 'blur(10px)',
										border: '1px solid rgba(255, 255, 255, 0.2)',
										transition: 'all 0.3s ease',
										'&:hover': {
											backgroundColor: 'rgba(255, 255, 255, 0.25)',
											transform: 'translateY(-4px)',
											boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
										},
									}}>
									<YouTube />
								</IconButton>
							</Link>
						</Stack>
					</Box>
				</Stack>

				<Divider
					sx={{
						my: 4,
						borderColor: 'rgba(255, 255, 255, 0.2)',
					}}
				/>

				{/* Copyright */}
				<Typography
					variant='body2'
					align='center'
					sx={{
						color: 'rgba(255, 255, 255, 0.8)',
						fontWeight: 500,
					}}>
					Copyright &copy; {new Date().getFullYear()} {t('allrights')}
				</Typography>
			</Container>
		</Box>
	)
}

export default Footer
