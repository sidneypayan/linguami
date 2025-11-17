'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import {
	Container,
	Box,
	Typography,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Chip,
	IconButton,
	Alert,
	useTheme,
	TextField,
	InputAdornment,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
	TableSortLabel,
} from '@mui/material'
import { Add, Edit, Delete, Visibility, Search, FilterList } from '@mui/icons-material'
import { useUserContext } from '@/context/user'
import { createBrowserClient } from '@/lib/supabase'
import toast from '@/utils/toast'
import LoadingSpinner from '@/components/LoadingSpinner'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { logger } from '@/utils/logger'

const ExercisesAdmin = () => {
	const router = useRouter()
	const locale = useLocale()
	const t = useTranslations('exercises')
	const { isUserAdmin, isBootstrapping } = useUserContext()
	const supabase = createBrowserClient()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const [exercises, setExercises] = useState([])
	const [loading, setLoading] = useState(true)

	// Filters and sorting
	const [searchQuery, setSearchQuery] = useState('')
	const [typeFilter, setTypeFilter] = useState('all')
	const [levelFilter, setLevelFilter] = useState('all')
	const [langFilter, setLangFilter] = useState('all')
	const [materialFilter, setMaterialFilter] = useState('all')
	const [sectionFilter, setSectionFilter] = useState('all')
	const [orderBy, setOrderBy] = useState('created_at')
	const [order, setOrder] = useState('desc')

	// Load exercises
	useEffect(() => {
		const loadExercises = async () => {
			setLoading(true)
			const { data, error } = await supabase
				.from('exercises')
				.select(`
					*,
					materials (
						id,
						title,
						section
					)
				`)
				.order('created_at', { ascending: false })

			if (error) {
				logger.error('Error loading exercises:', error)
				toast.error(t('loadError'))
			} else {
				setExercises(data || [])
			}
			setLoading(false)
		}

		if (isUserAdmin) {
			loadExercises()
		}
	}, [isUserAdmin])

	// Redirect if not admin
	useEffect(() => {
		if (!isBootstrapping && !isUserAdmin) {
			router.push(`/${locale}`)
		}
	}, [isUserAdmin, isBootstrapping, router, locale])

	// Delete exercise
	const handleDelete = async (id) => {
		if (!confirm(t('deleteConfirm'))) return

		const { error } = await supabase
			.from('exercises')
			.delete()
			.eq('id', id)

		if (error) {
			logger.error('Error deleting exercise:', error)
			toast.error(t('deleteError'))
		} else {
			toast.success(t('deleteSuccess'))
			setExercises(exercises.filter(e => e.id !== id))
		}
	}

	// Get level badge color
	const getLevelColor = (level) => {
		switch (level) {
			case 'beginner': return 'success'
			case 'intermediate': return 'warning'
			case 'advanced': return 'error'
			default: return 'default'
		}
	}

	// Get unique sections from exercises
	const uniqueSections = useMemo(() => {
		const sections = exercises
			.filter(ex => ex.materials?.section)
			.map(ex => ex.materials.section)
		return [...new Set(sections)].sort()
	}, [exercises])

	// Filter and sort exercises
	const filteredAndSortedExercises = useMemo(() => {
		let filtered = exercises.filter(exercise => {
			// Search filter - searches in material title and IDs
			if (searchQuery) {
				const query = searchQuery.toLowerCase()
				const materialTitle = exercise.materials?.title?.toLowerCase() || ''
				const exerciseId = exercise.id.toString()
				const materialId = exercise.materials?.id?.toString() || ''

				const matchesSearch =
					materialTitle.includes(query) ||
					exerciseId.includes(query) ||
					materialId.includes(query)

				if (!matchesSearch) {
					return false
				}
			}

			// Type filter
			if (typeFilter !== 'all' && exercise.type !== typeFilter) {
				return false
			}

			// Level filter
			if (levelFilter !== 'all' && exercise.level !== levelFilter) {
				return false
			}

			// Language filter
			if (langFilter !== 'all' && exercise.lang !== langFilter) {
				return false
			}

			// Material filter
			if (materialFilter === 'linked' && !exercise.materials) {
				return false
			}
			if (materialFilter === 'unlinked' && exercise.materials) {
				return false
			}

			// Section filter
			if (sectionFilter !== 'all' && exercise.materials?.section !== sectionFilter) {
				return false
			}

			return true
		})

		// Sort
		filtered.sort((a, b) => {
			let aValue, bValue

			switch (orderBy) {
				case 'id':
					aValue = a.id
					bValue = b.id
					break
				case 'title':
					aValue = a.title.toLowerCase()
					bValue = b.title.toLowerCase()
					break
				case 'type':
					aValue = a.type
					bValue = b.type
					break
				case 'level':
					const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 }
					aValue = levelOrder[a.level] || 0
					bValue = levelOrder[b.level] || 0
					break
				case 'lang':
					aValue = a.lang
					bValue = b.lang
					break
				case 'questions':
					aValue = a.data?.questions?.length || 0
					bValue = b.data?.questions?.length || 0
					break
				case 'xp':
					aValue = a.xp_reward
					bValue = b.xp_reward
					break
				case 'created_at':
				default:
					aValue = new Date(a.created_at)
					bValue = new Date(b.created_at)
					break
			}

			if (aValue < bValue) return order === 'asc' ? -1 : 1
			if (aValue > bValue) return order === 'asc' ? 1 : -1
			return 0
		})

		return filtered
	}, [exercises, searchQuery, typeFilter, levelFilter, langFilter, materialFilter, sectionFilter, orderBy, order])

	// Handle sort request
	const handleRequestSort = (property) => {
		const isAsc = orderBy === property && order === 'asc'
		setOrder(isAsc ? 'desc' : 'asc')
		setOrderBy(property)
	}

	// Reset all filters
	const handleResetFilters = () => {
		setSearchQuery('')
		setTypeFilter('all')
		setLevelFilter('all')
		setLangFilter('all')
		setMaterialFilter('all')
		setSectionFilter('all')
		setOrderBy('created_at')
		setOrder('desc')
	}

	// Show nothing while bootstrapping
	if (isBootstrapping) {
		return null
	}

	// Redirect happened or not admin
	if (!isUserAdmin) {
		return null
	}

	if (loading) {
		return <LoadingSpinner />
	}

	return (
		<>
			<AdminNavbar activePage="exercises" />

			<Container maxWidth="xl" sx={{ pt: { xs: '2rem', md: '4rem' }, pb: 4 }}>
				<Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
					<Typography variant="h4" sx={{ fontWeight: 700 }}>
						{t('title')} ({filteredAndSortedExercises.length})
					</Typography>
					<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
						<Button
							variant="contained"
							startIcon={<Add />}
							onClick={() => router.push(`/${locale}/admin/exercises/create-fitb`)}
							sx={{
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								px: 3,
							}}>
							{t('createFillInBlank')}
						</Button>
						<Button
							variant="contained"
							startIcon={<Add />}
							onClick={() => router.push(`/${locale}/admin/exercises/create-mcq`)}
							sx={{
								background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
								px: 3,
							}}>
							{t('createMCQ')}
						</Button>
						<Button
							variant="contained"
							startIcon={<Add />}
							onClick={() => router.push(`/${locale}/admin/exercises/create-drag-drop`)}
							sx={{
								background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
								px: 3,
							}}>
							Drag & Drop
						</Button>
					</Box>
				</Box>

				{/* Filters Section */}
				<Paper
					elevation={0}
					sx={{
						p: 3,
						mb: 3,
						borderRadius: 3,
						border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
						background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'white',
					}}>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
						<FilterList />
						<Typography variant="h6" sx={{ fontWeight: 600 }}>
							Filtres et recherche
						</Typography>
					</Box>

					<Grid container spacing={2}>
						{/* Search */}
						<Grid item xs={12} md={6} lg={3}>
							<TextField
								fullWidth
								size="small"
								placeholder="Rechercher par titre de matériel ou ID..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Search />
										</InputAdornment>
									),
								}}
							/>
						</Grid>

						{/* Type Filter */}
						<Grid item xs={12} sm={6} md={3} lg={2}>
							<FormControl fullWidth size="small">
								<InputLabel>Type</InputLabel>
								<Select
									value={typeFilter}
									label="Type"
									onChange={(e) => setTypeFilter(e.target.value)}>
									<MenuItem value="all">Tous</MenuItem>
									<MenuItem value="mcq">QCM</MenuItem>
									<MenuItem value="fill_in_blank">Texte à trous</MenuItem>
									<MenuItem value="drag_and_drop">Glisser-déposer</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						{/* Level Filter */}
						<Grid item xs={12} sm={6} md={3} lg={2}>
							<FormControl fullWidth size="small">
								<InputLabel>Niveau</InputLabel>
								<Select
									value={levelFilter}
									label="Niveau"
									onChange={(e) => setLevelFilter(e.target.value)}>
									<MenuItem value="all">Tous</MenuItem>
									<MenuItem value="beginner">Débutant</MenuItem>
									<MenuItem value="intermediate">Intermédiaire</MenuItem>
									<MenuItem value="advanced">Avancé</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						{/* Language Filter */}
						<Grid item xs={12} sm={6} md={3} lg={1.5}>
							<FormControl fullWidth size="small">
								<InputLabel>Langue</InputLabel>
								<Select
									value={langFilter}
									label="Langue"
									onChange={(e) => setLangFilter(e.target.value)}>
									<MenuItem value="all">Toutes</MenuItem>
									<MenuItem value="fr">FR</MenuItem>
									<MenuItem value="ru">RU</MenuItem>
									<MenuItem value="en">EN</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						{/* Material Filter */}
						<Grid item xs={12} sm={6} md={3} lg={1.5}>
							<FormControl fullWidth size="small">
								<InputLabel>Matériau</InputLabel>
								<Select
									value={materialFilter}
									label="Matériau"
									onChange={(e) => setMaterialFilter(e.target.value)}>
									<MenuItem value="all">Tous</MenuItem>
									<MenuItem value="linked">Liés</MenuItem>
									<MenuItem value="unlinked">Non liés</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						{/* Section Filter */}
						<Grid item xs={12} sm={6} md={3} lg={2}>
							<FormControl fullWidth size="small">
								<InputLabel>Section</InputLabel>
								<Select
									value={sectionFilter}
									label="Section"
									onChange={(e) => setSectionFilter(e.target.value)}>
									<MenuItem value="all">Toutes</MenuItem>
									{uniqueSections.map(section => (
										<MenuItem key={section} value={section}>
											{section}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					</Grid>

					{/* Reset Button */}
					<Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
						<Button
							size="small"
							onClick={handleResetFilters}
							sx={{ textTransform: 'none' }}>
							Réinitialiser les filtres
						</Button>
					</Box>
				</Paper>

				{exercises.length === 0 ? (
					<Alert severity="info">
						{t('noExercises')}
					</Alert>
				) : (
					<TableContainer
						component={Paper}
						elevation={0}
						sx={{
							borderRadius: 3,
							border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
							background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'white',
						}}
					>
						<Table>
							<TableHead>
								<TableRow
									sx={{
										backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.05)'
									}}
								>
									<TableCell sx={{ fontWeight: 700 }}>
										<TableSortLabel
											active={orderBy === 'id'}
											direction={orderBy === 'id' ? order : 'asc'}
											onClick={() => handleRequestSort('id')}>
											{t('id')}
										</TableSortLabel>
									</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>
										<TableSortLabel
											active={orderBy === 'title'}
											direction={orderBy === 'title' ? order : 'asc'}
											onClick={() => handleRequestSort('title')}>
											{t('exerciseTitle')}
										</TableSortLabel>
									</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>
										<TableSortLabel
											active={orderBy === 'type'}
											direction={orderBy === 'type' ? order : 'asc'}
											onClick={() => handleRequestSort('type')}>
											{t('type')}
										</TableSortLabel>
									</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>
										<TableSortLabel
											active={orderBy === 'level'}
											direction={orderBy === 'level' ? order : 'asc'}
											onClick={() => handleRequestSort('level')}>
											{t('level')}
										</TableSortLabel>
									</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>
										<TableSortLabel
											active={orderBy === 'lang'}
											direction={orderBy === 'lang' ? order : 'asc'}
											onClick={() => handleRequestSort('lang')}>
											{t('language')}
										</TableSortLabel>
									</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>{t('material')}</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>
										<TableSortLabel
											active={orderBy === 'questions'}
											direction={orderBy === 'questions' ? order : 'asc'}
											onClick={() => handleRequestSort('questions')}>
											{t('questions')}
										</TableSortLabel>
									</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>
										<TableSortLabel
											active={orderBy === 'xp'}
											direction={orderBy === 'xp' ? order : 'asc'}
											onClick={() => handleRequestSort('xp')}>
											{t('xp')}
										</TableSortLabel>
									</TableCell>
									<TableCell sx={{ fontWeight: 700 }} align="right">{t('actions')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredAndSortedExercises.map((exercise) => (
									<TableRow key={exercise.id} hover>
										<TableCell>#{exercise.id}</TableCell>
										<TableCell>
											<Typography sx={{ fontWeight: 600 }}>
												{exercise.title}
											</Typography>
										</TableCell>
										<TableCell>
											<Chip
												label={
													exercise.type === 'fill_in_blank' ? t('fillInBlankType') :
													exercise.type === 'mcq' ? t('mcqType') :
													exercise.type === 'drag_and_drop' ? t('dragDropType') :
													exercise.type
												}
												size="small"
												color="primary"
												variant="outlined"
											/>
										</TableCell>
										<TableCell>
											<Chip
												label={t(exercise.level)}
												size="small"
												color={getLevelColor(exercise.level)}
											/>
										</TableCell>
										<TableCell>
											<Chip label={exercise.lang.toUpperCase()} size="small" />
										</TableCell>
										<TableCell>
											{exercise.materials ? (
												<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
													#{exercise.materials.id} - {exercise.materials.title}
												</Typography>
											) : (
												<Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
													{t('notLinked')}
												</Typography>
											)}
										</TableCell>
										<TableCell>
											{exercise.data?.questions?.length || 0}
										</TableCell>
										<TableCell>
											<Chip label={`+${exercise.xp_reward} XP`} size="small" color="secondary" />
										</TableCell>
										<TableCell align="right">
											<IconButton
												size="small"
												onClick={() => router.push(`/${locale}/admin/exercises/preview/${exercise.id}`)}
												title={t('preview')}>
												<Visibility fontSize="small" />
											</IconButton>
											<IconButton
												size="small"
												onClick={() => router.push(`/${locale}/admin/exercises/edit/${exercise.id}`)}
												title={t('edit')}>
												<Edit fontSize="small" />
											</IconButton>
											<IconButton
												size="small"
												color="error"
												onClick={() => handleDelete(exercise.id)}
												title={t('delete')}>
												<Delete fontSize="small" />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</Container>
		</>
	)
}

export default ExercisesAdmin
