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
	Lock,
	WaterDrop,
} from '@mui/icons-material'
import {
	FaTrophy,
	FaFire,
	FaBook,
	FaStar,
	FaWater,
	FaCoins,
	FaRedo,
	FaVideo,
	FaChartLine,
	FaCheckCircle,
	FaSeedling,
	FaLeaf,
	FaTree,
	FaCampground,
	FaHotjar,
	FaBookOpen,
	FaBookReader,
	FaUniversity,
	FaSync,
	FaSyncAlt,
	FaRedoAlt,
	FaFilm,
	FaMedal,
	FaAward,
	FaCrown,
	FaGem,
	FaFeatherAlt,
	FaMountain,
	FaBurn,
	FaSun,
	FaBolt,
	FaGlobe,
	FaGraduationCap,
	FaLandmark,
	FaExchangeAlt,
	FaHistory,
	FaTheaterMasks,
	FaCamera,
	FaCameraRetro,
	FaPhotoVideo,
	FaCircle,
	FaDotCircle,
	FaRing,
	FaHeart,
	FaShieldAlt,
	FaSnowflake,
	FaTint,
	FaUmbrella,
	FaCloudShowersHeavy,
	FaSwimmer,
	FaFish,
	FaAnchor,
} from 'react-icons/fa'
import { IoWater, IoWaterOutline } from 'react-icons/io5'
import { GiWaterDrop, GiWaveSurfer } from 'react-icons/gi'
import useTranslation from 'next-translate/useTranslation'
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
			<>
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
			</>
		)
	}

	// Vocabulary cards
	const vocabularyCards = [
		{
			title: t('totalWordsInDictionary'),
			value: stats?.totalWords || 0,
			icon: <FaBook />,
			color: '#667eea',
			gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		},
		{
			title: t('wordsAddedToday'),
			value: stats?.wordsAddedToday || 0,
			icon: <FaChartLine />,
			color: '#10B981',
			gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
		},
		{
			title: t('wordsAddedThisWeek'),
			value: stats?.wordsAddedThisWeek || 0,
			icon: <FaChartLine />,
			color: '#3B82F6',
			gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
		},
		{
			title: t('wordsAddedThisMonth'),
			value: stats?.wordsAddedThisMonth || 0,
			icon: <FaChartLine />,
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
			icon: <FaVideo />,
			color: '#3B82F6',
			gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
		},
		{
			title: t('materialsFinished'),
			value: stats?.materialsFinished || 0,
			icon: <FaCheckCircle />,
			color: '#10B981',
			gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
		},
		{
			title: t('wordsReviewedToday'),
			value: stats?.wordsReviewedToday || 0,
			icon: <FaRedo />,
			color: '#F59E0B',
			gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
		},
	]

	// Calculate total badges stats
	const getTotalBadgesStats = (config) => {
		let total = 0
		let unlocked = 0
		Object.values(config).forEach(category => {
			total += category.badges.length
			unlocked += category.badges.filter(b => b.isUnlocked).length
		})
		return { total, unlocked, percentage: Math.round((unlocked / total) * 100) }
	}

	// Function to darken color for completed badges
	const darkenColor = (color, amount = 0.3) => {
		// Convert hex to RGB
		const hex = color.replace('#', '')
		const r = parseInt(hex.substring(0, 2), 16)
		const g = parseInt(hex.substring(2, 4), 16)
		const b = parseInt(hex.substring(4, 6), 16)

		// Darken by reducing RGB values
		const newR = Math.max(0, Math.floor(r * (1 - amount)))
		const newG = Math.max(0, Math.floor(g * (1 - amount)))
		const newB = Math.max(0, Math.floor(b * (1 - amount)))

		// Convert back to hex
		return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
	}

	// Icons for all badge categories - Thematic progression
	// Levels: Water/Ocean progression (drop → anchor)
	const levelIcons = [FaTint, GiWaterDrop, IoWaterOutline, FaSwimmer, FaAnchor]

	// Streaks: Fire progression (campfire → sun/star)
	const streakIcons = [FaCampground, FaFire, FaBurn, FaHotjar, FaBolt, FaSun, FaStar]

	// Words Added: Knowledge progression (book → globe of knowledge)
	const wordsAddedIcons = [FaBook, FaBookOpen, FaBookReader, FaGraduationCap, FaUniversity, FaLandmark, FaGlobe]

	// Words Reviewed: Magical symbols progression (circle → gem)
	const wordsReviewedIcons = [FaCircle, FaDotCircle, FaHeart, FaShieldAlt, FaSnowflake, FaGem]

	// Materials Finished: Cinema achievement progression (film → crown)
	const materialsIcons = [FaFilm, FaCamera, FaCameraRetro, FaPhotoVideo, FaTheaterMasks, FaCrown]

	// Badges configuration
	const badgesConfig = {
		levels: {
			title: t('levelBadges'),
			icon: <FaStar />,
			color: '#667eea',
			gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			badges: [5, 10, 15, 20, 30].map((level, index) => {
				const IconComponent = levelIcons[index]
				return {
					value: level,
					icon: <IconComponent />,
					isUnlocked: xpProfile ? xpProfile.currentLevel >= level : false,
				}
			}),
			getCurrentValue: () => xpProfile ? xpProfile.currentLevel : 0,
		},
		streaks: {
			title: t('streakBadges'),
			icon: <FaFire />,
			color: '#F59E0B',
			gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
			badges: [7, 15, 30, 90, 120, 150, 300].map((days, index) => {
				const IconComponent = streakIcons[index]
				return {
					value: days,
					icon: <IconComponent />,
					isUnlocked: xpProfile ? xpProfile.longestStreak >= days : false,
				}
			}),
			getCurrentValue: () => xpProfile ? xpProfile.longestStreak : 0,
		},
		wordsAdded: {
			title: t('wordsAddedBadges'),
			icon: <FaBook />,
			color: '#10B981',
			gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
			badges: [10, 50, 100, 150, 200, 250, 300].map((count, index) => {
				const IconComponent = wordsAddedIcons[index]
				return {
					value: count,
					icon: <IconComponent />,
					isUnlocked: stats ? stats.totalWords >= count : false,
				}
			}),
			getCurrentValue: () => stats ? stats.totalWords : 0,
		},
		wordsReviewed: {
			title: t('wordsReviewedBadges'),
			icon: <FaRedo />,
			color: '#8B5CF6',
			gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
			badges: [10, 50, 100, 250, 500, 1000].map((count, index) => {
				const IconComponent = wordsReviewedIcons[index]
				return {
					value: count,
					icon: <IconComponent />,
					isUnlocked: stats ? (stats.totalWordsReviewed || 0) >= count : false,
				}
			}),
			getCurrentValue: () => stats ? (stats.totalWordsReviewed || 0) : 0,
		},
		materialsFinished: {
			title: t('materialsFinishedBadges'),
			icon: <FaVideo />,
			color: '#F97316',
			gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
			badges: [5, 10, 20, 30, 50, 100].map((count, index) => {
				const IconComponent = materialsIcons[index]
				return {
					value: count,
					icon: <IconComponent />,
					isUnlocked: stats ? stats.materialsFinished >= count : false,
				}
			}),
			getCurrentValue: () => stats ? stats.materialsFinished : 0,
		},
	}

	return (
		<>
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
												<FaFire
													style={{
														fontSize: '3rem',
														color: 'white',
														marginBottom: '0.5rem',
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
												<FaCoins
													style={{
														fontSize: '3rem',
														color: 'white',
														marginBottom: '0.5rem',
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
											<FaCoins style={{ fontSize: '1.5rem', color: '#D97706' }} />
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
								<FaTrophy style={{ fontSize: '2.5rem', color: '#F59E0B' }} />
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

				{/* Badges Section */}
				<Paper
					elevation={0}
					sx={{
						borderRadius: 4,
						p: { xs: 3, sm: 4, md: 5 },
						mb: 4,
						background: 'white',
						border: '1px solid #E2E8F0',
						boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
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
							<FaTrophy style={{ fontSize: '2.5rem', color: '#F59E0B' }} />
							{t('badges')}
						</Typography>
						<Typography
							variant="body1"
							sx={{
								color: '#64748B',
								fontWeight: 500,
								mt: 1,
							}}>
							{t('badgesDescription')}
						</Typography>
					</Box>

					{/* Badges Grid */}
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
						{Object.entries(badgesConfig).map(([key, category]) => (
							<Box key={key}>
								{/* Category Header */}
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 2,
										mb: 3,
										pb: 2,
										borderBottom: '2px solid #E2E8F0',
									}}>
									<Box
										sx={{
											width: 40,
											height: 40,
											borderRadius: 2,
											background: category.color,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: 'white',
										}}>
										{category.icon}
									</Box>
									<Typography
										variant="h6"
										sx={{
											fontWeight: 700,
											color: '#1E293B',
											fontSize: { xs: '1.1rem', md: '1.25rem' },
										}}>
										{category.title}
									</Typography>
								</Box>

								{/* Badges Row */}
								<Box
									sx={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: 2.5,
										justifyContent: { xs: 'center', sm: 'flex-start' },
									}}>
									{category.badges.map((badge, index) => {
										// Déterminer si c'est le prochain badge à atteindre
										const isNextToUnlock = !badge.isUnlocked &&
											(index === 0 || category.badges[index - 1].isUnlocked)

										// Calculer la progression pour le prochain badge
										let progressPercentage = 0
										if (isNextToUnlock) {
											const currentCount = category.getCurrentValue()
											const previousValue = index > 0 ? category.badges[index - 1].value : 0
											const targetValue = badge.value
											const progressInRange = currentCount - previousValue
											const totalRange = targetValue - previousValue
											progressPercentage = Math.min((progressInRange / totalRange) * 100, 100)
										}

										return (
											<Box
												key={index}
												sx={{
													position: 'relative',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
													gap: 1,
												}}>
												{/* Cercle badge avec SVG progress */}
												<Box sx={{ position: 'relative', display: 'inline-flex' }}>
													{/* SVG Circle Progress - se remplit au même rythme que l'eau */}
													<svg width="100" height="100" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
														{/* Background circle */}
														<circle
															cx="50"
															cy="50"
															r="45"
															fill="none"
															stroke={badge.isUnlocked ? alpha(category.color, 0.3) : 'rgba(203, 213, 225, 0.5)'}
															strokeWidth="6"
														/>
														{/* Progress circle - se remplit selon le pourcentage */}
														{(isNextToUnlock || badge.isUnlocked) && (
															<circle
																cx="50"
																cy="50"
																r="45"
																fill="none"
																stroke={badge.isUnlocked ? darkenColor(category.color, 0.25) : alpha(category.color, 0.7)}
																strokeWidth="6"
																strokeDasharray={`${2 * Math.PI * 45}`}
																strokeDashoffset={`${2 * Math.PI * 45 * (1 - (badge.isUnlocked ? 1 : progressPercentage / 100))}`}
																strokeLinecap="round"
																style={{
																	transition: 'stroke-dashoffset 1.5s ease-out',
																	filter: badge.isUnlocked
																		? `drop-shadow(0 0 8px ${alpha(category.color, 0.5)})`
																		: 'none'
																}}
															/>
														)}
													</svg>

													<Box
														sx={{
															width: { xs: 90, sm: 100 },
															height: { xs: 90, sm: 100 },
															borderRadius: '50%',
															background: badge.isUnlocked
																? `linear-gradient(135deg, ${alpha(category.color, 0.5)} 0%, ${alpha(category.color, 0.5)} 100%)`
																: 'linear-gradient(135deg, rgba(226, 232, 240, 0.5) 0%, rgba(203, 213, 225, 0.5) 100%)',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															position: 'relative',
															overflow: 'hidden',
														}}>
														{/* Water fill effect - uniquement pour le badge en cours */}
														{isNextToUnlock && progressPercentage > 0 && (
															<Box
																sx={{
																	position: 'absolute',
																	bottom: 0,
																	left: 0,
																	right: 0,
																	height: `${progressPercentage}%`,
																	background: category.color,
																	transition: 'height 1.5s ease-out',
																	'&::before': {
																		content: '""',
																		position: 'absolute',
																		top: '-8px',
																		left: '-10%',
																		right: '-10%',
																		height: '18px',
																		background: `linear-gradient(to bottom, ${alpha(category.color, 0.8)}, ${category.color})`,
																		animation: 'badgeWave1 6s ease-in-out infinite',
																	},
																	'&::after': {
																		content: '""',
																		position: 'absolute',
																		top: '-6px',
																		left: '-10%',
																		right: '-10%',
																		height: '16px',
																		background: `linear-gradient(to bottom, ${alpha(category.color, 0.5)}, ${alpha(category.color, 0.7)})`,
																		animation: 'badgeWave2 8s ease-in-out infinite',
																	},
																	'@keyframes badgeWave1': {
																		'0%, 100%': {
																			borderRadius: '65% 35% 40% 60%',
																			transform: 'translateX(0) translateY(0) scaleY(1)',
																		},
																		'33%': {
																			borderRadius: '40% 60% 50% 50%',
																			transform: 'translateX(5%) translateY(2px) scaleY(0.88)',
																		},
																		'66%': {
																			borderRadius: '50% 50% 60% 40%',
																			transform: 'translateX(-4%) translateY(1px) scaleY(0.9)',
																		},
																	},
																	'@keyframes badgeWave2': {
																		'0%, 100%': {
																			borderRadius: '45% 55% 48% 52%',
																			transform: 'translateX(4%) translateY(1px) scaleY(0.95)',
																		},
																		'33%': {
																			borderRadius: '58% 42% 55% 45%',
																			transform: 'translateX(-3%) translateY(0) scaleY(1)',
																		},
																		'66%': {
																			borderRadius: '42% 58% 45% 55%',
																			transform: 'translateX(6%) translateY(1px) scaleY(0.9)',
																		},
																	},
																}}
															/>
														)}

														{/* Water fill pour badges complètement débloqués */}
														{badge.isUnlocked && (
															<Box
																sx={{
																	position: 'absolute',
																	bottom: 0,
																	left: 0,
																	right: 0,
																	height: '100%',
																	background: category.color,
																	'&::before': {
																		content: '""',
																		position: 'absolute',
																		top: '-8px',
																		left: '-10%',
																		right: '-10%',
																		height: '18px',
																		background: `linear-gradient(to bottom, ${alpha(category.color, 0.8)}, ${category.color})`,
																		animation: 'badgeWave1 6s ease-in-out infinite',
																	},
																	'&::after': {
																		content: '""',
																		position: 'absolute',
																		top: '-6px',
																		left: '-10%',
																		right: '-10%',
																		height: '16px',
																		background: `linear-gradient(to bottom, ${alpha(category.color, 0.5)}, ${alpha(category.color, 0.7)})`,
																		animation: 'badgeWave2 8s ease-in-out infinite',
																	},
																}}
															/>
														)}

														{/* Contenu du cercle - uniquement l'icône */}
														<Box sx={{
															textAlign: 'center',
															zIndex: 1,
															position: 'relative',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
														}}>
															<Box sx={{
																fontSize: { xs: '2.5rem', sm: '2.8rem' },
																color: 'white',
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																lineHeight: 0,
															}}>
																{badge.icon}
															</Box>
														</Box>
													</Box>

													{/* Petit cadenas pour badges verrouillés (pas le prochain) */}
													{!badge.isUnlocked && !isNextToUnlock && (
														<Box
															sx={{
																position: 'absolute',
																top: -4,
																right: -4,
																width: 24,
																height: 24,
																borderRadius: '50%',
																background: `linear-gradient(135deg, ${category.color} 0%, ${alpha(category.color, 0.8)} 100%)`,
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																border: '2px solid white',
																boxShadow: `0 2px 6px ${alpha(category.color, 0.3)}`,
																zIndex: 10,
															}}>
															<Lock sx={{ fontSize: '0.75rem', color: 'white' }} />
														</Box>
													)}
												</Box>

												{/* Chiffre sous le cercle - Design moderne */}
												<Box
													sx={{
														mt: 1.5,
														position: 'relative',
														display: 'inline-flex',
													}}>
													<Box
														sx={{
															position: 'relative',
															px: { xs: 2, sm: 2.5 },
															py: { xs: 0.8, sm: 1 },
															borderRadius: '20px',
															background: badge.isUnlocked
																? `linear-gradient(180deg, ${alpha(category.color, 0.25)} 0%, ${alpha(category.color, 0.15)} 100%)`
																: 'linear-gradient(180deg, rgba(226, 232, 240, 0.8) 0%, rgba(203, 213, 225, 0.6) 100%)',
															boxShadow: badge.isUnlocked
																? `0 4px 12px ${alpha(category.color, 0.25)}, inset 0 1px 0 ${alpha('#ffffff', 0.4)}`
																: '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
															border: badge.isUnlocked
																? `1.5px solid ${alpha(category.color, 0.4)}`
																: '1.5px solid rgba(203, 213, 225, 0.8)',
															backdropFilter: 'blur(10px)',
															transition: 'all 0.3s ease',
															'&::before': {
																content: '""',
																position: 'absolute',
																top: 0,
																left: 0,
																right: 0,
																height: '50%',
																background: badge.isUnlocked
																	? `linear-gradient(180deg, ${alpha('#ffffff', 0.3)} 0%, transparent 100%)`
																	: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%)',
																borderRadius: '20px 20px 0 0',
																pointerEvents: 'none',
															},
														}}>
														<Typography
															variant="h5"
															sx={{
																fontWeight: 900,
																color: badge.isUnlocked ? darkenColor(category.color, 0.15) : '#475569',
																fontSize: { xs: '1rem', sm: '1.1rem' },
																textAlign: 'center',
																lineHeight: 1,
																letterSpacing: '0.5px',
																textShadow: badge.isUnlocked
																	? `0 1px 2px ${alpha(category.color, 0.2)}`
																	: '0 1px 2px rgba(0, 0, 0, 0.1)',
																position: 'relative',
																zIndex: 1,
															}}>
															{badge.value}
														</Typography>
													</Box>
												</Box>
											</Box>
										)
									})}
							</Box>
						</Box>
						))}
					</Box>
				</Paper>

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
		</>
	)
}

export default StatisticsPage
