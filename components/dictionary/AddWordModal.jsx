'use client'

/**
 * Add Word Modal - allows user to manually add a word to their dictionary
 * Mobile: Full-screen view | Desktop: Centered dialog
 */

import { useState, useEffect, useMemo } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import { validateWordPair } from '@/utils/validation'
import { addWordAction } from '@/app/actions/words'
import { addGuestWord } from '@/utils/guestDictionary'
import { buildWordData } from '@/utils/wordMapping'
import toast from '@/utils/toast'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Plus, Loader2, BookOpen, MessageSquare } from 'lucide-react'
import {
	MobileModal,
	MobileModalContent,
	MobileModalHeader,
	MobileModalTitle,
	MobileModalFooter,
} from '@/components/ui/mobile-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { logger } from '@/utils/logger'

const STORAGE_KEY = 'addWordModal_formData'

const AddWordModal = ({ open, onClose }) => {
	const t = useTranslations('words')
	const queryClient = useQueryClient()
	const params = useParams()
	const { isDark } = useThemeMode()
	const { user, userLearningLanguage, userProfile } = useUserContext()
	const locale = params.locale

	// Get spoken language: DB for logged-in users, localStorage or locale for guests
	const spokenLanguage = useMemo(() => {
		if (userProfile?.spoken_language) {
			return userProfile.spoken_language
		}
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('spoken_language')
			if (stored) return stored
		}
		return locale
	}, [userProfile?.spoken_language, locale])

	// Charger les données depuis sessionStorage au montage
	const loadFromStorage = () => {
		if (typeof window === 'undefined') return { learningLangWord: '', browserLangWord: '', contextSentence: '' }

		try {
			const stored = sessionStorage.getItem(STORAGE_KEY)
			if (stored) {
				return JSON.parse(stored)
			}
		} catch (error) {
			logger.error('Error loading from sessionStorage:', error)
		}
		return { learningLangWord: '', browserLangWord: '', contextSentence: '' }
	}

	const initialData = loadFromStorage()
	const [learningLangWord, setLearningLangWord] = useState(initialData.learningLangWord)
	const [browserLangWord, setBrowserLangWord] = useState(initialData.browserLangWord)
	const [contextSentence, setContextSentence] = useState(initialData.contextSentence)
	const [errors, setErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	// React Query mutation for adding words
	const addWordMutation = useMutation({
		mutationFn: addWordAction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userWords', user.id, userLearningLanguage] })
			toast.success(t('word_add_success') || 'Traduction ajoutee avec succes.')
			clearFormData()
			onClose()
		},
		onError: (error) => {
			logger.error('Error adding word:', error)
			if (error.message === 'duplicate_translation') {
				toast.error(t('duplicate_translation') || 'Cette traduction est deja enregistree.')
			} else {
				toast.error(t('word_add_error') || 'Une erreur inattendue est survenue.')
			}
		},
	})


	// Sauvegarder dans sessionStorage à chaque changement
	useEffect(() => {
		if (typeof window === 'undefined') return

		const formData = {
			learningLangWord,
			browserLangWord,
			contextSentence,
		}

		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
		} catch (error) {
			logger.error('Error saving to sessionStorage:', error)
		}
	}, [learningLangWord, browserLangWord, contextSentence])

	// Déterminer les noms de langues à afficher
	const getLearningLanguageName = () => {
		return userLearningLanguage === 'ru' ? t('language_ru') : t('language_fr')
	}

	const getBrowserLanguageName = () => {
		if (locale === 'fr') return t('language_fr')
		return t('language_ru')
	}

	const clearFormData = () => {
		setLearningLangWord('')
		setBrowserLangWord('')
		setContextSentence('')
		setErrors({})
		// Nettoyer sessionStorage
		if (typeof window !== 'undefined') {
			try {
				sessionStorage.removeItem(STORAGE_KEY)
			} catch (error) {
				logger.error('Error clearing sessionStorage:', error)
			}
		}
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setErrors({})
		setIsSubmitting(true)

		// Validation côté client
		const validation = validateWordPair({
			learningLangWord,
			browserLangWord,
			contextSentence,
		})

		if (!validation.isValid) {
			setErrors(validation.errors)
			setIsSubmitting(false)
			return
		}

		// Guest user: add to localStorage
		if (!user) {
			const wordData = buildWordData(
				validation.sanitized.learningLangWord,
				validation.sanitized.browserLangWord,
				userLearningLanguage,
				spokenLanguage
			)
			wordData.word_sentence = validation.sanitized.contextSentence || ''
			wordData.material_id = null
			wordData.word_lang = userLearningLanguage

			const result = addGuestWord(wordData)

			if (result.success) {
				toast.success(t('word_add_success') || 'Traduction ajoutee avec succes.')

				// Emit event to notify DictionaryClient to reload guest words
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new CustomEvent('guestDictionaryUpdated'))
				}

				clearFormData()
				onClose()
			} else if (result.error === 'limit_reached') {
				toast.error(
					t('guest_words_limit_reached') ||
					`Limite de ${result.maxWords} mots atteinte. Creez un compte pour continuer.`
				)
			} else if (result.error === 'duplicate') {
				toast.error(t('duplicate_translation') || 'Cette traduction est deja enregistree.')
			} else {
				toast.error(t('word_add_error') || 'Une erreur inattendue est survenue.')
			}

			setIsSubmitting(false)
			return
		}

		// Authenticated user: call mutation with validated data
		addWordMutation.mutate({
			originalWord: validation.sanitized.learningLangWord,
			translatedWord: validation.sanitized.browserLangWord,
			userId: user.id,
			materialId: null,
			word_sentence: validation.sanitized.contextSentence || '',
			userLearningLanguage,
			locale: spokenLanguage,
		})

		setIsSubmitting(false)
	}

	const handleClose = () => {
		clearFormData()
		onClose()
	}

	return (
		<MobileModal open={open} onOpenChange={handleClose}>
			<MobileModalContent isDark={isDark} className="sm:max-w-md">
				<MobileModalHeader>
					{/* Header with icon */}
					<div className="flex flex-col items-center sm:flex-row sm:items-center gap-4">
						<div className={cn(
							"w-16 h-16 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center",
							"bg-gradient-to-br from-pink-500 to-rose-500",
							"shadow-lg shadow-rose-500/30"
						)}>
							<Plus className="w-8 h-8 sm:w-7 sm:h-7 text-white" />
						</div>
						<div className="text-center sm:text-left">
							<MobileModalTitle className={cn(
								"text-2xl sm:text-xl",
								isDark ? "text-slate-100" : "text-slate-800"
							)}>
								{t('addword')}
							</MobileModalTitle>
							<p className={cn(
								"text-sm mt-1",
								isDark ? "text-slate-400" : "text-slate-500"
							)}>
								{t('add_word_subtitle') || 'Ajoutez un mot à votre dictionnaire'}
							</p>
						</div>
					</div>
				</MobileModalHeader>

				<form onSubmit={handleSubmit}>
					<div className="space-y-5 mt-2">
						{/* Learning language word */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<div className={cn(
									"w-8 h-8 rounded-lg flex items-center justify-center",
									"bg-gradient-to-br from-violet-500 to-purple-600"
								)}>
									<BookOpen className="w-4 h-4 text-white" />
								</div>
								<label className={cn(
									"font-semibold",
									isDark ? "text-slate-100" : "text-slate-800"
								)}>
									{t('word_in_learning_language', { lang: getLearningLanguageName() })}
								</label>
							</div>
							<Input
								value={learningLangWord}
								onChange={e => {
									setLearningLangWord(e.target.value)
									if (errors.learningLangWord) {
										setErrors({ ...errors, learningLangWord: null })
									}
								}}
								placeholder={`${t('example')}: ${userLearningLanguage === 'ru' ? 'привет' : 'bonjour'}`}
								required
								autoFocus
								disabled={addWordMutation.isPending}
								maxLength={200}
								className={cn(
									"h-14 sm:h-12 text-lg sm:text-base rounded-xl border-2",
									isDark
										? "bg-slate-800/60 border-slate-700 focus:border-violet-500"
										: "bg-white border-slate-200 focus:border-violet-500",
									errors.learningLangWord && "border-red-500"
								)}
							/>
							{errors.learningLangWord && (
								<p className="text-red-500 text-sm mt-1">{errors.learningLangWord}</p>
							)}
						</div>

						{/* Browser language word */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<div className={cn(
									"w-8 h-8 rounded-lg flex items-center justify-center",
									"bg-gradient-to-br from-pink-500 to-rose-500"
								)}>
									<BookOpen className="w-4 h-4 text-white" />
								</div>
								<label className={cn(
									"font-semibold",
									isDark ? "text-slate-100" : "text-slate-800"
								)}>
									{t('word_in_browser_language', { lang: getBrowserLanguageName() })}
								</label>
							</div>
							<Input
								value={browserLangWord}
								onChange={e => {
									setBrowserLangWord(e.target.value)
									if (errors.browserLangWord) {
										setErrors({ ...errors, browserLangWord: null })
									}
								}}
								placeholder={`${t('example')}: ${locale === 'fr' ? 'bonjour' : 'привет'}`}
								required
								disabled={addWordMutation.isPending}
								maxLength={200}
								className={cn(
									"h-14 sm:h-12 text-lg sm:text-base rounded-xl border-2",
									isDark
										? "bg-slate-800/60 border-slate-700 focus:border-pink-500"
										: "bg-white border-slate-200 focus:border-pink-500",
									errors.browserLangWord && "border-red-500"
								)}
							/>
							{errors.browserLangWord && (
								<p className="text-red-500 text-sm mt-1">{errors.browserLangWord}</p>
							)}
						</div>

						{/* Context sentence */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<div className={cn(
									"w-8 h-8 rounded-lg flex items-center justify-center",
									"bg-gradient-to-br from-emerald-500 to-teal-500"
								)}>
									<MessageSquare className="w-4 h-4 text-white" />
								</div>
								<label className={cn(
									"font-semibold",
									isDark ? "text-slate-100" : "text-slate-800"
								)}>
									{t('context_sentence_label')}
								</label>
								<span className={cn(
									"text-sm italic",
									isDark ? "text-slate-500" : "text-slate-400"
								)}>
									({t('optional')})
								</span>
							</div>
							<Textarea
								value={contextSentence}
								onChange={e => {
									setContextSentence(e.target.value)
									if (errors.contextSentence) {
										setErrors({ ...errors, contextSentence: null })
									}
								}}
								placeholder={t('context_sentence_placeholder')}
								disabled={addWordMutation.isPending}
								maxLength={500}
								rows={3}
								className={cn(
									"text-lg sm:text-base rounded-xl border-2 resize-none",
									isDark
										? "bg-slate-800/60 border-slate-700 focus:border-emerald-500"
										: "bg-white border-slate-200 focus:border-emerald-500",
									errors.contextSentence && "border-red-500"
								)}
							/>
							{errors.contextSentence ? (
								<p className="text-red-500 text-sm mt-1">{errors.contextSentence}</p>
							) : (
								<p className={cn(
									"text-sm mt-1",
									isDark ? "text-slate-500" : "text-slate-400"
								)}>
									{t('context_sentence_helper')}
								</p>
							)}
						</div>

						{/* Info box */}
						<div className={cn(
							"p-4 rounded-xl border",
							isDark
								? "bg-violet-500/10 border-violet-500/30"
								: "bg-violet-50 border-violet-200"
						)}>
							<p className={cn(
								"text-sm text-center",
								isDark ? "text-violet-300" : "text-violet-600"
							)}>
								{t('manual_add_info')}
							</p>
						</div>
					</div>

					<MobileModalFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={addWordMutation.isPending}
							className={cn(
								"w-full sm:w-auto font-semibold rounded-xl h-12 sm:h-10 border-2",
								isDark
									? "border-slate-700 text-slate-300 hover:bg-slate-800"
									: "border-slate-200 hover:bg-slate-50"
							)}
						>
							{t('cancel')}
						</Button>
						<Button
							type="submit"
							disabled={addWordMutation.isPending}
							className={cn(
								"w-full sm:w-auto px-8 rounded-xl font-bold h-14 sm:h-11 text-base sm:text-sm",
								"bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700",
								"shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50",
								"transition-all hover:-translate-y-0.5"
							)}
						>
							{addWordMutation.isPending ? (
								<>
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
									{t('add')}...
								</>
							) : (
								<>
									<Plus className="w-5 h-5 mr-2" />
									{t('add')}
								</>
							)}
						</Button>
					</MobileModalFooter>
				</form>
			</MobileModalContent>
		</MobileModal>
	)
}

export default AddWordModal
