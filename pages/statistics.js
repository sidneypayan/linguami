import { useState, useEffect } from 'react'
import {
	Box,
	Container,
	Typography,
	Paper,
	Grid,
	Card,
	CardContent,
	CircularProgress,
	alpha,
} from '@mui/material'
import {
	TrendingUp,
	LibraryBooks,
	CheckCircle,
	LocalLibrary,
	EmojiEvents,
	WaterDrop,
	LocalFireDepartment,
	Savings,
	Token,
} from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useUserContext } from '../context/user'

const StatisticsPage = () => {
	const { t } = useTranslation('stats')
	const { user } = useUserContext()
	const [loading, setLoading] = useState(true)
	const [stats, setStats] = useState(null)
	const [xpProfile, setXpProfile] = useState(null)
	const [goals, setGoals] = useState(null)

	useEffect(() => {
		if (user) {
			fetchStatistics()
		}
	}, [user])

	const fetchStatistics = async () => {
		setLoading(true)
		try {
			// Fetch regular statistics
			const statsResponse = await fetch('/api/statistics')
			const statsData = await statsResponse.json()
			console.log('📊 Stats data received:', statsData)
			setStats(statsData)

			// Fetch XP profile
			const xpResponse = await fetch('/api/xp/profile')
			const xpData = await xpResponse.json()
			console.log('💎 XP profile received:', xpData.profile)
			setXpProfile(xpData.profile)

			// Fetch goals
			const goalsResponse = await fetch('/api/goals')
			const goalsData = await goalsResponse.json()
			console.log('🎯 Goals received:', goalsData.goals)
			setGoals(goalsData.goals)
		} catch (error) {
			console.error('Error fetching statistics:', error)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<Layout>
				<SEO title={t('pageTitle')} description={t('pageDescription')} />
				<Box
					sx={{
						minHeight: '80vh',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<CircularProgress />
				</Box>
			</Layout>
		)
	}

	// Vocabulary cards
	const vocabularyCards = [
		{
			title: t('totalWordsInDictionary'),
			value: stats?.totalWords || 0,
			icon: <LocalLibrary />,
			color: '#667eea',
			gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		},
		{
			title: t('wordsAddedToday'),
			value: stats?.wordsAddedToday || 0,
			icon: <TrendingUp />,
			color: '#10B981',
			gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
		},
		{
			title: t('wordsAddedThisWeek'),
			value: stats?.wordsAddedThisWeek || 0,
			icon: <TrendingUp />,
			color: '#3B82F6',
			gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
		},
		{
			title: t('wordsAddedThisMonth'),
			value: stats?.wordsAddedThisMonth || 0,
			icon: <TrendingUp />,
			color: '#F59E0B',
			gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
		},
	]

	console.log('📚 Vocabulary cards:', vocabularyCards.map(c => ({ title: c.title, value: c.value })))

	// Calculate next streak milestone
	const getNextStreakMilestone = (currentStreak) => {
		const milestones = [7, 30, 60, 90, 180, 365]
		const nextMilestone = milestones.find(m => m > currentStreak)
		return nextMilestone || 365 // If beyond 365, keep showing 365
	}

	const streakMilestone = xpProfile ? getNextStreakMilestone(xpProfile.dailyStreak) : 7
	const daysRemaining = xpProfile ? streakMilestone - xpProfile.dailyStreak : 0

	// Materials cards
	const materialsCards = [
		{
			title: t('materialsStarted'),
			value: stats?.materialsStarted || 0,
			icon: <LibraryBooks />,
			color: '#3B82F6',
			gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
		},
		{
			title: t('materialsFinished'),
			value: stats?.materialsFinished || 0,
			icon: <CheckCircle />,
			color: '#10B981',
			gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
		},
		{
			title: t('wordsReviewedToday'),
			value: stats?.wordsReviewedToday || 0,
			icon: <TrendingUp />,
			color: '#F59E0B',
			gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
		},
	]

	return (
		<Layout>
			<SEO title={t('pageTitle')} description={t('pageDescription')} />

			<Container maxWidth="xl" sx={{ mt: { xs: 12, md: 14 }, pb: 8 }}>
				{/* XP Profile Card - Circular Design */}
				{xpProfile && (
					<Paper
						elevation={0}
						sx={{
							borderRadius: 4,
							p: 4,
							mb: 3,
							background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
							color: 'white',
							boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
							border: '1px solid rgba(226, 232, 240, 0.8)',
						}}>
						<Grid container spacing={4} alignItems="center" justifyContent="center">
							{/* Circular XP Progress */}
							<Grid item xs={12} sm={6} md={4}>
								<Box
									sx={{
										position: 'relative',
										display: 'inline-flex',
										flexDirection: 'column',
										alignItems: 'center',
										width: '100%',
									}}>
									<Box sx={{ position: 'relative', display: 'inline-flex' }}>
										{/* Background circle */}
										<Box
											sx={{
												width: 200,
												height: 200,
												borderRadius: '50%',
												background: 'linear-gradient(135deg, rgba(147, 197, 253, 0.5) 0%, rgba(96, 165, 250, 0.5) 100%)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												position: 'relative',
												overflow: 'hidden',
												border: '4px solid rgba(59, 130, 246, 0.5)',
											}}>
											{/* Simple water fill */}
											<Box
												sx={{
													position: 'absolute',
													bottom: 0,
													left: 0,
													right: 0,
													height: `${xpProfile.progressPercent}%`,
													background: '#60A5FA',
													transition: 'height 1.5s ease-out',
													'&::before': {
														content: '""',
														position: 'absolute',
														top: '-12px',
														left: '-10%',
														right: '-10%',
														height: '28px',
														background: 'linear-gradient(to bottom, rgba(96, 165, 250, 0.8), #60A5FA)',
														animation: 'wave1 7s ease-in-out infinite',
													},
													'&::after': {
														content: '""',
														position: 'absolute',
														top: '-10px',
														left: '-10%',
														right: '-10%',
														height: '26px',
														background: 'linear-gradient(to bottom, rgba(147, 197, 253, 0.5), rgba(96, 165, 250, 0.7))',
														animation: 'wave2 9s ease-in-out infinite',
													},
													'@keyframes wave1': {
														'0%, 100%': {
															borderRadius: '65% 35% 40% 60%',
															transform: 'translateX(0) translateY(0) scaleY(1)',
														},
														'33%': {
															borderRadius: '40% 60% 50% 50%',
															transform: 'translateX(6%) translateY(3px) scaleY(0.85)',
														},
														'66%': {
															borderRadius: '50% 50% 60% 40%',
															transform: 'translateX(-4%) translateY(2px) scaleY(0.88)',
														},
													},
													'@keyframes wave2': {
														'0%, 100%': {
															borderRadius: '45% 55% 48% 52%',
															transform: 'translateX(5%) translateY(1px) scaleY(0.95)',
														},
														'33%': {
															borderRadius: '58% 42% 55% 45%',
															transform: 'translateX(-3%) translateY(0) scaleY(1)',
														},
														'66%': {
															borderRadius: '42% 58% 45% 55%',
															transform: 'translateX(7%) translateY(2px) scaleY(0.87)',
														},
													},
												}}
											/>

											{/* Center content */}
											<Box sx={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
												<WaterDrop
													sx={{
														fontSize: '3rem',
														color: 'white',
														mb: 1,
													}}
												/>
												<Typography
													variant="h2"
													sx={{
														fontWeight: 800,
														lineHeight: 1,
														color: 'white',
													}}>
													{xpProfile.currentLevel}
												</Typography>
												<Typography
													variant="body2"
													sx={{
														opacity: 1,
														textTransform: 'uppercase',
														letterSpacing: 1,
														color: 'white',
														fontWeight: 600,
														textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
													}}>
													{t('level')}
												</Typography>
											</Box>
										</Box>
									</Box>
									<Box
										sx={{
											mt: 3,
											textAlign: 'center',
											background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.12) 100%)',
											borderRadius: 3,
											p: 2,
											border: '2px solid rgba(59, 130, 246, 0.4)',
											boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
										}}>
										<Typography
											variant="h5"
											sx={{
												fontWeight: 700,
												color: '#1E40AF',
												fontSize: { xs: '1.2rem', md: '1.5rem' },
											}}>
											{xpProfile.xpInCurrentLevel} / {xpProfile.xpForNextLevel} XP
										</Typography>
										<Typography
											variant="body1"
											sx={{
												mt: 0.5,
												fontWeight: 600,
												color: '#64748B',
											}}>
											{xpProfile.progressPercent}% {t('toNextLevel')}
										</Typography>
									</Box>
								</Box>
							</Grid>

							{/* Circular Streak */}
							<Grid item xs={12} sm={6} md={4}>
								<Box
									sx={{
										position: 'relative',
										display: 'inline-flex',
										flexDirection: 'column',
										alignItems: 'center',
										width: '100%',
									}}>
									<Box sx={{ position: 'relative', display: 'inline-flex' }}>
										{/* Background circle */}
										<Box
											sx={{
												width: 200,
												height: 200,
												borderRadius: '50%',
												background: 'linear-gradient(135deg, rgba(134, 239, 172, 0.5) 0%, rgba(74, 222, 128, 0.5) 100%)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												position: 'relative',
												overflow: 'hidden',
												border: '4px solid rgba(34, 197, 94, 0.5)',
											}}>
											{/* Forest and earth fill */}
											<Box
												sx={{
													position: 'absolute',
													bottom: 0,
													left: 0,
													right: 0,
													height: `${Math.min((xpProfile.dailyStreak / streakMilestone) * 100, 100)}%`,
													background: '#4ADE80',
													transition: 'height 1.5s ease-out',
													'&::before': {
														content: '""',
														position: 'absolute',
														top: '-12px',
														left: '-10%',
														right: '-10%',
														height: '28px',
														background: 'linear-gradient(to bottom, rgba(74, 222, 128, 0.8), #4ADE80)',
														animation: 'forestWave1 7s ease-in-out infinite',
													},
													'&::after': {
														content: '""',
														position: 'absolute',
														top: '-10px',
														left: '-10%',
														right: '-10%',
														height: '26px',
														background: 'linear-gradient(to bottom, rgba(134, 239, 172, 0.5), rgba(74, 222, 128, 0.7))',
														animation: 'forestWave2 9s ease-in-out infinite',
													},
													'@keyframes forestWave1': {
														'0%, 100%': {
															borderRadius: '65% 35% 40% 60%',
															transform: 'translateX(0) translateY(0) scaleY(1)',
														},
														'33%': {
															borderRadius: '40% 60% 50% 50%',
															transform: 'translateX(6%) translateY(3px) scaleY(0.85)',
														},
														'66%': {
															borderRadius: '50% 50% 60% 40%',
															transform: 'translateX(-4%) translateY(2px) scaleY(0.88)',
														},
													},
													'@keyframes forestWave2': {
														'0%, 100%': {
															borderRadius: '45% 55% 48% 52%',
															transform: 'translateX(5%) translateY(1px) scaleY(0.95)',
														},
														'33%': {
															borderRadius: '58% 42% 55% 45%',
															transform: 'translateX(-3%) translateY(0) scaleY(1)',
														},
														'66%': {
															borderRadius: '42% 58% 45% 55%',
															transform: 'translateX(7%) translateY(2px) scaleY(0.87)',
														},
													},
												}}
											/>

											{/* Center content */}
											<Box sx={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
												<LocalFireDepartment
													sx={{
														fontSize: '3rem',
														color: 'white',
														mb: 1,
													}}
												/>
												<Typography
													variant="h2"
													sx={{
														fontWeight: 800,
														lineHeight: 1,
														color: 'white',
													}}>
													{xpProfile.dailyStreak}
												</Typography>
												<Typography
													variant="body2"
													sx={{
														opacity: 1,
														textTransform: 'uppercase',
														letterSpacing: 1,
														color: 'white',
														fontWeight: 600,
														textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
													}}>
													{t('dayStreak')}
												</Typography>
											</Box>
										</Box>
									</Box>
									<Box
										sx={{
											mt: 3,
											textAlign: 'center',
											background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.08) 100%)',
											borderRadius: 3,
											p: 2,
											border: '2px solid rgba(34, 197, 94, 0.4)',
											boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)',
										}}>
										<Typography
											variant="h5"
											sx={{
												fontWeight: 700,
												color: '#15803D',
												fontSize: { xs: '1.2rem', md: '1.5rem' },
											}}>
											{xpProfile.dailyStreak} / {streakMilestone}
										</Typography>
										<Typography
											variant="body1"
											sx={{
												mt: 0.5,
												fontWeight: 600,
												color: '#64748B',
											}}>
											{daysRemaining > 0
												? `${t('streakGoal', { days: daysRemaining, target: streakMilestone })}`
												: t('milestoneReached')}
										</Typography>
									</Box>
								</Box>
							</Grid>

							{/* Gold Circle */}
							<Grid item xs={12} sm={6} md={4}>
								<Box
									sx={{
										position: 'relative',
										display: 'inline-flex',
										flexDirection: 'column',
										alignItems: 'center',
										width: '100%',
									}}>
									<Box sx={{ position: 'relative', display: 'inline-flex' }}>
										{/* Background circle */}
										<Box
											sx={{
												width: 200,
												height: 200,
												borderRadius: '50%',
												background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.5) 0%, rgba(245, 158, 11, 0.5) 100%)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												position: 'relative',
												overflow: 'hidden',
												border: '4px solid rgba(245, 158, 11, 0.6)',
											}}>
											{/* Simple gold fill - always filled since gold accumulates without levels */}
											<Box
												sx={{
													position: 'absolute',
													bottom: 0,
													left: 0,
													right: 0,
													height: '100%',
													background: '#FBBF24',
													transition: 'opacity 1.5s ease-out',
													'&::before': {
														content: '""',
														position: 'absolute',
														top: '-12px',
														left: '-10%',
														right: '-10%',
														height: '28px',
														background: 'linear-gradient(to bottom, rgba(251, 191, 36, 0.8), #FBBF24)',
														animation: 'goldWave1 7s ease-in-out infinite',
													},
													'&::after': {
														content: '""',
														position: 'absolute',
														top: '-10px',
														left: '-10%',
														right: '-10%',
														height: '26px',
														background: 'linear-gradient(to bottom, rgba(252, 211, 77, 0.5), rgba(251, 191, 36, 0.7))',
														animation: 'goldWave2 9s ease-in-out infinite',
													},
													'@keyframes goldWave1': {
														'0%, 100%': {
															borderRadius: '65% 35% 40% 60%',
															transform: 'translateX(0) translateY(0) scaleY(1)',
														},
														'33%': {
															borderRadius: '40% 60% 50% 50%',
															transform: 'translateX(6%) translateY(3px) scaleY(0.85)',
														},
														'66%': {
															borderRadius: '50% 50% 60% 40%',
															transform: 'translateX(-4%) translateY(2px) scaleY(0.88)',
														},
													},
													'@keyframes goldWave2': {
														'0%, 100%': {
															borderRadius: '45% 55% 48% 52%',
															transform: 'translateX(5%) translateY(1px) scaleY(0.95)',
														},
														'33%': {
															borderRadius: '58% 42% 55% 45%',
															transform: 'translateX(-3%) translateY(0) scaleY(1)',
														},
														'66%': {
															borderRadius: '42% 58% 45% 55%',
															transform: 'translateX(7%) translateY(2px) scaleY(0.87)',
														},
													},
												}}
											/>

											{/* Center content */}
											<Box sx={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
												<Token
													sx={{
														fontSize: '3rem',
														color: 'white',
														mb: 1,
													}}
												/>
												<Typography
													variant="h2"
													sx={{
														fontWeight: 800,
														lineHeight: 1,
														color: 'white',
													}}>
													{xpProfile.totalGold}
												</Typography>
												<Typography
													variant="body2"
													sx={{
														opacity: 1,
														textTransform: 'uppercase',
														letterSpacing: 1,
														color: 'white',
														fontWeight: 600,
														textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
													}}>
													{t('gold')}
												</Typography>
											</Box>
										</Box>
									</Box>
									<Box
										sx={{
											mt: 3,
											textAlign: 'center',
											background: 'linear-gradient(135deg, rgba(252, 211, 77, 0.12) 0%, rgba(245, 158, 11, 0.12) 100%)',
											borderRadius: 3,
											p: 2,
											border: '2px solid rgba(245, 158, 11, 0.4)',
											boxShadow: '0 2px 8px rgba(245, 158, 11, 0.1)',
										}}>
										<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
											<Typography
												variant="h5"
												sx={{
													fontWeight: 700,
													color: '#D97706',
													fontSize: { xs: '1.2rem', md: '1.5rem' },
												}}>
												{xpProfile.totalGold}
											</Typography>
											<Token sx={{ fontSize: '1.5rem', color: '#D97706' }} />
										</Box>
										<Typography
											variant="body1"
											sx={{
												mt: 0.5,
												fontWeight: 600,
												color: '#64748B',
											}}>
											{t('totalGoldCollected')}
										</Typography>
									</Box>
								</Box>
							</Grid>

							{/* Record Streak (optional) */}
							{xpProfile.longestStreak > xpProfile.dailyStreak && (
								<Grid item xs={12} sm={6} md={4}>
									<Box
										sx={{
											position: 'relative',
											display: 'inline-flex',
											flexDirection: 'column',
											alignItems: 'center',
											width: '100%',
										}}>
										<Box sx={{ position: 'relative', display: 'inline-flex' }}>
											<Box
												sx={{
													width: 200,
													height: 200,
													borderRadius: '50%',
													background: 'rgba(255, 255, 255, 0.15)',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													border: '3px dashed rgba(255, 255, 255, 0.4)',
												}}>
												<Box sx={{ textAlign: 'center' }}>
													<Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1 }}>
														{xpProfile.longestStreak}
													</Typography>
													<Typography variant="body2" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1 }}>
														{t('record')}
													</Typography>
												</Box>
											</Box>
										</Box>
										<Box
											sx={{
												mt: 3,
												textAlign: 'center',
												background: 'rgba(255, 255, 255, 0.2)',
												borderRadius: 3,
												p: 2,
												backdropFilter: 'blur(10px)',
												border: '1px solid rgba(255, 255, 255, 0.3)',
											}}>
											<Typography
												variant="h5"
												sx={{
													fontWeight: 700,
													color: 'white',
													textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
													fontSize: { xs: '1.2rem', md: '1.5rem' },
												}}>
												{t('bestStreak')}
											</Typography>
										</Box>
									</Box>
								</Grid>
							)}
						</Grid>
					</Paper>
				)}

				{/* Goals - Mini Circular Progress */}
				{goals && (
					<Paper
						elevation={0}
						sx={{
							borderRadius: 4,
							p: { xs: 3, md: 5 },
							mb: 4,
							background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%)',
							border: '1px solid rgba(102, 126, 234, 0.1)',
							boxShadow: '0 8px 32px rgba(102, 126, 234, 0.08)',
						}}>
						<Box
							sx={{
								textAlign: 'center',
								mb: 5,
							}}>
							<Typography
								variant="h4"
								sx={{
									fontWeight: 800,
									background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
									mb: 1,
									fontSize: { xs: '1.8rem', md: '2.2rem' },
									display: 'inline-flex',
									alignItems: 'center',
									gap: 2,
								}}>
								<EmojiEvents sx={{ fontSize: '2.5rem', color: '#F59E0B' }} />
								{t('goals') || 'Objectifs'}
							</Typography>
							<Typography
								variant="body1"
								sx={{
									color: '#64748B',
									fontWeight: 500,
									mt: 1,
								}}>
								Suivez vos objectifs quotidiens, hebdomadaires et mensuels
							</Typography>
						</Box>
						<Grid container spacing={4} justifyContent="center">
							{/* Daily Goal */}
							{goals.daily && (
								<Grid item xs={12} sm={4} md={4}>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
										}}>
										<Box sx={{ position: 'relative', display: 'inline-flex' }}>
											<svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
												<circle
													cx="70"
													cy="70"
													r="60"
													fill="none"
													stroke="#E2E8F0"
													strokeWidth="10"
												/>
												<circle
													cx="70"
													cy="70"
													r="60"
													fill="none"
													stroke="url(#gradientDaily)"
													strokeWidth="10"
													strokeDasharray={`${2 * Math.PI * 60}`}
													strokeDashoffset={`${2 * Math.PI * 60 * (1 - Math.min((goals.daily.current_xp / goals.daily.target_xp), 1))}`}
													strokeLinecap="round"
													style={{ transition: 'stroke-dashoffset 1s ease' }}
												/>
												<defs>
													<linearGradient id="gradientDaily" x1="0%" y1="0%" x2="100%" y2="100%">
														<stop offset="0%" stopColor="#667eea" />
														<stop offset="100%" stopColor="#764ba2" />
													</linearGradient>
												</defs>
											</svg>
											<Box
												sx={{
													position: 'absolute',
													top: '50%',
													left: '50%',
													transform: 'translate(-50%, -50%)',
													textAlign: 'center',
												}}>
												<Typography variant="h3" sx={{ fontWeight: 800, color: '#667eea', lineHeight: 1 }}>
													{Math.floor((goals.daily.current_xp / goals.daily.target_xp) * 100)}%
												</Typography>
											</Box>
										</Box>
										<Typography variant="h6" sx={{ fontWeight: 700, mt: 2, color: '#1E293B' }}>
											📅 {t('dailyGoal')}
										</Typography>
										<Typography variant="body1" sx={{ color: '#64748B', mt: 0.5 }}>
											{goals.daily.current_xp} / {goals.daily.target_xp} XP
										</Typography>
									</Box>
								</Grid>
							)}

							{/* Weekly Goal */}
							{goals.weekly && (
								<Grid item xs={12} sm={4} md={4}>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
										}}>
										<Box sx={{ position: 'relative', display: 'inline-flex' }}>
											<svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
												<circle
													cx="70"
													cy="70"
													r="60"
													fill="none"
													stroke="#E2E8F0"
													strokeWidth="10"
												/>
												<circle
													cx="70"
													cy="70"
													r="60"
													fill="none"
													stroke="url(#gradientWeekly)"
													strokeWidth="10"
													strokeDasharray={`${2 * Math.PI * 60}`}
													strokeDashoffset={`${2 * Math.PI * 60 * (1 - Math.min((goals.weekly.current_xp / goals.weekly.target_xp), 1))}`}
													strokeLinecap="round"
													style={{ transition: 'stroke-dashoffset 1s ease' }}
												/>
												<defs>
													<linearGradient id="gradientWeekly" x1="0%" y1="0%" x2="100%" y2="100%">
														<stop offset="0%" stopColor="#3B82F6" />
														<stop offset="100%" stopColor="#2563EB" />
													</linearGradient>
												</defs>
											</svg>
											<Box
												sx={{
													position: 'absolute',
													top: '50%',
													left: '50%',
													transform: 'translate(-50%, -50%)',
													textAlign: 'center',
												}}>
												<Typography variant="h3" sx={{ fontWeight: 800, color: '#3B82F6', lineHeight: 1 }}>
													{Math.floor((goals.weekly.current_xp / goals.weekly.target_xp) * 100)}%
												</Typography>
											</Box>
										</Box>
										<Typography variant="h6" sx={{ fontWeight: 700, mt: 2, color: '#1E293B' }}>
											📊 {t('weeklyGoal')}
										</Typography>
										<Typography variant="body1" sx={{ color: '#64748B', mt: 0.5 }}>
											{goals.weekly.current_xp} / {goals.weekly.target_xp} XP
										</Typography>
									</Box>
								</Grid>
							)}

							{/* Monthly Goal */}
							{goals.monthly && (
								<Grid item xs={12} sm={4} md={4}>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
										}}>
										<Box sx={{ position: 'relative', display: 'inline-flex' }}>
											<svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
												<circle
													cx="70"
													cy="70"
													r="60"
													fill="none"
													stroke="#E2E8F0"
													strokeWidth="10"
												/>
												<circle
													cx="70"
													cy="70"
													r="60"
													fill="none"
													stroke="url(#gradientMonthly)"
													strokeWidth="10"
													strokeDasharray={`${2 * Math.PI * 60}`}
													strokeDashoffset={`${2 * Math.PI * 60 * (1 - Math.min((goals.monthly.current_xp / goals.monthly.target_xp), 1))}`}
													strokeLinecap="round"
													style={{ transition: 'stroke-dashoffset 1s ease' }}
												/>
												<defs>
													<linearGradient id="gradientMonthly" x1="0%" y1="0%" x2="100%" y2="100%">
														<stop offset="0%" stopColor="#10B981" />
														<stop offset="100%" stopColor="#059669" />
													</linearGradient>
												</defs>
											</svg>
											<Box
												sx={{
													position: 'absolute',
													top: '50%',
													left: '50%',
													transform: 'translate(-50%, -50%)',
													textAlign: 'center',
												}}>
												<Typography variant="h3" sx={{ fontWeight: 800, color: '#10B981', lineHeight: 1 }}>
													{Math.floor((goals.monthly.current_xp / goals.monthly.target_xp) * 100)}%
												</Typography>
											</Box>
										</Box>
										<Typography variant="h6" sx={{ fontWeight: 700, mt: 2, color: '#1E293B' }}>
											📆 {t('monthlyGoal')}
										</Typography>
										<Typography variant="body1" sx={{ color: '#64748B', mt: 0.5 }}>
											{goals.monthly.current_xp} / {goals.monthly.target_xp} XP
										</Typography>
									</Box>
								</Grid>
							)}
						</Grid>
					</Paper>
				)}

				{/* Vocabulary Section */}
				<Box sx={{ mb: 6 }}>
					<Box
						sx={{
							mb: 4,
							pb: 2,
							borderBottom: '3px solid',
							borderImage: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%) 1',
						}}>
						<Typography
							variant="h4"
							sx={{
								fontWeight: 800,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								fontSize: { xs: '1.8rem', md: '2rem' },
								display: 'flex',
								alignItems: 'center',
								gap: 1.5,
							}}>
							<span style={{ fontSize: '2rem' }}>📚</span>
							{t('vocabularySection')}
						</Typography>
					</Box>
					<Grid container spacing={3} sx={{ mb: 4 }}>
						{vocabularyCards.map((card, index) => (
							<Grid item xs={12} sm={6} md={3} key={index}>
								<Card
									elevation={0}
									sx={{
										borderRadius: 4,
										overflow: 'hidden',
										position: 'relative',
										transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
										border: '2px solid transparent',
										background: 'white',
										boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
										'&:hover': {
											transform: 'translateY(-12px) scale(1.02)',
											boxShadow: `0 20px 40px ${alpha(card.color, 0.25)}`,
											border: `2px solid ${alpha(card.color, 0.3)}`,
											'& .card-icon': {
												transform: 'rotate(10deg) scale(1.1)',
											},
										},
									}}>
									<Box
										sx={{
											height: 8,
											background: card.gradient,
										}}
									/>
									<CardContent sx={{ p: 3.5 }}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												mb: 3,
											}}>
											<Box
												className="card-icon"
												sx={{
													width: 72,
													height: 72,
													borderRadius: 4,
													background: `linear-gradient(135deg, ${alpha(card.color, 0.15)} 0%, ${alpha(card.color, 0.05)} 100%)`,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: card.color,
													fontSize: '2rem',
													transition: 'all 0.3s ease',
													boxShadow: `0 8px 16px ${alpha(card.color, 0.15)}`,
												}}>
												{card.icon}
											</Box>
										</Box>
										<Typography
											variant='h3'
											sx={{
												fontWeight: 900,
												color: '#1E293B',
												mb: 1.5,
												textAlign: 'center',
												fontSize: '2.5rem',
											}}>
											{card.value}
										</Typography>
										<Typography
											variant='body2'
											sx={{
												color: '#64748B',
												fontWeight: 600,
												textAlign: 'center',
												lineHeight: 1.5,
											}}>
											{card.title}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Box>

				{/* Materials Section */}
				<Box sx={{ mb: 6 }}>
					<Box
						sx={{
							mb: 4,
							pb: 2,
							borderBottom: '3px solid',
							borderImage: 'linear-gradient(90deg, #3B82F6 0%, #10B981 100%) 1',
						}}>
						<Typography
							variant="h4"
							sx={{
								fontWeight: 800,
								background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								fontSize: { xs: '1.8rem', md: '2rem' },
								display: 'flex',
								alignItems: 'center',
								gap: 1.5,
							}}>
							<span style={{ fontSize: '2rem' }}>🎬</span>
							{t('materialsSection')}
						</Typography>
					</Box>
					<Grid container spacing={3} sx={{ mb: 4 }}>
						{materialsCards.map((card, index) => (
							<Grid item xs={12} sm={6} md={4} key={index}>
								<Card
									elevation={0}
									sx={{
										borderRadius: 4,
										overflow: 'hidden',
										position: 'relative',
										transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
										border: '2px solid transparent',
										background: 'white',
										boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
										'&:hover': {
											transform: 'translateY(-12px) scale(1.02)',
											boxShadow: `0 20px 40px ${alpha(card.color, 0.25)}`,
											border: `2px solid ${alpha(card.color, 0.3)}`,
											'& .card-icon': {
												transform: 'rotate(10deg) scale(1.1)',
											},
										},
									}}>
									<Box
										sx={{
											height: 8,
											background: card.gradient,
										}}
									/>
									<CardContent sx={{ p: 3.5 }}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												mb: 3,
											}}>
											<Box
												className="card-icon"
												sx={{
													width: 72,
													height: 72,
													borderRadius: 4,
													background: `linear-gradient(135deg, ${alpha(card.color, 0.15)} 0%, ${alpha(card.color, 0.05)} 100%)`,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: card.color,
													fontSize: '2rem',
													transition: 'all 0.3s ease',
													boxShadow: `0 8px 16px ${alpha(card.color, 0.15)}`,
												}}>
												{card.icon}
											</Box>
										</Box>
										<Typography
											variant='h3'
											sx={{
												fontWeight: 900,
												color: '#1E293B',
												mb: 1.5,
												textAlign: 'center',
												fontSize: '2.5rem',
											}}>
											{card.value}
										</Typography>
										<Typography
											variant='body2'
											sx={{
												color: '#64748B',
												fontWeight: 600,
												textAlign: 'center',
												lineHeight: 1.5,
											}}>
											{card.title}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Box>
			</Container>
		</Layout>
	)
}

export default StatisticsPage
