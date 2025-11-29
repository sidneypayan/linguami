'use client'

import { useState, useEffect } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import { validateWordPair } from '@/utils/validation'
import { updateWordAction } from '@/app/actions/update-word-action'
import toast from '@/utils/toast'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { X, Pencil, Loader2 } from 'lucide-react'
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

const EditWordModal = ({ open, onClose, word }) => {
	const t = useTranslations('words')
	const queryClient = useQueryClient()
	const params = useParams()
	const { isDark } = useThemeMode()
	const { user, userLearningLanguage } = useUserContext()
	const locale = params.locale

	// Initialize with word data
	const [learningLangWord, setLearningLangWord] = useState('')
	const [browserLangWord, setBrowserLangWord] = useState('')
	const [contextSentence, setContextSentence] = useState('')
	const [errors, setErrors] = useState({})

	// Populate fields when modal opens with word data
	useEffect(() => {
		if (open && word) {
			setLearningLangWord(word[`word_${userLearningLanguage}`] || '')
			setBrowserLangWord(word[`word_${locale}`] || '')
			setContextSentence(word.word_sentence || '')
			setErrors({})
		}
	}, [open, word, userLearningLanguage, locale])

	// React Query mutation for updating words
	const updateWordMutation = useMutation({
		mutationFn: updateWordAction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userWords', user?.id, userLearningLanguage] })
			toast.success('Traduction mise à jour avec succès.')
			handleClose()
		},
		onError: (error) => {
			logger.error('Error updating word:', error)
			toast.error('Une erreur est survenue lors de la mise à jour.')
		},
	})

	// Get language names for labels
	const getLearningLanguageName = () => {
		return userLearningLanguage === 'ru' ? t('language_ru') : t('language_fr')
	}

	const getBrowserLanguageName = () => {
		if (locale === 'fr') return t('language_fr')
		return t('language_ru')
	}

	const handleClose = () => {
		setLearningLangWord('')
		setBrowserLangWord('')
		setContextSentence('')
		setErrors({})
		onClose()
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setErrors({})

		if (!word) {
			toast.error('Aucun mot sélectionné')
			return
		}

		// Validation côté client
		const validation = validateWordPair({
			learningLangWord,
			browserLangWord,
			contextSentence,
		})

		if (!validation.isValid) {
			setErrors(validation.errors)
			return
		}

		// Call mutation with validated data
		updateWordMutation.mutate({
			wordId: word.id,
			originalWord: validation.sanitized.learningLangWord,
			translatedWord: validation.sanitized.browserLangWord,
			word_sentence: validation.sanitized.contextSentence || '',
			userLearningLanguage,
			locale,
		})
	}

	if (!word) return null

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
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
							<Pencil className="w-5 h-5 text-white" />
						</div>
						<span className={cn(
							"text-xl font-bold",
							isDark ? "text-slate-100" : "text-slate-800"
						)}>
							Modifier la traduction
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
								disabled={updateWordMutation.isPending}
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
								disabled={updateWordMutation.isPending}
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
								disabled={updateWordMutation.isPending}
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
					</div>

					<DialogFooter className="pt-4 gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={updateWordMutation.isPending}
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
							disabled={updateWordMutation.isPending}
							className={cn(
								"flex-1 sm:flex-none min-w-[140px] rounded-xl font-bold",
								"bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700",
								"shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50",
								"transition-all hover:-translate-y-0.5"
							)}
						>
							{updateWordMutation.isPending ? (
								<>
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
									Mise à jour...
								</>
							) : (
								'Enregistrer'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default EditWordModal
