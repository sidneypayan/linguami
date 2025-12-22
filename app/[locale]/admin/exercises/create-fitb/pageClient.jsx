'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import {
	Plus,
	Trash2,
	ArrowLeft,
	Info,
	ChevronDown,
} from 'lucide-react'
import { useUserContext } from '@/context/user'
import { createBrowserClient } from '@/lib/supabase'
import toast from '@/utils/toast'
import { logger } from '@/utils/logger'
import AdminNavbar from '@/components/admin/AdminNavbar'

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

const CreateExercise = () => {
	const router = useRouter()
	const locale = useLocale()
	const t = useTranslations('exercises')
	const { isUserAdmin, userLearningLanguage, isBootstrapping } = useUserContext()
	const supabase = createBrowserClient()

	// Read query params for pre-filling (when creating from lesson page)
	const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
	const parentTypeParam = searchParams?.get('parent_type') || null
	const parentIdParam = searchParams?.get('parent_id') || null

	// Form state
	const [title, setTitle] = useState('')
	const [materialId, setMaterialId] = useState('')
	const [parentType, setParentType] = useState(parentTypeParam)
	const [parentId, setParentId] = useState(parentIdParam ? parseInt(parentIdParam) : null)
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
			router.push(`/${locale}`)
		}
	}, [isUserAdmin, isBootstrapping, router, locale])

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
			const exerciseData = {
				material_id: materialId || null,
				type: 'fill_in_blank',
				title,
				level,
				lang,
				data: { questions },
				xp_reward: xpReward
			}

			// Add parent_type and parent_id if provided (from lesson or material page)
			if (parentType && parentId) {
				exerciseData.parent_type = parentType
				exerciseData.parent_id = parentId

				// For materials, also set material_id for backward compatibility
				if (parentType === 'material') {
					exerciseData.material_id = parentId
				}
			}

			const { data, error } = await supabase
				.from('exercises')
				.insert(exerciseData)
				.select()

			if (error) throw error

			toast.success(t('createSuccess'))


			// Redirect back to parent page if created from there
			if (parentType === 'lesson' && parentId) {
				router.push(`/${locale}/admin/lessons/${parentId}`)
			} else if (parentType === 'material' && parentId) {
				router.push(`/${locale}/admin/materials/${parentId}`)
			} else {
				router.push(`/${locale}/admin/exercises`)
			}
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
						{t('createFillInBlankTitle')}
					</h1>
				</div>

				{/* Info Alert */}
				<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
					<div className="flex items-start gap-3">
						<Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
						<div>
							<p className="font-semibold text-blue-800 mb-2">{t('fillInBlankInfo')}</p>
							<ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
								<li>{t('fillInBlankStep1')}</li>
								<li>{t('fillInBlankStep2')}</li>
								<li>{t('fillInBlankStep3')}</li>
								<li>{t('fillInBlankStep4')}</li>
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
								Questions ({questions.length})
							</h2>
							<button
								type="button"
								onClick={addQuestion}
								className="flex items-center gap-2 px-4 py-2 border border-indigo-200 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
							>
								<Plus className="w-4 h-4" />
								Ajouter une question
							</button>
						</div>

						{questions.map((question, qIndex) => (
							<div
								key={question.id}
								className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100"
							>
								<div className="flex justify-between items-center mb-4">
									<h3 className="font-semibold text-slate-700">
										Question {qIndex + 1}
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
									placeholder="Titre de la question (optionnel)"
									className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-3"
								/>

								<div className="mb-3">
									<textarea
										value={question.text}
										onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
										placeholder="Texte avec blancs (utilisez ___)"
										rows={6}
										className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
										required
									/>
									<p className="mt-1 text-xs text-slate-500">
										Blancs detectes : {countBlanks(question.text)}
									</p>
								</div>

								{/* Blanks */}
								<div className="mb-4">
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm font-medium text-slate-600">
											Reponses pour les blancs ({question.blanks.length})
										</span>
										<button
											type="button"
											onClick={() => addBlank(qIndex)}
											className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
										>
											<Plus className="w-3 h-3" />
											Ajouter un blanc
										</button>
									</div>

									{question.blanks.map((blank, bIndex) => (
										<div
											key={bIndex}
											className="bg-white rounded-lg p-4 mb-2 border border-slate-100"
										>
											<div className="flex justify-between items-center mb-3">
												<span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
													Blanc {bIndex + 1}
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
														placeholder="Reponse(s) correcte(s)"
														className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
														required
													/>
													<p className="mt-1 text-xs text-slate-500">
														Separez plusieurs reponses acceptees par des virgules (ex: vais, je vais)
													</p>
												</div>

												<input
													type="text"
													value={blank.hint}
													onChange={(e) => updateBlank(qIndex, bIndex, 'hint', e.target.value)}
													placeholder="Indice (optionnel)"
													className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
												/>
											</div>
										</div>
									))}
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-600 mb-1.5">
										Explication (optionnel)
									</label>
									<textarea
										value={question.explanation}
										onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
										placeholder="Affichee apres la soumission de la question"
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
							Annuler
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
						>
							{loading ? 'Creation...' : 'Creer l\'exercice'}
						</button>
					</div>
				</form>
			</div>
		</>
	)
}

export default CreateExercise
