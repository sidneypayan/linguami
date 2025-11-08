import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Container, Box, Typography, IconButton, Alert } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useUserContext } from '../../../../context/user'
import { createBrowserClient } from '../../../../lib/supabase'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import LoadingSpinner from '../../../../components/LoadingSpinner'
import AdminNavbar from '../../../../components/admin/AdminNavbar'
import FillInTheBlank from '../../../../components/exercises/FillInTheBlank'
import MultipleChoice from '../../../../components/exercises/MultipleChoice'
import DragAndDrop from '../../../../components/exercises/DragAndDrop'

const PreviewExercise = () => {
	const router = useRouter()
	const { id } = router.query
	const { t } = useTranslation('exercises')
	const { isUserAdmin, isBootstrapping } = useUserContext()
	const supabase = createBrowserClient()

	const [exercise, setExercise] = useState(null)
	const [loading, setLoading] = useState(true)

	// Load exercise
	useEffect(() => {
		const loadExercise = async () => {
			if (!id) return

			setLoading(true)
			const { data, error } = await supabase
				.from('exercises')
				.select('*')
				.eq('id', id)
				.single()

			if (error) {
				console.error('Error loading exercise:', error)
			} else {
				setExercise(data)
			}
			setLoading(false)
		}

		if (isUserAdmin && id) {
			loadExercise()
		}
	}, [id, isUserAdmin])

	// Redirect if not admin
	useEffect(() => {
		if (!isBootstrapping && !isUserAdmin) {
			router.push('/')
		}
	}, [isUserAdmin, isBootstrapping, router])

	// Handle completion (preview mode - no XP awarded)
	const handleComplete = (result) => {
		console.log('Exercise completed (preview mode):', result)
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

	if (!exercise) {
		return (
			<>
				<AdminNavbar />
				<Container maxWidth="lg" sx={{ pt: { xs: '4rem', md: '7rem' }, pb: 4 }}>
					<Alert severity="error">{t('exerciseNotFound')}</Alert>
				</Container>
			</>
		)
	}

	return (
		<>
			<Head>
				<title>{t('previewTitle')} - {exercise.title} | Linguami Admin</title>
			</Head>
			<AdminNavbar />

			<Container maxWidth="md" sx={{ pt: { xs: '4rem', md: '7rem' }, pb: 4 }}>
				<Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
					<IconButton onClick={() => router.back()}>
						<ArrowBack />
					</IconButton>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 700 }}>
							{exercise.title}
						</Typography>
						<Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
							{t('previewMode')}
						</Typography>
					</Box>
				</Box>

				<Alert severity="info" sx={{ mb: 3 }}>
					{t('previewInfo')}
				</Alert>

				{exercise.type === 'fill_in_blank' && (
					<FillInTheBlank
						exercise={exercise}
						onComplete={handleComplete}
					/>
				)}
				{exercise.type === 'mcq' && (
					<MultipleChoice
						exercise={exercise}
						onComplete={handleComplete}
					/>
				)}
				{exercise.type === 'drag_and_drop' && (
					<DragAndDrop
						exercise={exercise}
						onComplete={handleComplete}
					/>
				)}
			</Container>
		</>
	)
}

export default PreviewExercise
