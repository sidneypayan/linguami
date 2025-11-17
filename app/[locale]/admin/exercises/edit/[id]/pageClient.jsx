'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
	Chip,
	Divider,
	Radio,
	RadioGroup,
	FormControlLabel,
	CircularProgress,
	Autocomplete,
} from '@mui/material'
import { Add, Delete, ArrowBack } from '@mui/icons-material'
import { useUserContext } from '@/context/user'
import { createBrowserClient } from '@/lib/supabase'
import toast from '@/utils/toast'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { logger } from '@/utils/logger'

const EditExercise = () => {
	const router = useRouter()
	const params = useParams()
	const locale = useLocale()
	const id = params.id
	const t = useTranslations('exercises')
	const { isUserAdmin, userLearningLanguage, isBootstrapping } = useUserContext()
	const supabase = createBrowserClient()

	// Form state
	const [exerciseType, setExerciseType] = useState(null)
	const [title, setTitle] = useState('')
	const [materialId, setMaterialId] = useState('')
	const [level, setLevel] = useState('beginner')
	const [lang, setLang] = useState(userLearningLanguage || 'fr')
	const [xpReward, setXpReward] = useState(10)
	const [questions, setQuestions] = useState([])

	// Materials list for dropdown
	const [materials, setMaterials] = useState([])
	const [loading, setLoading] = useState(false)
	const [loadingExercise, setLoadingExercise] = useState(true)

	// Load exercise data
	useEffect(() => {
		if (id) {
			loadExercise()
		}
	}, [id])

	const loadExercise = async () => {
		try {
			setLoadingExercise(true)
			const { data, error } = await supabase
				.from('exercises')
				.select('*')
				.eq('id', id)
				.single()

			if (error) throw error

			if (data) {
				setExerciseType(data.type)
				setTitle(data.title)
				setMaterialId(data.material_id || '')
				setLevel(data.level)
				setLang(data.lang)
				setXpReward(data.xp_reward)
				setQuestions(data.data?.questions || [])
			}
		} catch (error) {
			logger.error('Error loading exercise:', error)
			toast.error(t('loadError'))
			router.push(`/${locale}/admin/exercises`)
		} finally {
			setLoadingExercise(false)
		}
	}

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
		if (exerciseType === 'mcq') {
			setQuestions([
				...questions,
				{
					id: newId,
					question: '',
					options: [
						{ key: 'A', text: '' },
						{ key: 'B', text: '' }
					],
					correctAnswer: 'A',
					explanation: ''
				}
			])
		} else if (exerciseType === 'drag_and_drop') {
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
		} else {
			setQuestions([
				...questions,
				{
					id: newId,
					title: '',
					text: '',
					blanks: [{ correctAnswers: [''], hint: '' }],
					explanation: ''
				}
			])
		}
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

	// MCQ specific functions
	const updateOption = (questionIndex, optionKey, value) => {
		const updated = [...questions]
		const optionIndex = updated[questionIndex].options.findIndex(o => o.key === optionKey)
		if (optionIndex !== -1) {
			updated[questionIndex].options[optionIndex].text = value
		}
		setQuestions(updated)
	}

	const addOption = (questionIndex) => {
		const updated = [...questions]
		const currentOptions = updated[questionIndex].options
		const nextKey = String.fromCharCode(65 + currentOptions.length)
		updated[questionIndex].options.push({ key: nextKey, text: '' })
		setQuestions(updated)
	}

	const removeOption = (questionIndex, optionKey) => {
		const updated = [...questions]
		updated[questionIndex].options = updated[questionIndex].options.filter(o => o.key !== optionKey)
		setQuestions(updated)
	}

	// Fill in the blank specific functions
	const addBlank = (questionIndex) => {
		const updated = [...questions]
		updated[questionIndex].blanks.push({ correctAnswers: [''], hint: '' })
		setQuestions(updated)
	}

	const removeBlank = (questionIndex, blankIndex) => {
		const updated = [...questions]
		updated[questionIndex].blanks = updated[questionIndex].blanks.filter((_, i) => i !== blankIndex)
		setQuestions(updated)
	}

	const updateBlank = (questionIndex, blankIndex, field, value) => {
		const updated = [...questions]
		if (field === 'correctAnswers') {
			updated[questionIndex].blanks[blankIndex][field] = value.split(',').map(a => a.trim()).filter(a => a)
		} else {
			updated[questionIndex].blanks[blankIndex][field] = value
		}
		setQuestions(updated)
	}

	const countBlanks = (text) => {
		return (text.match(/___/g) || []).length
	}

	// Drag and drop specific functions
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

	const removePair = (questionIndex, pairIndex) => {
		const updated = [...questions]
		updated[questionIndex].pairs = updated[questionIndex].pairs
			.filter((_, i) => i !== pairIndex)
		setQuestions(updated)
	}

	const updatePairLeft = (questionIndex, pairIndex, text) => {
		const updated = [...questions]
		updated[questionIndex].pairs[pairIndex].left = text
		setQuestions(updated)
	}

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

		if (exerciseType === 'mcq') {
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
		} else if (exerciseType === 'drag_and_drop') {
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
		} else {
			for (let i = 0; i < questions.length; i++) {
				const q = questions[i]
				if (!q.text.trim()) {
					toast.error(t('textRequired', { number: i + 1 }))
					return false
				}

				const blankCount = countBlanks(q.text)
				if (blankCount === 0) {
					toast.error(t('useBlanksPlaceholder', { number: i + 1 }))
					return false
				}

				if (blankCount !== q.blanks.length) {
					toast.error(t('blankCountMismatch', { number: i + 1, blankCount, answerCount: q.blanks.length }))
					return false
				}

				for (let j = 0; j < q.blanks.length; j++) {
					if (!q.blanks[j].correctAnswers || q.blanks[j].correctAnswers.length === 0 || !q.blanks[j].correctAnswers[0]) {
						toast.error(t('blankAnswerRequired', { number: i + 1, blank: j + 1 }))
						return false
					}
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
				.update({
					material_id: materialId || null,
					title,
					level,
					lang,
					data: { questions },
					xp_reward: xpReward
				})
				.eq('id', id)
				.select()

			if (error) throw error

			toast.success(t('updateSuccess'))
			router.push(`/${locale}/admin/exercises`)
		} catch (error) {
			logger.error('Error updating exercise:', error)
			toast.error(t('updateError'))
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

	// Loading exercise
	if (loadingExercise) {
		return (
			<>
				<AdminNavbar />
				<Container maxWidth="lg" sx={{ pt: { xs: '4rem', md: '7rem' }, pb: 4 }}>
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
						<CircularProgress />
					</Box>
				</Container>
			</>
		)
	}

	const pageTitle = exerciseType === 'mcq' ? t('editMCQTitle') :
		exerciseType === 'drag_and_drop' ? t('editDragDropTitle') :
		t('editFillInBlankTitle')
	const infoKey = exerciseType === 'mcq' ? 'mcqInfo' :
		exerciseType === 'drag_and_drop' ? 'dragDropInfo' :
		'fillInBlankInfo'
	const step1Key = exerciseType === 'mcq' ? 'mcqStep1' :
		exerciseType === 'drag_and_drop' ? 'dragDropStep1' :
		'fillInBlankStep1'
	const step2Key = exerciseType === 'mcq' ? 'mcqStep2' :
		exerciseType === 'drag_and_drop' ? 'dragDropStep2' :
		'fillInBlankStep2'
	const step3Key = exerciseType === 'mcq' ? 'mcqStep3' :
		exerciseType === 'drag_and_drop' ? 'dragDropStep3' :
		'fillInBlankStep3'
	const step4Key = exerciseType === 'mcq' ? 'mcqStep4' :
		exerciseType === 'drag_and_drop' ? 'dragDropStep4' :
		'fillInBlankStep4'

	return (
		<>
			<AdminNavbar />

			<Container maxWidth="lg" sx={{ pt: { xs: '4rem', md: '7rem' }, pb: 4 }}>
				<Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
					<IconButton onClick={() => router.back()}>
						<ArrowBack />
					</IconButton>
					<Typography variant="h4" sx={{ fontWeight: 700 }}>
						{pageTitle}
					</Typography>
				</Box>

				<Alert severity="info" sx={{ mb: 3 }}>
					<strong>{t(infoKey)}</strong>
					<ul style={{ marginTop: '8px', marginBottom: 0 }}>
						<li>{t(step1Key)}</li>
						<li>{t(step2Key)}</li>
						<li>{t(step3Key)}</li>
						<li>{t(step4Key)}</li>
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

					{/* Questions - Rendered based on exercise type */}
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

						{exerciseType === 'mcq' ? (
							// MCQ Questions
							questions.map((question, qIndex) => (
								<Paper
									key={qIndex}
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
							))
						) : exerciseType === 'drag_and_drop' ? (
							// Drag and Drop Questions
							questions.map((question, qIndex) => (
								<Paper
									key={qIndex}
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
							))
						) : (
							// Fill in the blank Questions
							questions.map((question, qIndex) => (
								<Paper
									key={qIndex}
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
										label="Titre de la question (optionnel)"
										value={question.title}
										onChange={(e) => updateQuestion(qIndex, 'title', e.target.value)}
										sx={{ mb: 2 }}
									/>

									<TextField
										fullWidth
										multiline
										rows={3}
										label={t('textWithBlanks')}
										value={question.text}
										onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
										helperText={`Blancs détectés : ${countBlanks(question.text)}`}
										sx={{ mb: 2 }}
										required
									/>

									{/* Blanks */}
									<Box sx={{ mb: 2 }}>
										<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
											<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
												Réponses pour les blancs ({question.blanks.length})
											</Typography>
											<Button
												size="small"
												startIcon={<Add />}
												onClick={() => addBlank(qIndex)}>
												Ajouter un blanc
											</Button>
										</Box>

										{question.blanks.map((blank, bIndex) => (
											<Box
												key={bIndex}
												sx={{
													p: 2,
													mb: 2,
													backgroundColor: 'rgba(139, 92, 246, 0.05)',
													borderRadius: 2,
												}}>
												<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
													<Chip label={`Blank ${bIndex + 1}`} size="small" color="primary" />
													{question.blanks.length > 1 && (
														<IconButton
															size="small"
															color="error"
															onClick={() => removeBlank(qIndex, bIndex)}>
															<Delete fontSize="small" />
														</IconButton>
													)}
												</Box>

												<TextField
													fullWidth
													label={t('correctAnswers')}
													value={blank.correctAnswers.join(', ')}
													onChange={(e) => updateBlank(qIndex, bIndex, 'correctAnswers', e.target.value)}
													helperText={t('correctAnswersHelper')}
													sx={{ mb: 1 }}
													required
												/>

												<TextField
													fullWidth
													label={t('hint')}
													value={blank.hint}
													onChange={(e) => updateBlank(qIndex, bIndex, 'hint', e.target.value)}
												/>
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
							))
						)}
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
							{loading ? t('updating') : t('updateExercise')}
						</Button>
					</Box>
				</Paper>
			</Container>
		</>
	)
}

export default EditExercise
