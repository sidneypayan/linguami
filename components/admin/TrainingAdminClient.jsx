'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
	Dumbbell,
	ChevronDown,
	ChevronRight,
	BookOpen,
	Languages,
	Target,
	HelpCircle,
	CheckCircle2,
	ListChecks,
	X,
	Sparkles,
	Plus,
	Trash2,
	Loader2,
	Wand2,
	ArrowLeft,
	BookA,
	GraduationCap,
	Edit3,
	Save,
	XCircle,
	Eye,
	RotateCcw,
	SignalLow,
	SignalMedium,
	SignalHigh,
	CheckCheck,
	FileCheck,
	FilePenLine,
} from 'lucide-react'
import {
	getTrainingThemesAction,
	getTrainingStatsAction,
	getAdminTrainingQuestionsAction,
	deleteTrainingQuestionAction,
	createTrainingQuestionsAction,
	updateTrainingQuestionAction,
	publishTrainingQuestionAction,
	bulkPublishQuestionsAction,
} from '@/app/actions/training'

const getLocalizedText = (text, locale) => {
	if (typeof text === 'string') return text
	if (typeof text === 'object' && text !== null) {
		return text[locale] || text.en || text.fr || ''
	}
	return ''
}

// Vocabulary themes (fallback when DB is empty)
const defaultThemes = {
	ru: {
		beginner: [
			{ key: 'greetings', icon: '👋', label_fr: 'Salutations', label_en: 'Greetings', label_ru: 'Приветствия' },
			{ key: 'numbers', icon: '🔢', label_fr: 'Nombres', label_en: 'Numbers', label_ru: 'Числа' },
			{ key: 'family', icon: '👨‍👩‍👧‍👦', label_fr: 'Famille', label_en: 'Family', label_ru: 'Семья' },
			{ key: 'food', icon: '🍎', label_fr: 'Nourriture', label_en: 'Food', label_ru: 'Еда' },
			{ key: 'colors', icon: '🎨', label_fr: 'Couleurs', label_en: 'Colors', label_ru: 'Цвета' },
			{ key: 'animals', icon: '🐾', label_fr: 'Animaux', label_en: 'Animals', label_ru: 'Животные' },
			{ key: 'body', icon: '🫀', label_fr: 'Corps humain', label_en: 'Body parts', label_ru: 'Части тела' },
			{ key: 'clothes', icon: '👕', label_fr: 'Vetements', label_en: 'Clothes', label_ru: 'Одежда' },
			{ key: 'time', icon: '🕐', label_fr: 'Temps', label_en: 'Time', label_ru: 'Время' },
			{ key: 'days', icon: '📅', label_fr: 'Jours et mois', label_en: 'Days & months', label_ru: 'Дни и месяцы' },
			{ key: 'places', icon: '🏪', label_fr: 'Lieux', label_en: 'Places', label_ru: 'Места' },
			{ key: 'professions', icon: '👨‍⚕️', label_fr: 'Metiers', label_en: 'Professions', label_ru: 'Профессии' },
			{ key: 'house', icon: '🛋️', label_fr: 'Maison', label_en: 'House', label_ru: 'Дом' },
			{ key: 'transport', icon: '🚌', label_fr: 'Transports', label_en: 'Transport', label_ru: 'Транспорт' },
			{ key: 'verbs', icon: '🏃', label_fr: 'Verbes courants', label_en: 'Common verbs', label_ru: 'Общие глаголы' },
			{ key: 'adjectives', icon: '✨', label_fr: 'Adjectifs', label_en: 'Adjectives', label_ru: 'Прилагательные' },
			{ key: 'weather', icon: '☀️', label_fr: 'Meteo', label_en: 'Weather', label_ru: 'Погода' },
			{ key: 'emotions', icon: '😊', label_fr: 'Emotions', label_en: 'Emotions', label_ru: 'Эмоции' },
			{ key: 'hobbies', icon: '⚽', label_fr: 'Loisirs', label_en: 'Hobbies', label_ru: 'Хобби' },
			{ key: 'school', icon: '📚', label_fr: 'Ecole', label_en: 'School', label_ru: 'Школа' },
			{ key: 'nature', icon: '🌳', label_fr: 'Nature', label_en: 'Nature', label_ru: 'Природа' },
			{ key: 'drinks', icon: '🥤', label_fr: 'Boissons', label_en: 'Drinks', label_ru: 'Напитки' },
		],
		intermediate: [
			{ key: 'travel', icon: '✈️', label_fr: 'Voyages', label_en: 'Travel', label_ru: 'Путешествия' },
			{ key: 'work', icon: '💼', label_fr: 'Travail', label_en: 'Work', label_ru: 'Работа' },
			{ key: 'health', icon: '🏥', label_fr: 'Sante', label_en: 'Health', label_ru: 'Здоровье' },
			{ key: 'hobbies', icon: '🎸', label_fr: 'Loisirs', label_en: 'Hobbies', label_ru: 'Хобби' },
			{ key: 'home', icon: '🏠', label_fr: 'Maison', label_en: 'Home', label_ru: 'Дом' },
			{ key: 'weather', icon: '🌤️', label_fr: 'Meteo', label_en: 'Weather', label_ru: 'Погода' },
		],
		advanced: [
			{ key: 'politics', icon: '🏛️', label_fr: 'Politique', label_en: 'Politics', label_ru: 'Политика' },
			{ key: 'business', icon: '📊', label_fr: 'Affaires', label_en: 'Business', label_ru: 'Бизнес' },
			{ key: 'science', icon: '🔬', label_fr: 'Sciences', label_en: 'Science', label_ru: 'Наука' },
			{ key: 'culture', icon: '🎭', label_fr: 'Culture', label_en: 'Culture', label_ru: 'Культура' },
			{ key: 'emotions', icon: '💭', label_fr: 'Emotions', label_en: 'Emotions', label_ru: 'Эмоции' },
			{ key: 'idioms', icon: '📚', label_fr: 'Expressions', label_en: 'Idioms', label_ru: 'Идиомы' },
		],
	},
}

const levelConfig = {
	beginner: { label: { fr: 'Debutant', en: 'Beginner', ru: 'Начальный' }, color: 'emerald', icon: SignalLow },
	intermediate: { label: { fr: 'Intermediaire', en: 'Intermediate', ru: 'Средний' }, color: 'amber', icon: SignalMedium },
	advanced: { label: { fr: 'Avance', en: 'Advanced', ru: 'Продвинутый' }, color: 'red', icon: SignalHigh },
}

const colorClasses = {
	emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
	amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
	red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
}

// Question Edit Form Component
const QuestionEditForm = ({ question, onSave, onCancel, saving, learningLang }) => {
	const isMultiFill = question.type === 'multi_fill'

	const [formData, setFormData] = useState({
		question_fr: question.question_fr || '',
		question_en: question.question_en || '',
		question_ru: question.question_ru || '',
		options: Array.isArray(question.options)
			? question.options
			: (question.options?.fr || []),
		correct_answer: question.correct_answer || 0,
		sentences: question.sentences || [],
		explanation_fr: question.explanation_fr || '',
		explanation_en: question.explanation_en || '',
		is_active: question.is_active !== false,
	})

	const handleOptionChange = (index, value) => {
		const newOptions = [...formData.options]
		newOptions[index] = value
		setFormData({ ...formData, options: newOptions })
	}

	const handleSentenceTextChange = (index, value) => {
		const newSentences = [...formData.sentences]
		newSentences[index] = { ...newSentences[index], text: value }
		setFormData({ ...formData, sentences: newSentences })
	}

	const handleSentenceCorrectChange = (index, value) => {
		const newSentences = [...formData.sentences]
		newSentences[index] = { ...newSentences[index], correct: parseInt(value) }
		setFormData({ ...formData, sentences: newSentences })
	}

	const handleDeleteSentence = (index) => {
		if (formData.sentences.length <= 2) {
			return // Garder au moins 2 phrases
		}
		const newSentences = formData.sentences.filter((_, i) => i !== index)
		setFormData({ ...formData, sentences: newSentences })
	}

	const handleAddSentence = () => {
		const newSentences = [...formData.sentences, { text: '', correct: 0 }]
		setFormData({ ...formData, sentences: newSentences })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		// Nettoyer les données avant envoi
		const dataToSave = {
			question_fr: formData.question_fr,
			question_en: formData.question_en,
			question_ru: formData.question_ru,
			options: formData.options,
			explanation_fr: formData.explanation_fr,
			explanation_en: formData.explanation_en,
			is_active: formData.is_active,
		}
		// Pour multi_fill, on envoie sentences, sinon correct_answer
		if (isMultiFill) {
			dataToSave.sentences = formData.sentences
		} else {
			dataToSave.correct_answer = formData.correct_answer
		}
		console.log('Saving question:', question.id, 'Data:', JSON.stringify(dataToSave, null, 2))
		onSave(question.id, dataToSave)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5 p-5 bg-indigo-50 rounded-xl border border-indigo-200">
			{/* Type badge */}
			<div className="flex items-center gap-2">
				<span className={cn(
					'px-2 py-0.5 rounded text-xs font-medium',
					question.type === 'mcq'
						? 'bg-indigo-100 text-indigo-700'
						: isMultiFill
						? 'bg-amber-100 text-amber-700'
						: 'bg-violet-100 text-violet-700'
				)}>
					{question.type === 'mcq' ? 'QCM' : isMultiFill ? 'Multi-Fill' : 'Dropdown'}
				</span>
				<span className="text-xs text-slate-400">#{question.id}</span>
			</div>

			<div className="grid grid-cols-1 gap-3">
				{/* Question FR - Hide if learning French */}
				{learningLang !== 'fr' && (
					<div>
						<label className="block text-xs font-medium text-slate-600 mb-1">Question (FR)</label>
						<input
							type="text"
							value={formData.question_fr}
							onChange={(e) => setFormData({ ...formData, question_fr: e.target.value })}
							className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
						/>
					</div>
				)}
				{/* Question EN - Always show (fallback language) */}
				<div>
					<label className="block text-xs font-medium text-slate-600 mb-1">Question (EN)</label>
					<input
						type="text"
						value={formData.question_en}
						onChange={(e) => setFormData({ ...formData, question_en: e.target.value })}
						className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
					/>
				</div>
				{/* Question RU - Hide if learning Russian */}
				{learningLang !== 'ru' && (
					<div>
						<label className="block text-xs font-medium text-slate-600 mb-1">Question (RU)</label>
						<input
							type="text"
							value={formData.question_ru}
							onChange={(e) => setFormData({ ...formData, question_ru: e.target.value })}
							className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
						/>
					</div>
				)}
			</div>

			{/* Options */}
			<div>
				<label className="block text-xs font-medium text-slate-600 mb-1">
					Options {!isMultiFill && '(cliquez sur la bonne reponse)'}
				</label>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{formData.options.map((opt, i) => (
						<div key={i} className="flex items-center gap-2">
							{!isMultiFill && (
								<button
									type="button"
									onClick={() => setFormData({ ...formData, correct_answer: i })}
									className={cn(
										'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
										formData.correct_answer === i
											? 'border-emerald-500 bg-emerald-500 text-white'
											: 'border-slate-300 hover:border-emerald-300'
									)}
								>
									{formData.correct_answer === i && <CheckCircle2 className="w-4 h-4" />}
								</button>
							)}
							{isMultiFill && (
								<span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
									{i + 1}
								</span>
							)}
							<input
								type="text"
								value={opt}
								onChange={(e) => handleOptionChange(i, e.target.value)}
								className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm"
							/>
						</div>
					))}
				</div>
			</div>

			{/* Sentences for multi_fill */}
			{isMultiFill && formData.sentences.length > 0 && (
				<div>
					<div className="flex items-center justify-between mb-2">
						<label className="block text-xs font-medium text-slate-600">
							Phrases (utilisez ___ pour le trou)
						</label>
						<span className="text-xs text-slate-400">
							{formData.sentences.length} phrase{formData.sentences.length > 1 ? 's' : ''}
						</span>
					</div>
					<div className="space-y-3">
						{formData.sentences.map((sentence, i) => (
							<div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
								<span className="text-xs font-medium text-slate-400 w-4">{i + 1}.</span>
								<input
									type="text"
									value={sentence.text}
									onChange={(e) => handleSentenceTextChange(i, e.target.value)}
									className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm"
									placeholder="Phrase avec ___"
								/>
								<div className="flex items-center gap-2">
									<span className="text-xs text-slate-500">Reponse:</span>
									<select
										value={sentence.correct}
										onChange={(e) => handleSentenceCorrectChange(i, e.target.value)}
										className="px-2 py-1 border border-slate-200 rounded text-sm bg-white"
									>
										{formData.options.map((opt, optIndex) => (
											<option key={optIndex} value={optIndex}>{opt}</option>
										))}
									</select>
								</div>
								<button
									type="button"
									onClick={() => handleDeleteSentence(i)}
									disabled={formData.sentences.length <= 2}
									className={cn(
										'p-1.5 rounded transition-colors',
										formData.sentences.length <= 2
											? 'text-slate-300 cursor-not-allowed'
											: 'text-slate-400 hover:text-red-500 hover:bg-red-50'
									)}
									title={formData.sentences.length <= 2 ? 'Minimum 2 phrases' : 'Supprimer cette phrase'}
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						))}
					</div>
					<button
						type="button"
						onClick={handleAddSentence}
						className="mt-3 flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
					>
						<Plus className="w-4 h-4" />
						Ajouter une phrase
					</button>
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<label className="block text-xs font-medium text-slate-600 mb-1">Explication (FR)</label>
					<textarea
						value={formData.explanation_fr}
						onChange={(e) => setFormData({ ...formData, explanation_fr: e.target.value })}
						className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
						rows={2}
					/>
				</div>
				<div>
					<label className="block text-xs font-medium text-slate-600 mb-1">Explication (EN)</label>
					<textarea
						value={formData.explanation_en}
						onChange={(e) => setFormData({ ...formData, explanation_en: e.target.value })}
						className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
						rows={2}
					/>
				</div>
			</div>

			<div className="flex items-center justify-between pt-2">
				<label className="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						checked={formData.is_active}
						onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
						className="rounded border-slate-300"
					/>
					<span className="text-slate-600">Question active</span>
				</label>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={onCancel}
						className="flex items-center gap-1 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm"
					>
						<XCircle className="w-4 h-4" />
						Annuler
					</button>
					<button
						type="submit"
						disabled={saving}
						className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
					>
						{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
						Enregistrer
					</button>
				</div>
			</div>
		</form>
	)
}

// ============================================
// PREVIEW COMPONENTS (User View)
// ============================================

// MCQ Question Preview
const MCQQuestionPreview = ({ question, onAnswer, answered, selectedAnswer, locale }) => {
	const questionText = question[`question_${locale}`] || question.question_fr || question.question_en
	const options = Array.isArray(question.options) ? question.options : (question.options?.[locale] || question.options?.fr || [])
	const explanation = question[`explanation_${locale}`] || question.explanation_fr || question.explanation_en
	const isCorrect = selectedAnswer === question.correct_answer

	return (
		<div className="space-y-8">
			<h3 className="text-2xl font-bold text-center text-slate-900 leading-relaxed">
				{questionText}
			</h3>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{options.map((option, index) => {
					const isSelected = selectedAnswer === index
					const isCorrectOption = index === question.correct_answer

					return (
						<button
							key={index}
							onClick={() => !answered && onAnswer(index)}
							disabled={answered}
							className={cn(
								'p-5 rounded-xl border-2 text-left transition-all font-semibold',
								answered
									? isCorrectOption
										? 'bg-emerald-500/20 border-emerald-500 text-emerald-700'
										: isSelected
										? 'bg-rose-500/20 border-rose-500 text-rose-700'
										: 'bg-slate-50 border-slate-200 text-slate-500'
									: isSelected
									? 'bg-violet-500/20 border-violet-500 text-violet-700'
									: 'bg-white border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50'
							)}
						>
							<div className="flex items-center gap-4">
								<span className={cn(
									'w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border-2 flex-shrink-0',
									answered
										? isCorrectOption
											? 'bg-emerald-500 border-emerald-600 text-white'
											: isSelected
											? 'bg-rose-500 border-rose-600 text-white'
											: 'bg-slate-100 border-slate-300 text-slate-500'
										: isSelected
										? 'bg-violet-500 border-violet-600 text-white'
										: 'bg-slate-100 border-slate-300 text-slate-600'
								)}>
									{String.fromCharCode(65 + index)}
								</span>
								<span className="text-base leading-relaxed">{option}</span>
							</div>
						</button>
					)
				})}
			</div>

			{answered && (
				<div className={cn(
					'p-4 rounded-xl',
					isCorrect
						? 'bg-emerald-500/10 border border-emerald-500/30'
						: 'bg-rose-500/10 border border-rose-500/30'
				)}>
					<div className="flex items-center gap-2 mb-2">
						{isCorrect ? (
							<CheckCircle2 className="w-5 h-5 text-emerald-500" />
						) : (
							<XCircle className="w-5 h-5 text-rose-500" />
						)}
						<span className={cn('font-bold', isCorrect ? 'text-emerald-600' : 'text-rose-600')}>
							{isCorrect ? 'Correct !' : 'Incorrect'}
						</span>
					</div>
					{explanation && (
						<p className="text-sm text-slate-600">
							{explanation}
						</p>
					)}
				</div>
			)}
		</div>
	)
}

// Multi-Fill Question Preview
const MultiFillQuestionPreview = ({ question, onAnswer, answered, locale }) => {
	const [answers, setAnswers] = useState({})
	const questionText = question[`question_${locale}`] || question.question_fr || question.question_en
	const explanation = question[`explanation_${locale}`] || question.explanation_fr || question.explanation_en
	const options = question.options || []
	const sentences = question.sentences || []

	const allCorrect = sentences.every((s, i) => answers[i] === s.correct)

	const handleSelectAnswer = (sentenceIndex, optionIndex) => {
		if (answered) return
		const newAnswers = { ...answers, [sentenceIndex]: optionIndex }
		setAnswers(newAnswers)

		if (Object.keys(newAnswers).length === sentences.length) {
			const correctCount = sentences.filter((s, i) => newAnswers[i] === s.correct).length
			onAnswer(correctCount)
		}
	}

	return (
		<div className="space-y-8">
			<h3 className="text-2xl font-bold text-center text-slate-900 leading-relaxed">
				{questionText}
			</h3>

			{/* Options display */}
			<div className="flex flex-wrap justify-center gap-3 pb-6 border-b border-slate-200">
				{options.map((opt, i) => (
					<span
						key={i}
						className="px-4 py-2 rounded-lg font-semibold text-base bg-slate-100 text-slate-700"
					>
						{opt}
					</span>
				))}
			</div>

			{/* Sentences */}
			<div className="space-y-5">
				{sentences.map((sentence, sIndex) => {
					const parts = sentence.text.split('___')
					const selectedOpt = answers[sIndex]
					const isCorrectAnswer = answered && selectedOpt === sentence.correct
					const isWrongAnswer = answered && selectedOpt !== undefined && selectedOpt !== sentence.correct

					return (
						<div
							key={sIndex}
							className={cn(
								'p-5 rounded-xl border-2 transition-all',
								answered
									? isCorrectAnswer
										? 'bg-emerald-500/10 border-emerald-500'
										: isWrongAnswer
										? 'bg-rose-500/10 border-rose-500'
										: 'bg-slate-50 border-slate-200'
									: 'bg-white border-slate-200'
							)}
						>
							<div className="flex items-center flex-wrap gap-3">
								<span className="text-lg font-medium text-slate-900 leading-relaxed">{parts[0]}</span>
								<select
									value={selectedOpt ?? ''}
									onChange={(e) => handleSelectAnswer(sIndex, parseInt(e.target.value))}
									disabled={answered}
									className={cn(
										'px-4 py-2.5 rounded-lg font-bold text-base text-center min-w-[140px]',
										'border-2 transition-all cursor-pointer',
										answered
											? isCorrectAnswer
												? 'bg-emerald-500 text-white border-emerald-600'
												: isWrongAnswer
												? 'bg-rose-500 text-white border-rose-600'
												: 'bg-slate-100 border-slate-300 text-slate-600'
											: selectedOpt !== undefined
											? 'bg-violet-500 text-white border-violet-600'
											: 'bg-white border-slate-300 text-slate-700'
									)}
								>
									<option value="" disabled>___</option>
									{options.map((opt, oIndex) => (
										<option key={oIndex} value={oIndex}>{opt}</option>
									))}
								</select>
								<span className="text-lg font-medium text-slate-900 leading-relaxed">{parts[1] || ''}</span>
								{answered && isWrongAnswer && (
									<span className="ml-2 text-base text-emerald-600 font-bold">
										→ {options[sentence.correct]}
									</span>
								)}
							</div>
						</div>
					)
				})}
			</div>

			{answered && explanation && (
				<div className={cn(
					'p-4 rounded-xl',
					allCorrect
						? 'bg-emerald-500/10 border border-emerald-500/30'
						: 'bg-amber-500/10 border border-amber-500/30'
				)}>
					<p className="text-sm text-slate-600">{explanation}</p>
				</div>
			)}
		</div>
	)
}

// Dropdown Question Preview
const DropdownQuestionPreview = ({ question, onAnswer, answered, selectedAnswer, locale }) => {
	const options = Array.isArray(question.options) ? question.options : (question.options?.[locale] || question.options?.fr || [])
	const explanation = question[`explanation_${locale}`] || question.explanation_fr || question.explanation_en
	const sentence = question.sentence || ''
	const parts = sentence.split('___')
	const isCorrect = selectedAnswer === question.correct_answer

	return (
		<div className="space-y-8">
			<h3 className="text-xl font-semibold text-center text-slate-600 mb-2">
				Completez la phrase
			</h3>

			<div className="text-2xl font-bold text-center flex items-center justify-center gap-3 flex-wrap text-slate-900 leading-relaxed">
				<span>{parts[0]}</span>
				<select
					value={selectedAnswer !== null ? selectedAnswer : ''}
					onChange={(e) => !answered && onAnswer(parseInt(e.target.value))}
					disabled={answered}
					className={cn(
						'px-5 py-3 rounded-xl font-bold text-xl',
						'border-2 transition-all cursor-pointer',
						answered
							? isCorrect
								? 'bg-emerald-500/20 border-emerald-500 text-emerald-700'
								: 'bg-rose-500/20 border-rose-500 text-rose-700'
							: 'bg-white border-violet-200 text-violet-600'
					)}
				>
					<option value="" disabled>___</option>
					{options.map((option, index) => (
						<option key={index} value={index}>{option}</option>
					))}
				</select>
				<span>{parts[1]}</span>
			</div>

			{answered && (
				<div className={cn(
					'p-4 rounded-xl text-center',
					isCorrect
						? 'bg-emerald-500/10 border border-emerald-500/30'
						: 'bg-rose-500/10 border border-rose-500/30'
				)}>
					<div className="flex items-center justify-center gap-2 mb-2">
						{isCorrect ? (
							<CheckCircle2 className="w-5 h-5 text-emerald-500" />
						) : (
							<XCircle className="w-5 h-5 text-rose-500" />
						)}
						<span className={cn('font-bold', isCorrect ? 'text-emerald-600' : 'text-rose-600')}>
							{isCorrect ? 'Correct !' : 'Incorrect'}
						</span>
					</div>
					{!isCorrect && (
						<p className="text-sm text-slate-600 mb-2">
							Bonne reponse: <span className="font-semibold text-emerald-600">{options[question.correct_answer]}</span>
						</p>
					)}
					{explanation && (
						<p className="text-sm text-slate-600">{explanation}</p>
					)}
				</div>
			)}
		</div>
	)
}

// Single Question Preview Component
const SingleQuestionPreview = ({ question, onClose, locale }) => {
	const [answered, setAnswered] = useState(false)
	const [selectedAnswer, setSelectedAnswer] = useState(null)

	const handleAnswer = (answer) => {
		setSelectedAnswer(answer)
		setAnswered(true)
	}

	const handleReset = () => {
		setAnswered(false)
		setSelectedAnswer(null)
	}

	return (
		<div className="bg-gradient-to-br from-slate-50 to-violet-50 rounded-xl border border-violet-200 p-6">
			<div className="flex items-center justify-between mb-4 pb-4 border-b border-violet-200">
				<div className="flex items-center gap-2">
					<Eye className="w-5 h-5 text-violet-500" />
					<span className="font-semibold text-violet-700">Previsualisation</span>
					<span className={cn(
						'px-2 py-0.5 rounded text-xs font-medium',
						question.type === 'mcq'
							? 'bg-indigo-100 text-indigo-700'
							: question.type === 'multi_fill'
							? 'bg-amber-100 text-amber-700'
							: 'bg-violet-100 text-violet-700'
					)}>
						{question.type === 'mcq' ? 'QCM' : question.type === 'multi_fill' ? 'Multi-Fill' : 'Dropdown'}
					</span>
				</div>
				<button
					onClick={onClose}
					className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
				>
					<X className="w-5 h-5" />
				</button>
			</div>

			<div className="bg-white rounded-xl border border-slate-200 p-8 mb-4">
				{question.type === 'mcq' ? (
					<MCQQuestionPreview
						question={question}
						onAnswer={handleAnswer}
						answered={answered}
						selectedAnswer={selectedAnswer}
						locale={locale}
					/>
				) : question.type === 'multi_fill' ? (
					<MultiFillQuestionPreview
						question={question}
						onAnswer={handleAnswer}
						answered={answered}
						locale={locale}
					/>
				) : (
					<DropdownQuestionPreview
						question={question}
						onAnswer={handleAnswer}
						answered={answered}
						selectedAnswer={selectedAnswer}
						locale={locale}
					/>
				)}
			</div>

			<div className="flex items-center justify-between">
				<button
					onClick={handleReset}
					className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
				>
					<RotateCcw className="w-4 h-4" />
					Reinitialiser
				</button>
				<button
					onClick={onClose}
					className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
				>
					Fermer
				</button>
			</div>
		</div>
	)
}

// Theme Detail Panel Component
const ThemeDetailPanel = ({ theme, level, lang, onClose, locale }) => {
	const queryClient = useQueryClient()
	const [editingId, setEditingId] = useState(null)
	const [previewingQuestionId, setPreviewingQuestionId] = useState(null)
	const [mouseDownTarget, setMouseDownTarget] = useState(null)
	const [statusFilter, setStatusFilter] = useState('all') // all, published, draft

	// Fetch questions for this theme
	const { data: questionsData, isLoading, error } = useQuery({
		queryKey: ['admin-training-questions', theme.id],
		queryFn: () => getAdminTrainingQuestionsAction(theme.id),
		enabled: !!theme.id,
	})

	const allQuestions = questionsData?.data || []

	// Filter questions by status
	const questions = statusFilter === 'all'
		? allQuestions
		: allQuestions.filter(q => q.status === statusFilter)

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: deleteTrainingQuestionAction,
		onSuccess: () => {
			toast.success('Question supprimee')
			setPreviewingQuestionId(null)
			queryClient.invalidateQueries({ queryKey: ['admin-training-questions', theme.id] })
			queryClient.invalidateQueries({ queryKey: ['training-stats'] })
		},
		onError: (error) => {
			toast.error(error.message || 'Erreur lors de la suppression')
		},
	})

	// Update mutation
	const updateMutation = useMutation({
		mutationFn: ({ questionId, updates }) => updateTrainingQuestionAction(questionId, updates),
		onSuccess: () => {
			toast.success('Question mise a jour')
			setEditingId(null)
			setPreviewingQuestionId(null)
			queryClient.invalidateQueries({ queryKey: ['admin-training-questions', theme.id] })
		},
		onError: (error) => {
			toast.error(error.message || 'Erreur lors de la mise a jour')
		},
	})

	// Publish mutation
	const publishMutation = useMutation({
		mutationFn: publishTrainingQuestionAction,
		onSuccess: () => {
			toast.success('Question publiee')
			queryClient.invalidateQueries({ queryKey: ['admin-training-questions', theme.id] })
			queryClient.invalidateQueries({ queryKey: ['training-stats'] })
		},
		onError: (error) => {
			toast.error(error.message || 'Erreur lors de la publication')
		},
	})

	// Bulk publish mutation
	const bulkPublishMutation = useMutation({
		mutationFn: bulkPublishQuestionsAction,
		onSuccess: (data) => {
			toast.success(`${data.count} question(s) publiee(s)`)
			queryClient.invalidateQueries({ queryKey: ['admin-training-questions', theme.id] })
			queryClient.invalidateQueries({ queryKey: ['training-stats'] })
		},
		onError: (error) => {
			toast.error(error.message || 'Erreur lors de la publication')
		},
	})

	const handleDeleteQuestion = (questionId) => {
		if (confirm('Supprimer cette question ?')) {
			deleteMutation.mutate(questionId)
		}
	}

	const handleSaveQuestion = (questionId, updates) => {
		console.log('handleSaveQuestion called with:', questionId, updates)
		updateMutation.mutate({ questionId, updates })
	}

	const handlePublishQuestion = (questionId) => {
		publishMutation.mutate(questionId)
	}

	const handlePublishAllDrafts = () => {
		const draftIds = allQuestions
			.filter(q => q.status === 'draft')
			.map(q => q.id)

		if (draftIds.length === 0) {
			toast.info('Aucune question en brouillon')
			return
		}

		if (confirm(`Publier ${draftIds.length} question(s) en brouillon ?`)) {
			bulkPublishMutation.mutate(draftIds)
		}
	}

	const getThemeLabel = () => {
		// Show label in interface language
		if (locale === 'fr' && theme.label_fr) return theme.label_fr
		if (locale === 'ru' && theme.label_ru) return theme.label_ru
		if (locale === 'en' && theme.label_en) return theme.label_en
		// Fallback to available labels
		return theme.label_fr || theme.label_en || theme.label_ru || theme.key
	}

	const handleBackdropMouseDown = (e) => {
		if (e.target === e.currentTarget) {
			setMouseDownTarget(e.target)
		}
	}

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget && mouseDownTarget === e.currentTarget) {
			onClose()
		}
		setMouseDownTarget(null)
	}

	return (
		<div
			className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-8 overflow-y-auto"
			onMouseDown={handleBackdropMouseDown}
			onClick={handleBackdropClick}
		>
			<div
				className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 mb-8"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-slate-200">
					<div className="flex items-center gap-4">
						<button
							onClick={onClose}
							className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
						>
							<ArrowLeft className="w-5 h-5" />
						</button>
						<span className="text-3xl">{theme.icon}</span>
						<div>
							<h2 className="text-xl font-bold text-slate-800">{getThemeLabel()}</h2>
							<p className="text-sm text-slate-500">
								{levelConfig[level]?.label[locale] || level} - {lang.toUpperCase()}
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Claude Code Prompt Hint */}
				<div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-200">
					<div className="flex items-start gap-3">
						<div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
							<Wand2 className="w-4 h-4 text-violet-600" />
						</div>
						<div className="flex-1">
							<p className="text-xs text-slate-500 mb-1">Prompt a copier dans Claude Code :</p>
							<p className="text-sm text-slate-700 bg-white/70 p-2 rounded border border-violet-200 font-mono">
								Genere 10 questions de vocabulaire russe pour le theme {getThemeLabel()} (niveau {level}).
								Utilise le format MCQ et dropdown. Ajoute des explications en francais, anglais et russe.
							</p>
						</div>
					</div>
				</div>

				{/* Questions List */}
				<div className="p-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
						<div className="flex items-center gap-3">
							<h3 className="font-semibold text-slate-800">
								Questions ({questions.length}{statusFilter !== 'all' ? ` / ${allQuestions.length}` : ''})
							</h3>

							{/* Status counters */}
							<div className="flex items-center gap-2">
								<span className="text-xs text-slate-500">
									{allQuestions.filter(q => q.status === 'published').length} publiees
								</span>
								<span className="text-xs text-slate-400">•</span>
								<span className="text-xs text-amber-600">
									{allQuestions.filter(q => q.status === 'draft').length} brouillons
								</span>
							</div>
						</div>

						<div className="flex items-center gap-2">
							{/* Status Filter */}
							<div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
								<button
									onClick={() => setStatusFilter('all')}
									className={cn(
										'px-3 py-1 rounded text-xs font-medium transition-colors',
										statusFilter === 'all'
											? 'bg-white text-slate-800 shadow-sm'
											: 'text-slate-500 hover:text-slate-700'
									)}
								>
									Toutes
								</button>
								<button
									onClick={() => setStatusFilter('published')}
									className={cn(
										'px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1',
										statusFilter === 'published'
											? 'bg-emerald-100 text-emerald-700 shadow-sm'
											: 'text-slate-500 hover:text-emerald-600'
									)}
								>
									<FileCheck className="w-3 h-3" />
									Publiees
								</button>
								<button
									onClick={() => setStatusFilter('draft')}
									className={cn(
										'px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1',
										statusFilter === 'draft'
											? 'bg-amber-100 text-amber-700 shadow-sm'
											: 'text-slate-500 hover:text-amber-600'
									)}
								>
									<FilePenLine className="w-3 h-3" />
									Brouillons
								</button>
							</div>

							{/* Publish All Drafts Button */}
							{allQuestions.filter(q => q.status === 'draft').length > 0 && (
								<button
									onClick={handlePublishAllDrafts}
									disabled={bulkPublishMutation.isPending}
									className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
								>
									{bulkPublishMutation.isPending ? (
										<Loader2 className="w-3.5 h-3.5 animate-spin" />
									) : (
										<CheckCheck className="w-3.5 h-3.5" />
									)}
									Publier les brouillons
								</button>
							)}
						</div>
					</div>

					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
						</div>
					) : questions.length === 0 ? (
						<div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
							<HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
							<p className="text-slate-500">Aucune question pour ce theme</p>
							<p className="text-xs text-slate-400 mt-2">Utilisez le prompt ci-dessus dans Claude Code</p>
						</div>
					) : (
						<div className="space-y-3">
							{questions.map((question) => (
								<div key={question.id}>
									{previewingQuestionId === question.id ? (
										<SingleQuestionPreview
											question={question}
											onClose={() => setPreviewingQuestionId(null)}
											locale={locale}
										/>
									) : editingId === question.id ? (
										<QuestionEditForm
											question={question}
											onSave={handleSaveQuestion}
											onCancel={() => setEditingId(null)}
											saving={updateMutation.isPending}
											learningLang={lang}
										/>
									) : (
										<div
											className={cn(
												'p-4 rounded-xl border transition-all',
												question.is_active
													? 'bg-white border-slate-200 hover:border-indigo-300'
													: 'bg-slate-50 border-slate-100 opacity-60'
											)}
										>
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-2">
														<span className={cn(
															'px-2 py-0.5 rounded text-xs font-medium',
															question.type === 'mcq'
																? 'bg-indigo-100 text-indigo-700'
																: question.type === 'multi_fill'
																? 'bg-amber-100 text-amber-700'
																: 'bg-violet-100 text-violet-700'
														)}>
															{question.type === 'mcq' ? 'QCM' : question.type === 'multi_fill' ? 'Multi-Fill' : 'Dropdown'}
														</span>
														<span className="text-xs text-slate-400">#{question.id}</span>

														{/* Status Badge */}
														{question.status === 'draft' ? (
															<span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 flex items-center gap-1">
																<FilePenLine className="w-3 h-3" />
																Brouillon
															</span>
														) : question.status === 'published' ? (
															<span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1">
																<FileCheck className="w-3 h-3" />
																Publiee
															</span>
														) : null}

														{!question.is_active && (
															<span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
																Inactive
															</span>
														)}
													</div>

													<p className="text-slate-800 font-medium">
														{question.question_fr || question.question_en || 'Question sans titre'}
													</p>

													{/* Dropdown: show sentence */}
													{question.type === 'dropdown' && question.sentence && (
														<div className="mt-2">
															<span className="text-sm text-slate-600 italic">{question.sentence}</span>
														</div>
													)}

													{/* Multi-fill: show sentences */}
													{question.type === 'multi_fill' && question.sentences && (
														<div className="mt-2 space-y-1">
															{question.sentences.map((s, i) => (
																<div key={i} className="flex items-center gap-2 text-sm">
																	<span className="text-slate-600">{s.text.replace('___', '')}</span>
																	<span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">
																		{question.options[s.correct]}
																	</span>
																</div>
															))}
														</div>
													)}

													{/* Options for MCQ/Dropdown */}
													{question.type !== 'multi_fill' && (
														<div className="mt-2 flex flex-wrap gap-2">
															{(Array.isArray(question.options)
																? question.options
																: question.options?.fr || question.options?.en || []
															).map((opt, i) => (
																<span
																	key={i}
																	className={cn(
																		'px-2 py-1 rounded text-sm',
																		i === question.correct_answer
																			? 'bg-emerald-100 text-emerald-700 font-medium'
																			: 'bg-slate-100 text-slate-600'
																	)}
																>
																	{opt}
																</span>
															))}
														</div>
													)}

													{/* Options list for multi_fill */}
													{question.type === 'multi_fill' && (
														<div className="mt-2 flex flex-wrap gap-2">
															<span className="text-xs text-slate-500">Options:</span>
															{question.options.map((opt, i) => (
																<span key={i} className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600">
																	{opt}
																</span>
															))}
														</div>
													)}

													{question.explanation_fr && (
														<p className="mt-2 text-sm text-slate-500 italic">
															{question.explanation_fr}
														</p>
													)}
												</div>

												<div className="flex items-center gap-1">
													{/* Publish button (only for draft questions) */}
													{question.status === 'draft' && (
														<button
															onClick={() => handlePublishQuestion(question.id)}
															disabled={publishMutation.isPending}
															className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
															title="Publier"
														>
															{publishMutation.isPending ? (
																<Loader2 className="w-4 h-4 animate-spin" />
															) : (
																<CheckCheck className="w-4 h-4" />
															)}
														</button>
													)}
													<button
														onClick={() => setPreviewingQuestionId(question.id)}
														className="p-2 text-slate-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition-colors"
														title="Previsualiser"
													>
														<Eye className="w-4 h-4" />
													</button>
													<button
														onClick={() => setEditingId(question.id)}
														className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
														title="Modifier"
													>
														<Edit3 className="w-4 h-4" />
													</button>
													<button
														onClick={() => handleDeleteQuestion(question.id)}
														className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
														title="Supprimer"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

// Section tabs config
const sectionTabs = [
	{ key: 'vocabulary', icon: BookA, label: { fr: 'Vocabulaire', en: 'Vocabulary' } },
	{ key: 'grammar', icon: GraduationCap, label: { fr: 'Grammaire', en: 'Grammar' } },
]

const TrainingAdminClient = () => {
	const t = useTranslations('admin')
	const locale = useLocale()
	const [activeSection, setActiveSection] = useState('vocabulary')
	const [selectedLang, setSelectedLang] = useState('ru')
	const [selectedLevel, setSelectedLevel] = useState('beginner')
	const [selectedTheme, setSelectedTheme] = useState(null)
	const [selectedThemeLevel, setSelectedThemeLevel] = useState(null)

	// Fetch themes from DB
	const { data: themesData, isLoading: themesLoading } = useQuery({
		queryKey: ['training-themes', selectedLang],
		queryFn: () => getTrainingThemesAction(selectedLang),
	})

	// Fetch stats from DB
	const { data: statsData } = useQuery({
		queryKey: ['training-stats', selectedLang],
		queryFn: () => getTrainingStatsAction(selectedLang),
	})

	// Use DB data or fallback to defaults
	const themes = themesData?.success && themesData.data
		? themesData.data
		: defaultThemes[selectedLang] || {}

	// Build question counts from stats
	const stats = statsData?.data || []
	const questionCounts = {}
	stats.forEach((stat) => {
		if (!questionCounts[stat.level]) questionCounts[stat.level] = {}
		questionCounts[stat.level][stat.key] = stat.question_count || 0
	})

	const handleThemeClick = (theme, level) => {
		setSelectedTheme(theme)
		setSelectedThemeLevel(level)
	}

	// Calculate totals
	const totalThemes = Object.values(themes).flat().length
	const totalQuestions = stats.reduce((sum, stat) => sum + (stat.question_count || 0), 0)

	return (
		<div className="min-h-screen bg-slate-50 pt-16">
			<AdminNavbar activePage="training" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Filters */}
				<div className="space-y-3 mb-6">
					{/* Category + Language Row */}
					<div className="bg-white rounded-lg border border-slate-200 p-3">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
							{/* Category Tabs */}
							<div className="flex items-center gap-2">
								{sectionTabs.map((tab) => {
									const Icon = tab.icon
									return (
										<button
											key={tab.key}
											onClick={() => setActiveSection(tab.key)}
											className={cn(
												'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all',
												activeSection === tab.key
													? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md'
													: 'text-slate-500 hover:bg-slate-100'
											)}
										>
											<Icon className="w-4 h-4" />
											{tab.label[locale] || tab.label.en}
										</button>
									)
								})}
							</div>

							{/* Language Selector */}
							<div className="flex items-center gap-2">
								<span className="text-xs font-medium text-slate-500">
									{t('language') || 'Language'}:
								</span>
								<button
									onClick={() => setSelectedLang('ru')}
									className={cn(
										'px-3 py-1.5 rounded-lg font-medium text-sm transition-all',
										selectedLang === 'ru'
											? 'bg-red-100 text-red-700 border border-red-300'
											: 'text-slate-500 hover:bg-slate-100'
									)}
								>
									🇷🇺 Russe
								</button>
								<button
									onClick={() => setSelectedLang('fr')}
									className={cn(
										'px-3 py-1.5 rounded-lg font-medium text-sm transition-all',
										selectedLang === 'fr'
											? 'bg-blue-100 text-blue-700 border border-blue-300'
											: 'text-slate-500 hover:bg-slate-100'
									)}
								>
									🇫🇷 Français
								</button>
							</div>
						</div>
					</div>

					{/* Level Filters */}
					{activeSection === 'vocabulary' && (
						<div className="bg-white rounded-lg border border-slate-200 p-3">
							<div className="flex items-center gap-2">
								{Object.entries(levelConfig).map(([levelKey, config]) => {
									const colors = colorClasses[config.color]
									const Icon = config.icon
									return (
										<button
											key={levelKey}
											onClick={() => setSelectedLevel(levelKey)}
											className={cn(
												'flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all',
												'border-2 flex items-center justify-center gap-2',
												selectedLevel === levelKey
													? ['bg-gradient-to-br text-white shadow-md', colors.bg, colors.border]
													: [colors.text, colors.border, 'hover:bg-opacity-10']
											)}
										>
											<Icon className="w-4 h-4" />
											{getLocalizedText(config.label, locale)}
										</button>
									)
								})}
							</div>
						</div>
					)}
				</div>

				{/* Vocabulary Section */}
				{activeSection === 'vocabulary' && (
					<>
						{themesLoading ? (
							<div className="flex items-center justify-center py-12">
								<Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
							</div>
						) : (
							<div className="bg-white rounded-lg border border-slate-200 p-4">
								{(() => {
									const levelThemes = themes[selectedLevel] || []
									const levelCounts = questionCounts[selectedLevel] || {}
									const config = levelConfig[selectedLevel]
									const colors = colorClasses[config?.color || 'emerald']

									return (
										<>
											{/* Level Header */}
											<div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
												<div className="flex items-center gap-3">
													<div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colors.bg)}>
														{(() => {
															const Icon = config?.icon || Target
															return <Icon className={cn('w-4 h-4', colors.text)} />
														})()}
													</div>
													<div>
														<h3 className="font-bold text-slate-800">
															{getLocalizedText(config?.label, locale)}
														</h3>
														<p className="text-xs text-slate-500">
															{levelThemes.length} thèmes
														</p>
													</div>
												</div>
											</div>

											{/* Themes Grid */}
											<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
												{levelThemes
													.sort((a, b) => {
														// Put verb themes at the end
														const aIsVerb = a.key === 'verbs' ||
															a.key.includes('verb') ||
															a.label_fr?.toLowerCase().includes('verbe') ||
															a.label_en?.toLowerCase().includes('verb')
														const bIsVerb = b.key === 'verbs' ||
															b.key.includes('verb') ||
															b.label_fr?.toLowerCase().includes('verbe') ||
															b.label_en?.toLowerCase().includes('verb')
														if (aIsVerb && !bIsVerb) return 1
														if (!aIsVerb && bIsVerb) return -1
														return 0
													})
													.map((theme) => {
														const questionCount = levelCounts[theme.key] || 0
														const hasQuestions = questionCount > 0
														const isVerbTheme = theme.key === 'verbs' ||
															theme.key.includes('verb') ||
															theme.label_fr?.toLowerCase().includes('verbe') ||
															theme.label_en?.toLowerCase().includes('verb')

														return (
															<button
																key={theme.key}
																onClick={() => handleThemeClick(theme, selectedLevel)}
																className={cn(
																	'p-3 rounded-lg border-2 transition-all text-left group relative',
																	isVerbTheme
																		? hasQuestions
																			? 'bg-amber-50 border-amber-300 hover:border-amber-500 hover:shadow-sm'
																			: 'bg-amber-50/50 border-amber-200 hover:border-amber-400 hover:bg-amber-50'
																		: hasQuestions
																		? 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-sm'
																		: 'bg-slate-50 border-slate-100 hover:border-indigo-300 hover:bg-white'
																)}
															>
																{isVerbTheme && (
																	<div className="absolute top-1 right-1">
																		<div className="px-1.5 py-0.5 rounded text-xs font-bold bg-amber-500 text-white">
																			V
																		</div>
																	</div>
																)}
																<div className="flex items-center gap-2 mb-1.5">
																	<span className="text-xl">{theme.icon}</span>
																	{hasQuestions ? (
																		<CheckCircle2 className="w-4 h-4 text-emerald-500" />
																	) : (
																		<Plus className={cn(
																			'w-4 h-4 transition-colors',
																			isVerbTheme
																				? 'text-amber-300 group-hover:text-amber-600'
																				: 'text-slate-300 group-hover:text-indigo-500'
																		)} />
																	)}
																</div>
																<h4 className={cn(
																	'font-medium text-sm mb-0.5 line-clamp-2',
																	isVerbTheme ? 'text-amber-900' : 'text-slate-800'
																)}>
																	{(() => {
																		// Show label in interface language
																		if (locale === 'fr' && theme.label_fr) return theme.label_fr
																		if (locale === 'ru' && theme.label_ru) return theme.label_ru
																		if (locale === 'en' && theme.label_en) return theme.label_en
																		// Fallback to available labels
																		return theme.label_fr || theme.label_en || theme.label_ru || theme.key
																	})()}
																</h4>
																<p className={cn(
																	'text-xs',
																	isVerbTheme ? 'text-amber-600' : 'text-slate-500'
																)}>
																	{questionCount} Q
																</p>
															</button>
														)
													})}
											</div>
										</>
									)
								})()}
							</div>
						)}
					</>
				)}

				{/* Grammar Section */}
				{activeSection === 'grammar' && (
					<div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
						<div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-violet-200 flex items-center justify-center mx-auto mb-6">
							<GraduationCap className="w-10 h-10 text-purple-600" />
						</div>
						<h3 className="text-xl font-bold text-slate-800 mb-2">
							{locale === 'fr' ? 'Section Grammaire' : 'Grammar Section'}
						</h3>
						<p className="text-slate-500 max-w-md mx-auto mb-6">
							{locale === 'fr'
								? 'Cette section permettra de gerer les exercices de grammaire (conjugaison, declinaisons, syntaxe, etc.)'
								: 'This section will allow managing grammar exercises (conjugation, declensions, syntax, etc.)'}
						</p>
						<span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium text-sm">
							<Sparkles className="w-4 h-4" />
							{locale === 'fr' ? 'Bientot disponible' : 'Coming soon'}
						</span>
					</div>
				)}
			</div>

			{/* Theme Detail Panel */}
			{selectedTheme && (
				<ThemeDetailPanel
					theme={selectedTheme}
					level={selectedThemeLevel}
					lang={selectedLang}
					onClose={() => {
						setSelectedTheme(null)
						setSelectedThemeLevel(null)
					}}
					locale={locale}
				/>
			)}
		</div>
	)
}

export default TrainingAdminClient
