import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
	ListSubheader,
	Autocomplete,
} from '@mui/material'
import { Add, Delete, ArrowBack } from '@mui/icons-material'
import { useUserContext } from '../../../context/user'
import { createBrowserClient } from '../../../lib/supabase'
import { toast } from 'react-toastify'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'

const CreateExercise = () => {
	const router = useRouter()
	const { t } = useTranslation('exercises')
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
			title: '',
			text: '',
			blanks: [{ correctAnswers: [''], hint: '' }],
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
			router.push('/')
		}
	}, [isUserAdmin, isBootstrapping, router])

	// Add new question
	const addQuestion = () => {
		setQuestions([
			...questions,
			{
				id: questions.length + 1,
				title: '',
				text: '',
				blanks: [{ correctAnswers: [''], hint: '' }],
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

	// Add blank to question
	const addBlank = (questionIndex) => {
		const updated = [...questions]
		updated[questionIndex].blanks.push({ correctAnswers: [''], hint: '' })
		setQuestions(updated)
	}

	// Remove blank from question
	const removeBlank = (questionIndex, blankIndex) => {
		const updated = [...questions]
		updated[questionIndex].blanks = updated[questionIndex].blanks.filter((_, i) => i !== blankIndex)
		setQuestions(updated)
	}

	// Update blank
	const updateBlank = (questionIndex, blankIndex, field, value) => {
		const updated = [...questions]
		if (field === 'correctAnswers') {
			// Split by comma for multiple acceptable answers
			updated[questionIndex].blanks[blankIndex][field] = value.split(',').map(a => a.trim()).filter(a => a)
		} else {
			updated[questionIndex].blanks[blankIndex][field] = value
		}
		setQuestions(updated)
	}

	// Count blanks in text
	const countBlanks = (text) => {
		return (text.match(/___/g) || []).length
	}

	// Validate form
	const validateForm = () => {
		if (!title.trim()) {
			toast.error(t('titleRequired'))
			return false
		}

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
					type: 'fill_in_blank',
					title,
					level,
					lang,
					data: { questions },
					xp_reward: xpReward
				})
				.select()

			if (error) throw error

			toast.success(t('createSuccess'))
			router.push('/admin/exercises')
		} catch (error) {
			console.error('Error creating exercise:', error)
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
			<Head>
				<title>{t('createFillInBlankTitle')} | Linguami Admin</title>
			</Head>

			<Container maxWidth="lg" sx={{ pt: { xs: '4rem', md: '7rem' }, pb: 4 }}>
				<Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
					<IconButton onClick={() => router.back()}>
						<ArrowBack />
					</IconButton>
					<Typography variant="h4" sx={{ fontWeight: 700 }}>
						{t('createFillInBlankTitle')}
					</Typography>
				</Box>

				<Alert severity="info" sx={{ mb: 3 }}>
					<strong>{t('fillInBlankInfo')}</strong>
					<ul style={{ marginTop: '8px', marginBottom: 0 }}>
						<li>{t('fillInBlankStep1')}</li>
						<li>{t('fillInBlankStep2')}</li>
						<li>{t('fillInBlankStep3')}</li>
						<li>{t('fillInBlankStep4')}</li>
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
								Questions ({questions.length})
							</Typography>
							<Button
								variant="outlined"
								startIcon={<Add />}
								onClick={addQuestion}>
								Ajouter une question
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
										Question {qIndex + 1}
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
									rows={6}
									label="Texte avec blancs (utilisez ___)"
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
												<Chip label={`Blanc ${bIndex + 1}`} size="small" color="primary" />
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
												label="Réponse(s) correcte(s)"
												value={blank.correctAnswers.join(', ')}
												onChange={(e) => updateBlank(qIndex, bIndex, 'correctAnswers', e.target.value)}
												helperText="Séparez plusieurs réponses acceptées par des virgules (ex: vais, je vais)"
												sx={{ mb: 1 }}
												required
											/>

											<TextField
												fullWidth
												label="Indice (optionnel)"
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
									label="Explication (optionnel)"
									value={question.explanation}
									onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
									helperText="Affichée après la soumission de la question"
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
							Annuler
						</Button>
						<Button
							type="submit"
							variant="contained"
							disabled={loading}
							sx={{
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								px: 4,
							}}>
							{loading ? 'Création...' : 'Créer l\'exercice'}
						</Button>
					</Box>
				</Paper>
			</Container>
		</>
	)
}

export default CreateExercise
