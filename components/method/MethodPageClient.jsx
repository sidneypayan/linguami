'use client'

import { useRouterCompat } from '@/hooks/useRouterCompat'
import { useTranslations, useLocale } from 'next-intl'
import {
	Container,
	Box,
	Typography,
	Grid,
	Card,
	CardContent,
	CardActions,
	Button,
	Chip,
	useTheme,
} from '@mui/material'
import {
	School,
	TrendingUp,
	EmojiEvents,
	CheckCircle,
	ArrowForward,
} from '@mui/icons-material'

const MethodPageClient = ({ levels, userAccess }) => {
	const router = useRouterCompat()
	const t = useTranslations('common')
	const locale = useLocale()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	// Check if user has access to a level
	const hasAccessToLevel = (levelId) => {
		// Check if level is free
		const level = levels.find((l) => l.id === levelId)
		if (level?.is_free) return true

		// Check paid access
		return userAccess.some((access) => access.level_id === levelId)
	}

	// Icons by level
	const levelIcons = {
		debutant: <School sx={{ fontSize: 48 }} />,
		intermediaire: <TrendingUp sx={{ fontSize: 48 }} />,
		avance: <EmojiEvents sx={{ fontSize: 48 }} />,
	}

	// Colors by level
	const levelColors = {
		debutant: {
			gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
			borderColor: isDark ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.3)',
		},
		intermediaire: {
			gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
			borderColor: isDark ? 'rgba(245, 158, 11, 0.5)' : 'rgba(245, 158, 11, 0.3)',
		},
		avance: {
			gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
			borderColor: isDark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)',
		},
	}

	const handleLevelClick = (level) => {
		router.push(`/${locale}/method/${level.slug}`)
	}

	return (
		<>
			{/* Hero Section */}
			<Box
				sx={{
					pt: { xs: '5rem', md: '6rem' },
					pb: { xs: '3rem', md: '4rem' },
					background: isDark
						? 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
						: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #e0e7ff 100%)',
				}}>
				<Container maxWidth="lg">
					<Box sx={{ textAlign: 'center', mb: 4 }}>
						<Typography
							variant="h1"
							sx={{
								fontWeight: 800,
								fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' },
								mb: 2,
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								letterSpacing: '-0.02em',
							}}>
							{t('methode_title')}
						</Typography>

						<Typography
							variant="h5"
							sx={{
								color: 'text.secondary',
								maxWidth: '700px',
								mx: 'auto',
								fontSize: { xs: '1.125rem', sm: '1.25rem' },
								lineHeight: 1.6,
							}}>
							{t('methode_subtitle')}
						</Typography>
					</Box>

					<Box
						sx={{
							display: 'flex',
							gap: 2,
							justifyContent: 'center',
							flexWrap: 'wrap',
							mb: 4,
						}}>
						<Chip
							icon={<School />}
							label={t('methode_proven_method')}
							sx={{ px: 2, py: 3 }}
						/>
						<Chip
							icon={<CheckCircle />}
							label={t('methode_interactive')}
							sx={{ px: 2, py: 3 }}
						/>
						<Chip
							icon={<EmojiEvents />}
							label={t('methode_flexible')}
							sx={{ px: 2, py: 3 }}
						/>
					</Box>
				</Container>
			</Box>

			{/* Levels Section */}
			<Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
				<Typography
					variant="h3"
					sx={{
						fontWeight: 700,
						mb: 1,
						textAlign: 'center',
					}}>
					{t('methode_cta')}
				</Typography>

				<Typography
					variant="body1"
					sx={{
						color: 'text.secondary',
						textAlign: 'center',
						mb: 5,
						maxWidth: '600px',
						mx: 'auto',
					}}>
					{t('methode_flexible_desc')}
				</Typography>

				<Grid container spacing={4}>
					{levels.map((level) => {
						const hasAccess = hasAccessToLevel(level.id)
						const colors = levelColors[level.slug] || levelColors.debutant
						const nameKey = `name_${locale}`
						const descKey = `description_${locale}`

						return (
							<Grid item xs={12} md={4} key={level.id}>
								<Card
									elevation={0}
									sx={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										borderRadius: 4,
										border: '2px solid',
										borderColor: colors.borderColor,
										transition: 'all 0.3s ease',
										position: 'relative',
										overflow: 'visible',
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: isDark
												? '0 20px 60px rgba(139, 92, 246, 0.3)'
												: '0 20px 60px rgba(0, 0, 0, 0.15)',
										},
									}}>
									<CardContent sx={{ flex: 1, pt: 4 }}>
										{/* Icon */}
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
												mb: 2,
												color: 'text.secondary',
											}}>
											{levelIcons[level.slug]}
										</Box>

										{/* Title */}
										<Typography
											variant="h4"
											sx={{
												fontWeight: 700,
												mb: 2,
												textAlign: 'center',
											}}>
											{level[nameKey]}
										</Typography>

										{/* Description */}
										<Typography
											variant="body2"
											sx={{
												color: 'text.secondary',
												textAlign: 'center',
												mb: 3,
												lineHeight: 1.7,
											}}>
											{level[descKey]}
										</Typography>
									</CardContent>

									<CardActions sx={{ p: 3, pt: 0 }}>
										<Button
											fullWidth
											variant="contained"
											size="large"
											endIcon={<ArrowForward />}
											onClick={() => handleLevelClick(level)}
											sx={{
												background: colors.gradient,
												py: 1.5,
												fontWeight: 600,
												fontSize: '1rem',
											}}>
											{t('methode_start')}
										</Button>
									</CardActions>
								</Card>
							</Grid>
						)
					})}
				</Grid>

				{/* Benefits */}
				<Box sx={{ mt: 8, textAlign: 'center' }}>
					<Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
						{t('methode_why_title')}
					</Typography>

					<Grid container spacing={4}>
						<Grid item xs={12} md={4}>
							<Box>
								<School sx={{ fontSize: 48, color: '#8b5cf6', mb: 2 }} />
								<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
									{t('methode_proven_method')}
								</Typography>
								<Typography variant="body2" sx={{ color: 'text.secondary' }}>
									{t('methode_proven_desc')}
								</Typography>
							</Box>
						</Grid>

						<Grid item xs={12} md={4}>
							<Box>
								<TrendingUp sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
								<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
									{t('methode_interactive')}
								</Typography>
								<Typography variant="body2" sx={{ color: 'text.secondary' }}>
									{t('methode_interactive_desc')}
								</Typography>
							</Box>
						</Grid>

						<Grid item xs={12} md={4}>
							<Box>
								<EmojiEvents sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
								<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
									{t('methode_flexible')}
								</Typography>
								<Typography variant="body2" sx={{ color: 'text.secondary' }}>
									{t('methode_flexible_desc')}
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</>
	)
}

export default MethodPageClient
