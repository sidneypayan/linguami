'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import {
	Container,
	Box,
	Typography,
	TextField,
	Button,
	Paper,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	IconButton,
	Alert,
	Divider,
	Autocomplete,
} from '@mui/material'
import { Add, Delete, ArrowBack } from '@mui/icons-material'
import { useUserContext } from '@/context/user'
import { createBrowserClient } from '@/lib/supabase'
import toast from '@/utils/toast'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { logger } from '@/utils/logger'

const CreateDragDropExercise = () => {
	const router = useRouter()
	const locale = useLocale()
	const t = useTranslations('exercises')
	const { isUserAdmin, userLearningLanguage, isBootstrapping } = useUserContext()
	const supabase = createBrowserClient()

	// Form state
	const [title, setTitle] = useState('')
	const [materialId, setMaterialId] = useState('')
	const [level, setLevel] = useState('beginner')
	const [lang, setLang] = useState(userLearningLanguage || 'fr')
	const [xpReward, setXpReward] = useState(10)
	const [questions, setQuestions] = useState([
		{
			id: 1,
			instruction: '',
			pairs: [
				{ id: 'pair-1', left: '', right: '' },
				{ id: 'pair-2', left: '', right: '' }
			],
			explanation: ''
		}
	])

	// Materials list for dropdown
	const [materials, setMaterials] = useState([])
	const [loading, setLoading] = useState(false)

	// Load materials
	useEffect(() => {
		const loadMaterials = async () => {
			const { data, error } = await supabase
				.from('materials')
				.select('id, title, section, lang')
				.eq('lang', lang)
				.order('section', { ascending: true })
				.order('id', { ascending: false })

			if (!error && data) {
				setMaterials(data)
			}
		}

		if (lang) {
			loadMaterials()
		}
	}, [lang])

	// Redirect if not admin
	useEffect(() => {
		if (!isBootstrapping && !isUserAdmin) {
			router.push(`/${locale}`)
		}
	}, [isUserAdmin, isBootstrapping, router, locale])

	// Add new question
	const addQuestion = () => {
		const newId = questions.length + 1
		setQuestions([
			...questions,
			{
				id: newId,
				instruction: '',
				pairs: [
					{ id: `pair-${newId}-1`, left: '', right: '' },
					{ id: `pair-${newId}-2`, left: '', right: '' }
				],
				explanation: ''
			}
		])
	}

	// Remove question
	const removeQuestion = (index) => {
		setQuestions(questions.filter((_, i) => i !== index))
	}

	// Update question
	const updateQuestion = (index, field, value) => {
		const updated = [...questions]
		updated[index][field] = value
		setQuestions(updated)
	}

	// Add pair to question
	const addPair = (questionIndex) => {
		const updated = [...questions]
		const pairCount = updated[questionIndex].pairs.length
		const newId = `pair-${questionIndex}-${pairCount + 1}`
		updated[questionIndex].pairs.push({
			id: newId,
			left: '',
			right: ''
		})
		setQuestions(updated)
	}

	// Remove pair from question
	const removePair = (questionIndex, pairIndex) => {
		const updated = [...questions]
		updated[questionIndex].pairs = updated[questionIndex].pairs
			.filter((_, i) => i !== pairIndex)
		setQuestions(updated)
	}

	// Update pair left item
	const updatePairLeft = (questionIndex, pairIndex, text) => {
		const updated = [...questions]
		updated[questionIndex].pairs[pairIndex].left = text
		setQuestions(updated)
	}

	// Update pair right item
	const updatePairRight = (questionIndex, pairIndex, text) => {
		const updated = [...questions]
		updated[questionIndex].pairs[pairIndex].right = text
		setQuestions(updated)
	}

	// Validate form
	const validateForm = () => {
		if (!title.trim()) {
			toast.error(t('titleRequired'))
			return false
		}

		for (let i = 0; i < questions.length; i++) {
			const q = questions[i]
			if (!q.instruction.trim()) {
				toast.error(t('instructionRequired', { number: i + 1 }))
				return false
			}

			if (q.pairs.length < 2) {
				toast.error(t('minPairsRequired', { number: i + 1 }))
				return false
			}

			for (let j = 0; j < q.pairs.length; j++) {
				if (!q.pairs[j].left.trim()) {
					toast.error(t('leftItemRequired', { number: i + 1, pair: j + 1 }))
					return false
				}
				if (!q.pairs[j].right.trim()) {
					toast.error(t('rightItemRequired', { number: i + 1, pair: j + 1 }))
					return false
				}
			}
		}

		return true
	}

	// Submit form
	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!validateForm()) return

		setLoading(true)

		try {
			const { data, error } = await supabase
				.from('exercises')
				.insert({
					material_id: materialId || null,
					type: 'drag_and_drop',
					title,
					level,
					lang,
					data: { questions },
					xp_reward: xpReward
				})
				.select()

			if (error) throw error

			toast.success(t('createSuccess'))
			router.push(`/${locale}/admin/exercises`)
		} catch (error) {
			logger.error('Error creating exercise:', error)
			toast.error(t('createError'))
		} finally {
			setLoading(false)
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

	return (
		<>
			<AdminNavbar />

			<Container maxWidth="lg" sx={{ pt: { xs: '4rem', md: '7rem' }, pb: 4 }}>
				<Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
					<IconButton onClick={() => router.back()}>
						<ArrowBack />
					</IconButton>
					<Typography variant="h4" sx={{ fontWeight: 700 }}>
						{t('createDragDropTitle')}
					</Typography>
				</Box>

				<Alert severity="info" sx={{ mb: 3 }}>
					<strong>{t('dragDropInfo')}</strong>
					<ul style={{ marginTop: '8px', marginBottom: 0 }}>
						<li>{t('dragDropStep1')}</li>
						<li>{t('dragDropStep2')}</li>
						<li>{t('dragDropStep3')}</li>
						<li>{t('dragDropStep4')}</li>
					</ul>
				</Alert>

				<Paper
					component="form"
					onSubmit={handleSubmit}
					elevation={0}
					sx={{
						p: { xs: 3, md: 4 },
						borderRadius: 4,
						border: '1px solid rgba(139, 92, 246, 0.2)',
					}}>
					{/* Basic info */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
							{t('generalInfo')}
						</Typography>

						<TextField
							fullWidth
							label={t('exerciseTitleLabel')}
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							sx={{ mb: 2 }}
							required
						/>

						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
							<FormControl fullWidth>
								<InputLabel>{t('languageLabel')}</InputLabel>
								<Select
									value={lang}
									label={t('languageLabel')}
									onChange={(e) => setLang(e.target.value)}>
									<MenuItem value="fr">{t('french')}</MenuItem>
									<MenuItem value="ru">{t('russian')}</MenuItem>
									<MenuItem value="en">{t('english')}</MenuItem>
								</Select>
							</FormControl>

							<FormControl fullWidth>
								<InputLabel>{t('levelLabel')}</InputLabel>
								<Select
									value={level}
									label={t('levelLabel')}
									onChange={(e) => setLevel(e.target.value)}>
									<MenuItem value="beginner">{t('beginner')}</MenuItem>
									<MenuItem value="intermediate">{t('intermediate')}</MenuItem>
									<MenuItem value="advanced">{t('advanced')}</MenuItem>
								</Select>
							</FormControl>
						</Box>

						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2 }}>
							<Autocomplete
								fullWidth
								options={[{ id: '', title: t('none'), section: '' }, ...materials]}
								groupBy={(option) => option.section || 'other'}
								getOptionLabel={(option) => {
									if (typeof option === 'string') return option
									if (!option.id) return option.title
									return `#${option.id} - ${option.title}`
								}}
								value={materials.find(m => m.id === materialId) || { id: '', title: t('none'), section: '' }}
								onChange={(e, newValue) => setMaterialId(newValue?.id || '')}
								renderInput={(params) => (
									<TextField
										{...params}
										label={t('associatedMaterial')}
										placeholder="Rechercher par ID ou titre..."
									/>
								)}
								renderGroup={(params) => (
									<li key={params.key}>
										<Box sx={{
											position: 'sticky',
											top: -8,
											padding: '8px 16px',
											bgcolor: 'background.paper',
											fontWeight: 700,
											color: '#8b5cf6',
											fontSize: '0.875rem',
											zIndex: 10
										}}>
											{params.group}
										</Box>
										<ul style={{ padding: 0 }}>{params.children}</ul>
									</li>
								)}
								isOptionEqualToValue={(option, value) => option.id === value.id}
							/>

							<TextField
								fullWidth
								type="number"
								label={t('xpReward')}
								value={xpReward}
								onChange={(e) => setXpReward(parseInt(e.target.value))}
								inputProps={{ min: 1, max: 100 }}
							/>
						</Box>
					</Box>

					<Divider sx={{ mb: 4 }} />

					{/* Questions */}
					<Box>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
							<Typography variant="h6" sx={{ fontWeight: 600 }}>
								{t('questionsCount')} ({questions.length})
							</Typography>
							<Button
								variant="outlined"
								startIcon={<Add />}
								onClick={addQuestion}>
								{t('addQuestion')}
							</Button>
						</Box>

						{questions.map((question, qIndex) => (
							<Paper
								key={question.id}
								elevation={0}
								sx={{
									p: 3,
									mb: 3,
									border: '1px solid rgba(139, 92, 246, 0.1)',
									borderRadius: 3,
								}}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										{t('question')} {qIndex + 1}
									</Typography>
									{questions.length > 1 && (
										<IconButton
											color="error"
											size="small"
											onClick={() => removeQuestion(qIndex)}>
											<Delete />
										</IconButton>
									)}
								</Box>

								<TextField
									fullWidth
									label={t('instructionLabel')}
									value={question.instruction}
									onChange={(e) => updateQuestion(qIndex, 'instruction', e.target.value)}
									sx={{ mb: 3 }}
									required
									helperText="Ex: 'Associez les mots avec leur traduction'"
								/>

								{/* Pairs */}
								<Box sx={{ mb: 2 }}>
									<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
										<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
											{t('pairsCount', { count: question.pairs.length })}
										</Typography>
										<Button
											size="small"
											startIcon={<Add />}
											onClick={() => addPair(qIndex)}>
											{t('addPair')}
										</Button>
									</Box>

									{question.pairs.map((pair, pIndex) => (
										<Box
											key={pair.id}
											sx={{
												mb: 2,
												p: 2,
												backgroundColor: 'rgba(139, 92, 246, 0.05)',
												borderRadius: 2,
											}}>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
												<Typography
													variant="body2"
													sx={{
														fontWeight: 600,
														minWidth: '80px',
														color: '#8b5cf6'
													}}>
													{t('pairs')} {pIndex + 1}
												</Typography>
												{question.pairs.length > 2 && (
													<IconButton
														size="small"
														color="error"
														onClick={() => removePair(qIndex, pIndex)}
														sx={{ ml: 'auto' }}>
														<Delete fontSize="small" />
													</IconButton>
												)}
											</Box>
											<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
												<TextField
													fullWidth
													label={t('leftItem', { number: pIndex + 1 })}
													placeholder="Ex: Bonjour"
													value={pair.left}
													onChange={(e) => updatePairLeft(qIndex, pIndex, e.target.value)}
													size="small"
													required
												/>
												<TextField
													fullWidth
													label={t('rightItem', { number: pIndex + 1 })}
													placeholder="Ex: Привет"
													value={pair.right}
													onChange={(e) => updatePairRight(qIndex, pIndex, e.target.value)}
													size="small"
													required
												/>
											</Box>
										</Box>
									))}
								</Box>

								<TextField
									fullWidth
									multiline
									rows={2}
									label={t('explanation')}
									value={question.explanation}
									onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
									helperText={t('explanationHelper')}
								/>
							</Paper>
						))}
					</Box>

					{/* Submit button */}
					<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
						<Button
							variant="outlined"
							onClick={() => router.back()}
							disabled={loading}>
							{t('cancel')}
						</Button>
						<Button
							type="submit"
							variant="contained"
							disabled={loading}
							sx={{
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								px: 4,
							}}>
							{loading ? t('creating') : t('createExercise')}
						</Button>
					</Box>
				</Paper>
			</Container>
		</>
	)
}

export default CreateDragDropExercise
