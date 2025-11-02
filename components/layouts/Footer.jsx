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
				background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #1e1b4b 100%)',
				color: 'white',
				mt: 'auto',
				position: 'relative',
				overflow: 'hidden',
				pt: { xs: '80px', md: '100px' },
				pb: { xs: 4, md: 6 },
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
					pointerEvents: 'none',
				},
			}}>
			{/* Modern diagonal separator at top */}
			<Box
				sx={{
					position: 'absolute',
					top: '-1px',
					left: 0,
					right: 0,
					height: { xs: '61px', md: '81px' },
					background: '#ffffff',
					clipPath: 'polygon(0 0, 100% 50%, 100% 0)',
					zIndex: 0,
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
						clipPath: 'inherit',
					},
				}}
			/>

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
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #a78bfa 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								letterSpacing: '-0.5px',
								filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))',
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
							{t('footerDescription')}
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
							{t('usefulLinks')}
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
										transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
										justifyContent: { xs: 'center', md: 'flex-start' },
										position: 'relative',
										'&:hover': {
											color: '#06b6d4',
											transform: 'translateX(6px)',
											filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))',
										},
										'&:hover .icon': {
											transform: 'scale(1.2) rotate(10deg)',
										},
									}}>
									<Favorite className='icon' sx={{ fontSize: '1rem', transition: 'all 0.3s ease' }} />
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
										transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
										justifyContent: { xs: 'center', md: 'flex-start' },
										position: 'relative',
										'&:hover': {
											color: '#8b5cf6',
											transform: 'translateX(6px)',
											filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))',
										},
										'&:hover .icon': {
											transform: 'scale(1.2) rotate(10deg)',
										},
									}}>
									<Email className='icon' sx={{ fontSize: '1rem', transition: 'all 0.3s ease' }} />
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
							{t('followUs')}
						</Typography>
						<Stack direction='row' spacing={1} justifyContent='center'>
							<Link href='https://www.facebook.com/linguami/' target='_blank'>
								<IconButton
									sx={{
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
										color: 'white',
										backdropFilter: 'blur(10px)',
										border: '1px solid rgba(139, 92, 246, 0.4)',
										position: 'relative',
										overflow: 'hidden',
										transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
										boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
										'&::before': {
											content: '""',
											position: 'absolute',
											top: 0,
											left: '-100%',
											width: '100%',
											height: '100%',
											background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
											transition: 'left 0.5s ease',
										},
										'&:hover': {
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(6, 182, 212, 0.4) 100%)',
											transform: 'translateY(-4px) scale(1.1)',
											boxShadow: '0 4px 20px rgba(139, 92, 246, 0.5), 0 0 30px rgba(6, 182, 212, 0.3)',
											'&::before': {
												left: '100%',
											},
										},
										'&:hover svg': {
											transform: 'rotate(360deg)',
										},
										'& svg': {
											transition: 'transform 0.6s ease',
										},
									}}>
									<Facebook />
								</IconButton>
							</Link>
							<Link href='https://twitter.com/linguami/' target='_blank'>
								<IconButton
									sx={{
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
										color: 'white',
										backdropFilter: 'blur(10px)',
										border: '1px solid rgba(139, 92, 246, 0.4)',
										position: 'relative',
										overflow: 'hidden',
										transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
										boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
										'&::before': {
											content: '""',
											position: 'absolute',
											top: 0,
											left: '-100%',
											width: '100%',
											height: '100%',
											background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
											transition: 'left 0.5s ease',
										},
										'&:hover': {
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(6, 182, 212, 0.4) 100%)',
											transform: 'translateY(-4px) scale(1.1)',
											boxShadow: '0 4px 20px rgba(139, 92, 246, 0.5), 0 0 30px rgba(6, 182, 212, 0.3)',
											'&::before': {
												left: '100%',
											},
										},
										'&:hover svg': {
											transform: 'rotate(360deg)',
										},
										'& svg': {
											transition: 'transform 0.6s ease',
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
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
										color: 'white',
										backdropFilter: 'blur(10px)',
										border: '1px solid rgba(139, 92, 246, 0.4)',
										position: 'relative',
										overflow: 'hidden',
										transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
										boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
										'&::before': {
											content: '""',
											position: 'absolute',
											top: 0,
											left: '-100%',
											width: '100%',
											height: '100%',
											background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
											transition: 'left 0.5s ease',
										},
										'&:hover': {
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(6, 182, 212, 0.4) 100%)',
											transform: 'translateY(-4px) scale(1.1)',
											boxShadow: '0 4px 20px rgba(139, 92, 246, 0.5), 0 0 30px rgba(6, 182, 212, 0.3)',
											'&::before': {
												left: '100%',
											},
										},
										'&:hover svg': {
											transform: 'rotate(360deg)',
										},
										'& svg': {
											transition: 'transform 0.6s ease',
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
						borderColor: 'rgba(139, 92, 246, 0.3)',
						boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)',
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
