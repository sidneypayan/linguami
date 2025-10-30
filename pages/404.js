import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import SEO from '../components/SEO'
import { Box, Container, Typography, Button } from '@mui/material'
import { HomeRounded, SearchOffRounded, ErrorOutlineRounded } from '@mui/icons-material'

export default function Custom404() {
	const { t, lang } = useTranslation('common')

	return (
		<>
			<SEO
				title={`${t('404Title')} | Linguami`}
				description={t('404Description')}
				path='/404'
				noindex={true}  // Page d'erreur, ne pas indexer
			/>
		<Box
			sx={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				overflow: 'hidden',
				py: { xs: 4, sm: 6 },
				'&::before': {
					content: '""',
					position: 'absolute',
					top: '-10%',
					right: '-10%',
					width: '60%',
					height: '60%',
					background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)',
					pointerEvents: 'none',
					filter: 'blur(40px)',
				},
				'&::after': {
					content: '""',
					position: 'absolute',
					bottom: '-10%',
					left: '-10%',
					width: '60%',
					height: '60%',
					background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 30%, transparent 70%)',
					pointerEvents: 'none',
					filter: 'blur(40px)',
				},
			}}>
			<Container maxWidth='md' sx={{ position: 'relative', zIndex: 1, mt: { xs: 8, sm: 10, md: 12 } }}>
				<Box
					sx={{
						textAlign: 'center',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 4,
					}}>
					{/* Illustration 404 avec icônes */}
					<Box
						sx={{
							position: 'relative',
							width: { xs: 280, sm: 380, md: 480 },
							height: { xs: 280, sm: 380, md: 480 },
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						{/* Cercle de fond animé */}
						<Box
							sx={{
								position: 'absolute',
								width: '100%',
								height: '100%',
								borderRadius: '50%',
								background: 'rgba(255, 255, 255, 0.15)',
								backdropFilter: 'blur(20px)',
								boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
								border: '3px solid rgba(255, 255, 255, 0.3)',
								animation: 'pulse 3s ease-in-out infinite',
								'@keyframes pulse': {
									'0%, 100%': {
										transform: 'scale(1)',
										opacity: 0.8,
									},
									'50%': {
										transform: 'scale(1.05)',
										opacity: 1,
									},
								},
							}}
						/>

						{/* Icône de recherche en arrière-plan */}
						<SearchOffRounded
							sx={{
								position: 'absolute',
								fontSize: { xs: '10rem', sm: '14rem', md: '18rem' },
								color: 'rgba(255, 255, 255, 0.25)',
								animation: 'float 6s ease-in-out infinite',
								'@keyframes float': {
									'0%, 100%': {
										transform: 'translateY(0) rotate(-10deg)',
									},
									'50%': {
										transform: 'translateY(-20px) rotate(-10deg)',
									},
								},
							}}
						/>

						{/* Texte 404 au centre */}
						<Typography
							variant='h1'
							sx={{
								position: 'relative',
								fontWeight: 900,
								fontSize: { xs: '5rem', sm: '7rem', md: '9rem' },
								background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								textShadow: '0 0 40px rgba(255, 255, 255, 0.5)',
								letterSpacing: '-0.05em',
								lineHeight: 1,
								filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4))',
							}}>
							404
						</Typography>

						{/* Icône d'erreur flottante */}
						<ErrorOutlineRounded
							sx={{
								position: 'absolute',
								top: { xs: '10%', md: '15%' },
								right: { xs: '5%', md: '10%' },
								fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
								color: 'rgba(255, 255, 255, 0.9)',
								filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
								animation: 'bounce 2s ease-in-out infinite',
								'@keyframes bounce': {
									'0%, 100%': {
										transform: 'translateY(0)',
									},
									'50%': {
										transform: 'translateY(-15px)',
									},
								},
							}}
						/>
					</Box>

					{/* Sous-titre */}
					<Box
						sx={{
							background: 'rgba(255, 255, 255, 0.15)',
							backdropFilter: 'blur(10px)',
							borderRadius: 3,
							py: 2,
							px: 4,
							border: '1px solid rgba(255, 255, 255, 0.3)',
							boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
						}}>
						<Typography
							variant='h4'
							sx={{
								fontWeight: 700,
								fontSize: { xs: '1.5rem', sm: '2rem' },
								color: 'white',
								textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
								mb: 1,
							}}>
							{t('404Title')}
						</Typography>

						<Typography
							variant='body1'
							sx={{
								fontSize: { xs: '1rem', sm: '1.125rem' },
								color: 'rgba(255, 255, 255, 0.9)',
								textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
							}}>
							{t('404Description')}
						</Typography>
					</Box>

					{/* Bouton retour */}
					<Link href='/' style={{ textDecoration: 'none' }}>
						<Button
							variant='contained'
							size='large'
							startIcon={<HomeRounded sx={{ fontSize: '1.5rem' }} />}
							sx={{
								py: 2,
								px: 5,
								borderRadius: 3,
								background: 'white',
								color: '#667eea',
								fontWeight: 700,
								fontSize: '1.125rem',
								textTransform: 'none',
								boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
								transition: 'all 0.3s ease',
								'&:hover': {
									background: 'white',
									transform: 'translateY(-4px) scale(1.02)',
									boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
								},
								'&:active': {
									transform: 'translateY(-2px) scale(1.01)',
								},
							}}>
							{t('backToHome')}
						</Button>
					</Link>
				</Box>
			</Container>
		</Box>
		</>
	)
}
