import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import useTranslation from 'next-translate/useTranslation'
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
	LinearProgress,
} from '@mui/material'
import {
	School,
	TrendingUp,
	EmojiEvents,
	Lock,
	CheckCircle,
	ArrowForward,
} from '@mui/icons-material'
import SEO from '@/components/SEO'
import LoadingSpinner from '@/components/LoadingSpinner'
import { getLevels, getUserAccess } from '@/features/courses/coursesSlice'
import { useUserContext } from '@/context/user'

const MethodePage = () => {
	const router = useRouter()
	const { t, lang } = useTranslation('common')
	const dispatch = useDispatch()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const { isUserLoggedIn } = useUserContext()

	// Redux state
	const { levels, levels_loading, userAccess, userAccess_loading } = useSelector(
		(state) => state.courses
	)

	useEffect(() => {
		dispatch(getLevels())
		if (isUserLoggedIn) {
			dispatch(getUserAccess(lang))
		}
	}, [dispatch, isUserLoggedIn, lang])


	// Vérifier si l'utilisateur a accès à un niveau
	const hasAccessToLevel = (levelId) => {
		// Niveau débutant gratuit
		const level = levels.find((l) => l.id === levelId)
		if (level?.is_free) return true

		// Vérifier l'accès payant
		return userAccess.some((access) => access.level_id === levelId)
	}

	// Icônes par niveau
	const levelIcons = {
		debutant: <School sx={{ fontSize: 48 }} />,
		intermediaire: <TrendingUp sx={{ fontSize: 48 }} />,
		avance: <EmojiEvents sx={{ fontSize: 48 }} />,
	}

	// Couleurs par niveau
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
		// Option A: Direct navigation to level's lessons (single course per level)
		router.push(`/method/${level.slug}`)
	}

	if (levels_loading || userAccess_loading) {
		return <LoadingSpinner />
	}

	return (
		<>
			<SEO
				title={`${t('methode_title')} | ${t('siteName')}`}
				description={t('methode_description')}
				path="/method"
			/>

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

			{/* Niveaux Section */}
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
						const nameKey = `name_${lang}`
						const descKey = `description_${lang}`

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
										{/* Icône */}
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
												mb: 2,
												color: 'text.secondary',
											}}>
											{levelIcons[level.slug]}
										</Box>

										{/* Titre */}
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

				{/* Avantages */}
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

export default MethodePage
