import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
} from '@mui/material'
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import { useUserContext } from '../../../context/user'
import { createBrowserClient } from '../../../lib/supabase'
import { toast } from 'react-toastify'
import Head from 'next/head'
import LoadingSpinner from '../../../components/LoadingSpinner'
import AdminNavbar from '../../../components/admin/AdminNavbar'
import useTranslation from 'next-translate/useTranslation'

const ExercisesAdmin = () => {
	const router = useRouter()
	const { t } = useTranslation('exercises')
	const { isUserAdmin, isBootstrapping } = useUserContext()
	const supabase = createBrowserClient()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const [exercises, setExercises] = useState([])
	const [loading, setLoading] = useState(true)

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
				console.error('Error loading exercises:', error)
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
			router.push('/')
		}
	}, [isUserAdmin, isBootstrapping, router])

	// Delete exercise
	const handleDelete = async (id) => {
		if (!confirm(t('deleteConfirm'))) return

		const { error } = await supabase
			.from('exercises')
			.delete()
			.eq('id', id)

		if (error) {
			console.error('Error deleting exercise:', error)
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
			<Head>
				<title>Exercices | Linguami Admin</title>
			</Head>

			<AdminNavbar activePage="exercises" />

			<Container maxWidth="lg" sx={{ pt: { xs: '2rem', md: '4rem' }, pb: 4 }}>
				<Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
					<Typography variant="h4" sx={{ fontWeight: 700 }}>
						{t('title')}
					</Typography>
					<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
						<Button
							variant="contained"
							startIcon={<Add />}
							onClick={() => router.push('/admin/exercises/create-fitb')}
							sx={{
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								px: 3,
							}}>
							{t('createFillInBlank')}
						</Button>
						<Button
							variant="contained"
							startIcon={<Add />}
							onClick={() => router.push('/admin/exercises/create-mcq')}
							sx={{
								background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
								px: 3,
							}}>
							{t('createMCQ')}
						</Button>
						<Button
							variant="contained"
							startIcon={<Add />}
							onClick={() => router.push('/admin/exercises/create-drag-drop')}
							sx={{
								background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
								px: 3,
							}}>
							Drag & Drop
						</Button>
					</Box>
				</Box>

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
									<TableCell sx={{ fontWeight: 700 }}>{t('id')}</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>{t('exerciseTitle')}</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>{t('type')}</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>{t('level')}</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>{t('language')}</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>{t('material')}</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>{t('questions')}</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>{t('xp')}</TableCell>
									<TableCell sx={{ fontWeight: 700 }} align="right">{t('actions')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{exercises.map((exercise) => (
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
												onClick={() => router.push(`/admin/exercises/preview/${exercise.id}`)}
												title={t('preview')}>
												<Visibility fontSize="small" />
											</IconButton>
											<IconButton
												size="small"
												onClick={() => router.push(`/admin/exercises/edit/${exercise.id}`)}
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
