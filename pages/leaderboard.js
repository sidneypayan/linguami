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
} from '@mui/material'
import {
	EmojiEvents as TrophyIcon,
	WaterDrop,
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
				return leaderboardData.topStreak
			case 2:
				return leaderboardData.topGold
			default:
				return []
		}
	}

	const getValueLabel = (entry) => {
		switch (tabValue) {
			case 0:
				return `${entry.value.toLocaleString()} XP`
			case 1:
				return `${entry.value} jours`
			case 2:
				return `${entry.value.toLocaleString()} 💰`
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
				return leaderboardData.userRanks.streak
			case 2:
				return leaderboardData.userRanks.gold
			default:
				return null
		}
	}

	if (loading) {
		return (
			<>
				<SEO title="Classement" description="Classement des meilleurs utilisateurs" />
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

	return (
		<>
			<SEO title="Classement" description="Classement des meilleurs utilisateurs" />

			<Container maxWidth="lg" sx={{ mt: { xs: 12, md: 14 }, pb: 8 }}>
				{/* Header */}
				<Box
					sx={{
						textAlign: 'center',
						mb: 6,
					}}>
					<Typography
						variant="h3"
						sx={{
							fontWeight: 900,
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							mb: 2,
							fontSize: { xs: '2rem', md: '3rem' },
							display: 'inline-flex',
							alignItems: 'center',
							gap: 2,
						}}>
						<TrophyIcon sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, color: '#F59E0B' }} />
						Classement
					</Typography>
					<Typography
						variant="h6"
						sx={{
							color: '#64748B',
							fontWeight: 500,
							maxWidth: 600,
							mx: 'auto',
						}}>
						Découvrez les meilleurs apprenants de la communauté
					</Typography>
				</Box>

				{/* User Rank Card */}
				{userRank && leaderboardData?.userStats && (
					<Paper
						elevation={0}
						sx={{
							borderRadius: 3,
							p: 3,
							mb: 4,
							background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
							border: '2px solid',
							borderColor: alpha('#667eea', 0.3),
						}}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								flexWrap: 'wrap',
								gap: 2,
							}}>
							<Box>
								<Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5 }}>
									Votre classement
								</Typography>
								<Typography variant="h4" sx={{ fontWeight: 800, color: '#667eea' }}>
									{getRankIcon(userRank)}
								</Typography>
							</Box>
							<Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
								<Box>
									<Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
										XP Total
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 700 }}>
										{leaderboardData.userStats.total_xp.toLocaleString()}
									</Typography>
								</Box>
								<Box>
									<Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
										Streak
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 700 }}>
										{leaderboardData.userStats.daily_streak} 🔥
									</Typography>
								</Box>
								<Box>
									<Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
										Gold
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 700 }}>
										{(leaderboardData.userStats.total_gold || 0).toLocaleString()} 💰
									</Typography>
								</Box>
							</Box>
						</Box>
					</Paper>
				)}

				{/* Tabs */}
				<Paper
					elevation={0}
					sx={{
						borderRadius: 4,
						overflow: 'hidden',
						border: '1px solid #E2E8F0',
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
							variant={isMobile ? 'fullWidth' : 'standard'}
							centered={!isMobile}
							sx={{
								'& .MuiTab-root': {
									fontWeight: 700,
									fontSize: { xs: '0.875rem', md: '1rem' },
									textTransform: 'none',
									py: 2,
								},
								'& .MuiTabs-indicator': {
									backgroundColor: tabValue === 0 ? '#3B82F6' : tabValue === 1 ? '#10B981' : '#F59E0B',
									height: 3,
								},
							}}>
							<Tab
								icon={<WaterDrop sx={{ color: tabValue === 0 ? '#3B82F6' : 'inherit' }} />}
								iconPosition="start"
								label={isMobile ? 'XP' : 'Total XP'}
								sx={{
									'&.Mui-selected': {
										color: '#3B82F6 !important',
									},
								}}
							/>
							<Tab
								icon={<FaFire style={{ fontSize: '1.25rem', color: tabValue === 1 ? '#10B981' : 'inherit' }} />}
								iconPosition="start"
								label={isMobile ? 'Streak' : 'Streak'}
								sx={{
									'&.Mui-selected': {
										color: '#10B981 !important',
									},
								}}
							/>
							<Tab
								icon={<FaCoins style={{ fontSize: '1.25rem', color: tabValue === 2 ? '#F59E0B' : 'inherit' }} />}
								iconPosition="start"
								label={isMobile ? 'Gold' : 'Gold'}
								sx={{
									'&.Mui-selected': {
										color: '#F59E0B !important',
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
										Rang
									</TableCell>
									<TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>
										Utilisateur
									</TableCell>
									{!isMobile && (
										<TableCell sx={{ fontWeight: 700, color: '#1E293B', width: { xs: 100, md: 120 } }}>
											Niveau
										</TableCell>
									)}
									<TableCell
										align="right"
										sx={{
											fontWeight: 700,
											color: tabValue === 0 ? '#1E40AF' : tabValue === 1 ? '#15803D' : '#D97706',
											width: { xs: 120, md: 150 }
										}}>
										{tabValue === 0 && 'XP'}
										{tabValue === 1 && 'Jours'}
										{tabValue === 2 && 'Gold'}
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{tabData.map((entry) => (
									<TableRow
										key={entry.userId}
										sx={{
											background: entry.isCurrentUser
												? alpha('#667eea', 0.08)
												: 'transparent',
											'&:hover': {
												background: entry.isCurrentUser
													? alpha('#667eea', 0.12)
													: alpha('#F8FAFC', 1),
											},
											transition: 'all 0.2s ease',
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
														width: { xs: 36, md: 44 },
														height: { xs: 36, md: 44 },
														border: `2px solid ${getAvatarBorderColor(entry.avatarId || entry.avatar_id)}`,
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
															label="Vous"
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
													label={`Niv. ${entry.level || 1}`}
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
													color: tabValue === 0 ? '#1E40AF' : tabValue === 1 ? '#15803D' : '#D97706',
													fontSize: { xs: '1rem', md: '1.2rem' },
												}}>
												{getValueLabel(entry)}
											</Typography>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>

				{/* Footer Message */}
				<Box
					sx={{
						textAlign: 'center',
						mt: 6,
						p: 3,
						borderRadius: 3,
						background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
					}}>
					<Typography
						variant="h6"
						sx={{
							color: '#64748B',
							fontWeight: 600,
							mb: 1,
						}}>
						Continuez à apprendre pour grimper dans le classement ! 🚀
					</Typography>
					<Typography
						variant="body2"
						sx={{
							color: '#94A3B8',
						}}>
						Le classement est mis à jour en temps réel
					</Typography>
				</Box>
			</Container>
		</>
	)
}

export default LeaderboardPage
