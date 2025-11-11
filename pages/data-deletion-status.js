import { Container, Box, Typography, useTheme } from '@mui/material'
import { CheckCircle, Info } from '@mui/icons-material'
import Head from 'next/head'
import { useRouter } from 'next/router'

const DataDeletionStatus = () => {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const router = useRouter()
	const { id } = router.query

	return (
		<>
			<Head>
				<title>Data Deletion Status | Linguami</title>
				<meta name="robots" content="noindex, nofollow" />
			</Head>

			<Box
				sx={{
					minHeight: '100vh',
					pt: { xs: '5rem', md: '6rem' },
					pb: 8,
					background: isDark
						? 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
						: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #e0e7ff 100%)',
				}}>
				<Container maxWidth="md">
					<Box
						sx={{
							textAlign: 'center',
							mb: 6,
						}}>
						<Box
							sx={{
								display: 'inline-flex',
								p: 2,
								borderRadius: 3,
								background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
								mb: 3,
							}}>
							<CheckCircle sx={{ fontSize: '3rem', color: '#10b981' }} />
						</Box>

						<Typography
							variant="h2"
							sx={{
								fontWeight: 800,
								fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
								mb: 2,
								background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
							}}>
							Data Deletion Completed
						</Typography>

						<Typography
							variant="body1"
							sx={{
								color: 'text.secondary',
								fontSize: '1.125rem',
								maxWidth: '600px',
								mx: 'auto',
								mb: 4,
							}}>
							Your data has been successfully deleted from Linguami
						</Typography>
					</Box>

					<Box
						sx={{
							mb: 4,
							p: 4,
							borderRadius: 3,
							background: isDark
								? 'rgba(16, 185, 129, 0.1)'
								: 'rgba(16, 185, 129, 0.05)',
							border: '1px solid',
							borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
						}}>
						<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
							What was deleted?
						</Typography>
						<Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
							Following your request via Facebook, we have permanently deleted all your personal data from our systems:
						</Typography>
						<Box component="ul" sx={{ pl: 3, lineHeight: 2 }}>
							<li>Your account information</li>
							<li>Personal dictionary and saved words</li>
							<li>Learning progress and statistics</li>
							<li>XP points and achievements</li>
							<li>Course progress</li>
							<li>All associated user data</li>
						</Box>
					</Box>

					{id && (
						<Box
							sx={{
								p: 3,
								borderRadius: 3,
								background: isDark ? 'rgba(30, 41, 59, 0.6)' : 'white',
								border: '1px solid',
								borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
								display: 'flex',
								gap: 2,
								alignItems: 'flex-start',
							}}>
							<Info sx={{ color: '#667eea', flexShrink: 0, mt: 0.5 }} />
							<Box>
								<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
									Deletion Reference
								</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
									{id}
								</Typography>
							</Box>
						</Box>
					)}

					<Box
						sx={{
							mt: 6,
							p: 3,
							borderRadius: 3,
							background: isDark ? 'rgba(30, 41, 59, 0.6)' : 'white',
							border: '1px solid',
							borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
						}}>
						<Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
							This deletion is permanent and cannot be undone. If you wish to use Linguami again in the future,
							you will need to create a new account.
						</Typography>
					</Box>

					<Box sx={{ mt: 4, textAlign: 'center' }}>
						<Typography variant="body2" color="text.secondary">
							If you have any questions about data deletion, please contact us at{' '}
							<strong>contact@linguami.com</strong>
						</Typography>
					</Box>
				</Container>
			</Box>
		</>
	)
}

export default DataDeletionStatus
