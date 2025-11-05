import { Box, Container, Card } from '@mui/material'
import { HomeRounded } from '@mui/icons-material'
import Link from 'next/link'

const AuthLayout = ({ children }) => {
	return (
		<Box
			sx={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				overflow: 'hidden',
				py: { xs: 0, sm: 6 },
				// Effet de fond avec cercles floutés
				'&::before': {
					content: '""',
					position: 'absolute',
					top: '-10%',
					right: '-10%',
					width: '60%',
					height: '60%',
					background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)',
					pointerEvents: 'none',
					filter: 'blur(60px)',
					animation: 'float 20s ease-in-out infinite',
				},
				'&::after': {
					content: '""',
					position: 'absolute',
					bottom: '-10%',
					left: '-10%',
					width: '60%',
					height: '60%',
					background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 30%, transparent 70%)',
					pointerEvents: 'none',
					filter: 'blur(60px)',
					animation: 'float 25s ease-in-out infinite reverse',
				},
				'@keyframes float': {
					'0%, 100%': {
						transform: 'translate(0, 0) scale(1)',
					},
					'50%': {
						transform: 'translate(-20px, 20px) scale(1.1)',
					},
				},
			}}>
			<Container
				maxWidth="sm"
				sx={{
					position: 'relative',
					zIndex: 1,
					px: { xs: 0, sm: 2 },
					py: { xs: 0, sm: 0 },
					mb: { xs: 0, sm: 0 }
				}}>
				<Card
					sx={{
						p: { xs: 3, sm: 5 },
						borderRadius: { xs: 0, sm: 4 },
						boxShadow: {
							xs: 'none',
							sm: '0 24px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
						},
						background: 'rgba(255, 255, 255, 0.98)',
						backdropFilter: 'blur(20px)',
						border: { xs: 'none !important', sm: 'initial' },
						outline: 'none',
						minHeight: { xs: '100vh', sm: 'auto' },
					}}>
					{/* Logo avec lien vers l'accueil */}
					<Link href="/">
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								mb: 3,
								textDecoration: 'none',
								cursor: 'pointer',
								transition: 'transform 0.3s ease',
								'&:hover': {
									transform: 'scale(1.05)',
								},
							}}>
							<Box
								sx={{
									width: 64,
									height: 64,
									borderRadius: 3,
									background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
									position: 'relative',
									'&::before': {
										content: '""',
										position: 'absolute',
										inset: 0,
										borderRadius: 3,
										padding: '2px',
										background: 'linear-gradient(135deg, rgba(255,255,255,0.3), transparent)',
										WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
										WebkitMaskComposite: 'xor',
										maskComposite: 'exclude',
									},
								}}>
								<HomeRounded sx={{ fontSize: '2.25rem', color: 'white' }} />
							</Box>
						</Box>
					</Link>

					{/* Contenu */}
					{children}
				</Card>
			</Container>
		</Box>
	)
}

export default AuthLayout
