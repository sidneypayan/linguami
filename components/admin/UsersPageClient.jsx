'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useUserContext } from '@/context/user'
import {
	Box,
	Container,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	Avatar,
	alpha,
	TextField,
	InputAdornment,
	Tooltip,
	Card,
	CardContent,
	Grid,
	Divider,
	CircularProgress,
} from '@mui/material'
import { Search, Person, AdminPanelSettings, ArrowUpward, ArrowDownward, UnfoldMore } from '@mui/icons-material'
import AdminNavbar from '@/components/admin/AdminNavbar'

const UsersPage = () => {
	const t = useTranslations('admin')
	const locale = useLocale()
	const router = useRouter()
	const { isUserLoggedIn, isUserAdmin } = useUserContext()

	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [sortBy, setSortBy] = useState('created_at')
	const [sortOrder, setSortOrder] = useState('desc')

	// Authentication check
	useEffect(() => {
		if (!isUserLoggedIn) {
			router.push('/login')
			return
		}

		if (!isUserAdmin) {
			router.push('/')
			return
		}
	}, [isUserLoggedIn, isUserAdmin, router])

	// Fetch users data
	useEffect(() => {
		if (!isUserAdmin) return

		const fetchUsers = async () => {
			setLoading(true)
			try {
				// Call API route to fetch users (needs service role key)
				const response = await fetch('/api/admin/users')
				const data = await response.json()

				if (data.users) {
					setUsers(data.users)
				}
			} catch (error) {
				console.error('Error fetching users:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchUsers()
	}, [isUserAdmin])

	const handleSort = (column) => {
		if (sortBy === column) {
			setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
		} else {
			setSortBy(column)
			if (column === 'name') {
				setSortOrder('asc')
			} else {
				setSortOrder('desc')
			}
		}
	}

	const filteredUsers = users
		.filter(user => {
			const searchLower = searchQuery.toLowerCase()
			return (
				user.name?.toLowerCase().includes(searchLower) ||
				user.email?.toLowerCase().includes(searchLower)
			)
		})
		.sort((a, b) => {
			let compareA, compareB

			switch (sortBy) {
				case 'name':
					compareA = (a.name || '').toLowerCase()
					compareB = (b.name || '').toLowerCase()
					break
				case 'role':
					compareA = a.role || 'user'
					compareB = b.role || 'user'
					break
				case 'is_premium':
					compareA = a.is_premium ? 1 : 0
					compareB = b.is_premium ? 1 : 0
					break
				case 'total_xp':
					compareA = a.total_xp || 0
					compareB = b.total_xp || 0
					break
				case 'current_level':
					compareA = a.current_level || 1
					compareB = b.current_level || 1
					break
				case 'language_level':
					const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 }
					compareA = levelOrder[a.language_level] || 0
					compareB = levelOrder[b.language_level] || 0
					break
				case 'created_at':
				default:
					compareA = new Date(a.created_at || 0)
					compareB = new Date(b.created_at || 0)
					break
			}

			let result = 0
			if (compareA < compareB) result = -1
			else if (compareA > compareB) result = 1

			return sortOrder === 'asc' ? result : -result
		})

	const getRoleColor = (role) => {
		return role === 'admin' ? '#EF4444' : '#3B82F6'
	}

	const getLanguageInfo = (lang) => {
		const info = {
			french: { name: 'Français', flag: '🇫🇷', color: '#3B82F6' },
			russian: { name: 'Русский', flag: '🇷🇺', color: '#EF4444' },
			english: { name: 'English', flag: '🇬🇧', color: '#10B981' },
		}
		return info[lang] || { name: lang, flag: '🌐', color: '#64748B' }
	}

	const getLevelInfo = (level) => {
		const info = {
			beginner: { name: t('beginner'), color: '#10B981' },
			intermediate: { name: t('intermediate'), color: '#F59E0B' },
			advanced: { name: t('advanced'), color: '#EF4444' },
		}
		return info[level] || { name: level, color: '#64748B' }
	}

	const formatDate = (dateString) => {
		if (!dateString) return 'N/A'
		const date = new Date(dateString)
		return new Intl.DateTimeFormat('fr-FR', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(date)
	}

	const SortableHeader = ({ column, children }) => {
		const isActive = sortBy === column
		return (
			<TableCell>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						cursor: 'pointer',
						userSelect: 'none',
						'&:hover': {
							'& .sort-icon': {
								opacity: 1,
							},
						},
					}}
					onClick={() => handleSort(column)}>
					{children}
					<Tooltip title={isActive && sortOrder === 'asc' ? t('sortDescending') : t('sortAscending')}>
						<Box
							className="sort-icon"
							sx={{
								display: 'flex',
								alignItems: 'center',
								color: isActive ? '#667eea' : '#94A3B8',
								opacity: isActive ? 1 : 0.3,
								transition: 'all 0.2s',
							}}>
							{isActive && sortOrder === 'asc' ? (
								<ArrowUpward fontSize='small' />
							) : isActive && sortOrder === 'desc' ? (
								<ArrowDownward fontSize='small' />
							) : (
								<UnfoldMore fontSize='small' />
							)}
						</Box>
					</Tooltip>
				</Box>
			</TableCell>
		)
	}

	// Don't render until auth check is complete
	if (!isUserLoggedIn || !isUserAdmin) {
		return null
	}

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
				<CircularProgress />
			</Box>
		)
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: 'background.paper',
			}}>
			<AdminNavbar activePage="users" />

			<Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
				{/* Page Header */}
				<Box sx={{ mb: { xs: 3, md: 4 } }}>
					<Typography
						variant='h4'
						sx={{
							fontWeight: 700,
							color: '#1E293B',
							mb: 1,
							fontSize: { xs: '1.5rem', md: '2rem' },
						}}>
						{t('usersManagement')}
					</Typography>
					<Typography
						variant='body1'
						sx={{
							color: '#64748B',
							fontSize: { xs: '0.875rem', md: '1rem' },
						}}>
						{users.length} {users.length > 1 ? t('registeredUsersPlural') : t('registeredUsers')}
					</Typography>
				</Box>

				{/* Search Bar */}
				<Paper
					elevation={0}
					sx={{
						p: { xs: 2, md: 3 },
						borderRadius: { xs: 2, md: 3 },
						border: '1px solid',
						borderColor: 'divider',
						mb: { xs: 2, md: 3 },
					}}>
					<TextField
						fullWidth
						placeholder={t('searchByNameOrEmail')}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						size="small"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Search sx={{ color: '#64748B', fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
								</InputAdornment>
							),
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
								bgcolor: 'white',
								fontSize: { xs: '0.875rem', md: '1rem' },
							},
						}}
					/>
				</Paper>

				{/* Mobile View - Cards */}
				<Box sx={{ display: { xs: 'block', md: 'none' } }}>
					{filteredUsers.length === 0 ? (
						<Paper
							elevation={0}
							sx={{
								p: 8,
								textAlign: 'center',
								borderRadius: 3,
								border: '1px solid',
								borderColor: 'divider',
							}}>
							<Typography variant='body1' color='text.secondary'>
								{t('noUserFound')}
							</Typography>
						</Paper>
					) : (
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							{filteredUsers.map((user) => (
								<Card
									key={user.id}
									elevation={0}
									sx={{
										borderRadius: 3,
										border: '1px solid',
										borderColor: 'divider',
										overflow: 'hidden',
									}}>
									<CardContent sx={{ p: 3 }}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
											<Avatar
												src={user.avatar_id ? `/avatars/${user.avatar_id}.png` : null}
												sx={{
													width: 56,
													height: 56,
													bgcolor: '#667eea',
												}}>
												{user.name?.[0]?.toUpperCase() || 'U'}
											</Avatar>
											<Box sx={{ flex: 1 }}>
												<Typography
													variant='h6'
													sx={{
														fontWeight: 700,
														color: '#1E293B',
														mb: 0.5,
													}}>
													{user.name || 'Sans nom'}
												</Typography>
												<Typography
													variant='body2'
													sx={{
														color: '#64748B',
													}}>
													{user.email || 'N/A'}
												</Typography>
											</Box>
										</Box>

										<Divider sx={{ mb: 2 }} />

										<Grid container spacing={2}>
											<Grid item xs={6}>
												<Typography variant='caption' sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
													{t('role')}
												</Typography>
												<Chip
													icon={user.role === 'admin' ? <AdminPanelSettings fontSize='small' /> : <Person fontSize='small' />}
													label={user.role || 'user'}
													size='small'
													sx={{
														bgcolor: alpha(getRoleColor(user.role), 0.1),
														color: getRoleColor(user.role),
														fontWeight: 600,
														textTransform: 'capitalize',
													}}
												/>
											</Grid>

											<Grid item xs={6}>
												<Typography variant='caption' sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
													{t('premium')}
												</Typography>
												<Chip
													label={user.is_premium ? t('premium') : t('free')}
													size='small'
													sx={{
														bgcolor: user.is_premium ? alpha('#F59E0B', 0.1) : alpha('#94A3B8', 0.1),
														color: user.is_premium ? '#F59E0B' : '#64748B',
														fontWeight: 600,
														border: user.is_premium ? '1px solid' : 'none',
														borderColor: user.is_premium ? alpha('#F59E0B', 0.3) : 'transparent',
													}}
												/>
											</Grid>

											<Grid item xs={6}>
												<Typography variant='caption' sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
													{t('learnedLanguage')}
												</Typography>
												{user.spoken_language ? (
													<Chip
														label={getLanguageInfo(user.spoken_language).flag + ' ' + getLanguageInfo(user.spoken_language).name}
														size='small'
														sx={{
															bgcolor: alpha(getLanguageInfo(user.spoken_language).color, 0.1),
															color: getLanguageInfo(user.spoken_language).color,
															fontWeight: 600,
														}}
													/>
												) : (
													<Typography variant='caption' sx={{ color: '#94A3B8', fontStyle: 'italic' }}>
														{t('notDefined')}
													</Typography>
												)}
											</Grid>

											<Grid item xs={6}>
												<Typography variant='caption' sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
													{t('level')}
												</Typography>
												{user.language_level ? (
													<Chip
														label={getLevelInfo(user.language_level).name}
														size='small'
														sx={{
															bgcolor: alpha(getLevelInfo(user.language_level).color, 0.1),
															color: getLevelInfo(user.language_level).color,
															fontWeight: 600,
														}}
													/>
												) : (
													<Typography variant='caption' sx={{ color: '#94A3B8', fontStyle: 'italic' }}>
														{t('notDefined')}
													</Typography>
												)}
											</Grid>

											<Grid item xs={6}>
												<Typography variant='caption' sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
													{t('totalXP')}
												</Typography>
												<Chip
													label={user.total_xp?.toLocaleString() || '0'}
													size='small'
													sx={{
														bgcolor: alpha('#F59E0B', 0.1),
														color: '#F59E0B',
														fontWeight: 700,
													}}
												/>
											</Grid>

											<Grid item xs={6}>
												<Typography variant='caption' sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
													{t('xpLevel')}
												</Typography>
												<Chip
													label={`Niv. ${user.current_level || 1}`}
													size='small'
													sx={{
														bgcolor: alpha('#8B5CF6', 0.1),
														color: '#8B5CF6',
														fontWeight: 700,
													}}
												/>
											</Grid>

											<Grid item xs={12}>
												<Typography variant='caption' sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
													{t('creationDate')}
												</Typography>
												<Typography
													variant='body2'
													sx={{
														color: '#1E293B',
														fontWeight: 500,
													}}>
													{formatDate(user.created_at)}
												</Typography>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							))}
						</Box>
					)}
				</Box>

				{/* Desktop View - Table */}
				<Paper
					elevation={0}
					sx={{
						display: { xs: 'none', md: 'block' },
						borderRadius: 3,
						border: '1px solid',
						borderColor: 'divider',
						overflow: 'hidden',
					}}>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow
									sx={{
										bgcolor: alpha('#667eea', 0.08),
										borderBottom: '2px solid',
										borderColor: '#667eea',
										'& th': {
											fontWeight: 700,
											color: '#667eea',
											fontSize: '0.75rem',
											textTransform: 'uppercase',
											letterSpacing: '1px',
											py: 2.5,
											px: 3,
										},
									}}>
									<SortableHeader column="name">{t('user')}</SortableHeader>
									<TableCell>{t('email')}</TableCell>
									<SortableHeader column="role">{t('role')}</SortableHeader>
									<SortableHeader column="is_premium">{t('premium')}</SortableHeader>
									<TableCell>{t('learnedLanguage')}</TableCell>
									<SortableHeader column="language_level">{t('level')}</SortableHeader>
									<SortableHeader column="created_at">{t('creationDate')}</SortableHeader>
									<SortableHeader column="total_xp">{t('totalXP')}</SortableHeader>
									<SortableHeader column="current_level">{t('xpLevel')}</SortableHeader>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredUsers.length === 0 ? (
									<TableRow>
										<TableCell colSpan={9} align='center' sx={{ py: 8 }}>
											<Typography variant='body1' color='text.secondary'>
												{t('noUserFound')}
											</Typography>
										</TableCell>
									</TableRow>
								) : (
									filteredUsers.map((user) => (
										<TableRow
											key={user.id}
											sx={{
												transition: 'background-color 0.2s ease',
												'&:hover': {
													bgcolor: alpha('#667eea', 0.03),
												},
												'& td': {
													py: 2.5,
													px: 3,
													borderBottom: '1px solid',
													borderColor: '#F1F5F9',
												},
											}}>
											<TableCell>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
													<Avatar
														src={user.avatar_id ? `/avatars/${user.avatar_id}.png` : null}
														sx={{
															width: 40,
															height: 40,
															bgcolor: '#667eea',
														}}>
														{user.name?.[0]?.toUpperCase() || 'U'}
													</Avatar>
													<Typography
														sx={{
															fontWeight: 600,
															color: '#1E293B',
														}}>
														{user.name || 'Sans nom'}
													</Typography>
												</Box>
											</TableCell>
											<TableCell>
												<Typography
													sx={{
														color: '#64748B',
														fontSize: '0.875rem',
													}}>
													{user.email || 'N/A'}
												</Typography>
											</TableCell>
											<TableCell>
												<Chip
													icon={user.role === 'admin' ? <AdminPanelSettings fontSize='small' /> : <Person fontSize='small' />}
													label={user.role || 'user'}
													size='small'
													sx={{
														bgcolor: alpha(getRoleColor(user.role), 0.1),
														color: getRoleColor(user.role),
														fontWeight: 600,
														textTransform: 'capitalize',
													}}
												/>
											</TableCell>
											<TableCell>
												<Chip
													label={user.is_premium ? t('premium') : t('free')}
													size='small'
													sx={{
														bgcolor: user.is_premium ? alpha('#F59E0B', 0.1) : alpha('#94A3B8', 0.1),
														color: user.is_premium ? '#F59E0B' : '#64748B',
														fontWeight: 600,
														border: user.is_premium ? '1px solid' : 'none',
														borderColor: user.is_premium ? alpha('#F59E0B', 0.3) : 'transparent',
													}}
												/>
											</TableCell>
											<TableCell>
												{user.spoken_language ? (
													<Chip
														label={getLanguageInfo(user.spoken_language).flag + ' ' + getLanguageInfo(user.spoken_language).name}
														size='small'
														sx={{
															bgcolor: alpha(getLanguageInfo(user.spoken_language).color, 0.1),
															color: getLanguageInfo(user.spoken_language).color,
															fontWeight: 600,
														}}
													/>
												) : (
													<Typography variant='caption' sx={{ color: '#94A3B8', fontStyle: 'italic' }}>
														{t('notDefined')}
													</Typography>
												)}
											</TableCell>
											<TableCell>
												{user.language_level ? (
													<Chip
														label={getLevelInfo(user.language_level).name}
														size='small'
														sx={{
															bgcolor: alpha(getLevelInfo(user.language_level).color, 0.1),
															color: getLevelInfo(user.language_level).color,
															fontWeight: 600,
														}}
													/>
												) : (
													<Typography variant='caption' sx={{ color: '#94A3B8', fontStyle: 'italic' }}>
														{t('notDefined')}
													</Typography>
												)}
											</TableCell>
											<TableCell>
												<Typography
													sx={{
														color: '#64748B',
														fontSize: '0.875rem',
													}}>
													{formatDate(user.created_at)}
												</Typography>
											</TableCell>
											<TableCell>
												<Chip
													label={user.total_xp?.toLocaleString() || '0'}
													size='small'
													sx={{
														bgcolor: alpha('#F59E0B', 0.1),
														color: '#F59E0B',
														fontWeight: 700,
													}}
												/>
											</TableCell>
											<TableCell>
												<Chip
													label={`Niv. ${user.current_level || 1}`}
													size='small'
													sx={{
														bgcolor: alpha('#8B5CF6', 0.1),
														color: '#8B5CF6',
														fontWeight: 700,
													}}
												/>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			</Container>
		</Box>
	)
}

export default UsersPage
