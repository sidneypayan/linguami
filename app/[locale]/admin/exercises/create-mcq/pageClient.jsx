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
		const nextKey = String.fromCharCode(65 + currentOptions.length)
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
						{t('createMCQTitle')}
					</h1>
				</div>

				{/* Info Alert */}
				<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
					<div className="flex items-start gap-3">
						<Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
						<div>
							<p className="font-semibold text-blue-800 mb-2">{t('mcqInfo')}</p>
							<ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
								<li>{t('mcqStep1')}</li>
								<li>{t('mcqStep2')}</li>
								<li>{t('mcqStep3')}</li>
								<li>{t('mcqStep4')}</li>
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
										placeholder="Rechercher un matériel..."
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

						{questions.map((question, qIndex) => (
							<div
								key={question.id}
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
										{question.options.map((option) => (
											<div
												key={option.key}
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
							{loading ? t('creating') : t('createExercise')}
						</button>
					</div>
				</form>
			</div>
		</>
	)
}

export default CreateMCQExercise
