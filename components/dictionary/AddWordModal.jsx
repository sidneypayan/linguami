'use client'

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
import { X, Plus, Loader2 } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
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
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className={cn(
				"sm:max-w-md rounded-2xl border-2",
				isDark
					? "bg-slate-900 border-violet-500/30"
					: "bg-white border-slate-200",
				"shadow-2xl"
			)}>
				<DialogHeader className="pb-4">
					<DialogTitle className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
							<Plus className="w-5 h-5 text-white" />
						</div>
						<span className={cn(
							"text-xl font-bold",
							isDark ? "text-slate-100" : "text-slate-800"
						)}>
							{t('addword')}
						</span>
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="space-y-5 py-2">
						{/* Champ pour le mot dans la langue d'apprentissage */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-violet-500 to-purple-600" />
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
									"h-12 text-base rounded-xl border-2",
									isDark
										? "bg-slate-800/60 border-violet-500/30 focus:border-violet-500"
										: "bg-white border-slate-200 focus:border-violet-500",
									errors.learningLangWord && "border-red-500"
								)}
							/>
							{errors.learningLangWord && (
								<p className="text-red-500 text-sm mt-1">{errors.learningLangWord}</p>
							)}
						</div>

						{/* Champ pour le mot dans la langue du navigateur */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-pink-400 to-rose-500" />
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
									"h-12 text-base rounded-xl border-2",
									isDark
										? "bg-slate-800/60 border-violet-500/30 focus:border-pink-500"
										: "bg-white border-slate-200 focus:border-pink-500",
									errors.browserLangWord && "border-red-500"
								)}
							/>
							{errors.browserLangWord && (
								<p className="text-red-500 text-sm mt-1">{errors.browserLangWord}</p>
							)}
						</div>

						{/* Champ optionnel pour la phrase de contexte */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
								<label className={cn(
									"font-semibold",
									isDark ? "text-slate-100" : "text-slate-800"
								)}>
									{t('context_sentence_label')}
								</label>
								<span className={cn(
									"text-sm italic",
									isDark ? "text-slate-400" : "text-slate-500"
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
								rows={2}
								className={cn(
									"text-base rounded-xl border-2 resize-none",
									isDark
										? "bg-slate-800/60 border-violet-500/30 focus:border-emerald-500"
										: "bg-white border-slate-200 focus:border-emerald-500",
									errors.contextSentence && "border-red-500"
								)}
							/>
							{errors.contextSentence ? (
								<p className="text-red-500 text-sm mt-1">{errors.contextSentence}</p>
							) : (
								<p className={cn(
									"text-sm mt-1",
									isDark ? "text-slate-400" : "text-slate-500"
								)}>
									{t('context_sentence_helper')}
								</p>
							)}
						</div>

						{/* Message d'information */}
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

					<DialogFooter className="pt-4 gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={addWordMutation.isPending}
							className={cn(
								"flex-1 sm:flex-none min-w-[120px] rounded-xl border-2 font-semibold",
								isDark
									? "border-violet-500/30 text-slate-300 hover:bg-violet-500/10"
									: "border-slate-200 hover:bg-slate-50"
							)}
						>
							{t('cancel')}
						</Button>
						<Button
							type="submit"
							disabled={addWordMutation.isPending}
							className={cn(
								"flex-1 sm:flex-none min-w-[140px] rounded-xl font-bold",
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
								t('add')
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default AddWordModal
