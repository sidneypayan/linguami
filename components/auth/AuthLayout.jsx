import { Box, Container, Card, useTheme } from '@mui/material'
import { LoginRounded } from '@mui/icons-material'
import { Link } from '@/i18n/navigation'

const AuthLayout = ({ children, icon }) => {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	return (
		<Box
			sx={{
				flex: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				overflow: 'hidden',
				padding: {
					xs: '0',
					md: '2rem 0 calc(80px + 2rem) 0',
				},
				mb: { xs: '0', md: '-80px' },
				background: isDark
					? 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
					: 'linear-gradient(145deg, #f8fafc 0%, #e0e7ff 50%, #ddd6fe 100%)',
				clipPath: {
					xs: 'polygon(0 0, 100% 0, 100% calc(100% - 40px), 0 100%)',
					md: 'polygon(0 0, 100% 0, 100% calc(100% - 80px), 0 100%)',
				},
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: isDark
						? 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)'
						: 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.12) 0%, transparent 50%)',
					pointerEvents: 'none',
				},
				'&::after': {
					content: '""',
					position: 'absolute',
					top: '20%',
					left: '10%',
					width: '500px',
					height: '500px',
					background: isDark
						? 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
						: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
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
			<Container
				maxWidth="sm"
				sx={{
					position: 'relative',
					zIndex: 1,
					px: { xs: 0, sm: 2 },
					py: { xs: 2, sm: 3 },
					mb: { xs: 0, sm: 0 }
				}}>
				<Card
					sx={{
						p: 0,
						borderRadius: { xs: 0, sm: 4 },
						boxShadow: isDark
							? {
								xs: 'none',
								sm: '0 24px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.2) inset'
							}
							: {
								xs: 'none',
								sm: '0 24px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
							},
						background: isDark
							? 'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
							: 'rgba(255, 255, 255, 0.98)',
						backdropFilter: 'blur(20px)',
						border: isDark
							? { xs: 'none !important', sm: '1px solid rgba(139, 92, 246, 0.3)' }
							: { xs: 'none !important', sm: 'initial' },
						outline: 'none',
						overflow: 'hidden',
					}}>
					{/* Section supérieure avec background de la page */}
					<Box
						sx={{
							bgcolor: 'background.default',
							pt: { xs: 2, sm: 3 },
							pb: { xs: 1.5, sm: 2 },
							borderRadius: { xs: 0, sm: '16px 16px 0 0' },
						}}>
						{/* Logo avec lien vers l'accueil */}
						<Link href="/">
							<Box
								sx={{
									display: { xs: 'none', sm: 'flex' },
									alignItems: 'center',
									justifyContent: 'center',
									textDecoration: 'none',
									cursor: 'pointer',
									transition: 'transform 0.3s ease',
									'&:hover': {
										transform: 'scale(1.05)',
									},
								}}>
							<Box
								sx={{
									width: { xs: 56, sm: 64 },
									height: { xs: 56, sm: 64 },
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
								{icon || <LoginRounded sx={{ fontSize: { xs: '2rem', sm: '2.25rem' }, color: 'white' }} />}
							</Box>
						</Box>
					</Link>
				</Box>

				{/* Contenu principal */}
				<Box sx={{ p: { xs: 3, sm: 5 }, pb: { xs: 5, sm: 7 } }}>
					{children}
				</Box>
			</Card>
			</Container>
		</Box>
	)
}

export default AuthLayout
