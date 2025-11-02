import { useState, useEffect } from 'react'
import Image from 'next/image'
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
	ExpandMore,
	ExpandLess,
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
import Head from 'next/head'

const StatisticsPage = () => {
	const { t } = useTranslation('stats')
	const { user } = useUserContext()
	const [loading, setLoading] = useState(true)
	const [stats, setStats] = useState(null)
	const [xpProfile, setXpProfile] = useState(null)
	const [goals, setGoals] = useState(null)
	const [expandedBadges, setExpandedBadges] = useState({})

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
		{
			title: t('wordsReviewedToday'),
			value: stats?.wordsReviewedToday || 0,
			icon: <FaRedo />,
			color: '#8B5CF6',
			gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
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
			color: '#8b5cf6',
			gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
			badges: [5, 10, 15, 20, 30, 50, 60].map((level, index) => {
				return {
					value: level,
					icon: (
						<Image
							src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/xp_${index + 1}.png`}
							alt={`Level ${level}`}
							width={90}
							height={90}
							style={{ objectFit: 'cover', borderRadius: '50%' }}
						/>
					),
					isUnlocked: index === 0 ? true : (xpProfile ? xpProfile.currentLevel >= level : false),
				}
			}),
			getCurrentValue: () => xpProfile ? xpProfile.currentLevel : 0,
		},
		reviewedWords: {
			title: t('wordsReviewedBadges'),
			icon: <FaRedo />,
			color: '#8B5CF6',
			gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
			badges: [50, 100, 250, 500, 1000, 5000, 10000].map((count, index) => {
				return {
					value: count,
					icon: (
						<Image
							src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/0${index + 1}_reviewed_words_badge.png`}
							alt={`${count} words`}
							width={90}
							height={90}
							style={{ objectFit: 'cover', borderRadius: '50%' }}
						/>
					),
					isUnlocked: index === 0 ? true : (stats ? (stats.totalWordsReviewed || 0) >= count : false),
				}
			}),
			getCurrentValue: () => stats ? (stats.totalWordsReviewed || 0) : 0,
		},
		/* Temporarily hidden - waiting for images
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
		*/
	}

	return (
		<>
			<SEO title={t('pageTitle')} description={t('pageDescription')} />
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
			</Head>

			<Container maxWidth="xl" sx={{ pt: { xs: '5.5rem', md: '6rem' }, py: { xs: 3, md: 4 }, pb: 8 }}>
				{/* XP Profile Card - Circular Design */}
				{xpProfile && (
					<Paper
						elevation={0}
						sx={{
							borderRadius: { xs: 0, md: 4 },
							p: { xs: 3, md: 4 },
							mb: { xs: 2, md: 4 },
							background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
							backdropFilter: 'blur(20px)',
							boxShadow: { xs: 'none', md: '0 8px 32px rgba(139, 92, 246, 0.12), 0 0 0 1px rgba(139, 92, 246, 0.08)' },
							border: { xs: 'none', md: '1px solid rgba(139, 92, 246, 0.15)' },
							position: 'relative',
							overflow: 'hidden',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								height: '4px',
								background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)',
							},
						}}>
						{/* Motivational message - Epic banner */}
						<Box
							sx={{
								position: 'relative',
								textAlign: 'center',
								mb: 4,
								py: 2.5,
								px: 3,
								borderRadius: 2,
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
								border: '2px solid',
								borderImage: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(6, 182, 212, 0.4)) 1',
								boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 4px 16px rgba(139, 92, 246, 0.15)',
								'&::before': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									background: 'linear-gradient(135deg, transparent 0%, rgba(139, 92, 246, 0.03) 50%, transparent 100%)',
									pointerEvents: 'none',
								},
							}}>
							<Typography
								variant="h5"
								sx={{
									fontWeight: 800,
									color: '#1E293B',
									textTransform: 'uppercase',
									letterSpacing: '1px',
									textShadow: '0 2px 4px rgba(139, 92, 246, 0.1)',
									position: 'relative',
									zIndex: 1,
								}}>
								{xpProfile.currentLevel < 5
									? `⚔️ VOTRE QUÊTE DÉBUTE`
									: xpProfile.currentLevel < 10
									? `🗡️ GUERRIER EN FORMATION`
									: xpProfile.currentLevel < 20
									? `⚡ CHAMPION AGUERRI`
									: `👑 LÉGENDE VIVANTE`
								}
							</Typography>
						</Box>

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
											{xpProfile.progressPercent >= 75
												? `💪 Plus que ${xpProfile.xpForNextLevel - xpProfile.xpInCurrentLevel} XP pour le niveau ${xpProfile.currentLevel + 1} !`
												: xpProfile.progressPercent >= 50
												? `🎯 À mi-chemin du niveau ${xpProfile.currentLevel + 1} !`
												: `🌟 Continue d'apprendre pour progresser !`
											}
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
											{xpProfile.dailyStreak} {xpProfile.dailyStreak === 1 ? 'jour' : 'jours'} 🔥
										</Typography>
										<Typography
											variant="body1"
											sx={{
												mt: 0.5,
												fontWeight: 600,
												color: '#64748B',
											}}>
											{xpProfile.dailyStreak === 0
												? `🎯 Commence ta série aujourd'hui !`
												: xpProfile.dailyStreak === 1
												? `🌟 Super début ! Reviens demain !`
												: xpProfile.dailyStreak < 7
												? `💪 ${7 - xpProfile.dailyStreak} jour${7 - xpProfile.dailyStreak > 1 ? 's' : ''} pour atteindre 1 semaine !`
												: xpProfile.dailyStreak < 30
												? `🚀 ${30 - xpProfile.dailyStreak} jour${30 - xpProfile.dailyStreak > 1 ? 's' : ''} pour 1 mois de série !`
												: `🏆 Tu es en feu ! Continue !`
											}
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
											{xpProfile.totalGold === 0
												? `💰 Ton trésor commence ici !`
												: xpProfile.totalGold < 100
												? `🌟 Tu accumules tes premières pièces !`
												: xpProfile.totalGold < 500
												? `💎 Belle collection de gold !`
												: `👑 Tu es riche ! Continue comme ça !`
											}
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

				{/* Goals - Epic Quest Board */}
				{goals && (
					<Paper
						elevation={0}
						sx={{
							borderRadius: { xs: 0, md: 3 },
							p: { xs: 3, md: 5 },
							mb: { xs: 2, md: 4 },
							background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%)',
							border: { xs: 'none', md: '2px solid transparent' },
							backgroundImage: {
								xs: 'none',
								md: `
									linear-gradient(white, white),
									linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)
								`
							},
							backgroundOrigin: 'border-box',
							backgroundClip: 'padding-box, border-box',
							boxShadow: {
								xs: 'none',
								md: `
									0 10px 40px rgba(139, 92, 246, 0.12),
									0 2px 8px rgba(0, 0, 0, 0.04),
									inset 0 1px 0 rgba(255, 255, 255, 0.9)
								`
							},
							position: 'relative',
							overflow: 'hidden',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								height: '3px',
								background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 50%, #8b5cf6 100%)',
								backgroundSize: '200% 100%',
								animation: 'shimmer 4s ease-in-out infinite',
								'@keyframes shimmer': {
									'0%, 100%': { backgroundPosition: '0% 0%' },
									'50%': { backgroundPosition: '100% 0%' },
								},
							},
						}}>
						<Box
							sx={{
								textAlign: 'center',
								mb: 5,
							}}>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
								<Box
									sx={{
										width: 48,
										height: 48,
										borderRadius: 2,
										background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
									}}>
									<FaTrophy style={{ fontSize: '1.5rem', color: 'white' }} />
								</Box>
								<Typography
									variant="h4"
									sx={{
										fontWeight: 800,
										background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
										fontSize: { xs: '1.8rem', md: '2.2rem' },
										letterSpacing: '-0.5px',
									}}>
									{t('goals') || 'Objectifs'}
								</Typography>
							</Box>
							<Typography
								variant="body1"
								sx={{
									color: '#64748B',
									fontWeight: 500,
									fontSize: { xs: '0.95rem', md: '1rem' },
								}}>
								Atteins tes objectifs et deviens encore meilleur ! 🎯
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

				{/* Badges Section - Hall of Achievements */}
				<Paper
					elevation={0}
					sx={{
						borderRadius: { xs: 0, md: 3 },
						p: { xs: 3, sm: 4, md: 5 },
						mb: { xs: 0, md: 4 },
						background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%)',
						border: { xs: 'none', md: '2px solid transparent' },
						backgroundImage: {
							xs: 'none',
							md: `
								linear-gradient(white, white),
								linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)
							`
						},
						backgroundOrigin: 'border-box',
						backgroundClip: 'padding-box, border-box',
						boxShadow: {
							xs: 'none',
							md: `
								0 10px 40px rgba(139, 92, 246, 0.12),
								0 2px 8px rgba(0, 0, 0, 0.04),
								inset 0 1px 0 rgba(255, 255, 255, 0.9)
							`
						},
						position: 'relative',
						overflow: 'hidden',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							height: '3px',
							background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 50%, #8b5cf6 100%)',
							backgroundSize: '200% 100%',
							animation: 'shimmer 4s ease-in-out infinite',
							'@keyframes shimmer': {
								'0%, 100%': { backgroundPosition: '0% 0%' },
								'50%': { backgroundPosition: '100% 0%' },
							},
						},
					}}>
					<Box
						sx={{
							textAlign: 'center',
							mb: 5,
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: 2,
									background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
								}}>
								<FaTrophy style={{ fontSize: '1.5rem', color: 'white' }} />
							</Box>
							<Typography
								variant="h4"
								sx={{
									fontWeight: 800,
									background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
									fontSize: { xs: '1.8rem', md: '2.2rem' },
									letterSpacing: '-0.5px',
								}}>
								{t('badges')}
							</Typography>
						</Box>
						<Typography
							variant="body1"
							sx={{
								color: '#64748B',
								fontWeight: 500,
								fontSize: { xs: '0.95rem', md: '1rem' },
							}}>
							Collectionne tous les badges et montre ta progression ! 🏅
						</Typography>
					</Box>

					{/* Badges Grid */}
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
						{Object.entries(badgesConfig).map(([key, category]) => {
							const isExpandedMobile = expandedBadges[key]
							const toggleExpanded = () => {
								setExpandedBadges(prev => ({
									...prev,
									[key]: !prev[key]
								}))
							}

							return (
								<Box key={key}>
									{/* Category Header */}
									<Box
										onClick={toggleExpanded}
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 2,
											mb: 3,
											pb: 2,
											borderBottom: '2px solid #E2E8F0',
											cursor: { xs: 'pointer', md: 'default' },
											transition: 'all 0.3s ease',
											'&:hover': {
												backgroundColor: { xs: alpha(category.color, 0.05), md: 'transparent' },
											},
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
												flex: 1,
											}}>
											{category.title}
										</Typography>
										<Box
											sx={{
												display: { xs: 'flex', md: 'none' },
												alignItems: 'center',
												justifyContent: 'center',
												width: 32,
												height: 32,
												borderRadius: '50%',
												background: alpha(category.color, 0.1),
												color: category.color,
												transition: 'all 0.3s ease',
											}}>
											{isExpandedMobile ? <ExpandLess /> : <ExpandMore />}
										</Box>
									</Box>

									{/* Badges Row */}
									<Box
										sx={{
											display: { xs: isExpandedMobile ? 'flex' : 'none', md: 'flex' },
											flexWrap: 'wrap',
											gap: 2.5,
											justifyContent: { xs: 'center', sm: 'flex-start' },
										}}>
									{category.badges.map((badge, index) => {
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
												{/* Cercle badge simple */}
												<Box sx={{ position: 'relative', display: 'inline-flex' }}>
													<Box
														sx={{
															width: { xs: 90, sm: 100 },
															height: { xs: 90, sm: 100 },
															borderRadius: '50%',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															position: 'relative',
															overflow: 'hidden',
															border: badge.isUnlocked
																? `3px solid ${category.color}`
																: '3px solid rgba(203, 213, 225, 0.5)',
															boxShadow: badge.isUnlocked
																? `0 4px 12px ${alpha(category.color, 0.3)}`
																: '0 2px 8px rgba(0, 0, 0, 0.08)',
															transition: 'all 0.3s ease',
														}}>
														{/* Contenu du cercle - uniquement l'icône */}
														<Box sx={{
															textAlign: 'center',
															zIndex: 1,
															position: 'relative',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															width: '100%',
															height: '100%',
															filter: badge.isUnlocked ? 'none' : 'grayscale(100%) opacity(0.4)',
															transition: 'filter 0.3s ease',
														}}>
															{badge.icon}
														</Box>
													</Box>
												</Box>

												{/* Chiffre sous le cercle - Design Médiéval Fantasy */}
												<Box
													sx={{
														mt: 1.5,
														position: 'relative',
														display: 'inline-flex',
													}}>
													<Box
														sx={{
															position: 'relative',
															px: { xs: 2.5, sm: 3 },
															py: { xs: 1, sm: 1.2 },
															borderRadius: '8px',
															background: badge.isUnlocked
																? 'linear-gradient(145deg, #2d2416 0%, #1a1410 100%)'
																: 'linear-gradient(145deg, #4a5568 0%, #2d3748 100%)',
															boxShadow: badge.isUnlocked
																? `0 4px 8px rgba(0, 0, 0, 0.6), inset 0 1px 1px ${alpha(category.color, 0.3)}, inset 0 -1px 1px rgba(0, 0, 0, 0.8)`
																: '0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
															border: badge.isUnlocked
																? `3px solid ${category.color}`
																: '2px solid rgba(100, 116, 139, 0.6)',
															transition: 'all 0.3s ease',
															'&::before': {
																content: '""',
																position: 'absolute',
																top: 0,
																left: 0,
																right: 0,
																bottom: 0,
																borderRadius: '6px',
																background: badge.isUnlocked
																	? `radial-gradient(circle at 30% 30%, ${alpha(category.color, 0.15)} 0%, transparent 70%)`
																	: 'none',
																pointerEvents: 'none',
															},
															'&::after': {
																content: '""',
																position: 'absolute',
																top: 0,
																left: 0,
																right: 0,
																bottom: 0,
																borderRadius: '6px',
																background: badge.isUnlocked
																	? `
																		repeating-linear-gradient(
																			0deg,
																			transparent,
																			transparent 2px,
																			rgba(0, 0, 0, 0.03) 2px,
																			rgba(0, 0, 0, 0.03) 4px
																		),
																		repeating-linear-gradient(
																			90deg,
																			transparent,
																			transparent 2px,
																			rgba(0, 0, 0, 0.03) 2px,
																			rgba(0, 0, 0, 0.03) 4px
																		)
																	`
																	: 'none',
																opacity: 0.3,
																pointerEvents: 'none',
															},
														}}>
														<Typography
															variant="h5"
															sx={{
																fontWeight: 800,
																color: badge.isUnlocked ? category.color : '#94a3b8',
																fontSize: { xs: '1.1rem', sm: '1.25rem' },
																textAlign: 'center',
																lineHeight: 1,
																letterSpacing: '2px',
																textShadow: badge.isUnlocked
																	? `0 2px 4px rgba(0, 0, 0, 0.8), 0 1px 0 ${alpha(category.color, 0.5)}`
																	: '0 1px 2px rgba(0, 0, 0, 0.6)',
																position: 'relative',
																zIndex: 1,
																fontFamily: '"Cinzel", serif',
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
							)
						})}
					</Box>
				</Paper>

				{/* Vocabulary Section */}
				<Box sx={{ mb: 6 }}>
					<Box
						sx={{
							mb: 4,
							display: 'flex',
							alignItems: 'center',
							gap: 2,
						}}>
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: 2,
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
							}}>
							<FaBook style={{ fontSize: '1.5rem', color: 'white' }} />
						</Box>
						<Box>
							<Typography
								variant="h4"
								sx={{
									fontWeight: 800,
									background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
									fontSize: { xs: '1.8rem', md: '2rem' },
									letterSpacing: '-0.5px',
								}}>
								{t('vocabularySection')}
							</Typography>
							<Typography
								variant="body1"
								sx={{
									color: '#64748B',
									fontWeight: 500,
									fontSize: { xs: '0.9rem', md: '1rem' },
									mt: 0.5,
								}}>
								Ton vocabulaire grandit chaque jour ! 📚✨
							</Typography>
						</Box>
					</Box>
					<Grid container spacing={3} sx={{ mb: 4 }}>
						{vocabularyCards.map((card, index) => (
							<Grid item xs={12} sm={6} md={3} key={index}>
								<Card
									elevation={0}
									sx={{
										borderRadius: 2,
										overflow: 'visible',
										position: 'relative',
										transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
										border: '2px solid transparent',
										background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
										backgroundImage: `
											linear-gradient(white, white),
											linear-gradient(135deg, ${alpha(card.color, 0.3)} 0%, ${alpha(card.color, 0.15)} 100%)
										`,
										backgroundOrigin: 'border-box',
										backgroundClip: 'padding-box, border-box',
										boxShadow: `
											0 8px 24px ${alpha(card.color, 0.12)},
											0 2px 6px rgba(0, 0, 0, 0.04),
											inset 0 1px 0 rgba(255, 255, 255, 0.9)
										`,
										'&::before': {
											content: '""',
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											height: '3px',
											background: card.gradient,
											zIndex: 1,
											borderRadius: '2px 2px 0 0',
										},
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: `
												0 12px 32px ${alpha(card.color, 0.25)},
												0 4px 12px rgba(0, 0, 0, 0.08),
												inset 0 1px 0 rgba(255, 255, 255, 0.9)
											`,
											'& .card-icon': {
												transform: 'scale(1.15)',
												filter: `drop-shadow(0 4px 8px ${alpha(card.color, 0.4)})`,
											},
										},
									}}>
									<Box
										sx={{
											height: 0,
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
													borderRadius: 2,
													background: `linear-gradient(135deg, ${alpha(card.color, 0.12)} 0%, ${alpha(card.color, 0.08)} 100%)`,
													border: `2px solid ${alpha(card.color, 0.3)}`,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: card.color,
													fontSize: '2rem',
													transition: 'all 0.3s ease',
													boxShadow: `
														inset 0 1px 0 rgba(255, 255, 255, 0.5),
														0 4px 12px ${alpha(card.color, 0.2)}
													`,
													position: 'relative',
													'&::before': {
														content: '""',
														position: 'absolute',
														inset: 0,
														background: `linear-gradient(135deg, transparent 0%, ${alpha(card.color, 0.05)} 100%)`,
														borderRadius: 2,
													},
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
							display: 'flex',
							alignItems: 'center',
							gap: 2,
						}}>
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: 2,
								background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
							}}>
							<FaVideo style={{ fontSize: '1.5rem', color: 'white' }} />
						</Box>
						<Box>
							<Typography
								variant="h4"
								sx={{
									fontWeight: 800,
									background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
									fontSize: { xs: '1.8rem', md: '2rem' },
									letterSpacing: '-0.5px',
								}}>
								{t('materialsSection')}
							</Typography>
							<Typography
								variant="body1"
								sx={{
									color: '#64748B',
									fontWeight: 500,
									fontSize: { xs: '0.9rem', md: '1rem' },
									mt: 0.5,
								}}>
								Explore et apprends avec tes contenus favoris ! 🎬🎧
							</Typography>
						</Box>
					</Box>
					<Grid container spacing={3} sx={{ mb: 4 }}>
						{materialsCards.map((card, index) => (
							<Grid item xs={12} sm={6} md={6} key={index}>
								<Card
									elevation={0}
									sx={{
										borderRadius: 2,
										overflow: 'visible',
										position: 'relative',
										transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
										border: '2px solid transparent',
										background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
										backgroundImage: `
											linear-gradient(white, white),
											linear-gradient(135deg, ${alpha(card.color, 0.3)} 0%, ${alpha(card.color, 0.15)} 100%)
										`,
										backgroundOrigin: 'border-box',
										backgroundClip: 'padding-box, border-box',
										boxShadow: `
											0 8px 24px ${alpha(card.color, 0.12)},
											0 2px 6px rgba(0, 0, 0, 0.04),
											inset 0 1px 0 rgba(255, 255, 255, 0.9)
										`,
										'&::before': {
											content: '""',
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											height: '3px',
											background: card.gradient,
											zIndex: 1,
											borderRadius: '2px 2px 0 0',
										},
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: `
												0 12px 32px ${alpha(card.color, 0.25)},
												0 4px 12px rgba(0, 0, 0, 0.08),
												inset 0 1px 0 rgba(255, 255, 255, 0.9)
											`,
											'& .card-icon': {
												transform: 'scale(1.15)',
												filter: `drop-shadow(0 4px 8px ${alpha(card.color, 0.4)})`,
											},
										},
									}}>
									<Box
										sx={{
											height: 0,
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
													borderRadius: 2,
													background: `linear-gradient(135deg, ${alpha(card.color, 0.12)} 0%, ${alpha(card.color, 0.08)} 100%)`,
													border: `2px solid ${alpha(card.color, 0.3)}`,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: card.color,
													fontSize: '2rem',
													transition: 'all 0.3s ease',
													boxShadow: `
														inset 0 1px 0 rgba(255, 255, 255, 0.5),
														0 4px 12px ${alpha(card.color, 0.2)}
													`,
													position: 'relative',
													'&::before': {
														content: '""',
														position: 'absolute',
														inset: 0,
														background: `linear-gradient(135deg, transparent 0%, ${alpha(card.color, 0.05)} 100%)`,
														borderRadius: 2,
													},
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
