import { useState, useEffect } from 'react'
import {
	Box,
	Container,
	Typography,
	Paper,
	Tabs,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Avatar,
	Chip,
	CircularProgress,
	alpha,
	useTheme,
	useMediaQuery,
	Pagination as MuiPagination,
	PaginationItem,
} from '@mui/material'
import {
	EmojiEvents as TrophyIcon,
	TrendingUp,
	CalendarViewWeek,
	CalendarMonth,
	ChevronLeft,
	ChevronRight,
} from '@mui/icons-material'
import { FaFire, FaCoins } from 'react-icons/fa'
import useTranslation from 'next-translate/useTranslation'
import SEO from '../components/SEO'
import { useUserContext } from '../context/user'
import { getAvatarUrl, getAvatarBorderColor } from '../utils/avatars'

const LeaderboardPage = () => {
	const { t } = useTranslation('common')
	const { user } = useUserContext()
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [loading, setLoading] = useState(true)
	const [tabValue, setTabValue] = useState(0)
	const [leaderboardData, setLeaderboardData] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const usersPerPage = 10

	useEffect(() => {
		if (user) {
			fetchLeaderboard()
		}
	}, [user])

	const fetchLeaderboard = async () => {
		setLoading(true)
		try {
			const response = await fetch('/api/leaderboard')
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			const data = await response.json()
			console.log('Leaderboard data:', data)
			setLeaderboardData(data)
		} catch (error) {
			console.error('Error fetching leaderboard:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue)
		setCurrentPage(1)
	}

	const handlePageChange = (event, value) => {
		setCurrentPage(value)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const getRankColor = (rank) => {
		if (rank === 1) return '#FFD700' // Gold
		if (rank === 2) return '#C0C0C0' // Silver
		if (rank === 3) return '#CD7F32' // Bronze
		return '#64748B' // Default
	}

	const getRankIcon = (rank) => {
		if (rank === 1) return '🥇'
		if (rank === 2) return '🥈'
		if (rank === 3) return '🥉'
		return `#${rank}`
	}

	const getTabData = () => {
		if (!leaderboardData) return []
		switch (tabValue) {
			case 0:
				return leaderboardData.topXp
			case 1:
				return leaderboardData.topWeekly || []
			case 2:
				return leaderboardData.topMonthly || []
			case 3:
				return leaderboardData.topGold
			case 4:
				return leaderboardData.topStreak
			default:
				return []
		}
	}

	const getValueLabel = (entry) => {
		switch (tabValue) {
			case 0:
				return `${entry.value.toLocaleString()} XP`
			case 1:
				return `${entry.value.toLocaleString()} XP`
			case 2:
				return `${entry.value.toLocaleString()} XP`
			case 3:
				return `${entry.value.toLocaleString()} 💰`
			case 4:
				return `${entry.value} ${t('days')}`
			default:
				return entry.value
		}
	}

	const getUserRank = () => {
		if (!leaderboardData || !leaderboardData.userRanks) return null
		switch (tabValue) {
			case 0:
				return leaderboardData.userRanks.xp
			case 1:
				return leaderboardData.userRanks.weekly
			case 2:
				return leaderboardData.userRanks.monthly
			case 3:
				return leaderboardData.userRanks.gold
			case 4:
				return leaderboardData.userRanks.streak
			default:
				return null
		}
	}

	if (loading) {
		return (
			<>
				<SEO title={t('leaderboardTitle')} description={t('leaderboardDescription')} />
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

	const tabData = getTabData()
	const userRank = getUserRank()

	// Pagination
	const indexOfLastUser = currentPage * usersPerPage
	const indexOfFirstUser = indexOfLastUser - usersPerPage
	const currentUsers = tabData.slice(indexOfFirstUser, indexOfLastUser)
	const totalPages = Math.ceil(tabData.length / usersPerPage)

	return (
		<>
			<SEO title={t('leaderboardTitle')} description={t('leaderboardDescription')} />

			{/* Compact Header - Desktop only */}
			<Box
				sx={{
					display: { xs: 'none', lg: 'block' },
					pt: '6rem',
					pb: 3,
					borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
					bgcolor: '#fafafa',
				}}>
				<Container maxWidth='lg'>
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
						<TrophyIcon
							sx={{
								fontSize: '2.25rem',
								color: '#F59E0B',
							}}
						/>
						<Typography
							variant='h4'
							sx={{
								fontWeight: 700,
								fontSize: '2rem',
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
							}}>
							{t('leaderboard')}
						</Typography>
					</Box>
					<Typography
						variant='body1'
						align='center'
						sx={{
							color: '#64748b',
							fontSize: '1rem',
						}}>
						{t('leaderboardDescription')}
					</Typography>
				</Container>
			</Box>

			<Container maxWidth="lg" sx={{ pt: { xs: 0, sm: 'calc(80px + 32px)', lg: 3 }, pb: 8, px: { xs: 0, sm: 2, md: 3 }, mt: 0 }}>

				{/* User Stats Card - Compact version */}
				{leaderboardData?.userStats && (
					<Paper
						elevation={0}
						sx={{
							borderRadius: { xs: 0, sm: 3 },
							pt: { xs: 0, sm: 3 },
							px: { xs: 1.5, sm: 3 },
							pb: { xs: 1.5, sm: 3 },
							mb: { xs: 1.5, sm: 4 },
							mt: 0,
							background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
							border: { xs: 'none', sm: '2px solid' },
							borderColor: { sm: alpha('#667eea', 0.3) },
							borderBottom: { xs: '1px solid rgba(102, 126, 234, 0.2)', sm: 'none' },
						}}>
						{/* Desktop version */}
						<Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
							<Box>
								<Typography variant="subtitle2" sx={{
									color: 'white',
									fontWeight: 700,
									mb: 0.5,
									textTransform: 'uppercase',
									letterSpacing: 0.5,
									background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.8) 100%)',
									px: 2,
									py: 0.75,
									borderRadius: 2,
									display: 'inline-block',
									boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
								}}>
									{t('yourRanking')}
								</Typography>
								{userRank ? (
									<Typography variant="h4" sx={{ fontWeight: 800, color: '#667eea' }}>
										{getRankIcon(userRank)}
									</Typography>
								) : (
									<Typography variant="h5" sx={{ fontWeight: 700, color: '#94A3B8', fontStyle: 'italic' }}>
										{tabValue === 1 && t('noXPThisWeek')}
										{tabValue === 2 && t('noXPThisMonth')}
										{(tabValue === 0 || tabValue === 3 || tabValue === 4) && t('notRanked')}
									</Typography>
								)}
							</Box>
							<Box sx={{ display: 'flex', gap: 3 }}>
								<Box>
									<Typography variant="subtitle2" sx={{
										color: 'white',
										fontWeight: 700,
										textTransform: 'uppercase',
										letterSpacing: 0.5,
										background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.9) 0%, rgba(59, 130, 246, 0.8) 100%)',
										px: 2,
										py: 0.5,
										borderRadius: 2,
										display: 'inline-block',
										boxShadow: '0 2px 8px rgba(30, 64, 175, 0.3)',
										mb: 0.5,
									}}>
										{t('totalXP')}
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 700 }}>
										{leaderboardData.userStats.total_xp.toLocaleString()}
									</Typography>
								</Box>
								<Box>
									<Typography variant="subtitle2" sx={{
										color: 'white',
										fontWeight: 700,
										textTransform: 'uppercase',
										letterSpacing: 0.5,
										background: 'linear-gradient(135deg, rgba(21, 128, 61, 0.9) 0%, rgba(34, 197, 94, 0.8) 100%)',
										px: 2,
										py: 0.5,
										borderRadius: 2,
										display: 'inline-block',
										boxShadow: '0 2px 8px rgba(21, 128, 61, 0.3)',
										mb: 0.5,
									}}>
										{t('streak')}
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 700 }}>
										{leaderboardData.userStats.daily_streak} 🔥
									</Typography>
								</Box>
								<Box>
									<Typography variant="subtitle2" sx={{
										color: 'white',
										fontWeight: 700,
										textTransform: 'uppercase',
										letterSpacing: 0.5,
										background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.9) 0%, rgba(251, 146, 60, 0.8) 100%)',
										px: 2,
										py: 0.5,
										borderRadius: 2,
										display: 'inline-block',
										boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)',
										mb: 0.5,
									}}>
										{t('gold')}
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 700 }}>
										{(leaderboardData.userStats.total_gold || 0).toLocaleString()} 💰
									</Typography>
								</Box>
							</Box>
						</Box>

						{/* Mobile version - Compact 2x2 grid */}
						<Box sx={{ display: { xs: 'grid', sm: 'none' }, gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, p: 1.5 }}>
							{/* Votre Classement */}
							<Box sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								p: 1,
								borderRadius: 2,
								background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.08) 100%)',
							}}>
								<Typography variant="caption" sx={{
									color: '#667eea',
									fontWeight: 700,
									fontSize: '0.65rem',
									textTransform: 'uppercase',
									mb: 0.25,
								}}>
									{t('yourRanking')}
								</Typography>
								{userRank ? (
									<Typography variant="h6" sx={{ fontWeight: 800, color: '#667eea', fontSize: '1.1rem' }}>
										{getRankIcon(userRank)}
									</Typography>
								) : (
									<Typography variant="caption" sx={{ fontWeight: 600, color: '#94A3B8', fontSize: '0.7rem' }}>
										-
									</Typography>
								)}
							</Box>

							{/* XP Total */}
							<Box sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								p: 1,
								borderRadius: 2,
								background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
							}}>
								<Typography variant="caption" sx={{
									color: '#1E40AF',
									fontWeight: 700,
									fontSize: '0.65rem',
									textTransform: 'uppercase',
									mb: 0.25,
								}}>
									XP
								</Typography>
								<Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E40AF' }}>
									{leaderboardData.userStats.total_xp.toLocaleString()}
								</Typography>
							</Box>

							{/* Streak */}
							<Box sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								p: 1,
								borderRadius: 2,
								background: 'linear-gradient(135deg, rgba(21, 128, 61, 0.12) 0%, rgba(34, 197, 94, 0.08) 100%)',
							}}>
								<Typography variant="caption" sx={{
									color: '#15803D',
									fontWeight: 700,
									fontSize: '0.65rem',
									textTransform: 'uppercase',
									mb: 0.25,
								}}>
									Streak
								</Typography>
								<Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: '#15803D' }}>
									{leaderboardData.userStats.daily_streak} 🔥
								</Typography>
							</Box>

							{/* Gold */}
							<Box sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								p: 1,
								borderRadius: 2,
								background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12) 0%, rgba(251, 146, 60, 0.08) 100%)',
							}}>
								<Typography variant="caption" sx={{
									color: '#D97706',
									fontWeight: 700,
									fontSize: '0.65rem',
									textTransform: 'uppercase',
									mb: 0.25,
								}}>
									Gold
								</Typography>
								<Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: '#D97706' }}>
									{(leaderboardData.userStats.total_gold || 0).toLocaleString()} 💰
								</Typography>
							</Box>
						</Box>
					</Paper>
				)}

				{/* Tabs */}
				<Paper
					elevation={0}
					sx={{
						borderRadius: { xs: 0, sm: 4 },
						overflow: 'hidden',
						border: { xs: 'none', sm: '1px solid #E2E8F0' },
						mt: { xs: 0, sm: 0 },
					}}>
					<Box
						sx={{
							borderBottom: 1,
							borderColor: 'divider',
							background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%)',
						}}>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							variant={isMobile ? 'scrollable' : 'standard'}
							scrollButtons={isMobile ? 'auto' : false}
							centered={!isMobile}
							sx={{
								'& .MuiTab-root': {
									fontWeight: 700,
									fontSize: { xs: '0.875rem', md: '1rem' },
									textTransform: 'none',
									py: 2,
								},
								'& .MuiTabs-indicator': {
									backgroundColor:
										tabValue === 0 ? '#3B82F6' :
										tabValue === 1 ? '#8B5CF6' :
										tabValue === 2 ? '#EC4899' :
										tabValue === 3 ? '#F59E0B' :
										'#10B981',
									height: 3,
								},
							}}>
							<Tab
								icon={<TrendingUp sx={{ color: tabValue === 0 ? '#3B82F6' : 'inherit' }} />}
								iconPosition="start"
								label={isMobile ? t('totalXPTabMobile') : t('totalXPTab')}
								sx={{
									'&.Mui-selected': {
										color: '#3B82F6 !important',
									},
								}}
							/>
							<Tab
								icon={<CalendarViewWeek sx={{ color: tabValue === 1 ? '#8B5CF6' : 'inherit' }} />}
								iconPosition="start"
								label={isMobile ? t('weeklyTabMobile') : t('weeklyTab')}
								sx={{
									'&.Mui-selected': {
										color: '#8B5CF6 !important',
									},
								}}
							/>
							<Tab
								icon={<CalendarMonth sx={{ color: tabValue === 2 ? '#EC4899' : 'inherit' }} />}
								iconPosition="start"
								label={isMobile ? t('monthlyTabMobile') : t('monthlyTab')}
								sx={{
									'&.Mui-selected': {
										color: '#EC4899 !important',
									},
								}}
							/>
							<Tab
								icon={<FaCoins style={{ fontSize: '1.25rem', color: tabValue === 3 ? '#F59E0B' : 'inherit' }} />}
								iconPosition="start"
								label={t('goldTab')}
								sx={{
									'&.Mui-selected': {
										color: '#F59E0B !important',
									},
								}}
							/>
							<Tab
								icon={<FaFire style={{ fontSize: '1.25rem', color: tabValue === 4 ? '#10B981' : 'inherit' }} />}
								iconPosition="start"
								label={t('streakTab')}
								sx={{
									'&.Mui-selected': {
										color: '#10B981 !important',
									},
								}}
							/>
						</Tabs>
					</Box>

					{/* Leaderboard Table */}
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow
									sx={{
										background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
									}}>
									<TableCell sx={{ fontWeight: 700, color: '#1E293B', width: { xs: 60, md: 80 } }}>
										{t('rankHeader')}
									</TableCell>
									<TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>
										{t('userHeader')}
									</TableCell>
									{!isMobile && (
										<TableCell sx={{ fontWeight: 700, color: '#1E293B', width: { xs: 100, md: 120 } }}>
											{t('levelHeader')}
										</TableCell>
									)}
									<TableCell
										align="right"
										sx={{
											fontWeight: 700,
											color:
												tabValue === 0 ? '#1E40AF' :
												tabValue === 1 ? '#7C3AED' :
												tabValue === 2 ? '#DB2777' :
												tabValue === 3 ? '#D97706' :
												'#15803D',
											width: { xs: 120, md: 150 }
										}}>
										{tabValue === 0 && t('xpHeader')}
										{tabValue === 1 && t('weeklyXPHeader')}
										{tabValue === 2 && t('monthlyXPHeader')}
										{tabValue === 3 && t('goldHeader')}
										{tabValue === 4 && t('daysHeader')}
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{currentUsers.map((entry) => {
									// Définir les couleurs et styles pour le top 3
									const getTopThreeStyle = (rank) => {
										if (rank === 1) {
											return {
												background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.28) 0%, rgba(255, 235, 150, 0.20) 50%, rgba(255, 215, 0, 0.28) 100%)',
												borderLeft: '4px solid #FFD700',
												'&:hover': {
													background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.38) 0%, rgba(255, 235, 150, 0.30) 50%, rgba(255, 215, 0, 0.38) 100%)',
												},
											}
										}
										if (rank === 2) {
											return {
												background: 'linear-gradient(90deg, rgba(192, 192, 192, 0.28) 0%, rgba(220, 220, 220, 0.20) 50%, rgba(192, 192, 192, 0.28) 100%)',
												borderLeft: '4px solid #C0C0C0',
												'&:hover': {
													background: 'linear-gradient(90deg, rgba(192, 192, 192, 0.38) 0%, rgba(220, 220, 220, 0.30) 50%, rgba(192, 192, 192, 0.38) 100%)',
												},
											}
										}
										if (rank === 3) {
											return {
												background: 'linear-gradient(90deg, rgba(205, 127, 50, 0.28) 0%, rgba(222, 184, 135, 0.20) 50%, rgba(205, 127, 50, 0.28) 100%)',
												borderLeft: '4px solid #CD7F32',
												'&:hover': {
													background: 'linear-gradient(90deg, rgba(205, 127, 50, 0.38) 0%, rgba(222, 184, 135, 0.30) 50%, rgba(205, 127, 50, 0.38) 100%)',
												},
											}
										}
										return {}
									}

									const topThreeStyle = getTopThreeStyle(entry.rank)
									const isTopThree = entry.rank <= 3

									return (
										<TableRow
											key={entry.userId}
											sx={{
												background: isTopThree
													? topThreeStyle.background
													: entry.isCurrentUser
													? alpha('#667eea', 0.08)
													: 'transparent',
												borderLeft: isTopThree ? topThreeStyle.borderLeft : 'none',
												borderRight: entry.isCurrentUser && isTopThree ? '4px solid #667eea' : 'none',
												'&:hover': isTopThree
													? topThreeStyle['&:hover']
													: entry.isCurrentUser
													? {
															background: alpha('#667eea', 0.12),
													  }
													: {
															background: alpha('#F8FAFC', 1),
													  },
												transition: 'all 0.2s ease',
												position: 'relative',
											}}>
										<TableCell>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													gap: 1,
												}}>
												<Typography
													variant="h6"
													sx={{
														fontWeight: 800,
														color: getRankColor(entry.rank),
														fontSize: { xs: '1.1rem', md: '1.3rem' },
														filter: isTopThree ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none',
														animation: entry.rank === 1 ? 'pulse 2s ease-in-out infinite' : 'none',
														'@keyframes pulse': {
															'0%, 100%': {
																transform: 'scale(1)',
															},
															'50%': {
																transform: 'scale(1.1)',
															},
														},
													}}>
													{getRankIcon(entry.rank)}
												</Typography>
											</Box>
										</TableCell>
										<TableCell>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													gap: 2,
												}}>
												<Avatar
													src={getAvatarUrl(entry.avatarId || entry.avatar_id)}
													alt={entry.username}
													sx={{
														width: { xs: 56, md: 64 },
														height: { xs: 56, md: 64 },
														border: `3px solid ${getAvatarBorderColor(entry.avatarId || entry.avatar_id)}`,
														boxShadow: isTopThree ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
													}}>
													{entry.username.charAt(0).toUpperCase()}
												</Avatar>
												<Box>
													<Typography
														variant="body1"
														sx={{
															fontWeight: 700,
															color: '#1E293B',
															fontSize: { xs: '0.9rem', md: '1rem' },
														}}>
														{entry.username}
													</Typography>
													{entry.isCurrentUser && (
														<Chip
															label={t('youBadge')}
															size="small"
															sx={{
																height: 20,
																fontSize: '0.7rem',
																background: '#667eea',
																color: 'white',
																fontWeight: 700,
															}}
														/>
													)}
												</Box>
											</Box>
										</TableCell>
										{!isMobile && (
											<TableCell>
												<Chip
													label={`${t('levelShort')} ${entry.level || 1}`}
													size="small"
													sx={{
														background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
														color: 'white',
														fontWeight: 700,
													}}
												/>
											</TableCell>
										)}
										<TableCell align="right">
											<Typography
												variant="h6"
												sx={{
													fontWeight: 800,
													color:
														tabValue === 0 ? '#1E40AF' :
														tabValue === 1 ? '#7C3AED' :
														tabValue === 2 ? '#DB2777' :
														tabValue === 3 ? '#D97706' :
														'#15803D',
													fontSize: { xs: '1rem', md: '1.2rem' },
												}}>
												{getValueLabel(entry)}
											</Typography>
										</TableCell>
									</TableRow>
								)
							})}
							</TableBody>
						</Table>
					</TableContainer>

					{/* Pagination */}
					{totalPages > 1 && (
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								mt: 4,
								mb: 2,
							}}>
							<MuiPagination
								count={totalPages}
								page={currentPage}
								onChange={handlePageChange}
								size='large'
								renderItem={(item) => (
									<PaginationItem
										slots={{ previous: ChevronLeft, next: ChevronRight }}
										{...item}
										sx={{
											fontWeight: 700,
											fontSize: '1rem',
											border: '1px solid',
											borderColor: item.selected ? 'rgba(139, 92, 246, 0.6)' : 'rgba(139, 92, 246, 0.2)',
											background: item.selected
												? 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)'
												: 'white',
											color: item.selected ? 'white' : '#4a5568',
											borderRadius: 2,
											minWidth: '44px',
											height: '44px',
											mx: 0.5,
											transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
											position: 'relative',
											overflow: 'hidden',
											boxShadow: item.selected
												? '0 4px 12px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)'
												: '0 2px 6px rgba(139, 92, 246, 0.08)',
											'&::before': {
												content: '""',
												position: 'absolute',
												top: 0,
												left: '-100%',
												width: '100%',
												height: '100%',
												background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
												transition: 'left 0.5s ease',
											},
											'&:hover': {
												borderColor: 'rgba(139, 92, 246, 0.8)',
												background: item.selected
													? 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(6, 182, 212, 0.9) 100%)'
													: 'rgba(139, 92, 246, 0.08)',
												transform: 'translateY(-2px) scale(1.05)',
												boxShadow: item.selected
													? '0 6px 16px rgba(139, 92, 246, 0.5), 0 0 25px rgba(6, 182, 212, 0.3)'
													: '0 4px 12px rgba(139, 92, 246, 0.25)',
												'&::before': {
													left: '100%',
												},
											},
											'&.Mui-disabled': {
												backgroundColor: '#f5f5f5',
												borderColor: 'rgba(139, 92, 246, 0.1)',
												opacity: 0.4,
											},
										}}
									/>
								)}
								sx={{
									'& .MuiPagination-ul': {
										flexWrap: 'wrap',
										justifyContent: 'center',
										gap: 0.5,
									},
								}}
							/>
						</Box>
					)}
				</Paper>

				{/* Footer Message */}
				<Box
					sx={{
						textAlign: 'center',
						mt: { xs: 3, sm: 6 },
						p: { xs: 2, sm: 3 },
						borderRadius: { xs: 0, sm: 3 },
						background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
					}}>
					<Typography
						variant="h6"
						sx={{
							color: '#64748B',
							fontWeight: 600,
							mb: 1,
						}}>
						{t('keepLearning')}
					</Typography>
					<Typography
						variant="body2"
						sx={{
							color: '#94A3B8',
						}}>
						{t('realTimeUpdate')}
					</Typography>
				</Box>
			</Container>
		</>
	)
}

export default LeaderboardPage
