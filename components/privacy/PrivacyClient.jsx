'use client'

import { Container, Box, Typography, useTheme } from '@mui/material'
import { Shield } from '@mui/icons-material'
import { Link } from '@/i18n/navigation'

export default function PrivacyClient({ translations, formattedDate, sections }) {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	return (
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
				{/* Header */}
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
							background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
							mb: 3,
						}}>
						<Shield sx={{ fontSize: '3rem', color: '#667eea' }} />
					</Box>

					<Typography
						variant="h2"
						sx={{
							fontWeight: 800,
							fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
							mb: 2,
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}>
						{translations.title}
					</Typography>

					<Typography
						variant="body1"
						sx={{
							color: 'text.secondary',
							fontSize: '1.125rem',
							maxWidth: '600px',
							mx: 'auto',
						}}>
						{translations.subtitle}
					</Typography>

					<Typography
						variant="caption"
						sx={{
							display: 'block',
							color: 'text.secondary',
							mt: 2,
							fontSize: '0.875rem',
						}}>
						{translations.last_updated} {formattedDate}
					</Typography>
				</Box>

				{/* Introduction */}
				<Box
					sx={{
						mb: 6,
						p: 4,
						borderRadius: 3,
						background: isDark
							? 'rgba(139, 92, 246, 0.1)'
							: 'rgba(102, 126, 234, 0.05)',
						border: '1px solid',
						borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(102, 126, 234, 0.2)',
					}}>
					<Typography
						variant="body1"
						sx={{ lineHeight: 1.8 }}
						dangerouslySetInnerHTML={{ __html: translations.intro }}
					/>
				</Box>

				{/* Sections */}
				{sections.map((section, index) => (
					<Box
						key={index}
						sx={{
							mb: 5,
							p: 4,
							borderRadius: 3,
							background: isDark ? 'rgba(30, 41, 59, 0.6)' : 'white',
							border: '1px solid',
							borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
							transition: 'all 0.3s ease',
							'&:hover': {
								transform: 'translateY(-2px)',
								boxShadow: isDark
									? '0 8px 24px rgba(139, 92, 246, 0.2)'
									: '0 8px 24px rgba(0, 0, 0, 0.08)',
							},
						}}>
						<Typography
							variant="h5"
							sx={{
								fontWeight: 700,
								mb: 2,
								color: '#667eea',
								fontSize: { xs: '1.25rem', sm: '1.5rem' },
							}}>
							{section.title}
						</Typography>
						<Typography
							variant="body1"
							sx={{
								lineHeight: 1.8,
								whiteSpace: 'pre-line',
								color: 'text.primary',
							}}>
							{section.content}
						</Typography>
					</Box>
				))}

				{/* Footer CTA */}
				<Box
					sx={{
						mt: 8,
						p: 4,
						borderRadius: 3,
						textAlign: 'center',
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						color: 'white',
					}}>
					<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
						{translations.cta_title}
					</Typography>
					<Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
						{translations.cta_subtitle}
					</Typography>
					<Link href="mailto:contact@linguami.com" style={{ textDecoration: 'none' }}>
						<Typography
							sx={{
								color: 'white',
								fontWeight: 600,
								fontSize: '1.125rem',
								textDecoration: 'underline',
								'&:hover': {
									opacity: 0.8,
								},
							}}>
							contact@linguami.com
						</Typography>
					</Link>
				</Box>

				{/* Link to Terms */}
				<Box sx={{ mt: 4, textAlign: 'center' }}>
					<Link href="/terms" style={{ textDecoration: 'none' }}>
						<Typography
							sx={{
								color: '#667eea',
								fontWeight: 600,
								'&:hover': {
									textDecoration: 'underline',
								},
							}}>
							{translations.footer_link}
						</Typography>
					</Link>
				</Box>
			</Container>
		</Box>
	)
}
