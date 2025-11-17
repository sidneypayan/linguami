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
	Radio,
	RadioGroup,
	FormControlLabel,
	Autocomplete,
} from '@mui/material'
import { Add, Delete, ArrowBack } from '@mui/icons-material'
import { useUserContext } from '@/context/user'
import { createBrowserClient } from '@/lib/supabase'
import toast from '@/utils/toast'
import { logger } from '@/utils/logger'

const CreateMCQExercise = () => {
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
			question: '',
			options: [
				{ key: 'A', text: '' },
				{ key: 'B', text: '' }
			],
			correctAnswer: 'A',
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
		setQuestions([
			...questions,
			{
				id: questions.length + 1,
				question: '',
				options: [
					{ key: 'A', text: '' },
					{ key: 'B', text: '' }
				],
				correctAnswer: 'A',
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

	// Update option text
	const updateOption = (questionIndex, optionKey, value) => {
		const updated = [...questions]
		const optionIndex = updated[questionIndex].options.findIndex(o => o.key === optionKey)
		if (optionIndex !== -1) {
			updated[questionIndex].options[optionIndex].text = value
		}
		setQuestions(updated)
	}

	// Add option to question
	const addOption = (questionIndex) => {
		const updated = [...questions]
		const currentOptions = updated[questionIndex].options
		const nextKey = String.fromCharCode(65 + currentOptions.length) // A, B, C, D, E...
		updated[questionIndex].options.push({ key: nextKey, text: '' })
		setQuestions(updated)
	}

	// Remove option from question
	const removeOption = (questionIndex, optionKey) => {
		const updated = [...questions]
		updated[questionIndex].options = updated[questionIndex].options.filter(o => o.key !== optionKey)
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
			if (!q.question.trim()) {
				toast.error(t('questionRequired', { number: i + 1 }))
				return false
			}

			if (q.options.length < 2) {
				toast.error(t('minOptionsRequired', { number: i + 1 }))
				return false
			}

			for (let j = 0; j < q.options.length; j++) {
				if (!q.options[j].text.trim()) {
					toast.error(t('optionTextRequired', { number: i + 1, option: q.options[j].key }))
					return false
				}
			}

			if (!q.correctAnswer) {
				toast.error(t('correctAnswerRequired', { number: i + 1 }))
				return false
			}

			const correctOptionExists = q.options.some(o => o.key === q.correctAnswer)
			if (!correctOptionExists) {
				toast.error(t('correctAnswerInvalid', { number: i + 1 }))
				return false
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
					type: 'mcq',
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
		<Container maxWidth="lg" sx={{ pt: { xs: '4rem', md: '7rem' }, pb: 4 }}>
			<Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
				<IconButton onClick={() => router.back()}>
					<ArrowBack />
				</IconButton>
				<Typography variant="h4" sx={{ fontWeight: 700 }}>
					{t('createMCQTitle')}
				</Typography>
			</Box>

			<Alert severity="info" sx={{ mb: 3 }}>
				<strong>{t('mcqInfo')}</strong>
				<ul style={{ marginTop: '8px', marginBottom: 0 }}>
					<li>{t('mcqStep1')}</li>
					<li>{t('mcqStep2')}</li>
					<li>{t('mcqStep3')}</li>
					<li>{t('mcqStep4')}</li>
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
								multiline
								rows={2}
								label={t('question')}
								value={question.question}
								onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
								sx={{ mb: 3 }}
								required
							/>

							{/* Options */}
							<Box sx={{ mb: 2 }}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
									<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
										{t('options')} ({question.options.length})
									</Typography>
									{question.options.length < 6 && (
										<Button
											size="small"
											startIcon={<Add />}
											onClick={() => addOption(qIndex)}>
											{t('addOption')}
										</Button>
									)}
								</Box>

								<RadioGroup
									value={question.correctAnswer}
									onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}>
									{question.options.map((option) => (
										<Box
											key={option.key}
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 1,
												mb: 2,
												p: 2,
												backgroundColor: 'rgba(139, 92, 246, 0.05)',
												borderRadius: 2,
											}}>
											<FormControlLabel
												value={option.key}
												control={<Radio />}
												label={
													<Typography variant="body2" sx={{ fontWeight: 600, minWidth: '30px' }}>
														{option.key}
													</Typography>
												}
											/>
											<TextField
												fullWidth
												placeholder={t('optionPlaceholder', { key: option.key })}
												value={option.text}
												onChange={(e) => updateOption(qIndex, option.key, e.target.value)}
												size="small"
												required
											/>
											{question.options.length > 2 && (
												<IconButton
													size="small"
													color="error"
													onClick={() => removeOption(qIndex, option.key)}>
													<Delete fontSize="small" />
												</IconButton>
											)}
										</Box>
									))}
								</RadioGroup>
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
	)
}

export default CreateMCQExercise
