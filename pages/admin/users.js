import { createServerClient } from '@supabase/ssr'
import { useState } from 'react'
import loadNamespaces from 'next-translate/loadNamespaces'
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
	IconButton,
	Tooltip,
} from '@mui/material'
import { Search, Person, AdminPanelSettings, ArrowUpward, ArrowDownward, UnfoldMore } from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'
import AdminNavbar from '../../components/admin/AdminNavbar'

const UsersPage = ({ users }) => {
	const { t } = useTranslation('admin')
	const [searchQuery, setSearchQuery] = useState('')
	const [sortBy, setSortBy] = useState('created_at') // 'created_at', 'name', 'role', 'total_xp', 'current_level', 'language_level', 'is_premium'
	const [sortOrder, setSortOrder] = useState('desc') // 'asc' or 'desc'

	const handleSort = (column) => {
		if (sortBy === column) {
			// Si on clique sur la même colonne, inverser l'ordre
			setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
		} else {
			// Nouvelle colonne, définir l'ordre par défaut
			setSortBy(column)
			// Par défaut décroissant pour les nombres, croissant pour le texte
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
					// Premium en premier (true > false)
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
					// Ordre: beginner < intermediate < advanced
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

			// Comparaison
			let result = 0
			if (compareA < compareB) result = -1
			else if (compareA > compareB) result = 1

			// Appliquer l'ordre
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
		// Utiliser les traductions de common.json pour les niveaux
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

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: '#F8FAFC',
			}}>
			{/* Admin Navbar */}
			<AdminNavbar activePage="users" />

			<Container maxWidth="xl" sx={{ py: 4 }}>
				{/* Page Header */}
				<Box sx={{ mb: 4 }}>
					<Typography
						variant='h4'
						sx={{
							fontWeight: 700,
							color: '#1E293B',
							mb: 1,
						}}>
						{t('usersManagement')}
					</Typography>
					<Typography
						variant='body1'
						sx={{
							color: '#64748B',
						}}>
						{users.length} {users.length > 1 ? t('registeredUsersPlural') : t('registeredUsers')}
					</Typography>
				</Box>

				{/* Search Bar */}
				<Paper
					elevation={0}
					sx={{
						p: 3,
						borderRadius: 3,
						border: '1px solid',
						borderColor: 'divider',
						mb: 3,
					}}>
					<TextField
						fullWidth
						placeholder={t('searchByNameOrEmail')}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Search sx={{ color: '#64748B' }} />
								</InputAdornment>
							),
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
								bgcolor: 'white',
							},
						}}
					/>
				</Paper>

				{/* Users Table */}
				<Paper
					elevation={0}
					sx={{
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

export const getServerSideProps = async ({ req, res }) => {
	// Créer un client Supabase pour le serveur
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name) {
					return req.cookies[name]
				},
				set(name, value, options) {
					const cookieOptions = []
					if (options?.maxAge) cookieOptions.push(`Max-Age=${options.maxAge}`)
					if (options?.path) cookieOptions.push(`Path=${options.path}`)
					if (options?.domain) cookieOptions.push(`Domain=${options.domain}`)
					if (options?.secure) cookieOptions.push('Secure')
					if (options?.httpOnly) cookieOptions.push('HttpOnly')
					if (options?.sameSite)
						cookieOptions.push(`SameSite=${options.sameSite}`)

					const cookieString = `${name}=${value}${
						cookieOptions.length ? '; ' + cookieOptions.join('; ') : ''
					}`
					res.setHeader('Set-Cookie', cookieString)
				},
				remove(name, options) {
					res.setHeader('Set-Cookie', `${name}=; Path=/; Max-Age=0`)
				},
			},
		}
	)

	// Récupérer l'utilisateur connecté
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (!user || authError) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	// Récupérer le profil utilisateur
	const { data: userProfile, error: userError } = await supabase
		.from('users_profile')
		.select('*')
		.eq('id', user.id)
		.single()

	if (userError || userProfile?.role !== 'admin') {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	// Récupérer tous les utilisateurs avec leurs informations XP
	const { data: usersProfile, error: usersError } = await supabase
		.from('users_profile')
		.select(`
			id,
			name,
			email,
			role,
			is_premium,
			spoken_language,
			language_level,
			avatar_id,
			created_at
		`)
		.order('created_at', { ascending: false })

	if (usersError) {
		console.error('Error fetching users:', usersError)
		return {
			props: {
				users: [],
			},
		}
	}

	// Récupérer les informations XP pour chaque utilisateur
	const { data: xpProfiles, error: xpError } = await supabase
		.from('user_xp_profile')
		.select('user_id, total_xp, current_level')

	const xpMap = {}
	if (!xpError && xpProfiles) {
		xpProfiles.forEach(xp => {
			xpMap[xp.user_id] = {
				total_xp: xp.total_xp,
				current_level: xp.current_level,
			}
		})
	}

	// Combiner les données
	const users = usersProfile.map(user => ({
		...user,
		total_xp: xpMap[user.id]?.total_xp || 0,
		current_level: xpMap[user.id]?.current_level || 1,
	}))

	return {
		props: {
			users,
			...(await loadNamespaces({ ...{ req, res }, pathname: '/admin/users', loaderName: 'getServerSideProps' })),
		},
	}
}

export default UsersPage
