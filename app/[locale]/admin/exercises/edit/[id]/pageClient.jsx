'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import {
	Plus,
	Trash2,
	ArrowLeft,
	Info,
	ChevronDown,
	Loader2,
} from 'lucide-react'
import { useUserContext } from '@/context/user'
import { createBrowserClient } from '@/lib/supabase'
import toast from '@/utils/toast'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { logger } from '@/utils/logger'

// Custom autocomplete component
const MaterialAutocomplete = ({ materials, value, onChange, label, placeholder }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [search, setSearch] = useState('')
	const ref = useRef(null)

	const selectedMaterial = materials.find(m => m.id === value)

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const filteredMaterials = materials.filter(m => {
		const searchLower = search.toLowerCase()
		return (
			m.title?.toLowerCase().includes(searchLower) ||
			m.id?.toString().includes(searchLower)
		)
	})

	const groupedMaterials = filteredMaterials.reduce((acc, m) => {
		const section = m.section || 'other'
		if (!acc[section]) acc[section] = []
		acc[section].push(m)
		return acc
	}, {})

	return (
		<div className="relative" ref={ref}>
			<label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-left hover:border-indigo-300 transition-colors"
			>
				<span className={selectedMaterial ? 'text-slate-800' : 'text-slate-400'}>
					{selectedMaterial ? `#${selectedMaterial.id} - ${selectedMaterial.title}` : placeholder}
				</span>
				<ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
			</button>

			{isOpen && (
				<div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
					<div className="p-2 border-b border-slate-100">
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Rechercher..."
							className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
							autoFocus
						/>
					</div>
					<div className="overflow-y-auto max-h-60">
						<button
							type="button"
							onClick={() => { onChange(''); setIsOpen(false) }}
							className="w-full px-4 py-2 text-left text-sm text-slate-500 hover:bg-slate-50"
						>
							Aucun
						</button>
						{Object.entries(groupedMaterials).map(([section, items]) => (
							<div key={section}>
								<div className="px-4 py-2 bg-slate-50 text-xs font-bold text-indigo-600 uppercase tracking-wide sticky top-0">
									{section}
								</div>
								{items.map(m => (
									<button
										type="button"
										key={m.id}
										onClick={() => { onChange(m.id); setIsOpen(false); setSearch('') }}
										className={cn(
											'w-full px-4 py-2 text-left text-sm hover:bg-indigo-50 transition-colors',
											value === m.id && 'bg-indigo-50 text-indigo-700'
										)}
									>
										#{m.id} - {m.title}
									</button>
								))}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

const EditExercise = () => {
	const router = useRouter()
	const params = useParams()
	const locale = useLocale()
	const id = params.id
	const t = useTranslations('exercises')
	const { isUserAdmin, userLearningLanguage, isBootstrapping } = useUserContext()

	// Form state
	const [exerciseType, setExerciseType] = useState(null)
	const [title, setTitle] = useState('')
	const [materialId, setMaterialId] = useState('')
	const [level, setLevel] = useState('beginner')
	const [lang, setLang] = useState(userLearningLanguage || 'fr')
	const [xpReward, setXpReward] = useState(10)
	const [questions, setQuestions] = useState([])
	const [parentType, setParentType] = useState(null)

	// Materials list for dropdown
	const [materials, setMaterials] = useState([])
	const [loading, setLoading] = useState(false)
	const [loadingExercise, setLoadingExercise] = useState(true)

	// SIMPLIFIED: Single production database for everything
	const supabase = createBrowserClient()

	// Load exercise data
	useEffect(() => {
		if (id) {
			loadExercise()
		}
	}, [id])

	const loadExercise = async () => {
		try {
			setLoadingExercise(true)

			// SIMPLIFIED: Single production database
			const { data, error } = await supabase
				.from('exercises')
				.select('*')
				.eq('id', id)
				.single()

			if (error) throw error

			// Set parent type based on data
			if (data.parent_type) {
				setParentType(data.parent_type)
			} else if (data.lesson_id) {
				// If has lesson_id, it's a lesson exercise
				setParentType('lesson')
			} else if (data.material_id) {
				// If has material_id, it's a material exercise
				setParentType('material')
			} else {
				// Default to material if no parent is specified
				setParentType('material')
			}

			if (data) {
				setExerciseType(data.type)
				setTitle(data.title)
				setMaterialId(data.material_id || '')
				setLevel(data.level)
				setLang(data.lang)
				setXpReward(data.xp_reward)

				// Load questions based on exercise type
				let loadedQuestions = []
				if (data.type === 'drag_and_drop') {
					// For drag_and_drop, create questions from pairs
					if (data.data?.pairs) {
						// Extract text from multilingual objects
						const normalizedPairs = data.data.pairs.map(pair => ({
							id: pair.id,
							left: typeof pair.left === 'object' ? (pair.left[data.lang] || pair.left.fr || pair.left.en) : pair.left,
							right: typeof pair.right === 'object' ? (pair.right[data.lang] || pair.right.fr || pair.right.en) : pair.right
						}))

						loadedQuestions = [{
							id: 1,
							instruction: '',
							pairs: normalizedPairs,
							explanation: ''
						}]
					}
				} else if (data.type === 'fill_in_blank') {
					// For fill_in_blank, create questions from sentences
					if (data.data?.sentences) {
						loadedQuestions = data.data.sentences.map((s, idx) => {
							// Get the sentence text based on language
							let sentenceText = s.sentenceWithBlank
							if (data.lang === 'en' && s.sentenceWithBlank_en) {
								sentenceText = s.sentenceWithBlank_en
							} else if (data.lang === 'ru' && s.sentenceWithBlank_ru) {
								sentenceText = s.sentenceWithBlank_ru
							}

							// Get correct answers based on language
							let correctAnswers = [s.correctAnswer]
							if (data.lang === 'en' && s.correctAnswer_en) {
								correctAnswers = [s.correctAnswer_en]
							} else if (data.lang === 'ru' && s.correctAnswer_ru) {
								correctAnswers = [s.correctAnswer_ru]
							}

							return {
								id: idx + 1,
								title: '',
								text: sentenceText,
								blanks: [{ correctAnswers: correctAnswers, hint: s.hint || '' }],
								explanation: s.explanation || ''
							}
						})
					}
				} else {
					// For MCQ, use questions directly
					loadedQuestions = data.data?.questions || []
				}

				// Ensure all MCQ options have keys and convert old format (strings) to new format (objects)
				const normalizedQuestions = loadedQuestions.map(q => {
					if (q.options && Array.isArray(q.options)) {
						// Check if we need to convert from old format
						const isOldFormat = q.options.some(opt => typeof opt === 'string')

						const normalizedOptions = q.options.map((opt, idx) => {
							// Handle old format: options are strings
							if (typeof opt === 'string') {
								return {
									key: String.fromCharCode(65 + idx), // A, B, C, etc.
									text: opt
								}
							}
							// Handle new format: options are objects
							return {
								...opt,
								key: opt.key || String.fromCharCode(65 + idx) // Ensure key exists
							}
						})

						// Convert correctAnswer if using old format
						let correctAnswer = q.correctAnswer
						if (isOldFormat && correctAnswer) {
							// Find the index of the old correctAnswer value in the original options
							const correctIndex = q.options.findIndex(opt => opt === correctAnswer)
							if (correctIndex !== -1) {
								// Convert to new key format (A, B, C, etc.)
								correctAnswer = String.fromCharCode(65 + correctIndex)
							}
						}

						return {
							...q,
							options: normalizedOptions,
							correctAnswer: correctAnswer
						}
					}
					return q
				})

				setQuestions(normalizedQuestions)
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
		if (!text) return 0
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
			// Prepare data based on exercise type
			let exerciseData
			if (exerciseType === 'drag_and_drop') {
				// Convert questions back to pairs format
				exerciseData = {
					pairs: questions[0]?.pairs || []
				}
			} else if (exerciseType === 'fill_in_blank') {
				// Convert questions back to sentences format
				exerciseData = {
					sentences: questions.map(q => ({
						question: q.text,
						answer: q.blanks[0]?.correctAnswers[0] || '',
						acceptableAnswers: q.blanks[0]?.correctAnswers || [],
						hint: q.blanks[0]?.hint || '',
						explanation: q.explanation || ''
					}))
				}
			} else {
				// MCQ format
				exerciseData = { questions }
			}

			const { data, error } = await supabase
				.from('exercises')
				.update({
					material_id: materialId || null,
					title,
					level,
					lang,
					data: exerciseData,
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
				<AdminNavbar activePage="exercises" />
				<div className="max-w-4xl mx-auto px-4 pt-16 md:pt-24 pb-8">
					<div className="flex justify-center items-center min-h-[60vh]">
						<Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
					</div>
				</div>
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
			<AdminNavbar activePage="exercises" />

			<div className="max-w-4xl mx-auto px-4 pt-16 md:pt-24 pb-8">
				{/* Header */}
				<div className="flex items-center gap-3 mb-6">
					<button
						onClick={() => router.back()}
						className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<h1 className="text-2xl font-bold text-slate-800">
						{pageTitle}
					</h1>
				</div>

				{/* Info Alert */}
				<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
					<div className="flex items-start gap-3">
						<Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
						<div>
							<p className="font-semibold text-blue-800 mb-2">{t(infoKey)}</p>
							<ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
								<li>{t(step1Key)}</li>
								<li>{t(step2Key)}</li>
								<li>{t(step3Key)}</li>
								<li>{t(step4Key)}</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="bg-white rounded-xl border border-indigo-100 p-6">
					{/* Basic info */}
					<div className="mb-8">
						<h2 className="text-lg font-semibold text-slate-800 mb-4">{t('generalInfo')}</h2>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1.5">
									{t('exerciseTitleLabel')} *
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
									required
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1.5">
										{t('languageLabel')}
									</label>
									<select
										value={lang}
										onChange={(e) => setLang(e.target.value)}
										className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
									>
										<option value="fr">{t('french')}</option>
										<option value="ru">{t('russian')}</option>
										<option value="en">{t('english')}</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1.5">
										{t('levelLabel')}
									</label>
									<select
										value={level}
										onChange={(e) => setLevel(e.target.value)}
										className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
									>
										<option value="beginner">{t('beginner')}</option>
										<option value="intermediate">{t('intermediate')}</option>
										<option value="advanced">{t('advanced')}</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="md:col-span-2">
									<MaterialAutocomplete
										materials={materials}
										value={materialId}
										onChange={setMaterialId}
										label={t('associatedMaterial')}
										placeholder="Rechercher un materiel..."
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1.5">
										{t('xpReward')}
									</label>
									<input
										type="number"
										value={xpReward}
										onChange={(e) => setXpReward(parseInt(e.target.value))}
										min={1}
										max={100}
										className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
									/>
								</div>
							</div>
						</div>
					</div>

					<hr className="border-slate-200 mb-8" />

					{/* Questions */}
					<div>
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-semibold text-slate-800">
								{t('questionsCount')} ({questions.length})
							</h2>
							<button
								type="button"
								onClick={addQuestion}
								className="flex items-center gap-2 px-4 py-2 border border-indigo-200 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
							>
								<Plus className="w-4 h-4" />
								{t('addQuestion')}
							</button>
						</div>

						{/* MCQ Questions */}
						{exerciseType === 'mcq' && questions.map((question, qIndex) => (
							<div
								key={qIndex}
								className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100"
							>
								<div className="flex justify-between items-center mb-4">
									<h3 className="font-semibold text-slate-700">
										{t('question')} {qIndex + 1}
									</h3>
									{questions.length > 1 && (
										<button
											type="button"
											onClick={() => removeQuestion(qIndex)}
											className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									)}
								</div>

								<textarea
									value={question.question}
									onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
									placeholder={t('question')}
									rows={2}
									className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none mb-4"
									required
								/>

								{/* Options */}
								<div className="mb-4">
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm font-medium text-slate-600">
											{t('options')} ({question.options.length})
										</span>
										{question.options.length < 6 && (
											<button
												type="button"
												onClick={() => addOption(qIndex)}
												className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
											>
												<Plus className="w-3 h-3" />
												{t('addOption')}
											</button>
										)}
									</div>

									<div className="space-y-2">
										{question.options.map((option, optIndex) => (
											<div
												key={option.key || `option-${qIndex}-${optIndex}`}
												className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-100"
											>
												<label className="flex items-center cursor-pointer">
													<input
														type="radio"
														name={`correct-${qIndex}`}
														value={option.key}
														checked={question.correctAnswer === option.key}
														onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
														className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
													/>
													<span className="ml-2 font-semibold text-slate-700 min-w-[24px]">
														{option.key}
													</span>
												</label>
												<input
													type="text"
													value={option.text}
													onChange={(e) => updateOption(qIndex, option.key, e.target.value)}
													placeholder={t('optionPlaceholder', { key: option.key })}
													className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
													required
												/>
												{question.options.length > 2 && (
													<button
														type="button"
														onClick={() => removeOption(qIndex, option.key)}
														className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												)}
											</div>
										))}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-600 mb-1.5">
										{t('explanation')}
									</label>
									<textarea
										value={question.explanation}
										onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
										placeholder={t('explanationHelper')}
										rows={2}
										className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm"
									/>
								</div>
							</div>
						))}

						{/* Drag and Drop Questions */}
						{exerciseType === 'drag_and_drop' && questions.map((question, qIndex) => (
							<div
								key={qIndex}
								className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100"
							>
								<div className="flex justify-between items-center mb-4">
									<h3 className="font-semibold text-slate-700">
										{t('question')} {qIndex + 1}
									</h3>
									{questions.length > 1 && (
										<button
											type="button"
											onClick={() => removeQuestion(qIndex)}
											className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									)}
								</div>

								<div className="mb-4">
									<label className="block text-sm font-medium text-slate-600 mb-1.5">
										{t('instructionLabel')} *
									</label>
									<input
										type="text"
										value={question.instruction}
										onChange={(e) => updateQuestion(qIndex, 'instruction', e.target.value)}
										placeholder="Ex: Associez les mots avec leur traduction"
										className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
										required
									/>
								</div>

								{/* Pairs */}
								<div className="mb-4">
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm font-medium text-slate-600">
											{t('pairsCount', { count: question.pairs.length })}
										</span>
										<button
											type="button"
											onClick={() => addPair(qIndex)}
											className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
										>
											<Plus className="w-3 h-3" />
											{t('addPair')}
										</button>
									</div>

									{question.pairs.map((pair, pIndex) => (
										<div
											key={pair.id}
											className="bg-white rounded-lg p-4 mb-2 border border-slate-100"
										>
											<div className="flex justify-between items-center mb-3">
												<span className="text-sm font-semibold text-indigo-600">
													{t('pairs')} {pIndex + 1}
												</span>
												{question.pairs.length > 2 && (
													<button
														type="button"
														onClick={() => removePair(qIndex, pIndex)}
														className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												)}
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
												<div>
													<label className="block text-xs font-medium text-slate-500 mb-1">
														{t('leftItem', { number: pIndex + 1 })}
													</label>
													<input
														type="text"
														value={pair.left}
														onChange={(e) => updatePairLeft(qIndex, pIndex, e.target.value)}
														placeholder="Ex: Bonjour"
														className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
														required
													/>
												</div>
												<div>
													<label className="block text-xs font-medium text-slate-500 mb-1">
														{t('rightItem', { number: pIndex + 1 })}
													</label>
													<input
														type="text"
														value={pair.right}
														onChange={(e) => updatePairRight(qIndex, pIndex, e.target.value)}
														placeholder="Ex: Hello"
														className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
														required
													/>
												</div>
											</div>
										</div>
									))}
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-600 mb-1.5">
										{t('explanation')}
									</label>
									<textarea
										value={question.explanation}
										onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
										placeholder={t('explanationHelper')}
										rows={2}
										className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm"
									/>
								</div>
							</div>
						))}

						{/* Fill in the blank Questions */}
						{exerciseType === 'fill_in_blank' && questions.map((question, qIndex) => (
							<div
								key={qIndex}
								className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100"
							>
								<div className="flex justify-between items-center mb-4">
									<h3 className="font-semibold text-slate-700">
										{t('question')} {qIndex + 1}
									</h3>
									{questions.length > 1 && (
										<button
											type="button"
											onClick={() => removeQuestion(qIndex)}
											className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									)}
								</div>

								<input
									type="text"
									value={question.title}
									onChange={(e) => updateQuestion(qIndex, 'title', e.target.value)}
									placeholder={t('questionTitlePlaceholder')}
									className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-3"
								/>

								<div className="mb-3">
									<label className="block text-sm font-medium text-slate-600 mb-1.5">
										{t('textWithBlanks')} *
									</label>
									<textarea
										value={question.text}
										onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
										placeholder={t('textWithBlanksPlaceholder')}
										rows={3}
										className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
										required
									/>
									<p className="mt-1 text-xs text-slate-500">
										{t('blanksDetected')} : {countBlanks(question.text)}
									</p>
								</div>

								{/* Blanks */}
								<div className="mb-4">
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm font-medium text-slate-600">
											{t('responsesForBlanks')} ({question.blanks.length})
										</span>
										<button
											type="button"
											onClick={() => addBlank(qIndex)}
											className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
										>
											<Plus className="w-3 h-3" />
											{t('addBlank')}
										</button>
									</div>

									{question.blanks.map((blank, bIndex) => (
										<div
											key={bIndex}
											className="bg-white rounded-lg p-4 mb-2 border border-slate-100"
										>
											<div className="flex justify-between items-center mb-3">
												<span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
													{t('blankNumber')} {bIndex + 1}
												</span>
												{question.blanks.length > 1 && (
													<button
														type="button"
														onClick={() => removeBlank(qIndex, bIndex)}
														className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												)}
											</div>

											<div className="space-y-3">
												<div>
													<input
														type="text"
														value={blank.correctAnswers.join(', ')}
														onChange={(e) => updateBlank(qIndex, bIndex, 'correctAnswers', e.target.value)}
														placeholder={t('correctAnswers')}
														className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
														required
													/>
													<p className="mt-1 text-xs text-slate-500">
														{t('correctAnswersHelper')}
													</p>
												</div>

												<input
													type="text"
													value={blank.hint}
													onChange={(e) => updateBlank(qIndex, bIndex, 'hint', e.target.value)}
													placeholder={t('hint')}
													className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
												/>
											</div>
										</div>
									))}
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-600 mb-1.5">
										{t('explanation')}
									</label>
									<textarea
										value={question.explanation}
										onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
										placeholder={t('explanationHelper')}
										rows={2}
										className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm"
									/>
								</div>
							</div>
						))}
					</div>

					{/* Submit buttons */}
					<div className="flex gap-3 justify-end mt-8">
						<button
							type="button"
							onClick={() => router.back()}
							disabled={loading}
							className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
						>
							{t('cancel')}
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
						>
							{loading ? t('updating') : t('updateExercise')}
						</button>
					</div>
				</form>
			</div>
		</>
	)
}

export default EditExercise
